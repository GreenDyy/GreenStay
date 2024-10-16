import { View, Text, Image, Alert, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, HeaderComponent, ImagePickerComponent, LoadingModalComponent, SectionComponent, SpaceComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { apiRoom } from '../../apis/apiDTHome'
import { showMessage } from 'react-native-flash-message'
import { appColors } from '../../constants/appColors'
import { Image as ImageIcon, Trash } from 'iconsax-react-native'
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { updateRooms } from '../../srcRedux/reducers/roomReducer'

const initRoom = {
  roomName: '',
  roomPrice: '',
  photoUrl: '',
  waterAfter: '',
  powerAfter: '',
  isVailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ownerId: ''
}

const AddNewRoomModal = ({ roomId, actionType, visible, onClose }) => {
  const [dataRoom, setDataRoom] = useState(initRoom)
  const [imageSelected, setImageSelected] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()

  const dispatch = useDispatch()
  const authData = useSelector((state) => state.authReducer.authData)

  useEffect(() => {
    if (actionType === 'update') {
      fetchDataRoom()
    }
  }, [])
  useEffect(() => {
    console.log(dataRoom)
  }, [dataRoom])

  const handleChangeValue = (key, value) => {
    let tempData = { ...dataRoom, ownerId: authData.ownerId }
    tempData[key] = value
    setDataRoom(tempData)
  }

  const fetchDataRoom = async () => {
    try {
      const res = await apiRoom(`/${authData.ownerId}/${roomId}`)
      setDataRoom(res)
    }
    catch (e) {
      console.log('Lỗi lấy thông tin phòng: ', e)
    }
  }

  const upLoadImage = async () => {
    try {
      const randomNum = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
      const fileExtension = imageSelected.mime.split('/')[1]; // lấy phần đuôi tệp từ mime
      const fileName = `${randomNum}${imageSelected.modificationDate}.${fileExtension}`;
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
    setIsLoading(true)
    if (!dataRoom.roomName || !dataRoom.roomPrice) {
      showMessage({
        message: 'Thông báo',
        description: 'Vui lòng nhập đủ thông tin',
        type: 'warning'
      })
      setIsLoading(false)
      return
    }

    try {
      let newDataRoom = { ...dataRoom }
      if (imageSelected) {
        const downloadURL = await upLoadImage();
        newDataRoom = {
          ...dataRoom,
          photoUrl: downloadURL,
        }
      }
      console.log('data trc khi them: ', newDataRoom)
      await apiRoom(`/create`, newDataRoom, 'post')

      showMessage({
        message: "Thông báo",
        description: "Thêm phòng thành công",
        type: "success",
      })
      setDataRoom(initRoom)
      setIsLoading(false)
      dispatch(updateRooms(Math.random()))
      onClose()
    }
    catch (e) {
      showMessage({
        message: "Thông báo",
        description: "Thêm phòng thất bại",
        type: "danger",
      })
      onClose()
      console.error(data)
      setIsLoading(false)
    }
  }

  const handleUpdateRoom = async () => {
    setIsLoading(true)
    try {
      let newDataRoom = { ...dataRoom }
      if (imageSelected) {
        const downloadURL = await upLoadImage();
        newDataRoom = {
          ...dataRoom,
          photoUrl: downloadURL,
          updatedAt: new Date()
        }
      }
      await apiRoom(`/update/${roomId}`, newDataRoom, 'put')
      showMessage({
        message: "Thông báo",
        description: "Sửa phòng thành công",
        type: "success",
      })
      setIsLoading(false)
      dispatch(updateRooms(Math.random()))
      onClose()

    }
    catch {
      showMessage({
        message: "Thông báo",
        description: "Sửa phòng thất bại",
        type: "danger",
      })
      setIsLoading(false)
      onClose()
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

              // có ảnh thì mới xoá
              if (dataRoom.photoUrl) {
                try {
                  const fileRef = storage().refFromURL(dataRoom.photoUrl);
                  if (fileRef) {
                    await fileRef.delete();
                    console.log('Ảnh đã được xoá khỏi Firebase Storage');
                  }
                  setIsLoading(false)
                }
                catch (error) {
                  console.error('Lỗi khi xoá ảnh: ', error);
                  setIsLoading(false)
                }
              }

              await apiRoom(`/delete/${roomId}`, {}, 'delete');
              navigation.navigate('RoomScreen');
              showMessage({
                message: "Thông báo",
                description: "Xoá phòng thành công",
                type: "success",
              });
              dispatch(updateRooms(Math.random()))
              onClose()
            } catch (e) {
              console.log('Xoá phòng thất bại');
              showMessage({
                message: "Thông báo",
                description: "Xoá phòng thất bại do phòng đang được cho thuê",
                type: "danger",
              });
              onClose()
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
    <Modal visible={visible} >
      <ContainerComponent>
        {
          actionType === 'create'
            ?
            <HeaderComponent text='Thêm phòng mới' isBack customIsBack={onClose} />
            :
            <HeaderComponent text='Cập nhật phòng' isBack customIsBack={onClose}
              buttonRight={<Trash size={20} color={appColors.danger} />}
              onRightPress={handleDeleteRoom}
            />
        }

        <SectionComponent>

          <ImagePickerComponent text={actionType === 'create' ? 'Thêm ảnh minh hoạ' : 'Thay đổi ảnh minh hoạ'}
            onSelect={(val) => { setImageSelected(val) }}
            icon={<ImageIcon size={22} color={appColors.primary} />} />

          {imageSelected
            ? <Image source={{ uri: imageSelected?.path }} style={{ height: 150, width: '100%', borderRadius: 10, marginTop: 8 }} resizeMode='cover' />
            : dataRoom.photoUrl && <Image source={{ uri: dataRoom?.photoUrl }} style={{ height: 150, width: '100%', borderRadius: 10, marginTop: 8 }} resizeMode='cover' />
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

          <SpaceComponent height={14} />

          <InputComponent
            title='Số điện hiện tại'
            placeholder='Nhập số điện hiện tại'
            allowClear
            value={String(dataRoom.powerAfter)}
            keyboardType='number-pad'
            onChangeText={val => handleChangeValue('powerAfter', val)}
          />

          <SpaceComponent height={14} />

          <InputComponent
            title='Số nước hiện tại'
            placeholder='Nhập số nước hiện tại'
            allowClear
            value={dataRoom.waterAfter.toString()}
            keyboardType='number-pad'
            onChangeText={val => handleChangeValue('waterAfter', val)}
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
    </Modal>
  )
}

export default AddNewRoomModal