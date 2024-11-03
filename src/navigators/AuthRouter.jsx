import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { LoginScreen, OnBoardingScreen, SetUpScreen, SignUpScreen, VerifyAccountScreen } from '../screens'
import { getDataStorage, setDataStorage } from '../utils/Utils';

const AuthRouter = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
    const Stack = createNativeStackNavigator()

    useEffect(() => {
        checkFirstLaunch()
    }, [])

    const checkFirstLaunch = async () => {
        const isFirst = await getDataStorage('isFirstLaunch')
        if (isFirst === null) {
            //đây là lần đầu
            setIsFirstLaunch(true)
            await setDataStorage('isFirstLaunch', 'hihi')
            console.log('lần đầu nè')
        }
        else {
            setIsFirstLaunch(false)
            console.log('lần thứ n rùi :<')
        }
    }

    if (isFirstLaunch === null) {
        return null;
    }

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            animation: 'flip'
        }}>
            {isFirstLaunch && <Stack.Screen name='OnBoardingScreen' component={OnBoardingScreen} />}
            <Stack.Screen name='LoginScreen' component={LoginScreen} />
            <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
            <Stack.Screen name='VerifyAccountScreen' component={VerifyAccountScreen} />
            <Stack.Screen name='SetUpScreen' component={SetUpScreen} />

        </Stack.Navigator>
    )
}

export default AuthRouter