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
        // Kiểm tra lỗi từ phản hồi
        if (error.response) {
            const { status } = error.response;
            switch (status) {
                case 404:
                    break
                case 400:
                    showMessage({
                        message: "Lỗi 400",
                        description: "Đã xảy ra lỗi BadRequest",
                        type: "danger",
                    });
                    break
                case 403:
                    showMessage({
                        message: "Lỗi 403",
                        description: "Đã xảy ra lỗi Forbidden liên quan đến quyền truy cập",
                        type: "danger",
                    });
                    break
                case 500:
                    showMessage({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi ở máy chủ",
                        type: "danger",
                    });
                    break
                default:
                    showMessage({
                        message: "Lỗi",
                        description: "Đã xảy ra lỗi",
                        type: "danger",
                    });
                    break
            }
            return Promise.reject(error); // Đảm bảo lỗi được tiếp tục xử lý ở nơi gọi API
        }
    }
)

export default axiosClient