import { ClipboardClose, ClipboardTick } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Modal, TouchableOpacity, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useDispatch, useSelector } from 'react-redux'
import { apiCustomer, apiInvoice, apiPower, apiRental, apiRoom, apiTrash, apiWater } from '../../apis/apiDTHome'
import { ButtonComponent, CircleComponent, ContainerComponent, DropDownComponent, HeaderComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { appColors } from '../../constants/appColors'
import { images } from '../../constants/images'
import { updateInvoices } from '../../srcRedux/reducers/invoiceReducer'
import { getDateStringType2, printBillPdf } from '../../utils/Utils'
import { appFonts } from '../../constants/appFonts'

const initInvoice = {
    "rentalId": "",
    "customerId": "",
    "roomId": "",
    "createAt": new Date(),
    "amount": "0",
    "status": "Chưa thanh toán",
    "description": `Thu tiền phòng tháng ${new Date().getMonth() + 1}`,
    "waterStart": "",
    "waterEnd": "",
    "powerStart": "",
    "powerEnd": "",
    "waterUsage": "0",
    "powerUsage": "0",
    "ownerId": ""
}

const AddInvoiceModal = ({ roomId, visible, onClose }) => {
    const [invoice, setInvoice] = useState(initInvoice)
    const [room, setRoom] = useState(null)
    const [customer, setCustomer] = useState(null)
    const [waterMoney, setWaterMoney] = useState(0)
    const [powerMoney, setPowerMoney] = useState(0)
    const [trashMoney, setTrashMoney] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0);
    const [waterPricePerUnit, setWaterPricePerUnit] = useState(0)
    const [powerPricePerUnit, setPowerPricePerUnit] = useState(0)
    const [dropDownRooms, setDropDownRooms] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isExportInvoice, setIsExportInvoice] = useState(false)

    const authData = useSelector((state) => state.authReducer.authData)
    const dispatch = useDispatch()

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
            const res = await apiRoom(`/${authData.ownerId}/${invoice.roomId}`)
            setRoom(res)
        }
        const fetchDataRentalAndCus = async () => {
            const res = await apiRental(`/${authData.ownerId}/get-by-room-and-status/${invoice.roomId}/true`)
            setInvoice(preInvoice => (
                {
                    ...preInvoice,
                    rentalId: res.rentalId,
                    customerId: res.customerId
                }
            ));


            if (res) {
                const cus = await apiCustomer(`/${authData.ownerId}/${res.customerId}`)
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

    //tính tiền nước sau khi waterUsage thay đổi
    useEffect(() => {
        tinhTienNuoc()
        tinhTongTien()
    }, [invoice.waterUsage])
    // //tính tiền diện sau khi powerUsage thay đổi
    useEffect(() => {
        tinhTienDien()
        tinhTongTien()
    }, [invoice.powerUsage])

    const fetchDataWaterPowerTrash = async () => {
        try {
            const water = await apiWater(`/${authData.ownerId}/latest-price`)
            setWaterPricePerUnit(water.pricePerUnit)
            const power = await apiPower(`/${authData.ownerId}/latest-price`)
            setPowerPricePerUnit(power.pricePerUnit)
            const trash = await apiTrash(`/${authData.ownerId}/latest-price`)
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
            const res = await apiRoom(`/${authData.ownerId}/get-all`)
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
        let tempData = { ...invoice, ownerId: authData.ownerId }
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
        const tien = waterPricePerUnit * invoice.waterUsage
        setWaterMoney(tien)
    }

    const tinhTienDien = () => {
        const tien = powerPricePerUnit * invoice.powerUsage
        setPowerMoney(tien)
    }

    const tinhTongTien = () => {
        const tien = room?.roomPrice + waterMoney + powerMoney + trashMoney
        setTotalAmount(tien);
    }

    //validate tổng quát form 
    const generalValidate = () => {
        if (!invoice.roomId || !invoice.powerEnd || !invoice.waterEnd) {
            return false
        }
        return true
    }
    const handleCreateInvoice = async () => {
        setIsLoading(true)
        if (!generalValidate()) {
            showMessage({
                message: 'Thông báo',
                description: 'Vui lòng nhập đầy đủ thông tin',
                type: 'warning',
            })
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin')
            setIsLoading(false)
            console.log('Vui lòng nhập đầy đủ thông tin')
        }
        else {
            try {
                //b1: tạo invoice
                let dataInvoice = {
                    ...invoice,
                    amount: totalAmount,
                    powerStart: room.powerAfter,
                    waterStart: room.waterAfter,
                    createAt: new Date(),
                }
                console.log('check data lần cuối: ', dataInvoice)
                const newInvoice = await apiInvoice(`/create`, dataInvoice, 'post')
                if (newInvoice) {
                    //b2: cập nhật powerAfter, Water
                    const newDataRoom = {
                        ...room,
                        waterAfter: invoice.waterEnd,
                        powerAfter: invoice.powerEnd,
                        updatedAt: new Date()
                    }

                    await apiRoom(`/update/${room.roomId}`, newDataRoom, 'put')
                    //optional: tạo phiếu thu pdf nếu có tick
                    if (isExportInvoice) {
                        try {
                            const dataPrint = {
                                customerName: customer.customerName,
                                roomName: room.roomName,
                                customerPhoneNumber: customer.phoneNumber,
                                invoiceId: newInvoice.invoiceId,
                                description: invoice.description,
                                roomPrice: room.roomPrice.toLocaleString(),
                                powerPrice: powerMoney.toLocaleString(),
                                waterPrice: waterMoney.toLocaleString(),
                                trashPrice: trashMoney.toLocaleString(),
                                invoiceCreateAt: getDateStringType2(newInvoice.createAt),
                                powerStart: invoice.powerStart,
                                powerEnd: invoice.powerEnd,
                                waterStart: invoice.waterStart,
                                waterEnd: invoice.waterEnd,
                                amount: totalAmount.toLocaleString()
                            }
                            const pathPdf = printBillPdf(dataPrint)
                            if (pathPdf) {
                                console.log('đã xuất bill pdf tại: ', pathPdf)
                            }
                        }
                        catch (e) {
                            console.log('loi xuat pdf: ', e)
                        }
                    }
                    showMessage({
                        message: 'Thông báo',
                        description: isExportInvoice ? 'Tạo phiếu thu và xuất phiếu thành công' : 'Tạo phiếu thu thành công',
                        type: 'success'
                    })
                }
                else {
                    showMessage({
                        message: 'Thông báo',
                        description: 'that bại từ lúc tạo Invoice',
                        type: 'danger'
                    })
                }
                setIsLoading(false)
                dispatch(updateInvoices(Math.random()))
                onClose()
            }
            catch (e) {
                showMessage({
                    message: 'Thông báo',
                    description: 'Tạo phiếu thuê thất bại',
                    type: 'danger'
                })
                setIsLoading(false)
                onClose()
                console.log('tạo thất bại: ', e)
            }
        }
    }

    const checkValueCuoiKy = (key) => {
        switch (key) {
            case 'waterEnd':
                if (invoice.waterEnd <= room?.waterAfter) {
                    Alert.alert('Cảnh báo', 'Số nước cuối kỳ không hợp lệ')
                    handleChangeValue(key, '')
                }
                break
            case 'powerEnd':
                if (invoice.powerEnd <= room?.powerAfter) {
                    Alert.alert('Cảnh báo', 'Số điện cuối kỳ không hợp lệ')
                    handleChangeValue(key, '')
                }
                break
            default:
                break
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
                        <SectionComponent style={{ alignItems: 'center' }}>
                            <CircleComponent size={80} style={{ overflow: 'visible' }} >
                                {
                                    customer.photoUrl
                                        ?
                                        <Image source={{ uri: customer.photoUrl }} style={{ height: 80, width: 80, borderRadius: 999 }} resizeMode='cover' />
                                        :
                                        <Image source={images.avatar_null} style={{ height: 80, width: 80, borderRadius: 999 }} resizeMode='cover' />

                                }
                            </CircleComponent>
                            <SpaceComponent height={8} />
                            <TextComponent text={customer?.customerName} isTitle fontSize={16} color={appColors.primary2}/>
                        </SectionComponent>
                    }

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
                        onEndEditing={() => {
                            handleChangeValue('powerUsage', invoice.powerEnd - room?.powerAfter)
                            checkValueCuoiKy('powerEnd')
                        }}
                    />
                    <SpaceComponent height={14} />
                    <InputComponent
                        title='Số nước cuối kỳ (Xem trên công tơ)'
                        value={invoice.waterEnd.toString()}
                        placeholder='Nhập số nước cuối kỳ'
                        allowClear
                        keyboardType='number-pad'
                        onChangeText={(value) => handleChangeValue('waterEnd', value)}
                        onEndEditing={() => {
                            handleChangeValue('waterUsage', invoice.waterEnd - room?.waterAfter)
                            checkValueCuoiKy('waterEnd')
                        }}

                    />
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
                    <View style={{ width: '100%', borderTopWidth: 0.5, borderColor: appColors.gray, marginBottom: 8 }} />
                    <TextComponent text='Chi tiết tính toán' isTitle style={{ textAlign: 'center' }} />
                    <SpaceComponent height={14} />
                    <RowComponent>
                        <TextComponent text={`Điện cũ: ${room?.powerAfter}`} fontFamily={appFonts.mediumOpenSans} />
                        <TextComponent text={`Điện mới: ${invoice?.powerEnd}`} fontFamily={appFonts.mediumOpenSans} />
                        <TextComponent text={`Điện sử dụng: ${invoice?.powerUsage}`} fontFamily={appFonts.mediumOpenSans} />
                    </RowComponent>
                    <SpaceComponent height={14} />

                    <RowComponent>
                        <TextComponent text={`Nước cũ: ${room?.waterAfter}`} fontFamily={appFonts.mediumOpenSans} />
                        <TextComponent text={`Nước mới: ${invoice?.waterEnd}`} fontFamily={appFonts.mediumOpenSans} />
                        <TextComponent text={`Nước sử dụng: ${invoice?.waterUsage}`} fontFamily={appFonts.mediumOpenSans} />
                    </RowComponent>

                    <SpaceComponent height={14} />
                    <TextComponent text={`Tiền nước: ${waterMoney?.toLocaleString()} VNĐ`} fontFamily={appFonts.mediumOpenSans} />
                    <SpaceComponent height={14} />
                    <TextComponent text={`Tiền điện: ${powerMoney?.toLocaleString()} VNĐ`} fontFamily={appFonts.mediumOpenSans} />
                    <SpaceComponent height={14} />
                    <TextComponent text={`Tiền rác: ${trashMoney?.toLocaleString()} VNĐ`} />
                    <SpaceComponent height={14} />
                    <TextComponent text={`Tiền phòng: ${room?.roomPrice?.toLocaleString() ?? 0} VNĐ`} fontFamily={appFonts.mediumOpenSans} />
                    <SpaceComponent height={14} />
                    <TextComponent text={`Tổng tiền: ${totalAmount ? totalAmount.toLocaleString() : 0} VNĐ`} fontFamily={appFonts.boldOpenSans} color={appColors.danger} />

                    <SpaceComponent height={14} />

                    <TouchableOpacity onPress={() => { setIsExportInvoice(preVal => !preVal) }}>
                        <RowComponent style={{ justifyContent: 'flex-start' }}>
                            <TextComponent text='Xuất phiếu: ' fontFamily={appFonts.mediumOpenSans} />
                            {isExportInvoice ? <ClipboardTick size={22} color={appColors.primary} /> : <ClipboardClose size={22} color={appColors.danger} />}
                        </RowComponent>
                    </TouchableOpacity>
                    <View style={{ width: '100%', borderTopWidth: 0.5, borderColor: appColors.gray, marginTop: 8 }} />
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