import { View, Text, Image, Alert, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ButtonComponent, CardComponent, CircleComponent, ContainerComponent, DateTimePickerComponent, HeaderComponent, ImagePickerComponent, LoadingModalComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { apiCustomer, apiRoom } from '../../apis/apiDTHome'
import { showMessage } from 'react-native-flash-message'
import { appColors } from '../../constants/appColors'
import { Edit, Trash } from 'iconsax-react-native'
import storage from '@react-native-firebase/storage';
import { appInfors } from '../../constants/appInfors'
import { images } from '../../constants/images'

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
    createdAt: new Date(),
    updatedAt: new Date(),
}

const AddNewCustomerScreen = ({ navigation, route }) => {
    const { customerId, actionType } = route.params
    const [dataCustomer, setDataCustomer] = useState(initCustomer)
    const [imageSelected, setImageSelected] = useState(null)
    const [imageSelected2, setImageSelected2] = useState(null)
    const [imageSelected3, setImageSelected3] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const refImage = useRef()

    const openImagePicker = () => {

    }

    useEffect(() => {
        if (actionType === 'update') {
            fetchDataRoom()
        }
    }, [])

    //quản lý thông tin khách hàng thay đổi
    useEffect(() => {
        console.log(dataCustomer)
    }, [dataCustomer])
    useEffect(() => {
        console.log('hình avatar dc chọn nè: ', imageSelected)
    }, [imageSelected])
    useEffect(() => {
        console.log('cccd trước: ', imageSelected2)
    }, [imageSelected2])
    useEffect(() => {
        console.log('cccd sau: ', imageSelected3)
    }, [imageSelected3])
    //quản lý thông tin khách hàng thay đổi

    const handleChangeValue = (key, value) => {
        let tempData = { ...dataCustomer }
        tempData[key] = value
        setDataCustomer(tempData)
    }

    const fetchDataRoom = async () => {
        try {
            const res = await apiCustomer(`/${customerId}`)
            setDataCustomer(res)
        }
        catch (e) {
            console.log('Lỗi lấy thông tin khách: ', e)
        }
    }

    const upLoadImage = async (imageSelected) => {
        try {
            const randomNum = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
            const fileExtension = imageSelected.mime.split('/')[1]; // lấy phần đuôi tệp từ mime
            const fileName = `${randomNum}${imageSelected.modificationDate}.${fileExtension}`;
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
        //check validate
        if (!dataCustomer.customerName || !dataCustomer.email || !dataCustomer.phoneNumber || !dataCustomer.citizenId || !dataCustomer.dateOfBirth) {
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
                let newDataCustomer = { ...dataCustomer }
                if (imageSelected) {
                    const avatarUrl = await upLoadImage(imageSelected);
                    newDataCustomer = { ...dataCustomer, photoUrl: avatarUrl }
                }
                if (imageSelected2) {
                    const cccdFontUrl = await upLoadImage(imageSelected2);
                    newDataCustomer = { ...dataCustomer, citizenIdphotoFirstUrl: cccdFontUrl }
                }
                if (imageSelected3) {
                    const cccdBackUrl = await upLoadImage(imageSelected3);
                    newDataCustomer = { ...dataCustomer, citizenIdphotoBackUrl: cccdBackUrl }
                }

                await apiCustomer(url, newDataCustomer, 'post')
                navigation.navigate('CustomerScreen', { customerUpdate: true })
                // navigation.reset({
                //     index: 0,
                //     routes: [{ name: 'Người thuê' }, { name: 'CustomerScreen', params: { customerUpdate: true } }],

                // })
                showMessage({
                    message: "Thông báo",
                    description: "Thêm khách thành công",
                    type: "success",
                })
                setDataCustomer(initCustomer)
                setIsLoading(false)
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

    const handleUpdateCustomer = async () => {
        setIsLoading(true)
        try {

            let newDataCustomer = { ...dataCustomer, updatedAt: new Date() }
            if (imageSelected) {
                const avatarUrl = await upLoadImage(imageSelected);
                newDataCustomer = { ...dataCustomer, photoUrl: avatarUrl }
            }
            if (imageSelected2) {
                const cccdFontUrl = await upLoadImage(imageSelected2);
                newDataCustomer = { ...dataCustomer, citizenIdphotoFirstUrl: cccdFontUrl }
            }
            if (imageSelected3) {
                const cccdBackUrl = await upLoadImage(imageSelected3);
                newDataCustomer = { ...dataCustomer, citizenIdphotoBackUrl: cccdBackUrl }
            }

            await apiCustomer(`/update/${customerId}`, newDataCustomer, 'put')
            navigation.navigate('CustomerScreen', { customerUpdate: true })
            showMessage({
                message: "Thông báo",
                description: "Sửa thông tin khách thành công",
                type: "success",
            })
            setIsLoading(false)
        }
        catch {
            showMessage({
                message: "Thông báo",
                description: "Sửa thông tin khách thất bại",
                type: "danger",
            })
            setIsLoading(false)
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
                            //xủ lý xoá ảnh
                            try {
                                if (dataCustomer.photoUrl) {
                                    const fileRef = storage().refFromURL(dataCustomer.photoUrl);
                                    if (fileRef) {
                                        await fileRef.delete();
                                        console.log('Ảnh đã được xoá khỏi Firebase Storage');
                                    }
                                }

                                if (dataCustomer.citizenIdphotoFirstUrl) {
                                    const fileRef = storage().refFromURL(dataCustomer.citizenIdphotoFirstUrl);
                                    if (fileRef) {
                                        await fileRef.delete();
                                        console.log('Ảnh đã được xoá khỏi Firebase Storage');
                                    }
                                }

                                if (dataCustomer.citizenIdphotoBackUrl) {
                                    const fileRef = storage().refFromURL(dataCustomer.citizenIdphotoBackUrl);
                                    if (fileRef) {
                                        await fileRef.delete();
                                        console.log('Ảnh đã được xoá khỏi Firebase Storage');
                                    }
                                }
                            }
                            catch (error) {
                                console.error('Lỗi khi xoá ảnh: ', error);
                            }

                            await apiCustomer(`/delete/${customerId}`, {}, 'delete');
                            navigation.navigate('CustomerScreen', { customerUpdate: true });
                            showMessage({
                                message: "Thông báo",
                                description: "Xoá khách hàng thành công",
                                type: "success",
                            });
                            setIsLoading(false)
                        } catch (e) {
                            console.log('Xoá khách hàng thất bại');
                            showMessage({
                                message: "Thông báo",
                                description: "Xoá khách hàng thất bại",
                                type: "danger",
                            });
                            setIsLoading(false)
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
            <CardComponent style={{ alignItems: 'center' }} onPress={() => { Alert.alert('chỉnh ảnh') }}>
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
            {actionType === 'create'
                ? <HeaderComponent text='Thêm khách hàng' isBack />
                :
                <HeaderComponent text='Thông tin khách hàng' isBack
                    buttonRight={<Trash size={20} color={appColors.danger} />}
                    onRightPress={handleDeleteCustomer}
                />}

            <SectionComponent style={{ alignItems: 'center' }}>
                {/* ẩn này */}
                <ImagePickerComponent ref={refImage} text={'Thêm ảnh minh hoạ'} onSelect={(val) => { setImageSelected(val) }} style={{ opacity: 0, position: 'absolute' }} />
                <CircleComponent size={96} style={{ overflow: 'visible' }} >
                    {
                        imageSelected
                            ?
                            <Image source={{ uri: imageSelected.path }} style={{ height: 96, width: 96, borderRadius: 999 }} resizeMode='cover' />
                            : (dataCustomer.photoUrl
                                ?
                                <Image source={{ uri: dataCustomer.photoUrl }} style={{ height: 96, width: 96, borderRadius: 999 }} resizeMode='cover' />
                                :
                                <Image source={images.avatar_null}
                                    style={{ height: 96, width: 96, borderRadius: 999 }} resizeMode='cover' />)
                    }
                    <CircleComponent size={35} style={{ position: 'absolute', top: 0, left: appInfors.sizes.WIDTH * 0.17, backgroundColor: appColors.primary }}
                        onPress={() => { refImage.current.open() }}>
                        <Edit size={22} color={appColors.white} variant='Broken' />
                    </CircleComponent>
                </CircleComponent>

                <SpaceComponent height={10} />
                {dataCustomer.customerName && <TextComponent text={dataCustomer.customerName} isTitle />}

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

                <DateTimePickerComponent type='date' title='Chọn ngày sinh' selected={dataCustomer.dateOfBirth} onSelect={(val) => { handleChangeValue('dateOfBirth', val) }} />
            </SectionComponent>

            <SpaceComponent height={14} />

            {/* vùng này của ảnh CCCD */}
            <SectionComponent>
                {/* <FlatList
                    horizontal
                    data={testData}
                    renderItem={renderTestData}
                    showsHorizontalScrollIndicator={false}
                /> */}
                <ImagePickerComponent text={'Thêm ảnh CCCD mặt trước'} onSelect={(val) => { setImageSelected2(val) }}
                    style={{ color: appColors.primary, textDecorationLine: 'underline' }} />
                <SpaceComponent height={8} />
                {
                    imageSelected2
                        ?
                        <Image
                            source={{ uri: imageSelected2.path }}
                            style={{ height: 130, width: '100%' }}
                            resizeMode='stretch'
                        />
                        :
                        (dataCustomer.citizenIdphotoFirstUrl
                            ?
                            <Image
                                source={{ uri: dataCustomer.citizenIdphotoFirstUrl }}
                                style={{ height: 130, width: '100%' }}
                                resizeMode='stretch'
                            />
                            :
                            <Image
                                source={images.cccd}
                                style={{ height: 130, width: '100%' }}
                                resizeMode='stretch'
                            />
                        )
                }
                <SpaceComponent height={8} />
                <ImagePickerComponent text={'Thêm ảnh CCCD mặt sau'} onSelect={(val) => { setImageSelected3(val) }}
                    style={{ color: appColors.primary, textDecorationLine: 'underline' }} />
                <SpaceComponent height={8} />
                {
                    imageSelected3
                        ?
                        <Image
                            source={{ uri: imageSelected3.path }}
                            style={{ height: 130, width: '100%' }}
                            resizeMode='stretch'
                        />
                        :
                        (dataCustomer.citizenIdphotoBackUrl
                            ?
                            <Image
                                source={{ uri: dataCustomer.citizenIdphotoBackUrl }}
                                style={{ height: 130, width: '100%' }}
                                resizeMode='stretch'
                            />
                            :
                            <Image
                                source={images.cccd}
                                style={{ height: 130, width: '100%' }}
                                resizeMode='stretch'
                            />
                        )
                }
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
            <SpaceComponent height={30} />
            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default AddNewCustomerScreen