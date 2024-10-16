import React from 'react'
import { Modal, View } from 'react-native'
import { globalStyle } from '../styles/globalStyle'

interface Props {
    visible: boolean,
    mess?: string,
    onClose?: () => void
}

const LoadingEmptyModalComponent = (props: Props) => {
    const { visible, onClose, mess } = props
    return (
        <Modal
            visible={visible}
            transparent
            statusBarTranslucent>
            <View style={[globalStyle.container, { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0)' }]} />
        </Modal>
    )
}

export default LoadingEmptyModalComponent