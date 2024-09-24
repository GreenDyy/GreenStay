import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { AddInvoiceScreen, InvoidceScreen } from '../screens'

// thằng này con của HomeNavigator
const InvoiceNavigator = () => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='InvoiceScreen' component={InvoidceScreen} />
            <Stack.Screen name='AddInvoiceScreen' component={AddInvoiceScreen} />
        </Stack.Navigator>
    )
}

export default InvoiceNavigator