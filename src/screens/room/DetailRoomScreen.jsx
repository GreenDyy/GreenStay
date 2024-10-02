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
import { checkNamNhuan, getDate, getDateStringType1 } from '../../utils/Utils'
import AddInvoiceModal from '../invoice/AddInvoiceModal'
import AddNewRoomModal from './AddNewRoomModal'
import AddContractModal from '../contract/AddContractModal'
import { useSelector } from 'react-redux'

const initRoom = {
    "roomId": 0,
    "roomName": "",
    "roomPrice": 0,
    "waterAfter": 0,
    "waterBefore": 0,
    "powerAfter": 0,
    "powerBefore": 0,
    "photoUrl": "",
    "isAvailable": false,
    "createdAt": "",
    "updatedAt": ""
}

const DetailRoomScreen = ({ navigation, route }) => {
    const { roomId } = route.params
    const [dataRoom, setDataRoom] = useState(initRoom)
    const [dataCustomers, setDataCustomers] = useState([])
    const [startDate, setStartDate] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isShowModalInvoiceAdd, setIsShowModalInvoiceAdd] = useState(false)
    const [isShowModalRoomUpdate, setIsShowModalRoomUpdate] = useState(false)
    const [isShowModalContractAdd, setIsShowModalContractAdd] = useState(false)

    const authData = useSelector((state) => state.authReducer.authData)

    //các trường hợp cần refesh data
    useEffect(() => {
        if (!isShowModalRoomUpdate) {
            fetchDataRoom()
        }
    }, [isShowModalRoomUpdate, isShowModalContractAdd])

    useEffect(() => {
        if (dataRoom !== initRoom) {
            fetchRental()
        }
    }, [dataRoom])

    const fetchRental = async () => {
        try {
            if (!dataRoom.isAvailable) {
                const res = await apiRental(`/${authData.ownerId}/get-by-room-and-status/${roomId}/true`)
                if (res && res.startDate) {
                    setStartDate(new Date(res.startDate));
                    fetchDataMemberOfRoom()
                }
                else {
                    console.log('ko có data ')
                }
            }
        }

        catch (e) {
            setIsLoading(false)
            console.log('fetchRental error: ', e)
        }
    }

    const fetchDataRoom = async () => {
        setIsLoading(true)
        try {
            const data = await apiRoom(`/${authData.ownerId}/${roomId}`)
            setDataRoom(data)
            console.log('data room nè: ', data)
            setIsLoading(false)
        }
        catch (e) {
            setIsLoading(false)
            console.log('fetchDataRoom error: ', e)
        }
    }

    const fetchDataMemberOfRoom = async () => {
        setIsLoading(true)
        try {
            if (!dataRoom.isAvailable) {
                const rental = await apiRental(`/${authData.ownerId}/get-by-room-and-status/${roomId}/true`);
                const members = await apiMemberOfRental(`/${authData.ownerId}/get-all-by-rental/${rental.rentalId}`);
                const newMembers = []
                for (const customer of members) {
                    const cus = await apiCustomer(`/${authData.ownerId}/${customer.customerId}`)
                    newMembers.push({ ...cus })
                }
                console.log('cus nè:', newMembers)
                setDataCustomers(newMembers)
            }
            setIsLoading(false)
        }
        catch (e) {
            setIsLoading(false)
            console.log('fetchDataMemberOfRoom error: ', e)
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
        // const start = new Date('2024-10-01'); // Ngày bắt đầu trong hợp đồng
        // const today = new Date('2024-10-21'); // Ngày hiện tại

        //hàm này ko ổn, ko thể lấy bắt đầu trong hợp đồng dc

        const start = new Date(startDate)
        const today = new Date()

        const yearDifference = today.getFullYear() - start.getFullYear();
        const monthDifference = today.getMonth() - start.getMonth();

        // Tính tổng chênh lệch tháng
        const totalMonthDifference = yearDifference * 12 + monthDifference;

        // Nếu chỉ cách nhau 1 tháng
        if (totalMonthDifference === 1) {
            if (today.getDate() >= start.getDate()) {
                console.log('Đã tới ngày thu tiền');
                return true
            }
            else if (today.getMonth() + 1 === 2) { // Kiểm tra tháng 2
                const lastDayOfFebruary = checkNamNhuan(today.getFullYear()) ? 29 : 28;

                if (today.getDate() === lastDayOfFebruary) {
                    console.log('Đã tới ngày thu tiền');
                    return true
                } else {
                    console.log('Chưa tới ngày thu tiền');
                    return false
                }
            }
            else if ([4, 6, 9, 11].includes(today.getMonth() + 1)) { // Kiểm tra các tháng có 30 ngày
                if (today.getDate() === 30) {
                    console.log('Đã tới ngày thu tiền');
                    return true
                } else {
                    console.log('Chưa tới ngày thu tiền');
                    return false
                }
            }
            else {
                console.log('Chưa tới ngày thu tiền');
                return false
            }
        }
        else if (totalMonthDifference >= 2) {
            console.log('Đã tới ngày thu tiền');
            return true
        }
        else {
            console.log('Chưa tới ngày thu tiền');
            return false
        }
    };

    const handleCreateInvoice = () => {
        setIsShowModalInvoiceAdd(true)
    }

    return (
        <ContainerComponent isScroll>
            <HeaderComponent
                text='Thông tin phòng'
                isBack
                buttonRight={<Edit size={20} color={appColors.text} />}
                onRightPress={() => setIsShowModalRoomUpdate(true)}
            />
            <SectionComponent>
                <RowComponent>
                    <TextComponent text={dataRoom?.roomName} fontFamily={appFonts.boldOpenSans} fontSize={18} />
                    <RowComponent style={{ justifyContent: 'flex-end' }}>
                        <TextComponent text={`Giá phòng: `} fontFamily={appFonts.semiBoldOpenSans} />
                        <TextComponent text={`${dataRoom?.roomPrice.toLocaleString()} VNĐ`} />
                    </RowComponent>
                </RowComponent>

                {!dataRoom.isAvailable &&
                    <>
                        <SpaceComponent height={10} />
                        <RowComponent style={{ justifyContent: 'flex-start' }}>
                            <TextComponent text={`Ngày bắt đầu: `} fontFamily={appFonts.semiBoldOpenSans} />
                            <TextComponent text={getDateStringType1(startDate)} />
                        </RowComponent>
                    </>
                }
            </SectionComponent>
            {dataRoom.photoUrl &&
                <SectionComponent>
                    <Image source={{ uri: dataRoom?.photoUrl }} style={{ height: 150, width: '100%', borderRadius: 10 }} resizeMode='cover' />
                </SectionComponent>
            }
            <SectionComponent>
                <TabBarComponent title='Thông tin chung' />

                <SpaceComponent height={14} />

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
                        <TextComponent text={`${dataRoom?.powerAfter} kWh`} fontSize={12} fontFamily={appFonts.semiBoldOpenSans} />
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
                        <TextComponent text={`${dataRoom?.waterAfter} m³`} fontSize={12} fontFamily={appFonts.semiBoldOpenSans} />
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
                    && <ButtonComponent text='Cho thuê' onPress={() => setIsShowModalContractAdd(true)} />
                }

                {
                    !dataRoom.isAvailable &&
                    <RowComponent style={{ flexWrap: 'wrap' }}>
                        <ButtonComponent text='Tạo phiếu thu' onPress={handleCreateInvoice} style={{ flex: 1 }} />
                        <SpaceComponent width={20} />
                        <ButtonComponent text='Chấm dứt hợp đồng' onPress={handleCreateInvoice} style={{ flex: 1, backgroundColor: appColors.danger }} />
                    </RowComponent>
                }
            </SectionComponent>
            {/* các modal */}
            <AddInvoiceModal roomId={roomId} visible={isShowModalInvoiceAdd} onClose={() => setIsShowModalInvoiceAdd(false)} />
            <AddNewRoomModal actionType={'update'} roomId={roomId} visible={isShowModalRoomUpdate} onClose={() => setIsShowModalRoomUpdate(false)} />
            <AddContractModal visible={isShowModalContractAdd} roomId={roomId} onClose={() => setIsShowModalContractAdd(false)} />
            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default DetailRoomScreen