import React from 'react'
import { ContainerComponent, HeaderComponent } from '../../components'
import ContractTopTabNavigator from '../../navigators/ContractTopTabNavigator'

const ContractScreen = () => {
  return (
    <ContainerComponent>
      <HeaderComponent text='Danh sách hợp đồng' isBack />
      <ContractTopTabNavigator />
    </ContainerComponent>
  )
}

export default ContractScreen