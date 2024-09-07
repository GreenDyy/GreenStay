import { StyleSheet } from "react-native";
import { appFonts } from "../constants/appFonts";
import { appColors } from "../constants/appColors";

export const globalStyle = StyleSheet.create({
    text: {
        fontFamily: appFonts.regularOpenSans,
        fontSize: 14,
        color: appColors.text,
    },
    section: {
        paddingHorizontal: 16,
        paddingBottom: 20
    },
    container: {
        flex: 1,
        backgroundColor: appColors.white,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    shadow: {
        // iso
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // cho android
        elevation: 5,
    },
    button: {
        borderRadius: 8,
        backgroundColor: appColors.primary,
        height: 52,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
})