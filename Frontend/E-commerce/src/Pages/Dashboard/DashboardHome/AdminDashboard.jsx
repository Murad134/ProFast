// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
// import {
//     PieChart,
//     Pie,
//     Tooltip,
//     Legend,
//     ResponsiveContainer
// } from 'recharts';
// import { FaBoxOpen, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaWarehouse, FaExclamationTriangle } from 'react-icons/fa';

// const statusIconConfig = {
//     delivered: <FaCheckCircle className="text-4xl text-green-600" />,
//     pending: <FaHourglassHalf className="text-4xl text-yellow-500" />,
//     cancelled: <FaTimesCircle className="text-4xl text-red-600" />,
//     service_center_delivered: <FaWarehouse className="text-4xl text-blue-600" />
// };

// // Optional background colors for cards
// const statusBgConfig = {
//     delivered: 'bg-green-50',
//     pending: 'bg-yellow-50',
//     cancelled: 'bg-red-50',
//     service_center_delivered: 'bg-blue-50'
// };

// const AdminDashboardHome = () => {
//     const axiosSecure = useAxiosSecure();

//     const { data: deliveryStats = [], isLoading, isError, error } = useQuery({
//         queryKey: ['delivery-status-stats'],
//         queryFn: async () => {
//             const res = await axiosSecure.get('/parcels/delivery/status-count');
//             return res.data;
//         }
//     });

//     // Prepare PieChart data safely
//     const pieData = deliveryStats
//         .filter(item => item && item.status && typeof item.count === 'number')
//         .map(item => ({ name: item.status.replace(/_/g, ' '), value: item.count }));

//     // ---------- Loading State ----------
//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <span className="loading loading-spinner loading-lg"></span>
//             </div>
//         );
//     }

//     // ---------- Error State ----------
//     if (isError) {
//         return (
//             <div className="alert alert-error shadow-md m-4 flex items-center gap-2">
//                 <FaExclamationTriangle className="text-xl" />
//                 <span>{error?.message || "Failed to load parcel status data"}</span>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-10 p-6">
//             <h2 className="text-4xl font-extrabold flex items-center gap-3 text-gray-800">
//                 <FaBoxOpen className="text-blue-600" /> Admin Dashboard
//             </h2>

//             {/* ---------- Stats Cards ---------- */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {deliveryStats.map((stat, index) => {
//                     const safeStatus = stat.status || 'Unknown';
//                     const safeCount = typeof stat.count === 'number' ? stat.count : 0;

//                     return (
//                         <div
//                             key={index}
//                             className={`card shadow-lg rounded-xl p-5 flex flex-row items-center gap-4 transition transform hover:-translate-y-1 hover:shadow-2xl ${statusBgConfig[stat.status] || 'bg-base-100'
//                                 }`}
//                         >
//                             <div className="flex-shrink-0">{statusIconConfig[stat.status] || <FaBoxOpen className="text-4xl text-gray-600" />}</div>
//                             <div>
//                                 <h3 className="stat-title text-lg font-semibold capitalize text-gray-700">{safeStatus.replace(/_/g, ' ')}</h3>
//                                 <p className="stat-value text-3xl font-bold text-gray-900">{safeCount}</p>
//                                 <p className="stat-desc text-gray-500 text-sm">Total parcels</p>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* ---------- Pie Chart ---------- */}
//             <div className="w-full h-[400px] bg-white rounded-xl shadow-lg p-4">
//                 <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                         <Pie
//                             data={pieData}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={120}
//                             label
//                             isAnimationActive={true}
//                         />
//                         <Tooltip />
//                         <Legend />
//                     </PieChart>
//                 </ResponsiveContainer>
//             </div>
//         </div>
//     );
// };

// export default AdminDashboardHome;



import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { 
    FaBoxOpen, 
    FaCheckCircle, 
    FaHourglassHalf, 
    FaTimesCircle, 
    FaWarehouse, 
    FaExclamationTriangle 
} from 'react-icons/fa';

// Icon configuration based on parcel status
const statusIconConfig = {
    delivered: <FaCheckCircle className="text-4xl text-green-600" />,
    pending: <FaHourglassHalf className="text-4xl text-yellow-500" />,
    cancelled: <FaTimesCircle className="text-4xl text-red-600" />,
    service_center_delivered: <FaWarehouse className="text-4xl text-blue-600" />
};

// Background color for cards
const statusBgConfig = {
    delivered: 'bg-green-50',
    pending: 'bg-yellow-50',
    cancelled: 'bg-red-50',
    service_center_delivered: 'bg-blue-50'
};

const AdminDashboardHome = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch delivery stats
    const { data: deliveryStatsResponse = {}, isLoading, isError, error } = useQuery({
        queryKey: ['delivery-status-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/delivery/status-count');
            return res.data; // { success: true, data: [...] }
        }
    });

    // Ensure deliveryStats is always an array
    const deliveryStats = deliveryStatsResponse?.data || [];

    // Prepare PieChart data safely
    const pieData = deliveryStats
        .filter(item => item && item._id && typeof item.count === 'number')
        .map(item => ({ name: item._id.replace(/_/g, ' '), value: item.count }));

    // ---------- Loading State ----------
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // ---------- Error State ----------
    if (isError) {
        return (
            <div className="alert alert-error shadow-md m-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-xl" />
                <span>{error?.message || "Failed to load parcel status data"}</span>
            </div>
        );
    }

    return (
        <div className="space-y-10 p-6">
            <h2 className="text-4xl font-extrabold flex items-center gap-3 text-gray-800">
                <FaBoxOpen className="text-blue-600" /> Admin Dashboard
            </h2>

            {/* ---------- Stats Cards ---------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {deliveryStats.map((stat, index) => {
                    const safeStatus = stat._id || 'Unknown';
                    const safeCount = typeof stat.count === 'number' ? stat.count : 0;

                    return (
                        <div
                            key={index}
                            className={`card shadow-lg rounded-xl p-5 flex flex-row items-center gap-4 transition transform hover:-translate-y-1 hover:shadow-2xl ${statusBgConfig[stat._id] || 'bg-base-100'
                                }`}
                        >
                            <div className="flex-shrink-0">{statusIconConfig[stat._id] || <FaBoxOpen className="text-4xl text-gray-600" />}</div>
                            <div>
                                <h3 className="stat-title text-lg font-semibold capitalize text-gray-700">{safeStatus.replace(/_/g, ' ')}</h3>
                                <p className="stat-value text-3xl font-bold text-gray-900">{safeCount}</p>
                                <p className="stat-desc text-gray-500 text-sm">Total parcels</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ---------- Pie Chart ---------- */}
            <div className="w-full h-[400px] bg-white rounded-xl shadow-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label
                            isAnimationActive={true}
                        />
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminDashboardHome;