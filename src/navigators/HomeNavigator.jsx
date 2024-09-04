import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { DetailPriceScreen, HomeScreen } from '../screens'

const HomeNavigator = () => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='HomeScreen' component={HomeScreen} />
            <Stack.Screen name='DetailPriceScreen' component={DetailPriceScreen} />
        </Stack.Navigator>
    )
}

export default HomeNavigator