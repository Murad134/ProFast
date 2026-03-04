import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `https://backend-one-mauve-16.vercel.app`,
});

function useAxios() {
    return axiosInstance;
}
export default useAxios 