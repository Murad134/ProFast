import React from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { sendEmailVerification } from "firebase/auth";
import Swal from 'sweetalert2';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth'
import { useState } from 'react';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAxios from '../../../hooks/useAxios';
import { useNavigate, useLocation } from 'react-router-dom';
function Register() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const [photoURL, setPhotoURL] = useState("");
    const axiosInstance = useAxios();
    const location = useLocation();

    const navigate = useNavigate();
    const from = location.state?.from || '/';

    const onSubmit = async (data) => {
        try {

            if (!photoURL) {
                Swal.fire({
                    title: "Photo Required",
                    text: "Please upload a photo.",
                    icon: "warning"
                });
                return;
            }

            // 1️⃣ Create Firebase user
            const result = await createUser(data.email, data.password);
            const user = result.user;


            // 2️⃣ Send email verification (always send)
            await sendEmailVerification(user);


            // 3️⃣ Update user Firebase profile
            await updateUserProfile({
                displayName: data.name,
                photoURL: photoURL,
            });
            // updateProfile(auth.currentUser, {
            //     displayName: data.name,
            //     photoURL: photoURL,
            // });
            // // 4️⃣ Save user in database
            const userInfo = {
                email: data.email,
                role: "user",
                created_at: new Date().toISOString(),
                last_log_in: new Date().toISOString(),
            };

            await axiosInstance.post("/users", userInfo);

            // 5️⃣ Success message
            Swal.fire({
                title: "Registration Successful!",
                text: "Please verify your email before logging in.",
                icon: "success",
                confirmButtonText: "OK"
            });

            // Optional: logout user so they must verify first
            // await logOut();

            reset();
            navigate("/login");

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Registration Failed",
                text: error.message,
                icon: "error"
            });
        }
    };


    const handleImageUpload = async (e) => {
        try {
            const image = e.target.files[0];

            const formData = new FormData();
            formData.append("image", image);

            const res = await axios.post(
                "https://backend-one-mauve-16.vercel.app/api/upload-image",
                formData
            );

            setPhotoURL(res.data.imageUrl);
        }
        catch (error) {
            console.error("Image upload failed:", error);
            alert("Image upload failed. Please try again.");
        }
    };

    return (
        // <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        //     <div className="card-body">
        //         <h1 className="text-5xl font-bold">Create an Account!</h1>
        //         <form onSubmit={handleSubmit(onSubmit)}>
        //             <fieldset className="fieldset">

        //                 <label className="label">Name</label>
        //                 <input
        //                     type="text" {...register("name", { required: true })}
        //                     className="input" placeholder="Name" />
        //                 {errors.name?.type === 'required' && <p className="text-red-500">Name is required</p>}

        //                 <label className="label">Photo URL</label>
        //                 <input
        //                     type='file'
        //                     onChange={handleImageUpload}
        //                     className="input" placeholder="Photo URL" />

        //                 <label className="label">Email</label>
        //                 <input
        //                     type="email" {...register("email", { required: true })}
        //                     className="input" placeholder="Email" />
        //                 {errors.email?.type === 'required' && <p className="text-red-500">Email is required</p>}

        //                 <label className="label">Password</label>
        //                 <input
        //                     type="password" {...register("password", { required: true, minLength: 6 })}
        //                     className="input" placeholder="Password" />
        //                 {errors.password?.type === 'required' && <p className="text-red-500">Password is required</p>}
        //                 {errors.password?.type === 'minLength' && <p className="text-red-500">Password must be at least 6 characters</p>}

        //                 <button className="btn btn-primary mt-4">Register</button>
        //             </fieldset>
        //             <p><small>Already have an account ?<Link state={{ from }} className='btn btn-link' to="/login">Login</Link></small></p>
        //         </form>
        //         <SocialLogin />
        //     </div>
        // </div>
        <div className="flex justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="card bg-base-100 w-full max-w-sm sm:max-w-md md:max-w-lg shadow-2xl shrink-0 p-6 sm:p-8 lg:p-10">
                <div className="card-body space-y-4">

                    {/* Heading */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
                        Create an Account!
                    </h1>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <fieldset className="space-y-3">

                            <div>
                                <label className="label">Name</label>
                                <input
                                    type="text"
                                    {...register("name", { required: true })}
                                    className="input w-full"
                                    placeholder="Name"
                                />
                                {errors.name?.type === 'required' && (
                                    <p className="text-red-500 text-sm">Name is required</p>
                                )}
                            </div>

                            <div>
                                <label className="label">Photo URL</label>
                                <input
                                    type='file'
                                    onChange={handleImageUpload}
                                    className="input w-full"
                                    placeholder="Photo URL"
                                />
                            </div>

                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    {...register("email", { required: true })}
                                    className="input w-full"
                                    placeholder="Email"
                                />
                                {errors.email?.type === 'required' && (
                                    <p className="text-red-500 text-sm">Email is required</p>
                                )}
                            </div>

                            <div>
                                <label className="label">Password</label>
                                <input
                                    type="password"
                                    {...register("password", { required: true, minLength: 6 })}
                                    className="input w-full"
                                    placeholder="Password"
                                />
                                {errors.password?.type === 'required' && (
                                    <p className="text-red-500 text-sm">Password is required</p>
                                )}
                                {errors.password?.type === 'minLength' && (
                                    <p className="text-red-500 text-sm">Password must be at least 6 characters</p>
                                )}
                            </div>

                            {/* Submit */}
                            <button className="btn btn-primary w-full mt-2 sm:mt-4 py-2 sm:py-3">
                                Register
                            </button>

                        </fieldset>

                        {/* Login link */}
                        <p className="text-center text-sm sm:text-base mt-2">
                            Already have an account?{" "}
                            <Link state={{ from }} className='btn btn-link p-0' to="/login">
                                Login
                            </Link>
                        </p>
                    </form>

                    {/* Social login buttons */}
                    <SocialLogin />

                </div>
            </div>
        </div>
    )
}
export default Register