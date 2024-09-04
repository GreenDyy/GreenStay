import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Building3, DocumentText, Home2, House2, People, ScanBarcode } from 'iconsax-react-native'
import React from 'react'
import { CircleComponent, TextComponent } from '../components'
import { appColors } from '../constants/appColors'
import { appFonts } from '../constants/appFonts'
import CustomerNavigator from './CustomerNavigator'
import HomeNavigator from './HomeNavigator'
import RoomNavigator from './RoomNavigator'
import { Image, View } from 'react-native'
import { globalStyle } from '../styles/globalStyle'

const BottomTabNavigator = () => {
    const Tab = createBottomTabNavigator()

    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
                height: 56,
                justifyContent: 'center',
                alignItems: 'center'
            },
            tabBarIconStyle: {
                marginBottom: 0,
                marginTop: 8
            },
            tabBarIcon: ({ focused, color, size }) => {
                let icon
                color = focused ? appColors.primary2 : appColors.gray
                size = 22
                switch (route.name) {
                    case 'Trang chủ':
                        icon = <House2 size={size} color={color} variant='Bold' />
                        break
                    case 'Người thuê':
                        icon = <People size={size} color={color} variant='Bold' />
                        break
                    case 'Phòng':
                        icon = <Building3 size={size} color={color} variant='Bold' />
                        break
                    case 'Main':
                        icon = (
                            <View style={{ paddingBottom: 55 }}>
                                <CircleComponent size={50} style={[globalStyle.shadow]}>
                                    <ScanBarcode size={size + 6} color={appColors.white} variant='Bold' />
                                </CircleComponent>
                            </View>
                        );
                        break
                    case 'Hoá đơn':
                        icon = <DocumentText size={size} color={color} variant='Bold' />
                        break
                    default:
                        break
                }
                return (
                    icon
                )
            },

            tabBarLabel: ({ color, focused }) => {
                color = focused ? appColors.primary2 : appColors.gray
                return (
                    // (focused && route.name !== 'Main') && <TextComponent text={route.name} color={color} fontFamily={appFonts.semiBoldOpenSans} fontSize={12}
                    //     style={{ marginBottom: 10 }} />
                    route.name !== 'Main' && <TextComponent text={route.name} color={color} fontFamily={appFonts.semiBoldOpenSans} fontSize={12}
                        style={{ marginBottom: 8 }} />
                )
            }
        })}>
            <Tab.Screen name='Trang chủ' component={HomeNavigator} />
            <Tab.Screen name='Phòng' component={RoomNavigator} />
            <Tab.Screen name='Main' component={CustomerNavigator} />
            <Tab.Screen name='Người thuê' component={CustomerNavigator} />
            <Tab.Screen name='Hoá đơn' component={RoomNavigator} />

        </Tab.Navigator>
    )
}

export default BottomTabNavigator