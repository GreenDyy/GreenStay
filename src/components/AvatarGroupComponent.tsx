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

// const dataAvatarGroup = [
//     {
//         id: 1,
//         imageUrl: 'https://i.pinimg.com/736x/28/dc/36/28dc36d443030e5222e4b39118f18d4e.jpg'
//     },
//     {
//         id: 2,
//         imageUrl: 'https://i.pinimg.com/236x/29/eb/91/29eb91eea74ada9d3cbe4d31b6c83aff.jpg'
//     },
//     {
//         id: 3,
//         imageUrl: 'https://i.pinimg.com/236x/0f/35/2a/0f352aaa89b3bba0879f18ed1b476bbe.jpg'
//     },
//     {
//         id: 4,
//         imageUrl: 'https://i.pinimg.com/474x/8b/09/f0/8b09f0c3027fec4fa72c6e0879195d09.jpg'
//     },
// ]

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