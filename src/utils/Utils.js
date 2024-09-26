import AsyncStorage from "@react-native-async-storage/async-storage"
import { appInfors } from "../constants/appInfors"

const getDataStorage = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        return JSON.parse(value)
    }
    catch (e) {
        console.log('Lỗi lấy AsynStorage: ', e)
    }
}

const setDataStorage = async (key, value) => {
    try {
        const newValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, newValue)
    }
    catch (e) {
        console.log('Lỗi lưu AsynStorage: ', e)
    }
}

const removeItemDataStorage = async (key) => {
    await AsyncStorage.removeItem(key)
}

const showAllKeyDataStorage = async () => {
    return await AsyncStorage.getAllKeys()
}

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Đảm bảo rằng giây luôn có 2 chữ số
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${minutes}:${formattedSeconds}`;
};

const getTime = (date) => {
    const newDate = new Date(date)
    const hour = newDate.getHours()
    const minutes = newDate.getMinutes()
    return `${hour < 10 ? `0${hour}` : hour}:${minutes < 10 ? `0${minutes}` : minutes}`
}

const getDateStringType1 = (date) => {
    const newDate = new Date(date)
    const dayNumber = newDate.getDate()
    const monthString = appInfors.monthNamesVN[newDate.getMonth()]
    const yearNumber = newDate.getFullYear()
    return `${dayNumber < 10 ? `0${dayNumber}` : dayNumber} ${monthString}, ${yearNumber}`
}

// const getDateStringType2 = (date) => {
//     const newDate = new Date(date)
//     const dayNumber = newDate.getDate()
//     const monthString = appInfors.monthNamesVN[newDate.getMonth()]
//     const yearNumber = newDate.getFullYear()
//     return `${dayNumber < 10 ? `0${dayNumber}` : dayNumber} ${monthString}, ${yearNumber}`
// }

const checkNamNhuan = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

export {
    getDataStorage,
    setDataStorage,
    removeItemDataStorage,
    showAllKeyDataStorage,
    formatTime,
    getTime,
    getDateStringType1,
    checkNamNhuan
}