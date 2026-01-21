import React from "react";
import BenefitCard from "./BenefitCard";

// images
import trackingImg from "../../../assets/Tracker/safe-delivery.png";
import safeImg from "../../../assets/Tracker/live-tracking.png";

const benefitsData = [
    {
        id: 1,
        image: safeImg,
        title: "Live Parcel Tracking",
        description:
            "Track your parcel in real time from pickup to final delivery and receive instant status updates for complete peace of mind."
    },
    {
        id: 2,
        image: trackingImg,
        title: "100% Safe Delivery",
        description:
            "We ensure your parcels are handled with the utmost care and delivered securely using reliable processes."
    },
    {
        id: 3,
        image: trackingImg,
        title: "24/7 Call Center Support",
        description:
            "Our dedicated support team is available around the clock to assist you with delivery updates and concerns."
    }
];

export default function Benefits() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-20 space-y-6">
            {/* Header */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold">Our Benefits</h2>
                <p className="text-base-content/70 mt-2">
                    Designed to give you reliability, safety, and confidence
                </p>
            </div>

            {/* Horizontal Cards */}
            <div className="flex flex-col gap-6">
                {benefitsData.map((benefit) => (
                    <BenefitCard
                        key={benefit.id}
                        image={benefit.image}
                        title={benefit.title}
                        description={benefit.description}
                    />
                ))}
            </div>
        </div>
    );
}
