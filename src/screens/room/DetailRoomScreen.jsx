import { View, Text, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CircleComponent, ContainerComponent, HeaderComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TabBarComponent, TextComponent } from '../../components'
import { apiCustomer, apiMemberOfRental, apiRental, apiRoom } from '../../apis/apiDTHome'
import { ArrowCircleRight, Edit } from 'iconsax-react-native'
import { appColors } from '../../constants/appColors'
import { images } from '../../constants/images'
import { appFonts } from '../../constants/appFonts'

const initRoom = {
    roomId: "",
    roomName: "",
    roomPrice: "",
    photoUrl: "",
    isAvailable: true,
}

const DetailRoomScreen = ({ navigation, route }) => {
    const { roomId } = route.params
    const [dataRoom, setDataRoom] = useState(initRoom)
    const [dataCustomers, setDataCustomers] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchDataRoom()
    }, [])

    useEffect(() => {
        fetchDataMemberOfRoom()
    }, [dataRoom])

    const fetchDataRoom = async () => {
        setIsLoading(true)
        try {
            const data = await apiRoom(`/${roomId}`)
            setDataRoom(data)
            console.log('data room nè: ', data)
            setIsLoading(false)
        }
        catch (e) {
            setIsLoading(false)
            console.log(e)
        }
    }

    const fetchDataMemberOfRoom = async () => {
        setIsLoading(true)
        try {
            if (!dataRoom.isAvailable) {
                const rental = await apiRental(`/get-by-room-and-status/${roomId}/true`);
                const members = await apiMemberOfRental(`/get-all-by-rental/${rental.rentalId}`);
                const newMembers = []
                for (const customer of members) {
                    const cus = await apiCustomer(`/${customer.customerId}`)
                    newMembers.push({ ...cus })
                }
                console.log('cus nè:', newMembers)
                setDataCustomers(newMembers)
            }
            setIsLoading(false)
        }
        catch (e) {
            setIsLoading(false)
            console.log(e)
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
                        <Image source={item.photoUrl ? { uri: item?.photoUrl } : images.logo1} style={{ height: 40, width: 40 }} resizeMode='cover' />
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

    return (
        <ContainerComponent>
            <HeaderComponent
                text='Thông tin phòng'
                isBack
                buttonRight={<Edit size={20} color={appColors.text} />}
                onRightPress={() => navigation.navigate('AddNewRoomScreen',
                    {
                        roomId,
                        actionType: 'update'
                    })}
            />

            {dataRoom.photoUrl &&
                <SectionComponent>
                    <Image source={{ uri: dataRoom?.photoUrl }} style={{ height: 150, width: '100%', borderRadius: 10 }} resizeMode='cover' />
                </SectionComponent>
            }
            <SectionComponent>
                <TextComponent text={dataRoom?.roomName} />
            </SectionComponent>

            <SectionComponent>
                <TabBarComponent title='Danh sách người thuê' />
                <SpaceComponent height={14} />
                <FlatList
                    data={dataCustomers}
                    renderItem={renderItemCustomer}
                    keyExtractor={(item, index) => index.toString()}
                />
            </SectionComponent>
            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default DetailRoomScreen