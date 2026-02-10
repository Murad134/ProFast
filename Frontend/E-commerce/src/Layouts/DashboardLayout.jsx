import React from 'react'
import { Outlet } from 'react-router-dom'
import ProfastlogoF from '../Pages/Shared/ProFastLogo/ProfastlogoF.jsx';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBoxOpen, FaMoneyCheckAlt, FaHourglassHalf, FaSearchLocation, FaUserEdit, FaCheckCircle, FaUserShield, FaUserCheck } from 'react-icons/fa';
import useUserRole from '../hooks/useUserRole.jsx'
function Dashboard() {
    const { role, isLoading } = useUserRole();
    console.log(role);
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">

                {/* Navbar */}
                <div className="navbar bg-base-300 w-full lg:hidden">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                    <div className="mx-2 flex-1 px-2">DashBoard</div>
                </div>
                {/* Page content here */}
                <Outlet></Outlet>

                {/* Page content here */}

            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <ProfastlogoF></ProfastlogoF>
                    <li>
                        <NavLink to="/">
                            <FaHome className="inline mr-2" />
                            Home
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/dashboard/myparcels">
                            <FaBoxOpen className="inline mr-2" />
                            My Parcels
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/dashboard/paymenthistory">
                            <FaMoneyCheckAlt className="inline mr-2" />
                            Payment History
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/dashboard/track">
                            <FaSearchLocation className="inline mr-2" />
                            Track Parcel
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/dashboard/profile">
                            <FaUserEdit className="inline mr-2" />
                            Update Profile
                        </NavLink>
                    </li>
                    {
                        !isLoading && role === 'admin' &&
                        <>
                            <li>
                                <NavLink to="/dashboard/assignrider">
                                    <FaUserCheck className="inline mr-2" />
                                    Assign Rider
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/activeriders">
                                    <FaCheckCircle className="inline mr-2" />
                                    Active Riders
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/dashboard/pendingriders">
                                    <FaHourglassHalf className="inline mr-2" />
                                    Pending Riders
                                </NavLink>
                            </li>

                            { /*admin routes */}
                            <li>
                                <NavLink to='/dashboard/makeAdmin'>
                                    <FaUserShield className='inline-block mr-2' />
                                    Make Admin
                                </NavLink>
                            </li>
                        </>
                    }
                </ul>
            </div>
        </div>
    )
}
export default Dashboard