// src/pages/Coverage.jsx
import React, { useState } from "react";
import BangladeshMap from "./BangladeshMap";
import { useLoaderData } from "react-router";

export default function Coverage() {
    const serviceCenter = useLoaderData();
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="p-6">
            {/* Title */}
            <h1 className="text-3xl font-bold text-center mb-4">
                We are available in 64 districts
            </h1>

            {/* Search box */}
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="Search district..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-full max-w-md"
                />
            </div>

            {/* Map Component */}
            <BangladeshMap districtsData={serviceCenter} searchTerm={searchTerm} />
        </div>
    );
}
