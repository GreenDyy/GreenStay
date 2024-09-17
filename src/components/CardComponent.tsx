import React, { ReactNode } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { appColors } from '../constants/appColors';
import { globalStyle } from '../styles/globalStyle';

interface Props {
  children: ReactNode;
  bgColor?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void
}

const CardComponent = (props: Props) => {
  const { children, bgColor, style, onPress } = props;
  return (
    <TouchableOpacity
      style={[
        globalStyle.card,
        {
          backgroundColor: bgColor ?? appColors.white,
        },
        style,
      ]}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default CardComponent;