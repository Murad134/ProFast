import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';

const PendingRiders = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedRider, setSelectedRider] = useState(null);

    // React Query: fetch pending riders
    const { isLoading, data: riders = [], refetch } = useQuery({
        queryKey: ['pending-riders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/rider/pending');
            return res.data;
        }
    });
    if (isLoading) {
        return <p>Loading...</p>;
    }

    // Approve or Reject rider
    const handleDecision = async (id, action, email) => {
        const confirm = await Swal.fire({
            title: `${action === 'approve' ? 'Approve' : 'Reject'} Application?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
        });
        if (!confirm.isConfirmed) return;

        try {
            const status = action === 'approve' ? 'active' : 'rejected'
            await axiosSecure.patch(`/rider/${id}/status`, {
                status, email
            });
            refetch(); // refresh the list
            Swal.fire('Success', `Rider ${action} successfully`, 'success');
            setSelectedRider(null);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Could not update rider status', 'error');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
                Pending Riders ({riders.length})
            </h2>

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
                            <th>Applied At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {riders.map((rider, index) => (
                            <tr key={rider._id}>
                                <td>{index + 1}</td>
                                <td>{rider.name}</td>
                                <td>{rider.email}</td>
                                <td>{rider.phone}</td>
                                <td>{rider.region}</td>
                                <td>{rider.district}</td>
                                <td>{new Date(rider.createdAt).toLocaleDateString()}</td>
                                <td className="space-x-1">
                                    <button
                                        className="btn btn-xs btn-info"
                                        onClick={() => setSelectedRider(rider)}
                                        title="View"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        className="btn btn-xs btn-success"
                                        onClick={() => handleDecision(rider._id, "approve", rider.email)}
                                        title="Approve"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        className="btn btn-xs btn-error"
                                        onClick={() => handleDecision(rider._id, "reject", rider.email)}
                                        title="Reject"
                                    >
                                        <FaTimes />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Rider Modal */}
            {selectedRider && (
                <dialog className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-3">Rider Details</h3>

                        <div className="space-y-2">
                            <p><b>Name:</b> {selectedRider.name}</p>
                            <p><b>Email:</b> {selectedRider.email}</p>
                            <p><b>Phone:</b> {selectedRider.phone}</p>
                            <p><b>Region:</b> {selectedRider.region}</p>
                            <p><b>District:</b> {selectedRider.district}</p>
                            <p><b>Address:</b> {selectedRider.address}</p>
                            <p><b>Vehicle Type:</b> {selectedRider.vehicleType}</p>
                            <p><b>NID:</b> {selectedRider.nid}</p>
                            <p><b>Status:</b> {selectedRider.status}</p>
                            <p><b>Applied At:</b> {new Date(selectedRider.createdAt).toLocaleString()}</p>
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-success"
                                onClick={() => handleDecision(selectedRider._id, 'approve')}
                                title="Approve"
                            >
                                <FaCheck />
                            </button>

                            <button
                                className="btn btn-error"
                                onClick={() => handleDecision(selectedRider._id, 'reject')}
                                title="Reject"
                            >
                                <FaTimes />
                            </button>

                            <button
                                className="btn"
                                onClick={() => setSelectedRider(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};
export default PendingRiders;