import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { DetailPriceScreen, HomeScreen } from '../screens'
import ContractNavigator from './ContractNavigator'
import InvoiceNavigator from './InvoiceNavigator'

const HomeNavigator = () => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}
            initialRouteName='HomeScreen'>
            <Stack.Screen name='HomeScreen' component={HomeScreen} />
            <Stack.Screen name='DetailPriceScreen' component={DetailPriceScreen} />
            {/* dưới là 1 stack màn nha */}
            <Stack.Screen name='Contract' component={ContractNavigator} />
            <Stack.Screen name='Invoice' component={InvoiceNavigator} />

        </Stack.Navigator>
    )
}

export default HomeNavigator