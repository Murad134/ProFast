import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import useTrackingLogger from '../../../hooks/useTrackingLogger';

function PendingDeliveries() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { logTrackingUpdate } = useTrackingLogger();

  // Fetch parcels for rider
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ['riderParcels', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/parcels?email=${user.email}`);
      return res.data;
    },
  });

  // Update status mutation
  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/parcels/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['riderParcels']);
      queryClient.invalidateQueries(['completedParcels']);
    },
  });

  // Status update handler
  const handleStatusUpdate = (parcel, newstatus) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Mark parcel as ${newstatus.replace('_', ' ')}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus({ id: parcel._id, status: newstatus })
          .then(async () => {
            Swal.fire('Updated!', 'Parcel status updated', 'success')

            // log tracking
            let trackDetails = `Picked up by ${user.displayName}`
            if (newstatus === 'in_transit') {
              trackDetails = `Delivered by ${user.displayName}`
            }
            await logTrackingUpdate({
              trackingId: parcel.trackingId,
              status: newstatus,
              details: trackDetails,
              location: parcel.senderServiceCenter,
              updated_by: user.email,
            })
          })

          .catch(() => Swal.fire('Error!', 'Failed to update status', 'error'));
      }
    });
  };

  if (isLoading) return <div className="p-4">Loading parcels...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Pending Deliveries ({parcels.length})
      </h2>

      {/* ===== GRID HEADER (Desktop only) ===== */}
      <div className="hidden md:grid grid-cols-10 gap-2 bg-gray-100 p-3 rounded font-semibold text-sm">
        <div>#</div>
        <div>Parcel</div>
        <div>Type</div>
        <div>Sender</div>
        <div>Receiver</div>
        <div>Center</div>
        <div>Weight</div>
        <div>Cost</div>
        <div>Status</div>
        <div>Action</div>
      </div>

      {/* ===== GRID ROWS ===== */}
      {parcels.map((parcel, index) => (
        <div
          key={parcel._id}
          className="
            grid grid-cols-1
            md:grid-cols-10
            gap-2 p-3 border-b text-sm
          "
        >
          <div>
            <span className="md:hidden font-semibold">#:</span> {index + 1}
          </div>

          <div>
            <span className="md:hidden font-semibold">Parcel:</span>
            {parcel.parcelName}
          </div>

          <div>
            <span className="md:hidden font-semibold">Type:</span>
            {parcel.parcelType}
          </div>

          <div>
            <span className="md:hidden font-semibold">Sender:</span>
            {parcel.senderName}
          </div>

          <div>
            <span className="md:hidden font-semibold">Receiver:</span>
            {parcel.receiverName}
          </div>

          <div>
            <span className="md:hidden font-semibold">Center:</span>
            {parcel.receiverServiceCenter}
          </div>

          <div>
            <span className="md:hidden font-semibold">Weight:</span>
            {parcel.parcelWeight}
          </div>

          <div>
            <span className="md:hidden font-semibold">Cost:</span>
            TK {parcel.DeliveryCost}
          </div>

          <div>
            <span
              className={`badge ${parcel.delivery_status === 'assigned'
                ? 'badge-warning'
                : parcel.delivery_status === 'in_transit'
                  ? 'badge-info'
                  : 'badge-success'
                }`}
            >
              {parcel.delivery_status.replace('_', ' ')}
            </span>
          </div>

          <div className="flex gap-2">
            {parcel.delivery_status === 'assigned' && (
              <button
                className="btn btn-xs btn-primary"
                onClick={() =>
                  handleStatusUpdate(parcel, 'in_transit')
                }
              >
                Pick Up
              </button>
            )}

            {parcel.delivery_status === 'in_transit' && (
              <button
                className="btn btn-xs btn-success"
                onClick={() =>
                  handleStatusUpdate(parcel, 'delivered')
                }
              >
                Deliver
              </button>
            )}
          </div>
        </div>
      ))}

      {parcels.length === 0 && (
        <p className="text-center mt-6 text-gray-500">
          No pending deliveries
        </p>
      )}
    </div>
  );
}
export default PendingDeliveries;