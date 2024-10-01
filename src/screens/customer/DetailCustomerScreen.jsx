import { CallCalling, Card, Edit, Messages2 } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { apiCustomer } from '../../apis/apiDTHome'
import { CircleComponent, ContainerComponent, HeaderComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { appFonts } from '../../constants/appFonts'
import { images } from '../../constants/images'
import AddNewCustomerModal from './AddNewCustomerModal'

const initCustomer = {
    "customerId": 1,
    "customerName": "Huỳnh Khánh Duy",
    "citizenId": "991223344",
    "email": "duyxanh2002@gmail.com",
    "phoneNumber": "02838484835",
    "photoUrl": "https://i.pinimg.com/736x/28/dc/36/28dc36d443030e5222e4b39118f18d4e.jpg",
    "dateOfBirth": "1980-09-09T00:00:00",
    "citizenIdphotoFirstUrl": null,
    "citizenIdphotoBackUrl": null,
    "anotherPhotoUrl": null,
    "createdAt": "2024-09-09T21:26:22.273",
    "updatedAt": "2024-09-09T21:26:22.273",
    "memberOfRentals": [],
    "rentals": []
}

const DetailCustomerScreen = ({ navigation, route }) => {
    const { customerId } = route.params
    const [customer, setCustomer] = useState(initCustomer)
    const [isLoading, setIsLoading] = useState(false)
    const [isShowModalCustomerUpdate, setIsShowModalCustomerUpdate] = useState(false)

    useEffect(() => {
        if (!isShowModalCustomerUpdate)
            fetchcustomer()
    }, [isShowModalCustomerUpdate])

    const fetchcustomer = async () => {
        setIsLoading(true)
        try {
            const res = await apiCustomer(`/${customerId}`)
            setCustomer(res)
            console.log(res)
            setIsLoading(false)
        }
        catch (e) {
            setIsLoading(false)
            console.log(e)
        }
    }
    return (
        <ContainerComponent>
            {/* sẽ check xem là tôi từ màn nào đến đây, nếu là từ detail room thì sẽ cho navigate còn ko thì goback */}
            <HeaderComponent
                text='Thông tin khách hàng'
                isBack
                buttonRight={<Edit size={20} color={appColors.text} />}
                onRightPress={() => setIsShowModalCustomerUpdate(true)}
            />
            <SectionComponent style={{ alignItems: 'center' }}>
                <CircleComponent size={96} style={{ overflow: 'visible' }} >
                    {
                        customer.photoUrl
                            ?
                            <Image source={{ uri: customer.photoUrl }} style={{ height: 96, width: 96, borderRadius: 999 }} resizeMode='cover' />
                            :
                            <Image source={images.avatar_null} style={{ height: 96, width: 96, borderRadius: 999 }} resizeMode='cover' />

                    }
                </CircleComponent>
                <SpaceComponent height={10} />
                <TextComponent text={customer?.customerName} isTitle />
            </SectionComponent>

            {/* body */}
            <SectionComponent>
                <RowComponent style={{ justifyContent: 'flex-start', borderBottomWidth: 0.5, borderBottomColor: appColors.gray2, paddingVertical: 5 }}>
                    <Card size={30} color={appColors.primary} variant='Bold' />
                    <SpaceComponent width={10} />
                    <View>
                        <TextComponent text='CMND/CCCD' fontFamily={appFonts.boldOpenSans} />
                        <TextComponent text={customer?.citizenId} fontFamily={appFonts.mediumOpenSans} color={appColors.gray} fontSize={13} />
                    </View>
                </RowComponent>

                <SpaceComponent height={14} />

                <RowComponent style={{ justifyContent: 'flex-start', borderBottomWidth: 0.5, borderBottomColor: appColors.gray2, paddingVertical: 5 }}>
                    <Messages2 size={30} color={appColors.primary} variant='Bold' />
                    <SpaceComponent width={10} />
                    <View>
                        <TextComponent text='Email' fontFamily={appFonts.boldOpenSans} />
                        <TextComponent text={customer?.phoneNumber} fontFamily={appFonts.mediumOpenSans} color={appColors.gray} fontSize={13} />
                    </View>
                </RowComponent>

                <SpaceComponent height={14} />

                <RowComponent style={{ justifyContent: 'flex-start', borderBottomWidth: 0.5, borderBottomColor: appColors.gray2, paddingVertical: 5 }}>
                    <CallCalling size={30} color={appColors.primary} variant='Bold' />
                    <SpaceComponent width={10} />
                    <View>
                        <TextComponent text='Số điện thoại' fontFamily={appFonts.boldOpenSans} />
                        <TextComponent text={customer?.citizenId} fontFamily={appFonts.mediumOpenSans} color={appColors.gray} fontSize={13} />
                    </View>
                </RowComponent>

            </SectionComponent>

            <AddNewCustomerModal actionType={'update'} customerId={customerId} visible={isShowModalCustomerUpdate} onClose={() => setIsShowModalCustomerUpdate(false)} />
            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default DetailCustomerScreen