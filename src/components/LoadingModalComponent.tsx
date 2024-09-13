import React from 'react'
import { ActivityIndicator, Modal, View } from 'react-native'
import { appColors } from '../constants/appColors'
import { globalStyle } from '../styles/globalStyle'
import TextComponent from './TextComponent'

interface Props {
    visible: boolean,
    mess?: string,
    onClose?: () => void
}

const LoadingModalComponent = (props: Props) => {
    const { visible, onClose, mess } = props
    return (
        <Modal
            visible={visible}

            transparent
            statusBarTranslucent>

            <View style={[globalStyle.container, { backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center', justifyContent: 'center' }]}>

                <ActivityIndicator color={appColors.white} size={32} />
                <TextComponent text='Loading' color={appColors.white} />
            </View>
        </Modal>
    )
}

export default LoadingModalComponent