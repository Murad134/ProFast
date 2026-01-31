import React from 'react'
import { Outlet } from 'react-router-dom'
import authImg from '../assets/Anothr/authImage.png'
import ProFastLogo from '../Pages/Shared/ProFastLogo/ProfastlogoF'
function AuthLayout() {
    return (
        <div className="p-12 bg-base-200">
            <div>
                <ProFastLogo></ProFastLogo>
            </div>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className='flex-1'>
                    <img
                        src={authImg}
                        className="max-w-sm rounded-lg shadow-2xl"
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