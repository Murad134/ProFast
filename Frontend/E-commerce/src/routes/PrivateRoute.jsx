import React from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate } from 'react-router-dom';
function PrivateRoute({ children }) {
    const { uesr, loading } = useAuth();
    if (loading) {
        return <span className="loading loading-spinner loading-xl"></span>;
    }
    if (!uesr) {
        return <Navigate to="/login"></Navigate>
    }
    return children;
}
export default PrivateRoute