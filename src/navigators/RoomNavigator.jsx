import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { DetailRoomScreen, RoomScreen } from '../screens'

const RoomNavigator = () => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='RoomScreen' component={RoomScreen} />
            <Stack.Screen name='DetailRoomScreen' component={DetailRoomScreen} />
        </Stack.Navigator>
    )
}

export default RoomNavigator