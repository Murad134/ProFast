import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaTimes } from 'react-icons/fa';

const ActiveRiders = () => {
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');

    // Fetch active riders using React Query
    const { data: riders = [], isLoading, refetch } = useQuery({
        queryKey: ['active-riders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/rider/active');
            return res.data;
        }
    });

    if (isLoading) return <p>Loading...</p>;

    // Filter by search input
    const filteredRiders = riders.filter(rider =>
        rider.name.toLowerCase().includes(search.toLowerCase())
    );

    // Deactivate rider
    const handleDeactivate = async (id) => {
        try {
            const confirm = await Swal.fire({
                title: 'Are you sure?',
                text: "This will deactivate the rider!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            });

            if (!confirm.isConfirmed) return;

            await axiosSecure.patch(`/rider/${id}/status`, { status: 'inactive' });
            Swal.fire('Deactivated!', 'Rider has been deactivated.', 'success');
            refetch(); // Re-fetch the active riders
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to deactivate rider', 'error');
        }
    };

    return (
        // <div className="p-6">
        //     <h2 className="text-2xl font-bold mb-4">
        //         Active Riders ({filteredRiders.length})
        //     </h2>

        //     {/* Search Box */}
        //     <input
        //         type="text"
        //         placeholder="Search by name..."
        //         className="input input-bordered mb-4 w-full max-w-xs"
        //         value={search}
        //         onChange={(e) => setSearch(e.target.value)}
        //     />

        //     {/* Table */}
        //     <div className="overflow-x-auto">
        //         <table className="table table-zebra w-full">
        //             <thead>
        //                 <tr>
        //                     <th>#</th>
        //                     <th>Name</th>
        //                     <th>Email</th>
        //                     <th>Phone</th>
        //                     <th>Region</th>
        //                     <th>District</th>
        //                     <th>Status</th> {/* NEW STATUS COLUMN */}
        //                     <th>Applied At</th>
        //                     <th>Action</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {filteredRiders.length > 0 ? (
        //                     filteredRiders.map((rider, index) => (
        //                         <tr key={rider._id}>
        //                             <td>{index + 1}</td>
        //                             <td>{rider.name}</td>
        //                             <td>{rider.email}</td>
        //                             <td>{rider.phone}</td>
        //                             <td>{rider.region}</td>
        //                             <td>{rider.district}</td>
        //                             <td className="px-3 py-1 text-sm font-semibold text-white rounded-full bg-blue-500 text-center">{rider.status}</td> {/* Display status */}
        //                             <td>{new Date(rider.createdAt).toLocaleDateString()}</td>
        //                             <td>
        //                                 <button
        //                                     className="btn btn-xs btn-error"
        //                                     onClick={() => handleDeactivate(rider._id)}
        //                                     title="Deactivate"
        //                                 >
        //                                     <FaTimes />
        //                                 </button>
        //                             </td>
        //                         </tr>
        //                     ))
        //                 ) : (
        //                     <tr>
        //                         <td colSpan="9" className="text-center">
        //                             No active riders found.
        //                         </td>
        //                     </tr>
        //                 )}
        //             </tbody>
        //         </table>
        //     </div>
        // </div>
        <div className="px-2 py-4">
            <h2 className="text-2xl font-bold mb-4">
                Active Riders ({filteredRiders.length})
            </h2>

            {/* Search Box */}
            <input
                type="text"
                placeholder="Search by name..."
                className="input input-bordered mb-4 w-full max-w-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Desktop/Tablet Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-lg">
                    <thead className="bg-gray-100">
                        <tr className="text-left text-gray-700 uppercase text-sm tracking-wider">
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3 hidden sm:table-cell">Email</th>
                            <th className="px-4 py-3 hidden md:table-cell">Phone</th>
                            <th className="px-4 py-3 hidden lg:table-cell">Region</th>
                            <th className="px-4 py-3 hidden lg:table-cell">District</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 hidden sm:table-cell">Applied At</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRiders.length > 0 ? (
                            filteredRiders.map((rider, index) => (
                                <tr key={rider._id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                                    <td className="px-4 py-3 text-gray-700">{rider.name}</td>
                                    <td className="px-4 py-3 hidden sm:table-cell text-gray-700 truncate max-w-xs">{rider.email}</td>
                                    <td className="px-4 py-3 hidden md:table-cell text-gray-700">{rider.phone}</td>
                                    <td className="px-4 py-3 hidden lg:table-cell text-gray-700">{rider.region}</td>
                                    <td className="px-4 py-3 hidden lg:table-cell text-gray-700">{rider.district}</td>
                                    <td className="px-3 py-1 text-sm font-semibold text-white rounded-full bg-blue-500 text-center">
                                        {rider.status}
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500">
                                        {new Date(rider.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            className="btn btn-xs btn-error"
                                            onClick={() => handleDeactivate(rider._id)}
                                            title="Deactivate"
                                        >
                                            <FaTimes />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-4 text-gray-500">
                                    No active riders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden mt-4 space-y-4">
                {filteredRiders.length > 0 ? (
                    filteredRiders.map((rider, index) => (
                        <div
                            key={rider._id}
                            className="bg-white p-4 rounded-lg shadow divide-y divide-gray-200"
                        >
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">#</span>
                                <span>{index + 1}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">Name</span>
                                <span>{rider.name}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">Email</span>
                                <span className="truncate max-w-xs">{rider.email}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">Phone</span>
                                <span>{rider.phone}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">Region</span>
                                <span>{rider.region}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">District</span>
                                <span>{rider.district}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">Status</span>
                                <span className="px-2 py-1 text-sm font-semibold text-white rounded-full bg-blue-500">{rider.status}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">Applied At</span>
                                <span className="text-gray-500">{new Date(rider.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">Action</span>
                                <button
                                    className="btn btn-xs btn-error"
                                    onClick={() => handleDeactivate(rider._id)}
                                    title="Deactivate"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No active riders found.</p>
                )}
            </div>
        </div>
    );
};
export default ActiveRiders;