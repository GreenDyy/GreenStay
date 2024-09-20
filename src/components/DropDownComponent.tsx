import { ArrowDown2, ArrowUp2 } from 'iconsax-react-native';
import React, { ReactNode, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { appColors } from '../constants/appColors';
import { appFonts } from '../constants/appFonts';
import { globalStyle } from '../styles/globalStyle';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';

interface Props {
    onSelect: (val: any) => void;
    data: [{
        label: any
        value: any
        photoUrl: string
    }]
    selected: any
    title?: string
    renderItem: (item: {
        label: any
        value: any
        photoUrl: string
    }, index: number) => ReactNode
}

const DropDownComponent = (props: Props) => {
    const { onSelect, data, selected, title, renderItem } = props;
    const [isShowDropdown, setIsShowDropdown] = useState(false);

    const handleSelect = (item: any) => {
        onSelect(item);
        setIsShowDropdown(false);
    };
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
                    {selected ?? <TextComponent text={'Chọn người'} />}
                    {isShowDropdown ? <ArrowUp2 size={22} color={appColors.text} /> : <ArrowDown2 size={22} color={appColors.text} />}
                </RowComponent>
            </TouchableOpacity>

            {isShowDropdown && (
                <View style={[styles.dropdown, globalStyle.shadow]}>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => handleSelect(item.value)}  >
                                {renderItem(item, index)}
                            </TouchableOpacity>
                        )}
                    />
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
        maxHeight: 180,
        zIndex: 1000
    },
});

export default DropDownComponent;
