import { View, Text, Alert, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, SectionComponent, TextComponent } from '../components'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import htmlInvoice from './invoice/htmlInvoice';
import { printBillPdf } from '../utils/Utils';
import { apiOwnerAccount } from '../apis/apiDTHome';


const TestScreen = () => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await apiOwnerAccount(`/get-all`)
      setData(res)
      console.log(res)
    }
    fetchData()
  }, [])

  return (
    <ContainerComponent>
      <TextComponent text='aa' />

    </ContainerComponent>
  )
}

export default TestScreen
