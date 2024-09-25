import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'iconsax-react-native';
import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { appColors } from '../constants/appColors';
import RowComponent from './RowComponent';
import SectionComponent from './SectionComponent';
import SquareBorderComponent from './SquareBorderComponent';
import TextComponent from './TextComponent';

interface Props {
    text: string;
    isBack?: boolean;

    buttonRight?: ReactNode;
    onRightPress?: () => void;
    customIsBack?: () => void
}

const HeaderComponent = (props: Props) => {
    const navigation = useNavigation();
    const { text, isBack, buttonRight, onRightPress, customIsBack } = props;

    const handleBackPress = () => {
        if (customIsBack) {
            customIsBack()
        } else {
            navigation.goBack();
        }
    };

    return (
        <SectionComponent>
            <RowComponent>
                {isBack ? (
                    <SquareBorderComponent height={36} width={36} onPress={handleBackPress}>
                        <ArrowLeft size={22} color={appColors.text} />
                    </SquareBorderComponent>
                ) : (
                    <View style={{ height: 36, width: 36 }} />
                )}

                <TextComponent text={text} isTitle />

                {/* nút phải */}
                {buttonRight ? (
                    <SquareBorderComponent height={36} width={36} onPress={onRightPress}>
                        {buttonRight}
                    </SquareBorderComponent>
                ) : (
                    <View style={{ height: 36, width: 36 }} />
                )}
            </RowComponent>
        </SectionComponent>
    );
};

export default HeaderComponent;
