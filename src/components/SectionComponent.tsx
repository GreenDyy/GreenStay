import { View, Text, StyleProp, ViewStyle } from 'react-native'
import React, { Children, ReactNode } from 'react'
import { globalStyle } from '../styles/globalStyle'

interface Props {
    children: ReactNode
    style?: StyleProp<ViewStyle>
}
const SectionComponent = (props: Props) => {
    const { children, style } = props

    return (
        <View style={[globalStyle.section, style]}>
            {children}
        </View>
    )
}

export default SectionComponent