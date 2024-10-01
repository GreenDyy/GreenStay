import { View, Modal, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import React, { useImperativeHandle, useState, forwardRef, ReactNode } from 'react';
import ButtonComponent from './ButtonComponent';
import TextComponent from './TextComponent';
import { globalStyle } from '../styles/globalStyle';
import ImageCropPicker, { Options } from 'react-native-image-crop-picker';
import { appColors } from '../constants/appColors';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';

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
                style={{ flex: 1 }}
                transparent
            >
                <View style={[
                    globalStyle.container,
                    {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                ]}>
                    <View style={{
                        flex: 1,
                        marginTop: 300,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ButtonComponent text='Chọn từ thư viện' onPress={() => handleChoiceImage('library')} />
                        <ButtonComponent text='Camera' onPress={() => handleChoiceImage('camera')} />
                        <ButtonComponent text='Huỷ' onPress={() => setIsShowModal(false)} />
                    </View>
                </View>
            </Modal>
        </>
    );
});

export default ImagePickerComponent;
