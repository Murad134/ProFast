import React from 'react'
import axios from 'axios'
import useAuth from './useAuth';
import { useNavigate } from 'react-router';
const axiosSecure = axios.create({
    baseURL: `http://localhost:3050`,
});

function useAxiosSecure() {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    axiosSecure.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${user?.accessToken}`;
        return config;
    }, error => {
        return Promise.reject(error);
    });

    axiosSecure.interceptors.response.use(res => {
        return res;
    }, err => {
        console.log('Inside res interceptor', err);
        const status = err.response?.status;
        if (status === 403) {
            navigate('/forbidden');
        }
        else if (status === 401) {
            logOut()
                .then(() => {
                    navigate('/login')
                })
                .catch(() => {
                })
        }

        return Promise.reject(err);
    })
    return axiosSecure;
}
export default useAxiosSecure