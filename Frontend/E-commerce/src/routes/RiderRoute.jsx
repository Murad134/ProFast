import React from 'react'
import { Navigate } from 'react-router'
import useAuth from '../hooks/useAuth'
import useUserRole from '../hooks/useUserRole'
import { useLocation } from 'react-router-dom'
function RiderRoute({ children }) {
    const { user, loading } = useAuth();
    const { role, isLoading } = useUserRole();
    const location = useLocation();

    if (loading || isLoading) {
        return <span className='loading loading-spinner loading-xl'></span>
    }

    if (!user || role != 'rider') {
        return <Navigate state={{ from: location.pathname }} to='/forbidden'></Navigate>
    }

    return children;
}

export default RiderRoute