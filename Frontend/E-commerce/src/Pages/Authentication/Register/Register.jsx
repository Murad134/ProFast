import React from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import useAuth from '../../../hooks/useAuth'
import { useState } from 'react';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAxios from '../../../hooks/useAxios';
import { useNavigate, useLocation } from 'react-router-dom';
function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const [photoURL, setPhotoURL] = useState("");
    const axiosInstance = useAxios();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    const onSubmit = data => {

        if (!photoURL) {
            alert("Please upload a photo.");
            return;
        }

        
        createUser(data.email, data.password)
            .then(async (result) => {
                console.log(result.user);

                // update userinfo in the database 
                const userInfo = {
                    email: data.email,
                    role: 'user',
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString(),
                }

                const userRes = await axiosInstance.post('/users', userInfo);
                console.log('User info saved:', userRes.data);

                // update user profile in firebase 
                const userProfile = {
                    displayName: data.name,
                    photoURL: photoURL,
                }
                updateUserProfile(userProfile)
                    .then(() => {
                        console.log("User profile updated successfully");
                        navigate(from);
                    })
                    .catch(error => {
                        console.error("Failed to update user profile:", error);
                    })
            })
            .catch(error => {
                console.error(error);
            })
    };

    const handleImageUpload = async (e) => {
        try {
            const image = e.target.files[0];

            const formData = new FormData();
            formData.append("image", image);

            const res = await axios.post(
                "http://localhost:3050/upload-image",
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
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
                <h1 className="text-5xl font-bold">Create an Account!</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">

                        <label className="label">Name</label>
                        <input
                            type="text" {...register("name", { required: true })}
                            className="input" placeholder="Name" />
                        {errors.name?.type === 'required' && <p className="text-red-500">Name is required</p>}

                        <label className="label">Photo URL</label>
                        <input
                            type='file'
                            onChange={handleImageUpload}
                            className="input" placeholder="Photo URL" />

                        <label className="label">Email</label>
                        <input
                            type="email" {...register("email", { required: true })}
                            className="input" placeholder="Email" />
                        {errors.email?.type === 'required' && <p className="text-red-500">Email is required</p>}

                        <label className="label">Password</label>
                        <input
                            type="password" {...register("password", { required: true, minLength: 6 })}
                            className="input" placeholder="Password" />
                        {errors.password?.type === 'required' && <p className="text-red-500">Password is required</p>}
                        {errors.password?.type === 'minLength' && <p className="text-red-500">Password must be at least 6 characters</p>}

                        <button className="btn btn-primary mt-4">Register</button>
                    </fieldset>
                    <p><small>Already have an account ?<Link state={{ from }} className='btn btn-link' to="/login">Login</Link></small></p>
                </form>
                <SocialLogin />
            </div>
        </div>
    )
}
export default Register