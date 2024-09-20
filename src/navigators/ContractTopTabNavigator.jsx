import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { ContractScreen, HomeScreen, ContractWithStatusScreen, InvoidceScreen, RoomScreen } from '../screens'
import { Book, House2 } from 'iconsax-react-native'
import { TextComponent } from '../components'
import { appFonts } from '../constants/appFonts'
import { appColors } from '../constants/appColors'

const ContractTopTabNavigator = () => {
    const Tab = createMaterialTopTabNavigator()
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarLabel: ({ color, focused }) => {
                    color = focused ? appColors.primary2 : appColors.gray
                    return (<TextComponent text={route.name} color={color} fontFamily={appFonts.semiBoldOpenSans} />)
                },
                tabBarIndicatorStyle: {
                    backgroundColor: appColors.primary,
                    height: 2,
                    width: '35%',
                    marginHorizontal: '8%'
                },
                tabBarItemStyle: {
                    // borderRightWidth: route.name === 'Đã thanh toán' && 0.3

                },
                tabBarStyle: {
                    justifyContent: 'center',
                    borderTopWidth: 1,
                    borderTopColor: appColors.gray2,
                    height: 50
                }
            })}
        >
            <Tab.Screen name="Còn trong hạn" component={ContractWithStatusScreen} initialParams={{ isRenting: true }} />
            <Tab.Screen name="Đã chấm dứt" component={ContractWithStatusScreen} initialParams={{ isRenting: false }} />
        </Tab.Navigator>
    )
}

export default ContractTopTabNavigator