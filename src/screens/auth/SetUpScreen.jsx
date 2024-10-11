import { View, Text, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ButtonComponent, CircleComponent, ContainerComponent, HeaderComponent, ImagePickerComponent, LoadingModalComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import InputComponent from '../../components/InputComponent'
import { images } from '../../constants/images'
import { Edit, GalleryAdd } from 'iconsax-react-native'
import { appInfors } from '../../constants/appInfors'
import storage from '@react-native-firebase/storage'
import { showMessage } from 'react-native-flash-message'
import { apiOwnerAccount, apiOwnerBuilding, apiPower, apiTrash, apiWater } from '../../apis/apiDTHome'
import { addAuth } from '../../srcRedux/reducers/authReducer'
import { setDataStorage } from '../../utils/Utils'
import { useDispatch } from 'react-redux'

const initOwner = {
  "ownerName": "",
  "email": "",
  "phoneNumber": "",
  "photoUrl": "",
  "createdAt": new Date(),
  "updatedAt": new Date(),
  "password": "",
  "rePassword": "",
  pricePower: "",
  priceWater: "",
  priceTrash: ""
}

const SetUpScreen = ({ navigation, route }) => {
  const { phoneNumber } = route.params
  const [owner, setOwner] = useState(initOwner)
  const [imageSelected, setImageSelected] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const refImage = useRef()

  const dispatch = useDispatch()

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
    //chặn chưa nhập đủ thông tin
    if (!owner.ownerName || !owner.password || !owner.rePassword || !owner.pricePower || !owner.priceTrash || !owner.priceWater) {
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
        //B1 tạo profile
        let profile = {
          ownerName: owner.ownerName,
          email: owner.email,
          phoneNumber: phoneNumber,
          photoUrl: imageSelected ? await upLoadImage(imageSelected) : "",
          createdAt: owner.createdAt,
          updatedAt: owner.updatedAt
        }
        const resProfile = await apiOwnerBuilding(`/create`, profile, 'post')
        console.log('đã tạo xog profile')
        if (resProfile) {
          //B2 tạo account
          let account = {
            ownerId: resProfile.ownerId,
            phoneNumber: phoneNumber,
            password: owner.password,
            createdAt: owner.createdAt,
            updatedAt: owner.updatedAt
          }
          const resAccount = await apiOwnerAccount(`/create`, account, 'post')
          console.log('đã tạo xog account')
          if (resAccount) {
            //B3 tạo các giá thành phần ban đầu cho dãy trọ

            await apiPower(`/create`, {
              pricePerUnit: owner.pricePower,
              effectiveDate: new Date(),
              ownerId: resProfile.ownerId
            }, 'post')

            await apiWater(`/create`, {
              pricePerUnit: owner.priceWater,
              effectiveDate: new Date(),
              ownerId: resProfile.ownerId
            }, 'post')

            await apiTrash(`/create`, {
              pricePerUnit: owner.priceTrash,
              effectiveDate: new Date(),
              ownerId: resProfile.ownerId
            }, 'post')
            
            //B4 tiến hành login 
            setOwner(initOwner)
            const res = await apiOwnerAccount(`/login`, { phoneNumber, password: owner.password }, 'post')
            if (res) {
              const authData = {
                ownerId: res.ownerId,
                ownerName: res.ownerName,
                email: res.email,
                phoneNumber: res.phoneNumber,
                photoUrl: res.photoUrl,
                accessToken: 'laytubackend'
              }
              dispatch(addAuth(authData))
              await setDataStorage('authData', authData)
              showMessage({
                message: 'Thông báo',
                description: 'Đăng nhập thành công',
                type: 'success'
              })
            }
            else {
              showMessage({
                message: 'Thông báo',
                description: 'Số điện thoại hoặc mật khẩu không chính xác',
                type: 'danger'
              })
            }
          }
        }
      }
      catch (e) {
        showMessage({
          message: "Thông báo",
          description: "Đăng ký tài khoản thất bại",
          type: "danger",
        })
        console.error(e)
        setIsLoading(false)
      }
    }
  }

  return (
    <ContainerComponent isScroll >
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
          isPassword
          isRequire
        />

        <SpaceComponent height={14} />

        <InputComponent
          title='Xác nhận mật khẩu'
          placeholder='Nhập mật khẩu'
          value={owner?.rePassword}
          keyboardType='number-pad'
          onChangeText={val => handleChangeValue('rePassword', val)}
          isPassword
          isRequire
        />

        <SpaceComponent height={14} />

        <InputComponent
          title='Giá điện'
          placeholder='Nhập giá điện'
          value={owner?.pricePower}
          keyboardType='number-pad'
          onChangeText={val => handleChangeValue('pricePower', val)}
          allowClear
          isRequire
        />

        <SpaceComponent height={14} />

        <InputComponent
          title='Giá nước'
          placeholder='Nhập giá nước'
          value={owner?.priceWater}
          keyboardType='number-pad'
          onChangeText={val => handleChangeValue('priceWater', val)}
          allowClear
          isRequire
        />

        <SpaceComponent height={14} />

        <InputComponent
          title='Giá rác'
          placeholder='Nhập giá rác'
          value={owner?.priceTrash}
          keyboardType='number-pad'
          onChangeText={val => handleChangeValue('priceTrash', val)}
          allowClear
          isRequire
        />
      </SectionComponent>

      <SectionComponent>
        <ButtonComponent text='Hoàn tất' onPress={handleCreateOwner} />
      </SectionComponent>
      <LoadingModalComponent visible={isLoading} />
    </ContainerComponent>
  )
}

export default SetUpScreen