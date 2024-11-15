import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import RowComponent from './RowComponent'
import TextComponent from './TextComponent'
import { appInfors } from '../constants/appInfors'
import { appColors } from '../constants/appColors'

const TestAnimationComponent = () => {

    const animatedValue = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current
    const [greenHeight, setGreenHeight] = useState(0)
    const [greenWidth, setGreenWidth] = useState(0)

    const moveBox = (x: number, y: number) => {
        Animated.spring(animatedValue, {
            toValue: { x, y },
            useNativeDriver: true
        }).start()
    }

    return (
        <View style={{ height: 600, width: '100%', backgroundColor: 'gray' }}>

            <RowComponent style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ borderRadius: 10, padding: 5, backgroundColor: 'purple' }}
                    onPress={() => moveBox(0, 0)}>
                    <TextComponent text='Trên trái' color='white' />
                </TouchableOpacity>

                <TouchableOpacity style={{ borderRadius: 10, padding: 5, backgroundColor: 'purple' }}
                    onPress={() => moveBox(greenWidth - 100, 0)}>
                    <TextComponent text='Trên phải' color='white' />
                </TouchableOpacity>

                <TouchableOpacity style={{ borderRadius: 10, padding: 5, backgroundColor: 'purple' }}
                    onPress={() => moveBox(greenWidth / 2 - 50, greenHeight / 2 - 50)}>
                    <TextComponent text='Giữa' color='white' />
                </TouchableOpacity>

                <TouchableOpacity style={{ borderRadius: 10, padding: 5, backgroundColor: 'purple' }}
                    onPress={() => moveBox(0, greenHeight - 100)}>
                    <TextComponent text='Dưới trái' color='white' />
                </TouchableOpacity>

                <TouchableOpacity style={{ borderRadius: 10, padding: 5, backgroundColor: 'purple' }}
                    onPress={() => moveBox(greenWidth - 100, greenHeight - 100)}>
                    <TextComponent text='Dưới phải' color='white' />
                </TouchableOpacity>
            </RowComponent>
            {/* vùng animation */}
            <View style={{ flex: 1, backgroundColor: appColors.primary }}
                onLayout={(e) => {
                    setGreenHeight(e.nativeEvent.layout.height)
                    setGreenWidth(e.nativeEvent.layout.width)
                }}>
                <Animated.View
                    style={{
                        backgroundColor: 'red',
                        height: 100,
                        width: 100,
                        position: 'absolute',
                        transform: [
                            { translateX: animatedValue.x },
                            { translateY: animatedValue.y },
                        ],
                        zIndex: 999
                    }}
                >
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => Alert.alert('Bạn bắt dc tôi rồi')}>

                    </TouchableOpacity>
                </Animated.View>

                <TextComponent text='Test animation cùng GreenD' color='white' />
            </View>
        </View>
    )
}

export default TestAnimationComponent
