//pin: 3568 24 - hour expire

import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, Pressable, Image, Text, FlatList, ScrollView, TouchableOpacity, Alert, BackHandler, Animated, } from 'react-native';
import { colors } from '../utils/colors';
import { SF, SH, SW } from '../utils/dimensions';
import { getInterBoldFont, getInterRegularFont, getMediumFont, getRegularFont, getSemiBoldFont, getSyneRegularFont, } from '../utils/Fonts';
import images from '../images';
import { RouteNames } from '../navigators/RouteNames';
import { BROKER, BROKER_EXPIRE_TIME, BROKER_FUND, BROKER_TOKEN, BROKER_UNUSED_FUND, getSession, LOGIN_TOKEN, removeItemSession, saveSession, TOKEN_TYPE, USER_NAME } from '../utils/LocalStorage';
import LinearGradient from 'react-native-linear-gradient';
import { BASKETS, BASKETS_LTP, BROKER_GET_FUNDS, BUY_ORDER } from '../utils/API';
import { alertDialogDisplay, alertDialogOnpressDisplay, CustomConsole } from '../utils/Functions';
import { externalStyles } from '../utils/style';
import { APP_NAME } from '../utils/string';
import moment from 'moment';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

function DashboardScreen2({ route, navigation }) {

    const [accessToken, setAccessToken] = useState(null);
    const [broker, setBroker] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFundLoading, setIsFundLoading] = useState(false);
    const [fund, setFund] = useState("0");
    const [unusedFund, setUnusedFund] = useState("0");
    const [basketsList, setBasketsList] = useState([]);


    // function formatToIndianUnits(value) {
    //     if (value >= 10000000) {
    //         return (value / 10000000).toFixed(1).replace(/\.0$/, '') + " Cr";
    //     } else if (value >= 100000) {
    //         return (value / 100000).toFixed(0).replace(/\.0$/, '') + " L";
    //     } else if (value >= 1000) {
    //         return (value / 1000).toFixed(1).replace(/\.0$/, '') + " k";
    //     } else {
    //         return value.toString(); // Return the original value if below 1000
    //     }
    // }
    function formatToIndianUnits(value) {
        if (value >= 10000000) {
            return (value / 10000000).toFixed(2).replace(/\.00$/, '') + " Cr";
        } else if (value >= 100000) {
            return (value / 100000).toFixed(2).replace(/\.00$/, '') + " L";
        } else if (value >= 1000) {
            return (value / 1000).toFixed(2).replace(/\.00$/, '') + " k";
        } else {
            return value.toString(); // Return the original value if below 1000
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                Alert.alert(APP_NAME, "Are you sure you want to exit?", [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel"
                    },
                    { text: "YES", onPress: () => BackHandler.exitApp() }
                ]);
                return true; // Prevent default behavior (navigation back)
            };

            BackHandler.addEventListener("hardwareBackPress", backAction);

            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [])
    );

    const focused = useIsFocused();

    useEffect(() => {
        getSessionData()
    }, []);

    useEffect(() => {
        getBasketsApi();
    }, []);

    // get session data method
    const getSessionData = async () => {
        const access_token = await getSession(BROKER_TOKEN);
        const stored_broker = await getSession(BROKER);
        setAccessToken(access_token);
        setBroker(stored_broker);
        if (access_token != null && access_token) {
            getFundsApi(stored_broker, access_token);
        }
    };

    // get funds from broker
    async function getFundsApi(broker, access_token) {
        try {

            // const broker_token = await getSession(BROKER_TOKEN);
            // if (broker_token == null) {

            // }else{

            // }
            console.log("Dashborad broker==>", broker);
            console.log("Dashborad access_token==>", access_token);

            const broker_fund = await getSession(BROKER_FUND);
            const broker_used_fund = await getSession(BROKER_UNUSED_FUND);
            if (broker_fund) {
                setFund(formatToIndianUnits(parseFloat(broker_fund)));
                setUnusedFund(formatToIndianUnits(parseFloat(broker_used_fund)));
            }

            const login_token_type = await getSession(TOKEN_TYPE);
            const login_token = await getSession(LOGIN_TOKEN);

            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", login_token_type + " " + login_token);
            myHeaders.append("x-broker-access-token", access_token);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            CustomConsole(BROKER_GET_FUNDS + broker);
            setIsFundLoading(true);
            fetch(BROKER_GET_FUNDS + broker, requestOptions)
                .then(async (response) => {
                    if (!response.ok) {
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
                                removeItemSession(BROKER);
                                removeItemSession(BROKER_TOKEN);
                                removeItemSession(BROKER_EXPIRE_TIME);
                                removeItemSession(BROKER_FUND);
                                removeItemSession(BROKER_UNUSED_FUND);
                                removeItemSession(LOGIN_TOKEN);
                                removeItemSession(TOKEN_TYPE);
                                removeItemSession(BROKER_UNUSED_FUND);
                                alertDialogOnpressDisplay(APP_NAME,
                                    data.detail + ". Login again.",
                                    () => navigation.navigate(RouteNames.LOGINSCREEN)); // Set the 'detail' message from the response
                            });
                        } else if (response.status === 500) {
                            console.log("On Dashborad==>456 ", response)

                            // Handle server error
                            // alertDialogDisplay(APP_NAME, "An unexpected error occurred. Please try again later.");
                        } else {
                            throw new Error("HTTP status " + response.status);
                        }
                    }
                    return await response.json();
                })
                .then((result) => {
                    CustomConsole("in dashboard result");
                    CustomConsole(result);
                    setFund(formatToIndianUnits((result.response_body.portfolio_value)));
                    CustomConsole("in dashboard result123");

                    setUnusedFund(formatToIndianUnits((result.response_body.available_balance)));
                    CustomConsole("in dashboard result456");

                    saveSession(BROKER_FUND, result.response_body.portfolio_value.toString());
                    CustomConsole("in dashboard result789");

                    saveSession(BROKER_UNUSED_FUND, result.response_body.available_balance.toString());
                    CustomConsole("in dashboard result101112");

                    // setErrorMessage(null); // Clear error on success
                    setIsFundLoading(false);
                })
                .catch((error) => {
                    setIsFundLoading(false);
                    CustomConsole("Get funds api exception in dashboard: " + error);
                });

        } catch (error) {
            setIsFundLoading(false);
            CustomConsole("Get funds api error in dashboard: " + error);
        }
    }

    // get baskets api call
    async function getBasketsApi() {
        try {

            const login_token_type = await getSession(TOKEN_TYPE);
            const login_token = await getSession(LOGIN_TOKEN);
            const accessToken = await getSession(BROKER_TOKEN);

            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                // "client_id": "string",
                // "request_id": "string",
                "filters": [
                    {
                        "field": "start_datetime",
                        "values": [
                            moment().format("YYYY-MM-DD")
                            // "2024-10-11"
                        ]
                    }
                ]
            });

            // console.log(raw)

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            CustomConsole(BASKETS);
            CustomConsole(raw);
            setIsLoading(true);
            fetch(BASKETS, requestOptions)
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
                .then(async (result) => {
                    CustomConsole("in result");
                    CustomConsole(result);

                    basketsList.length = 0;

                    if (result.response_body.hydrated_basket_list[0]) {

                        for (let i = 0; i < result.response_body.hydrated_basket_list[0].recommendation_list.length; i++) {
                            // for (let i = 0; i < 1; i++) {
                            // console.log(result.response_body.hydrated_basket_list[0].recommendation_list[i])
                            // Fetch LTP for each basket
                            const ltp = await fetchBasketLTP(result.response_body.hydrated_basket_list[0].recommendation_list[i], login_token_type, login_token, accessToken);

                            // Check if ltp was successfully fetched
                            if (ltp !== null) {
                                // basketsList.push({
                                //     ltp: ltp,
                                //     percentage: ((((260.46) - parseFloat(ltp)) / 260.46) * 100).toFixed(2),
                                //     plus_minus: ((((260.46) - parseFloat(ltp)) / 260.46) * 100) >= 0 ? "+" : "-",
                                //     percentage_color: (((parseFloat(260.46) - parseFloat(ltp)) / 260.46) * 100) >= 0 ? "#32B22E" : "red",
                                // });

                                const input = result.response_body.hydrated_basket_list[0].recommendation_list[i].recommended_price;
                                const parts = input.split("-");
                                // const secondPart = parts[1];
                                const firstPart = parts[0];
                                // console.log("secondPart==>" + secondPart);
                                // console.log("firstPart==>" + firstPart);

                                basketsList.push({
                                    ltp: ltp,
                                    percentage: (((parseFloat(result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) - parseFloat(firstPart)) / parseFloat(firstPart)) * 100).toFixed(2),
                                    plus_minus: (((parseFloat(result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) - parseFloat(firstPart)) / parseFloat(firstPart)) * 100) >= 0 ? "+" : "-",
                                    percentage_color: (((parseFloat(result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) - parseFloat(firstPart)) / parseFloat(firstPart)) * 100) >= 0 ? "#32B22E" : "red",

                                    // percentage: (((parseFloat(secondPart) - parseFloat(ltp)) / parseFloat(ltp)) * 100).toFixed(2),
                                    // plus_minus: (((parseFloat(secondPart) - parseFloat(ltp)) / parseFloat(ltp)) * 100) >= 0 ? "+" : "",
                                    // percentage_color: (((parseFloat(secondPart) - parseFloat(ltp)) / parseFloat(ltp)) * 100) >= 0 ? "#32B22E" : "red",

                                    instrument_display_name: result.response_body.hydrated_basket_list[0].recommendation_list[i].instrument_display_name,
                                    recommended_action: result.response_body.hydrated_basket_list[0].recommendation_list[i].recommended_action,
                                    exchange: result.response_body.hydrated_basket_list[0].recommendation_list[i].exchange,
                                    stop_loss: result.response_body.hydrated_basket_list[0].recommendation_list[i].stop_loss,
                                    target_1: result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1,
                                    recommended_price: result.response_body.hydrated_basket_list[0].recommendation_list[i].recommended_price,
                                    _id: result.response_body.hydrated_basket_list[0].recommendation_list[i]._id,
                                    timestamp: result.response_body.hydrated_basket_list[0].recommendation_list[i].timestamp,
                                    source_id: result.response_body.hydrated_basket_list[0].recommendation_list[i].source_id,
                                    recommendation_type: result.response_body.hydrated_basket_list[0].recommendation_list[i].recommendation_type,
                                    instrument_code: result.response_body.hydrated_basket_list[0].recommendation_list[i].instrument_code,
                                    target_2: result.response_body.hydrated_basket_list[0].recommendation_list[i].target_2,
                                    target_3: result.response_body.hydrated_basket_list[0].recommendation_list[i].target_3,
                                    is_ongoing: result.response_body.hydrated_basket_list[0].recommendation_list[i].is_ongoing,
                                    trade_duration: result.response_body.hydrated_basket_list[0].recommendation_list[i].trade_duration,



                                });
                            }

                            // basketsList.push(result.response_body.hydrated_basket_list[0].recommendation_list[i])
                            // basketsList.push({
                            //     ltp: ltp,
                            //     percentage: ((parseFloat(result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) - parseFloat(ltp)) / result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) * 100,
                            //     percentage_color: (((parseFloat(result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) - parseFloat(ltp)) / result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) * 100) >= 0 ? "#32B22E" : "red",
                            //     instrument_display_name: result.response_body.hydrated_basket_list[0].recommendation_list[i].instrument_display_name,
                            //     recommended_action: result.response_body.hydrated_basket_list[0].recommendation_list[i].recommended_action,
                            //     exchange: result.response_body.hydrated_basket_list[0].recommendation_list[i].exchange,
                            //     stop_loss: result.response_body.hydrated_basket_list[0].recommendation_list[i].stop_loss,
                            //     target_1: result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1,
                            //     recommended_price: result.response_body.hydrated_basket_list[0].recommendation_list[i].recommended_price,
                            // });

                        }
                    }
                    setBasketsList(basketsList);
                    CustomConsole("basketsList: ");
                    CustomConsole(basketsList);
                    setIsLoading(false);
                    //setBasketsList(result.response_body.hydrated_basket_list[0].recommendation_list[0])
                })
                .catch((error) => {
                    setBasketsList([]);
                    setIsLoading(false);
                    CustomConsole("Get baskets api exception: " + error);
                });

        } catch (error) {
            setIsLoading(false);
            CustomConsole("Get baskets api error: " + error);
        }
    }

    // get symbol ltp
    const fetchBasketLTP = async (basket, login_token_type, login_token, accessToken) => {

        console.log("basket==> ", basket)
        const myHeaders_ltp = new Headers();
        myHeaders_ltp.append("Accept", "application/json");
        myHeaders_ltp.append("Content-Type", "application/json");
        // myHeaders_ltp.append("Authorization", login_token_type + " " + login_token);
        // myHeaders_ltp.append("x-broker-access-token", accessToken);

        // const raw_ltp = JSON.stringify([
        //     {
        //         "stock_symbol": basket.instrument_display_name,
        //         "exchange": basket.exchange,
        //         "segment": "EQUITY",
        //         "stock_token": basket.instrument_code
        //     }
        // ]);
        const raw_ltp = JSON.stringify({
            "tokens": [
                basket.instrument_code
            ]
        });

        const requestOptions_ltp = {
            method: "POST",
            headers: myHeaders_ltp,
            body: raw_ltp,
            redirect: "follow"
        };

        CustomConsole(BASKETS_LTP);
        CustomConsole(raw_ltp);

        try {
            const response_ltp = await fetch(BASKETS_LTP, requestOptions_ltp);
            if (!response_ltp.ok) {
                if (response_ltp.status === 400) {
                    const data = await response_ltp.json();
                    alertDialogDisplay("", data.detail); // Handle error display
                }
                throw new Error("HTTP status " + response_ltp.status);
            }
            const result_ltp = await response_ltp.json();
            CustomConsole("in result");
            CustomConsole(result_ltp);

            // return result_ltp.response_body[0].ltp;
            return result_ltp;
        } catch (error) {
            CustomConsole("Get LTP api exception: " + error);
            return null; // Return null if error occurs
        }
    };

    // excute basket api call
    async function executeBasketApi() {
        try {

            const login_token_type = await getSession(TOKEN_TYPE);
            const login_token = await getSession(LOGIN_TOKEN);
            const broker = await getSession(BROKER);
            const broker_token = await getSession(BROKER_TOKEN);

            const myHeaders = new Headers();
            myHeaders.append("Authorization", login_token_type + " " + login_token);
            myHeaders.append("x-broker-access-token", broker_token);
            myHeaders.append("Content-Type", "application/json");

            // CustomConsole("bastket api==>");
            // CustomConsole(basketsList[0].instrument_display_name);
            // CustomConsole(basketsList.length);

            var orders = [];

            for (var i = 0; i <= basketsList.length - 1; i++) {
                orders.push({
                    "trading_token": basketsList[i].instrument_code,
                    "transaction_type": basketsList[i].recommended_action,
                    "exchange": basketsList[i].exchange,
                    "quantity": 1,
                    "stop_loss": basketsList[i].stop_loss,
                    "target_1": basketsList[i].target_1,
                    "trigger_price_target": 5.83,
                    "trigger_price_stop_loss": 5.83,
                    "order_tag": "",
                    "trading_symbol": basketsList[i].instrument_display_name,
                    "target_1": 0,
                    "is_after_market": false,
                });
            }

            const raw = JSON.stringify({
                "orders": orders,
                "broker": broker,
                "segment": "EQUITY"
            });

            // console.log(raw);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            CustomConsole(BUY_ORDER);
            CustomConsole(raw);

            fetch(BUY_ORDER, requestOptions)
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
                    navigation.navigate(RouteNames.ORDERSUCCESSSCREEN);
                    setIsLoading(false);
                })
                .catch((error) => {
                    CustomConsole("Execute api exception: " + error);
                });

        } catch (error) {
            setIsLoading(false);
            CustomConsole("Execute api error: " + error);
        }
    }

    const isWithinTimeRange = () => {
        const currentTime = new Date();

        // Get hours and minutes of the current time
        const currentHour = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();

        // Define the start time (9:15 AM) and end time (3:30 PM)
        const startHour = 9;
        const startMinutes = 15;
        const endHour = 15;  // 3:30 PM in 24-hour format
        const endMinutes = 30;

        // Check if current time is within the time range
        if (
            (currentHour > startHour || (currentHour === startHour && currentMinutes >= startMinutes)) &&
            (currentHour < endHour || (currentHour === endHour && currentMinutes <= endMinutes))
        ) {
            return true;  // Current time is within 9:00 AM to 4:00 PM
        }

        return false;  // Current time is outside of the specified range
    };

    const handlePress = async () => {

        // navigation.navigate(RouteNames.ADDORDERSCREEN);

        if (isWithinTimeRange()) {
            // console.log("The current time is within 9:00 AM to 4:00 PM.");
            const broker_token = await getSession(BROKER_TOKEN);
            if (broker_token != null) {
                if (basketsList.length > 0) {
                    // executeBasketApi();
                    navigation.navigate(RouteNames.ADDORDERSCREEN);
                } else {
                    setHasSwiped(false);
                    setTimeout(() => {
                        swipeableRef.current.close();
                    }, 1000);
                }
            } else {
                navigation.navigate(RouteNames.SELECTBROKERSCREEN);
            }
        } else {
            setHasSwiped(false);
            setTimeout(() => {
                swipeableRef.current.close();
            }, 1000);
            // console.log("The current time is outside the range.");
            alertDialogDisplay(APP_NAME, "Sorry! The market is currently closed. Please try to place orders again during market hours.")
        }
    };

    // Swipeable Action Component
    const renderSwipeableAction = () => (
        <View style={{
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.55)',
            width: '100%',  // This makes the swipeable action cover the full width
            // padding: 20,
        }}>
            <Animated.Text style={[{
                color: 'black',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: SF(18),

            }, { opacity }]}>Executing...</Animated.Text>
        </View>
    );

    const swipeableRef = useRef(null);  // Create a ref for the Swipeable component
    const [hasSwiped, setHasSwiped] = useState(false);  // Track if user has swiped
    const opacity = useRef(new Animated.Value(0)).current;  // Opacity for fading effect

    // UseEffect to close the swipe when the screen loads
    useEffect(() => {
        if (swipeableRef.current) {
            swipeableRef.current.close();  // Close swipe when the screen loads
        }
    }, [focused]);

    // Handle swipe open action and trigger fade-in effect
    const handleSwipeOpen = () => {
        if (!hasSwiped) {
            handlePress();  // Trigger the swipe action (e.g., execute some task)
            setHasSwiped(true);  // Mark that the swipe has happened
            // Start the fade-in effect
            Animated.timing(opacity, {
                toValue: 1,  // Fully visible
                duration: 500,  // Duration of the fade (500ms)
                useNativeDriver: true,
            }).start();
        }
    };

    // Function to reset the animation when swipe is reset
    const handleSwipeClose = () => {
        setHasSwiped(false);  // Allow swipe to happen again
        // Reset the opacity to 0 for the next swipe
        Animated.timing(opacity, {
            toValue: 0,  // Fully transparent
            duration: 0,  // Instant reset of opacity
            useNativeDriver: true,
        }).start();
    };

    return (
        <SafeAreaView style={externalStyles.mainContainer}>
            <LinearGradient colors={["#C525FF", "#391EDC"]}
                style={{ paddingBottom: SH(25), borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}
            >
                {/* header view */}
                <View
                    style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: SW(37), paddingVertical: SH(32), borderBottomLeftRadius: 40, borderBottomRightRadius: 40, justifyContent: "space-between", marginTop: SH(10) }}>
                    <Pressable onPress={() => navigation.navigate(RouteNames.PROFILESCREEN)}>
                        <Image source={images.Profile_2} style={{ width: SH(30), height: SH(30), resizeMode: "contain" }} />
                    </Pressable>
                    <Text style={{ fontSize: SF(26), color: colors.white, textAlign: "center", fontFamily: getSyneRegularFont(), letterSpacing: 2 }}>{APP_NAME}</Text>
                    <Pressable>
                        <Image source={images.notification} style={{ width: SH(30), height: SH(30), resizeMode: "contain" }} />
                    </Pressable>
                </View>
                {/* end of header view */}


                {accessToken !== "" && accessToken != undefined && accessToken != null ? <View style={{ alignItems: "center", marginHorizontal: SW(50) }}>
                    <Text style={{ fontSize: SF(20), color: colors.white, textAlign: "center", marginTop: SH(0), fontWeight: "600", fontFamily: getRegularFont() }}>Current Portfolio</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: SH(10), }}>
                        <Text style={{ marginLeft: SW(35), fontSize: SF(48), color: colors.white, textAlign: "center", fontWeight: "700", fontFamily: getInterBoldFont() }}>₹{fund}</Text>
                        <TouchableOpacity onPress={() => getFundsApi(broker, accessToken)} disabled={isFundLoading}>
                            <Image source={images.refresh} style={{ width: SH(30), height: SH(30), resizeMode: "contain", tintColor: colors.white, marginLeft: SW(15) }} />
                        </TouchableOpacity>
                    </View>

                    <Text style={{ fontSize: SF(21), color: colors.white, textAlign: "center", marginTop: SH(5), fontWeight: "600", fontFamily: getRegularFont() }}>Unused Funds</Text>
                    <Text style={{ fontSize: SF(25), color: colors.white, textAlign: "center", marginTop: SH(5), fontWeight: "600", fontFamily: getSemiBoldFont() }}>₹{unusedFund}</Text>

                </View> :
                    <View>
                        <Text style={{ fontSize: SF(20), color: colors.white, textAlign: "center", marginTop: SH(0), fontWeight: "600", fontFamily: getRegularFont() }}>Do Broker login to see your portfolio</Text>
                        <Pressable onPress={() => navigation.navigate(RouteNames.SELECTBROKERSCREEN)}
                            style={{ backgroundColor: "transparent", paddingVertical: SH(18.5), paddingHorizontal: SW(30), borderRadius: 15, flexDirection: "row", alignItems: "center", alignSelf: "center", marginVertical: SH(15) }}>
                            <Text style={{ fontSize: SF(22), color: colors.white, textAlign: "center", fontWeight: "700", fontFamily: getInterRegularFont(), textDecorationLine: "underline" }}>Broker Login</Text>
                        </Pressable>
                    </View>}

            </LinearGradient>

            <View style={{ backgroundColor: colors.themeBackground, flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "center", marginTop: SH(-15), marginHorizontal: SW(51) }}>
                    <Pressable style={{ backgroundColor: "#0E0422", paddingVertical: SH(18.5), paddingHorizontal: SW(30), borderRadius: 15, flexDirection: "row", alignItems: "center", flex: 1 }}>
                        <Image source={images.download} style={{ width: SH(25), height: SH(25), resizeMode: "contain" }} />
                        <Text style={{ fontSize: SF(16), color: colors.white, textAlign: "center", fontWeight: "700", marginLeft: SW(15), fontFamily: getInterRegularFont() }}>Portfolio</Text>
                    </Pressable>
                    <View style={{ margin: 5 }} />
                    <Pressable style={{ backgroundColor: "#0E0422", paddingVertical: SH(18.5), paddingHorizontal: SW(30), borderRadius: 15, flexDirection: "row", alignItems: "center", flex: 1 }}>
                        <Image source={images.chat} style={{ width: SH(25), height: SH(25), resizeMode: "contain" }} />
                        <Text style={{ fontSize: SF(16), color: colors.white, textAlign: "center", fontWeight: "700", marginLeft: SW(15), fontFamily: getInterRegularFont() }}>Ask AI</Text>
                    </Pressable>
                </View>
                {/* <ScrollView nestedScrollEnabled={true}> */}
                {/* today's recommendation text */}
                <View style={{ alignItems: "center", marginHorizontal: SW(16), flexDirection: "row", justifyContent: "center", marginTop: SH(20), }}>
                    <Text style={{ fontSize: SF(22), color: colors.white, textAlign: "center", fontFamily: getInterBoldFont() }}>Today’s Recommendations</Text>
                    <TouchableOpacity onPress={() => getBasketsApi()} disabled={isLoading}>
                        <Image source={images.refresh} style={{ width: SH(30), height: SH(30), resizeMode: "contain", tintColor: colors.white, marginLeft: SW(15) }} />
                    </TouchableOpacity>
                </View>
                {/* end of today's recommendation text */}

                {/* recommendation view */}
                <View style={{ height: 250, backgroundColor: "rgba(255, 255, 255, 0.25)", borderRadius: 30, paddingHorizontal: SW(17), paddingVertical: SH(19), marginHorizontal: SW(20), marginTop: SH(20) }}>

                    <FlatList data={basketsList} style={{}}
                        ItemSeparatorComponent={<View style={{ margin: 5 }} />}
                        renderItem={({ item }) => (
                            <LinearGradient colors={["rgba(196, 38, 255, 0.38)", "rgba(57, 31, 220, 0.38)"]}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={{ borderRadius: 10, paddingHorizontal: SW(15), paddingTop: SH(7), paddingBottom: SH(14) }}>

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: SF(22), color: colors.white, flex: 1, fontFamily: getRegularFont() }}>{item.instrument_display_name}</Text>
                                    <Text style={{ fontSize: SF(22), color: item.percentage_color, fontFamily: getRegularFont() }}>{item.plus_minus} {item.percentage}%</Text>
                                </View>
                                <View style={{ marginTop: SH(22), flexDirection: "row", }}>
                                    <View style={{ flex: 1, alignItems: "flex-start" }}>
                                        <View>
                                            <Text style={{ fontSize: SF(17), color: colors.white, textAlign: "center", fontFamily: getRegularFont() }}>{"Buy"}</Text>
                                            <Text style={{ fontSize: SF(17), color: colors.white, textAlign: "center", fontFamily: getRegularFont() }}>₹ {item.recommended_price}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, alignItems: "center" }}>
                                        <View>
                                            <Text style={{ fontSize: SF(17), color: colors.white, textAlign: "center", fontFamily: getRegularFont() }}>{"Stop Loss"}</Text>
                                            <Text style={{ fontSize: SF(17), color: colors.white, textAlign: "center", fontFamily: getRegularFont() }}>₹ {item.stop_loss}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                                        <View>
                                            <Text style={{ fontSize: SF(17), color: colors.white, textAlign: "center", fontFamily: getRegularFont() }}>{"Target"}</Text>
                                            <Text style={{ fontSize: SF(17), color: colors.white, textAlign: "center", fontFamily: getRegularFont() }}>₹ {item.target_1}</Text>
                                        </View>
                                    </View>
                                </View>

                            </LinearGradient>
                        )}
                        ListEmptyComponent={<View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
                            <Text style={{ fontSize: SF(20), color: colors.white, fontFamily: getInterRegularFont() }}>No recommendation found.</Text>
                        </View>}
                    />


                    <View style={{ marginTop: SH(30), marginHorizontal: SW(16) }}>
                        <Text style={{ fontSize: SF(17), color: colors.white, fontFamily: getRegularFont() }}>
                            On executing this basket, buy orders along with stop loss and targets will be placed.
                        </Text>
                    </View>
                </View>
                {/* end of recommendation view */}

                {/* execute button */}

                {/* <TouchableOpacity onPress={async () => {
                    // const broker_token = await getSession(BROKER_TOKEN);
                    // if (broker_token != null) {
                    //     executeBasketApi()
                    // } else {
                    //     navigation.navigate(RouteNames.SELECTBROKERSCREEN);
                    // }

                }}
                    style={{ borderRadius: 38, backgroundColor: "rgba(255, 255, 255, 0.55)", flexDirection: "row", alignSelf: "center", alignItems: "center", marginTop: SH(18), marginBottom: SH(20) }}> */}
                <Swipeable
                    ref={swipeableRef}  // Attach the ref to Swipeable
                    renderLeftActions={renderSwipeableAction}  // Right swipeable action
                    onSwipeableLeftOpen={handleSwipeOpen}  // Called when swipe is fully opened
                    onSwipeableClose={handleSwipeClose}  // Reset fade animation when swipe closes
                    friction={2}  // Higher friction makes the swipe slower and smoother
                    overshootFriction={8}  // Slows down the overshoot for a smoother finish
                    overshootLeft={false}  // Disable overshoot animation to avoid "bouncy" effect
                    containerStyle={{ borderRadius: 38, backgroundColor: "rgba(255, 255, 255, 0.55)", flexDirection: "row", alignSelf: "center", alignItems: "center", marginTop: SH(18), marginBottom: SH(20), width: "50%", }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ width: SW(60), height: SH(60), backgroundColor: colors.white, borderWidth: 2, borderRadius: 360, borderColor: colors.themeBlue, padding: SH(10) }}>
                            <Image source={images.execute} style={{ width: SW(35), height: SH(35), resizeMode: "contain", tintColor: colors.themeBackground }} />
                        </View>
                        <Text style={{ fontSize: SF(16), color: colors.themeBlue, marginLeft: SW(10), marginRight: SW(59), textTransform: 'uppercase', fontFamily: getSemiBoldFont() }}>Swipe to Execute</Text>
                    </View>
                </Swipeable>
                {/* </TouchableOpacity> */}
                {/* end of execute view */}
                {/* </ScrollView> */}
            </View>


        </SafeAreaView>
    );
}

export default DashboardScreen2;