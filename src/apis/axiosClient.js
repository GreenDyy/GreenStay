import axios from "axios";
import { appInfors } from "../constants/appInfors";

const axiosClient = axios.create({
    baseURL: appInfors.BASE_URL,
    timeout: 10000,
})

//xử lý chặn từ request
axiosClient.interceptors.request.use((config) => {
    const token = 'token'
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

axiosClient.interceptors.response.use(
    (res) => {
        if (res.status === 200) {
            return res
        }

    },
    (error) => {
        console.error('API error:', error);
        return Promise.reject(error); // Đảm bảo lỗi được tiếp tục xử lý ở nơi gọi API
    }
)

export default axiosClient