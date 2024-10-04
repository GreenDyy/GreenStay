import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, HeaderComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { images } from '../../constants/images'
import { appColors } from '../../constants/appColors'
import { apiOwnerBuilding, apiSms } from '../../apis/apiDTHome'
import { showMessage } from 'react-native-flash-message'

const SignUpScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleNextStep = async () => {
    setIsLoading(true)
    //xử lý chưa nhập
    if (!phoneNumber) {
      showMessage({
        message: "Thông báo",
        description: "Vui lòng nhập số điện thoại",
        type: "warning",
      })
      setIsLoading(false)
      return
    }
    //xử lý nhập sai

    //B0 check sdt 
    const checkPhoneNumber = await apiOwnerBuilding(`/check-exist-phone-number/${phoneNumber}`);
    if (!checkPhoneNumber.status) {
      showMessage({
        message: 'Thông báo',
        description: 'Số điện thoại không khả dụng',
        type: 'warning',
      });
      setIsLoading(false);
      return;
    }

    //oke hết thì làm
    try {
      const otp = String(Math.floor(10000 + Math.random() * 90000))
      await apiSms(`/send-sms`, {
        toPhoneNumber: phoneNumber.replace("0", "+84"),
        message: otp
      }, 'post')
      navigation.navigate('VerifyAccountScreen', { phoneNumber, otp })

      console.log(`Đến bước xác nhận OTP cho ${phoneNumber.replace("0", "+84")}, otp là: ${otp}`,)
      setIsLoading(false)
    }
    catch (e) {
      showMessage({
        message: "Thông báo",
        description: "Lỗi khi gửi OTP",
        type: "danger",
      })
      console.error(e)
      setIsLoading(false)
    }
  }

  const testFunc = async () => {
    try {
      const checkPhoneNumber = await apiOwnerBuilding(`/check-exist-phone-number/${phoneNumber}`);
      if (!checkPhoneNumber.status) {
        showMessage({
          message: 'Thông báo',
          description: 'Số điện thoại không khả dụng',
          type: 'warning',
        });
        setIsLoading(false);
        return;
      }

      navigation.navigate('SetUpScreen', { phoneNumber })
    }
    catch (e) {
      console.error(e)
    }
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
        <ButtonComponent text='Tiếp tục' onPress={testFunc} style={{ borderRadius: 50 }} />
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