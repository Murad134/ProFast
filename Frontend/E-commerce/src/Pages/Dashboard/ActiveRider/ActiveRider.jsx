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
            const res = await axiosSecure.get('/riders/active');
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

            await axiosSecure.patch(`/riders/${id}/status`, { status: 'inactive' });
            Swal.fire('Deactivated!', 'Rider has been deactivated.', 'success');
            refetch(); // Re-fetch the active riders
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to deactivate rider', 'error');
        }
    };

    return (
        <div className="p-6">
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

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Region</th>
                            <th>District</th>
                            <th>Status</th> {/* NEW STATUS COLUMN */}
                            <th>Applied At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRiders.length > 0 ? (
                            filteredRiders.map((rider, index) => (
                                <tr key={rider._id}>
                                    <td>{index + 1}</td>
                                    <td>{rider.name}</td>
                                    <td>{rider.email}</td>
                                    <td>{rider.phone}</td>
                                    <td>{rider.region}</td>
                                    <td>{rider.district}</td>
                                    <td className="px-3 py-1 text-sm font-semibold text-white rounded-full bg-blue-500 text-center">{rider.status}</td> {/* Display status */}
                                    <td>{new Date(rider.createdAt).toLocaleDateString()}</td>
                                    <td>
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
                                <td colSpan="9" className="text-center">
                                    No active riders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default ActiveRiders;