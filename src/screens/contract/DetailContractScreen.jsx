import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ButtonComponent, ContainerComponent, HeaderComponent, SectionComponent, TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'

const DetailContractScreen = ({ navigation, route }) => {
    const { item } = route.params
    const [contract, setContract] = useState(item)


    return (
        <ContainerComponent>
            <HeaderComponent text='Thông tin hợp đồng' isBack />

            <SectionComponent>
                <TextComponent text={contract?.rentalId} />
                <TextComponent text={contract?.customer.customerName} />
            </SectionComponent>

            {
                contract?.isRenting
                &&
                <SectionComponent>
                     {/* khi kết thúc hợp đồng thì sẽ đổi tragn5 thái rental isRenting sang false,
                     cập nhật phòng của hop đồng này thành isAvailable true, đồng thời tạo hoá đơn */}
                    <ButtonComponent text='Chấm dứt hợp đồng' style={{ backgroundColor: appColors.danger }} />
                </SectionComponent>
            }
        </ContainerComponent>
    )
}

export default DetailContractScreen