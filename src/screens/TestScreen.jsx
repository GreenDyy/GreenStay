import { View, Text, Alert, StyleSheet, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { ButtonComponent, ContainerComponent, SectionComponent, TextComponent } from '../components'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import htmlInvoice from './invoice/htmlInvoice';
import { printBillPdf } from '../utils/Utils';

// import Pdf from 'react-native-pdf';
// import { read } from 'react-native-fs';

const TestScreen = () => {
  const [pdfPath, setPdfPath] = useState(null)
  const [isLoading, setIsLoading] = useState(false)



  const createPDF = async () => {
    const dataPrint = {
      customerName: "Nguyen Van A",
      roomName: "Phòng 101",
      customerPhoneNumber: "0987654321",
      invoiceId: "INV001",
      description: "Thanh toán tiền phòng tháng 9/2024",
      roomPrice: '5000000', // Giá phòng
      powerPrice: '300000',  // Tiền điện
      waterPrice: '200000',  // Tiền nước
      trashPrice: '50000',   // Tiền rác
      invoiceCreateAt: "2024-09-30T10:00:00" // Ngày tạo hóa đơn
  };
  
  const pathPdf = printBillPdf(dataPrint)
  if (pathPdf) {
    setPdfPath(pathPdf)
      console.log('đã xuất bill pdf tại: ', pathPdf)
  }
  }

  // const createPDF = async () => {
  //   setIsLoading(true)
  //   try {
  //     let options = {
  //       html: htmlInvoice,
  //       fileName: 'tests',
  //       directory: 'Documents',
  //     };

  //     let file = await RNHTMLtoPDF.convert(options)
  //     setPdfPath(file.filePath)

  //     // Lấy đường dẫn đến thư mục Download của hệ thống
  //     const destPath = `${RNFS.DownloadDirectoryPath}/testss.pdf`;

  //     // Di chuyển file đến thư mục Download
  //     await RNFS.moveFile(file.filePath, destPath);

  //     Alert.alert('Thông báo', `File đã được lưu tại ${destPath}`);

  //   }
  //   catch (e) {
  //     console.log('loi xuat pdf: ', e)
  //   }

  // }

  return (
    <ContainerComponent>
      <SectionComponent>
        <TextComponent text='Test' />
      </SectionComponent>

      <SectionComponent>
        <ButtonComponent text='Create PDF' onPress={createPDF} />
      </SectionComponent>

      {pdfPath ?
        <View>
          <Pdf source={{ uri: 'file://' + pdfPath }}
            style={[styles.pdf]} />
        </View>

        : <TextComponent text='cc' />}


    </ContainerComponent>
  )
}

export default TestScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});