import React from 'react'
import RowComponent from './RowComponent'
import TextComponent from './TextComponent'
import { appColors } from '../constants/appColors'
import { ArrowRight2 } from 'iconsax-react-native'
import { StyleProp, ViewStyle } from 'react-native'

interface Props {
  title: string
  style?: StyleProp<ViewStyle>
  onPress?: () => void
}

const TabBarComponent = (props: Props) => {
  const { title, onPress, style } = props
  return (
    <RowComponent style={style}>
      <TextComponent isTitle text={title} fontSize={18} />
      {onPress && <RowComponent onPress={onPress}>
        <TextComponent text='Xem tất cả' fontSize={12} color={appColors.gray} />
        <ArrowRight2 size={14} color={appColors.gray} variant='Bold' />
      </RowComponent>}
    </RowComponent>
  )
}

export default TabBarComponent