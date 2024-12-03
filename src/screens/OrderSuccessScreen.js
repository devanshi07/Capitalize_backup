import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, Pressable, Image, Text, TextInput } from 'react-native';
import { colors } from '../utils/colors';
import { SF, SH, SW } from '../utils/dimensions';
import { getBoldFont, getInterBoldFont, getInterRegularFont, getInterSemiBoldFont, getMediumFont, getRegularFont } from '../utils/Fonts';
import { CustomConsole } from '../utils/Functions';
import { LOGIN } from '../utils/API';
import { LOGIN_TOKEN, saveSession, TOKEN_TYPE } from '../utils/LocalStorage';
import { RouteNames } from '../navigators/RouteNames';
import { progressView } from '../utils/components';
import { externalStyles } from '../utils/style';
import LinearGradient from 'react-native-linear-gradient';
import images from '../images';

function OrderSuccessScreen({ route, navigation }) {

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate(RouteNames.MYTABS);
            navigation.reset({
                index: 0,
                routes: [{ name: RouteNames.MYTABS }],
            });
        }, 2000);
    }, []);
    
    return (
        <SafeAreaView style={externalStyles.mainContainer}>


            <View style={{ flex: 1, justifyContent: "center" }}>
                <Image source={images.order_success} style={{ height: SH(280), width: "100%", resizeMode: "cover", }} />
                <View style={{ marginHorizontal: SW(55), marginTop: SH(61.58) }}>
                    <Text style={{ fontSize: SF(24), color: colors.white, fontFamily: getInterBoldFont(), textAlign: "center" }}>Orders Submited Succesfully!</Text>
                    <Text style={{ fontSize: SF(17), color: colors.white, fontFamily: getInterBoldFont(), textAlign: "center", marginTop: SH(28) }}>Please confirm order placement on your broker!</Text>
                    {/* <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: SF(16), color: "#949494", marginTop: SH(24), fontFamily: getInterRegularFont(), flex: 1 }}>Invested amount :</Text>
                    <Text style={{ fontSize: SF(16), color: "#949494", marginTop: SH(24), fontFamily: getInterRegularFont(), flex: 1 }}>10,000</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: SF(16), color: "#949494", marginTop: SH(8), fontFamily: getInterRegularFont(), flex: 1 }}>Potential :</Text>
                    <Text style={{ fontSize: SF(16), color: "#949494", marginTop: SH(8), fontFamily: getInterRegularFont(), flex: 1 }}>+500 (5%)</Text>
                </View> */}
                </View>
            </View>

            <View style={{ marginHorizontal: SW(43) }}>
                <Pressable onPress={() => navigation.navigate(RouteNames.MYTABS)}
                    style={{ marginBottom: SH(30), }}>
                    <LinearGradient colors={[colors.themeButtonColor1, colors.themeButtonColor2]}
                        style={externalStyles.buttonGrdientContainer}>
                        <Text style={externalStyles.buttonText}>Done</Text>
                    </LinearGradient>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

export default OrderSuccessScreen;