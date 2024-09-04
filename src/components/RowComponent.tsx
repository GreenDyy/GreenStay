import { View, Text, StyleProp, ViewStyle, TouchableOpacity } from 'react-native'
import React, { ReactNode } from 'react'
import { globalStyle } from '../styles/globalStyle'

interface Props {
    children: ReactNode,
    style?: StyleProp<ViewStyle>
    onPress?: () => void
}
const RowComponent = (props: Props) => {
    const { children, style, onPress } = props
    return onPress
        ?
        (
            <TouchableOpacity style={[globalStyle.row, style]} onPress={onPress}>
                {children}
            </TouchableOpacity>
        )
        :
        (
            <View style={[globalStyle.row, style]}>
                {children}
            </View>
        )
}

export default RowComponent