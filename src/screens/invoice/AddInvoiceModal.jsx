import { ClipboardClose, ClipboardTick } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Modal, TouchableOpacity } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import RNFS from 'react-native-fs'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import { apiCustomer, apiInvoice, apiPower, apiRental, apiRoom, apiTrash, apiWater } from '../../apis/apiDTHome'
import { ButtonComponent, CircleComponent, ContainerComponent, DropDownComponent, HeaderComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { appColors } from '../../constants/appColors'
import { images } from '../../constants/images'
import htmlInvoice from './htmlInvoice'
import { getDateStringType2, printBillPdf } from '../../utils/Utils'
import { useDispatch } from 'react-redux'
import { updateInvoices } from '../../srcRedux/reducers/invoiceReducer'

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
    const [totalAmount, setTotalAmount] = useState(0);

    const [waterPricePerUnit, setWaterPricePerUnit] = useState(0)
    const [powerPricePerUnit, setPowerPricePerUnit] = useState(0)

    const [dropDownRooms, setDropDownRooms] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false)
    const [messError, setMessError] = useState('')
    const [isExportInvoice, setIsExportInvoice] = useState(false)
    const [pdfPath, setPdfPath] = useState(null)

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
    useEffect(() => {
        if (isExportInvoice)
            console.log('bạn chọn xuất bill')
        else
            console.log('bạn chọn ko xuất bill')
    }, [isExportInvoice])

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
            const water = await apiWater(`/latest-price`)
            setWaterPricePerUnit(water.pricePerUnit)
            const power = await apiPower(`/latest-price`)
            setPowerPricePerUnit(power.pricePerUnit)
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
                    <TextComponent text={`Tổng tiền: ${totalAmount}`} />
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
                    <SpaceComponent height={14} />

                    <TouchableOpacity onPress={() => { setIsExportInvoice(preVal => !preVal) }}>
                        <RowComponent style={{ justifyContent: 'flex-start' }}>
                            <TextComponent text='Xuất phiếu: ' />
                            {isExportInvoice ? <ClipboardTick size={22} color={appColors.primary} /> : <ClipboardClose size={22} color={appColors.danger} />}
                        </RowComponent>
                    </TouchableOpacity>

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