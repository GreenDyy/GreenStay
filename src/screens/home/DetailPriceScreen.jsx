import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, HeaderComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { Drop, Electricity } from 'iconsax-react-native'
import { appColors } from '../../constants/appColors'

const DetailPriceScreen = ({ route }) => {
    const { item } = route.params
    console.log(item)
    const [detailPrice, setDetailPrice] = useState({})

    useEffect(() => {
        setDetailPrice(item);
    }, [item])

    useEffect(() => {
        console.log(detailPrice)
    }, [detailPrice]);


    const handleChangeValue = (key, value) => {
        let tempData = { ...detailPrice }
        tempData[key] = value
        setDetailPrice(tempData)
    }

    const handleChangeValueNumber = (key, value) => {
        let tempData = { ...detailPrice }
        const numericText = value.replace(/[^0-9]/g, '')
        tempData[key] = numericText
        setDetailPrice(tempData)
    }

    const handleUpdateValue = () => {
        Alert.alert('Alert nè', `${detailPrice.title} ${detailPrice.price}`)
    }

    return (
        <ContainerComponent>
            <HeaderComponent isBack text={item.title} />

            {/* body */}
            <SectionComponent>
                <InputComponent
                    title='Tên loại'
                    placeholder='Nhập nội dung'
                    allowClear
                    value={detailPrice.title}
                    onChangeText={(val) => handleChangeValue('title', val)}
                />

                <SpaceComponent height={14} />

                <InputComponent
                    title='Giá'
                    placeholder='Nhập nội dung'
                    allowClear
                    value={detailPrice.price}
                    onChangeText={(val) => handleChangeValueNumber('price', val)}
                    keyboardType='number-pad'
                />
            </SectionComponent>

            <SectionComponent>
                <ButtonComponent text='Xác nhận' onPress={handleUpdateValue} />
            </SectionComponent>
        </ContainerComponent>
    )
}

export default DetailPriceScreen