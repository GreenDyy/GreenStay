import React, { useEffect, useState } from 'react'
import { FlatList, Image, RefreshControl, View } from 'react-native'
import { useSelector } from 'react-redux'
import { apiCustomer, apiInvoice, apiRoom } from '../../apis/apiDTHome'
import { ContainerComponent, LoadingEmptyModalComponent, LoadingModalComponent, RowComponent, SectionComponent, SkeletonComponent, SpaceComponent, TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { appFonts } from '../../constants/appFonts'
import { getDateStringType2 } from '../../utils/Utils'
import { images } from '../../constants/images'
import { appInfors } from '../../constants/appInfors'

const InvoiceWithStatusScreen = ({ navigation, route }) => {
    const invoicesRedux = useSelector((state) => state.invoiceReducer.invoiceData)
    const { status } = route.params
    const [invoices, setInvoices] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const authData = useSelector((state) => state.authReducer.authData)

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
            const res = await apiInvoice(`/${authData.ownerId}/get-all`)
            const newInvoices = []

            for (const invoice of res) {
                //lấy customer nhét vào invoices
                const cus = await apiCustomer(`/${authData.ownerId}/${invoice.customerId}`)
                //lấy phòng nhét vào invoices
                const room = await apiRoom(`/${authData.ownerId}/${invoice.roomId}`)
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

    const renderSkeleton = () => {
        return (
            <RowComponent style={{ borderBottomColor: appColors.gray2, borderBottomWidth: 1, padding: 14 }}>
                <View>
                    <SkeletonComponent height={10} width={80} />
                    <SpaceComponent height={5} />
                    <SkeletonComponent height={14} width={100} />
                    <SpaceComponent height={5} />
                    <SkeletonComponent height={10} width={65} />
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                    <SkeletonComponent height={14} width={140} />
                    <SpaceComponent height={5} />
                    <SkeletonComponent height={10} width={50} />
                    <SpaceComponent height={5} />
                    <SkeletonComponent height={10} width={80} />
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
            {
                isLoading
                    ?
                    <FlatList
                        data={Array.from({ length: 10 })}
                        renderItem={renderSkeleton}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
                    />
                    :
                    (
                        invoices.filter(item => item.status === status).length !== 0
                            ?
                            <FlatList
                                data={invoices.filter(item => item.status === status)}
                                renderItem={renderInvoice}
                                keyExtractor={(item, index) => index.toString()}
                                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
                            />
                            :
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: appInfors.sizes.HEIGHT * 0.15 }}>
                                <Image source={images.bill} style={{ height: 200, width: 200 }} resizeMode='stretch' />
                                <SpaceComponent height={14} />
                                <TextComponent text='Không có hoá đơn nào' isTitle />
                            </View>
                    )
            }
            <LoadingEmptyModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default InvoiceWithStatusScreen