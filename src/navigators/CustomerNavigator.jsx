import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { CustomerScreen, DetailCustomerScreen } from '../screens'

const CustomerNavigator = () => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
        <Stack.Screen name='CustomerScreen' component={CustomerScreen}/>
        <Stack.Screen name='DetailCustomerScreen' component={DetailCustomerScreen}/>
       </Stack.Navigator>
    )
}

export default CustomerNavigator