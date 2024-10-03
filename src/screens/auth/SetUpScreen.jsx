import { View, Text, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { ButtonComponent, CircleComponent, ContainerComponent, HeaderComponent, ImagePickerComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import InputComponent from '../../components/InputComponent'
import { images } from '../../constants/images'
import { Edit, GalleryAdd } from 'iconsax-react-native'
import { appInfors } from '../../constants/appInfors'
import storage from '@react-native-firebase/storage'
import { showMessage } from 'react-native-flash-message'
import { apiOwnerAccount, apiOwnerBuilding } from '../../apis/apiDTHome'

const initOwner = {
  "ownerName": "",
  "email": "",
  "phoneNumber": "",
  "photoUrl": "",
  "createdAt": new Date(),
  "updatedAt": new Date(),
  "password": "",
  "rePassword": "",
}

const SetUpScreen = ({ navigation, route }) => {
  const { phoneNumber } = route.params
  const [owner, setOwner] = useState(initOwner)
  const [imageSelected, setImageSelected] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const refImage = useRef()

  const handleChangeValue = (key, value) => {
    let temp = { ...owner }
    temp[key] = value
    setOwner(temp)
  }

  const upLoadImage = async (imageSelected) => {
    try {
      const randomNum = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
      const fileExtension = imageSelected.mime.split('/')[1]; // lấy phần đuôi tệp từ mime
      const fileName = `${randomNum}${imageSelected.modificationDate}.${fileExtension}`;
      const pathFireBase = `images/owners/${fileName}`;

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

  const handleCreateOwner = async () => {
    setIsLoading(true)
    if (!owner.ownerName || !owner.password) {
      showMessage({
        message: 'Thông báo',
        description: 'Vui lòng nhập đủ thông tin',
        type: 'warning'
      })
      setIsLoading(false)
      return
    }
    else {
      try {
        // if (imageSelected) {
        //   const avatarUrl = await upLoadImage(imageSelected);
        //   newDataOwner = { ...owner, photoUrl: avatarUrl }
        // }

        let profile = {
          ownerName: owner.ownerName,
          email: owner.email,
          phoneNumber: phoneNumber,
          photoUrl: await upLoadImage(imageSelected) || "",
          createdAt: owner.createdAt,
          updatedAt: owner.updatedAt
        }
        const resProfile = await apiOwnerBuilding(`/create`, profile, 'post')
        if (resProfile) {
          let account = {
            ownerId: resProfile.ownerId,
            phoneNumber: phoneNumber,
            password: owner.password,
            createdAt: owner.createdAt,
            updatedAt: owner.updatedAt
          }
          await apiOwnerAccount(`/create`, account, 'post')
          showMessage({
            message: "Thông báo",
            description: "Thêm khách thành công",
            type: "success",
          })
          setOwner(initOwner)
        }
      }
      catch {
        showMessage({
          message: "Thông báo",
          description: "Thêm khách thất bại",
          type: "danger",
        })
        setIsLoading(false)
      }
    }
  }

  return (
    <ContainerComponent>
      <HeaderComponent isBack />
      <SectionComponent>
        <TextComponent text='Thiết lập thông tin' isTitle fontSize={32} style={{ textAlign: 'center' }} />
        <SpaceComponent height={10} />
        <TextComponent text={`Thiết lập thêm thông tin cho ${phoneNumber}`} color={appColors.gray} style={{ textAlign: 'center' }} numberOfLines={3} />
      </SectionComponent>

      <SectionComponent style={{ alignItems: 'center' }}>
        {/* ẩn này */}
        <ImagePickerComponent ref={refImage} text={'Thêm ảnh minh hoạ'} onSelect={(val) => { setImageSelected(val) }} style={{ opacity: 0, position: 'absolute' }} />
        <CircleComponent size={96} style={{ overflow: 'visible' }} >
          {
            imageSelected
              ?
              <Image source={{ uri: imageSelected.path }} style={{ height: 96, width: 96, borderRadius: 999 }} resizeMode='cover' />
              : (owner.photoUrl
                ?
                <Image source={{ uri: owner.photoUrl }} style={{ height: 96, width: 96, borderRadius: 999 }} resizeMode='cover' />
                :
                <Image source={images.avatar_null}
                  style={{ height: 96, width: 96, borderRadius: 999 }} resizeMode='cover' />)
          }
          <CircleComponent
            size={35}
            style={{ position: 'absolute', top: 0, left: appInfors.sizes.WIDTH * 0.17, backgroundColor: appColors.primary }}
            onPress={() => { refImage.current.open() }}
          >
            <GalleryAdd size={22} color={appColors.white} variant='Broken' />
          </CircleComponent>
        </CircleComponent>
      </SectionComponent>

      <SectionComponent>
        <InputComponent
          title='Họ và tên'
          placeholder='Nhập họ và tên'
          value={owner?.ownerName}
          keyboardType='number-pad'
          onChangeText={val => handleChangeValue('ownerName', val)}
          allowClear
          isRequire
        />
        <SpaceComponent height={14} />

        <InputComponent
          title='Email'
          placeholder='Nhập email'
          value={owner?.email}
          keyboardType='number-pad'
          onChangeText={val => handleChangeValue('email', val)}
          allowClear
        />

        <SpaceComponent height={14} />

        <InputComponent
          title='Mật khẩu'
          placeholder='Nhập mật khẩu'
          value={owner?.password}
          keyboardType='number-pad'
          onChangeText={val => handleChangeValue('password', val)}
          allowClear
          isRequire
        />

        <SpaceComponent height={14} />

        <InputComponent
          title='Xác nhận mật khẩu'
          placeholder='Nhập mật khẩu'
          value={owner?.rePassword}
          keyboardType='number-pad'
          onChangeText={val => handleChangeValue('rePassword', val)}
          allowClear
          isRequire
        />
      </SectionComponent>

      <SectionComponent>
        <ButtonComponent text='Hoàn tất' onPress={handleCreateOwner}/>
      </SectionComponent>
    </ContainerComponent>
  )
}

export default SetUpScreen