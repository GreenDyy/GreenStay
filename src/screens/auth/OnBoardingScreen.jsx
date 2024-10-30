import React, { useEffect, useState } from 'react'
import { Image, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import Swiper from 'react-native-swiper'
import { SpaceComponent, TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { appInfors } from '../../constants/appInfors'
import { images } from '../../constants/images'
import { globalStyle } from '../../styles/globalStyle'
import { appFonts } from '../../constants/appFonts'

const MAX_WALLPAPER = 2
const OnBoardingScreen = ({ navigation }) => {
    const [curIndex, setCurIndex] = useState(0)

    useEffect(() => {
        if (curIndex >= MAX_WALLPAPER) {
            console.log('ko dc nua dau')
        }
        else {
            console.log('manh len aaa')
        }
    }, [curIndex])

    return (
        <View style={[globalStyle.container]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <Swiper
                activeDotColor="#06D001"
                dotColor='#C0EBA6'
                dotStyle={{ borderColor: 'white', marginBottom: '20%' }}
                activeDotStyle={{ borderColor: 'white', marginBottom: '20%' }}
                loop={false}
                index={curIndex}
                onIndexChanged={(index) => {
                    setCurIndex(index);
                    console.log("Current index:", index);
                }}
            >
                <View style={localStyles.onBoarding}>
                    <Image source={images.onboarding1} style={[localStyles.image]} />
                    <View style={[localStyles.card]}>
                        <TextComponent text='Quản lý dễ dàng' color={appColors.white} isTitle fontSize={24} numberOfLines={99} textAlign='center' />
                        <SpaceComponent height={14} />
                        <TextComponent
                            text='Dễ dàng theo dõi và quản lý tất cả các phòng trọ chỉ trong vài cú chạm. Từ việc thêm phòng, chỉnh sửa thông tin cho đến việc kiểm tra tình trạng hiện tại, mọi thứ đều được thực hiện một cách nhanh chóng và tiện lợi.'
                            color={appColors.white} fontFamily={appFonts.mediumOpenSans}
                            textAlign='center' />
                    </View>
                </View>

                <View style={localStyles.onBoarding}>
                    <Image source={images.onboarding2} style={[localStyles.image]} />
                    <View style={[localStyles.card]}>
                        <TextComponent text='Bảo mật mạnh mẽ' color={appColors.white} isTitle fontSize={24} numberOfLines={99} textAlign='center' />
                        <SpaceComponent height={14} />
                        <TextComponent
                            text='Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Với các biện pháp bảo mật tiên tiến và mã hóa dữ liệu, bạn có thể yên tâm rằng mọi thông tin sẽ được lưu trữ an toàn và chỉ có bạn mới có quyền truy cập.'
                            color={appColors.white} fontFamily={appFonts.mediumOpenSans}
                            textAlign='center' />
                    </View>
                </View>

                <View style={localStyles.onBoarding}>
                    <Image source={images.onboarding3} style={[localStyles.image]} />
                    <View style={[localStyles.card]}>
                        <TextComponent text='Nhanh chóng và hiệu quả' color={appColors.white} isTitle fontSize={24} numberOfLines={99} textAlign='center' />
                        <SpaceComponent height={14} />
                        <TextComponent
                            text='Ứng dụng của chúng tôi được tối ưu hóa để mang đến cho bạn trải nghiệm mượt mà và nhanh chóng. Không còn thời gian chờ đợi! Từ việc thêm phòng mới đến gửi hóa đơn, mọi thao tác đều được thực hiện chỉ trong vài cú chạm. Hãy tận hưởng sự nhanh chóng ngay hôm nay!'
                            color={appColors.white} fontFamily={appFonts.mediumOpenSans}
                            textAlign='center'
                        />
                    </View>
                </View>
            </Swiper>

            {/* button bottom */}
            {
                curIndex < MAX_WALLPAPER ?
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        left: 0,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity
                            style={{
                                borderRadius: 30,
                                paddingVertical: 12,
                                paddingHorizontal: 40,

                            }}
                            onPress={() => navigation.navigate('LoginScreen')}>
                            <TextComponent text="Bỏ qua" color={appColors.gray2} fontFamily={appFonts.mediumOpenSans} fontSize={16} />
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={{
                                borderRadius: 30,
                                paddingVertical: 12,
                                paddingHorizontal: 40,
                                backgroundColor: appColors.primary,
                            }}
                            onPress={() => setCurIndex(curIndex + 1)}>
                            <TextComponent text="Tiếp" color={appColors.white} fontFamily={appFonts.mediumOpenSans} fontSize={16} />
                        </TouchableOpacity>

                    </View>
                    :
                    <TouchableOpacity style={{
                        borderRadius: 30,
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        backgroundColor: appColors.primary,
                        position: 'absolute',
                        bottom: 12,
                        right: '30%',
                        left: '30%',
                    }}
                        onPress={() => navigation.navigate('LoginScreen')}>
                        <TextComponent text='Bắt đầu nào!' color={appColors.white} textAlign='center' fontFamily={appFonts.semiBoldOpenSans} />
                    </TouchableOpacity>
            }

        </View>
    );
}

export default OnBoardingScreen

const localStyles = StyleSheet.create({
    onBoarding: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#557C56'
    },
    image: {
        width: appInfors.sizes.WIDTH,
        // height: appInfors.sizes.HEIGHT / 2,
        height: appInfors.sizes.HEIGHT,
        resizeMode: 'cover'
    },
    card: {
        borderRadius: 20,
        // backgroundColor: 'rgba(255,255,255,0.4)',
        backgroundColor: 'rgba(0,0,0,0.65)',
        width: appInfors.sizes.WIDTH * 0.8,
        height: appInfors.sizes.HEIGHT * 0.35,
        position: 'absolute',
        bottom: '20%',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})