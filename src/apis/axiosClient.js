import axios from "axios";
import { appInfors } from "../constants/appInfors";
import { showMessage } from "react-native-flash-message";

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
            return res.data
        }

    },
    (error) => {
        console.error('API error:', error);
        showMessage({
            message: "Thông báo",
            description: "Vui lòng kiểm tra kết nối mạng",
            type: "danger",
        })
        return Promise.reject(error); // Đảm bảo lỗi được tiếp tục xử lý ở nơi gọi API
    }
)

export default axiosClient