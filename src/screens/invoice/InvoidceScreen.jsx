import React, { useEffect, useState } from 'react'
import { ContainerComponent, HeaderComponent, RowComponent, SectionComponent, TextComponent } from '../../components'
import { apiInvoice } from '../../apis/apiDTHome'
import { FlatList, TouchableOpacity } from 'react-native'
import InvoiceTopTabNavigator from '../../navigators/InvoiceTopTabNavigator'

const InvoidceScreen = ({ navigation, route }) => {

    const [invoices, setInvoices] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchInvoices()
    }, [])


    const fetchInvoices = async () => {
        setIsLoading(true)
        try {
            const res = await apiInvoice(`/get-all`)
            setInvoices(res)
            console.log(res)
            setIsLoading(false)
        }
        catch (e) {
            console.log(e)
            setIsLoading(false)
        }
    }

    return (
        <ContainerComponent>
            <HeaderComponent text='Danh sách hoá đơn' isBack />

            <InvoiceTopTabNavigator />
        </ContainerComponent>
    )
}

export default InvoidceScreen