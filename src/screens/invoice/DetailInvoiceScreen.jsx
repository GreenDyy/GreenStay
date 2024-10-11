import { ArrowCircleRight, Drop, Electricity, Flash, Home, House, House2, Printer, Trash } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';
import { apiInvoice, apiPower, apiTrash, apiWater } from '../../apis/apiDTHome';
import { ButtonComponent, CircleComponent, ContainerComponent, HeaderComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { updateInvoices } from '../../srcRedux/reducers/invoiceReducer';
import { getDateStringType2, printBillPdf } from '../../utils/Utils';
import { Image, View } from 'react-native';
import { images } from '../../constants/images';
import { appFonts } from '../../constants/appFonts';

const initData = {
    invoiceId: 3,
    status: "Chưa thanh toán",
    description: "Thu tiền phòng tháng 9",
    amount: 19165500,
    createAt: "2024-09-27T03:50:20.793",
    customer: {
        customerId: 10,
        customerName: "dasd",
        phoneNumber: "312231312",
        email: "dsada",
        citizenId: "3221123213",
        dateOfBirth: "2024-09-27T03:46:59.737",
        photoUrl: ""
    },
    room: {
        roomId: 6,
        roomName: "Phòng 6",
        roomPrice: 1300000,
        isAvailable: false,
        photoUrl: "https://media.istockphoto.com/id/624964664/photo/purple-modern-living-room.jpg?s=612x612&w=0&k=20&c=kNFmTw_pGGMJU5Dk_9r8JFtKkIykQYg7syJ_X8SthZQ=",
        powerStart: 4215,
        powerEnd: 1000,
        powerUsage: 465,
        waterStart: 12445,
        waterEnd: 10000,
        waterUsage: 9875,
    },
};

const DetailInvoiceScreen = ({ navigation, route }) => {
    const { item } = route.params
    const [invoice, setInvoice] = useState(initData)
    const [water, setWater] = useState(0)
    const [power, setPower] = useState(0)
    const [trash, setTrash] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()
    const authData = useSelector((state) => state.authReducer.authData)

    useEffect(() => {
        const fetchData = async () => {
            const water = await apiWater(`/${authData.ownerId}/latest-price`)
            const power = await apiPower(`/${authData.ownerId}/latest-price`)
            const trash = await apiTrash(`/${authData.ownerId}/latest-price`)
            setWater(water)
            setPower(power)
            setTrash(trash)
        }
        fetchData()
        setInvoice(item)
    }, [item])

    useEffect(() => {
        console.log(invoice)
    }, [invoice])

    const handlePrintPdf = async () => {
        setIsLoading(true)
        try {
            const dataPrint = {
                customerName: invoice.customer.customerName,
                roomName: invoice.room.roomName,
                customerPhoneNumber: invoice.customer.phoneNumber,
                invoiceId: invoice.invoiceId,
                description: invoice.description,
                roomPrice: invoice.room.roomPrice.toLocaleString(),
                powerPrice: (invoice.powerUsage * power.pricePerUnit).toLocaleString(),
                waterPrice: (invoice.waterUsage * water.pricePerUnit).toLocaleString(),
                trashPrice: (trash.pricePerUnit).toLocaleString(),
                invoiceCreateAt: getDateStringType2(invoice.createAt),
                powerStart: invoice.powerStart,
                powerEnd: invoice.powerEnd,
                waterStart: invoice.waterStart,
                waterEnd: invoice.waterEnd,
                amount: invoice.amount.toLocaleString()
            };
            const pathPdf = printBillPdf(dataPrint)
            if (pathPdf) {
                showMessage({
                    message: 'Thông báo',
                    description: 'Xuất hoá đơn thành công',
                    type: 'success'
                })
            }
            else {
                showMessage({
                    message: 'Thông báo',
                    description: 'Xuất hoá đơn thất bại',
                    type: 'danger'
                })
            }
            setIsLoading(false)
        }
        catch (e) {
            showMessage({
                message: 'Thông báo',
                description: `Xuất hoá đơn thất bại: ${e}`,
                type: 'danger'
            })
            setIsLoading(false)
        }

    }

    const handleXacNhanThuTien = async () => {
        setIsLoading(true)
        const newInvoice = {
            ...invoice,
            status: 'Đã thanh toán',
        }
        try {
            const res = await apiInvoice(`/update/${invoice.invoiceId}`, newInvoice, 'put')
            if (res) {
                setInvoice(newInvoice)
                showMessage({
                    message: 'Thông báo',
                    description: 'Xuất nhận thu tiền thành công',
                    type: 'success'
                })
                dispatch(updateInvoices(Math.random()))
                navigation.goBack()
            }
            setIsLoading(false)
        }
        catch (e) {
            showMessage({
                message: 'Thông báo',
                description: 'Xác nhận thu tiền thất bại',
                type: 'danger'
            })
            setIsLoading(false)
            console.log(e)
        }
    }

    return (
        <ContainerComponent>
            <HeaderComponent text='Chi tiết hoá đơn' isBack
                buttonRight={invoice.status === 'Chưa thanh toán' && <Printer size={22} color={appColors.primary} />}
                onRightPress={handlePrintPdf} />
            <SectionComponent>
                <RowComponent>
                    {/* cột 1 */}
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <CircleComponent size={60}>
                            <Image source={invoice.customer.photoUrl ? { uri: invoice.customer?.photoUrl } : images.avatar_null} style={{ height: 60, width: 60 }} resizeMode='cover' />
                        </CircleComponent>
                        <SpaceComponent height={8} />
                        <TextComponent text={invoice.customer.customerName} fontFamily={appFonts.semiBoldOpenSans} fontSize={16} />
                    </View>

                    <View style={{ borderRightWidth: 0.5, borderColor: appColors.gray, height: '100%', marginHorizontal: 5 }} />
                    {/* cột 2 */}
                    <RowComponent style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <RowComponent>
                                <TextComponent text='Mã hoá đơn: ' fontFamily={appFonts.semiBoldOpenSans} />
                                <TextComponent text={`#HD${invoice.invoiceId}`} />
                            </RowComponent>
                            <SpaceComponent height={10} />
                            <RowComponent>
                                <TextComponent text='Ngày tạo phiếu: ' fontFamily={appFonts.semiBoldOpenSans} />
                                <TextComponent text={getDateStringType2(invoice.createAt)} />
                            </RowComponent>
                            <SpaceComponent height={10} />
                            <RowComponent>
                                <TextComponent text='Trạng thái: ' fontFamily={appFonts.semiBoldOpenSans} />
                                <TextComponent text={invoice.status} color={invoice.status === 'Chưa thanh toán' ? appColors.danger : appColors.primary} />
                            </RowComponent>
                        </View>
                    </RowComponent>
                </RowComponent>
            </SectionComponent>
            {/* table nè */}
            <SectionComponent style={{ borderTopWidth: 0.5, borderColor: appColors.gray, paddingVertical: 10 }}>
                <RowComponent>
                    <RowComponent>
                        <House size={18} color={appColors.text} variant='Bulk'/>
                        <SpaceComponent width={5} />
                        <TextComponent text='Tiền phòng' fontFamily={appFonts.semiBoldOpenSans} />
                    </RowComponent>
                    <TextComponent text={`${invoice.room.roomPrice?.toLocaleString()} VNĐ`} fontFamily={appFonts.mediumOpenSans} />
                </RowComponent>
                <View style={{ width: '100%', borderTopWidth: 0.5, borderColor: appColors.gray, marginVertical: 10 }} />
                <RowComponent>
                    <RowComponent>
                        <Flash size={18} color={appColors.text} variant='Bulk'/>
                        <SpaceComponent width={5} />
                        <TextComponent text='Tiền điện' fontFamily={appFonts.semiBoldOpenSans} />
                    </RowComponent>
                    <TextComponent text={`${(invoice.powerUsage * power.pricePerUnit)?.toLocaleString()} VNĐ`} fontFamily={appFonts.mediumOpenSans} />
                </RowComponent>
                <View style={{ width: '100%', borderTopWidth: 0.5, borderColor: appColors.gray, marginVertical: 10 }} />
                <RowComponent>
                    <RowComponent>
                        <Drop size={18} color={appColors.text} variant='Bulk'/>
                        <SpaceComponent width={5} />
                        <TextComponent text='Tiền nước' fontFamily={appFonts.semiBoldOpenSans} />
                    </RowComponent>
                    <TextComponent text={`${(invoice.waterUsage * water.pricePerUnit)?.toLocaleString()} VNĐ`} fontFamily={appFonts.mediumOpenSans} />
                </RowComponent>
                <View style={{ width: '100%', borderTopWidth: 0.5, borderColor: appColors.gray, marginVertical: 10 }} />
                <RowComponent>
                    <RowComponent>
                        <Trash size={18} color={appColors.text} variant='Bulk'/>
                        <SpaceComponent width={5} />
                        <TextComponent text='Tiền rác' fontFamily={appFonts.semiBoldOpenSans} />
                    </RowComponent>
                    <TextComponent text={`${(trash.pricePerUnit)?.toLocaleString()} VNĐ`} fontFamily={appFonts.mediumOpenSans} />
                </RowComponent>
                <View style={{ width: '100%', borderTopWidth: 0.5, borderColor: appColors.gray, marginVertical: 10 }} />
                <RowComponent>
                    <TextComponent text='Tổng tiền' fontFamily={appFonts.semiBoldOpenSans}  fontSize={16}/>
                    <TextComponent text={`${invoice?.amount?.toLocaleString()} VNĐ`} fontFamily={appFonts.mediumOpenSans} fontSize={16} color={appColors.danger} />
                </RowComponent>
            </SectionComponent>

            <SectionComponent>
                {invoice.status === 'Chưa thanh toán' && <ButtonComponent text='Xác nhận đã thu tiền' onPress={handleXacNhanThuTien} />}
            </SectionComponent>
            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default DetailInvoiceScreen