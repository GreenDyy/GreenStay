import { Category2, Layer, SearchStatus } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { apiCustomer, apiMemberOfRental, apiRental, apiRoom } from '../../apis/apiDTHome';
import { AvatarGroupComponent, ContainerComponent, FloatAddButtonComponent, HeaderComponent, LoadingEmptyModalComponent, LoadingModalComponent, RowComponent, SectionComponent, SkeletonComponent, SpaceComponent, TextComponent } from '../../components';
import InputComponent from '../../components/InputComponent';
import { appColors } from '../../constants/appColors';
import { appFonts } from '../../constants/appFonts';
import { images } from '../../constants/images';
import { globalStyle } from '../../styles/globalStyle';
import AddNewRoomModal from './AddNewRoomModal';
import { useSelector } from 'react-redux';
import { appInfors } from '../../constants/appInfors';

const RoomScreen = ({ navigation, route }) => {
  const [isGrid, setIsGird] = useState(true)
  const [searchKey, setSearchKey] = useState('')
  const [dataRooms, setDataRooms] = useState([])
  const [dataRoomOriginals, setDataRoomOriginals] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isShowModalAdd, setIsShowModalAdd] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const checkUpdateRoom = useSelector(state => state.roomReducer.updatedValue)
  const authData = useSelector((state) => state.authReducer.authData)

  useEffect(() => {
    if (!isShowModalAdd) {
      fetchDataRooms()
    }
  }, [isShowModalAdd, checkUpdateRoom])

  useEffect(() => {
    if (searchKey) {
      const filteredData = dataRoomOriginals.filter(room =>
        room.roomName.toLowerCase().includes(searchKey.toLowerCase())
      )
      setDataRooms(filteredData)
    }
    else {
      setDataRooms(dataRoomOriginals)
    }
  }, [searchKey])

  // useEffect(() => {
  //   const reFetchData = navigation.addListener('focus', () => {
  //     fetchDataRooms(); // Cập nhật dữ liệu khi quay lại màn hình
  //   });

  //   return reFetchData;
  // }, []);

  const fetchDataRooms = async () => {
    try {
      setIsLoading(true)
      const newDataRooms = []
      const res = await apiRoom(`/${authData.ownerId}/get-all`)

      for (const room of res) {
        if (!room.isAvailable) {
          try {
            const rental = await apiRental(`/${authData.ownerId}/get-by-room-and-status/${room.roomId}/true`);
            const members = await apiMemberOfRental(`/${authData.ownerId}/get-all-by-rental/${rental.rentalId}`);

            const newMembers = []
            for (const customer of members) {
              const cus = await apiCustomer(`/${authData.ownerId}/${customer.customerId}`)
              newMembers.push({ ...cus })
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
      setDataRoomOriginals(newDataRooms)
      setIsLoading(false)
    } catch (error) {
      console.error('Lỗi api khi fetch data rooms:', error);
      setIsLoading(false)
    }
  }

  const onRefresh = async () => {
    setIsRefreshing(true)
    await fetchDataRooms()
    setIsRefreshing(false)
  }

  const handleDetailRoom = (roomId) => {
    navigation.navigate('DetailRoomScreen', { roomId: roomId })
  }

  const renderItemGrid = ({ item, index }) => {
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
      <TouchableOpacity onPress={() => handleDetailRoom(item.roomId)} style={[localStyle.cardRoomList, globalStyle.shadow]}>
        <ImageBackground source={item.photoUrl ? { uri: item.photoUrl } : images.logo1} resizeMode='cover'
          style={{ flex: 1 }}
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

  const renderSkeletonList = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleDetailRoom(item.roomId)} style={[localStyle.cardRoomList, globalStyle.shadow]}>
        <View style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}>
          <SkeletonComponent height={14} width={appInfors.sizes.WIDTH * (Math.random() * (0.8 - 0.1) + 0.1)} />
          <SpaceComponent height={8} />
          <SkeletonComponent height={14} width={appInfors.sizes.WIDTH * (Math.random() * (0.8 - 0.1) + 0.1)} />
          <SpaceComponent height={8} />
          <RowComponent style={{ justifyContent: 'flex-start' }}>
            {
              Array.from({ length: Math.floor(Math.random() * 4) + 1 }).map((_, index) => {
                return (
                  <SkeletonComponent key={index} height={24} width={24} borderRadius={999} />
                );
              })
            }
          </RowComponent>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <ContainerComponent>
      <HeaderComponent
        text='Danh sách phòng'
        isBack
        buttonRight={isGrid ? <Category2 size={22} color={appColors.gray} /> : <Layer size={20} color={appColors.gray} />}
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

      {
        // load skeleton
        isLoading
          ?
          <FlatList
            showsVerticalScrollIndicator={false}
            data={Array(10)}
            renderItem={renderSkeletonList}
            numColumns={1}
            contentContainerStyle={{ paddingBottom: 70 }}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
          />
          :
          <FlatList
            showsVerticalScrollIndicator={false}
            key={isGrid ? 'grid' : 'list'}
            data={dataRooms}
            renderItem={isGrid ? renderItemGrid : renderItemList}
            numColumns={isGrid ? 2 : 1}
            columnWrapperStyle={isGrid ? { justifyContent: 'center', paddingHorizontal: 8 } : null}
            contentContainerStyle={{ paddingBottom: 70 }}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
      }
      <FloatAddButtonComponent onPress={() => { setIsShowModalAdd(true) }} />
      <AddNewRoomModal visible={isShowModalAdd} onClose={() => setIsShowModalAdd(false)} actionType={'create'} />
      <LoadingEmptyModalComponent visible={isLoading} />
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
    // width: appInfors.sizes.WIDTH * 0.43,
    flex: 1,
    marginTop: 0,
    marginBottom: 14,
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: appColors.white
  },

  cardRoomList: {
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: appColors.white,
    marginHorizontal: 16,
    justifyContent: 'center',
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