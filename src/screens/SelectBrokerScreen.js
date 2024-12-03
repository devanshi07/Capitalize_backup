import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Pressable, Image, Text, FlatList, Dimensions, TouchableOpacity, } from 'react-native';
import { colors } from '../utils/colors';
import { SF, SH, SW } from '../utils/dimensions';
import images from '../images';
import { BROKER, BROKER_TOKEN, EMAIL, getSession, lAST_LOGIN_DATE, LOGIN_TOKEN, removeItemSession, saveSession, TOKEN_TYPE, USER_NAME } from '../utils/LocalStorage';
import { BROKER_LOGIN_URL } from '../utils/API';
import { alertDialogDisplay, alertDialogOnpressDisplay, CustomConsole } from '../utils/Functions';
import { RouteNames } from '../navigators/RouteNames';
import { getInterSemiBoldFont } from '../utils/Fonts';
import { externalStyles } from '../utils/style';
import { APP_NAME } from '../utils/string';

function SelectBrokerScreen({ route, navigation }) {

    // const ResultItem = route.params?.paramItem;
    const [accessToken, setAccessToken] = useState(null);
    const [isLoading, setIsLoading] = useState("");

    useEffect(() => {
        getSessionData()
    }, []);

    const getSessionData = async () => {
        const accessToken = await getSession(BROKER_TOKEN);
        setAccessToken(accessToken);
    };

    const Broker_list = [
        {
            id: "1",
            name: "Angel One",
            image: images.angel_one,
            broker_name: "ANGELONE"
        },
        {
            id: "2",
            name: "Dhan",
            image: images.dhan_logo,
            broker_name: "DHAN"
        },
        // {
        //     id: "2",
        //     name: "Zerodha",
        //     image: images.zerodha
        // },
        // {
        //     id: "3",
        //     name: "Upstox",
        //     image: images.upstox
        // },
        // {
        //     id: "4",
        //     name: "IIFL",
        //     image: images.iifl
        // },
        // {
        //     id: "5",
        //     name: "5paisa",
        //     image: images.five_paisa
        // }
    ];

    async function onRegisterNameApi(broker_name) {
        try {

            const token_type = await getSession(TOKEN_TYPE);
            const access_token = await getSession(LOGIN_TOKEN);

            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", token_type + " " + access_token);

            const raw = JSON.stringify({
                "broker": broker_name
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

            CustomConsole(BROKER_LOGIN_URL);
            CustomConsole(raw);

            fetch(BROKER_LOGIN_URL, requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        // console.log(response)
                        if (response.status === 400) {
                            return response.json().then((data) => {
                                alertDialogDisplay(APP_NAME, data.detail); // Set the 'detail' message from the response
                            });
                        } else if (response.status === 401) {
                            // Handle unauthorized error
                            // alertDialogDisplay("", detail);
                            // Optionally, log the user out or navigate to the login screen
                            // navigation.navigate(RouteNames.LOGINSCREEN);
                            return response.json().then((data) => {
                                removeItemSession(LOGIN_TOKEN);
                                removeItemSession(TOKEN_TYPE);
                                removeItemSession(USER_NAME);
                                removeItemSession(EMAIL);
                                alertDialogOnpressDisplay(APP_NAME,
                                    data.detail + ". Login again.",
                                    () => navigation.navigate(RouteNames.LOGINSCREEN)); // Set the 'detail' message from the response
                            });
                        } else if (response.status === 500) {
                            // Handle server error
                            alertDialogDisplay(APP_NAME, "An unexpected error occurred. Please try again later.");
                        } else {
                            throw new Error("HTTP status " + response.status);
                        }
                    }
                    return response.json();
                })
                .then(async(result) => {
                    CustomConsole("in result");
                    CustomConsole(result);
                    saveSession(BROKER, broker_name);
                    const today = new Date();
                    const todayDate = today.toISOString().split('T')[0];
                    saveSession(lAST_LOGIN_DATE, todayDate);

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
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.themeBackground }}>

            {/* back button */}
            {/* <Pressable onPress={() => navigation.goBack()}
                style={externalStyles.backButtonContainer}>
                <Image source={images.back_arrow} style={externalStyles.backArrowImage} />
            </Pressable> */}
            {/* end of back button */}

            <View style={{ justifyContent: 'center', flex: 1 }}>
                <View style={{ justifyContent: "center", }}>

                    {/* today's recommendation text */}
                    <View style={{ alignItems: "center", marginHorizontal: SW(50), marginTop: -20 }}>
                        <Text style={{ fontSize: SF(22), color: colors.white, textAlign: "center", marginTop: SH(33) }}>Login with your broker</Text>
                    </View>
                    {/* end of today's recommendation text */}

                    {/* broker list */}
                    <FlatList style={{ marginTop: SH(40), alignSelf: "center", }}
                        data={Broker_list}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => onRegisterNameApi(item.broker_name)}
                                style={{ borderWidth: 1, borderRadius: 10, borderColor: colors.borderColor, width: Dimensions.get('window').width / 2 - 20, alignSelf: "center", margin: 5, alignItems: "center", padding: 10 }}>
                                <Image source={item.image}
                                    style={{ height: SH(80), width: SH(80), resizeMode: "contain" }} />
                                <Text style={{ fontSize: SF(22), color: colors.white, marginTop: SH(10) }}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    {/* end of broker list */}
                </View>

            </View>

             <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: SH(38) }}>
                <Pressable onPress={() => navigation.navigate(RouteNames.MYTABS)}
                    style={{ alignSelf: "flex-end" }}>
                    <Text style={{ fontSize: SF(20), color: "#949494", fontFamily: getInterSemiBoldFont(), alignSelf: "flex-end" }}>I’ll do it later</Text>
                </Pressable>
            </View>

        </SafeAreaView>
    );
}

export default SelectBrokerScreen;