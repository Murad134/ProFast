import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
    parseISO,
    startOfDay,
    startOfWeek,
    startOfMonth,
    startOfYear,
} from "date-fns";
const MyEarnings = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [filter, setFilter] = useState("overall"); // today, week, month, year, overall

    // Fetch all completed parcels for the rider
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["completedParcels", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/completedparcels?email=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    // Rider earning calculation per parcel
    const calculateRiderEarnings = (parcel) => {
        if (!parcel.DeliveryCost) return 0;
        return parcel.senderRegion === parcel.receiverRegion
            ? parcel.DeliveryCost * 0.8
            : parcel.DeliveryCost * 0.3;
    };

    // Filter parcels by date
    const filteredParcels = Array.isArray(data)
        ? data.filter((parcel) => {
            if (!parcel.delivered_at) return false;

            const deliveredDate = parseISO(parcel.delivered_at);
            const now = new Date();

            switch (filter) {
                case "today":
                    return deliveredDate >= startOfDay(now);

                case "week":
                    return deliveredDate >= startOfWeek(now, { weekStartsOn: 1 }); // Monday start

                case "month":
                    return deliveredDate >= startOfMonth(now);

                case "year":
                    return deliveredDate >= startOfYear(now);

                case "overall":
                default:
                    return true;
            }
        })
        : [];

    // Calculate totals
    const totalEarnings = filteredParcels.reduce((acc, p) => acc + calculateRiderEarnings(p), 0);
    const totalCashedOut = filteredParcels
        .filter((p) => p.cashout_status === "cashed_out")
        .reduce((acc, p) => acc + calculateRiderEarnings(p), 0);
    const totalPending = totalEarnings - totalCashedOut;

    if (isLoading) return <p>Loading earnings...</p>;
    if (isError) return <p>Error: {error.message}</p>;

    return (
        // <div className="p-4">
        //     <h2 className="text-2xl font-bold mb-4">My Earnings</h2>

        //     {/* Filter Buttons */}
        //     <div className="flex gap-2 mb-4">
        //         {["today", "week", "month", "year", "overall"].map((f) => (
        //             <button
        //                 key={f}
        //                 onClick={() => setFilter(f)}
        //                 className={`px-3 py-1 rounded font-semibold ${filter === f ? "bg-blue-600 text-white" : "bg-gray-200"
        //                     }`}
        //             >
        //                 {f.charAt(0).toUpperCase() + f.slice(1)}
        //             </button>
        //         ))}
        //     </div>

        //     {/* Totals */}
        //     <div className="grid grid-cols-3 gap-4 mb-6">
        //         <div className="p-4 bg-green-100 rounded text-center">
        //             <p className="text-gray-600 font-semibold">Total Earnings</p>
        //             <p className="text-2xl font-bold">{totalEarnings.toFixed(2)} ৳</p>
        //         </div>
        //         <div className="p-4 bg-blue-100 rounded text-center">
        //             <p className="text-gray-600 font-semibold">Cashed Out</p>
        //             <p className="text-2xl font-bold">{totalCashedOut.toFixed(2)} ৳</p>
        //         </div>
        //         <div className="p-4 bg-yellow-100 rounded text-center">
        //             <p className="text-gray-600 font-semibold">Pending</p>
        //             <p className="text-2xl font-bold">{totalPending.toFixed(2)} ৳</p>
        //         </div>
        //     </div>

        //     {/* Parcel Table */}
        //     <table className="w-full border-collapse">
        //         <thead>
        //             <tr className="bg-gray-200">
        //                 <th className="border px-2 py-1">Tracking ID</th>
        //                 <th className="border px-2 py-1">Parcel Name</th>
        //                 <th className="border px-2 py-1">Delivered At</th>
        //                 <th className="border px-2 py-1">Delivery Fee</th>
        //                 <th className="border px-2 py-1">Rider Earnings</th>
        //                 <th className="border px-2 py-1">Cashout Status</th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {filteredParcels.length > 0 ? (
        //                 filteredParcels.map((parcel) => {
        //                     const earning = calculateRiderEarnings(parcel);
        //                     return (
        //                         <tr key={parcel._id}>
        //                             <td className="border px-2 py-1">{parcel.trackingId}</td>
        //                             <td className="border px-2 py-1">{parcel.parcelName}</td>
        //                             <td className="border px-2 py-1">
        //                                 {parcel.delivered_at ? new Date(parcel.delivered_at).toLocaleString() : "N/A"}
        //                             </td>
        //                             <td className="border px-2 py-1">{parcel.DeliveryCost} Tk</td>
        //                             <td className="border px-2 py-1">{earning.toFixed(2)} Tk</td>
        //                             <td className="border px-2 py-1">
        //                                 {parcel.cashout_status === "cashed_out" ? (
        //                                     <span className="text-green-600 font-semibold">Cashed Out</span>
        //                                 ) : (
        //                                     <span className="text-yellow-600 font-semibold">Pending</span>
        //                                 )}
        //                             </td>
        //                         </tr>
        //                     );
        //                 })
        //             ) : (
        //                 <tr>
        //                     <td colSpan="6" className="text-center p-4">
        //                         No parcels found for selected filter.
        //                     </td>
        //                 </tr>
        //             )}
        //         </tbody>
        //     </table>
        // </div>

        <div className="px-2 py-4 md:p-6 mx-auto">

            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
                My Earnings
            </h2>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                {["today", "week", "month", "year", "overall"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm md:text-base font-semibold transition-all duration-200 
        ${filter === f
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-200 hover:bg-gray-300"}`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Totals Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

                <div className="p-5 bg-green-100 rounded-2xl text-center shadow-sm">
                    <p className="text-gray-600 font-semibold text-sm md:text-base">
                        Total Earnings
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-green-700">
                        {totalEarnings.toFixed(2)} ৳
                    </p>
                </div>

                <div className="p-2 bg-blue-100 rounded-2xl text-center shadow-sm">
                    <p className="text-gray-600 font-semibold text-sm md:text-base">
                        Cashed Out
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-blue-700">
                        {totalCashedOut.toFixed(2)} ৳
                    </p>
                </div>

                <div className="p-2 bg-yellow-100 rounded-2xl text-center shadow-sm">
                    <p className="text-gray-600 font-semibold text-sm md:text-base">
                        Pending
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-yellow-700">
                        {totalPending.toFixed(2)} ৳
                    </p>
                </div>

            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto rounded-xl shadow-sm border">
                <table className="min-w-[700px] w-full text-sm md:text-base">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-2 text-left">Tracking ID</th>
                            <th className="px-3 py-2 text-left">Parcel</th>
                            <th className="px-3 py-2 text-left">Delivered At</th>
                            <th className="px-3 py-2 text-left">Delivery Fee</th>
                            <th className="px-3 py-2 text-left">Earnings</th>
                            <th className="px-3 py-2 text-left">Cashout</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredParcels.length > 0 ? (
                            filteredParcels.map((parcel) => {
                                const earning = calculateRiderEarnings(parcel);
                                return (
                                    <tr
                                        key={parcel._id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="px-3 py-2">{parcel.trackingId}</td>
                                        <td className="px-3 py-2">{parcel.parcelName}</td>
                                        <td className="px-3 py-2">
                                            {parcel.delivered_at
                                                ? new Date(parcel.delivered_at).toLocaleString()
                                                : "N/A"}
                                        </td>
                                        <td className="px-3 py-2">
                                            {parcel.DeliveryCost} ৳
                                        </td>
                                        <td className="px-3 py-2 font-semibold">
                                            {earning.toFixed(2)} ৳
                                        </td>
                                        <td className="px-3 py-2">
                                            {parcel.cashout_status === "cashed_out" ? (
                                                <span className="text-green-600 font-semibold">
                                                    Cashed Out
                                                </span>
                                            ) : (
                                                <span className="text-yellow-600 font-semibold">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    No parcels found for selected filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyEarnings;
