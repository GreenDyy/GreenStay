import { Camera, CloseSquare, Gallery } from 'iconsax-react-native';
import React, { forwardRef, ReactNode, useImperativeHandle, useState } from 'react';
import { Modal, Pressable, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import ImageCropPicker, { Options } from 'react-native-image-crop-picker';
import { appColors } from '../constants/appColors';
import { appInfors } from '../constants/appInfors';
import { globalStyle } from '../styles/globalStyle';
import CircleComponent from './CircleComponent';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';

interface Props {
    onSelect: (val: any) => void;
    text: string;
    style: StyleProp<ViewStyle>;
    icon?: ReactNode
}

const options: Options = {
    cropping: true,
    mediaType: 'photo',
};

// Sử dụng forwardRef để truyền ref từ component cha vào
const ImagePickerComponent = forwardRef((props: Props, ref) => {
    const { onSelect, text, style, icon } = props;
    const [isShowModal, setIsShowModal] = useState(false);

    // Expose hàm open() qua ref
    useImperativeHandle(ref, () => ({
        open: () => setIsShowModal(true),
    }));

    const handleChoiceImage = (key: string) => {
        switch (key) {
            case 'library':
                ImageCropPicker.openPicker(options).then(res => {
                    onSelect(res);
                    console.log('ảnh nè: ', res);
                });
                break;

            case 'camera':
                ImageCropPicker.openCamera(options).then(res => {
                    onSelect(res);
                });
                break;
            default:
                break;
        }
        setIsShowModal(false);
    };

    return (
        <>
            {/* Không cần gán ref cho TouchableOpacity */}
            <TouchableOpacity onPress={() => setIsShowModal(true)} style={style}>
                <RowComponent style={{ justifyContent: 'flex-start' }}>
                    {icon && <>
                        {icon}
                        <SpaceComponent width={5} />
                    </>}
                    <TextComponent text={text} style={[{
                        color: appColors.primary,
                        textDecorationLine: 'underline'
                    }, style]} />
                </RowComponent>
            </TouchableOpacity>

            <Modal
                visible={isShowModal}
                statusBarTranslucent
                transparent
                animationType='slide'
            >
                <View style={[
                    globalStyle.container,
                    {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                ]}>
                    <Pressable style={{ flex: 1, width: appInfors.sizes.WIDTH }} onPress={() => setIsShowModal(false)}/>

                    <View style={{
                        width: appInfors.sizes.WIDTH,
                        minHeight: appInfors.sizes.HEIGHT * 0.2,
                        backgroundColor: appColors.white,
                        justifyContent: 'center',
                        borderTopRightRadius: 15,
                        borderTopLeftRadius: 15,
                        padding: 10,
                    }}>
                        <RowComponent style={{ justifyContent: 'flex-start' }} onPress={() => handleChoiceImage('library')}>
                            <CircleComponent size={30} color={appColors.gray2}>
                                <Gallery size={18} color={appColors.text} variant='Bold' />
                            </CircleComponent>
                            <SpaceComponent width={10} />
                            <TextComponent text='Chọn từ thư viện' />
                        </RowComponent>
                        <SpaceComponent height={20} />
                        <RowComponent style={{ justifyContent: 'flex-start' }} onPress={() => handleChoiceImage('camera')}>
                            <CircleComponent size={30} color={appColors.gray2}>
                                <Camera size={18} color={appColors.text} variant='Bold' />
                            </CircleComponent>
                            <SpaceComponent width={10} />
                            <TextComponent text='Camera' />
                        </RowComponent>
                        <SpaceComponent height={20} />
                        <RowComponent style={{ justifyContent: 'flex-start' }} onPress={() => setIsShowModal(false)}>
                            <CircleComponent size={30} color={appColors.gray2}>
                                <CloseSquare size={18} color={appColors.text} variant='Bold' />
                            </CircleComponent>
                            <SpaceComponent width={10} />
                            <TextComponent text='Huỷ' />
                        </RowComponent>

                    </View>
                </View>
            </Modal>
        </>
    );
});

export default ImagePickerComponent;
