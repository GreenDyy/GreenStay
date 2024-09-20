import { Book } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { apiCustomer } from '../../apis/apiDTHome'
import { ButtonComponent, CircleComponent, ContainerComponent, DropDownComponent, HeaderComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { appColors } from '../../constants/appColors'
//các bảng sẽ tương tác: Rental, Customer maybe, Room, MemberOfRental

const initContract = {

}

const AddContractScreen = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [contract, setContract] = useState(initContract)
    const [dropDownCustomers, setDropDownCustomers] = useState([])
    const [listMemberSelected, setListMemberSelected] = useState([])
    const [representative, setRepresentative] = useState(null)

    useEffect(() => {
        fetchDataCustomers()
    }, [])

    useEffect(() => {
        const fetchRepresentative = async () => {
            const res = await apiCustomer(`/${contract.customerId}`)
            setRepresentative(res)
        }
        if (contract.customerId) {
            fetchRepresentative()
        }

    }, [contract.customerId])

    const fetchDataCustomers = async () => {
        setIsLoading(true)
        try {
            const res = await apiCustomer(`/get-all`)
            const customers = res.map((item) => ({
                label: item.customerName,
                value: item.customerId,
                photoUrl: item.photoUrl
            }))
            setDropDownCustomers(customers)
            setIsLoading(false)
        }
        catch (e) {
            console.log(e)
            setIsLoading(false)
        }
    }

    const handleChangeValue = (key, value) => {
        let tempData = { ...contract }
        tempData[key] = value
        setContract(tempData)
    }

    const renderItemDropDown = (item, index) => {
        return (
            <RowComponent
                style={{
                    justifyContent: 'flex-start',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderColor: appColors.gray2,
                    borderBottomWidth: index !== dropDownCustomers.length - 1 ? 1 : 0,
                }}
            >
                {item?.photoUrl &&
                    <CircleComponent>
                        <Image source={{ uri: item?.photoUrl }} style={{ height: 40, width: 40 }} resizeMode='cover' />
                    </CircleComponent>}
                <TextComponent text={item.label} />
            </RowComponent>
        )
    }

    return (
        <ContainerComponent>
            <HeaderComponent text='Tạo hợp đồng thuê' isBack />

            <SectionComponent>
                {/* //dropdown nè */}
                <DropDownComponent title='Chọn các khách hàng'
                    data={dropDownCustomers}
                    onSelect={(value) => { handleChangeValue('customerId', value) }
                    }
                    renderItem={(item, index) => renderItemDropDown(item, index)}
                    selected={<TextComponent text={representative?.customerName} />}
                />

                <SpaceComponent height={14} />
                <ButtonComponent text='Thêm khách hàng mới' type='link' onPress={() => { navigation.navigate('Người thuê', { screen: 'AddNewCustomerScreen', params: { actionType: 'create' } }) }} />
                <SpaceComponent height={14} />

                <InputComponent
                    title='Số điện đầu kỳ (Xem trên công tơ)'
                    value={contract.rentalId}
                    placeholder='Nhập số điện đầu kỳ'
                />
                <SpaceComponent height={14} />
                <InputComponent
                    title='Số nước đầu kỳ (Xem trên công tơ)'
                    value={contract.rentalId}
                    placeholder='Nhập số nước đầu kỳ'
                />
                <SpaceComponent height={14} />
                {/* //dropdown nè */}
                <DropDownComponent title='Chọn người đại diện'
                    //data sẽ dc lấy từ danh sách các khách chọn ở trên nhen
                    data={dropDownCustomers}
                    onSelect={(value) => handleChangeValue('customerId', value)}
                    renderItem={(item, index) => renderItemDropDown(item, index)}
                    selected={<TextComponent text={representative?.customerName} />}
                />
                <SpaceComponent height={14} />
            </SectionComponent>

            <SectionComponent>
                <ButtonComponent text='Tạo hợp đồng' />
            </SectionComponent>

            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default AddContractScreen