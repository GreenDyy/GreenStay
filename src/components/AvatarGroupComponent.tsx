import { View, Text, Image, StyleProp, ViewStyle } from 'react-native'
import React from 'react'
import RowComponent from './RowComponent'
import CircleComponent from './CircleComponent'
import { appColors } from '../constants/appColors'

interface Props {
    size?: number
    data: [{
        photoUrl: string
    }]
}


const AvatarGroupComponent = (props: Props) => {
    const { size, data } = props
    return (
        <RowComponent style={{ justifyContent: 'flex-start' }}>
            {data.map((item, index) => {
                return (
                    <CircleComponent color={appColors.white} key={index} size={size ?? 24} style={{
                        borderWidth: 1,
                        borderColor: appColors.white,
                        marginLeft: index !== 0 ? -10 : 0,
                        zIndex: 10 - index
                    }}>
                        <Image source={{ uri: item.photoUrl }} resizeMode='cover' style={{ height: size ?? 24, width: size ?? 24 }} />
                    </CircleComponent>
                )
            })}
        </RowComponent>
    )
}

export default AvatarGroupComponent