import { View, Text, Image, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ContainerComponent, HeaderComponent, LoadingAnimationComponent, LoadingEmptyModalComponent, LoadingModalComponent, RowComponent, SpaceComponent, TestAnimationComponent } from '../components'
import { images } from '../constants/images'
import { icons } from '../constants/icons'

const TestScreen = () => {

  return (
    <ContainerComponent>
      <HeaderComponent
        text='Animation'
        isBack
      />
      <LoadingAnimationComponent style={{
        transform: [
          { scale: 0.5 }
        ]
      }} />
      <TestAnimationComponent />
    </ContainerComponent>
  )
}

export default TestScreen