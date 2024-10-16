import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

interface Props {
    height?: number
    width?: number
    borderRadius?: number
    backgroundColor?: string
    highlightColor?: string
    duration?: number
}
const SkeletonComponent = (props: Props) => {
    const { height, width, borderRadius, backgroundColor, highlightColor, duration } = props
    const animatedValue = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: duration ?? 1000,
                    useNativeDriver: true
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: duration ?? 1000,
                    useNativeDriver: true
                }),
            ])
        ).start()
    }, [animatedValue])
    return (
        <Animated.View style={{
            height: height ?? 50,
            width: width ?? 50,
            borderRadius: borderRadius ?? 8,
            backgroundColor: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [backgroundColor ?? '#E1E9EE', highlightColor ?? '#F2F8FC']
            })
        }}>
        </Animated.View>
    )
}

export default SkeletonComponent