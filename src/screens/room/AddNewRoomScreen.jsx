import { View, Text, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, HeaderComponent, ImagePickerComponent, LoadingModalComponent, SectionComponent, SpaceComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { apiRoom } from '../../apis/apiDTHome'
import { showMessage } from 'react-native-flash-message'
import { appColors } from '../../constants/appColors'
import { Trash } from 'iconsax-react-native'
import storage from '@react-native-firebase/storage';

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
  const [imageSelected, setImageSelected] = useState(null)
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

  const upLoadImage = async () => {
    try {
      const fileExtension = imageSelected.mime.split('/')[1]; // lấy phần đuôi tệp từ mime
      const fileName = `room-${imageSelected.modificationDate}.${fileExtension}`;
      const pathFireBase = `images/rooms/${fileName}`;

      console.log('tên ảnh: ', fileName)

      // Upload file lên Firebase
      const uploadTask = storage().ref(pathFireBase).putFile(imageSelected.path);

      uploadTask.on('state_changed', (snapshot) => {
        // Xử lý quá trình upload (có thể thêm thông báo tiến độ)
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      });

      await uploadTask;

      const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
      console.log('image được lưu tại: ', downloadURL);
      return downloadURL;

    } catch (error) {
      console.error('Error uploading image: ', error);
      showMessage({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi tải ảnh lên",
        type: "danger",
      });
      return null;
    }
  }

  const handleCreateNewRoom = async () => {
    const url = '/create'
    setIsLoading(true)
    try {
      const downloadURL = await upLoadImage();
      if (downloadURL) {
        handleChangeValue('photoUrl', downloadURL);
        await apiRoom(url, { ...dataRoom, photoUrl: downloadURL }, 'post')
        navigation.navigate('RoomScreen', { roomUpdate: true })
        showMessage({
          message: "Thông báo",
          description: "Thêm phòng thành công",
          type: "success",
        })
      }

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

      const downloadURL = await upLoadImage();
      if (downloadURL) {
        const newDataRoom = { ...dataRoom, photoUrl: downloadURL, updatedAt: new Date() }
        await apiRoom(`/update/${roomId}`, newDataRoom, 'put')
        navigation.navigate('RoomScreen', { roomUpdate: true })
        showMessage({
          message: "Thông báo",
          description: "Sửa phòng thành công",
          type: "success",
        })
      }

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
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xoá phòng này không?",
      [
        {
          text: "Huỷ",
          onPress: () => console.log("Huỷ xoá phòng"),
          style: 'cancel'
        },
        {
          text: "Xoá",
          onPress: async () => {
            setIsLoading(true);
            try {

              try {
                const fileRef = storage().refFromURL(dataRoom.photoUrl);
                if (fileRef) {
                  await fileRef.delete();
                  console.log('Ảnh đã được xoá khỏi Firebase Storage');
                }

              } catch (error) {
                console.error('Lỗi khi xoá ảnh: ', error);
              }

              await apiRoom(`/delete/${roomId}`, {}, 'delete');
              navigation.navigate('RoomScreen', { roomUpdate: true });
              showMessage({
                message: "Thông báo",
                description: "Xoá phòng thành công",
                type: "success",
              });
            } catch (e) {
              console.log('Xoá phòng thất bại');
              showMessage({
                message: "Thông báo",
                description: "Xoá phòng thất bại",
                type: "danger",
              });
            }
            setIsLoading(false);
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    )
  };

  return (
    <ContainerComponent>
      <HeaderComponent text={actionType === 'create' ? 'Thêm phòng mới' : 'Cập nhật phòng'} isBack
        buttonRight={<Trash size={20} color={appColors.danger} />}
        onRightPress={handleDeleteRoom}
      />

      <SectionComponent>
        <ImagePickerComponent text={actionType === 'create' ? 'Thêm ảnh minh hoạ' : 'Thay đổi ảnh minh hoạ'} onSelect={(val) => { setImageSelected(val) }} />
        <SpaceComponent height={8} />
        {imageSelected
          ? <Image source={{ uri: imageSelected?.path }} style={{ height: 150, width: '100%', borderRadius: 10 }} resizeMode='cover' />
          : dataRoom.photoUrl && <Image source={{ uri: dataRoom?.photoUrl }} style={{ height: 150, width: '100%', borderRadius: 10 }} resizeMode='cover' />
        }

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