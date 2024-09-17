import { View, Text, Modal } from 'react-native'
import React, { useState } from 'react'
import ButtonComponent from './ButtonComponent'
import TextComponent from './TextComponent'
import { globalStyle } from '../styles/globalStyle'
import ImageCropPicker, { Options } from 'react-native-image-crop-picker'

interface Props {
    onSelect: (val: any) => void
    text: string
}

const options: Options = {
    cropping: true,
    mediaType: 'photo',
};

const ImagePickerComponent = (props: Props) => {
    const { onSelect, text } = props
    const [isShowModal, setIsShowModal] = useState(false)

    const handleChoiceImage = (key: string) => {
        switch (key) {
            case 'library':
                ImageCropPicker.openPicker(options).then(res => {
                    onSelect(res);
                    console.log('ảnh nè: ', res)
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
        setIsShowModal(false)
    };

    return (
        <>
            <ButtonComponent type='link' text={text} onPress={() => { setIsShowModal(true) }} />

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
                        // backgroundColor: 'red',
                        justifyContent: 'center',
                        alignItems: 'center'

                    }}>
                        <ButtonComponent text='Chọn từ thư viện' onPress={() => { handleChoiceImage('library') }} />
                        <ButtonComponent text='Camera' onPress={() => { handleChoiceImage('camera') }} />
                        <ButtonComponent text='Huỷ' onPress={() => { setIsShowModal(false) }} />
                    </View>

                </View>

            </Modal>
        </>
    )
}

export default ImagePickerComponent