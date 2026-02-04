import React from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import useAuth from '../../../hooks/useAuth'
import SocialLogin from '../SocialLogin/SocialLogin';
function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser } = useAuth();
    const onSubmit = data => {
        console.log(data);
        createUser(data.email, data.password)
            .then(result => {
                console.log(result.user);
            })
            .catch(error => {
                console.error(error);
            })
    }

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
                    <p><small>Already have an account ?<Link className='btn btn-link' to="/login">Login</Link></small></p>
                </form>
                <SocialLogin />
            </div>
        </div>
    )
}
export default Register