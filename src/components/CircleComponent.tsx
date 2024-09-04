import { View, Text, TouchableOpacity, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import React, { ReactNode } from 'react';
import { appColors } from '../constants/appColors';

interface Props {
    size?: number;
    children: ReactNode;
    color?: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}

const CircleComponent = (props: Props) => {
    const { size, color, onPress, children, style } = props;

    const localStyle: StyleProp<ViewStyle> = {
        width: size ?? 40,
        height: size ?? 40,
        backgroundColor: color ?? appColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        overflow: 'hidden'
    };

    return onPress ? (
        <TouchableOpacity style={[localStyle, style]} onPress={onPress}>
            {children}
        </TouchableOpacity>
    ) : (
        <View style={[localStyle, style]}>{children}</View>
    );
};

export default CircleComponent;
