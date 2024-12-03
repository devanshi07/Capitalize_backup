import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, Pressable, Image, Text, TextInput, Button } from 'react-native';
import { colors } from '../utils/colors';
import { SF, SH, SW } from '../utils/dimensions';
import { getBoldFont, getInterBoldFont, getInterRegularFont, getInterSemiBoldFont, getMediumFont, getRegularFont } from '../utils/Fonts';
import { alertDialogDisplay, CustomConsole } from '../utils/Functions';
import { LOGIN } from '../utils/API';
import { lAST_LOGIN_DATE, LOGIN_TOKEN, saveSession, TOKEN_TYPE, USER_NAME } from '../utils/LocalStorage';
import { RouteNames } from '../navigators/RouteNames';
import { progressView } from '../utils/components';
import { externalStyles } from '../utils/style';
import LinearGradient from 'react-native-linear-gradient';
import images from '../images';
import moment from 'moment';

function LoginScreen({ route, navigation }) {

    // const [email, setEmail] = useState("dev");
    // const [password, setPassword] = useState("123");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState("");
    const [passwordShow, setPasswordShow] = useState(false);

    async function onLoginApi() {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "username": email,
                "password": password
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };
            setIsLoading(true);
            fetch(LOGIN, requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        if (response.status === 400) {
                            // Parse the response to extract the error details
                            return response.json().then((data) => {
                                alertDialogDisplay("", data.detail); // Set the 'detail' message from the response
                            });
                        }
                        throw new Error("HTTP status " + response.status);
                    }
                    setIsLoading(false);
                    return response.json();
                })
                .then((result) => {
                    CustomConsole("in result");
                    CustomConsole(result);
                    setIsLoading(false);
                    saveSession(LOGIN_TOKEN, result.access_token);
                    saveSession(TOKEN_TYPE, result.token_type);
                    saveSession(USER_NAME,email);
                    const todayDate = moment().format("YYYY-MM-DD");
                    saveSession(lAST_LOGIN_DATE, todayDate);

                    // navigation.navigate(RouteNames.DHANREGISTRATIONSCREEN, { paramItem: result })
                    navigation.navigate(RouteNames.SELECTBROKERSCREEN, { paramItem: result });
                    // setErrorMessage(null); // Clear error on success
                })
                .catch((error) => {
                    setIsLoading(false);
                    CustomConsole("Register api exception: " + error);
                });
        } catch (error) {
            setIsLoading(false);
            CustomConsole("Login api error: " + error);
        }
    }

    return (
        <SafeAreaView style={externalStyles.mainContainer}>

            {isLoading ? progressView(isLoading) :
                <View style={{ flex: 1, marginTop: SH(128) }}>

                    <View style={{ marginHorizontal: SW(35) }}>
                        <Text style={{ fontSize: SF(24), color: colors.white, fontFamily: getInterBoldFont() }}>Welcome Back</Text>
                        <Text style={{ fontSize: SF(16), color: "#949494", marginTop: SH(8), fontFamily: getInterRegularFont() }}>Login to your account</Text>
                    </View>

                    <View style={{ marginTop: SH(46), marginHorizontal: SW(35) }}>

                        <TextInput
                            style={{
                                color: colors.white,
                                fontSize: SF(15),
                                fontFamily: getInterRegularFont(),
                                borderWidth: 1,
                                borderColor: colors.borderColor,
                                paddingHorizontal: SW(16),
                                paddingVertical: SH(8),
                                borderRadius: 8,
                            }}
                            value={email}
                            onChangeText={txt => { setEmail(txt); }}
                            inputMode="email"
                            keyboardType='email-address'
                            placeholderTextColor={colors.placeHolderTextColor}
                            placeholder="Username"
                        />

                        <View style={{
                            flexDirection: "row", alignItems: "center", borderRadius: 8,
                            borderWidth: 1,
                            borderColor: colors.borderColor, marginTop: SH(16),
                            paddingHorizontal: SW(16),
                        }}>

                            <TextInput
                                style={{
                                    color: colors.white,
                                    fontSize: SF(15),
                                    fontFamily: getInterRegularFont(),
                                    flex: 1
                                }}
                                value={password}
                                onChangeText={txt => { setPassword(txt); }}
                                placeholderTextColor={colors.placeHolderTextColor}
                                placeholder="Password"
                                secureTextEntry={!passwordShow}
                            />
                            <Pressable onPress={() => setPasswordShow(!passwordShow)}
                                style={{ padding: SH(5) }}>
                                <Image source={passwordShow ? images.password_show : images.password_hide} style={{ height: SH(30), width: SH(30), resizeMode: "contain" }} />
                            </Pressable>
                        </View>

                        <Pressable style={{ marginTop: SH(22) }}>
                            <Text style={{ color: colors.secondThemeColor, fontSize: SF(17), textAlign: 'right', fontFamily: getInterRegularFont() }}>Forgot password?</Text>
                        </Pressable>

                        <Pressable onPress={onLoginApi}
                            style={{ marginTop: SH(69), }}>
                            <LinearGradient colors={[colors.themeButtonColor1, colors.themeButtonColor2]}
                                style={externalStyles.buttonGrdientContainer}>
                                <Text style={externalStyles.buttonText}>Sign In</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", flex: 1, marginBottom: SH(38) }}>
                        <Text style={{ fontSize: SF(16), color: "#949494", fontFamily: getInterSemiBoldFont(), alignSelf: "flex-end" }}>Don't have account?</Text>
                        <Pressable onPress={() => navigation.navigate(RouteNames.REGISTERSCREEN)}
                            style={{ alignSelf: "flex-end" }}>
                            <Text style={{ fontSize: SF(16), color: colors.secondThemeColor, fontFamily: getInterSemiBoldFont(), marginLeft: SW(5) }}>Sign Up</Text>
                        </Pressable>
                    </View>
                </View>
            }



        </SafeAreaView>
    );
}

export default LoginScreen;