import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { apiInvoice } from '../../apis/apiDTHome'

const InvoiceWithStatusScreen = ({ navigation, route }) => {
    const { status } = route.params
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
            console.log('ds hoá đơn: ', res)
            setIsLoading(false)
        }
        catch (e) {
            console.log(e)
            setIsLoading(false)
        }
    }

    const renderInvoice = ({ item, index }) => {
        return (
            <RowComponent>
                <TextComponent text={item.invoiceId} />
            </RowComponent>
        )
    }

    return (
        <ContainerComponent style={{ marginTop: 10 }}>
            <SpaceComponent height={14} />
            <SectionComponent>
                <FlatList
                    data={invoices.filter(item => item.status === status)}
                    renderItem={renderInvoice}
                    keyExtractor={(item, index) => index.toString()}  // Sử dụng id nếu có
                />
            </SectionComponent>
        </ContainerComponent>
    )
}

export default InvoiceWithStatusScreen