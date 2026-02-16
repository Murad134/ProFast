import React from 'react'
import useUserRole from '../../../hooks/useUserRole'
import Loading from '../../../Components/Loading'
import UserDashboard from '../../Dashboard/DashboardHome/UserDashboard'
import RiderDashboard from '../../Dashboard/DashboardHome/RiderDashboard'
import AdminDashboard from '../../Dashboard/DashboardHome/AdminDashboard'
import Forbidden from '../../Forbidden/Forbidden'
function DashboardHome() {

    const { role, isLoading } = useUserRole();

    if (isLoading) {
        return <Loading></Loading>
    }

    if (role == 'user') {
        return <UserDashboard></UserDashboard>
    }
    else if (role == 'rider') {
        return <RiderDashboard></RiderDashboard>
    }
    else if (role == 'admin') {
        return <AdminDashboard></AdminDashboard>
    }
    else {
        return <Forbidden></Forbidden>
    }
}

export default DashboardHome