import AsyncStorage from "@react-native-async-storage/async-storage"

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

export {
    getDataStorage,
    setDataStorage,
    removeItemDataStorage,
    showAllKeyDataStorage,
}