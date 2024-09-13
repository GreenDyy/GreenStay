import { Grid2, Layer, SearchStatus } from 'iconsax-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import { apiCustomer, apiMemberOfRental, apiRental, apiRoom } from '../../apis/apiDTHome';
import { AvatarGroupComponent, ContainerComponent, FloatAddButtonComponent, HeaderComponent, LoadingModalComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import InputComponent from '../../components/InputComponent';
import { appColors } from '../../constants/appColors';
import { appFonts } from '../../constants/appFonts';
import { globalStyle } from '../../styles/globalStyle';
import { images } from '../../constants/images';
import { appInfors } from '../../constants/appInfors';
import { useFocusEffect } from '@react-navigation/native';

const RoomScreen = ({ navigation, route }) => {
  const { callAgain } = route.params || { callAgain: -999 }
  const [isGrid, setIsGird] = useState(true)
  const [searchKey, setSearchKey] = useState('')
  const [dataRooms, setDataRooms] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchApi()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchApi()
    }, [])
  )


  const fetchApi = async () => {
    const url = '/get-all';
    try {
      setIsLoading(true)
      const newDataRooms = []
      const res = await apiRoom(url)

      for (const room of res) {
        if (!room.isAvailable) {
          try {
            const rental = await apiRental(`/get-by-room-and-status/${room.roomId}/true`);

            const members = await apiMemberOfRental(`/get-all-by-rental/${rental.rentalId}`);

            const newMembers = []
            for (const customer of members) {
              const cus = await apiCustomer(`/${customer.customerId}`)
              newMembers.push({ ...cus })
              console.log('cus nè:', cus)
            }
            newDataRooms.push({ ...room, members: newMembers });


          } catch (error) {
            console.error(`Error fetching members for room ${room.roomId}:`, error);
            setIsLoading(false)

          }
        } else {
          newDataRooms.push(room); // Thêm phòng mà không thay đổi gì
        }
      }
      setDataRooms(newDataRooms)
      setIsLoading(false)
    } catch (error) {
      console.error('Lỗi api:', error);
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log('room nè0:', dataRooms)
  }, [dataRooms])

  const handleDetailRoom = (roomId) => {
    navigation.navigate('DetailRoomScreen', { roomId: roomId })
  }

  const renderItemGrid = ({ item }) => {
    return (
      <TouchableOpacity style={[localStyle.cardRoom, globalStyle.shadow]}
        onPress={() => handleDetailRoom(item.roomId)}>
        <Image source={item.photoUrl ? { uri: item.photoUrl } : images.logo1}
          style={{ width: '100%', height: 120 }}
          resizeMode='cover' />
        <SpaceComponent height={14} />
        <TextComponent text={item.roomName} fontFamily={appFonts.boldOpenSans} />
        {!item.isAvailable ?
          <>
            <TextComponent text='Số người hiện tại: 3' fontSize={12} />
            <SpaceComponent height={5} />
            <AvatarGroupComponent data={item?.members} />
          </>
          :
          <TextComponent text='Phòng trống' fontSize={12} color={appColors.danger} />
        }
      </TouchableOpacity>
    )
  }

  const renderItemList = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleDetailRoom(item.roomId)}>
        <ImageBackground source={item.photoUrl ? { uri: item.photoUrl } : images.logo1} resizeMode='cover'
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
            <TextComponent text={item.roomName} fontFamily={appFonts.boldOpenSans} color={appColors.white} />
            {!item.isAvailable ?
              <>
                <TextComponent text='Số người hiện tại: 3' fontSize={12} color={appColors.white} />
                <SpaceComponent height={8} />
                <AvatarGroupComponent data={item?.members} />
              </>
              :
              <TextComponent text='Phòng trống' fontSize={12} color={appColors.danger} />
            }
          </View>

        </ImageBackground>
      </TouchableOpacity>

    )
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
        data={dataRooms}
        renderItem={isGrid ? renderItemGrid : renderItemList}
        numColumns={isGrid ? 2 : 1}
        columnWrapperStyle={isGrid ? { justifyContent: 'center' } : null}
        contentContainerStyle={{ paddingBottom: 70 }}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
      />
      <FloatAddButtonComponent onPress={() => navigation.navigate('AddNewRoomScreen', { actionType: 'create' })} />
      <LoadingModalComponent visible={isLoading} />
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
    width: appInfors.sizes.WIDTH * 0.43,
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