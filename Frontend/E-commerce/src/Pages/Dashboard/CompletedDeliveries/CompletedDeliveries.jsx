

import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const RiderCompletedDeliveries = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch completed parcels
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["completedParcels", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/completedparcels?email=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    const calculateRiderEarnings = (parcel) => {
        if (!parcel.DeliveryCost) return 0;
        return parcel.senderRegion === parcel.receiverRegion
            ? parcel.DeliveryCost * 0.8
            : parcel.DeliveryCost * 0.3;
    };

    const totalEarnings = Array.isArray(data)
        ? data.reduce((acc, parcel) => acc + (!parcel.cashout_status ? calculateRiderEarnings(parcel) : 0), 0)
        : 0;

    const handleCashOutParcel = async (parcel) => {
        const earning = calculateRiderEarnings(parcel);

        const result = await Swal.fire({
            title: `Cash Out ${parcel.parcelName}?`,
            text: `You will receive ${earning.toFixed(2)} ৳`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Cash Out',
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.patch(`/parcels/${parcel._id}/cashout`);
                Swal.fire('Success', `Cash Out successful for ${parcel.parcelName}`, 'success');
                queryClient.invalidateQueries(["completedParcels", user.email]);
            } catch (err) {
                Swal.fire('Error', err.response?.data?.message || 'Something went wrong', 'error');
            }
        }
    };

    if (isLoading) return <p>Loading completed deliveries...</p>;
    if (isError) return <p>Error: {error.message}</p>;

    return (
        // <div className="p-4">
        //     <h2 className="text-2xl font-bold mb-2">Completed Deliveries</h2>
        //     <p className="mb-4 font-semibold">💵 Total Earnings (not cashed out): {totalEarnings.toFixed(2)} ৳</p>

        //     <table className="w-full border-collapse">
        //         <thead>
        //             <tr className="bg-gray-200">
        //                 <th className="border px-2 py-1">Tracking ID</th>
        //                 <th className="border px-2 py-1">Parcel Name</th>
        //                 <th className="border px-2 py-1">Type</th>
        //                 <th className="border px-2 py-1">Sender</th>
        //                 <th className="border px-2 py-1">Receiver</th>
        //                 <th className="border px-2 py-1">Picked At</th>
        //                 <th className="border px-2 py-1">Delivered At</th>
        //                 <th className="border px-2 py-1">Delivery Fee</th>
        //                 <th className="border px-2 py-1">Rider Earnings</th>
        //                 <th className="border px-2 py-1">Cash Out</th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {Array.isArray(data) && data.length > 0 ? (
        //                 data.map(parcel => {
        //                     const riderEarning = calculateRiderEarnings(parcel);
        //                     const isCashedOut = parcel.cashout_status === 'cashed_out';
        //                     return (
        //                         <tr key={parcel._id} className={isCashedOut ? 'opacity-50' : ''}>
        //                             <td className="border px-2 py-1">{parcel.trackingId || parcel._id}</td>
        //                             <td className="border px-2 py-1">{parcel.parcelName}</td>
        //                             <td className="border px-2 py-1">{parcel.parcelType}</td>
        //                             <td className="border px-2 py-1">{parcel.senderName}</td>
        //                             <td className="border px-2 py-1">{parcel.receiverName}</td>
        //                             <td className="border px-2 py-1">{parcel.pickupTime ? new Date(parcel.pickupTime).toLocaleString() : "N/A"}</td>
        //                             <td className="border px-2 py-1">{parcel.deliveredTime ? new Date(parcel.deliveredTime).toLocaleString() : "N/A"}</td>
        //                             <td className="border px-2 py-1">{parcel.DeliveryCost || 0} Tk</td>
        //                             <td className="border px-2 py-1">{riderEarning.toFixed(2)} Tk</td>
        //                             <td className="border px-2 py-1">
        //                                 <button
        //                                     onClick={() => handleCashOutParcel(parcel)}
        //                                     disabled={isCashedOut}
        //                                     className={`px-3 py-1 rounded text-white ${isCashedOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
        //                                 >
        //                                     {isCashedOut ? 'Cashed Out' : 'Cash Out'}
        //                                 </button>
        //                             </td>
        //                         </tr>
        //                     )
        //                 })
        //             ) : (
        //                 <tr>
        //                     <td colSpan="10" className="text-center p-4">
        //                         No completed deliveries found.
        //                     </td>
        //                 </tr>
        //             )}
        //         </tbody>
        //     </table>
        // </div>

        <div className="p-4">
            <h2 className="text-2xl font-bold mb-2">Completed Deliveries</h2>
            <p className="mb-4 font-semibold">
                💵 Total Earnings (not cashed out): {totalEarnings.toFixed(2)} ৳
            </p>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-sm">
                            <th className="border px-2 py-2">Tracking ID</th>
                            <th className="border px-2 py-2">Parcel</th>
                            <th className="border px-2 py-2">Type</th>
                            <th className="border px-2 py-2">Sender</th>
                            <th className="border px-2 py-2">Receiver</th>
                            <th className="border px-2 py-2">Picked</th>
                            <th className="border px-2 py-2">Delivered</th>
                            <th className="border px-2 py-2">Fee</th>
                            <th className="border px-2 py-2">Earnings</th>
                            <th className="border px-2 py-2">Cash Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map(parcel => {
                                const riderEarning = calculateRiderEarnings(parcel);
                                const isCashedOut = parcel.cashout_status === "cashed_out";

                                return (
                                    <tr key={parcel._id} className={isCashedOut ? "opacity-50" : ""}>
                                        <td className="border px-2 py-2">{parcel.trackingId || parcel._id}</td>
                                        <td className="border px-2 py-2">{parcel.parcelName}</td>
                                        <td className="border px-2 py-2">{parcel.parcelType}</td>
                                        <td className="border px-2 py-2">{parcel.senderName}</td>
                                        <td className="border px-2 py-2">{parcel.receiverName}</td>
                                        <td className="border px-2 py-2">
                                            {parcel.pickupTime ? new Date(parcel.pickupTime).toLocaleString() : "N/A"}
                                        </td>
                                        <td className="border px-2 py-2">
                                            {parcel.deliveredTime ? new Date(parcel.deliveredTime).toLocaleString() : "N/A"}
                                        </td>
                                        <td className="border px-2 py-2">{parcel.DeliveryCost || 0} Tk</td>
                                        <td className="border px-2 py-2">{riderEarning.toFixed(2)} Tk</td>
                                        <td className="border px-2 py-2">
                                            <button
                                                onClick={() => handleCashOutParcel(parcel)}
                                                disabled={isCashedOut}
                                                className={`px-3 py-1 rounded text-white ${isCashedOut
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-green-500 hover:bg-green-600"
                                                    }`}
                                            >
                                                {isCashedOut ? "Cashed Out" : "Cash Out"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center p-4">
                                    No completed deliveries found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {Array.isArray(data) && data.length > 0 ? (
                    data.map(parcel => {
                        const riderEarning = calculateRiderEarnings(parcel);
                        const isCashedOut = parcel.cashout_status === "cashed_out";

                        return (
                            <div
                                key={parcel._id}
                                className={`border rounded-lg p-4 shadow ${isCashedOut ? "opacity-50" : ""
                                    }`}
                            >
                                <p><span className="font-semibold">Tracking:</span> {parcel.trackingId || parcel._id}</p>
                                <p><span className="font-semibold">Parcel:</span> {parcel.parcelName}</p>
                                <p><span className="font-semibold">Type:</span> {parcel.parcelType}</p>
                                <p><span className="font-semibold">Sender:</span> {parcel.senderName}</p>
                                <p><span className="font-semibold">Receiver:</span> {parcel.receiverName}</p>
                                <p>
                                    <span className="font-semibold">Delivered:</span>{" "}
                                    {parcel.deliveredTime
                                        ? new Date(parcel.deliveredTime).toLocaleString()
                                        : "N/A"}
                                </p>
                                <p><span className="font-semibold">Fee:</span> {parcel.DeliveryCost || 0} Tk</p>
                                <p><span className="font-semibold">Earnings:</span> {riderEarning.toFixed(2)} Tk</p>

                                <button
                                    onClick={() => handleCashOutParcel(parcel)}
                                    disabled={isCashedOut}
                                    className={`mt-3 w-full px-3 py-2 rounded text-white ${isCashedOut
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-green-500 hover:bg-green-600"
                                        }`}
                                >
                                    {isCashedOut ? "Cashed Out" : "Cash Out"}
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center">No completed deliveries found.</p>
                )}
            </div>
        </div>
    );
};

export default RiderCompletedDeliveries;
