import AsyncStorage from "@react-native-async-storage/async-storage"

const getDataStorage = async (key) => {
    return await AsyncStorage.getItem(key)
}

const setDataStorage = async (key, value) => {
    await AsyncStorage.setItem(key, value)
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