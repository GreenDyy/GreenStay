import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { DetailInvoiceScreen, InvoidceScreen } from '../screens'

// thằng này con của HomeNavigator
const InvoiceNavigator = () => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='InvoiceScreen' component={InvoidceScreen} />
            <Stack.Screen name='DetailInvoiceScreen' component={DetailInvoiceScreen} />
        </Stack.Navigator>
    )
}

export default InvoiceNavigator