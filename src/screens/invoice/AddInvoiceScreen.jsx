import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, CircleComponent, ContainerComponent, DropDownComponent, HeaderComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { apiCustomer, apiRental, apiRoom } from '../../apis/apiDTHome'
import { images } from '../../constants/images'
import { appColors } from '../../constants/appColors'
import InputComponent from '../../components/InputComponent'

const initInvoice = {
    "rentalId": "",
    "customerId": "",
    "roomId": "",
    "createAt": new Date(),
    "amount": "",
    "status": "",
    "description": "",
    "waterStart": "",
    "waterEnd": "",
    "powerStart": "",
    "powerEnd": "",
    "waterUsage": "",
    "powerUsage": "",
}

const AddInvoiceScreen = ({ navigation, route }) => {
    const [invoice, setInvoice] = useState(initInvoice)
    const [room, setRoom] = useState(null)
    const [customer, setCustomer] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false)

    const [dropDownRooms, setDropDownRooms] = useState([])

    //lấy roomId lun nếu nó dc truyền từ màn khác
    useEffect(() => {
        if (route.params?.roomId) {
            handleChangeValue('roomId', route.params?.roomId)
        }
    }, [route.params?.roomId])

    useEffect(() => {
        fetchDataRoomAvailables()
    }, [])

    //sau khi chọn phòng khác thì load data phòng đó để lấy thông tin cần thiết như power, waterUsage, rentalId
    useEffect(() => {
        const fetchDataRoom = async () => {
            const res = await apiRoom(`/${invoice.roomId}`)
            setRoom(res)
        }
        const fetchDataRentalAndCus = async () => {
            const res = await apiRental(`/get-by-room-and-status/${invoice.roomId}/true`)
            handleChangeValue('rentalId', res.rentalId)
            handleChangeValue('customerId', res.customerId)

            if (res) {
                const cus = await apiCustomer(`/${res.customerId}`)
                setCustomer(cus)
            }
        }

        fetchDataRoom()
        fetchDataRentalAndCus()

    }, [invoice.roomId])

    useEffect(() => {
        console.log(invoice)
    }, [invoice])

    const fetchDataRoomAvailables = async () => {
        setIsLoading(true)
        try {
            const res = await apiRoom(`/get-all`)
            const newRooms = res.filter((item) => !item.isAvailable)
            const rooms = newRooms.map((item) => ({
                label: item.roomName,
                value: item.roomId,
                photoUrl: item.photoUrl
            }))

            setDropDownRooms(rooms)
            setIsLoading(false)
        }
        catch (e) {
            console.log(e)
            setIsLoading(false)
        }
    }


    const handleChangeValue = (key, value,) => {
        let tempData = { ...invoice }
        tempData[key] = value
        setInvoice(tempData)
    }

    const renderItemDropDown = (item, index) => {
        return (
            <RowComponent
                style={{
                    justifyContent: 'flex-start',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderColor: appColors.gray2,
                    borderBottomWidth: index !== dropDownRooms.length - 1 ? 1 : 0,
                }}
            >
                <CircleComponent>
                    <Image source={item?.photoUrl ? { uri: item?.photoUrl } : images.logo1} style={{ height: 40, width: 40 }} resizeMode='cover' />
                </CircleComponent>

                <SpaceComponent width={5} />
                <TextComponent text={item.label} />
            </RowComponent>
        )
    }

    const handleCreateInvoice = async () => {
        //
        let dataInvoice = {
            ...invoice,
            powerStart: room.powerAfter,
            waterStart: room.waterAfter,
            createAt: new Date(),
        }
    }

    return (
        <ContainerComponent isScroll>
            <HeaderComponent
                text='Tạo phiếu thu'
                isBack />

            <SectionComponent>
                <TextComponent text={`Người đại điện: ${customer?.customerName}`} />
                <SpaceComponent height={14} />
                <DropDownComponent title='Phòng'
                    //data sẽ dc lấy từ danh sách các khách chọn ở trên nhen
                    data={dropDownRooms}
                    onSelect={(value) => handleChangeValue('roomId', value)}
                    renderItem={(item, index) => renderItemDropDown(item, index)}
                    selected={invoice.roomId || 'Chọn phòng'}
                />
                <SpaceComponent height={14} />
                <InputComponent
                    title='Số điện cuối kỳ (Xem trên công tơ)'
                    value={String(invoice.powerEnd)}
                    placeholder='Nhập số điện cuối kỳ'
                    allowClear
                    keyboardType='number-pad'
                    onChangeText={(value) => handleChangeValue('powerEnd', value)}
                    onEndEditing={() => handleChangeValue('powerUsage', invoice.powerEnd - room?.powerAfter)}
                />
                <SpaceComponent height={14} />
                <InputComponent
                    title='Số nước cuối kỳ (Xem trên công tơ)'
                    value={invoice.waterEnd.toString()}
                    placeholder='Nhập số nước cuối kỳ'
                    allowClear
                    keyboardType='number-pad'
                    onChangeText={(value) => handleChangeValue('waterEnd', value)}
                    onEndEditing={() => handleChangeValue('waterUsage', invoice.waterEnd - room?.waterAfter)}
                />
                <SpaceComponent height={14} />
                <RowComponent>
                    <TextComponent text={`Điện cũ: ${room?.powerAfter}`} />
                    <TextComponent text={`Điện mới: ${invoice?.powerEnd}`} />
                    <TextComponent text={`Điện sử dụng: ${invoice?.powerUsage}`} />
                </RowComponent>
                <SpaceComponent height={14} />
                <RowComponent>
                    <TextComponent text={`Nước cũ: ${room?.waterAfter}`} />
                    <TextComponent text={`Nước mới: ${invoice?.waterEnd}`} />
                    <TextComponent text={`Nước sử dụng: ${invoice?.waterUsage}`} />
                </RowComponent>

                <SpaceComponent height={14} />

                <InputComponent
                    title='Ghi chú (Nếu có)'
                    value={invoice.description}
                    placeholder='Nhập nội dung'
                    allowClear
                    onChangeText={(value) => handleChangeValue('description', value)}
                />
            </SectionComponent>

            <SectionComponent>
                <ButtonComponent text='Tạo phiếu thu' onPress={() => { }} />
            </SectionComponent>
        </ContainerComponent>
    )
}

export default AddInvoiceScreen