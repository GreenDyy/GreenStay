import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, HeaderComponent, LoadingModalComponent, SectionComponent, SpaceComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { apiRoom } from '../../apis/apiDTHome'
import { showMessage } from 'react-native-flash-message'
import { appColors } from '../../constants/appColors'
import { Trash } from 'iconsax-react-native'

const initRoom = {
  roomName: '',
  roomPrice: '',
  photoUrl: '',
  isVailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const AddNewRoomScreen = ({ navigation, route }) => {
  const { roomId, actionType } = route.params
  const [dataRoom, setDataRoom] = useState(initRoom)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (actionType === 'update') {
      fetchDataRoom()
    }
  }, [])
  useEffect(() => {
    console.log(dataRoom)
  }, [dataRoom])

  const handleChangeValue = (key, value) => {
    let tempData = { ...dataRoom }
    tempData[key] = value
    setDataRoom(tempData)
  }

  const fetchDataRoom = async () => {
    try {
      const res = await apiRoom(`/${roomId}`)
      setDataRoom(res)
    }
    catch (e) {
      console.log('Lỗi lấy thông tin phòng: ', e)
    }
  }

  const handleCreateNewRoom = async () => {
    const url = '/create'
    setIsLoading(true)
    try {
      await apiRoom(url, dataRoom, 'post')
      navigation.navigate('RoomScreen', { roomUpdate: true })
      showMessage({
        message: "Thông báo",
        description: "Thêm phòng thành công",
        type: "success",
      })
    }
    catch {
      showMessage({
        message: "Thông báo",
        description: "Thêm phòng thất bại",
        type: "danger",
      })
    }
  }

  const handleUpdateRoom = async () => {
    setIsLoading(true)
    try {
      const newDataRoom = { ...dataRoom, updatedAt: new Date() }
      await apiRoom(`/update/${roomId}`, newDataRoom, 'put')
      navigation.navigate('RoomScreen', { roomUpdate: true })
      showMessage({
        message: "Thông báo",
        description: "Sửa phòng thành công",
        type: "success",
      })
    }
    catch {
      showMessage({
        message: "Thông báo",
        description: "Sửa phòng thất bại",
        type: "danger",
      })
    }
  }

  const handleDeleteRoom = async () => {
    setIsLoading(true)
    try {
      await apiRoom(`/delete/${roomId}`, {}, 'delete')
      navigation.navigate('RoomScreen', { roomUpdate: true })
      showMessage({
        message: "Thông báo",
        description: "Xoá phòng thành công",
        type: "success",
      })
      setIsLoading(false)
    }
    catch (e) {
      console.log('Xoá phòng thất bại')
      showMessage({
        message: "Thông báo",
        description: "Xoá phòng thất bại",
        type: "danger",
      })
      setIsLoading(false)
    }
  }

  return (
    <ContainerComponent>
      <HeaderComponent text={actionType === 'create' ? 'Thêm phòng mới' : 'Cập nhật phòng'} isBack
        buttonRight={<Trash size={20} color={appColors.danger} />}
        onRightPress={handleDeleteRoom}
      />

      <SectionComponent>
        {
          actionType === 'create'
            ?
            <ButtonComponent text='Thêm ảnh minh hoạ' type='link' onPress={() => { }} />
            :
            <ButtonComponent text='Thay đổi minh hoạ' type='link' onPress={() => { }} />
        }
        <SpaceComponent height={8} />
        {dataRoom.photoUrl && <Image source={{ uri: dataRoom?.photoUrl }} style={{ height: 150, width: '100%', borderRadius: 10 }} resizeMode='cover' />}

      </SectionComponent>

      <SectionComponent>
        <InputComponent
          title='Tên phòng'
          placeholder='Nhập tên phòng'
          allowClear
          value={dataRoom.roomName}
          onChangeText={val => handleChangeValue('roomName', val)}
        />

        <SpaceComponent height={14} />

        <InputComponent
          title='Giá'
          placeholder='Nhập giá phòng'
          allowClear
          value={dataRoom.roomPrice.toString()}
          keyboardType='number-pad'
          onChangeText={val => handleChangeValue('roomPrice', val)}
        />
      </SectionComponent>

      <SpaceComponent height={14} />
      <SectionComponent>
        {
          actionType === 'create'
            ?
            <ButtonComponent text='Thêm phòng' onPress={handleCreateNewRoom} />
            :
            <ButtonComponent text='Cập nhật phòng' onPress={handleUpdateRoom} />
        }
      </SectionComponent>
      <LoadingModalComponent visible={isLoading} />
    </ContainerComponent>
  )
}

export default AddNewRoomScreen