import { ArrowCircleRight, Drop, Edit, Flash } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, View } from 'react-native'
import { apiCustomer, apiMemberOfRental, apiRental, apiRoom } from '../../apis/apiDTHome'
import { ButtonComponent, CircleComponent, ContainerComponent, HeaderComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { appFonts } from '../../constants/appFonts'
import { images } from '../../constants/images'
import { globalStyle } from '../../styles/globalStyle'
import { Text } from 'react-native-svg'
import { checkNamNhuan, getDate } from '../../utils/Utils'

const initRoom = {
    "roomId": 1,
    "roomName": "Phòng 1",
    "roomPrice": 1300000,
    "waterAfter": 100,
    "waterBefore": 90,
    "powerAfter": 500,
    "powerBefore": 450,
    "photoUrl": "",
    "isAvailable": false,
    "createdAt": "2024-09-09T21:26:22.273",
    "updatedAt": "2024-09-09T21:26:22.273"
}

const DetailRoomScreen = ({ navigation, route }) => {
    const { roomId } = route.params
    const [dataRoom, setDataRoom] = useState(initRoom)
    const [dataCustomers, setDataCustomers] = useState([])
    const [startDate, setStartDate] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchDataRoom()
    }, [])

    useEffect(() => {
        fetchDataMemberOfRoom()
    }, [dataRoom])

    useEffect(() => {
        console.log('rental get-by-room:', startDate)
    }, [startDate])

    useEffect(() => {
        const fetchRental = async () => {
            const res = await apiRental(`/get-by-room-and-status/${roomId}/true`)
            if (res && res.startDate) {
                setStartDate(new Date(res.startDate));
            }
        }
        fetchRental()
    }, [dataRoom])

    const fetchDataRoom = async () => {
        setIsLoading(true)
        try {
            const data = await apiRoom(`/${roomId}`)
            setDataRoom(data)
            console.log('data room nè: ', data)
            setIsLoading(false)
        }
        catch (e) {
            setIsLoading(false)
            console.log(e)
        }
    }

    const fetchDataMemberOfRoom = async () => {
        setIsLoading(true)
        try {
            if (!dataRoom.isAvailable) {
                const rental = await apiRental(`/get-by-room-and-status/${roomId}/true`);
                const members = await apiMemberOfRental(`/get-all-by-rental/${rental.rentalId}`);
                const newMembers = []
                for (const customer of members) {
                    const cus = await apiCustomer(`/${customer.customerId}`)
                    newMembers.push({ ...cus })
                }
                console.log('cus nè:', newMembers)
                setDataCustomers(newMembers)
            }
            setIsLoading(false)
        }
        catch (e) {
            setIsLoading(false)
            console.log(e)
        }
    }

    const renderItemCustomer = ({ item }) => {
        return (
            <RowComponent
                onPress={() => navigation.navigate('DetailCustomerScreen', { customerId: item?.customerId })}
                style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: appColors.gray,
                    paddingVertical: 10,
                    paddingTop: item.customerId === 1 && 0
                }}
            >
                <RowComponent style={{
                    justifyContent: 'flex-start'
                }}>
                    <CircleComponent>
                        <Image source={item.photoUrl ? { uri: item?.photoUrl } : images.avatar_null} style={{ height: 40, width: 40 }} resizeMode='cover' />
                    </CircleComponent>
                    <SpaceComponent width={10} />
                    <View>
                        <TextComponent text={item?.customerName} fontFamily={appFonts.semiBoldOpenSans} />
                        <TextComponent text={item?.phoneNumber} fontSize={12} color={appColors.gray} />
                    </View>
                </RowComponent>

                <RowComponent >
                    <ArrowCircleRight size={20} color={appColors.gray} />
                </RowComponent>
            </RowComponent>
        )
    }

    const checkMonthlyBilling = (startDate) => {
        const start = new Date('2024-09-21'); // Ngày bắt đầu trong hợp đồng
        const today = new Date('2024-10-21'); // Ngày hiện tại

        const yearDifference = today.getFullYear() - start.getFullYear();
        const monthDifference = today.getMonth() - start.getMonth();

        // Tính tổng chênh lệch tháng
        const totalMonthDifference = yearDifference * 12 + monthDifference;

        // Nếu chỉ cách nhau 1 tháng
        if (totalMonthDifference === 1) {
            if (today.getDate() >= start.getDate()) {
                console.log('Đã tới ngày thu tiền');
            }
            else if (today.getMonth() + 1 === 2) { // Kiểm tra tháng 2
                const lastDayOfFebruary = checkNamNhuan(today.getFullYear()) ? 29 : 28;

                if (today.getDate() === lastDayOfFebruary) {
                    console.log('Đã tới ngày thu tiền');
                } else {
                    console.log('Chưa tới ngày thu tiền');
                }
            }
            else if ([4, 6, 9, 11].includes(today.getMonth() + 1)) { // Kiểm tra các tháng có 30 ngày
                if (today.getDate() === 30) {
                    console.log('Đã tới ngày thu tiền');
                } else {
                    console.log('Chưa tới ngày thu tiền');
                }
            }
            else {
                console.log('Chưa tới ngày thu tiền');
            }
        }
        else if (totalMonthDifference >= 2) {
            console.log('Đã tới ngày thu tiền');
        }
        else {
            console.log('Chưa tới ngày thu tiền');
        }
    };

    return (
        <ContainerComponent isScroll>
            <HeaderComponent
                text='Thông tin phòng'
                isBack
                buttonRight={<Edit size={20} color={appColors.text} />}
                onRightPress={() => navigation.navigate('AddNewRoomScreen',
                    {
                        roomId,
                        actionType: 'update'
                    })}
            />
            <SectionComponent>
                <RowComponent>
                    <TextComponent text={dataRoom?.roomName} fontFamily={appFonts.boldOpenSans} fontSize={18} />
                    <TextComponent text={`Giá phòng: ${dataRoom?.roomPrice.toLocaleString()}`} />
                </RowComponent>
            </SectionComponent>
            {dataRoom.photoUrl &&
                <SectionComponent>
                    <Image source={{ uri: dataRoom?.photoUrl }} style={{ height: 150, width: '100%', borderRadius: 10 }} resizeMode='cover' />
                </SectionComponent>
            }
            <SectionComponent>
                <TabBarComponent title='Thông tin chung' />

                <SpaceComponent height={14} />

                {/* <View>
                    <RowComponent style={{ justifyContent: 'flex-start' }}>
                        <TextComponent text='Chỉ số nước đầu kỳ: ' />
                        <TextComponent text={dataRoom?.waterAfter} />
                    </RowComponent>
                    <RowComponent style={{ justifyContent: 'flex-start' }}>
                        <TextComponent text='Chỉ số điện đầu kỳ: ' />
                        <TextComponent text={dataRoom?.powerAfter} />
                    </RowComponent>
                </View> */}

                <RowComponent>
                    <View style={[globalStyle.card, {
                        marginTop: 10,
                        marginHorizontal: 20,
                        alignItems: 'center',
                        flex: 1
                    }, globalStyle.shadow,]}>
                        <CircleComponent size={40} style={{ backgroundColor: appColors.bgSquare }}  >
                            <Flash size={30} color={appColors.yellow} variant='Bold' />
                        </CircleComponent>
                        <SpaceComponent height={3} />
                        <TextComponent text={dataRoom?.powerAfter} fontSize={12} fontFamily={appFonts.semiBoldOpenSans} />
                        <TextComponent text='Chỉ số điện đầu kỳ' fontSize={10} fontFamily={appFonts.mediumOpenSans} />
                    </View>

                    <View style={[globalStyle.card, {
                        marginTop: 10,
                        marginHorizontal: 20,
                        alignItems: 'center',
                        flex: 1,
                    }, globalStyle.shadow,]}>
                        <CircleComponent size={40} style={{ backgroundColor: appColors.bgSquare }}  >
                            <Drop size={30} color={appColors.water} variant='Bold' />
                        </CircleComponent>
                        <SpaceComponent height={3} />
                        <TextComponent text={dataRoom?.waterAfter} fontSize={12} fontFamily={appFonts.semiBoldOpenSans} />
                        <TextComponent text='Chỉ số nước đầu kỳ' fontSize={10} fontFamily={appFonts.mediumOpenSans} />
                    </View>
                </RowComponent>
            </SectionComponent>

            {dataCustomers.length !== 0 &&
                <SectionComponent>
                    <TabBarComponent title='Danh sách người thuê' />
                    <SpaceComponent height={14} />
                    <FlatList
                        scrollEnabled={false}
                        data={dataCustomers}
                        renderItem={renderItemCustomer}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </SectionComponent>
            }

            <SectionComponent>
                {/* trả phòng thì đổi trạng thái phòng, xuất bill, chuyển trạng thái rental */}
                {
                    dataRoom.isAvailable
                    && <ButtonComponent text='Cho thuê' onPress={() => {
                        navigation.navigate('Contract', {
                            screen: 'AddContractScreen',
                            params: {
                                roomId: roomId
                            }
                        })
                    }} />
                }

                {
                    !dataRoom.isAvailable &&
                    <View>
                        <TextComponent text='Ngày thuê so với ngày hiện tại, nếu mà đúng ngày của tháng mới thì cho nút tính tiền hiện lên' />
                        <ButtonComponent text='Thanh toán tiền tháng' onPress={() => { checkMonthlyBilling(startDate) }} />
                    </View>



                }
                <RowComponent>
                    <TextComponent text={getDate(startDate)} />
                    <TextComponent text={getDate(new Date())} />

                </RowComponent>
            </SectionComponent>
            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default DetailRoomScreen