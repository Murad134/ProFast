import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `http://localhost:3050`,
});

function useAxios() {
    return axiosInstance;
}
export default useAxios 