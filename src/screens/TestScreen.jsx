import { View, Text, Alert, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, SectionComponent, TextComponent } from '../components'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import htmlInvoice from './invoice/htmlInvoice';
import { getDataStorage, printBillPdf } from '../utils/Utils';
import { apiOwnerAccount } from '../apis/apiDsTHome';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './auth/LoginScreen';
import { isBefore, parse } from 'date-fns';


const TestScreen = () => {
  const Drawer = createDrawerNavigator()

  const isTokenExpired = async () => {
    const authData = await getDataStorage('authData');
    if (!authData || !authData.expiresIn) return true; // Nếu không có dữ liệu hoặc không có thời gian hết hạn, coi như đã hết hạn
    const expirationTime = parse(authData.expiresIn, 'dd/MM/yyyy hh:mm:ss a', new Date());
    console.log(`expire: ${expirationTime} - date now: ${new Date()}`)
    return isBefore(expirationTime, new Date()); // Kiểm tra thời gian hết hạn
  };

  return (
    <ContainerComponent>
      {/* <Drawer.Navigator>
        <Drawer.Screen name='Hihi' component={LoginScreen} />
      </Drawer.Navigator> */}
      <ButtonComponent text='cc' onPress={isTokenExpired}/>
    </ContainerComponent>
  )
}

export default TestScreen
