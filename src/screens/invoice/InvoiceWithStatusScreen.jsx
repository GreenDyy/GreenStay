import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import { apiCustomer, apiInvoice, apiRoom } from '../../apis/apiDTHome'
import { ContainerComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { appFonts } from '../../constants/appFonts'
import { getDateStringType1, getDateStringType2 } from '../../utils/Utils'
import { useDispatch, useSelector } from 'react-redux'

const InvoiceWithStatusScreen = ({ navigation, route }) => {
    const invoicesRedux = useSelector((state) => state.invoiceReducer.invoiceData)
    const { status } = route.params
    const [invoices, setInvoices] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        fetchInvoices()
    }, [invoicesRedux])

    // useEffect(() => {
    //     const reFetchData = navigation.addListener('focus', () => {
    //         fetchInvoices()
    //     });

    //     return reFetchData;
    // }, []);


    const fetchInvoices = async () => {
        setIsLoading(true)
        try {
            const res = await apiInvoice(`/get-all`)
            const newInvoices = []

            for (const invoice of res) {
                //lấy customer nhét vào invoices
                const cus = await apiCustomer(`/${invoice.customerId}`)
                //lấy phòng nhét vào invoices
                const room = await apiRoom(`/${invoice.roomId}`)
                newInvoices.push({ ...invoice, customer: cus, room: room })
            }

            setInvoices(newInvoices)
            setIsLoading(false)
        }
        catch (e) {
            console.log(e)
            setIsLoading(false)
        }
    }

    const renderInvoice = ({ item, index }) => {
        return (
            <RowComponent style={{ borderBottomColor: appColors.gray2, borderBottomWidth: 1, padding: 14 }}
                onPress={() => navigation.navigate('DetailInvoiceScreen', { item })}>
                <View>
                    <TextComponent
                        text={item.status}
                        color={item.status === 'Đã thanh toán' ? appColors.primary : appColors.danger}
                        fontSize={10} />
                    <SpaceComponent height={5} />
                    <TextComponent text={`#HD${item.invoiceId}`} />
                    <SpaceComponent height={5} />
                    <TextComponent text={getDateStringType2(item.createAt)} color={appColors.gray} fontSize={10} />
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                    <TextComponent text={item.customer.customerName} fontFamily={appFonts.semiBoldOpenSans} />
                    <SpaceComponent height={5} />
                    <TextComponent text={item.room.roomName} fontSize={12} />
                    <SpaceComponent height={5} />
                    <TextComponent text={`${item.amount.toLocaleString()} VNĐ`} fontSize={12} />
                </View>
            </RowComponent>
        )
    }

    const onRefresh = () => {
        setIsRefreshing(true)
        fetchInvoices()
        setIsRefreshing(false)
    }

    return (
        <ContainerComponent style={{ marginTop: 10 }}>
            <SpaceComponent height={14} />
            <SectionComponent>
                <FlatList
                    data={invoices.filter(item => item.status === status)}
                    renderItem={renderInvoice}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
                />
            </SectionComponent>
            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default InvoiceWithStatusScreen