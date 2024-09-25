import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { ContractScreen, DetailContractScreen } from '../screens'

const ContractNavigator = () => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='ContractScreen' component={ContractScreen} />
            <Stack.Screen name='DetailContractScreen' component={DetailContractScreen} />
        </Stack.Navigator>
    )
}

export default ContractNavigator