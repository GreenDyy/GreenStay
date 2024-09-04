import { View, Text, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import MainNavigator from './MainNavigator';
import { appColors } from '../constants/appColors';
import { SplashScreen } from '../screens';

const AppRouter = () => {
    const [isShowSplash, setIsShowSplash] = useState(true)

    useEffect(() => {
        const timeId = setTimeout(() => {
            setIsShowSplash(false)
        }, 1500)
        return () => clearTimeout(timeId)
    }, [])

    return (
        <>
            <StatusBar translucent backgroundColor={appColors.white} barStyle="dark-content" />
            {isShowSplash ? <SplashScreen /> : <MainNavigator />}
        </>

    )
}

export default AppRouter