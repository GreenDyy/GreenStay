import { ArrowCircleRight, SearchStatus, ShopAdd } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, View } from 'react-native'
import { apiCustomer } from '../../apis/apiDTHome'
import { CircleComponent, ContainerComponent, FloatAddButtonComponent, HeaderComponent, LoadingModalComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import InputComponent from '../../components/InputComponent'
import { appColors } from '../../constants/appColors'
import { appFonts } from '../../constants/appFonts'
import { images } from '../../constants/images'
import AddNewCustomerModal from './AddNewCustomerModal'
import { useSelector } from 'react-redux'
import customerReducer from '../../srcRedux/reducers/customerReducer'

const CustomerScreen = ({ navigation, route }) => {
  const [searchKey, setSearchKey] = useState('')
  const [dataCustomers, setDataCustomers] = useState([])
  const [dataCustomerOriginals, setDataCustomerOriginals] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isShowModalAdd, setIsShowModalAdd] = useState(false)

  const checkUpdateCustomer = useSelector(state => state.customerReducer.updatedValue)
  const authData = useSelector((state) => state.authReducer.authData)

  useEffect(() => {
    if (!isShowModalAdd) {
      fetchDataCustomers()
    }
  }, [isShowModalAdd, checkUpdateCustomer])

  // useEffect(() => {
  //   const reFetchData = navigation.addListener('focus', () => {
  //     fetchDataCustomers(); // Cập nhật dữ liệu khi quay lại màn hình
  //   });

  //   return reFetchData;
  // }, []);

  useEffect(() => {
    if (searchKey) {
      const filteredData = dataCustomerOriginals.filter(customer =>
        customer.customerName.toLowerCase().includes(searchKey.toLowerCase())
      )
      setDataCustomers(filteredData)
    }
    else {
      setDataCustomers(dataCustomerOriginals)
    }
  }, [searchKey])

  const fetchDataCustomers = async () => {
    setIsLoading(true)
    try {
      const res = await apiCustomer(`/${authData.ownerId}/get-all`)
      setDataCustomers(res)
      setDataCustomerOriginals(res)
      setIsLoading(false)
    }
    catch (e) {
      console.log(e)
      setIsLoading(false)
    }
  }

  // xem vui thoi
  useEffect(() => {
    console.log(searchKey)
  }, [searchKey])
  useEffect(() => {
    console.log('data cus:', dataCustomers)
  }, [dataCustomers])

  const renderItemCustomer = ({ item }) => {
    return (
      <RowComponent
        onPress={() => navigation.navigate('DetailCustomerScreen', { customerId: item.customerId })}
        style={{
          borderBottomWidth: 0.5,
          borderBottomColor: appColors.gray,
          paddingVertical: 10,
          paddingTop: item.customerId === 1 && 0
        }}
      >
        <RowComponent style={{
          justifyContent: 'flex-start'
        }}>
          <CircleComponent>
            <Image source={item.photoUrl ? { uri: item?.photoUrl } : images.avatar_null} style={{ height: 40, width: 40 }} resizeMode='cover' />
          </CircleComponent>
          <SpaceComponent width={10} />
          <View>
            <TextComponent text={item?.customerName} fontFamily={appFonts.semiBoldOpenSans} />
            <TextComponent text={item?.phoneNumber} fontSize={12} color={appColors.gray} />
          </View>
        </RowComponent>

        <RowComponent >
          <ArrowCircleRight size={20} color={appColors.gray} />
        </RowComponent>
      </RowComponent>
    )
  }

  return (
    <ContainerComponent>
      <HeaderComponent
        text='Người thuê'
        isBack
        buttonRight={<ShopAdd size={22} color={appColors.primary} />}
        onRightPress={() => navigation.navigate('AddNewCustomerScreen', { actionType: 'create' })}
      />
      {/* search bar */}
      <SectionComponent>
        <InputComponent
          iconLeft={<SearchStatus size={20} color={appColors.text} />}
          placeholder='Nhập tên cần tìm...'
          allowClear
          value={searchKey}
          onChangeText={val => setSearchKey(val)}
        // onEndEditing={handleSearchData}
        />
      </SectionComponent>

      <SectionComponent>
        <FlatList
          data={dataCustomers}
          renderItem={renderItemCustomer}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}

        />

      </SectionComponent>
      <FloatAddButtonComponent onPress={() => { setIsShowModalAdd(true) }} />
      <AddNewCustomerModal visible={isShowModalAdd} onClose={() => setIsShowModalAdd(false)} actionType={'create'} />
      <LoadingModalComponent visible={isLoading} />
    </ContainerComponent>
  )
}

export default CustomerScreen