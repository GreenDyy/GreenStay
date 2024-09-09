import { ArrowCircleDown, Building4, CpuCharge, Drop, Electricity, Flash, Notification, Trash, Wind } from 'iconsax-react-native'
import React, { useEffect } from 'react'
import { Alert, FlatList, Image, View } from 'react-native'
import { CircleComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, SquareBorderComponent, TabBarComponent, TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { appFonts } from '../../constants/appFonts'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/Ionicons';
import { removeItemDataStorage } from '../../utils/Utils'
import axios from 'axios'

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
  {
    id: 'phong',
    title: 'Phòng',
    price: '25000',
  },
]

const HomeScreen = ({ navigation }) => {

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
          {item.id === 'phong' && <Building4 size={30} color={appColors.purple} variant='Bold' />}

        </SquareBorderComponent>
        <SpaceComponent height={8} />
        <TextComponent text={item.title} />

      </View>
    )
  }

  const handlePressCategory = (item) => {
    navigation.navigate('DetailPriceScreen', { item })
  }

  return (
    <ContainerComponent isScroll>
      {/* //header */}
      <SectionComponent>

        <RowComponent>
          <CircleComponent onPress={() => Alert.alert('Đây là avatar')}>
            <Image source={{ uri: 'https://i.pinimg.com/236x/93/13/aa/9313aaef3c4edb2481fba31378631db5.jpg' }} style={{ height: 40, width: 40 }} resizeMode='cover' />
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
        <Image source={{ uri: 'https://i.pinimg.com/1200x/fc/25/31/fc25312ae2e2a245733ed2f171413614.jpg' }}
          style={{ height: 200, width: '100%', borderRadius: 12 }} resizeMode='cover' />
      </SectionComponent>

      {/*Thông tin dãy trọ*/}
      <SectionComponent>
        <TabBarComponent title='Thông tin dãy trọ' />
        <SpaceComponent height={10} />
        <RowComponent>
          <View style={{ alignItems: 'center' }}>
            <TextComponent text='Tổng phòng' fontFamily={appFonts.semiBoldOpenSans} />
            <SpaceComponent height={4} />
            <TextComponent text='5' color={appColors.primary} fontFamily={appFonts.mediumOpenSans} />
          </View>

          <View style={{ alignItems: 'center' }}>
            <TextComponent text='Số người' fontFamily={appFonts.semiBoldOpenSans} />
            <TextComponent text='5' color={appColors.primary} fontFamily={appFonts.mediumOpenSans} />
          </View>

          <View style={{ alignItems: 'center' }}>
            <TextComponent text='Phòng trống' fontFamily={appFonts.semiBoldOpenSans} />
            <TextComponent text='5' color={appColors.primary} fontFamily={appFonts.mediumOpenSans} />
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
        <TabBarComponent title='Thông tin' />
        <SpaceComponent height={10} />
        <TextComponent text='DTStay là một mô hình không gian sống được tái hiện trong môi trường số, cho phép người dùng trải nghiệm và tương tác như thể họ đang sống trong một căn phòng trọ thực tế. Thông qua công nghệ thực tế ảo (VR) và thực tế tăng cường (AR), phòng trọ ảo mang đến trải nghiệm sống động, cho phép người dùng tùy chỉnh không gian, thiết kế nội thất theo ý thích, và thậm chí mời bạn bè tham quan phòng trọ của mình qua mạng. Mô hình này không chỉ giúp tiết kiệm chi phí mà còn mở ra cơ hội khám phá những ý tưởng sáng tạo trong thiết kế không gian sống, đồng thời phù hợp với nhu cầu sống và làm việc từ xa ngày càng tăng. Với phòng trọ ảo, giới hạn của không gian vật lý không còn là rào cản, mà thay vào đó, là một sân chơi rộng mở cho sự sáng tạo và kết nối.'
          style={{ textAlign: 'justify' }} />
      </SectionComponent>

    </ContainerComponent>
  )
}

export default HomeScreen