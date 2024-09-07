import { View, Text, ActivityIndicator, Image } from 'react-native'
import React from 'react'
import { ContainerComponent } from '../components'
import { appColors } from '../constants/appColors'
import { images } from '../constants/images'

const SplashScreen = () => {
    return (
        <ContainerComponent style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image source={images.logo2} style={{ height: '80%', width:  '80%'}} resizeMode='contain' />
            <ActivityIndicator 
            color={appColors.primary}
             size={'large'}  
             style={{
                position:'absolute',
                bottom: '35%'
             }}/>
        </ContainerComponent>
    )
}

export default SplashScreen