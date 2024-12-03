import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, Pressable, Image, Text, TextInput, Alert, TouchableOpacity, Modal, FlatList, Dimensions } from 'react-native';
import { colors } from '../utils/colors';
import { SF, SH, SW } from '../utils/dimensions';
import { getBoldFont, getInterBoldFont, getInterRegularFont, getInterSemiBoldFont, getMediumFont, getRegularFont } from '../utils/Fonts';
import { alertDialogDisplay, alertDialogOnpressDisplay, CustomConsole } from '../utils/Functions';
import { BROKER_LOGIN_URL, LOGIN } from '../utils/API';
import { BROKER, BROKER_TOKEN, clearAsyncStorage, EMAIL, getSession, LOGIN_TOKEN, removeItemSession, saveSession, TOKEN_TYPE, USER_NAME } from '../utils/LocalStorage';
import { RouteNames } from '../navigators/RouteNames';
import { progressView } from '../utils/components';
import { externalStyles } from '../utils/style';
import LinearGradient from 'react-native-linear-gradient';
import { APP_NAME } from '../utils/string';
import images from '../images';
import { useIsFocused } from '@react-navigation/native';

function ProfileScreen({ route, navigation }) {

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

    const [name, setName] = useState("");
    const [broker_token, setBrokerToken] = useState("");
    const [selectBrokerModalVisible, setSelectBrokerModalVisible] = useState(false);
    const focused = useIsFocused();

    useEffect(() => {
        if (focused) {
            getSessionData();
        }
    }, [focused]);

    const getSessionData = async () => {
        try {
            const stored_name = await getSession(USER_NAME);
            const session_broker_token = await getSession(BROKER_TOKEN);
            setName(stored_name);
            setBrokerToken(session_broker_token);
        } catch (error) {
            CustomConsole("getSession error");
            CustomConsole(error);
        }
    }

    // logout function
    const logoutFunction = async () => {
        Alert.alert(APP_NAME, 'Are you sure you want to log out?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            {
                text: 'YES', onPress: async () => {
                    clearAsyncStorage();
                    navigation.navigate(RouteNames.LOGINSCREEN);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: RouteNames.LOGINSCREEN }],
                    });
                }
            },
        ]);
    }

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


            CustomConsole(BROKER_LOGIN_URL);
            CustomConsole(raw);

            fetch(BROKER_LOGIN_URL, requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        setSelectBrokerModalVisible(false);
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
                .then((result) => {
                    CustomConsole("in result");
                    CustomConsole(result);
                    saveSession(BROKER, broker_name);
                    setSelectBrokerModalVisible(false)
                    navigation.navigate(RouteNames.WEBVIEWSCREEN, { paramLink: result.response_body.login_url, paramBroker: result.broker });
                    // setErrorMessage(null); // Clear error on success
                })
                .catch((error) => {
                    setSelectBrokerModalVisible(false);
                    CustomConsole("Register api exception: " + error);
                });

        } catch (error) {
            setSelectBrokerModalVisible(false)
            // setIsLoading(false);
            CustomConsole("Register name api error: " + error);
        }
    }

    return (
        <SafeAreaView style={externalStyles.mainContainer}>

            <View style={{ marginHorizontal: SW(35) }}>

                {/* header */}
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: SH(35) }}>
                    {/* back button */}
                    <Pressable onPress={() => navigation.goBack()}
                        style={externalStyles.backButtonContainer2}>
                        <Image source={images.back_arrow} style={externalStyles.backArrowImage} />
                    </Pressable>
                    {/* end of back button */}

                    {/* title */}
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.white, fontFamily: getInterBoldFont(), textAlign: "center" }}>User Profile</Text>
                    </View>
                    {/* end of title */}
                    <View style={{ width: SH(30) }} />
                </View>
                {/* end of header */}

                {/* profile image */}
                <View style={{ alignItems: "center", marginTop: SH(50) }}>
                    <Image source={images.dummy_profile} style={{ height: SH(88), width: SH(88), resizeMode: "contain", tintColor: colors.white }} />
                    <Text style={{ color: colors.white, fontFamily: getInterBoldFont(), fontSize: SF(20), marginTop: SH(20) }}>{name}</Text>
                </View>
                {/* end of profile image */}

                {/* options */}
                <View style={{ marginTop: SH(31) }}>
                    <Text style={{ color: colors.white, fontFamily: getInterBoldFont(), fontSize: SF(20), marginTop: SH(20) }}>General</Text>

                    <TouchableOpacity onPress={() => navigation.navigate(RouteNames.RISKANALYSISSCREEN)}
                        style={{ flexDirection: "row", alignItems: "center", marginTop: SH(20) }}>
                        <View style={externalStyles.backButtonContainer2}>
                            <Image source={images.protection} style={[externalStyles.backArrowImage, { tintColor: colors.white }]} />
                        </View>
                        <Text style={{ color: colors.white, fontFamily: getInterRegularFont(), fontSize: SF(20), marginLeft: SW(10) }}>Risk profile</Text>
                    </TouchableOpacity>
                    {broker_token !== "" && broker_token != undefined && broker_token != null ? <TouchableOpacity onPress={() => {
                        setSelectBrokerModalVisible(true)
                    }}
                        style={{ flexDirection: "row", alignItems: "center", marginTop: SH(20) }}>
                        <View style={externalStyles.backButtonContainer2}>
                            <Image source={images.switch} style={[externalStyles.backArrowImage, { tintColor: colors.white }]} />
                        </View>
                        <Text style={{ color: colors.white, fontFamily: getInterRegularFont(), fontSize: SF(20), marginLeft: SW(10) }}>Switch Broker</Text>
                    </TouchableOpacity> : null}
                    <TouchableOpacity onPress={logoutFunction}
                        style={{ flexDirection: "row", alignItems: "center", marginTop: SH(20) }}>
                        <View style={externalStyles.backButtonContainer2}>
                            <Image source={images.logout} style={[externalStyles.backArrowImage, { tintColor: colors.white }]} />
                        </View>
                        <Text style={{ color: colors.white, fontFamily: getInterRegularFont(), fontSize: SF(20), marginLeft: SW(10) }}>Log out</Text>
                    </TouchableOpacity>
                </View>
                {/* end of options */}

            </View>

            {/* <View style={{ marginBottom: SH(30) }}></View>
            <View style={{ marginHorizontal: SW(43) }}>
                <Pressable onPress={logoutFunction}
                    style={{ marginBottom: SH(30), }}>
                    <LinearGradient colors={[colors.themeButtonColor1, colors.themeButtonColor2]}
                        style={externalStyles.buttonGrdientContainer}>
                        <Text style={externalStyles.buttonText}>Log out</Text>
                    </LinearGradient>
                </Pressable>
            </View> */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={selectBrokerModalVisible}
                onRequestClose={() => {
                    setSelectBrokerModalVisible(!selectBrokerModalVisible);
                }}
            >
                <View
                    style={{
                        flex: 1,
                    }}>

                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        marginTop: SH(22),
                    }}>
                        <View style={{
                            backgroundColor: '#0E0422',
                            shadowColor: 'black',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 0,
                            elevation: 5,
                            width: '100%', height: '40%', paddingTop: SH(20),
                            borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: SW(15)
                        }}>

                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: SF(22), color: colors.white, textAlign: "center", }}>Select Broker</Text>

                                <Pressable onPress={() => setSelectBrokerModalVisible(false)}
                                    style={{ alignSelf: "flex-end", marginRight: SH(10), marginTop: SH(10), padding: 5, }}>
                                    <Image source={images.close} style={{ width: SH(24), height: SH(24), resizeMode: "contain" }} />
                                </Pressable>
                            </View>
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

                        </View>
                    </View>
                </View>

            </Modal>

        </SafeAreaView>
    );
}

export default ProfileScreen;