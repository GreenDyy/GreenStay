import { View, Text, StyleProp, ViewStyle, ScrollView, StatusBar, SafeAreaView } from 'react-native'
import React, { ReactNode } from 'react'
import { globalStyle } from '../styles/globalStyle'

interface Props {
    children: ReactNode
    isScroll?: boolean
    style?: StyleProp<ViewStyle>

}
const ContainerComponent = (props: Props) => {
    const { children, isScroll, style } = props

    return isScroll
        ?
        (
            <SafeAreaView style={{flex: 1}}>
                <ScrollView
                    style={[
                        globalStyle.container,
                        { marginTop: StatusBar.currentHeight },
                        style]
                    }
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            </SafeAreaView>

        )
        :
        (
            <SafeAreaView style={[globalStyle.container,
            { marginTop: StatusBar.currentHeight },
                style]}>
                {children}
            </SafeAreaView>
        )
}

export default ContainerComponent