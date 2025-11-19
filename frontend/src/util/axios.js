import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://smart-campus-wifi-management.onrender.com/api", // Your backend URL
    withCredentials: true, 
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


export default axiosInstance;
