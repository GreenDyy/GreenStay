import React, { useEffect, useState } from 'react'
import { Alert, Modal } from 'react-native'

import { ButtonComponent, ContainerComponent, HeaderComponent, LoadingModalComponent, SectionComponent, SpaceComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { apiPower, apiTrash, apiWater } from '../../apis/apiDTHome'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

const DetailPriceModal = ({ visible, onClose, typePrice }) => {
    const [detailPrice, setDetailPrice] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const authData = useSelector((state) => state.authReducer.authData)

    useEffect(() => {
        const fetchData = async () => {
            let res = null
            switch (typePrice) {
                case 'water':
                    res = await apiWater(`/${authData.ownerId}/latest-price`)
                    break
                case 'power':
                    res = await apiPower(`/${authData.ownerId}/latest-price`)
                    break
                case 'trash':
                    res = await apiTrash(`/${authData.ownerId}/latest-price`)
                    break
                default:
                    break
            }
            setDetailPrice(res)
        }
        fetchData()
    }, [typePrice])

    useEffect(() => {
        console.log(detailPrice)
    }, [detailPrice]);


    const handleChangeValue = (key, value) => {
        let tempData = { ...detailPrice, ownerId: authData.ownerId }
        tempData[key] = value
        setDetailPrice(tempData)
    }

    const handleChangeValueNumber = (key, value) => {
        let tempData = { ...detailPrice, ownerId: authData.ownerId }
        const numericText = value.replace(/[^0-9]/g, '')
        tempData[key] = numericText
        setDetailPrice(tempData)
    }

    const handleUpdateValue = async () => {
        setIsLoading(true)
        let data = {
            pricePerUnit: detailPrice.pricePerUnit,
            effectiveDate: new Date()
        }
        try {
            switch (typePrice) {
                case 'water':
                    await apiWater(`/create`, data, 'post')
                    break
                case 'power':
                    await apiPower(`/create`, data, 'post')
                    break
                case 'trash':
                    await apiTrash(`/create`, data, 'post')
                    break
                default:
                    break
            }
            showMessage({
                message: 'Thông báo',
                description: 'Cập nhật giá thành công',
                type: 'success'
            })
            setIsLoading(false)
            onClose()
        }
        catch {
            showMessage({
                message: 'Thông báo',
                description: 'Lỗi khi cập nhật giá',
                type: 'danger'
            })
            setIsLoading(false)
        }
    }

    return (
        <Modal visible={visible}>
            <ContainerComponent>
                <HeaderComponent text={`Cập nhật giá ${typePrice === 'power' ? 'điện' : typePrice === 'water' ? 'nước' : 'rác'}`}
                    isBack customIsBack={onClose} />

                {/* body */}
                <SectionComponent>
                    <InputComponent
                        title='Giá'
                        placeholder='Nhập giá'
                        allowClear
                        value={detailPrice?.pricePerUnit.toString()}
                        onChangeText={(val) => handleChangeValueNumber('pricePerUnit', val)}
                        keyboardType='number-pad'
                    />
                </SectionComponent>

                <SectionComponent>
                    <ButtonComponent text='Xác nhận' onPress={handleUpdateValue} />
                </SectionComponent>
            </ContainerComponent>
            <LoadingModalComponent visible={isLoading} />
        </Modal>
    )
}

export default DetailPriceModal