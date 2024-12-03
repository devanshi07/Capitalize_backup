import { Dimensions, StyleSheet } from 'react-native';
import { getMediumFont, getPopMediumFont, getPopRegularFont, getPopSemiBoldFont, getRegularFont, getSemiBoldFont } from './utils';
import { SF, SH, SW } from './dimensions';
import { colors } from './colors';
import { getInterSemiBoldFont, getSyneRegularFont, getBoldFont } from './Fonts';

export const externalStyles = StyleSheet.create({

    // common styles
    mainContainer: {
        flex: 1,
        backgroundColor: colors.themeBackground
    },
    buttonGrdientContainer: {
        borderRadius: 15, paddingVertical: SH(25)
    },
    buttonText: {
        color: colors.white, fontSize: SF(17), textAlign: 'center', fontFamily: getInterSemiBoldFont()
    },
    backButtonContainer: {
        backgroundColor: colors.backButtonColor, padding: SH(15), alignSelf: "flex-start", borderRadius: 15, marginHorizontal: SW(35), marginTop: SH(35)
    },
    backButtonContainer2: {
        backgroundColor: colors.backButtonColor, padding: SH(15), alignSelf: "flex-start", borderRadius: 15,
    },
    backArrowImage: {
        height: SH(28), width: SH(28), resizeMode: "contain"
    },

    // splash screen styles
    splashSubContainer: {
        flex: 1, justifyContent: 'center',
    },
    splashSubSubContainer: {
        alignItems: "center", marginHorizontal: SW(50)
    },
    splashAppNameText: {
        fontSize: SF(46), color: colors.white, textAlign: "center", fontFamily: getSyneRegularFont(), fontWeight: "600", letterSpacing: 2
    },

    // risk profile screen
    questionText: {
        fontSize: SF(23),
        textAlign: 'center',
        color: "white",
        marginTop: SH(10),
        fontFamily: getBoldFont()
    },
});