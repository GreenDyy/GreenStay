import { Grid2, Layer, SearchStatus } from 'iconsax-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AvatarGroupComponent, ContainerComponent, FloatAddButtonComponent, HeaderComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { appFonts } from '../../constants/appFonts';
import { globalStyle } from '../../styles/globalStyle';
import LinearGradient from 'react-native-linear-gradient';
import InputComponent from '../../components/InputComponent';


const testData = [
  { id: 0, name: 'Phòng 1', imageUrl: 'https://img.freepik.com/free-photo/green-sofa-white-living-room-with-free-space_43614-834.jpg' },
  { id: 1, name: 'Phòng 2', imageUrl: 'https://img.freepik.com/free-photo/gray-sofa-white-living-room-interior-with-copy-space-3d-rendering_43614-802.jpg' },
  { id: 2, name: 'Phòng 3', imageUrl: 'https://aertsen.in/wp-content/uploads/2022/11/Stunning-Modern-Living-Room-Interior-Design-Ideas-in-India.jpg' },
  { id: 3, name: 'Phòng 4', imageUrl: 'https://t3.ftcdn.net/jpg/07/84/74/64/360_F_784746404_UJFSFrWxdQRXDW5J7AUMGt5HvgIaJ1b6.jpg' },
  { id: 4, name: 'Phòng 5', imageUrl: 'https://img.freepik.com/free-photo/green-sofa-white-living-room-with-free-space_43614-834.jpg' },
  { id: 5, name: 'Phòng 6', imageUrl: 'https://img.freepik.com/free-photo/green-sofa-white-living-room-with-free-space_43614-834.jpg' },
];

const dataAvatarGroup = [
  {
    imageUrl: 'https://i.pinimg.com/736x/28/dc/36/28dc36d443030e5222e4b39118f18d4e.jpg'
  },
  {
    imageUrl: 'https://i.pinimg.com/236x/29/eb/91/29eb91eea74ada9d3cbe4d31b6c83aff.jpg'
  },
  {
    imageUrl: 'https://i.pinimg.com/236x/0f/35/2a/0f352aaa89b3bba0879f18ed1b476bbe.jpg'
  },
  {
    imageUrl: 'https://i.pinimg.com/474x/8b/09/f0/8b09f0c3027fec4fa72c6e0879195d09.jpg'
  },
]

const handleGoToDetailRoom = () => {
  Alert.alert('Chi tiết phòng')
}

const renderItemGrid = ({ item }) => {
  return (
    <TouchableOpacity key={item.id} style={[localStyle.cardRoom, globalStyle.shadow]}
      onPress={handleGoToDetailRoom}>
      <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: 120 }} resizeMode='cover' />
      <SpaceComponent height={14} />
      <TextComponent text={item.name} fontFamily={appFonts.boldOpenSans} />
      <TextComponent text='Số người hiện tại: 3' fontSize={12} />
      <SpaceComponent height={5} />
      <AvatarGroupComponent data={dataAvatarGroup} />
    </TouchableOpacity>
  )
}

const renderItemList = ({ item }) => {
  return (
    <TouchableOpacity onPress={handleGoToDetailRoom}>
      <ImageBackground source={{ uri: item.imageUrl }} resizeMode='cover'
        style={[globalStyle.shadow, localStyle.cardRoomList]}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0)']} // Từ đen mờ đến trong suốt
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={localStyle.gradientOverlay}
        ></LinearGradient>

        <View style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}>
          <TextComponent text={item.name} fontFamily={appFonts.boldOpenSans} color={appColors.white} />
          <TextComponent text='Số người hiện tại: 3' fontSize={12} color={appColors.white} />
          <SpaceComponent height={8} />
          <AvatarGroupComponent data={dataAvatarGroup} />
        </View>

      </ImageBackground>
    </TouchableOpacity>

  )
}

const RoomScreen = () => {
  const [isGrid, setIsGird] = useState(true)
  const [searchKey, setSearchKey] = useState('')

  const handleAddNewRoom = () => {
    Alert.alert('New room')
  }

  return (
    <ContainerComponent>
      <HeaderComponent
        text='Danh sách phòng'
        isBack
        buttonRight={isGrid ? <Grid2 size={20} color={appColors.gray} /> : <Layer size={20} color={appColors.gray} />}
        onRightPress={() => setIsGird(!isGrid)}
      />

      {/* search bar */}
      <SectionComponent>
        <InputComponent
          iconLeft={<SearchStatus size={20} color={appColors.text} />}
          placeholder='Nhập phòng cần tìm...'
          allowClear
          value={searchKey}
          onChangeText={val => setSearchKey(val)}
        />
      </SectionComponent>
      <FlatList
        showsVerticalScrollIndicator={false}
        key={isGrid ? 'grid' : 'list'}
        data={testData}
        renderItem={isGrid ? renderItemGrid : renderItemList}
        numColumns={isGrid ? 2 : 1}
        columnWrapperStyle={isGrid ? { justifyContent: 'center' } : null}
        contentContainerStyle={{ paddingBottom: 70 }}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
      />
      <FloatAddButtonComponent onPress={handleAddNewRoom} />
    </ContainerComponent>
  )
}

export default RoomScreen

const localStyle = StyleSheet.create({
  cardRoom: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: appColors.gray2,
    height: 220,
    width: 180,
    marginTop: 0,
    marginBottom: 14,
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: appColors.white
  },

  cardRoomList: {
    height: 90,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: appColors.white,
    marginHorizontal: 16,
    justifyContent: 'center'
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: '100%',
  },
})