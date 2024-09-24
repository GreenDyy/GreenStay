import { Book, Check, TickCircle } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { apiCustomer, apiMemberOfRental, apiRental, apiRoom } from '../../apis/apiDTHome'
import { ButtonComponent, CircleComponent, ContainerComponent, DropDownComponent, DropDownMultibleSelectComponent, HeaderComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { appColors } from '../../constants/appColors'
import { showMessage } from 'react-native-flash-message'
import { images } from '../../constants/images'
//các bảng sẽ tương tác: Rental, Customer maybe, Room, MemberOfRental

const initContract = {

}

const AddContractScreen = ({ navigation, route }) => {
    const { roomId } = route.params
    const [isLoading, setIsLoading] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false)
    const [contract, setContract] = useState(initContract)
    //chỉ lấy khách hàng hiện đang ko thuê
    const [dropDownCustomers, setDropDownCustomers] = useState([])
    const [dropDownRooms, setDropDownRooms] = useState([])

    const [listMemberSelected, setListMemberSelected] = useState([])
    const [representative, setRepresentative] = useState(null)
    //chứa name các khách dã chọn
    const [memberNames, setMemberNames] = useState([]);
    const [dropDownRepresentatives, setDropDownRepresentatives] = useState(null)

    const [waterStart, setWaterStart] = useState('')
    const [powerStart, setPowerStart] = useState('')

    useEffect(() => {
        fetchDataRoomAvailables()
        fetchDataCustomers()
    }, [])
    //lấy roomId lun nếu nó dc truyền từ màn khác
    useEffect(() => {
        if (roomId) {
            setContract({ ...contract, roomId: roomId })
            console.log('room id ban đầu: ', roomId)
        }
    }, [roomId])

    //khi có id người dại điện thì fetch cái này
    useEffect(() => {
        const fetchRepresentative = async () => {
            const res = await apiCustomer(`/${contract.customerId}`)
            setRepresentative(res)
        }
        if (contract.customerId) {
            fetchRepresentative()
        }

    }, [contract.customerId])

    //nếu mà bỏ chọn khách hàng, ko chọn ai hết thì reset customerId trong contract
    useEffect(() => {
        setContract({ ...contract, customerId: '' })
        setRepresentative(null)
    }, [listMemberSelected])

    useEffect(() => {
        const fetchMembers = async () => {
            const listNameMembers = []
            for (const customerId of listMemberSelected) {
                const res = await apiCustomer(`/${customerId}`)
                listNameMembers.push(res.customerName)
            }
            setMemberNames(listNameMembers)
        }
        fetchMembers()
    }, [listMemberSelected])

    //cái này là khi chọn ra list người sẽ ở trong phòng thì nó mới dc gọi để tạo data cho dropdown Chọn ng đại diện
    useEffect(() => {
        if (listMemberSelected) {
            const fetchMembers = async () => {
                const listMemberSelecteds = []
                for (const customerId of listMemberSelected) {
                    const res = await apiCustomer(`/${customerId}`)
                    listMemberSelecteds.push(res)

                }
                const newListMembers = listMemberSelecteds.map((item) => ({
                    label: item.customerName,
                    value: item.customerId,
                    photoUrl: item.photoUrl
                }))


                setDropDownRepresentatives(newListMembers)
            }
            fetchMembers()
        }
    }, [listMemberSelected])

    //chỉ lấy khách hàng đang ko thuê
    const fetchDataCustomers = async () => {
        setIsLoading(true)
        try {
            //lấy data all
            const res = await apiCustomer(`/get-all`)
            //lọc data
            const listIdCusCurrentNoRental = []

            const rentals = await apiRental(`/get-all`)
            const rentalCurents = await rentals.filter((rental) => rental.isRenting)

            //lấy các th đang thuê trong từng phòng ra
            for (const rental of rentalCurents) {
                const memberInRooms = await apiMemberOfRental(`/get-all-by-rental/${rental.rentalId}`)
                for (const member of memberInRooms) {
                    listIdCusCurrentNoRental.push(member.customerId)
                }
            }
            console.log(listIdCusCurrentNoRental)

            //sửa thuộc tính item

            const customers = res.map((item) => ({
                label: item.customerName,
                value: item.customerId,
                photoUrl: item.photoUrl
            }))
            //xong rồi mới setData để hiển thị ra dropdown
            setDropDownCustomers(customers)
            setIsLoading(false)
        }
        catch (e) {
            console.log(e)
            setIsLoading(false)
        }
    }

    const fetchDataRoomAvailables = async () => {
        setIsLoading(true)
        try {
            const res = await apiRoom(`/get-all`)
            const newRooms = res.filter((item) => item.isAvailable)
            const rooms = newRooms.map((item) => ({
                label: item.roomName,
                value: item.roomId,
                photoUrl: item.photoUrl
            }))

            setDropDownRooms(rooms)
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
                <CircleComponent>
                    <Image source={item?.photoUrl ? { uri: item?.photoUrl } : images.avatar_null} style={{ height: 40, width: 40 }} resizeMode='cover' />
                </CircleComponent>

                <SpaceComponent width={5} />
                <TextComponent text={item.label} />
            </RowComponent>
        )
    }

    const renderItemDropDownMultible = (item, index) => {
        //check xem trong mảng listMemberSelected có inclue cái item.value ko, có thì đổi màu
        return (
            <RowComponent
                style={{
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderColor: appColors.gray2,
                    borderBottomWidth: index !== dropDownCustomers.length - 1 ? 1 : 0,
                }}>
                <RowComponent
                    style={{
                        justifyContent: 'flex-start',
                    }}
                >
                    <CircleComponent>
                        <Image source={item?.photoUrl ? { uri: item?.photoUrl } : images.avatar_null} style={{ height: 40, width: 40 }} resizeMode='cover' />
                    </CircleComponent>

                    <SpaceComponent width={5} />
                    <TextComponent text={item.label} color={listMemberSelected.includes(item.value) ? appColors.primary : appColors.text} />
                </RowComponent>
                {listMemberSelected.includes(item.value) && <TickCircle size={22} color={appColors.primary} />}

            </RowComponent>
        )
    }

    const handleCreateContract = async () => {
        setIsLoading(true)
        if (!contract.roomId || !waterStart || !powerStart || !representative) {
            showMessage({
                message: 'Thông báo',
                description: 'Vui lòng nhập đủ thông tin',
                type: 'warning'
            })
            setIsLoading(false)
            return
        }
        else {
            try {
                //B1 tạo phiếu Rental
                const newContract = {
                    ...contract,
                    isRenting: true,
                    startDate: new Date(),
                    updatedAt: new Date(),

                }
                console.log('full data rental trc khi them nè:', newContract)
                const rentalCreateRes = await apiRental(`/create`, newContract, 'post')

                //B2 cập nhật isVisible, waterAfter, powerAfter trong Room
                if (rentalCreateRes) {
                    const room = await apiRoom(`/${contract.roomId}`)
                    const newDataRoom = {
                        ...room,
                        waterAfter: waterStart,
                        powerAfter: powerStart,
                        isAvailable: false,
                        updatedAt: new Date()
                    }
                    const roomUpdateRes = await apiRoom(`/update/${contract.roomId}`, newDataRoom, 'put')
                    console.log('room khi rental: ', newDataRoom)
                    if (roomUpdateRes) {
                        navigation.navigate('RoomScreen', { roomUpdate: true })
                        console.log('Tạo phiếu thuê thành công')
                        showMessage({
                            message: 'Thông báo',
                            description: 'Tạo phiếu thuê thành công',
                            type: 'success'
                        })
                    }

                    //B3: thêm vào MemberOfRental
                    const listRentalId = await apiRental(`/get-all`)
                    const lastRentalId = listRentalId[listRentalId.length - 1].rentalId
                    console.log('last id: ', lastRentalId)
                    for (const customerId of listMemberSelected) {
                        let dataMember = {
                            "rentalId": lastRentalId,
                            "customerId": customerId,
                            "roleMember": "string"
                        }
                        await apiMemberOfRental(`/create`, dataMember, 'post')
                    }


                    showMessage({
                        message: 'Thông báo',
                        description: 'Tạo phiếu thuê thành công',
                        type: 'success'
                    })
                    setIsLoading(false)
                }

            }
            catch (e) {
                setIsLoading(false)
                console.log('Lỗi khi cố tạo 1 contract:', e)
            }
        }
    }

    return (
        <ContainerComponent>
            <HeaderComponent text='Tạo hợp đồng thuê' isBack />

            <SectionComponent>
                {/* //dropdown nè */}
                <DropDownComponent title='Phòng'
                    //data sẽ dc lấy từ danh sách các khách chọn ở trên nhen
                    data={dropDownRooms}
                    onSelect={(value) => handleChangeValue('roomId', value)}
                    renderItem={(item, index) => renderItemDropDown(item, index)}
                    selected={contract.roomId || 'Chọn phòng'}
                />

                <SpaceComponent height={14} />

                <DropDownMultibleSelectComponent title='Chọn các khách hàng'
                    data={dropDownCustomers}
                    onSelect={(value) => { setListMemberSelected(value) }
                    }
                    renderItem={(item, index) => renderItemDropDownMultible(item, index)}
                    selected={memberNames.join(', ') || 'Chọn khách hàng'}
                />

                <SpaceComponent height={14} />
                <ButtonComponent text='Thêm khách hàng mới' type='link' onPress={() => { navigation.navigate('Người thuê', { screen: 'AddNewCustomerScreen', params: { actionType: 'create' } }) }} />
                <SpaceComponent height={14} />

                <InputComponent
                    title='Số điện đầu kỳ (Xem trên công tơ)'
                    value={powerStart}
                    placeholder='Nhập số điện đầu kỳ'
                    allowClear
                    keyboardType='number-pad'
                    onChangeText={(val) => { setPowerStart(val) }}
                />
                <SpaceComponent height={14} />
                <InputComponent
                    title='Số nước đầu kỳ (Xem trên công tơ)'
                    value={waterStart}
                    placeholder='Nhập số nước đầu kỳ'
                    allowClear
                    keyboardType='number-pad'
                    onChangeText={(val) => { setWaterStart(val) }}
                />
                <SpaceComponent height={14} />
                {/* //dropdown nè */}
                <DropDownComponent enable={listMemberSelected.length !== 0 ? false : true} title='Chọn người đại diện'
                    //data sẽ dc lấy từ danh sách các khách chọn ở trên nhen
                    data={dropDownRepresentatives}
                    onSelect={(value) => handleChangeValue('customerId', value)}
                    renderItem={(item, index) => renderItemDropDown(item, index)}
                    selected={representative?.customerName || 'Chọn người đại diện'}
                />
                <SpaceComponent height={14} />
            </SectionComponent>

            <SectionComponent>
                <ButtonComponent text='Tạo hợp đồng' onPress={handleCreateContract} />
            </SectionComponent>

            <LoadingModalComponent visible={isLoading} />
        </ContainerComponent>
    )
}

export default AddContractScreen