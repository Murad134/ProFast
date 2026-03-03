
// import React from 'react'
// import { NavLink } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import useAuth from '../../../hooks/useAuth';
// import ProfastlogoF from '../ProFastLogo/ProfastlogoF';


// import { useEffect, useRef, useState } from 'react'
// function Navbar() {
//     const { user, logOut } = useAuth();



//     const [open, setOpen] = useState(false);
//     const dropdownRef = useRef(null);
//     const timerRef = useRef(null);

//     // ✅ Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//                 setOpen(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     // ✅ Auto close after 5 seconds
//     useEffect(() => {
//         if (open) {
//             timerRef.current = setTimeout(() => {
//                 setOpen(false);
//             }, 5000);
//         }

//         return () => clearTimeout(timerRef.current);
//     }, [open]);
    

//     const handleLogout = () => {
//         logOut()
//             .then(() => console.log("User logged out"))
//             .catch((error) => console.error(error));
//     };


//     const NavItems = <>
//         <li><NavLink to="/">Home</NavLink></li>
//         <li><NavLink to="/sendparcel">Send Parcel</NavLink></li>
//         <li><NavLink to="/coverage">Coverage</NavLink></li>
//         {user &&
//             <li><NavLink to="/dashboard">Dashboard</NavLink>
//             </li>
//         }
//         <li><NavLink to="/beARider">Be A Rider</NavLink></li>
//         <li><NavLink to="/aboutus">About Us</NavLink></li>
//     </>;
//     return (
//         <div className="navbar bg-base-100 shadow-sm grid grid-cols-[auto_1fr_auto] items-center px-4 gap-2">

//             {/* Left: Logo + Mobile Dropdown */}
//             <div className="flex items-center gap-2">
//                 {/* Mobile hamburger */}
//                 <div className="dropdown lg:hidden">
//                     <div tabIndex={0} role="button" className="btn btn-ghost">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
//                         </svg>
//                     </div>
//                     <ul
//                         tabIndex={-1}
//                         className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
//                     >
//                         {NavItems}
//                     </ul>
//                 </div>
//                 <ProfastlogoF />
//             </div>

//             {/* Center: Desktop Nav — spans middle column */}
//             <div className="hidden lg:flex justify-center">
//                 <ul className="menu menu-horizontal px-1">
//                     {NavItems}
//                 </ul>
//             </div>

//             {/* Right: Auth */}
//             {/* <div className="flex justify-end">
//                 {user ? (
//                     <div className="dropdown dropdown-end">
//                         <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
//                             <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden">
//                                 <img
//                                     src={user?.photoURL || '/default-avatar.png'}
//                                     alt="profile"
//                                     className="object-cover w-full h-full"
//                                 />
//                             </div>
//                         </label>
//                         <ul
//                             tabIndex={0}
//                             className="dropdown-content mt-2 p-3 shadow-lg menu bg-base-100 rounded-lg w-56 space-y-2"
//                         >
//                             <li className="text-center font-semibold text-lg text-primary">
//                                 {user?.displayName || 'User'}
//                             </li>
//                             <li>
//                                 <button
//                                     onClick={handleLogout}
//                                     className="w-full bg-primary text-white py-2 rounded hover:bg-primary-focus transition"
//                                 >
//                                     Logout
//                                 </button>
//                             </li>
//                         </ul>
//                     </div>
//                 ) : (
//                     <Link
//                         to="/login"
//                         className="btn bg-primary text-white hover:bg-primary-focus transition"
//                     >
//                         Login
//                     </Link>
//                 )}
//             </div> */}

//             <div className="flex justify-end">
//                 {user ? (
//                     <div className="dropdown dropdown-end">
//                         {/* Avatar + Name flexed horizontally */}
//                         <label
//                             tabIndex={0}
//                             className="btn btn-ghost rounded-lg flex items-center space-x-3 cursor-pointer"
//                         >
//                             <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden">
//                                 <img
//                                     src={user?.photoURL || '/default-avatar.png'}
//                                     alt="profile"
//                                     className="object-cover w-full h-full"
//                                 />
//                             </div>
//                             <span className="font-semibold text-primary">
//                                 {user?.displayName || 'User'}
//                             </span>
//                         </label>
//                         {/* Dropdown content */}
//                         <ul
//                             tabIndex={0}
//                             className="dropdown-content mt-1 p-2 shadow-lg menu bg-base-100 rounded-lg w-30 space-y-2"
//                         >
//                             <li>
//                                 <button
//                                     onClick={handleLogout}
//                                     className="w-full bg-primary text-white py-1 rounded hover:bg-primary-focus transition"
//                                 >
//                                     Logout
//                                 </button>
//                             </li>
//                         </ul>
//                     </div>
//                 ) : (
//                     <Link
//                         to="/login"
//                         className="btn bg-primary text-white hover:bg-primary-focus transition"
//                     >
//                         Login
//                     </Link>
//                 )}
//             </div>


//         </div>
//     );
// }
// export default Navbar;


import React, { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import ProfastlogoF from '../ProFastLogo/ProfastlogoF'

function Navbar() {
  const { user, logOut } = useAuth()

  // dropdown state
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const timerRef = useRef(null)

  // logout
  const handleLogout = () => {
    logOut()
      .then(() => console.log('User logged out'))
      .catch((error) => console.error(error))
  }

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // auto close after 5 seconds
  useEffect(() => {
    if (!open) return

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setOpen(false)
    }, 5000)

    return () => clearTimeout(timerRef.current)
  }, [open])

  const NavItems = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/sendparcel">Send Parcel</NavLink></li>
      <li><NavLink to="/coverage">Coverage</NavLink></li>
      {user && <li><NavLink to="/dashboard">Dashboard</NavLink></li>}
      <li><NavLink to="/beARider">Be A Rider</NavLink></li>
      <li><NavLink to="/aboutus">About Us</NavLink></li>
    </>
  )

  return (
    <div className="navbar bg-base-100 shadow-sm grid grid-cols-[auto_1fr_auto] items-center px-4 gap-2">

      {/* Left: Logo + Mobile Menu */}
      <div className="flex items-center gap-2">
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            {NavItems}
          </ul>
        </div>
        <ProfastlogoF />
      </div>

      {/* Center: Desktop Menu */}
      <div className="hidden lg:flex justify-center">
        <ul className="menu menu-horizontal px-1">
          {NavItems}
        </ul>
      </div>

      {/* Right: Auth */}
      <div className="flex justify-end">
        {user ? (
          <div ref={dropdownRef} className="relative">
            {/* Profile button */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="btn btn-ghost rounded-lg flex items-center space-x-3"
            >
              <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden">
                <img
                  src={user?.photoURL || '/default-avatar.png'}
                  alt="profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="font-semibold text-primary">
                {user?.displayName || 'User'}
              </span>
            </button>

            {/* Dropdown */}
            {open && (
              <ul className="absolute right-0 mt-2 p-2 shadow-lg menu bg-base-100 rounded-lg w-32 z-50">
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-primary text-white py-1 rounded hover:bg-primary-focus transition"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="btn bg-primary text-white hover:bg-primary-focus transition"
          >
            Login
          </Link>
        )}
      </div>

    </div>
  )
}

export default Navbar