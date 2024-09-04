import { View, Text, Alert, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CircleComponent, ContainerComponent, FloatAddButtonComponent, HeaderComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { ArrowCircleRight, Bill, SearchStatus } from 'iconsax-react-native'
import { appFonts } from '../../constants/appFonts'
import { appColors } from '../../constants/appColors'
import InputComponent from '../../components/InputComponent'

const dataCustomer = [
  {
    id: 1,
    name: 'Huỳnh Khánh Duy',
    phoneNumber: '02838484835',
    imageUrl: 'https://i.pinimg.com/736x/28/dc/36/28dc36d443030e5222e4b39118f18d4e.jpg'
  },
  {
    id: 2,
    name: 'Nguyễn Thị Thu',
    phoneNumber: '02838484836',
    imageUrl: 'https://i.pinimg.com/236x/97/6f/2d/976f2d88e63ab26cd5c56831a80bdc38.jpg'
  },
  {
    id: 3,
    name: 'Lê Hoàng Nam',
    phoneNumber: '02838484837',
    imageUrl: 'https://i.pinimg.com/236x/37/bf/bd/37bfbd34cc1d82127e73f7c5e190dd4a.jpg'
  },
  {
    id: 4,
    name: 'Phạm Văn Tùng',
    phoneNumber: '02838484838',
    imageUrl: 'https://i.pinimg.com/236x/d4/68/32/d46832b36834e189f2c73ee7a4695b72.jpg'
  },
  {
    id: 5,
    name: 'Trần Minh Châu',
    phoneNumber: '02838484839',
    imageUrl: 'https://i.pinimg.com/236x/63/56/41/63564199c875cd563175c4e90ed65e7c.jpg'
  },
  {
    id: 6,
    name: 'Đỗ Bích Ngọc',
    phoneNumber: '02838484840',
    imageUrl: 'https://i.pinimg.com/236x/80/75/cb/8075cb5f195229282928e28f15531931.jpg'
  }
];


const CustomerScreen = () => {
  const [searchKey, setSearchKey] = useState('')

  // xem vui thoi
  useEffect(() => {
    console.log(searchKey)
  }, [searchKey])

  const handleOpenDetailCustomer = () => {
    Alert.alert('Chi tiết khách nè')
  }

  const renderItemCustomer = ({ item }) => {
    return (
      <RowComponent key={item?.id}
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
            <Image source={{ uri: item?.imageUrl }} style={{ height: 40, width: 40 }} resizeMode='cover' />
          </CircleComponent>
          <SpaceComponent width={10} />
          <View>
            <TextComponent text={item?.name} fontFamily={appFonts.semiBoldOpenSans} />
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
          data={dataCustomer}
          renderItem={renderItemCustomer}
        />

      </SectionComponent>
      <FloatAddButtonComponent onPress={handleAddNewCustomer} />
    </ContainerComponent>
  )
}

export default CustomerScreen