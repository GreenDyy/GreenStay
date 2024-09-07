import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, Image, FlatList, Linking, Alert } from 'react-native'
import React from 'react'
import TextComponent from './TextComponent'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RowComponent from './RowComponent'
import { globalStyle } from '../styles/globalStyle'
import SpaceComponent from './SpaceComponent'
import { appColors } from '../constants/appColors'
import { Bookmark2, Calendar, Logout, Message2, MessageQuestion, Setting2, Sms, User } from 'iconsax-react-native'

const DrawerCustom = ({ navigation }: any) => {
    const size = 20;
    const color = appColors.gray;
    const drawerMenu = [
        {
            key: 'MyProfile',
            title: 'My Profile',
            icon: <User size={size} color={color} />,
        },
        {
            key: 'Message',
            title: 'Message',
            icon: <Message2 size={size} color={color} />,
        },
        {
            key: 'Calendar',
            title: 'Calendar',
            icon: <Calendar size={size} color={color} />,
        },
        {
            key: 'Bookmark',
            title: 'Bookmark',
            icon: <Bookmark2 size={size} color={color} />,
        },
        {
            key: 'ContactUs',
            title: 'Contact Us',
            icon: <Sms size={size} color={color} />,
        },
        {
            key: 'Settings',
            title: 'Settings',
            icon: <Setting2 size={size} color={color} />,
        },
        {
            key: 'HelpAndFAQs',
            title: 'Help & FAQs',
            icon: <MessageQuestion size={size} color={color} />,
        },
        {
            key: 'SignOut',
            title: 'Sign Out',
            icon: <Logout size={size} color={color} />,
        },
    ];


    const handleLogout = async () => {
        await AsyncStorage.removeItem('accessToken')
    }


    return (
        <View style={[localStyles.container]}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={drawerMenu}
                style={{ flex: 1, marginVertical: 20 }}
                renderItem={({ item, index }) => (
                    <RowComponent
                        style={[localStyles.listItem]}
                        onPress={
                            item.key === 'SignOut'
                                ? () => handleLogout()
                                : () => {
                                    console.log(item.key);
                                    navigation.closeDrawer();
                                }
                        }>
                        {item.icon}
                        <TextComponent
                            text={item.title}
                            style={localStyles.listItemText}
                        />
                    </RowComponent>
                )}
            />
        </View>
    )
}

export default DrawerCustom

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 48,
    },

    avatar: {
        width: 52,
        height: 52,
        borderRadius: 100,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    listItem: {
        paddingVertical: 12,
        justifyContent: 'flex-start',
    },

    listItemText: {
        paddingLeft: 12,
    },
});