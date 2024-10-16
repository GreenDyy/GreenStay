import { Dimensions } from "react-native";

//chạy ngrok http https://localhost:7095 để lấy public url
const BASE_URL = 'https://5084-171-252-189-53.ngrok-free.app'
// const BASE_URL = process.env.BASE_URL

export const appInfors = {
    sizes: {
        WIDTH: Dimensions.get('window').width,
        HEIGHT: Dimensions.get('window').height,
    },
    BASE_URL: `${BASE_URL}/api`,
    monthNames: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ],
    monthNamesVN: [
        "Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu",
        "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"
    ]
}   