import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

function MapController({ districtsData, searchTerm }) {
    const map = useMap();

    useEffect(() => {
        if (!searchTerm) return;

        // Find district by name (case-insensitive)
        const district = districtsData.find(
            (d) => d.district.toLowerCase() === searchTerm.toLowerCase()
        );

        if (district) {
            map.setView([district.latitude, district.longitude], 12); // zoom in
        }
    }, [searchTerm, districtsData, map]);

    return null;
}

export default function BangladeshMap({ districtsData, searchTerm }) {
    const bangladeshCenter = [23.685, 90.3563];

    return (
        <MapContainer
            center={bangladeshCenter}
            zoom={8}
            className="rounded-lg shadow-lg w-full h-170" // bigger map height
        >
            {/* Map tiles */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Controller to move map */}
            <MapController districtsData={districtsData} searchTerm={searchTerm} />

            {/* Loop through all districts and place markers */}
            {districtsData.map((district, index) => (
                <Marker
                    key={index}
                    position={[district.latitude, district.longitude]}
                >
                    <Popup>
                        <div className="font-bold">{district.district}</div>
                        <div>Region: {district.region}</div>
                        <div>City: {district.city}</div>
                        <div>
                            Covered Areas:{" "}
                            {district.covered_area && district.covered_area.join(", ")}
                        </div>
                        <div>
                            <a
                                href={district.flowchart}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                View Flowchart
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
