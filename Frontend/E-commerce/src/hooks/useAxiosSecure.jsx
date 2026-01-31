import React from 'react'
import axios from 'axios'


const axiosSecure = axios.create({
    baseURL: `http://localhost:3050`,
});

function useAxiosSecure() {
    return axiosSecure;
}
export default useAxiosSecure