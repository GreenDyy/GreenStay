import { View, Modal, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import React, { useImperativeHandle, useState, forwardRef } from 'react';
import ButtonComponent from './ButtonComponent';
import TextComponent from './TextComponent';
import { globalStyle } from '../styles/globalStyle';
import ImageCropPicker, { Options } from 'react-native-image-crop-picker';

interface Props {
    onSelect: (val: any) => void;
    text: string;
    style: StyleProp<ViewStyle>;
}

const options: Options = {
    cropping: true,
    mediaType: 'photo',
};

// Sử dụng forwardRef để truyền ref từ component cha vào
const ImagePickerComponent = forwardRef((props: Props, ref) => {
    const { onSelect, text, style } = props;
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
                <TextComponent text={text} style={style}/>
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
