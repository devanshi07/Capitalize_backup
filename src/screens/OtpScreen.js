import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, Pressable, Image, Text, TextInput, Button, Dimensions } from 'react-native';
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

function OtpScreen({ route, navigation }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState("");
    const [passwordShow, setPasswordShow] = useState(false);

    const otp_input_1 = React.useRef();
    const otp_input_2 = React.useRef();
    const otp_input_3 = React.useRef();
    const otp_input_4 = React.useRef();

    const [otp1, setOtp1] = React.useState('');
    const [otp2, setOtp2] = React.useState('');
    const [otp3, setOtp3] = React.useState('');
    const [otp4, setOtp4] = React.useState('');

    async function onOtpVerifyApi() {
        try {

            if ((otp1 + otp2 + otp3 + otp4).length < 4) {
                alertDialogDisplay(APP_NAME, 'Please enter otp');
                return;
            }

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
                    saveSession(USER_NAME, email);
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
                <View style={{ flex: 1, }}>

                    {/* back button */}
                    <Pressable onPress={() => navigation.goBack()}
                        style={externalStyles.backButtonContainer}>
                        <Image source={images.back_arrow} style={externalStyles.backArrowImage} />
                    </Pressable>
                    {/* end of back button */}

                    <View style={{ marginHorizontal: SW(35), marginTop: SH(35) }}>
                        <Text style={{ fontSize: SF(24), color: colors.white, fontFamily: getInterBoldFont() }}>Enter Verification Code</Text>
                        <Text style={{ fontSize: SF(16), color: "#949494", marginTop: SH(8), fontFamily: getInterRegularFont() }}>Enter 4-digit code that we just send to your phone number  <Text style={{ fontSize: SF(16), color: "#ffffff", marginTop: SH(8), fontFamily: getInterRegularFont() }}>+91 2345678954</Text></Text>
                    </View>

                    <View style={{ marginTop: SH(46), marginHorizontal: SW(35) }}>

                        <View style={{
                            marginTop: SH(12), flexDirection: "row",
                            alignSelf: "center"
                        }}>
                            <TextInput keyboardType="number-pad"
                                style={(otp1.length == 1) ? {
                                    height: Dimensions.get("window").width / 4 - 30,
                                    width: Dimensions.get("window").width / 4 - 30,
                                    textAlign: 'center',
                                    backgroundColor: colors.backButtonColor,
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    marginLeft: 10,
                                    marginRight: 10,
                                    fontSize: 18,
                                    marginTop: 24,
                                    marginBottom: 24,
                                    borderColor: '#C525FF',
                                    borderWidth: 1,
                                    fontSize: 20,
                                    color: "#FFFFFF",
                                    fontWeight: "600",
                                } : {
                                    height: Dimensions.get("window").width / 4 - 30,
                                    width: Dimensions.get("window").width / 4 - 30,
                                    textAlign: 'center',
                                    backgroundColor: colors.backButtonColor,
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    marginLeft: 10,
                                    marginRight: 10,
                                    fontSize: 18,
                                    marginTop: 24,
                                    marginBottom: 24,
                                    borderColor: '#5E5E5E',
                                    borderWidth: 1,
                                    fontSize: 20,
                                    color: "#FFFFFF",
                                    fontWeight: "600",
                                }}
                                maxLength={1} returnKeyType='done'
                                ref={otp_input_1} value={otp1}
                                activeUnderlineColor={'#E6AA11'}
                                theme={{ colors: { selectionColor: '#E6AA11', } }}
                                onChangeText={text => {
                                    setOtp1(text);
                                    if (text.length == 1) {
                                        otp_input_2.current.focus();
                                    }
                                }}
                            />
                            <TextInput keyboardType="number-pad"
                                style={(otp2.length == 1) ? {
                                    height: Dimensions.get("window").width / 4 - 30,
                                    width: Dimensions.get("window").width / 4 - 30,
                                    textAlign: 'center',
                                    backgroundColor: colors.backButtonColor,
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    marginLeft: 10,
                                    marginRight: 10,
                                    fontSize: 18,
                                    marginTop: 24,
                                    marginBottom: 24,
                                    borderColor: '#C525FF',
                                    borderWidth: 1,
                                    fontSize: 20,
                                    color: "#FFFFFF",
                                    fontWeight: "600",
                                } : {
                                    height: Dimensions.get("window").width / 4 - 30,
                                    width: Dimensions.get("window").width / 4 - 30,
                                    textAlign: 'center',
                                    backgroundColor: colors.backButtonColor,
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    marginLeft: 10,
                                    marginRight: 10,
                                    fontSize: 18,
                                    marginTop: 24,
                                    marginBottom: 24,
                                    borderColor: '#5E5E5E',
                                    borderWidth: 1,
                                    fontSize: 20,
                                    color: "#FFFFFF",
                                    fontWeight: "600",
                                }}
                                maxLength={1} returnKeyType='done'
                                ref={otp_input_2} value={otp2}
                                activeUnderlineColor={'#E6AA11'}
                                theme={{ colors: { selectionColor: '#E6AA11', } }}
                                onChangeText={text => {
                                    setOtp2(text);
                                    if (text.length == 1) {
                                        otp_input_3.current.focus();
                                    } else if (text.length == 0) {
                                        otp_input_1.current.focus();
                                    }
                                }}
                            />
                            <TextInput keyboardType="number-pad"
                                style={(otp3.length == 1) ? {
                                    height: Dimensions.get("window").width / 4 - 30,
                                    width: Dimensions.get("window").width / 4 - 30,
                                    textAlign: 'center',
                                    backgroundColor: colors.backButtonColor,
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    marginLeft: 10,
                                    marginRight: 10,
                                    fontSize: 18,
                                    marginTop: 24,
                                    marginBottom: 24,
                                    borderColor: '#C525FF',
                                    borderWidth: 1,
                                    fontSize: 20,
                                    color: "#FFFFFF",
                                    fontWeight: "600",
                                } : {
                                    height: Dimensions.get("window").width / 4 - 30,
                                    width: Dimensions.get("window").width / 4 - 30,
                                    textAlign: 'center',
                                    backgroundColor: colors.backButtonColor,
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    marginLeft: 10,
                                    marginRight: 10,
                                    fontSize: 18,
                                    marginTop: 24,
                                    marginBottom: 24,
                                    borderColor: '#5E5E5E',
                                    borderWidth: 1,
                                    fontSize: 20,
                                    color: "#FFFFFF",
                                    fontWeight: "600",
                                }}
                                maxLength={1} returnKeyType='done'
                                ref={otp_input_3} value={otp3}
                                activeUnderlineColor={'#E6AA11'}
                                theme={{ colors: { selectionColor: '#E6AA11', } }}
                                onChangeText={text => {
                                    setOtp3(text);
                                    if (text.length == 1) {
                                        otp_input_4.current.focus();
                                    } else if (text.length == 0) {
                                        otp_input_2.current.focus();
                                    }
                                }}
                            />
                            <TextInput keyboardType="number-pad"
                                style={(otp4.length == 1) ? {
                                    height: Dimensions.get("window").width / 4 - 30,
                                    width: Dimensions.get("window").width / 4 - 30,
                                    textAlign: 'center',
                                    backgroundColor: colors.backButtonColor,
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    marginLeft: 10,
                                    marginRight: 10,
                                    fontSize: 18,
                                    marginTop: 24,
                                    marginBottom: 24,
                                    borderColor: '#C525FF',
                                    borderWidth: 1,
                                    fontSize: 20,
                                    color: "#FFFFFF",
                                    fontWeight: "600",
                                } : {
                                    height: Dimensions.get("window").width / 4 - 30,
                                    width: Dimensions.get("window").width / 4 - 30,
                                    textAlign: 'center',
                                    backgroundColor: colors.backButtonColor,
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    marginLeft: 10,
                                    marginRight: 10,
                                    fontSize: 18,
                                    marginTop: 24,
                                    marginBottom: 24,
                                    borderColor: '#5E5E5E',
                                    borderWidth: 1,
                                    fontSize: 20,
                                    color: "#FFFFFF",
                                    fontWeight: "600",
                                }}
                                maxLength={1} returnKeyType='done'
                                ref={otp_input_4} value={otp4}
                                activeUnderlineColor={'#E6AA11'}
                                theme={{ colors: { selectionColor: '#E6AA11', } }}
                                onChangeText={text => {
                                    setOtp4(text);
                                    if (text.length == 0) {
                                        otp_input_3.current.focus();
                                    }
                                }}
                            />
                        </View>


                        <Pressable style={{ marginTop: SH(22) }}>
                            <Text style={{ color: colors.white, fontSize: SF(17), textAlign: 'center', fontFamily: getRegularFont() }}>Resend code in <Text style={{ color: colors.secondThemeColor, fontSize: SF(17), textAlign: 'center', fontFamily: getInterRegularFont() }}>15:30</Text></Text>
                        </Pressable>

                        <Pressable
                            // onPress={onOtpVerifyApi}
                            style={{ marginTop: SH(69), }}>
                            <LinearGradient colors={[colors.themeButtonColor1, colors.themeButtonColor2]}
                                style={externalStyles.buttonGrdientContainer}>
                                <Text style={externalStyles.buttonText}>Verify</Text>
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

export default OtpScreen;