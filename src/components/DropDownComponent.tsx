import { ArrowDown2, ArrowUp2 } from 'iconsax-react-native';
import React, { ReactNode, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { appColors } from '../constants/appColors';
import { appFonts } from '../constants/appFonts';
import { globalStyle } from '../styles/globalStyle';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
    onSelect: (val: any) => void;
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
    enable?: boolean
}

const DropDownComponent = (props: Props) => {
    const { onSelect, data, selected, title, renderItem, enable } = props;
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
                disabled={enable ?? false}
            >
                <RowComponent>
                    <TextComponent text={selected ?? 'Chọn'} />
                    {isShowDropdown ? <ArrowUp2 size={22} color={appColors.text} /> : <ArrowDown2 size={22} color={appColors.text} />}
                </RowComponent>
            </TouchableOpacity>

            {isShowDropdown && (
                <View style={[styles.dropdown, globalStyle.shadow]}>
                    <ScrollView nestedScrollEnabled     >
                        {data.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => handleSelect(item.value)}  >
                                    {renderItem(item, index)}
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
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
        zIndex: 1000,
        overflow: 'hidden',
    },
});

export default DropDownComponent;
