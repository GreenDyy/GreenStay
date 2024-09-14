import { View, Text, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import MainNavigator from './MainNavigator';
import { appColors } from '../constants/appColors';
import { SplashScreen } from '../screens';
import { getDataStorage } from '../utils/Utils';
import AuthRouter from './AuthRouter';
import { useSelector, useDispatch } from 'react-redux';
import { addAuth } from '../srcRedux/reducers/authReducer';

const AppRouter = () => {
    const [isShowSplash, setIsShowSplash] = useState(true)
    const authData = useSelector((state) => state.authReducer.authData)
    const dispatch = useDispatch()

    useEffect(() => {
        const timeId = setTimeout(() => {
            setIsShowSplash(false)
        }, 1500)
        return () => clearTimeout(timeId)
    }, [])

    useEffect(() => {
        handleCheckLogin()
    }, [])

    const handleCheckLogin = async () => {
        try {
            const authData = await getDataStorage('authData');
            console.log('auth data:', authData);
            if (authData) {
                dispatch(addAuth(authData));
            }
        } catch (error) {
            console.error('Error during login check:', error);
        }
    }


    return (
        <>
            <StatusBar translucent backgroundColor={appColors.white} barStyle="dark-content" />
            {isShowSplash ? <SplashScreen /> : (authData.accessToken ? < MainNavigator /> : <AuthRouter />)}
        </>

    )
}

export default AppRouter