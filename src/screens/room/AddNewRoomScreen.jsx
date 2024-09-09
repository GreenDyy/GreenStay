import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, HeaderComponent, SectionComponent, SpaceComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { apiRoom } from '../../apis/apiDTHome'
import { showMessage } from 'react-native-flash-message'

const initRoom = {
  roomName: '',
  roomPrice: '',
  photoUrl: '',
  isVailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const AddNewRoomScreen = () => {
  const [dataRoom, setDataRoom] = useState(initRoom)

  useEffect(() => {
    console.log(dataRoom)
  }, [dataRoom])

  const handleChangeValue = (key, value) => {
    let tempData = { ...dataRoom }
    tempData[key] = value
    setDataRoom(tempData)
  }

  const handleCreateNewRoom = async () => {
    const url = '/create'
    try {
      await apiRoom(url, dataRoom, 'post')
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

  return (
    <ContainerComponent>
      <HeaderComponent text='Thêm phòng mới' isBack />
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
        <ButtonComponent text='Thêm phòng' onPress={handleCreateNewRoom} />
      </SectionComponent>
    </ContainerComponent>
  )
}

export default AddNewRoomScreen