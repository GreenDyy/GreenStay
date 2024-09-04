import { View, Text, TouchableOpacity } from 'react-native'
import React, { ReactNode } from 'react'
import { appColors } from '../constants/appColors'

interface Props {
    height?: number
    width?: number
    backgroundColor?: string
    children?: ReactNode
    onPress?: () => void
}
const SquareBorderComponent = (props: Props) => {
    const { height, width, backgroundColor, children, onPress } = props
    return onPress
        ?
        (
            <TouchableOpacity style={{
                height: height ?? 36,
                width: width ?? 36,
                backgroundColor: backgroundColor,
                borderWidth: backgroundColor ? 0 : 1,
                borderColor: appColors.gray2,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center'
            }}
            onPress={onPress}>
                {children}
            </TouchableOpacity>
        )
        :
        (
            <View style={{
                height: height ?? 36,
                width: width ?? 36,
                backgroundColor: backgroundColor,
                borderWidth: backgroundColor ? 0 : 1,
                borderColor: appColors.gray2,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {children}
            </View>
        )
}

export default SquareBorderComponent