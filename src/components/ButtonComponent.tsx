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
    type?: 'primary' | 'link'
    disabled?: boolean
}

const ButtonComponent = (props: Props) => {
    const { text, style, onPress, type = 'primary', disabled } = props
    return (
        <>
            {type === 'primary' ?
                <TouchableOpacity disabled={disabled} style={[globalStyle.button, {}, style]}
                    onPress={onPress}>
                    <TextComponent text={text} color={appColors.white} fontFamily={appFonts.semiBoldOpenSans} />
                </TouchableOpacity>
                :
                <TouchableOpacity disabled={disabled} onPress={onPress}>
                    <TextComponent text={text} color={appColors.primary} fontFamily={appFonts.mediumOpenSans}
                        style={[style, {
                            textDecorationLine: 'underline',

                        }]} />
                </TouchableOpacity>
            }</>
    )
}

export default ButtonComponent