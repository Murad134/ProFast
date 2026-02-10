import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function TrackParcel() {
  const { trackingId } = useParams();
  const navigate = useNavigate();

  const [trackId, setTrackId] = useState("");
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch ONLY when URL param changes
  useEffect(() => {
    if (!trackingId) return;

    setTrackId(trackingId);
    fetchTracking(trackingId);
  }, [trackingId]);

  const fetchTracking = async (id) => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tracking/${id}`
      );
      setUpdates(res.data);
    } catch (err) {
      setError("Failed to fetch tracking info: " + err.message);
      setUpdates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!trackId.trim()) return;
    navigate(`/track/${trackId}`); // URL change triggers fetch
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Track Your Parcel</h1>

      {/* Search */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          className="input input-bordered w-full"
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Track
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Loading tracking updates...</p>}

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* No data */}
      {!loading && !error && updates.length === 0 && trackingId && (
        <p className="text-gray-500">No tracking information found</p>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {updates.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg p-4 shadow-sm"
          >
            <h3 className="font-semibold text-lg">{item.status}</h3>
            <p>{item.message}</p>
            <div className="text-sm text-gray-500 mt-2">
              <p>📍 {item.location}</p>
              <p>🕒 {new Date(item.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default TrackParcel;