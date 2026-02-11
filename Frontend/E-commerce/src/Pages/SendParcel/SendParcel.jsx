import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';
import { useLoaderData } from 'react-router';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from "react-router-dom";

const generateTrackingId = () => {
    const date = new Date();

    const datepart = date
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "");

    const rand = Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase();

    return `PCL-${datepart}-${rand}`;
}

const ParcelDeliveryForm = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData,] = useState(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm();

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const serviceCenters = useLoaderData();
    // extract unique regions
    const uniqueRegions = [...new Set(serviceCenters.map((w) => w.region))];

    // Get districts by region
    const getDistrictsByRegion = (region) =>
        serviceCenters.filter((w) => w.region === region).map((w) => w.district);

    const senderRegion = watch('senderRegion');
    const receiverRegion = watch('receiverRegion');

    const senderDistricts = getDistrictsByRegion(senderRegion);
    const receiverDistricts = getDistrictsByRegion(receiverRegion);

    const handleConfirmBooking = () => {
        console.log('Booking Confirmed:', formData);
        alert('Booking confirmed successfully!');
        setShowModal(false);
        reset();
    };

    const calculateDeliveryCost = (data) => {
        const { parcelType, parcelWeight, senderServiceCenter, receiverServiceCenter } = data;

        const isWithinCity = senderServiceCenter === receiverServiceCenter;

        let breakdown = [];
        let total = 0;

        // Document
        if (parcelType === 'Documents') {
            const cost = isWithinCity ? 60 : 80;

            breakdown.push({
                label: 'Document Delivery Charge',
                amount: cost,
            });

            total = cost;
        }
        // Non-Document
        else {
            const weight = parseFloat(parcelWeight);

            const baseCost = isWithinCity ? 110 : 150;
            breakdown.push({
                label: 'Base Charge (up to 3kg)',
                amount: baseCost,
            });

            total += baseCost;

            if (weight > 3) {
                const extraKg = Math.ceil(weight - 3);
                const extraCost = extraKg * 40;

                breakdown.push({
                    label: `Extra Weight (${extraKg} kg × 40 Tk)`,
                    amount: extraCost,
                });

                total += extraCost;
            }

            if (!isWithinCity) {
                breakdown.push({
                    label: 'Outside City Surcharge',
                    amount: 40,
                });

                total += 40;
            }
        }

        return { total, breakdown };
    };
    const selectedParcelType = watch('parcelType');
    const onSubmit = (data) => {
        const { total, breakdown } = calculateDeliveryCost(data);

        const breakdownHTML = breakdown
            .map(
                item => `
            <div style="display:flex; justify-content:space-between; margin-bottom:6px">
                <span>${item.label}</span>
                <strong>${item.amount} Tk</strong>
            </div>
        `
            )
            .join('');

        Swal.fire({
            title: 'Confirm Booking',
            html: `
            <div style="text-align:left; font-size:15px">
                ${breakdownHTML}
                <hr />
                <div style="display:flex; justify-content:space-between; font-size:18px; color:#4f46e5">
                    <strong>Total Payable</strong>
                    <strong>${total} Tk</strong>
                </div>
            </div>
        `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Proceed to Payment',
            cancelButtonText: 'Edit Details',
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#6b7280',
        }).then((result) => {
            if (result.isConfirmed) {
                const finalData = {
                    ...data,
                    DeliveryCost: total,
                    // created_by: user.email(),
                    payment_status: 'unpaid',
                    delivery_status: 'not_collected',
                    creation_date: new Date().toISOString(),
                    trackingId: generateTrackingId(),

                };

                console.log('Proceeding to payment with data:', finalData);

                // Send data to server
                axiosSecure.post('/parcels', finalData)
                    .then(response => {
                        if (response.data.insertedId) {

                            // TODO: redirect to a payment parcel
                            Swal.fire({
                                title: 'Redirecting to Payment',
                                text: 'Please complete your payment.',
                                icon: 'success',
                                confirmButtonColor: '#4f46e5',
                            });
                            navigate('/dashboard/myparcels')
                        }
                        console.log('Server Response:', response.data);
                    })


                reset();

            }
            // else → user goes back to editing automatically
        });
    };

    return (
        <div className="min-h-screen  from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <Toaster />
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">
                        📦 Parcel Delivery Service
                    </h1>
                    <p className="text-base text-gray-600 sm:text-lg">
                        Fill in the details to send your parcel
                    </p>
                </header>

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 lg:p-10">
                    <div className="space-y-8">
                        <section className='border border-blue-500 pl-6 bg-blue-50/40 rounded-lg py-4'>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
                                Parcel Information
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <div>
                                        <label htmlFor="parcelName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Parcel Description <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="parcelName"
                                            type="text"
                                            placeholder="Brief description of the item"
                                            className={`block w-full rounded-lg border ${errors.parcelName ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-150`}
                                            {...register('parcelName', { required: 'Parcel description is required' })}
                                        />
                                        {errors.parcelName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.parcelName.message}</p>
                                        )}
                                    </div>
                                </div>
                                {/* Parcel Type - Radio Buttons */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Parcel Type <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                        <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${errors.parcelType ? 'border-red-500' : 'border-gray-300'
                                            } hover:border-indigo-400 hover:shadow-md`}>
                                            <input
                                                type="radio"
                                                value="Documents"
                                                className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                                {...register('parcelType', { required: 'Parcel type is required' })}
                                            />
                                            <span className="ml-3 text-sm font-medium text-gray-900">📄 Documents</span>
                                        </label>

                                        <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${errors.parcelType ? 'border-red-500' : 'border-gray-300'
                                            } hover:border-indigo-400 hover:shadow-md`}>
                                            <input
                                                type="radio"
                                                value="Other"
                                                className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                                {...register('parcelType', { required: 'Parcel type is required' })}
                                            />
                                            <span className="ml-3 text-sm font-medium text-gray-900">📦 Not Documents</span>
                                        </label>
                                    </div>
                                    {errors.parcelType && (
                                        <p className="mt-2 text-sm text-red-600">{errors.parcelType.message}</p>
                                    )}
                                </div>

                                {/* Parcel Name and Weight */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {/* Parcel Name */}
                                    {/* Parcel Weight - Only show for "Other" (Not Documents) */}
                                    {selectedParcelType === 'Other' && (
                                        <div>
                                            <label htmlFor="parcelWeight" className="block text-sm font-medium text-gray-700 mb-2">
                                                Parcel Weight (kg) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="parcelWeight"
                                                type="number"
                                                step="0.1"
                                                placeholder="e.g., 2.5"
                                                className={`block w-full rounded-lg border ${errors.parcelWeight ? 'border-red-500' : 'border-gray-300'
                                                    } px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-150`}
                                                {...register('parcelWeight', {
                                                    required: selectedParcelType === 'Other' ? 'Weight is required' : false,
                                                    min: { value: 0.1, message: 'Weight must be at least 0.1 kg' }
                                                })}
                                            />
                                            {errors.parcelWeight && (
                                                <p className="mt-1 text-sm text-red-600">{errors.parcelWeight.message}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Sender and Receiver Information */}
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                            {/* Sender Information */}
                            <section className='border border-green-500 pl-6 bg-green-50/40 rounded-lg py-4'>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-green-500">
                                    Sender Information
                                </h2>
                                <div className="space-y-4">
                                    {/* Sender Name */}
                                    <div>
                                        <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="senderName"
                                            type="text"
                                            placeholder="Sender's full name"
                                            className={`block w-full rounded-lg border ${errors.senderName ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-150`}
                                            {...register('senderName', { required: 'Sender name is required' })}
                                        />
                                        {errors.senderName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.senderName.message}</p>
                                        )}
                                    </div>

                                    {/* Sender Phone */}
                                    <div>
                                        <label htmlFor="senderPhone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="senderPhone"
                                            type="tel"
                                            placeholder="01XXXXXXXXX"
                                            className={`block w-full rounded-lg border ${errors.senderPhone ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-150`}
                                            {...register('senderPhone', {
                                                required: 'Phone number is required',
                                                pattern: {
                                                    value: /^[0-9]{11}$/,
                                                    message: 'Enter a valid 11-digit phone number'
                                                }
                                            })}
                                        />
                                        {errors.senderPhone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.senderPhone.message}</p>
                                        )}
                                    </div>

                                    {/* Sender Region */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Region <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className={`block w-full rounded-lg border ${errors.senderRegion ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5`}
                                            {...register('senderRegion', { required: 'Region is required' })}
                                        >
                                            <option value="">Select Region</option>
                                            {uniqueRegions.map(region => (
                                                <option key={region} value={region}>{region}</option>
                                            ))}
                                        </select>
                                        {errors.senderRegion && (
                                            <p className="text-sm text-red-600">{errors.senderRegion.message}</p>
                                        )}
                                    </div>
                                    {/* Sender Service Center */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Service Center <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className={`block w-full rounded-lg border text-black ${errors.senderServiceCenter ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5`}
                                            {...register('senderServiceCenter', { required: 'Service center is required' })}
                                        >
                                            <option value="">Select Service Center</option>
                                            {senderDistricts.map(district => (
                                                <option key={district} value={district}>{district}</option>
                                            ))}

                                        </select>
                                        {errors.senderServiceCenter && (
                                            <p className="text-sm text-red-600">{errors.senderServiceCenter.message}</p>
                                        )}
                                    </div>

                                    {/* Sender Address */}
                                    <div>
                                        <label htmlFor="senderAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="senderAddress"
                                            rows="3"
                                            placeholder="Complete address with landmarks"
                                            className={`block w-full rounded-lg border ${errors.senderAddress ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-150 resize-none`}
                                            {...register('senderAddress', { required: 'Address is required' })}
                                        ></textarea>
                                        {errors.senderAddress && (
                                            <p className="mt-1 text-sm text-red-600">{errors.senderAddress.message}</p>
                                        )}
                                    </div>

                                    {/* Pickup Instructions */}
                                    <div>
                                        <label htmlFor="pickupInstruction" className="block text-sm font-medium text-gray-700 mb-2">
                                            Pickup Instructions <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="pickupInstruction"
                                            rows="2"
                                            placeholder="e.g., Call before arrival"
                                            className={`block w-full rounded-lg border ${errors.pickupInstruction ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-150 resize-none`}
                                            {...register('pickupInstruction', { required: 'Pickup instructions are required' })}
                                        ></textarea>
                                        {errors.pickupInstruction && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pickupInstruction.message}</p>
                                        )}
                                    </div>
                                </div>
                            </section>
                            {/* Receiver Information */}
                            <section className='border border-purple-500 pl-6 bg-purple-50/40 rounded-lg py-4'>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-purple-500">
                                    Receiver Information
                                </h2>
                                <div className="space-y-4">
                                    {/* Receiver Name */}
                                    <div>
                                        <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="receiverName"
                                            type="text"
                                            placeholder="Receiver's full name"
                                            className={`block w-full rounded-lg border ${errors.receiverName ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition duration-150`}
                                            {...register('receiverName', { required: 'Receiver name is required' })}
                                        />
                                        {errors.receiverName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.receiverName.message}</p>
                                        )}
                                    </div>
                                    {/* Receiver Phone */}
                                    <div>
                                        <label htmlFor="receiverPhone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="receiverPhone"
                                            type="tel"
                                            placeholder="01XXXXXXXXX"
                                            className={`block w-full rounded-lg border ${errors.receiverPhone ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition duration-150`}
                                            {...register('receiverPhone', {
                                                required: 'Phone number is required',
                                                pattern: {
                                                    value: /^[0-9]{11}$/,
                                                    message: 'Enter a valid 11-digit phone number'
                                                }
                                            })}
                                        />
                                        {errors.receiverPhone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.receiverPhone.message}</p>
                                        )}
                                    </div>
                                    {/* Receiver Region */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Region <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className={`block w-full rounded-lg border ${errors.receiverRegion ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5`}
                                            {...register('receiverRegion', { required: 'Region is required' })}
                                        >
                                            <option value="">Select Region</option>
                                            {uniqueRegions.map(region => (
                                                <option key={region} value={region}>{region}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Receiver Service Center */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Service Center <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            className={`block w-full rounded-lg border ${errors.receiverServiceCenter ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5`}
                                            {...register('receiverServiceCenter', { required: 'Service center is required' })}
                                        >
                                            <option value="">Select Service Center</option>
                                            {receiverDistricts.map(district => (
                                                <option key={district} value={district}>{district}</option>
                                            ))}

                                        </select>
                                    </div>
                                    {/* Receiver Address */}
                                    <div>
                                        <label htmlFor="receiverAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="receiverAddress"
                                            rows="3"
                                            placeholder="Complete address with landmarks"
                                            className={`block w-full rounded-lg border ${errors.receiverAddress ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition duration-150 resize-none`}
                                            {...register('receiverAddress', { required: 'Address is required' })}
                                        ></textarea>
                                        {errors.receiverAddress && (
                                            <p className="mt-1 text-sm text-red-600">{errors.receiverAddress.message}</p>
                                        )}
                                    </div>
                                    {/* Delivery Instructions */}
                                    <div>
                                        <label htmlFor="deliveryInstruction" className="block text-sm font-medium text-gray-700 mb-2">
                                            Delivery Instructions <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="deliveryInstruction"
                                            rows="2"
                                            placeholder="e.g., Ring doorbell, Leave at gate"
                                            className={`block w-full rounded-lg border ${errors.deliveryInstruction ? 'border-red-500' : 'border-gray-300'
                                                } px-4 py-2.5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition duration-150 resize-none`}
                                            {...register('deliveryInstruction', { required: 'Delivery instructions are required' })}
                                        ></textarea>
                                        {errors.deliveryInstruction && (
                                            <p className="mt-1 text-sm text-red-600">{errors.deliveryInstruction.message}</p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                        {/* Submit Button */}
                        <div className="flex justify-center pt-6">
                            <button
                                type="submit"
                                onClick={handleSubmit(onSubmit)}
                                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200 transform hover:scale-105"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
                {/* Confirmation Modal */}
                {showModal && formData && (
                    <div
                        className="fixed inset-0 z-50 overflow-y-auto"
                        aria-labelledby="modal-title"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Background overlay */}
                        <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                            <div
                                className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
                                onClick={() => setShowModal(false)}
                            ></div>
                            {/* Modal panel */}
                            <div className="relative inline-block transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                                <div className="bg-white px-6 py-6 sm:px-8 sm:py-8">
                                    <h3 className="text-3xl font-bold text-gray-900 mb-6" id="modal-title">
                                        Confirm Booking
                                    </h3>
                                    <div className="space-y-6">
                                        {/* Parcel Details */}

                                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                                            <h4 className="font-semibold text-lg text-indigo-900 mb-3">Parcel Details</h4>
                                            <dl className="space-y-1">
                                                <div className="flex flex-wrap">
                                                    <dt className="font-medium text-gray-700 mr-2">Type:</dt>
                                                    <dd className="text-gray-900">{formData.parcelType}</dd>
                                                </div>
                                                <div className="flex flex-wrap">
                                                    <dt className="font-medium text-gray-700 mr-2">Description:</dt>
                                                    <dd className="text-gray-900">{formData.parcelName}</dd>
                                                </div>
                                                <div className="flex flex-wrap">
                                                    <dt className="font-medium text-gray-700 mr-2">Weight:</dt>
                                                    <dd className="text-gray-900">{formData.parcelWeight} kg</dd>
                                                </div>
                                            </dl>
                                        </div>
                                        {/* Sender Details */}

                                        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                                            <h4 className="font-semibold text-lg text-green-900 mb-3">Sender Details</h4>
                                            <dl className="space-y-1">
                                                <div className="flex flex-wrap">
                                                    <dt className="font-medium text-gray-700 mr-2">Name:</dt>
                                                    <dd className="text-gray-900">{formData.senderName}</dd>
                                                </div>
                                                <div className="flex flex-wrap">
                                                    <dt className="font-medium text-gray-700 mr-2">Phone:</dt>
                                                    <dd className="text-gray-900">{formData.senderPhone}</dd>
                                                </div>
                                                <div className="flex flex-wrap">
                                                    <dt className="font-medium text-gray-700 mr-2">District:</dt>
                                                    <dd className="text-gray-900">{formData.senderDistrict}</dd>
                                                </div>
                                                <div className="flex flex-wrap">
                                                    <dt className="font-medium text-gray-700 mr-2">Address:</dt>
                                                    <dd className="text-gray-900">{formData.senderAddress}</dd>
                                                </div>
                                                <div className="flex flex-wrap">
                                                    <dt className="font-medium text-gray-700 mr-2">Pickup:</dt>
                                                    <dd className="text-gray-900 ">{formData.pickupInstruction}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                        {/* Receiver Details */}

                                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                                            <h4 className="font-semibold text-lg text-purple-900 mb-3">Receiver Details</h4>
                                            <dl className="space-y-1">
                                                <div className="flex flex-wrap">
                                                    <dt className="font-medium text-gray-700 mr-2">Name:</dt>
                                                    <dd className="text-gray-900">{formData.receiverName}</dd>
                                                </div>
                                                <div className="flex flex-wrap">
                                                    <dt className="font-medium text-gray-700 mr-2">Phone:</dt>
                                                    <dd className="text-gray-900">{formData.receiverPhone}</dd>
                                                </div>
                                                <div className="flex flex-wrap">
                                                    <dt className="font-medium text-gray-700 mr-2">District:</dt>
                                                    <dd className="text-gray-900">{formData.receiverDistrict}</dd>
                                                </div>
                                                <div className="flex flex-wrap">
                                                    <dt className="font-medium text-gray-700 mr-2">Address:</dt>
                                                    <dd className="text-gray-900">{formData.receiverAddress}</dd>
                                                </div>
                                                <div className="flex flex-wrap">
                                                    <dt className="font-medium text-gray-700 mr-2">Delivery:</dt>
                                                    <dd className="text-gray-900">{formData.deliveryInstruction}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                {/* Modal Actions */}

                                <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse sm:px-8">
                                    <button
                                        type="submit"
                                        onClick={handleConfirmBooking}
                                        className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200 sm:ml-3 sm:w-auto"
                                    >
                                        Confirm Booking
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={() => setShowModal(false)}
                                        className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-6 py-3 font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 sm:mt-0 sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};
export default ParcelDeliveryForm;