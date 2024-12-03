import React from 'react';
import { View, SafeAreaView, Pressable, Image, Text, } from 'react-native';
import { colors } from '../utils/colors';
import { SF, SH, SW } from '../utils/dimensions';
import { getMediumFont, getSemiBoldFont, } from '../utils/Fonts';
import images from '../images';
import { RouteNames } from '../navigators/RouteNames';

function StartingScreen({ route, navigation }) {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.themeGreen }}>
                <View style={{ alignItems: "center", marginHorizontal: SW(50) }}>
                    <Image source={images.stock_img} style={{ width: SH(300), height: SH(300), resizeMode: "contain" }} />
                    <Text style={{ fontSize: SF(30), color: colors.white, textAlign: "center", marginTop: SH(33) }}>Smart Investments, Strong Returns.</Text>
                </View>

                <View style={{ marginTop: SH(50), marginHorizontal: SW(50) }}>
                    <Pressable onPress={() => navigation.navigate(RouteNames.REGISTERONLYNAMESCREEN)}
                        style={{ backgroundColor: colors.buttonColor, borderRadius: 20, paddingVertical: SH(20) }}>
                        <Text style={{ color: colors.white, fontSize: SF(17), textAlign: 'center', fontFamily: getSemiBoldFont() }}>Create your account</Text>
                    </Pressable>
                </View>
                <View style={{ marginTop: SH(33), marginHorizontal: SW(50) }}>
                    <Pressable onPress={() => navigation.navigate(RouteNames.LOGINSCREEN)}
                        style={{ backgroundColor: "#31A0624D", borderRadius: 20, paddingVertical: SH(20) }}>
                        <Text style={{ color: colors.white, fontSize: SF(17), textAlign: 'center', fontFamily: getSemiBoldFont() }}>Login</Text>
                    </Pressable>
                </View>
            </View>

        </SafeAreaView>
    );
}

export default StartingScreen;