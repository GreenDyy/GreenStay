import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeNavigator from './HomeNavigator'
import { Home, People } from 'iconsax-react-native'
import { appColors } from '../constants/appColors'
import CustomerNavigator from './CustomerNavigator'
import { TextComponent } from '../components'

const BottomTabNavigator = () => {
    const Tab = createBottomTabNavigator()
    return (
        <Tab.Navigator screenOptions={({ route, navigation }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                let icon
                color = focused ? appColors.green1 : appColors.gray
                size = 22
                switch (route.name) {
                    case 'Trang chủ':
                        icon = <Home size={size} color={color} />
                        break
                    case 'Người thuê':
                        icon = <People size={size} color={color} />
                        break
                    case 'Trang chủ':
                        icon = <Home size={size} color={color} />
                        break
                    default:
                        break
                }
                return (
                    icon
                )
            },

            tabBarLabel: ({ color, focused, position }) => {
                color = focused ? appColors.green1 : appColors.gray
                return (
                    <TextComponent text={route.name} color={color}/>
                )
            }
        })}>
            <Tab.Screen name='Trang chủ' component={HomeNavigator} />
            <Tab.Screen name='Người thuê' component={CustomerNavigator} />
        </Tab.Navigator>
    )
}

export default BottomTabNavigator