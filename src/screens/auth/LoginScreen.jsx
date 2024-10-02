import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, HeaderComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { setDataStorage } from '../../utils/Utils'
import InputComponent from '../../components/InputComponent'
import { Image } from 'react-native'
import { images } from '../../constants/images'
import { useDispatch } from 'react-redux'
import { addAuth } from '../../srcRedux/reducers/authReducer'
import { apiOwnerAccount } from '../../apis/apiDTHome'
import { showMessage } from 'react-native-flash-message'

const LoginScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {

    }, [])

    const handleLogin = async () => {
        setIsLoading(true)
        try {
            //check rỗng
            if (!phoneNumber || !password) {
                showMessage({
                    message: 'Thông báo',
                    description: 'Vui lòng nhập đầy đủ thông tin',
                    type: 'warning'
                })
                setIsLoading(false)
                return
            }
            const res = await apiOwnerAccount(`/login`, { phoneNumber, password }, 'post')
            if (res) {
                const authData = {
                    ownerId: res.ownerId,
                    ownerName: res.ownerName,
                    email: res.email,
                    phoneNumber: res.phoneNumber,
                    photoUrl: res.photoUrl,
                    accessToken: 'laytubackend'
                }
                dispatch(addAuth(authData))

                await setDataStorage('authData', authData)

                showMessage({
                    message: 'Thông báo',
                    description: 'Đăng nhập thành công',
                    type: 'success'
                })
            }
            else {
                showMessage({
                    message: 'Thông báo',
                    description: 'Số điện thoại hoặc mật khẩu không chính xác',
                    type: 'danger'
                })
            }
            setIsLoading(false)
        }
        catch (error) {
            showMessage({
                message: 'Thông báo',
                description: 'Số điện thoại hoặc mật khẩu không chính xác',
                type: 'danger'
            })
            setIsLoading(false)
        }
    }

    return (
        <ContainerComponent>
            <HeaderComponent />
            <Image source={images.logo2} style={{ height: 250, width: 500, alignSelf: 'center' }} resizeMode='contain' />
            <SectionComponent>
                <InputComponent
                    title='Số điện thoại'
                    placeholder='Nhập số điện thoại'
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
                      placeholder='Nhập mật khẩu'
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
            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent >
    )
}

export default LoginScreen