import { View, Text, Image, TouchableOpacity, Animated, StyleProp, ViewStyle } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ContainerComponent, RowComponent, SpaceComponent } from '.'
import { images } from '../constants/images'
import { icons } from '../constants/icons'

interface Props {
    style?: StyleProp<ViewStyle>
}

const LoadingAnimationComponent = (props: Props) => {
    const { style } = props
    const animatedValue1 = useRef(new Animated.Value(0)).current
    const animatedValue2 = useRef(new Animated.Value(0)).current
    const animatedValue3 = useRef(new Animated.Value(0)).current

    //tạo auto nảy lên xuống
    useEffect(() => {
        Animated.loop(
            Animated.stagger(250, [ // Thời gian trì hoãn cho từng hình
                Animated.sequence([
                    Animated.timing(animatedValue1, {
                        toValue: -30,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue1, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(animatedValue2, {
                        toValue: -30,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue2, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(animatedValue3, {
                        toValue: -30,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue3, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        ).start();
    }, [animatedValue1, animatedValue2, animatedValue3])



    return (
        <RowComponent style={style}>
            <Animated.Image source={icons.d}
                style={{
                    height: 30,
                    width: 30,
                    transform: [
                        { translateY: animatedValue1 }
                    ]
                }}
                resizeMode='contain' />

            <SpaceComponent width={10} />

            <Animated.Image source={icons.t}
                style={{
                    height: 30,
                    width: 30,
                    transform: [
                        { translateY: animatedValue2 }
                    ]
                }}
                resizeMode='contain' />

            <SpaceComponent width={10} />

            <Animated.Image source={icons.house4}
                style={{
                    height: 40,
                    width: 40,
                    transform: [
                        { translateY: animatedValue3 }
                    ]
                }}
                resizeMode='contain' />
        </RowComponent>
    )
}

export default LoadingAnimationComponent