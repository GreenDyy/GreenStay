import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ContainerComponent, HeaderComponent, LoadingModalComponent, SectionComponent, TextComponent } from '../../components'
import { apiCustomer } from '../../apis/apiDTHome'

const DetailCustomerScreen = ({ navigation, route }) => {
    const { customerId } = route.params
    const [customer, setCustomer] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchDataCustomer()
    }, [])

    const fetchDataCustomer = async () => {
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
            <HeaderComponent text='Thông tin khách hàng' isBack />
            <SectionComponent>

            </SectionComponent>

            <SectionComponent>
                <TextComponent text={customer?.customerName} />
            </SectionComponent>

            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default DetailCustomerScreen