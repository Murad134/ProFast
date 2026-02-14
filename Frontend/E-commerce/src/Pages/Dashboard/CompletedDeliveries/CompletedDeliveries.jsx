// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAuth from "../../../hooks/useAuth";
// import useAxiosSecure from '../../../hooks/useAxiosSecure'
// import {useQueryClient } from '@tanstack/react-query';

// import Swal from 'sweetalert2';
// const RiderCompletedDeliveries = () => {
//     const axiosSecure = useAxiosSecure();
//     const { user } = useAuth();
//     const queryClient = useQueryClient();
//     const [loadingCashOut, setLoadingCashOut] = useState(null);

//     // Fetch completed parcels
//     const { data, isLoading, isError, error } = useQuery({
//         queryKey: ["completedParcels", user?.email],
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/rider/completedparcels?email=${user.email}`);
//             return res.data;
//         },
//         enabled: !!user?.email,
//     });

//     // Rider earnings calculation per parcel
//     const calculateRiderEarnings = (parcel) => {
//         if (!parcel.DeliveryCost) return 0;
//         return parcel.senderRegion === parcel.receiverRegion
//             ? parcel.DeliveryCost * 0.8
//             : parcel.DeliveryCost * 0.3;
//     };

//     // Total earnings for all completed parcels
//     const totalEarnings = Array.isArray(data)
//         ? data.reduce((acc, parcel) => acc + calculateRiderEarnings(parcel), 0)
//         : 0;

//     // Cash out handler
//     const handleCashOutParcel = async (parcel) => {
//         const earning = calculateRiderEarnings(parcel);

//         const result = await Swal.fire({
//             title: `Cash Out ${parcel.parcelName}?`,
//             text: `You will receive ${earning.toFixed(2)} ৳`,
//             icon: 'question',
//             showCancelButton: true,
//             confirmButtonText: 'Yes, Cash Out',
//         });

//         if (result.isConfirmed) {
//             try {
//                 setLoadingCashOut(parcel._id);
//                 await axiosSecure.patch(`/parcels/${parcel._id}/cashout`);
//                 Swal.fire('Success', `Cash Out successful for ${parcel.parcelName}`, 'success');
//                 queryClient.invalidateQueries(["completedParcels", user.email]);
//             } catch (err) {
//                 Swal.fire('Error', err.response?.data?.message || 'Something went wrong', 'error');
//             } finally {
//                 setLoadingCashOut(null);
//             }
//         }
//     };

//     if (isLoading) return <p>Loading completed deliveries...</p>;
//     if (isError) return <p>Error: {error.message}</p>;

//     return (
//         <div className="p-4">
//             <h2 className="text-2xl font-bold mb-2">Completed Deliveries</h2>
//             <p className="mb-4 font-semibold">💵 Total Earnings: {totalEarnings.toFixed(2)} ৳</p>

//             <table className="w-full border-collapse">
//                 <thead>
//                     <tr className="bg-gray-200">
//                         <th className="border px-2 py-1">Tracking ID</th>
//                         <th className="border px-2 py-1">Parcel Name</th>
//                         <th className="border px-2 py-1">Type</th>
//                         <th className="border px-2 py-1">Sender</th>
//                         <th className="border px-2 py-1">Receiver</th>
//                         <th className="border px-2 py-1">Picked At</th>
//                         <th className="border px-2 py-1">Delivered At</th>
//                         <th className="border px-2 py-1">Delivery Fee</th>
//                         <th className="border px-2 py-1">Rider Earnings</th>
//                         <th className="border px-2 py-1">Cash Out</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {Array.isArray(data) && data.length > 0 ? (
//                         data.map((parcel) => {
//                             const riderEarning = calculateRiderEarnings(parcel);
//                             return (
//                                 <tr key={parcel._id}>
//                                     <td className="border px-2 py-1">{parcel.trackingId || parcel._id}</td>
//                                     <td className="border px-2 py-1">{parcel.parcelName}</td>
//                                     <td className="border px-2 py-1">{parcel.parcelType}</td>
//                                     <td className="border px-2 py-1">{parcel.senderName}</td>
//                                     <td className="border px-2 py-1">{parcel.receiverName}</td>
//                                     <td className="border px-2 py-1">
//                                         {parcel.pickupTime ? new Date(parcel.pickupTime).toLocaleString() : "N/A"}
//                                     </td>
//                                     <td className="border px-2 py-1">
//                                         {parcel.deliveredTime ? new Date(parcel.deliveredTime).toLocaleString() : "N/A"}
//                                     </td>
//                                     <td className="border px-2 py-1">{parcel.DeliveryCost || 0} Tk</td>
//                                     <td className="border px-2 py-1">{riderEarning.toFixed(2)} Tk</td>
//                                     <td className="border px-2 py-1">
//                                         <button
//                                             onClick={() => handleCashOutParcel(parcel)}
//                                             className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
//                                         >
//                                             Cash Out
//                                         </button>
//                                     </td>
//                                 </tr>
//                             )
//                         })
//                     ) : (
//                         <tr>
//                             <td colSpan="10" className="text-center p-4">
//                                 No completed deliveries found.
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default RiderCompletedDeliveries;



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
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-2">Completed Deliveries</h2>
            <p className="mb-4 font-semibold">💵 Total Earnings (not cashed out): {totalEarnings.toFixed(2)} ৳</p>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-2 py-1">Tracking ID</th>
                        <th className="border px-2 py-1">Parcel Name</th>
                        <th className="border px-2 py-1">Type</th>
                        <th className="border px-2 py-1">Sender</th>
                        <th className="border px-2 py-1">Receiver</th>
                        <th className="border px-2 py-1">Picked At</th>
                        <th className="border px-2 py-1">Delivered At</th>
                        <th className="border px-2 py-1">Delivery Fee</th>
                        <th className="border px-2 py-1">Rider Earnings</th>
                        <th className="border px-2 py-1">Cash Out</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(data) && data.length > 0 ? (
                        data.map(parcel => {
                            const riderEarning = calculateRiderEarnings(parcel);
                            const isCashedOut = parcel.cashout_status === 'cashed_out';
                            return (
                                <tr key={parcel._id} className={isCashedOut ? 'opacity-50' : ''}>
                                    <td className="border px-2 py-1">{parcel.trackingId || parcel._id}</td>
                                    <td className="border px-2 py-1">{parcel.parcelName}</td>
                                    <td className="border px-2 py-1">{parcel.parcelType}</td>
                                    <td className="border px-2 py-1">{parcel.senderName}</td>
                                    <td className="border px-2 py-1">{parcel.receiverName}</td>
                                    <td className="border px-2 py-1">{parcel.pickupTime ? new Date(parcel.pickupTime).toLocaleString() : "N/A"}</td>
                                    <td className="border px-2 py-1">{parcel.deliveredTime ? new Date(parcel.deliveredTime).toLocaleString() : "N/A"}</td>
                                    <td className="border px-2 py-1">{parcel.DeliveryCost || 0} Tk</td>
                                    <td className="border px-2 py-1">{riderEarning.toFixed(2)} Tk</td>
                                    <td className="border px-2 py-1">
                                        <button
                                            onClick={() => handleCashOutParcel(parcel)}
                                            disabled={isCashedOut}
                                            className={`px-3 py-1 rounded text-white ${isCashedOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                                        >
                                            {isCashedOut ? 'Cashed Out' : 'Cash Out'}
                                        </button>
                                    </td>
                                </tr>
                            )
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
    );
};

export default RiderCompletedDeliveries;
