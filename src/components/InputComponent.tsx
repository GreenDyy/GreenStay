import { Eye, EyeSlash, Forbidden2 } from 'iconsax-react-native'
import React, { ReactNode, useState } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import { appColors } from '../constants/appColors'
import RowComponent from './RowComponent'
import SpaceComponent from './SpaceComponent'
import TextComponent from './TextComponent'
import { appFonts } from '../constants/appFonts'

interface Props {
  allowClear: boolean
  isPassword: boolean
  placeholder: string
  value: string
  numberOfLines?: number
  onChangeText: (val: any) => void
  onEndEditing: () => void
  iconLeft?: ReactNode
  title?: string
  keyboardType?: 'number-pad'
  isRequire?: boolean
}
const InputComponent = (props: Props) => {
  const { title, allowClear, placeholder, isPassword, value, numberOfLines, onChangeText, onEndEditing, iconLeft, keyboardType, isRequire } = props
  const [isShowPass, setIsShowPass] = useState(false)

  const handlePressRightButton = () => {
    if (isPassword) {
      setIsShowPass(!isShowPass)
    }
    if (allowClear) {
      onChangeText('')
    }
  }

  return (
    <>
      {title && (
        <>
          <RowComponent style={{ justifyContent: 'flex-start' }}>
            <TextComponent text={title} fontFamily={appFonts.semiBoldOpenSans} />
            {isRequire && <TextComponent text=' *' color={appColors.danger} />}
          </RowComponent>
          <SpaceComponent height={8} />
        </>
      )}
      <View style={[
        {
          width: '100%',
          minHeight: 50,
          borderWidth: 1,
          borderColor: appColors.gray3,
          borderRadius: 8,
          paddingHorizontal: 10
        }
      ]}>
        <RowComponent>
          <RowComponent style={{ justifyContent: 'flex-start', flex: 1 }}>
            {iconLeft}
            <SpaceComponent width={2} />
            <TextInput
              style={{
                flex: 1
              }}
              value={value}
              placeholder={placeholder}
              placeholderTextColor={appColors.gray2}
              numberOfLines={numberOfLines ?? 1}
              multiline={numberOfLines ? true : false}
              onChangeText={val => onChangeText(val)}
              onEndEditing={onEndEditing}
              secureTextEntry={isPassword && !isShowPass}
              keyboardType={keyboardType ?? 'default'}
            />
          </RowComponent>
          <SpaceComponent width={2} />
          {/* nút phải */}
          {isPassword
            ?
            <TouchableOpacity onPress={handlePressRightButton}>
              {isShowPass ? <EyeSlash size={20} color={appColors.gray} /> : <Eye size={20} color={appColors.gray} />}
            </TouchableOpacity>
            :
            (value && allowClear) &&
            <TouchableOpacity onPress={handlePressRightButton}>
              <Forbidden2 size={20} color={appColors.gray} />
            </TouchableOpacity>
          }

        </RowComponent>
      </View>
    </>

  )
}

export default InputComponent