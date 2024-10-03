import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, HeaderComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { images } from '../../constants/images'
import { appColors } from '../../constants/appColors'

const SignUpScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {

  }, [])

  const handleChangeValue = (key, value) => {
    let temp = { ...owner }
    temp[key] = value
    setAccount(temp)
  }

  const handleNextStep = () => {
    navigation.navigate('VerifyAccountScreen', { phoneNumber })
    console.log(`Đến bước xác nhận OTP cho ${phoneNumber}`)
  }

  return (
    <ContainerComponent>
      <HeaderComponent />
      {/* <Image source={images.logo2} style={{ height: 250, width: 500, alignSelf: 'center' }} resizeMode='contain' /> */}
      <SectionComponent>
        <TextComponent text='Đăng ký mới' isTitle fontSize={32} style={{ textAlign: 'center' }} />
        <SpaceComponent height={10} />
        <TextComponent text='Vui lòng nhập số điện thoại chủ căn hộ' color={appColors.gray} style={{ textAlign: 'center' }} />
      </SectionComponent>
      <SectionComponent>
        <InputComponent
          title='Số điện thoại'
          placeholder='Nhập số điện thoại'
          value={phoneNumber}
          keyboardType='number-pad'
          onChangeText={val => setPhoneNumber(val)}
          allowClear
          isRequire
        />
      </SectionComponent>

      <SectionComponent>
        <ButtonComponent text='Xác nhận' onPress={handleNextStep} style={{ borderRadius: 50 }} />
      </SectionComponent>

      <SpaceComponent height={100} />
      <SectionComponent >
        <RowComponent style={{ justifyContent: 'center' }}>
          <TextComponent text='Bạn đã có tài khoản? ' />
          <ButtonComponent text='Đăng nhập ngay!' type='link' onPress={() => { navigation.navigate('LoginScreen') }} />
        </RowComponent>
      </SectionComponent>
      <LoadingModalComponent visible={isLoading} />
    </ContainerComponent >
  )
}

export default SignUpScreen