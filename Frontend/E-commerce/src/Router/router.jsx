import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home/Homes";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import SendParcel from "../Pages/SendParcel/SendParcel";
import PrivateRoute from "../routes/PrivateRoute.jsx";
const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout></RootLayout>,
        children:[
            {
                index: true,
                element: <Home></Home>
            },
            {
                path: 'sendparcel',
                // element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>
                element: <SendParcel></SendParcel>,
                loader: () => fetch('./districtsData.json').then(res => res.json())
            },
            {
                path: 'coverage',
                element: <Coverage></Coverage>,
                loader: () => fetch('./districtsData.json').then(res => res.json())
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
    }
]);
export default router;