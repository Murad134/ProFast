import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home/Homes";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import SendParcel from "../Pages/SendParcel/SendParcel";
import PrivateRoute from "../routes/PrivateRoute.jsx";
import DashboardLayout from "../Layouts/DashboardLayout.jsx";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels.jsx";
import Payment from "../Pages/Dashboard/Payment/Payment.jsx";
import PaymentHistory from "../Pages/Dashboard/PaymentHistroy/PaymentHistory.jsx";
import TrackParcel from "../Pages/Dashboard/TrackParcel/TrackParcel.jsx";
import BeARider from "../Pages/Dashboard/BeARider/BeARider.jsx";
import ActiveRider from "../Pages/Dashboard/ActiveRider/ActiveRider.jsx";
import PendingRider from "../Pages/Dashboard/PendingRiders/PendingRider.jsx";
import MakeAdmin from "../Pages/Dashboard/MakeAdmin/MakeAdmin.jsx";
import Forbidden from '../Pages/Forbidden/Forbidden.jsx'
import AdminRoutes from "../routes/AdminRoutes.jsx";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider.jsx";
const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout></RootLayout>,
        children: [
            {
                index: true,
                element: <Home></Home>
            },
            {
                path: 'sendparcel',
                element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>,
                loader: () => fetch('./districtsData.json').then(res => res.json())
            },
            {
                path: 'coverage',
                element: <Coverage></Coverage>,
                loader: () => fetch('./districtsData.json').then(res => res.json())
            }, {
                path: 'beARider',
                element: <PrivateRoute><BeARider></BeARider></PrivateRoute>,
                loader: () => fetch('./districtsData.json').then(res => res.json())

            }, {
                path: 'forbidden',
                element: <Forbidden></Forbidden>
            }
        ],
    },
    {
        path: '/',
        element: <AuthLayout></AuthLayout>,
        children: [
            {
                path: 'login',
                element: <Login></Login>
            },
            {
                path: 'register',
                element: <Register></Register>
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashboardLayout></DashboardLayout>
        </PrivateRoute>,
        children: [
            {
                path: 'myparcels',
                element: <MyParcels></MyParcels>
            }
            , {
                path: 'payment/:id',
                element: <Payment></Payment>
            },
            {
                path: 'paymenthistory',
                element: <PaymentHistory></PaymentHistory>
            },
            {
                path: 'track',
                element: <TrackParcel></TrackParcel>
            }, {
                path: 'assignrider',
                element: <AdminRoutes> <AssignRider></AssignRider></AdminRoutes>

            },
            {
                path: 'track/:trackingId',
                element: <TrackParcel></TrackParcel>
            }, {
                path: 'activeriders',
                element: <AdminRoutes><ActiveRider></ActiveRider></AdminRoutes>
            },
            {
                path: 'pendingriders',
                element: <AdminRoutes><PendingRider></PendingRider></AdminRoutes>
            }, {
                path: 'makeAdmin',
                element: <AdminRoutes><MakeAdmin></MakeAdmin></AdminRoutes>
            }
        ]
    }
]);
export default router;