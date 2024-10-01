import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, HeaderComponent, LoadingModalComponent, SectionComponent, TextComponent } from '../../components'
import { Printer } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import { getDateStringType2, printBillPdf } from '../../utils/Utils';
import { showMessage } from 'react-native-flash-message';
import { apiInvoice, apiPower, apiTrash, apiWater } from '../../apis/apiDTHome';
import { updateInvoices } from '../../srcRedux/reducers/invoiceReducer';
import { useDispatch } from 'react-redux';

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
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        setInvoice(item)
    }, [item])

    useEffect(() => {
        console.log(invoice)
    }, [invoice])

    const handlePrintPdf = async () => {
        setIsLoading(true)
        try {
            const water = await apiWater(`/latest-price`)
            const power = await apiPower(`/latest-price`)
            const trash = await apiTrash(`/latest-price`)

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
                <TextComponent text={invoice.status} />
            </SectionComponent>

            <SectionComponent>
                {invoice.status === 'Chưa thanh toán' && <ButtonComponent text='Xác nhận đã thu tiền' onPress={handleXacNhanThuTien} />}
            </SectionComponent>
            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default DetailInvoiceScreen