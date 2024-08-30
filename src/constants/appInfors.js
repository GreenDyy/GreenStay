import { Dimensions } from "react-native";

export const appInfors = {
    sizes: {
        WIDTH: Dimensions.get('window').width,
        HEIGHT: Dimensions.get('window').height,
    },
    // BASE_URL: process.env.BASE_URL,
    BASE_URL: 'http://192.168.1.6:3001',
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    monthNames: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
}   