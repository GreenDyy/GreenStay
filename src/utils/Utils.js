import AsyncStorage from "@react-native-async-storage/async-storage"
import { appInfors } from "../constants/appInfors"
import RNFS from 'react-native-fs'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import htmlInvoice from "../screens/invoice/htmlInvoice"

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

const getDateStringType2 = (date) => {
    const newDate = new Date(date)
    const dayNumber = newDate.getDate()
    const monthNumber = newDate.getMonth() + 1
    const yearNumber = newDate.getFullYear()
    return `${dayNumber < 10 ? `0${dayNumber}` : dayNumber}/${monthNumber < 10 ? `0${monthNumber}` : monthNumber}/${yearNumber}`
}

const checkNamNhuan = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

const printBillPdf = async ({
    customerName,
    roomName,
    customerPhoneNumber,
    invoiceId,
    description,
    roomPrice,
    powerPrice,
    waterPrice,
    trashPrice,
    invoiceCreateAt,
    amount,
    waterStart,
    waterEnd,
    powerStart,
    powerEnd
}) => {
    try {
        // Thay thế các giá trị trong template HTML
        const templateHtml = htmlInvoice
            .replace('{{customerName}}', customerName)
            .replace('{{roomName}}', roomName)
            .replace('{{customerPhoneNumber}}', customerPhoneNumber)
            .replace('{{invoiceId}}', invoiceId)
            .replace('{{description}}', description)
            .replace('{{roomPrice}}', roomPrice)
            .replace('{{powerPrice}}', powerPrice)
            .replace('{{waterPrice}}', waterPrice)
            .replace('{{trashPrice}}', trashPrice)
            .replace('{{invoiceCreateAt}}', invoiceCreateAt)
            .replace('{{waterStart}}', waterStart)
            .replace('{{waterEnd}}', waterEnd)
            .replace('{{powerStart}}', powerStart)
            .replace('{{powerEnd}}', powerEnd)
            .replace('{{amount}}', amount)

        let options = {
            html: templateHtml,
            fileName: `${amount}_phieu_thu_tien_${powerPrice}`,
            directory: 'Documents',
        };

        let file = await RNHTMLtoPDF.convert(options);

        // Lấy đường dẫn đến thư mục Download của hệ thống
        const destPath = `${RNFS.DownloadDirectoryPath}/${options.fileName}.pdf`;

        // Di chuyển file đến thư mục Download
        await RNFS.moveFile(file.filePath, destPath);
        console.log('File PDF đã được lưu vào:', file.filePath);

        return destPath;

    } catch (e) {
        console.log('Lỗi xuất PDF: ', e);
    }
}


export {
    getDataStorage,
    setDataStorage,
    removeItemDataStorage,
    showAllKeyDataStorage,
    formatTime,
    getTime,
    getDateStringType1,
    getDateStringType2,
    checkNamNhuan,
    printBillPdf
}