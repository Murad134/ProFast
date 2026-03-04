import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Dialog } from "@headlessui/react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useTrackingLogger from "../../../hooks/useTrackingLogger";
import useAuth from "../../../hooks/useAuth";

const AssignRider = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { logTrackingUpdate } = useTrackingLogger();
    const { user } = useAuth();

    const [selectedParcel, setSelectedParcel] = useState(null);
    const [selectedRider, setSelectedRider] = useState(null);
    const [riders, setRiders] = useState([]);
    const [loadingRiders, setLoadingRiders] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    /* ================= FETCH PARCELS ================= */
    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ["assignableParcels"],
        queryFn: async () => {
            const res = await axiosSecure.get("/parcels", {
                params: {
                    payment_status: "Paid",
                    delivery_status: 'pending',
                },
            });
            return res.data.sort(
                (a, b) =>
                    new Date(a.created_at || a.creation_date) -
                    new Date(b.created_at || b.creation_date)
            );
        },
    });

    /* ================= ASSIGN RIDER ================= */
    const { mutateAsync: assignRider } = useMutation({
        mutationFn: async ({ parcelId, rider }) => {
            setSelectedRider(rider);
            const res = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
                riderId: rider._id,
                riderName: rider.name,
                riderEmail: rider.email,
            });
            return res.data;
        },
        onSuccess: async () => {
            // 🔄 refetch assignable parcels
            queryClient.invalidateQueries(['assignableParcels']);

            // ✅ success alert
            Swal.fire({
                icon: 'success',
                title: 'Rider Assigned',
                text: 'The rider has been successfully assigned to this parcel.',
                confirmButtonColor: '#4f46e5',
            });
            // track rider assigned
            await logTrackingUpdate({
                trackingId: selectedParcel.trackingId,
                status: "rider_assigned",
                details: `Assigned to ${selectedRider.name}`,
                location: selectedParcel.senderServiceCenter,
                updated_by: user.email,
            });
        },
        onError: (error) => {
            console.error(error);

            // ❌ error alert
            Swal.fire({
                icon: 'error',
                title: 'Assignment Failed',
                text: error?.response?.data?.message || 'Something went wrong!',
                confirmButtonColor: '#ef4444',
            });
        },
    });


    /* ================= OPEN MODAL ================= */
    const openAssignModal = async (parcel) => {
        setSelectedParcel(parcel);
        setIsOpen(true);
        setLoadingRiders(true);
        setRiders([]);

        try {
            const res = await axiosSecure.get("/rider/available", {
                params: {
                    district: parcel.senderServiceCenter,
                },
            });
            setRiders(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to load riders", "error");
        } finally {
            setLoadingRiders(false);
        }
    };

    /* ================= LOADING ================= */
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">Assign Rider</h2>

            {/* ================= PARCEL TABLE ================= */}
            {parcels.length === 0 ? (
                <p className="text-center text-gray-500">No parcels available</p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-600 text-white text-sm uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">Tracking ID</th>
                                <th className="px-4 py-3 text-left">Title</th>
                                <th className="px-4 py-3 text-center hidden sm:table-cell">Type</th>
                                <th className="px-4 py-3 text-center hidden md:table-cell">Sender Center</th>
                                <th className="px-4 py-3 text-center hidden md:table-cell">Receiver Center</th>
                                <th className="px-4 py-3 text-center hidden lg:table-cell">Cost</th>
                                <th className="px-4 py-3 text-center hidden lg:table-cell">Created At</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {parcels.map((parcel, idx) => (
                                <tr
                                    key={parcel._id}
                                    className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-50 transition`}
                                >
                                    <td className="px-4 py-3 font-medium">{parcel.trackingId}</td>
                                    <td className="px-4 py-3 font-semibold">{parcel.parcelName}</td>
                                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${parcel.parcelType === "Document"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {parcel.parcelType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center hidden md:table-cell">{parcel.senderServiceCenter}</td>
                                    <td className="px-4 py-3 text-center hidden md:table-cell">{parcel.receiverServiceCenter}</td>
                                    <td className="px-4 py-3 text-center font-semibold hidden lg:table-cell">৳ {parcel.DeliveryCost}</td>
                                    <td className="px-4 py-3 text-center text-sm text-gray-600 hidden lg:table-cell">
                                        {new Date(parcel.created_at || parcel.creation_date).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => openAssignModal(parcel)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm"
                                        >
                                            Assign Rider
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ================= MOBILE CARD VIEW ================= */}
            <div className="sm:hidden mt-6 space-y-4">
                {parcels.map((parcel,) => (
                    <div
                        key={parcel._id}
                        className="bg-white p-4 rounded-lg shadow-md border border-gray-200 divide-y divide-gray-100"
                    >
                        <div className="flex justify-between py-1">
                            <span className="font-semibold text-gray-600">Tracking ID</span>
                            <span className="font-medium text-gray-800">{parcel.trackingId}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="font-semibold text-gray-600">Title</span>
                            <span className="font-semibold text-indigo-700">{parcel.parcelName}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="font-semibold text-gray-600">Type</span>
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${parcel.parcelType === "Document"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {parcel.parcelType}
                            </span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="font-semibold text-gray-600">Sender</span>
                            <span>{parcel.senderServiceCenter}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="font-semibold text-gray-600">Receiver</span>
                            <span>{parcel.receiverServiceCenter}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="font-semibold text-gray-600">Cost</span>
                            <span className="font-semibold text-gray-800">৳ {parcel.DeliveryCost}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="font-semibold text-gray-600">Created At</span>
                            <span className="text-gray-500 text-sm">
                                {new Date(parcel.created_at || parcel.creation_date).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-center mt-2">
                            <button
                                onClick={() => openAssignModal(parcel)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg w-full"
                            >
                                Assign Rider
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= MODAL ================= */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-lg border border-gray-200">
                        <Dialog.Title className="text-xl font-bold mb-4">
                            Assign Rider for{" "}
                            <span className="text-indigo-600">{selectedParcel?.parcelName}</span>
                        </Dialog.Title>

                        {loadingRiders && (
                            <div className="flex justify-center py-6">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        )}

                        {!loadingRiders && riders.length === 0 && (
                            <p className="text-center text-gray-500">No riders available in this district</p>
                        )}

                        {!loadingRiders && riders.length > 0 && (
                            <div className="overflow-x-auto max-h-72">
                                <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                                    <thead className="bg-indigo-500 text-white text-sm">
                                        <tr>
                                            <th className="p-3 text-left">Name</th>
                                            <th className="p-3 text-left">Phone</th>
                                            <th className="p-3 text-left">Bike Info</th>
                                            <th className="p-3 text-center">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {riders.map((rider, idx) => (
                                            <tr
                                                key={rider._id}
                                                className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-indigo-50`}
                                            >
                                                <td className="p-3 font-medium">{rider.name}</td>
                                                <td className="p-3">{rider.phone || "N/A"}</td>
                                                <td className="p-3 text-sm">
                                                    <p>District: {rider.district}</p>
                                                    <p>Bike: {rider.bikeModel || "N/A"}</p>
                                                    <p>Plate: {rider.bikeNumber || "N/A"}</p>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <button
                                                        onClick={async () => {
                                                            await assignRider({ parcelId: selectedParcel._id, rider });
                                                            setIsOpen(false);
                                                        }}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                                    >
                                                        Assign
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="text-right mt-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default AssignRider;