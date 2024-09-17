import { View, Text, Image, Alert, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, CardComponent, CircleComponent, ContainerComponent, HeaderComponent, ImagePickerComponent, LoadingModalComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { apiCustomer, apiRoom } from '../../apis/apiDTHome'
import { showMessage } from 'react-native-flash-message'
import { appColors } from '../../constants/appColors'
import { Edit, Trash } from 'iconsax-react-native'
import storage from '@react-native-firebase/storage';
import { appInfors } from '../../constants/appInfors'

const testData = [
    {
        photoUrl: 'https://i.pinimg.com/564x/fb/68/7f/fb687f993380c1dc5a2a23f5d46b49dd.jpg',
    },
    {
        photoUrl: 'https://i.pinimg.com/564x/fb/68/7f/fb687f993380c1dc5a2a23f5d46b49dd.jpg',
    },
    {
        photoUrl: 'https://i.pinimg.com/564x/fb/68/7f/fb687f993380c1dc5a2a23f5d46b49dd.jpg',
    },
]

const initCustomer = {
    "customerName": "",
    "citizenId": "",
    "email": "",
    "phoneNumber": "",
    "photoUrl": "",
    "dateOfBirth": "",
    "citizenIdphotoFirstUrl": "",
    "citizenIdphotoBackUrl": "",
    "anotherPhotoUrl": "",
    "createdAt": "",
    "updatedAt": ""
}

const AddNewCustomerScreen = ({ navigation, route }) => {
    const { customerId, actionType } = route.params
    const [dataCustomer, setDataCustomer] = useState(initCustomer)
    const [imageSelected, setImageSelected] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (actionType === 'update') {
            fetchDataRoom()
        }
    }, [])
    useEffect(() => {
        console.log(dataCustomer)
    }, [dataCustomer])

    const handleChangeValue = (key, value) => {
        let tempData = { ...dataCustomer }
        tempData[key] = value
        setDataCustomer(tempData)
    }

    const fetchDataRoom = async () => {
        try {
            const res = await apiRoom(`/${customerId}`)
            setDataCustomer(res)
        }
        catch (e) {
            console.log('Lỗi lấy thông tin khách: ', e)
        }
    }

    const upLoadImage = async () => {
        try {
            const fileExtension = imageSelected.mime.split('/')[1]; // lấy phần đuôi tệp từ mime
            const fileName = `customer-${imageSelected.modificationDate}.${fileExtension}`;
            const pathFireBase = `images/customers/${fileName}`;

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

    const handleCreateNewCustomer = async () => {
        const url = '/create'
        setIsLoading(true)
        try {
            const downloadURL = await upLoadImage();
            if (downloadURL) {
                handleChangeValue('photoUrl', downloadURL);
                await apiCustomer(url, { ...dataCustomer, photoUrl: downloadURL }, 'post')
                navigation.navigate('CustomerScreen', { customerUpdate: true })
                showMessage({
                    message: "Thông báo",
                    description: "Thêm khách thành công",
                    type: "success",
                })
            }

        }
        catch {
            showMessage({
                message: "Thông báo",
                description: "Thêm khách thất bại",
                type: "danger",
            })
        }
    }

    const handleUpdateCustomer = async () => {
        setIsLoading(true)
        try {

            const downloadURL = await upLoadImage();
            if (downloadURL) {
                const newDataCustomer = { ...dataCustomer, photoUrl: downloadURL, updatedAt: new Date() }
                await apiCustomer(`/update/${customerId}`, newDataCustomer, 'put')
                navigation.navigate('CustomerScreen', { customerUpdate: true })
                showMessage({
                    message: "Thông báo",
                    description: "Sửa thông tin khách thành công",
                    type: "success",
                })
            }

        }
        catch {
            showMessage({
                message: "Thông báo",
                description: "Sửa thông tin khách thất bại",
                type: "danger",
            })
        }
    }

    const handleDeleteCustomer = async () => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn xoá khách hàng này không?",
            [
                {
                    text: "Huỷ",
                    onPress: () => console.log("Huỷ xoá khách hàng"),
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

                            await apiCustomer(`/delete/${customerId}`, {}, 'delete');
                            navigation.navigate('CustomerScreen', { customerUpdate: true });
                            showMessage({
                                message: "Thông báo",
                                description: "Xoá khách hàng thành công",
                                type: "success",
                            });
                        } catch (e) {
                            console.log('Xoá khách hàng thất bại');
                            showMessage({
                                message: "Thông báo",
                                description: "Xoá khách hàng thất bại",
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

    const renderTestData = ({ item, index }) => {
        return (
            <CardComponent style={{ alignItems: 'center' }} onPress={()=>{Alert.alert('chỉnh ảnh')}}>
                <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                    <Image key={index}
                        source={{ uri: item?.photoUrl }}
                        style={{ height: 130, width: appInfors.sizes.WIDTH * 0.7 }}
                        resizeMode='contain' />
                </View>
                <TextComponent text='CCCD mặt trước' />
            </CardComponent>
        )
    }

    return (
        <ContainerComponent isScroll>
            <HeaderComponent text={actionType === 'create' ? 'Thêm khách hàng mới' : 'Cập nhật thông tin khách hàng'} isBack
                buttonRight={<Trash size={20} color={appColors.danger} />}
                onRightPress={handleDeleteCustomer}
            />

            <SectionComponent style={{ alignItems: 'center' }}>
                {/* <ImagePickerComponent text={actionType === 'create' ? 'Thêm ảnh minh hoạ' : 'Thay đổi ảnh minh hoạ'} onSelect={(val) => { setImageSelected(val) }} />
          <SpaceComponent height={8} />
          {imageSelected
            ? <Image source={{ uri: imageSelected?.path }} style={{ height: 150, width: '100%', borderRadius: 10 }} resizeMode='cover' />
            : dataRoom.photoUrl && <Image source={{ uri: dataRoom?.photoUrl }} style={{ height: 150, width: '100%', borderRadius: 10 }} resizeMode='cover' />
          } */}
                <CircleComponent size={96} style={{ overflow: 'visible' }} >
                    <Image source={{ uri: 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436178.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1726444800&semt=ais_hybrid' }}
                        style={{ height: 96, width: 96, borderRadius: 999 }} resizeMode='cover' />
                    <CircleComponent size={35} style={{ position: 'absolute', top: 0, left: appInfors.sizes.WIDTH * 0.17, backgroundColor: appColors.primary }}
                        onPress={() => Alert.alert('edit image')}>
                        <Edit size={22} color={appColors.white} variant='Broken' />
                    </CircleComponent>
                </CircleComponent>

                <SpaceComponent height={10} />
                <TextComponent text='Khánh Duy' isTitle />

            </SectionComponent>

            <SectionComponent>
                <InputComponent
                    title='Tên khách hàng'
                    placeholder='Nhập tên khách hàng'
                    allowClear
                    value={dataCustomer.customerName}
                    onChangeText={val => handleChangeValue('customerName', val)}
                />

                <SpaceComponent height={14} />

                <InputComponent
                    title='Email'
                    placeholder='Nhập email'
                    allowClear
                    value={dataCustomer.email}
                    onChangeText={val => handleChangeValue('email', val)}
                />

                <SpaceComponent height={14} />

                <InputComponent
                    title='Số điện thoại'
                    placeholder='Nhập số điện thoại'
                    allowClear
                    value={dataCustomer.phoneNumber}
                    keyboardType='number-pad'
                    onChangeText={val => handleChangeValue('phoneNumber', val)}
                />

                <SpaceComponent height={14} />

                <InputComponent
                    title='CCCD/CMND'
                    placeholder='Nhập CCCD/CMND'
                    allowClear
                    value={dataCustomer.citizenId}
                    keyboardType='number-pad'
                    onChangeText={val => handleChangeValue('citizenId', val)}
                />

                <SpaceComponent height={14} />

                <TextComponent text='Chọn ngày sinh here' />
            </SectionComponent>

            <SpaceComponent height={14} />

            <SectionComponent>
                <FlatList
                    horizontal
                    data={testData}
                    renderItem={renderTestData}
                    showsHorizontalScrollIndicator={false}
                />
            </SectionComponent>

            <SpaceComponent height={14} />

            <SectionComponent>
                {
                    actionType === 'create'
                        ?
                        <ButtonComponent text='Thêm khách hàng' onPress={handleCreateNewCustomer} />
                        :
                        <ButtonComponent text='Cập nhật khách hàng' onPress={handleUpdateCustomer} />
                }
            </SectionComponent>
            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default AddNewCustomerScreen