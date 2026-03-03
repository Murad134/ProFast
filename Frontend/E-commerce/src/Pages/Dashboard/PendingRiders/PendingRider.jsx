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
        // <div className="p-6">
        //     <h2 className="text-2xl font-bold mb-4">
        //         Pending Riders ({riders.length})
        //     </h2>

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
        //                     <th>Applied At</th>
        //                     <th>Action</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {riders.map((rider, index) => (
        //                     <tr key={rider._id}>
        //                         <td>{index + 1}</td>
        //                         <td>{rider.name}</td>
        //                         <td>{rider.email}</td>
        //                         <td>{rider.phone}</td>
        //                         <td>{rider.region}</td>
        //                         <td>{rider.district}</td>
        //                         <td>{new Date(rider.createdAt).toLocaleDateString()}</td>
        //                         <td className="space-x-1">
        //                             <button
        //                                 className="btn btn-xs btn-info"
        //                                 onClick={() => setSelectedRider(rider)}
        //                                 title="View"
        //                             >
        //                                 <FaEye />
        //                             </button>
        //                             <button
        //                                 className="btn btn-xs btn-success"
        //                                 onClick={() => handleDecision(rider._id, "approve", rider.email)}
        //                                 title="Approve"
        //                             >
        //                                 <FaCheck />
        //                             </button>
        //                             <button
        //                                 className="btn btn-xs btn-error"
        //                                 onClick={() => handleDecision(rider._id, "reject", rider.email)}
        //                                 title="Reject"
        //                             >
        //                                 <FaTimes />
        //                             </button>
        //                         </td>
        //                     </tr>
        //                 ))}
        //             </tbody>
        //         </table>
        //     </div>

        //     {/* Rider Modal */}
        //     {selectedRider && (
        //         <dialog className="modal modal-open">
        //             <div className="modal-box">
        //                 <h3 className="font-bold text-lg mb-3">Rider Details</h3>

        //                 <div className="space-y-2">
        //                     <p><b>Name:</b> {selectedRider.name}</p>
        //                     <p><b>Email:</b> {selectedRider.email}</p>
        //                     <p><b>Phone:</b> {selectedRider.phone}</p>
        //                     <p><b>Region:</b> {selectedRider.region}</p>
        //                     <p><b>District:</b> {selectedRider.district}</p>
        //                     <p><b>Address:</b> {selectedRider.address}</p>
        //                     <p><b>Vehicle Type:</b> {selectedRider.vehicleType}</p>
        //                     <p><b>NID:</b> {selectedRider.nid}</p>
        //                     <p><b>Status:</b> {selectedRider.status}</p>
        //                     <p><b>Applied At:</b> {new Date(selectedRider.createdAt).toLocaleString()}</p>
        //                 </div>

        //                 <div className="modal-action">
        //                     <button
        //                         className="btn btn-success"
        //                         onClick={() => handleDecision(selectedRider._id, 'approve')}
        //                         title="Approve"
        //                     >
        //                         <FaCheck />
        //                     </button>

        //                     <button
        //                         className="btn btn-error"
        //                         onClick={() => handleDecision(selectedRider._id, 'reject')}
        //                         title="Reject"
        //                     >
        //                         <FaTimes />
        //                     </button>

        //                     <button
        //                         className="btn"
        //                         onClick={() => setSelectedRider(null)}
        //                     >
        //                         Close
        //                     </button>
        //                 </div>
        //             </div>
        //         </dialog>
        //     )}
        // </div>

        // <div className="px-2 py-6">
        //     <h2 className="text-2xl font-bold mb-4">
        //         Pending Riders ({riders.length})
        //     </h2>

        //     {/* Desktop/Tablet Table */}
        //     <div className="overflow-x-auto">
        //         <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-lg">
        //             <thead className="bg-gray-100">
        //                 <tr className="text-left text-gray-700 uppercase text-sm tracking-wider">
        //                     <th className="px-4 py-3">#</th>
        //                     <th className="px-4 py-3">Name</th>
        //                     <th className="px-4 py-3 hidden sm:table-cell">Email</th>
        //                     <th className="px-4 py-3 hidden md:table-cell">Phone</th>
        //                     <th className="px-4 py-3 hidden lg:table-cell">Region</th>
        //                     <th className="px-4 py-3 hidden lg:table-cell">District</th>
        //                     <th className="px-4 py-3 hidden sm:table-cell">Applied At</th>
        //                     <th className="px-4 py-3">Action</th>
        //                 </tr>
        //             </thead>

        //             <tbody className="bg-white divide-y divide-gray-200">
        //                 {riders.length > 0 ? (
        //                     riders.map((rider, index) => (
        //                         <tr key={rider._id} className="hover:bg-gray-50 transition-colors duration-150">
        //                             <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
        //                             <td className="px-4 py-3 text-gray-700">{rider.name}</td>
        //                             <td className="px-4 py-3 hidden sm:table-cell text-gray-700 truncate max-w-xs">{rider.email}</td>
        //                             <td className="px-4 py-3 hidden md:table-cell text-gray-700">{rider.phone}</td>
        //                             <td className="px-4 py-3 hidden lg:table-cell text-gray-700">{rider.region}</td>
        //                             <td className="px-4 py-3 hidden lg:table-cell text-gray-700">{rider.district}</td>
        //                             <td className="px-4 py-3 hidden sm:table-cell text-gray-500">
        //                                 {new Date(rider.createdAt).toLocaleDateString()}
        //                             </td>
        //                             <td className="px-4 py-3 space-x-1">
        //                                 <button
        //                                     className="btn btn-xs btn-info"
        //                                     onClick={() => setSelectedRider(rider)}
        //                                     title="View"
        //                                 >
        //                                     <FaEye />
        //                                 </button>
        //                                 <button
        //                                     className="btn btn-xs btn-success"
        //                                     onClick={() => handleDecision(rider._id, "approve", rider.email)}
        //                                     title="Approve"
        //                                 >
        //                                     <FaCheck />
        //                                 </button>
        //                                 <button
        //                                     className="btn btn-xs btn-error"
        //                                     onClick={() => handleDecision(rider._id, "reject", rider.email)}
        //                                     title="Reject"
        //                                 >
        //                                     <FaTimes />
        //                                 </button>
        //                             </td>
        //                         </tr>
        //                     ))
        //                 ) : (
        //                     <tr>
        //                         <td colSpan="8" className="text-center py-4 text-gray-500">
        //                             No pending riders found.
        //                         </td>
        //                     </tr>
        //                 )}
        //             </tbody>
        //         </table>
        //     </div>

        //     {/* Mobile Card View */}
        //     <div className="sm:hidden mt-4 space-y-4">
        //         {riders.length > 0 ? (
        //             riders.map((rider, index) => (
        //                 <div
        //                     key={rider._id}
        //                     className="bg-white p-4 rounded-lg shadow divide-y divide-gray-200"
        //                 >
        //                     <div className="flex justify-between py-1">
        //                         <span className="font-semibold text-gray-600">#</span>
        //                         <span>{index + 1}</span>
        //                     </div>
        //                     <div className="flex justify-between py-1">
        //                         <span className="font-semibold text-gray-600">Name</span>
        //                         <span>{rider.name}</span>
        //                     </div>
        //                     <div className="flex justify-between py-1">
        //                         <span className="font-semibold text-gray-600">Email</span>
        //                         <span className="truncate max-w-xs">{rider.email}</span>
        //                     </div>
        //                     <div className="flex justify-between py-1">
        //                         <span className="font-semibold text-gray-600">Phone</span>
        //                         <span>{rider.phone}</span>
        //                     </div>
        //                     <div className="flex justify-between py-1">
        //                         <span className="font-semibold text-gray-600">Region</span>
        //                         <span>{rider.region}</span>
        //                     </div>
        //                     <div className="flex justify-between py-1">
        //                         <span className="font-semibold text-gray-600">District</span>
        //                         <span>{rider.district}</span>
        //                     </div>
        //                     <div className="flex justify-between py-1">
        //                         <span className="font-semibold text-gray-600">Applied At</span>
        //                         <span className="text-gray-500">{new Date(rider.createdAt).toLocaleDateString()}</span>
        //                     </div>
        //                     <div className="flex justify-between py-1 space-x-1">
        //                         <button
        //                             className="btn btn-xs btn-info"
        //                             onClick={() => setSelectedRider(rider)}
        //                             title="View"
        //                         >
        //                             <FaEye />
        //                         </button>
        //                         <button
        //                             className="btn btn-xs btn-success"
        //                             onClick={() => handleDecision(rider._id, "approve", rider.email)}
        //                             title="Approve"
        //                         >
        //                             <FaCheck />
        //                         </button>
        //                         <button
        //                             className="btn btn-xs btn-error"
        //                             onClick={() => handleDecision(rider._id, "reject", rider.email)}
        //                             title="Reject"
        //                         >
        //                             <FaTimes />
        //                         </button>
        //                     </div>
        //                 </div>
        //             ))
        //         ) : (
        //             <p className="text-center text-gray-500">No pending riders found.</p>
        //         )}
        //     </div>

        //     {/* Rider Modal */}
        //     {selectedRider && (
        //         <dialog className="modal modal-open">
        //             <div className="modal-box w-full max-w-md">
        //                 <h3 className="font-bold text-lg mb-3">Rider Details</h3>

        //                 <div className="space-y-2">
        //                     <p><b>Name:</b> {selectedRider.name}</p>
        //                     <p><b>Email:</b> {selectedRider.email}</p>
        //                     <p><b>Phone:</b> {selectedRider.phone}</p>
        //                     <p><b>Region:</b> {selectedRider.region}</p>
        //                     <p><b>District:</b> {selectedRider.district}</p>
        //                     <p><b>Address:</b> {selectedRider.address}</p>
        //                     <p><b>Vehicle Type:</b> {selectedRider.vehicleType}</p>
        //                     <p><b>NID:</b> {selectedRider.nid}</p>
        //                     <p><b>Status:</b> {selectedRider.status}</p>
        //                     <p><b>Applied At:</b> {new Date(selectedRider.createdAt).toLocaleString()}</p>
        //                 </div>

        //                 <div className="modal-action flex flex-wrap gap-2">
        //                     <button
        //                         className="btn btn-success"
        //                         onClick={() => handleDecision(selectedRider._id, 'approve')}
        //                         title="Approve"
        //                     >
        //                         <FaCheck />
        //                     </button>

        //                     <button
        //                         className="btn btn-error"
        //                         onClick={() => handleDecision(selectedRider._id, 'reject')}
        //                         title="Reject"
        //                     >
        //                         <FaTimes />
        //                     </button>

        //                     <button
        //                         className="btn"
        //                         onClick={() => setSelectedRider(null)}
        //                     >
        //                         Close
        //                     </button>
        //                 </div>
        //             </div>
        //         </dialog>
        //     )}
        // </div>
        <div className="px-2 py-6">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex text-center">
                Pending Riders ({riders.length})
            </h2>

            {/* Desktop/Tablet Table */}
            <div className="overflow-x-auto rounded-lg  border border-gray-200">
                <table className="min-w-full divide-y ">
                    <thead className="bg-indigo-100">
                        <tr className="text-left text-gray-700 uppercase text-sm tracking-wider">
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3 hidden sm:table-cell">Email</th>
                            <th className="px-4 py-3 hidden md:table-cell">Phone</th>
                            <th className="px-4 py-3 hidden lg:table-cell">Region</th>
                            <th className="px-4 py-3 hidden lg:table-cell">District</th>
                            <th className="px-4 py-3 hidden sm:table-cell">Applied At</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {riders.length > 0 ? (
                            riders.map((rider, index) => (
                                <tr
                                    key={rider._id}
                                    className="hover:bg-indigo-50 transition-colors duration-150"
                                >
                                    <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{rider.name}</td>
                                    <td className="px-4 py-3 hidden sm:table-cell text-gray-700 truncate max-w-xs">{rider.email}</td>
                                    <td className="px-4 py-3 hidden md:table-cell text-gray-700">{rider.phone}</td>
                                    <td className="px-4 py-3 hidden lg:table-cell text-gray-700">{rider.region}</td>
                                    <td className="px-4 py-3 hidden lg:table-cell text-gray-700">{rider.district}</td>
                                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500">
                                        {new Date(rider.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 space-x-1">
                                        <button
                                            className="btn btn-xs bg-blue-500 hover:bg-blue-600 text-white"
                                            onClick={() => setSelectedRider(rider)}
                                            title="View"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            className="btn btn-xs bg-green-500 hover:bg-green-600 text-white"
                                            onClick={() => handleDecision(rider._id, "approve", rider.email)}
                                            title="Approve"
                                        >
                                            <FaCheck />
                                        </button>
                                        <button
                                            className="btn btn-xs bg-red-500 hover:bg-red-600 text-white"
                                            onClick={() => handleDecision(rider._id, "reject", rider.email)}
                                            title="Reject"
                                        >
                                            <FaTimes />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-gray-500 italic">
                                    No pending riders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden mt-6 space-y-4">
                {riders.length > 0 ? (
                    riders.map((rider, index) => (
                        <div
                            key={rider._id}
                            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 divide-y divide-gray-100"
                        >
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">#</span>
                                <span className="text-gray-700">{index + 1}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">Name</span>
                                <span className="font-medium text-indigo-700">{rider.name}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">Email</span>
                                <span className="truncate max-w-xs text-gray-700">{rider.email}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">Phone</span>
                                <span className="text-gray-700">{rider.phone}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">Region</span>
                                <span className="text-gray-700">{rider.region}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">District</span>
                                <span className="text-gray-700">{rider.district}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="font-semibold text-gray-600">Applied At</span>
                                <span className="text-gray-500">{new Date(rider.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between py-1 space-x-2 mt-2">
                                <button
                                    className="btn btn-xs bg-blue-500 hover:bg-blue-600 text-white w-1/3"
                                    onClick={() => setSelectedRider(rider)}
                                    title="View"
                                >
                                    <FaEye />
                                </button>
                                <button
                                    className="btn btn-xs bg-green-500 hover:bg-green-600 text-white w-1/3"
                                    onClick={() => handleDecision(rider._id, "approve", rider.email)}
                                    title="Approve"
                                >
                                    <FaCheck />
                                </button>
                                <button
                                    className="btn btn-xs bg-red-500 hover:bg-red-600 text-white w-1/3"
                                    onClick={() => handleDecision(rider._id, "reject", rider.email)}
                                    title="Reject"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 italic">No pending riders found.</p>
                )}
            </div>

            {/* Rider Modal */}
            {selectedRider && (
                <dialog className="modal modal-open">
                    <div className="modal-box w-full max-w-md bg-gray-50 border border-gray-300 rounded-lg">
                        <h3 className="font-bold text-lg mb-4 text-indigo-700">Rider Details</h3>

                        <div className="space-y-2 text-gray-700">
                            <p><b>Name:</b> {selectedRider.name}</p>
                            <p><b>Email:</b> {selectedRider.email}</p>
                            <p><b>Phone:</b> {selectedRider.phone}</p>
                            <p><b>Region:</b> {selectedRider.region}</p>
                            <p><b>District:</b> {selectedRider.district}</p>
                            <p><b>Address:</b> {selectedRider.address}</p>
                            <p><b>Vehicle Type:</b> {selectedRider.vehicleType}</p>
                            <p><b>NID:</b> {selectedRider.nid}</p>
                            <p><b>Status:</b>
                                <span className="ml-2 px-2 py-1 text-sm font-semibold rounded-full bg-yellow-400 text-white">
                                    {selectedRider.status}
                                </span>
                            </p>
                            <p><b>Applied At:</b> {new Date(selectedRider.createdAt).toLocaleString()}</p>
                        </div>

                        <div className="modal-action flex flex-wrap gap-2 mt-4">
                            <button
                                className="btn bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleDecision(selectedRider._id, 'approve')}
                                title="Approve"
                            >
                                <FaCheck />
                            </button>

                            <button
                                className="btn bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => handleDecision(selectedRider._id, 'reject')}
                                title="Reject"
                            >
                                <FaTimes />
                            </button>

                            <button
                                className="btn bg-gray-300 hover:bg-gray-400 text-gray-800"
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