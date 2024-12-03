import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, Pressable, Image, Text, TextInput } from 'react-native';
import { colors } from '../utils/colors';
import { SF, SH, SW } from '../utils/dimensions';
import { getMediumFont, getRegularFont } from '../utils/Fonts';
import { alertDialogDisplay, CustomConsole } from '../utils/Functions';
import { RouteNames } from '../navigators/RouteNames';

function RegisterOnlyNameScreen({ route, navigation }) {

    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState("");

    async function onRegisterNameApi() {
        try {
            if (name.trim().length == 0) {
                alertDialogDisplay("", "Please enter a name");
            } else {
                navigation.navigate(RouteNames.REGISTERSCREEN, { paramName: name });
            }
        } catch (error) {
            setIsLoading(false);
            CustomConsole("Register name api error: " + error);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.themeGreen }}>
                <View style={{ alignItems: "center", marginHorizontal: SW(50) }}>
                    <Text style={{ fontSize: SF(34), color: colors.white, textAlign: "center" }}>Hi there, please enter your name!</Text>
                    {/* <Text style={{ fontSize: SF(24), color: colors.white, marginTop: SH(36) }}>Login to your account</Text> */}
                </View>

                <View style={{ marginTop: SH(62), marginHorizontal: SW(50) }}>
                    <TextInput
                        style={{
                            color: colors.white,
                            fontSize: SF(15),
                            fontFamily: getRegularFont(),
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: colors.borderColor,
                            paddingHorizontal: SW(16),
                            paddingVertical: SH(8),
                            borderRadius: 8,
                        }}
                        value={name}
                        onChangeText={txt => { setName(txt); }}
                        placeholderTextColor={colors.white}
                        placeholder="Name"
                    />

                    <Pressable onPress={onRegisterNameApi}
                        style={{ backgroundColor: colors.buttonColor, borderRadius: 20, marginTop: SH(69), paddingVertical: SH(20) }}>
                        <Text style={{ color: colors.white, fontSize: SF(17), textAlign: 'center', fontFamily: getMediumFont() }}>Continue</Text>
                    </Pressable>
                </View>
            </View>

        </SafeAreaView>
    );
}

export default RegisterOnlyNameScreen;