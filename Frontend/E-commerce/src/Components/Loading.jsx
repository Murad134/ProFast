import { FaTruckMoving, FaBoxOpen } from "react-icons/fa";
const ParcelDeliveryLoader = ({
    text = "Delivering parcels...",
    fullScreen = true,
}) => {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? "min-h-screen" : "py-10"
               }`}
        >
            {/* Animated truck */}
            <div className="relative">
                <FaTruckMoving className="text-primary text-6xl animate-bounce" />

                {/* Parcel */}
                <FaBoxOpen className="absolute -top-4 -right-4 text-secondary text-3xl animate-pulse" />
            </div>

            {/* Loading text */}
            <p className="text-lg font-semibold text-base-content animate-pulse">
                {text}
            </p>

            {/* DaisyUI loading bar */}
            <progress className="progress progress-primary w-56"></progress>
        </div>
    );
};
export default ParcelDeliveryLoader;