import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router-dom";
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
const BeARider = () => {
    const { user } = useAuth();
    const serviceCenters = useLoaderData();
    const axiosSecure = useAxiosSecure();

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [selectedRegion, setSelectedRegion] = useState('');

    // Unique regions
    const uniqueRegions = [...new Set(serviceCenters.map(w => w.region))];

    // Districts for selected region
    const districts = serviceCenters
        .filter((s) => s.region === selectedRegion)
        .map((s) => s.district);

    const onSubmit = async (data) => {
        const riderData = {
            ...data,
            name: user?.displayName || "",
            email: user?.email || "",
            status: "pending",
            createdAt: new Date().toISOString()
        };

        console.log("Be A Rider Application:", riderData);

        // TODO: Send to backend

        axiosSecure.post("/riders", riderData)
            .then(res => {
                console.log("Rider application response:", res.data);
                if (res.data.insertedId) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Application Submitted',
                        text: 'Your rider application has been submitted successfully!',
                    });

                }
            })
        reset();
    };
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow border border-green-400">
            <h2 className="text-2xl font-semibold mb-6">Be a Rider</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Name */}
                <div>
                    <label className="label">Name</label>
                    <input
                        type="text"
                        {...register("name")}
                        className="input input-bordered w-full bg-gray-100"
                        value={user?.displayName || ""}
                        readOnly
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="label">Email</label>
                    <input
                        type="email"
                        {...register("email")}
                        className="input input-bordered w-full bg-gray-100"
                        value={user?.email || ""}
                        readOnly
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="label">Phone Number</label>
                    <input
                        type="tel"
                        {...register("phone", {
                            required: "Phone is required",
                            pattern: { value: /^[0-9]{11}$/, message: "Enter a valid 11-digit phone number" }
                        })}
                        className="input input-bordered w-full"
                        placeholder="Enter your phone number"
                    />
                    {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                </div>
                <div>
                    <label className="label">Age</label>
                    <input
                        type="number"
                        {...register("age", {
                            required: "Age is required",
                            min: { value: 18, message: "Must be at least 18 years old" },
                            max: { value: 65, message: "Must be under 65 years old" }
                        })}
                        className="input input-bordered w-full"
                        placeholder="Enter your age"
                    />
                    {errors.age && <span className="text-red-500 text-sm">{errors.age.message}</span>}
                </div>


                {/* Region */}
                <div>
                    <label className="label">Region</label>
                    <select
                        {...register("region", { required: "Region is required" })}
                        className="select select-bordered w-full"
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                        <option value="">Select Region</option>
                        {uniqueRegions.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                    {errors.region && <span className="text-red-500 text-sm">{errors.region.message}</span>}
                </div>

                {/* District */}
                <div>
                    <label className="label">District</label>
                    <select
                        {...register("district", { required: "District is required" })}
                        className="select select-bordered w-full"
                        disabled={districts.length === 0}
                    >
                        <option value="">Select District</option>
                        {districts.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    {errors.district && <span className="text-red-500 text-sm">{errors.district.message}</span>}
                </div>
                {/* NID */}
                <div>
                    <label className="label">National ID Number</label>
                    <input
                        type="text"
                        {...register("nid", {
                            required: "NID is required",
                            pattern: { value: /^[0-9]{10,17}$/, message: "Enter a valid NID (10-17 digits)" }
                        })}
                        className="input input-bordered w-full"
                        placeholder="Enter your NID"
                    />
                    {errors.nid && <span className="text-red-500 text-sm">{errors.nid.message}</span>}
                </div>

                {/* Bike Brand */}
                <div>
                    <label className="label">Bike Brand</label>
                    <input
                        type="text"
                        {...register("bikeBrand", { required: "Bike Brand is required" })}
                        className="input input-bordered w-full"
                        placeholder="e.g., Honda, Yamaha"
                    />
                    {errors.bikeBrand && <span className="text-red-500 text-sm">{errors.bikeBrand.message}</span>}
                </div>

                {/* Bike Registration */}
                <div>
                    <label className="label">Bike Registration Number</label>
                    <input
                        type="text"
                        {...register("bikeRegistration", {
                            required: "Bike Registration is required",
                            pattern: { value: /^[A-Z0-9-]+$/, message: "Enter a valid registration number" }
                        })}
                        className="input input-bordered w-full"
                        placeholder="e.g., DHAKA-METRO-12-3456"
                    />
                    {errors.bikeRegistration && <span className="text-red-500 text-sm">{errors.bikeRegistration.message}</span>}
                </div>

                {/* Driving License */}
                <div>
                    <label className="label">Driving License Number</label>
                    <input
                        type="text"
                        {...register("licenseNumber", { required: "License is required" })}
                        className="input input-bordered w-full"
                        placeholder="Enter driving license number"
                    />
                    {errors.licenseNumber && <span className="text-red-500 text-sm">{errors.licenseNumber.message}</span>}
                </div>

                {/* Experience */}
                <div>
                    <label className="label">Riding Experience (Years)</label>
                    <input
                        type="number"
                        {...register("experience", {
                            required: "Experience is required",
                            min: { value: 1, message: "Must have at least 1 year experience" },
                            max: { value: 50, message: "Invalid experience value" }
                        })}
                        className="input input-bordered w-full"
                        placeholder="Enter experience in years"
                    />
                    {errors.experience && <span className="text-red-500 text-sm">{errors.experience.message}</span>}
                </div>

                {/* Vehicle Type */}
                <div>
                    <label className="label">Vehicle Type</label>
                    <select
                        {...register("vehicleType", { required: "Vehicle type is required" })}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Vehicle Type</option>
                        <option value="motorcycle">Motorcycle</option>
                        <option value="scooter">Scooter</option>
                        <option value="bicycle">Bicycle</option>
                    </select>
                    {errors.vehicleType && <span className="text-red-500 text-sm">{errors.vehicleType.message}</span>}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                    <label className="label">Full Address</label>
                    <textarea
                        {...register("address", {
                            required: "Address is required",
                            minLength: { value: 10, message: "Address must be at least 10 characters" }
                        })}
                        className="textarea textarea-bordered w-full"
                        rows="3"
                        placeholder="Enter your complete address"
                    />
                    {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                </div>

                {/* Submit */}
                <div className="md:col-span-2">
                    <button type="submit" className="btn btn-primary w-full mt-6">
                        Submit Application
                    </button>
                </div>
            </form>
        </div>
    );
};
export default BeARider;