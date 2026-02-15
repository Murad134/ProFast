import React from 'react'
import useAxiosSecure from './useAxiosSecure'

function useTrackingLogger() {
    const axiosSecure = useAxiosSecure();
    const logTrackingUpdate = async ({ trackingId, status, details, location,
        updated_by }) => {
        try {
            const payload = {
                tracking_id: trackingId, status, details, location, updated_by,
            };
            await axiosSecure.post('/tracking', payload);
        }
        catch (err) {
            console.log("Failed to log tracking :", err);
        }
    }
    return { logTrackingUpdate };
}
export default useTrackingLogger