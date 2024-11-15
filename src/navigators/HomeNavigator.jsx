import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { DetailPriceScreen, HomeScreen } from '../screens'
import ContractNavigator from './ContractNavigator'
import InvoiceNavigator from './InvoiceNavigator'
import TestScreen from '../screens/TestScreen'

const HomeNavigator = () => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}
            initialRouteName='HomeScreen'>
            <Stack.Screen name='HomeScreen' component={HomeScreen} />
            {/* dưới là 1 stack màn nha */}
            <Stack.Screen name='Contract' component={ContractNavigator} />
            <Stack.Screen name='Invoice' component={InvoiceNavigator} />
            <Stack.Screen name='TestScreen' component={TestScreen} />

        </Stack.Navigator>
    )
}

export default HomeNavigator