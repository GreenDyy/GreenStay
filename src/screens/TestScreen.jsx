import { View, Text } from 'react-native'
import React from 'react'
import { ContainerComponent, SectionComponent, TextComponent } from '../components'

const TestScreen = () => {
  return (
    <ContainerComponent>
      <SectionComponent>
        <TextComponent text='Test' />
      </SectionComponent>
    </ContainerComponent>
  )
}

export default TestScreen