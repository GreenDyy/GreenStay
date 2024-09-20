import { Calendar, Clock } from 'iconsax-react-native'
import React, { useState } from 'react'
import { View } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { appColors } from '../constants/appColors'
import { appFonts } from '../constants/appFonts'
import { getDate, getTime } from '../utils/Utils'
import RowComponent from './RowComponent'
import TextComponent from './TextComponent'
import SpaceComponent from './SpaceComponent'

interface Props {
    title?: string
    selected: Date
    type: 'date' | 'time' | 'datetime'
    onSelect: (val: Date) => void
}

const DateTimePickerComponent = (props: Props) => {
    const { title, selected, type, onSelect } = props
    const [isShowDatePicker, setIsShowDatePicker] = useState(false)
    const [date, setDate] = useState(new Date())

    return (
        <View style={{ flex: 1 }}>
            {title && (
                <>
                    <RowComponent style={{ justifyContent: 'flex-start' }}>
                        <TextComponent text={title} fontFamily={appFonts.semiBoldOpenSans} />
                        {/* {isRequire && <TextComponent text=' *' color={appColors.danger} />} */}
                    </RowComponent>
                    <SpaceComponent height={8} />
                </>
            )}
            <View style={[
                {
                    width: '100%',
                    minHeight: 50,
                    borderWidth: 1,
                    borderColor: appColors.gray3,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    justifyContent: 'center'
                }
            ]}>
                <RowComponent onPress={() => { setIsShowDatePicker(true) }}>
                    <TextComponent
                        text={selected ? (type === 'time' ? getTime(selected) : getDate(selected)) : 'Chọn ngày'}
                        style={{ textAlign: 'center' }}
                        flex={1}
                        fontFamily={appFonts.mediumOpenSans} />
                    {type === 'time' ?
                        <Clock size={22} color={appColors.gray} /> :
                        <Calendar size={22} color={appColors.gray} />}
                </RowComponent>
            </View>

            {/* này như modal z */}
            <DatePicker
                modal
                mode={type}
                locale='vi'
                cancelText='Huỷ'
                confirmText='Đồng ý'
                title={title}
                buttonColor={appColors.primary}
                open={isShowDatePicker}
                date={date}
                onConfirm={(curDate) => {
                    setIsShowDatePicker(false)
                    setDate(curDate)
                    onSelect(curDate)
                }}
                onCancel={() => {
                    setIsShowDatePicker(false)
                }}
            />
        </View>
    )
}

export default DateTimePickerComponent