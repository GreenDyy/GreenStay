import { View, Text, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import MainNavigator from './MainNavigator';
import { appColors } from '../constants/appColors';
import { SplashScreen } from '../screens';
import { getDataStorage } from '../utils/Utils';
import AuthRouter from './AuthRouter';

const AppRouter = () => {
    const [isShowSplash, setIsShowSplash] = useState(true)
    const [accessToken, setAccessToken] = useState(null)

    useEffect(() => {
        const fetchAccessToken = async () => {
            const token = await getDataStorage('accessToken');
            setAccessToken(token);
        };
        console.log('lấy dc token: ', accessToken)
        fetchAccessToken();
    }, [])

    useEffect(() => {

        const timeId = setTimeout(() => {
            setIsShowSplash(false)
        }, 1500)
        return () => clearTimeout(timeId)
    }, [])

    return (
        <>
            <StatusBar translucent backgroundColor={appColors.white} barStyle="dark-content" />
            {isShowSplash ? <SplashScreen /> : (accessToken ? < MainNavigator /> : <AuthRouter />)}
        </>

    )
}

export default AppRouter