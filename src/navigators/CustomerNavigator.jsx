import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { CustomerScreen, DetailCustomerScreen } from '../screens'

const CustomerNavigator = () => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='CustomerScreen' component={CustomerScreen} />
            <Stack.Screen name='DetailCustomerScreen' component={DetailCustomerScreen} />
        </Stack.Navigator>
    )
}

export default CustomerNavigator