import React from 'react'
import { Link } from 'react-router'
import useAuth from '../../../hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import SocialLogin from '../SocialLogin/SocialLogin';
function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';
    

    const onSubmit = data => {
        console.log(data);
        signIn(data.email, data.password)
            .then(result => {
                console.log("Logged in user:", result.user);
                navigate(from, { replace: true }); // বা /dashboard
            })
            .catch(error => {
                console.error(error);
            });
    };
    return (
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
                <h1 className="text-5xl font-bold">Please Login</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">
                        <label className="label">Email</label>
                        <input
                            type="email" {...register('email')}
                            className="input" placeholder="Email" />

                        <label className="label">Password</label>
                        <input
                            type="password" {...register('password', { required: true, minLength: 6 })}
                            className="input" placeholder="Password" />
                        {
                            errors.password?.type === 'required' && <p className="text-red-500">Password is required</p>
                        }
                        {
                            errors.password?.type === 'minLength' && <p className="text-red-500">Password must be at least 6 characters</p>
                        }
                        <div><a className="link link-hover">Forgot password?</a></div>
                        <button className="btn btn-primary mt-4">Login</button>
                    </fieldset>
                    <p><small>Don't have an account? <Link className='btn btn-link' to="/register">Register</Link></small></p>
                </form>
                <SocialLogin />
            </div>
        </div>
    )
}
export default Login