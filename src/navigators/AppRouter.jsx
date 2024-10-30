import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import MainNavigator from './MainNavigator';

import { isBefore, parse } from 'date-fns';
import { showMessage } from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';
import { SplashScreen } from '../screens';
import { addAuth, removeAuth } from '../srcRedux/reducers/authReducer';
import { getDataStorage, removeItemDataStorage } from '../utils/Utils';
import AuthRouter from './AuthRouter';

const AppRouter = () => {
    const [isShowSplash, setIsShowSplash] = useState(true)
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
    const authData = useSelector((state) => state.authReducer.authData)
    const dispatch = useDispatch()

    useEffect(() => {
        const timeId = setTimeout(() => {
            setIsShowSplash(false)
        }, 1500)
        return () => clearTimeout(timeId)
    }, [])

    useEffect(() => {
        const timeId = setInterval(() => {
            handleCheckLogin()
        }, 1000 * 60 * 30)

        return () => clearInterval(timeId)
    }, [])

    const handleCheckLogin = async () => {
        try {
            const authData = await getDataStorage('authData');
            if (authData) {
                if (isTokenExpired(authData)) {
                    console.log('Token has expired');
                    showMessage({
                        message: 'Thông báo',
                        description: 'Phiên đăng nhập đã hết hạn',
                        type: 'warning'
                    })
                    dispatch(removeAuth())
                    removeItemDataStorage('authData')
                }
                else {
                    dispatch(addAuth(authData));
                    console.log('Token còn hạn');
                }
            }
        } catch (error) {
            console.error('Error during login check:', error);
        }
    }

    const isTokenExpired = (authData) => {
        if (!authData || !authData.expiresIn) return true; // Nếu không có dữ liệu hoặc không có thời gian hết hạn, coi như đã hết hạn
        const expirationTime = parse(authData.expiresIn, 'dd/MM/yyyy hh:mm:ss a', new Date());
        console.log(`expire: ${expirationTime} - date now: ${new Date()}`)
        return isBefore(expirationTime, new Date()); // Kiểm tra thời gian hết hạn

    };

    return (
        <>
            <StatusBar translucent backgroundColor={"transparent"} barStyle="dark-content" />

            {isShowSplash ? <SplashScreen /> : (authData.accessToken ? < MainNavigator /> : <AuthRouter />)}
        </>

    )
}

export default AppRouter