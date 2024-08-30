import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { CustomerScreen } from '../screens'

const CustomerNavigator = () => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
        <Stack.Screen name='CustomerScreen' component={CustomerScreen}/>
       </Stack.Navigator>
    )
}

export default CustomerNavigator