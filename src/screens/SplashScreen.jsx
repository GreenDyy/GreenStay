import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { ContainerComponent } from '../components'
import { appColors } from '../constants/appColors'

const SplashScreen = () => {
    return (
        <ContainerComponent style={{justifyContent:'center', alignItems:'center'}}>
            <Text>Đây là SplashScreen</Text>
            <ActivityIndicator color={appColors.primary} size={'large'}/>
        </ContainerComponent>
    )
}

export default SplashScreen