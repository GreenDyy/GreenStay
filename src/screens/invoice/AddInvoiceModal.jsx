import { View, Text, Image, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, CircleComponent, ContainerComponent, DropDownComponent, HeaderComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { apiCustomer, apiInvoice, apiPower, apiRental, apiRoom, apiTrash, apiWater } from '../../apis/apiDTHome'
import { images } from '../../constants/images'
import { appColors } from '../../constants/appColors'
import InputComponent from '../../components/InputComponent'
import { showMessage } from 'react-native-flash-message'

const initInvoice = {
    "rentalId": "",
    "customerId": "",
    "roomId": "",
    "createAt": new Date(),
    "amount": "0",
    "status": "Chờ thanh toán",
    "description": "",
    "waterStart": "",
    "waterEnd": "",
    "powerStart": "",
    "powerEnd": "",
    "waterUsage": "",
    "powerUsage": "",
}

const AddInvoiceModal = ({ roomId, visible, onClose }) => {
    const [invoice, setInvoice] = useState(initInvoice)
    const [room, setRoom] = useState(null)
    const [customer, setCustomer] = useState(null)

    const [waterMoney, setWaterMoney] = useState(0)
    const [powerMoney, setPowerMoney] = useState(0)
    const [trashMoney, setTrashMoney] = useState(0)

    const [waterPricePerUnit, setWaterPricePerUnit] = useState(0)
    const [powerPricePerUnit, setPowerPricePerUnit] = useState(0)

    const [dropDownRooms, setDropDownRooms] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false)

    //lấy roomId lun nếu nó dc truyền từ màn khác
    useEffect(() => {
        if (roomId) {
            console.log('tao đã tự lấy roomId nè')
            handleChangeValue('roomId', roomId)
        }
    }, [roomId])

    useEffect(() => {
        fetchDataRoomAvailables()
        fetchDataWaterPowerTrash()
    }, [])

    //sau khi chọn phòng khác thì load data phòng đó để lấy thông tin cần thiết như power, waterUsage, rentalId
    useEffect(() => {
        const fetchDataRoom = async () => {
            const res = await apiRoom(`/${invoice.roomId}`)
            setRoom(res)
        }
        const fetchDataRentalAndCus = async () => {
            const res = await apiRental(`/get-by-room-and-status/${invoice.roomId}/true`)
            setInvoice(preInvoice => (
                {
                    ...preInvoice,
                    rentalId: res.rentalId,
                    customerId: res.customerId
                }
            ));


            if (res) {
                const cus = await apiCustomer(`/${res.customerId}`)
                setCustomer(cus)
            }
        }

        if (invoice.roomId) {
            fetchDataRoom();
            fetchDataRentalAndCus();
        }

    }, [invoice.roomId])

    //CHỈ XEM DATA INVOICE
    useEffect(() => {
        console.log(invoice)
    }, [invoice])

    // //tính tiền nước sau khi waterUsage thay đổi
    // useEffect(() => {
    //     tinhTienNuoc()
    // }, [invoice.waterUsage])
    // //tính tiền diện sau khi powerUsage thay đổi
    // useEffect(() => {
    //     tinhTienDien()
    // }, [invoice.powerUsage])
    // //tính tổng tiền
    // useEffect(() => {
    //     const tinhTongTien = () => {
    //         const tien = room?.roomPrice + waterMoney + powerMoney + trashMoney
    //         handleChangeValue('amount', tien)
    //     }
    //     tinhTongTien()
    // }, [waterMoney, powerMoney])

    const fetchDataWaterPowerTrash = async () => {
        try {
            const water = await apiWater(`/latest-price`)
            setWaterPricePerUnit(water.pricePerUnit)
            const power = await apiPower(`/latest-price`)
            setWaterPricePerUnit(power.pricePerUnit)
            const trash = await apiTrash(`/latest-price`)
            setTrashMoney(trash.pricePerUnit)
        }
        catch (e) {
            console.log('lỗi nè ku', e)
            setIsLoading(false)
        }
    }

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

    const tinhTienNuoc = () => {
        const tienNuoc = waterPricePerUnit * invoice.waterUsage
        setWaterMoney(tienNuoc)
    }

    const tinhTienDien = () => {
        const tienDien = powerPricePerUnit * invoice.powerUsage
        setPowerMoney(tienDien)
    }

    const handleCreateInvoice = async () => {
        //

        setIsLoading(true)
        try {
            //b1: tạo invoice
            let dataInvoice = {
                ...invoice,
                powerStart: room.powerAfter,
                waterStart: room.waterAfter,
                createAt: new Date(),
            }
            const res = await apiInvoice(`/create`, dataInvoice, 'post')
            if (res) {
                //b2: cập nhật powerAfter, Water
                const newDataRoom = {
                    ...room,
                    waterAfter: invoice.waterEnd,
                    powerAfter: invoice.powerEnd,
                    updatedAt: new Date()
                }
                await apiRoom(`/update/${room.roomId}`, newDataRoom, 'put')
                showMessage({
                    message: 'Thông báo',
                    description: 'Tạo phiếu thu thành công',
                    type: 'success'
                })
            }


            setIsLoading(false)
        }
        catch (e) {
            showMessage({
                message: 'Thông báo',
                description: 'Tạo phiếu thuê thất bại',
                type: 'danger'
            })
            setIsLoading(false)
            console.log('tạo thất bại: ', e)
        }
    }

    return (
        <Modal visible={visible}>
            <ContainerComponent isScroll>

                <HeaderComponent
                    text='Tạo phiếu thu'
                    isBack
                    customIsBack={onClose} />

                <SectionComponent>
                    {customer &&
                        <>
                            <TextComponent text={`Người đại điện: ${customer?.customerName}`} />
                            <SpaceComponent height={14} />
                        </>}

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
                    <TextComponent text={`Tiền nước: ${waterMoney}`} />
                    <SpaceComponent height={14} />
                    <TextComponent text={`Tiền điện: ${powerMoney}`} />
                    <SpaceComponent height={14} />
                    <TextComponent text={`Tiền rác: ${trashMoney}`} />
                    <SpaceComponent height={14} />
                    <TextComponent text={`Tiền phòng: ${room?.roomPrice ?? 0}`} />
                    <SpaceComponent height={14} />
                    <TextComponent text={`Tổng tiền: ${invoice.amount}`} />
                    <SpaceComponent height={14} />
                    <RowComponent>
                        <TextComponent text={`Rental id: ${invoice.rentalId}`} />
                        <TextComponent text={`Customer id: ${invoice.customerId}`} />
                    </RowComponent>
                    <InputComponent
                        title='Ghi chú (Nếu có)'
                        value={invoice.description}
                        placeholder='Nhập nội dung'
                        allowClear
                        onChangeText={(value) => handleChangeValue('description', value)}
                    />
                </SectionComponent>

                <SectionComponent>
                    <ButtonComponent text='Tạo phiếu thu' onPress={handleCreateInvoice} />
                </SectionComponent>
                <LoadingModalComponent visible={isLoading} />
            </ContainerComponent>
        </Modal>

    )
}

export default AddInvoiceModal