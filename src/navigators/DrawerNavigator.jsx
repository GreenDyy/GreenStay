import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'
import { DrawerCustom } from '../components'
import BottomTabNavigator from './BottomTabNavigator'

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator()

  return (
    <Drawer.Navigator screenOptions={{
      headerShown: false,
      drawerPosition: 'left',
    }}
      drawerContent={props => <DrawerCustom {...props} />}
    >
      <Drawer.Screen name='DrawerMain' component={BottomTabNavigator} />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator