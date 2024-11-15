import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, CircleComponent, ContainerComponent, HeaderComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { useSelector } from 'react-redux'
import { appFonts } from '../../constants/appFonts'
import { getDateStringType2 } from '../../utils/Utils'
import { apiRental, apiRoom } from '../../apis/apiDTHome'

const DetailContractScreen = ({ navigation, route }) => {
    const { item } = route.params
    const [contract, setContract] = useState(item)

    const authData = useSelector((state) => state.authReducer.authData)

    useEffect(() => {
        setContract(item)
        console.log(item)
    }, [item])

    const handleEndContract = async () => {
        {/* khi kết thúc hợp đồng thì sẽ đổi tragn5 thái rental isRenting sang false,
      cập nhật phòng của hop đồng này thành isAvailable true, đồng thời tạo hoá đơn */}

      await apiRental(`update/${contract.rentalId}`, {}, 'put')
      await apiRoom(`update/${contract.room.roomId}`, {}, 'put')
    }

    return (
        <ContainerComponent>
            <HeaderComponent text='Thông tin hợp đồng' isBack />

            <SectionComponent>
                <RowComponent>
                    {/* cột 1 */}
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <CircleComponent size={60}>
                            <Image source={contract.customer.photoUrl ? { uri: contract.customer?.photoUrl } : images.avatar_null} style={{ height: 60, width: 60 }} resizeMode='cover' />
                        </CircleComponent>
                        <SpaceComponent height={8} />
                        <TextComponent text={contract.customer.customerName} fontFamily={appFonts.semiBoldOpenSans} fontSize={16} />
                    </View>

                    <View style={{ borderRightWidth: 0.5, borderColor: appColors.gray, height: '100%', marginHorizontal: 5 }} />
                    {/* cột 2 */}
                    <RowComponent style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <RowComponent>
                                <TextComponent text='Mã hợp đồng: ' fontFamily={appFonts.semiBoldOpenSans} />
                                <TextComponent text={`#HD${contract?.rentalId}`} />
                            </RowComponent>
                            <SpaceComponent height={10} />
                            <RowComponent>
                                <TextComponent text='Ngày tạo hợp động: ' fontFamily={appFonts.semiBoldOpenSans} />
                                <TextComponent text={getDateStringType2(contract.startDate)} />
                            </RowComponent>
                            <SpaceComponent height={10} />
                            <RowComponent>
                                <TextComponent text='Phòng: ' fontFamily={appFonts.semiBoldOpenSans} />
                                <TextComponent text={contract.room.roomName} />
                            </RowComponent>
                            <SpaceComponent height={10} />
                            <RowComponent>
                                <TextComponent text='Trạng thái: ' fontFamily={appFonts.semiBoldOpenSans} />
                                <TextComponent text={contract.isRenting ? "Còn trong hạn" : "Đã chấm dứt"} color={contract.isRenting ? appColors.primary : appColors.danger} />
                            </RowComponent>
                        </View>
                    </RowComponent>
                </RowComponent>
            </SectionComponent>

            {
                contract?.isRenting
                &&
                <SectionComponent>
                    {/* khi kết thúc hợp đồng thì sẽ đổi tragn5 thái rental isRenting sang false,
                     cập nhật phòng của hop đồng này thành isAvailable true, đồng thời tạo hoá đơn */}
                    <ButtonComponent text='Chấm dứt hợp đồng' style={{ backgroundColor: appColors.danger }} onPress={handleEndContract} />
                </SectionComponent>
            }
        </ContainerComponent>
    )
}

export default DetailContractScreen