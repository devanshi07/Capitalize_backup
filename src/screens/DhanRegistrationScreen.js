import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, Pressable, Image, Text, TextInput } from 'react-native';
import { colors } from '../utils/colors';
import { SF, SH, SW } from '../utils/dimensions';
import { getMediumFont, getRegularFont } from '../utils/Fonts';
import { CustomConsole } from '../utils/Functions';
import images from '../images';
import { RouteNames } from '../navigators/RouteNames';
import { getSession, LOGIN_TOKEN, TOKEN_TYPE } from '../utils/LocalStorage';

function DhanRegistrationScreen({ route, navigation }) {

    // const ResultItem = route.params?.paramItem;

    const [isLoading, setIsLoading] = useState("");

    async function onRegisterNameApi() {
        try {

            const token_type = await getSession(TOKEN_TYPE);
            const access_token = await getSession(LOGIN_TOKEN);

            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", token_type + " " + access_token);

            const raw = JSON.stringify({
                "broker": "DHAN"
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            // {
            //     "response_body": {
            //       "login_url": "https://auth.dhan.co/consent-login?consentId=8ff2d22a-6931-4a32-9af5-24a8ec980014"
            //     },
            //     "broker": "DHAN",
            //     "status_code": 200,
            //     "response_message": "Successful"
            //   }
            fetch("https://capitalize.onrender.com/broker/login-url", requestOptions)
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
                    return response.json();
                })
                .then((result) => {
                    CustomConsole("in result");
                    CustomConsole(result);
                    navigation.navigate(RouteNames.WEBVIEWSCREEN, { paramLink: result.response_body.login_url, paramBroker: result.broker });
                    // setErrorMessage(null); // Clear error on success
                })
                .catch((error) => {
                    CustomConsole("Register api exception: " + error);
                });

        } catch (error) {
            setIsLoading(false);
            CustomConsole("Register name api error: " + error);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.themeGreen }}>
                <View style={{ alignItems: "center", marginHorizontal: SW(50) }}>
                    <Image source={images.dhan_logo} style={{ width: SH(147), height: SH(147), resizeMode: "contain" }} />
                    <Text style={{ fontSize: SF(16), color: colors.white, textAlign: "center", marginTop: SH(33) }}>Please connect your Broker account for easy trade execution!</Text>
                    {/* <Text style={{ fontSize: SF(24), color: colors.white, marginTop: SH(36) }}>Login to your account</Text> */}
                </View>

                <View style={{ marginTop: SH(50), marginHorizontal: SW(50) }}>
                    <Pressable onPress={onRegisterNameApi}
                        style={{ backgroundColor: colors.buttonColor, borderRadius: 20, paddingVertical: SH(20) }}>
                        <Text style={{ color: colors.white, fontSize: SF(17), textAlign: 'center', fontFamily: getMediumFont() }}>Connect your account</Text>
                    </Pressable>
                </View>
                <View style={{ marginTop: SH(33), marginHorizontal: SW(50) }}>
                    <Pressable style={{ backgroundColor: "#31A0624D", borderRadius: 20, paddingVertical: SH(20) }}>
                        <Text style={{ color: colors.white, fontSize: SF(17), textAlign: 'center', fontFamily: getMediumFont() }}>Skip for now</Text>
                    </Pressable>
                </View>
            </View>

        </SafeAreaView>
    );
}

export default DhanRegistrationScreen;