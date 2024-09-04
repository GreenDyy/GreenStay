import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { RoomScreen } from '../screens'

const RoomNavigator = () => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='RoomScreen' component={RoomScreen} />
        </Stack.Navigator>
    )
}

export default RoomNavigator