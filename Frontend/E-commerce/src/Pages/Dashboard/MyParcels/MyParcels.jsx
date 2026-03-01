import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

function MyParcels() {

    const { user } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [, setParcels] = useState([]);

    const { data: parcels = [], isLoading, refetch } = useQuery({
        queryKey: ['myparcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        }
    });

    const handleView = (id) => {
        const parcel = parcels.find(p => p._id === id);
        if (!parcel) return;

        Swal.fire({
            title: `<span style="font-size: 1.25rem; font-weight: bold;">Parcel: ${parcel.parcelName}</span>`,
            html: `
            <div style="text-align: left; line-height: 1.6;">
                <p><strong>Type:</strong> ${parcel.parcelType}</p>
                <p><strong>Sender:</strong> ${parcel.senderName} (${parcel.senderPhone})</p>
                <p><strong>Pickup:</strong> ${parcel.senderRegion} / ${parcel.senderServiceCenter} / ${parcel.senderAddress}</p>
                <hr style="margin: 8px 0;" />
                <p><strong>Receiver:</strong> ${parcel.receiverName} (${parcel.receiverPhone})</p>
                <p><strong>Delivery:</strong> ${parcel.receiverRegion} / ${parcel.receiverServiceCenter} / ${parcel.receiverAddress}</p>
                <hr style="margin: 8px 0;" />
                <p><strong>Weight:</strong> ${parcel.parcelWeight} kg</p>
                <p><strong>Cost:</strong> TK ${parcel.DeliveryCost}</p>
                <p><strong>Payment Status:</strong> 
                    <span style="color: ${parcel.payment_status?.toLowerCase() === 'paid' ? 'green' : 'red'};">
                        ${parcel.payment_status}
                    </span>
                </p>
                <p><strong>Delivery Status:</strong> ${parcel.delivery_status}</p>
                <p><strong>Tracking ID:</strong> ${parcel.trackingId}</p>
            </div>
        `,
            confirmButtonText: 'Close',
            width: '650px',
            padding: '20px',
            showCloseButton: true,
            focusConfirm: false,
            background: '#f9f9f9',
            customClass: {
                popup: 'shadow-lg rounded-lg'
            }
        });
    };

    const handlePay = (id) => {
        console.log('Pay parcel:', id);
        navigate(`/dashboard/payment/${id}`);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/parcels/${id}`);

                if (res.data.deletedCount) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your parcel has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#4f46e5'
                    });

                    refetch();
                    setParcels(prev => prev.filter(p => p._id !== id));
                } else {
                    Swal.fire({
                        title: 'Failed!',
                        text: 'Parcel could not be deleted.',
                        icon: 'error',
                        confirmButtonColor: '#4f46e5'
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error.message,
                    icon: 'error',
                    confirmButtonColor: '#4f46e5'
                });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">
                My Parcels ({parcels.length})
            </h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Created At</th>
                            <th>Cost</th>
                            <th>Payment</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {parcels.map((parcel, index) => (
                            <tr key={parcel._id}>
                                <td>{index + 1}</td>
                                <td>{parcel.parcelName}</td>
                                <td>
                                    <span className="badge badge-outline">
                                        {parcel.parcelType === 'Document'
                                            ? 'Document'
                                            : 'Non-Document'}
                                    </span>
                                </td>
                                <td>{new Date(parcel.created_at).toLocaleDateString()}</td>
                                <td>TK {parcel.DeliveryCost}</td>
                                <td>
                                    {/* ✅ UPDATED: Better payment status display with proper capitalization check */}
                                    <span
                                        className={`badge ${parcel.payment_status?.toLowerCase() === 'paid'
                                            ? 'badge-success' // ✅ Green for Paid
                                            : 'badge-error'   // Red for unpaid
                                            }`}
                                    >
                                        {parcel.payment_status || 'unpaid'} {/* ✅ Show actual status */}
                                    </span>
                                    
                                </td>
                                <td className="space-x-2">
                                    <button
                                        className="btn btn-xs btn-info"
                                        onClick={() => handleView(parcel._id)}
                                    >
                                        View
                                    </button>

                                    {/* ✅ UPDATED: Check for both 'unpaid' and 'Paid' (case-insensitive) */}
                                    {parcel.payment_status?.toLowerCase() !== 'paid' && (
                                        <button
                                            className="btn btn-xs btn-success"
                                            onClick={() => handlePay(parcel._id)}
                                        >
                                            Pay
                                        </button>
                                    )}

                                    {/* ✅ UPDATED: Only allow delete if not paid */}
                                    {parcel.payment_status?.toLowerCase() !== 'paid' && (
                                        <button
                                            className="btn btn-xs btn-error"
                                            onClick={() => handleDelete(parcel._id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {parcels.length === 0 && (
                    <p className="text-center text-gray-500 mt-6">No parcels found</p>
                )}
            </div>
        </div>
    );
}
export default MyParcels;