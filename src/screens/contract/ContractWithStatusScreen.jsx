import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CardComponent, ContainerComponent, FloatAddButtonComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { apiCustomer, apiRental, apiRoom } from '../../apis/apiDTHome'
import { appColors } from '../../constants/appColors'
import { appFonts } from '../../constants/appFonts'
import { getDateStringType2 } from '../../utils/Utils'
import AddContractModal from './AddContractModal'
import { useSelector } from 'react-redux'
import { RefreshControl } from 'react-native-gesture-handler'

const ContractWithStatusScreen = ({ navigation, route }) => {
    const { isRenting } = route.params
    const [contracts, setContracts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isShowModalContractAdd, setIsShowModalContractAdd] = useState(false)
    const checkUpdate = useSelector((state) => state.contractReducer.contractData)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const authData = useSelector((state) => state.authReducer.authData)

    useEffect(() => {
        fetchContracts()
    }, [checkUpdate])

    const onRefresh = () => {
        setIsRefreshing(true)
        fetchContracts()
        setIsRefreshing(false)
    }

    const fetchContracts = async () => {
        setIsLoading(true)
        try {
            const contracts = await apiRental(`/${authData.ownerId}/get-all`)
            const newContracts = []

            for (const contract of contracts) {
                //lấy customer nhét vào contracts
                const cus = await apiCustomer(`/${authData.ownerId}/${contract.customerId}`)
                //lấy phòng nhét vào contracts
                const room = await apiRoom(`/${authData.ownerId}/${contract.roomId}`)
                newContracts.push({ ...contract, customer: cus, room: room })
            }

            setContracts(newContracts)
            setIsLoading(false)
        }
        catch (e) {
            console.log(e)
            setIsLoading(false)
        }
    }

    const renderContract = ({ item, index }) => {
        return (
            <RowComponent style={{ borderBottomColor: appColors.gray2, borderBottomWidth: 1, padding: 14 }}
                onPress={() => navigation.navigate('DetailContractScreen', { item })}>
                <View>
                    <TextComponent
                        text={item.isRenting ? 'Còn trong hạn' : 'Đã chấm dứt'}
                        color={item.isRenting ? appColors.primary : appColors.danger}
                        fontSize={10} />
                    <SpaceComponent height={5} />
                    <TextComponent text={`#HD${item.rentalId}`} />
                    <SpaceComponent height={5} />
                    <TextComponent text={getDateStringType2(item.createdAt)} color={appColors.gray} fontSize={10} />
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                    <TextComponent text={item.customer.customerName} fontFamily={appFonts.semiBoldOpenSans} />
                    <SpaceComponent height={5} />
                    <TextComponent text={item.room.roomName} fontSize={12} />
                </View>
            </RowComponent>
        )
    }

    return (
        <ContainerComponent style={{ marginTop: 10 }}>
            <SpaceComponent height={14} />

            <FlatList
                data={contracts.filter((item) => item.isRenting === isRenting)}
                renderItem={renderContract}
                keyExtractor={(item, index) => index.toString()}  
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
            />
             <FloatAddButtonComponent onPress={() => { setIsShowModalContractAdd(true) }} />
             <AddContractModal visible={isShowModalContractAdd} onClose={() => setIsShowModalContractAdd(false)} />
            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default ContractWithStatusScreen