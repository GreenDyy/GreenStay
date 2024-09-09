import { Dimensions } from "react-native";

//chạy ngrok http https://localhost:7095 để lấy public url
const BASE_URL = 'https://b49b-171-252-153-129.ngrok-free.app'
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
    ]
}   