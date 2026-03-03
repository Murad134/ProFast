import React from 'react'
import { Outlet } from 'react-router-dom'
import authImg from '../assets/Anothr/authImage.png'
import ProFastLogo from '../Pages/Shared/ProFastLogo/ProfastlogoF'
function AuthLayout() {
    return (
        <div className="py-6 px-2 md:p-10 min-h-screen bg-base-200">            <div>
            <ProFastLogo></ProFastLogo>
        </div>
            <div className="hero-content flex flex-col lg:flex-row-reverse items-center gap-5">                <div className='flex-1'>
                <img
                    src={authImg}
                    className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg shadow-2xl"
                />
            </div>
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    )
}
export default AuthLayout