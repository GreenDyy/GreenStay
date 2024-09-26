import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Building3, DocumentText, House2, People, ScanBarcode } from 'iconsax-react-native'
import React from 'react'
import { View } from 'react-native'
import { CircleComponent, TextComponent } from '../components'
import { appColors } from '../constants/appColors'
import { appFonts } from '../constants/appFonts'
import { globalStyle } from '../styles/globalStyle'
import CustomerNavigator from './CustomerNavigator'
import HomeNavigator from './HomeNavigator'
import RoomNavigator from './RoomNavigator'
import TestScreen from '../screens/TestScreen'
import InvoiceNavigator from './InvoiceNavigator'

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
                                <CircleComponent size={50} style={[globalStyle.shadow]} color={appColors.primary}>
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
            <Tab.Screen name='Phòng' component={RoomNavigator}
                // listeners={({ navigation }) => ({
                //     tabPress: e => {
                //         // Ngăn chặn mặc định để không chuyển trang ngay lập tức
                //         // e.preventDefault();
                //         navigation.reset({
                         
                //             routes: [{ name: 'RoomScreen' }], 
                //         });
                //     },
                // })} 
                />
            <Tab.Screen name='Main' component={TestScreen} />
            <Tab.Screen name='Người thuê' component={CustomerNavigator} />
            <Tab.Screen name='Hoá đơn' component={InvoiceNavigator} />

        </Tab.Navigator>
    )
}

export default BottomTabNavigator