import { ArrowDown2, ArrowUp2 } from 'iconsax-react-native';
import React, { ReactNode, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { appColors } from '../constants/appColors';
import { appFonts } from '../constants/appFonts';
import { globalStyle } from '../styles/globalStyle';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';
import ButtonComponent from './ButtonComponent';
import SectionComponent from './SectionComponent';

interface Props {
    onSelect: (val: any[]) => void;
    data: [{
        label: any
        value: any
        photoUrl: string
    }]
    selected: string
    title?: string
    renderItem: (item: {
        label: any
        value: any
        photoUrl: string
    }, index: number) => ReactNode
}

const DropDownMultibleSelectComponent = (props: Props) => {
    const { onSelect, data, selected, title, renderItem } = props;
    const [isShowDropdown, setIsShowDropdown] = useState(false);
    const [listValue, setListValue] = useState<any[]>([]);

    //id là value đó tui ghi z
    const handleSelectMultible = (id: any) => {
        let updatedList = [...listValue];
        if (listValue.includes(id)) {
            //tìm vị trí cần xoá
            const index = updatedList.findIndex(value => value === id)
            //xoá
            updatedList.splice(index, 1)

        }
        else {
            updatedList.push(id)
        }
        setListValue(updatedList);
        onSelect(updatedList);
    }

    const handleConfirmSelected = () => {
        onSelect(listValue)
        setIsShowDropdown(false)
    }

    return (
        <View style={{ position: 'relative' }}>
            {title &&
                <>
                    <RowComponent style={{ justifyContent: 'flex-start' }}>
                        <TextComponent text={title} fontFamily={appFonts.semiBoldOpenSans} />
                    </RowComponent>
                    <SpaceComponent height={8} />
                </>
            }
            <TouchableOpacity
                style={[globalStyle.input]}
                onPress={() => setIsShowDropdown(!isShowDropdown)}
            >
                <RowComponent>
                    <TextComponent flex={1} text={selected ?? 'Chọn'}/>
                    {isShowDropdown ? <ArrowUp2 size={22} color={appColors.text} /> : <ArrowDown2 size={22} color={appColors.text} />}
                </RowComponent>
            </TouchableOpacity>
            {isShowDropdown && (
                <View style={[styles.dropdown, globalStyle.shadow]}>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => handleSelectMultible(item.value)} >
                                {renderItem(item, index)}
                            </TouchableOpacity>
                        )}
                    />
                    <SpaceComponent height={30} />
                    <SectionComponent>

                        <ButtonComponent text='Đóng' onPress={handleConfirmSelected} />
                    </SectionComponent>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        position: 'absolute',
        top: 90, // Khoảng cách từ nút đến dropdown
        left: '0%',
        right: '0%',
        backgroundColor: 'white',
        borderRadius: 5,
        maxHeight: 300,
        zIndex: 1000,
    },
});

export default DropDownMultibleSelectComponent;
