import React from 'react'
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import { appColors } from '../constants/appColors'
import { appFonts } from '../constants/appFonts'
import { globalStyle } from '../styles/globalStyle'
import TextComponent from './TextComponent'

interface Props {
    text: string
    style?: StyleProp<ViewStyle>
    onPress: () => void
}

const ButtonComponent = (props: Props) => {
    const { text, style, onPress } = props
    return (
        <TouchableOpacity style={[globalStyle.button, {}, style]}
            onPress={onPress}>
            <TextComponent text={text} color={appColors.white} fontFamily={appFonts.semiBoldOpenSans} />
        </TouchableOpacity>
    )
}

export default ButtonComponent