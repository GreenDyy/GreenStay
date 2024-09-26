import React from 'react'
import { ContainerComponent, HeaderComponent } from '../../components'
import InvoiceTopTabNavigator from '../../navigators/InvoiceTopTabNavigator'

const InvoidceScreen = () => {
    return (
        <ContainerComponent>
            <HeaderComponent text='Danh sách hoá đơn' isBack />
            <InvoiceTopTabNavigator />
        </ContainerComponent>
    )
}

export default InvoidceScreen