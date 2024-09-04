import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native'
import React from 'react'
import { AddCircle } from 'iconsax-react-native'
import { appColors } from '../constants/appColors'

interface Props {
    onPress: () => void
    style?: StyleProp<ViewStyle>
}
const FloatAddButtonComponent = (props: Props) => {
    const { onPress, style } = props
    return (
        <TouchableOpacity style={[
            {
                position: 'absolute',
                bottom: 24,
                right: 24
            },
            style
        ]}
            onPress={onPress}>
            <AddCircle size={55} color={appColors.primary} variant='Bold' />
        </TouchableOpacity>
    )
}

export default FloatAddButtonComponent