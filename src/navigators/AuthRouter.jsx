import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { LoginScreen, SetUpScreen, SignUpScreen, VerifyAccountScreen } from '../screens'

const AuthRouter = () => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            animation: 'flip'
        }}>
            <Stack.Screen name='LoginScreen' component={LoginScreen} />
            <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
            <Stack.Screen name='VerifyAccountScreen' component={VerifyAccountScreen} />
            <Stack.Screen name='SetUpScreen' component={SetUpScreen} />

        </Stack.Navigator>
    )
}

export default AuthRouter