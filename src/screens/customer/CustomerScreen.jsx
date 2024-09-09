import { ArrowCircleRight, SearchStatus } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Image, View } from 'react-native'
import { apiCustomer } from '../../apis/apiDTHome'
import { CircleComponent, ContainerComponent, FloatAddButtonComponent, HeaderComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { appColors } from '../../constants/appColors'
import { appFonts } from '../../constants/appFonts'
import { images } from '../../constants/images'

const CustomerScreen = () => {
  const [searchKey, setSearchKey] = useState('')
  const [dataCustomers, setDataCustomers] = useState([])


  useEffect(() => {
    const url = '/get-all'
    const fetchDataCustomers = async () => {
      const data = await apiCustomer(url, null, 'get')
      setDataCustomers(data.data)
    }
    fetchDataCustomers()
  }, [])

  // xem vui thoi
  useEffect(() => {
    console.log(searchKey)
  }, [searchKey])
  useEffect(() => {
    console.log('data cus:', dataCustomers)
  }, [dataCustomers])

  const handleOpenDetailCustomer = () => {
    Alert.alert('Chi tiết khách nè')
  }

  const renderItemCustomer = ({ item }) => {
    return (
      <RowComponent
        onPress={() => { handleOpenDetailCustomer() }}
        style={{
          borderBottomWidth: 1,
          paddingVertical: 10,
          paddingTop: item.id === 1 && 0
        }}
      >
        <RowComponent style={{
          justifyContent: 'flex-start'
        }}>
          <CircleComponent>
            <Image source={item.photoUrl ? { uri: item?.photoUrl } : images.logo1} style={{ height: 40, width: 40 }} resizeMode='cover' />
          </CircleComponent>
          <SpaceComponent width={10} />
          <View>
            <TextComponent text={item?.customerName} fontFamily={appFonts.semiBoldOpenSans} />
            <TextComponent text={item?.phoneNumber} fontSize={12} color={appColors.gray} />
          </View>
        </RowComponent>

        <RowComponent >
          <TextComponent text='Phòng 5' fontSize={12} color={appColors.text} />
          <SpaceComponent width={5} />
          <ArrowCircleRight size={15} color={appColors.text} />
        </RowComponent>
      </RowComponent>
    )
  }

  const handleAddNewCustomer = () => {
    Alert.alert('Thêm cus moi71F')
  }

  return (
    <ContainerComponent>
      <HeaderComponent
        text='Người thuê'
        isBack
      />
      {/* search bar */}
      <SectionComponent>
        <InputComponent
          iconLeft={<SearchStatus size={20} color={appColors.text} />}
          placeholder='Nhập tên cần tìm...'
          allowClear
          value={searchKey}
          onChangeText={val => setSearchKey(val)}
        />
      </SectionComponent>

      <SectionComponent>
        <FlatList
          data={dataCustomers}
          renderItem={renderItemCustomer}
        />

      </SectionComponent>
      <FloatAddButtonComponent onPress={handleAddNewCustomer} />
    </ContainerComponent>
  )
}

export default CustomerScreen