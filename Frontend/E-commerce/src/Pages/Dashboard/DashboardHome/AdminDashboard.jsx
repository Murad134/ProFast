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

// ---------- Icon configuration ----------
const statusIconConfig = {
    delivered: <FaCheckCircle className="text-4xl text-green-700" />,
    pending: <FaHourglassHalf className="text-4xl text-yellow-600" />,
    cancelled: <FaTimesCircle className="text-4xl text-red-600" />,
    service_center_delivered: <FaWarehouse className="text-4xl text-blue-600" />,
    assigned: <FaHourglassHalf className="text-4xl text-indigo-600" />,
    in_transit: <FaHourglassHalf className="text-4xl text-orange-500" />,
    not_collected: <FaTimesCircle className="text-4xl text-red-500" />
};

// ---------- Background color configuration ----------
const statusBgConfig = {
    delivered: 'bg-green-100',
    pending: 'bg-yellow-100',
    cancelled: 'bg-red-100',
    service_center_delivered: 'bg-blue-100',
    assigned: 'bg-indigo-100',
    in_transit: 'bg-orange-100',
    not_collected: 'bg-red-50'
};

// ---------- PieChart slice colors ----------
const pieColors = {
    delivered: '#22c55e',       // green-500
    pending: '#eab308',         // yellow-500
    cancelled: '#ef4444',       // red-500
    service_center_delivered: '#3b82f6', // blue-500
    assigned: '#6366f1',        // indigo-500
    in_transit: '#f97316',      // orange-500
    not_collected: '#f87171'    // red-400
};

const AdminDashboardHome = () => {
    const axiosSecure = useAxiosSecure();

    // ---------- Fetch delivery stats ----------
    const { data: deliveryStatsResponse = [], isLoading, isError, error } = useQuery({
        queryKey: ['delivery-status-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/delivery/status-count');
            return res.data;
        }
    });

    const deliveryStats = Array.isArray(deliveryStatsResponse) ? deliveryStatsResponse : [];

    // ---------- Prepare PieChart data ----------
    const pieData = deliveryStats.map(stat => {
        const normalizedStatus = stat.status.toLowerCase().replace(/-/g, '_');
        return {
            name: stat.status.replace(/_/g, ' ').replace(/-/g, ' '),
            value: stat.count,
            fill: pieColors[normalizedStatus] || '#9ca3af'
        };
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-error shadow-md m-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-xl" />
                <span>{error?.message || "Failed to load parcel status data"}</span>
            </div>
        );
    }

    return (
        <div className="space-y-10 px-2 py-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-3 text-gray-800">
                <FaBoxOpen className="text-blue-600" /> Admin Dashboard
            </h2>

            {/* ---------- Stats Cards ---------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {deliveryStats.map((stat, index) => {
                    const normalizedStatus = stat.status.toLowerCase().replace(/-/g, '_');
                    const safeCount = typeof stat.count === 'number' ? stat.count : 0;

                    return (
                        <div
                            key={index}
                            className={`card shadow-lg rounded-xl p-5 flex flex-row items-center gap-4 transition transform hover:-translate-y-1 hover:shadow-2xl ${statusBgConfig[normalizedStatus] || 'bg-gray-100'}`}
                        >
                            <div className="flex-shrink-0">
                                {statusIconConfig[normalizedStatus] || <FaBoxOpen className="text-4xl text-gray-600" />}
                            </div>
                            <div>
                                <h3 className="stat-title text-lg sm:text-xl font-semibold capitalize text-gray-800">
                                    {stat.status.replace(/_/g, ' ').replace(/-/g, ' ')}
                                </h3>
                                <p className="stat-value text-2xl sm:text-3xl font-bold text-gray-900">{safeCount}</p>
                                <p className="stat-desc text-gray-600 text-sm sm:text-base">Total parcels</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ---------- Pie Chart ---------- */}
            <div className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] bg-white rounded-xl shadow-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
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