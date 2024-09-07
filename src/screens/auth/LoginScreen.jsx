import React, { useState } from 'react'
import { ButtonComponent, ContainerComponent, HeaderComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { setDataStorage } from '../../utils/Utils'
import InputComponent from '../../components/InputComponent'
import { Image } from 'react-native'
import { images } from '../../constants/images'

const LoginScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        await setDataStorage('accessToken', 'token')
    }

    return (
        <ContainerComponent>
            <HeaderComponent />
            <Image source={images.logo2} style={{ height: 250, width: 500, alignSelf: 'center' }} resizeMode='contain' />
            <SectionComponent>
                <InputComponent
                    title='Số điện thoại'
                    value={phoneNumber}
                    keyboardType='number-pad'
                    onChangeText={val => setPhoneNumber(val)}
                    onEndEditing={() => { }}
                    allowClear
                    isRequire
                />
                <SpaceComponent height={14} />
                <InputComponent
                    title='Mật khẩu'
                    value={password}
                    keyboardType='number-pad'
                    onChangeText={val => setPassword(val)}
                    onEndEditing={() => { }}
                    isPassword
                    isRequire
                />
            </SectionComponent>

            <SectionComponent>
                <ButtonComponent text='Đăng nhập' onPress={handleLogin} style={{ borderRadius: 50 }} />
                <SpaceComponent height={10} />
                <ButtonComponent text='Quên mật khẩu?' type='link' onPress={handleLogin} style={{ color: 'black', alignSelf: 'center' }} />

            </SectionComponent>

            <SpaceComponent height={100} />
            <SectionComponent >
                <RowComponent style={{ justifyContent: 'center' }}>
                    <TextComponent text='Bạn chưa có tài khoản? ' />
                    <ButtonComponent text='Đăng ký ngay!' type='link' onPress={() => { navigation.navigate('SignUpScreen') }} />
                </RowComponent>
            </SectionComponent>

        </ContainerComponent >
    )
}

export default LoginScreen