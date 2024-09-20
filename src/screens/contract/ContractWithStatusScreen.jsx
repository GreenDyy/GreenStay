import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { apiRental } from '../../apis/apiDTHome'

const ContractWithStatusScreen = ({ navigation, route }) => {
    const { isRenting } = route.params
    const [contracts, setContracts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchContracts()
    }, [])


    const fetchContracts = async () => {
        setIsLoading(true)
        try {
            const res = await apiRental(`/get-all`)
            setContracts(res)
            console.log(res)
            setIsLoading(false)
        }
        catch (e) {
            console.log(e)
            setIsLoading(false)
        }
    }

    const renderContract = ({ item, index }) => {
        return (
            <RowComponent>
                <TextComponent text={item.rentalId} />
            </RowComponent>
        )
    }

    return (
        <ContainerComponent style={{ marginTop: 10 }}>
            <SpaceComponent height={14} />
            <SectionComponent>
                <FlatList
                    data={contracts.filter((item) => item.isRenting === isRenting) }
                    renderItem={renderContract}
                    keyExtractor={(item, index) => index.toString()}  // Sử dụng id nếu có
                />
            </SectionComponent>
        </ContainerComponent>
    )
}

export default ContractWithStatusScreen