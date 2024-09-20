import { ArrowCircleDown, Book, Briefcase, Building4, CpuCharge, DollarCircle, Drop, Electricity, Flash, House, House2, Notification, Trash, Wind } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Image, View } from 'react-native'
import { CardComponent, CircleComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, SquareBorderComponent, TabBarComponent, TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { appFonts } from '../../constants/appFonts'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/Ionicons';
import { removeItemDataStorage } from '../../utils/Utils'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { removeAuth } from '../../srcRedux/reducers/authReducer'
import { globalStyle } from '../../styles/globalStyle'
import { appInfors } from '../../constants/appInfors'
import { Text } from 'react-native-svg'

const categoryData = [
  {
    id: 'dien',
    title: 'Điện',
    price: '30000',
  },
  {
    id: 'nuoc',
    title: 'Nước',
    price: '21000',
  },
  {
    id: 'rac',
    title: 'Rác',
    price: '27000',
  },
]

const manamentData = [
  {
    id: 'qlhoadon',
    title: ' Quản lý hoá đơn'
  },

  {
    id: 'qlhopdong',
    title: ' Quản lý hợp đồng'
  },

  {
    id: 'qlphongchuadongtien',
    title: ' Phòng chưa thanh toán'
  },
]
//-------------------------------------------------------------------------------------------------------------------------------------------------------
const HomeScreen = ({ navigation }) => {
  const [totalRoom, setTotalRoom] = useState(5)
  const [totalCustomer, setTotalCustomer] = useState(12)
  const [totalRoomEmpty, setTotalRoomEmpty] = useState(1)

  const dispatch = useDispatch()

  const renderItemCategory = (item) => {
    return (
      <View key={item.id} style={{
        marginTop: 10,
        marginHorizontal: 20,
        alignItems: 'center'
      }}>
        <SquareBorderComponent height={50} width={50} backgroundColor={appColors.bgSquare}
          onPress={() => handlePressCategory(item)}
        >
          {item.id === 'nuoc' && <Drop size={30} color={appColors.water} variant='Bold' />}
          {item.id === 'dien' && <Flash size={30} color={appColors.yellow} variant='Bold' />}
          {item.id === 'rac' && <Trash size={30} color={appColors.gray} variant='Bold' />}

        </SquareBorderComponent>
        <SpaceComponent height={8} />
        <TextComponent text={item.title} fontSize={12} />

      </View>
    )
  }

  const handlePressCategory = (item) => {
    navigation.navigate('DetailPriceScreen', { item })
  }

  const handleNavigateManament = (id) => {
    switch (id) {
      case 'qlhoadon': navigation.navigate('Invoice', {
        screen: 'InvoiceScreen',
      })
        break
      case 'qlhopdong': navigation.navigate('Contract', {
        screen: 'ContractScreen',
      })
        break
      case 'qlphongchuadongtien': navigation.navigate('Contract', {
        screen: 'ContractScreen',
      })
        break
      default:
        break

    }
  }

  return (
    <ContainerComponent isScroll>
      {/* //header */}
      <SectionComponent>

        <RowComponent>
          <CircleComponent onPress={() => dispatch(removeAuth())}>
            <Image source={{ uri: 'https://i.pinimg.com/474x/04/07/6f/04076f13be66528ea4bf7dc8d13a3e63.jpg' }} style={{ height: 40, width: 40 }} resizeMode='cover' />
          </CircleComponent>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <RowComponent>
              <TextComponent text='Vị trí hiện tại' />
              <SpaceComponent width={5} />
              <ArrowCircleDown size={20} color={appColors.text} />
            </RowComponent>
            <TextComponent text='Võ Văn Vân, Bình Chánh' fontFamily={appFonts.semiBoldOpenSans} />
          </View>

          <SquareBorderComponent onPress={() => Alert.alert('Thông báo')}>
            <Notification size={22} color={appColors.primary} />
          </SquareBorderComponent>
        </RowComponent>
      </SectionComponent>


      <SectionComponent>
        <Image source={{ uri: 'https://i.pinimg.com/736x/49/e2/07/49e207af9cfd72594c6788c1c5589c2d.jpg' }}
          style={{ height: 200, width: '100%', borderRadius: 12 }} resizeMode='cover' />
      </SectionComponent>

      {/*Thông tin dãy trọ*/}
      <SectionComponent>
        <TabBarComponent title='Thông tin dãy trọ' />
        <SpaceComponent height={10} />
        <RowComponent style={[globalStyle.shadow, { backgroundColor: appColors.white2, padding: 10, borderRadius: 10 }]}>
          <View style={{ alignItems: 'center' }}>
            <TextComponent text='Tổng phòng' fontFamily={appFonts.semiBoldOpenSans} />
            <SpaceComponent height={5} />
            <TextComponent text={totalRoom} color={appColors.primary} fontFamily={appFonts.mediumOpenSans} />
          </View>

          <View style={{ alignItems: 'center' }}>
            <TextComponent text='Số người' fontFamily={appFonts.semiBoldOpenSans} />
            <SpaceComponent height={5} />
            <TextComponent text={totalCustomer} color={appColors.primary} fontFamily={appFonts.mediumOpenSans} />
          </View>

          <View style={{ alignItems: 'center' }}>
            <TextComponent text='Phòng trống' fontFamily={appFonts.semiBoldOpenSans} />
            <SpaceComponent height={5} />
            <TextComponent text={totalRoomEmpty} color={appColors.primary} fontFamily={appFonts.mediumOpenSans} />
          </View>

        </RowComponent>
      </SectionComponent>

      {/* Giá các thành phần */}
      <SectionComponent>
        <TabBarComponent title='Giá các phần' onPress={() => removeItemDataStorage('accessToken')} />
        <RowComponent>
          {categoryData.map((item) => {
            return renderItemCategory(item)
          })}
        </RowComponent>
      </SectionComponent>

      <SectionComponent>
        <TabBarComponent title='Quản lý danh sách' />
        <SpaceComponent height={10} />
        <RowComponent style={{ flexWrap: 'wrap' }}>
          {manamentData.map((item, index) => {
            const size = 50
            return (
              <CardComponent key={index} bgColor={appColors.bgSquare}
                style={[globalStyle.shadow, {
                  alignItems: 'center',
                  width: appInfors.sizes.WIDTH * 0.4333,
                  marginBottom: 14,
                  height: 120
                }]}
                onPress={() => handleNavigateManament(item.id)}>
                {item.id === 'qlhoadon' && <Book size={size} color={appColors.primary} variant='Bold' />}
                {item.id === 'qlhopdong' && <Briefcase size={size} color={appColors.primary} variant='Bold' />}
                {item.id === 'qlphongchuadongtien' && <DollarCircle size={size} color={appColors.primary} variant='Bold' />}
                <SpaceComponent height={8} />
                <TextComponent text={item.title} fontFamily={appFonts.mediumOpenSans} fontSize={12} />
              </CardComponent>
            )
          })}
        </RowComponent>
      </SectionComponent>

    </ContainerComponent>
  )
}

export default HomeScreen