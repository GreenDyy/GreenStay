import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ContainerComponent, TextComponent, SpaceComponent, SectionComponent, ButtonComponent, HeaderComponent, RowComponent, SquareBorderComponent, LoadingModalComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import InputComponent from '../../components/InputComponent'
import { Clock } from 'iconsax-react-native'
import { showMessage } from 'react-native-flash-message'
import { apiSms } from '../../apis/apiDTHome'

const initCount = 60
const VerifyAccountScreen = ({ navigation, route }) => {
    const { phoneNumber, otp } = route.params
    const [realOtp, setRealOtp] = useState('')
    const [codeValues, setCodeValues] = useState([])
    const [curCode, setCurCode] = ''
    const [count, setCount] = useState(initCount)
    const [isLoading, setIsLoading] = useState(false)


    const ref1 = useRef()
    const ref2 = useRef()
    const ref3 = useRef()
    const ref4 = useRef()
    const ref5 = useRef()
    const timeId = useRef(null)

    useEffect(() => {
        setRealOtp(otp);
    }, [otp])

    useEffect(() => {
        ref1.current.focus()
    }, [])

    useEffect(() => {
        timeId.current = setInterval(() => {
            setCount(prevCount => {
                if (prevCount <= 1) {
                    clearInterval(timeId);
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000)

        return () => clearInterval(timeId.current)
    }, [])

    const handleGoToSetUp = () => {
        setIsLoading(true)
        if (codeValues.join("") !== realOtp) {
            showMessage({
                message: "Thông báo",
                description: "Mã OTP không chính xác",
                type: "danger",
            })
            setIsLoading(false)
        }
        else {
            navigation.navigate('SetUpScreen', { phoneNumber })
            console.log('Mã OTP bạn nhập là: ', codeValues.join(""))
            setIsLoading(false)
        }
    }

    const handleChangeCode = (index, value) => {
        const tempData = [...codeValues]
        tempData[index] = value
        setCodeValues(tempData)
    }

    const handleReSendOTP = async () => {
        setCount(initCount)
        clearInterval(timeId.current)
        timeId.current = setInterval(() => {
            setCount(prevCount => {
                if (prevCount <= 1) {
                    setRealOtp("")
                    clearInterval(timeId.current);
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000)
        const otp = String(Math.floor(10000 + Math.random() * 90000))
        setIsLoading(true)
        try {
            await apiSms(`/send-sms`, {
                toPhoneNumber: phoneNumber.replace("0", "+84"),
                message: otp
            }, 'post');
            setRealOtp(otp);
            console.log(`Mã OTP đã gửi: ${otp}`);
            showMessage({
                message: "Thông báo",
                description: "Mã OTP đã được gửi lại, vui lòng kiểm tra tin nhắn",
                type: "success",
            })
            setIsLoading(false)
        } catch (error) {
            console.error("Lỗi gửi OTP:", error);
            setIsLoading(false)
        }
    }

    return (
        <ContainerComponent>
            <HeaderComponent isBack />
            <SectionComponent>
                <TextComponent text='Xác minh số điện thoại' isTitle fontSize={32} style={{ textAlign: 'center' }} />
                <SpaceComponent height={10} />
                <TextComponent text={`Vui lòng nhập mã OTP chúng tôi vừa gửi đến ${phoneNumber}`} color={appColors.gray} style={{ textAlign: 'center' }} numberOfLines={3} />
            </SectionComponent>

            <SectionComponent>
                <RowComponent>
                    <SquareBorderComponent width={50} height={50}>
                        <TextInput
                            value={codeValues[0]}
                            placeholder="-"
                            style={styles.input}
                            keyboardType="number-pad"
                            maxLength={1}
                            onChangeText={(val) => {
                                handleChangeCode(0, val)
                                val && ref2.current.focus();
                            }}
                            ref={ref1}
                        />
                    </SquareBorderComponent>

                    <SquareBorderComponent width={50} height={50}>
                        <TextInput
                            value={codeValues[1]}
                            placeholder="-"
                            style={styles.input}
                            keyboardType="number-pad"
                            maxLength={1}
                            onChangeText={(val) => {
                                handleChangeCode(1, val)
                                val && ref3.current.focus();
                            }}
                            ref={ref2}
                        />
                    </SquareBorderComponent>

                    <SquareBorderComponent width={50} height={50}>
                        <TextInput
                            value={codeValues[2]}
                            placeholder="-"
                            style={styles.input}
                            keyboardType="number-pad"
                            maxLength={1}
                            onChangeText={(val) => {
                                handleChangeCode(2, val)
                                val && ref4.current.focus();
                            }}
                            ref={ref3}
                        />
                    </SquareBorderComponent>

                    <SquareBorderComponent width={50} height={50}>
                        <TextInput
                            value={codeValues[3]}
                            placeholder="-"
                            style={styles.input}
                            keyboardType="number-pad"
                            maxLength={1}
                            onChangeText={(val) => {
                                handleChangeCode(3, val)
                                val && ref5.current.focus();
                            }}
                            ref={ref4}
                        />
                    </SquareBorderComponent>

                    <SquareBorderComponent width={50} height={50}>
                        <TextInput
                            value={codeValues[4]}
                            placeholder="-"
                            style={styles.input}
                            keyboardType="number-pad"
                            maxLength={1}
                            onChangeText={(val) => {
                                handleChangeCode(4, val)
                            }}
                            ref={ref5}
                        />
                    </SquareBorderComponent>
                </RowComponent>
            </SectionComponent>

            <SectionComponent>
                <ButtonComponent text='Xác nhận OTP' onPress={handleGoToSetUp} style={{ borderRadius: 50 }} />
            </SectionComponent>

            <SectionComponent>
                <RowComponent style={{ justifyContent: 'center' }}>
                    <TextComponent text='Bạn chưa nhận được mã OTP? ' />
                    <SpaceComponent width={5} />
                    <ButtonComponent text='Gửi lại mã' type='link' onPress={handleReSendOTP} />
                </RowComponent>


                <RowComponent style={{ justifyContent: 'center', marginTop: 14 }}>
                    {
                        count != 0
                            ?
                            <>
                                <Clock size={16} color={appColors.gray} />
                                <SpaceComponent width={5} />
                                <TextComponent text={`${count.toString().length === 1 ? '0' + count : count} giây`} color={appColors.gray} />
                            </>
                            :
                            <TextComponent text='Mã đã hết hiệu lực, vui lòng ấn "Gửi lại mã"' color={appColors.gray} />
                    }
                </RowComponent>

            </SectionComponent>
            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default VerifyAccountScreen

const styles = StyleSheet.create({
    input: {
        textAlign: 'center'
    }
})