import React, { useState } from 'react'
import { Link } from 'react-router'
import useAuth from '../../../hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SocialLogin from '../SocialLogin/SocialLogin';
import { useRef } from 'react';
import Swal from 'sweetalert2';
import useAxios from '../../../hooks/useAxios';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../../Firebase/firebase.init';
function Login() {
    const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm();
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [, setErrorMessage] = useState(""); const from = location.state?.from || '/';

    const axiosInstance = useAxios();
    const [showpassword, setshowpassword] = useState(false);
    const emailRef = useRef();

    const onSubmit = async (data) => {
        try {

            if (!data.terms) {
                Swal.fire({
                    title: "Terms not accepted",
                    text: "Please accept Terms and Conditions",
                    icon: "warning"
                });
                return;
            }

            // 1️⃣ Firebase login
            const result = await signIn(data.email, data.password);

            //3️⃣ Check email verified
            if (!result.user.emailVerified) {
                Swal.fire({
                    title: "Email Not Verified",
                    text: "Please verify your email before logging in.",
                    icon: "warning"
                });
                return;
            }

            // 2️⃣ Keep the backend user record in sync, but do not block login if
            // the API is temporarily unavailable.
            try {
                const userInfo = {
                    email: result.user.email,
                    role: "user",
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString(),
                };

                await axiosInstance.post("/users", userInfo);
            } catch (syncError) {
                console.error("User sync failed after login:", syncError);
            }

            Swal.fire({
                title: "Login Successful!",
                icon: "success"
            }).then(() => {
                reset();
                navigate(from, { replace: true });
            });

        } catch (error) {
            Swal.fire({
                title: "Login Failed",
                text: error.message || "Invalid email/password",
                icon: "error"
            });
        }
    };

    const handleForgotPassword = () => {
        const email = getValues('email'); // get email from form
        if (!email) {
            Swal.fire({
                title: "Email Required",
                text: "Please enter your email to reset password.",
                icon: "warning"
            });
            return;
        }

        setErrorMessage(""); // reset previous errors

        sendPasswordResetEmail(auth, email)
            .then(() => {
                Swal.fire({
                    title: "Password Reset Email Sent",
                    text: "Check your inbox to reset your password.",
                    icon: "success"
                });
            })
            .catch(error => {
                setErrorMessage(error.message); // now this works!
                Swal.fire({
                    title: "Error",
                    text: error.message,
                    icon: "error"
                });
            });
    };


    return (
        <div className="flex items-center justify-center px-2">
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                    <h1 className="text-5xl font-bold">Please Login</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <fieldset className="fieldset">
                            <label className="label">Email</label>
                            <input
                                type="email"
                                name='email'
                                ref={emailRef}
                                {...register('email')}
                                className="input" placeholder="Email" />

                            <label className="label">Password</label>
                            <div className='relative'>
                                <input
                                    type={showpassword ? "text" : "password"}
                                    name='password'
                                    {...register('password', { required: true, minLength: 6 })}
                                    className="input" placeholder="Password" />
                                <button
                                    type='button'
                                    onClick={() => {
                                        setshowpassword(!showpassword);
                                    }}
                                    className='btn btn-xs absolute top-2 right-6'>
                                    {
                                        showpassword ? <FaEyeSlash /> : <FaEye />
                                    }
                                </button>
                            </div>
                            {
                                errors.password?.type === 'required' && <p className="text-red-500">Password is required</p>
                            }
                            {
                                errors.password?.type === 'minLength' && <p className="text-red-500">Password must be at least 6 characters</p>
                            }
                            <div onClick={handleForgotPassword} className='text-right mt-1'>
                                <a className="link link-hover">Forgot password?</a>
                            </div>
                            <label className="label mt-2">
                                <input
                                    type="checkbox"
                                    name='terms'
                                    {...register('terms')}
                                    className="checkbox" />
                                Accept Terms and Conditions
                            </label>
                            <button className="btn btn-primary mt-4">Login</button>
                        </fieldset>
                        <p><small>Don't have an account? <Link className='btn btn-link' to="/register">Register</Link></small></p>
                    </form>
                    <SocialLogin />
                </div>
            </div>
        </div >
    )
}
export default Login