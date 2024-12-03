//pin: 3568 24 - hour expire

import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Pressable, Image, Text, FlatList, ScrollView, TouchableOpacity, Alert, BackHandler, } from 'react-native';
import { colors } from '../utils/colors';
import { SF, SH, SW } from '../utils/dimensions';
import { getInterBoldFont, getInterRegularFont, getMediumFont, getRegularFont, getSemiBoldFont, getSyneRegularFont, } from '../utils/Fonts';
import images from '../images';
import { RouteNames } from '../navigators/RouteNames';
import { BROKER, BROKER_TOKEN, getSession, LOGIN_TOKEN, TOKEN_TYPE } from '../utils/LocalStorage';
import LinearGradient from 'react-native-linear-gradient';
import { BASKETS, BASKETS_LTP, BROKER_GET_FUNDS, BUY_ORDER, FETCH_QTY } from '../utils/API';
import { alertDialogDisplay, CustomConsole } from '../utils/Functions';
import { externalStyles } from '../utils/style';
import { APP_NAME } from '../utils/string';
import moment from 'moment';
import { Swipeable } from 'react-native-gesture-handler';
import { progressView } from '../utils/components';
import { useIsFocused } from '@react-navigation/native';

function AddOrderScreen({ route, navigation }) {

    const [accessToken, setAccessToken] = useState(null);
    const [broker, setBroker] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fund, setFund] = useState(0);
    const [unusedFund, setUnusedFund] = useState(0);
    const [basketsList, setBasketsList] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const focused = useIsFocused();

    function formatIndianNumber(number) {
        const [integerPart, decimalPart] = number.toString().split(".");
        let lastThree = integerPart.slice(-3);
        let otherNumbers = integerPart.slice(0, -3);

        if (otherNumbers !== "") {
            lastThree = "," + lastThree;
        }
        const result =
            otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

        return decimalPart ? result + "." + decimalPart : result;
    }

    useEffect(() => {
        getSessionData()
    }, []);

    // get session data method
    const getSessionData = async () => {
        const access_token = await getSession(BROKER_TOKEN);
        const stored_broker = await getSession(BROKER);
        setAccessToken(access_token);
        setBroker(stored_broker);
        getFundsApi(stored_broker, access_token);
        getBasketsApi();
    };

    // get funds from broker
    async function getFundsApi(broker, access_token) {
        try {

            // const broker_token = await getSession(BROKER_TOKEN);
            // if (broker_token == null) {

            // }else{

            // }

            console.log("Addorderscreen broker==>",broker);
            console.log("Addorderscreen access_token==>",access_token);

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
            fetch(BROKER_GET_FUNDS + broker, requestOptions)
                .then((response) => {
                    console.log("Response===>",response)
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
                    setFund(result.response_body.portfolio_value);
                    console.log("IN Add order 123==>")

                    setUnusedFund(result.response_body.available_balance);
                    console.log("IN Add order 456==>")

                    // setErrorMessage(null); // Clear error on success
                })
                .catch((error) => {
                    console.log("IN Add order===>789")
                    CustomConsole("Get funds api exception: " + error);
                });

        } catch (error) {
            console.log("IN Add order===>91011")
            setIsLoading(false);
            CustomConsole("Get funds api error: " + error);
        }
    }

    // // get baskets api call
    // async function getBasketsApi() {
    //     try {

    //         const login_token_type = await getSession(TOKEN_TYPE);
    //         const login_token = await getSession(LOGIN_TOKEN);
    //         const accessToken = await getSession(BROKER_TOKEN);

    //         const myHeaders = new Headers();
    //         myHeaders.append("Accept", "application/json");
    //         myHeaders.append("Content-Type", "application/json");

    //         const raw = JSON.stringify({
    //             // "client_id": "string",
    //             // "request_id": "string",
    //             "filters": [
    //                 {
    //                     "field": "start_datetime",
    //                     "values": [
    //                         moment().format("YYYY-MM-DD")
    //                         // "2024-10-11"
    //                     ]
    //                 }
    //             ]
    //         });
    //         const requestOptions = {
    //             method: "POST",
    //             headers: myHeaders,
    //             body: raw,
    //             redirect: "follow"
    //         };

    //         CustomConsole(BASKETS);
    //         CustomConsole(raw);
    //         setIsLoading(true);
    //         fetch(BASKETS, requestOptions)
    //             .then((response) => {
    //                 if (!response.ok) {
    //                     if (response.status === 400) {
    //                         // Parse the response to extract the error details
    //                         return response.json().then((data) => {
    //                             alertDialogDisplay("", data.detail); // Set the 'detail' message from the response
    //                         });
    //                     }
    //                     throw new Error("HTTP status " + response.status);
    //                 }
    //                 return response.json();
    //             })
    //             .then(async (result) => {
    //                 CustomConsole("in result");
    //                 CustomConsole(result);

    //                 basketsList.length = 0;

    //                 var total_amt = 0;

    //                 if (result.response_body.hydrated_basket_list[0]) {

    //                     for (let i = 0; i < result.response_body.hydrated_basket_list[0].recommendation_list.length; i++) {
    //                         // for (let i = 0; i < 1; i++) {
    //                         console.log(result.response_body.hydrated_basket_list[0].recommendation_list[i])
    //                         // Fetch LTP for each basket
    //                         const { ltp, qty } = await fetchBasketLTP(result.response_body.hydrated_basket_list[0].recommendation_list[i], login_token_type, login_token, accessToken);

    //                         // Check if ltp was successfully fetched
    //                         if (ltp !== null) {
    //                             // basketsList.push({
    //                             //     ltp: ltp,
    //                             //     percentage: ((((260.46) - parseFloat(ltp)) / 260.46) * 100).toFixed(2),
    //                             //     plus_minus: ((((260.46) - parseFloat(ltp)) / 260.46) * 100) >= 0 ? "+" : "-",
    //                             //     percentage_color: (((parseFloat(260.46) - parseFloat(ltp)) / 260.46) * 100) >= 0 ? "#32B22E" : "red",
    //                             // });

    //                             const input = result.response_body.hydrated_basket_list[0].recommendation_list[i].recommended_price;
    //                             const parts = input.split("-");
    //                             const secondPart = parts[1];
    //                             console.log("secondPart==>" + secondPart);

    //                             basketsList.push({
    //                                 ltp: ltp,
    //                                 // percentage: (((parseFloat(result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) - parseFloat(ltp)) / result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) * 100).toFixed(2),
    //                                 // plus_minus: (((parseFloat(result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) - parseFloat(ltp)) / result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) * 100) >= 0 ? "+" : "-",
    //                                 percentage: (((parseFloat(secondPart) - parseFloat(ltp)) / parseFloat(ltp)) * 100).toFixed(2),
    //                                 plus_minus: (((parseFloat(secondPart) - parseFloat(ltp)) / parseFloat(ltp)) * 100) >= 0 ? "+" : "",
    //                                 percentage_color: (((parseFloat(secondPart) - parseFloat(ltp)) / parseFloat(ltp)) * 100) >= 0 ? "#32B22E" : "red",
    //                                 instrument_display_name: result.response_body.hydrated_basket_list[0].recommendation_list[i].instrument_display_name,
    //                                 recommended_action: result.response_body.hydrated_basket_list[0].recommendation_list[i].recommended_action,
    //                                 exchange: result.response_body.hydrated_basket_list[0].recommendation_list[i].exchange,
    //                                 stop_loss: result.response_body.hydrated_basket_list[0].recommendation_list[i].stop_loss,
    //                                 target_1: result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1,
    //                                 recommended_price: result.response_body.hydrated_basket_list[0].recommendation_list[i].recommended_price,
    //                                 _id: result.response_body.hydrated_basket_list[0].recommendation_list[i]._id,
    //                                 timestamp: result.response_body.hydrated_basket_list[0].recommendation_list[i].timestamp,
    //                                 source_id: result.response_body.hydrated_basket_list[0].recommendation_list[i].source_id,
    //                                 recommendation_type: result.response_body.hydrated_basket_list[0].recommendation_list[i].recommendation_type,
    //                                 instrument_code: result.response_body.hydrated_basket_list[0].recommendation_list[i].instrument_code,
    //                                 target_2: result.response_body.hydrated_basket_list[0].recommendation_list[i].target_2,
    //                                 target_3: result.response_body.hydrated_basket_list[0].recommendation_list[i].target_3,
    //                                 is_ongoing: result.response_body.hydrated_basket_list[0].recommendation_list[i].is_ongoing,
    //                                 trade_duration: result.response_body.hydrated_basket_list[0].recommendation_list[i].trade_duration,
    //                                 qty: qty,
    //                             });

    //                             total_amt = total_amt + (qty * parseFloat(ltp))
    //                         }

    //                         // basketsList.push(result.response_body.hydrated_basket_list[0].recommendation_list[i])
    //                         // basketsList.push({
    //                         //     ltp: ltp,
    //                         //     percentage: ((parseFloat(result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) - parseFloat(ltp)) / result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) * 100,
    //                         //     percentage_color: (((parseFloat(result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) - parseFloat(ltp)) / result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) * 100) >= 0 ? "#32B22E" : "red",
    //                         //     instrument_display_name: result.response_body.hydrated_basket_list[0].recommendation_list[i].instrument_display_name,
    //                         //     recommended_action: result.response_body.hydrated_basket_list[0].recommendation_list[i].recommended_action,
    //                         //     exchange: result.response_body.hydrated_basket_list[0].recommendation_list[i].exchange,
    //                         //     stop_loss: result.response_body.hydrated_basket_list[0].recommendation_list[i].stop_loss,
    //                         //     target_1: result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1,
    //                         //     recommended_price: result.response_body.hydrated_basket_list[0].recommendation_list[i].recommended_price,
    //                         // });

    //                     }
    //                 }
    //                 setBasketsList(basketsList);
    //                 CustomConsole("basketsList: ");
    //                 CustomConsole(basketsList);
    //                 setTotalAmount(total_amt);
    //                 setIsLoading(false);
    //                 //setBasketsList(result.response_body.hydrated_basket_list[0].recommendation_list[0])
    //             })
    //             .catch((error) => {
    //                 setIsLoading(false);
    //                 CustomConsole("Get baskets api exception: " + error);
    //             });

    //     } catch (error) {
    //         setIsLoading(false);
    //         CustomConsole("Get baskets api error: " + error);
    //     }
    // }

    // // get symbol ltp
    // const fetchBasketLTP = async (basket, login_token_type, login_token, accessToken) => {

    //     const myHeaders_ltp = new Headers();
    //     myHeaders_ltp.append("Accept", "application/json");
    //     myHeaders_ltp.append("Content-Type", "application/json");
    //     myHeaders_ltp.append("Authorization", login_token_type + " " + login_token);
    //     myHeaders_ltp.append("x-broker-access-token", accessToken);

    //     const raw_ltp = JSON.stringify([
    //         {
    //             "stock_symbol": basket.instrument_display_name,
    //             "exchange": basket.exchange,
    //             "segment": "EQUITY",
    //             "stock_token": basket.instrument_code
    //         }
    //     ]);

    //     const requestOptions_ltp = {
    //         method: "POST",
    //         headers: myHeaders_ltp,
    //         body: raw_ltp,
    //         redirect: "follow"
    //     };

    //     CustomConsole(FETCH_QTY);
    //     CustomConsole(raw_ltp);

    //     try {
    //         const response_ltp = await fetch(FETCH_QTY, requestOptions_ltp);
    //         if (!response_ltp.ok) {
    //             if (response_ltp.status === 400) {
    //                 const data = await response_ltp.json();
    //                 alertDialogDisplay("", data.detail); // Handle error display
    //             }
    //             throw new Error("HTTP status " + response_ltp.status);
    //         }
    //         const result_ltp = await response_ltp.json();
    //         CustomConsole("in result");
    //         CustomConsole(result_ltp);

    //         return { "ltp": result_ltp.response_body[0].ltp, "qty": result_ltp.response_body[0].quantity };
    //     } catch (error) {
    //         CustomConsole("Get LTP api exception: " + error);
    //         return null; // Return null if error occurs
    //     }
    // };

    // Modified getBasketsApi function
    async function getBasketsApi() {
        try {
            const login_token_type = await getSession(TOKEN_TYPE);
            const login_token = await getSession(LOGIN_TOKEN);
            const accessToken = await getSession(BROKER_TOKEN);

            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "filters": [
                    {
                        "field": "start_datetime",
                        "values": [
                            moment().format("YYYY-MM-DD")
                        ]
                    }
                ]
            });
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            setIsLoading(true);
            const response = await fetch(BASKETS, requestOptions);

            if (!response.ok) {
                if (response.status === 400) {
                    const data = await response.json();
                    alertDialogDisplay("", data.detail);
                }
                throw new Error("HTTP status " + response.status);
            }

            const result = await response.json();

            let total_amt = 0;
            let basketsList = [];

            if (result.response_body.hydrated_basket_list[0]) {
                const recommendationList = result.response_body.hydrated_basket_list[0].recommendation_list;

                // Fetch LTPs in one go
                const ltps = await fetchBasketLTP(recommendationList, login_token_type, login_token, accessToken);

                CustomConsole("ltps");
                CustomConsole(ltps);
                if (ltps) {
                    recommendationList.forEach((item, i) => {
                        const ltpData = ltps[i];
                        // console.log(ltpData)
                        if (ltpData && ltpData.ltp !== null) {
                            const input = item.recommended_price;
                            const secondPart = input.split("-")[1];

                            // console.log("QTY===>"+ltpData.quantity)
                            basketsList.push({
                                ltp: ltpData.ltp,
                                percentage: (((parseFloat(secondPart) - parseFloat(ltpData.ltp)) / parseFloat(ltpData.ltp)) * 100).toFixed(2),
                                plus_minus: (((parseFloat(secondPart) - parseFloat(ltpData.ltp)) / parseFloat(ltpData.ltp)) * 100) >= 0 ? "+" : "",
                                percentage_color: (((parseFloat(secondPart) - parseFloat(ltpData.ltp)) / parseFloat(ltpData.ltp)) * 100) >= 0 ? "#32B22E" : "red",
                                instrument_display_name: item.instrument_display_name,
                                recommended_action: item.recommended_action,
                                exchange: item.exchange,
                                stop_loss: item.stop_loss,
                                target_1: item.target_1,
                                recommended_price: item.recommended_price,
                                _id: item._id,
                                timestamp: item.timestamp,
                                source_id: item.source_id,
                                recommendation_type: item.recommendation_type,
                                instrument_code: item.instrument_code,
                                target_2: item.target_2,
                                target_3: item.target_3,
                                is_ongoing: item.is_ongoing,
                                trade_duration: item.trade_duration,
                                qty: ltpData.quantity,
                            });

                            total_amt += ltpData.quantity * parseFloat(ltpData.ltp);
                        }
                    });
                }
            }

            setBasketsList(basketsList);
            setTotalAmount(total_amt);
            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            CustomConsole("Get baskets api error: " + error);
        }
    }

    // Modified fetchBasketLTP function to accept an array
    const fetchBasketLTP = async (recommendationList, login_token_type, login_token, accessToken) => {
        const myHeaders_ltp = new Headers();
        myHeaders_ltp.append("Accept", "application/json");
        myHeaders_ltp.append("Content-Type", "application/json");
        myHeaders_ltp.append("Authorization", `${login_token_type} ${login_token}`);
        myHeaders_ltp.append("x-broker-access-token", accessToken);

        const raw_ltp = JSON.stringify(
            recommendationList.map(item => ({
                "stock_symbol": item.instrument_display_name,
                "exchange": item.exchange,
                "segment": "EQUITY",
                "stock_token": item.instrument_code
            }))
        );

        const requestOptions_ltp = {
            method: "POST",
            headers: myHeaders_ltp,
            body: raw_ltp,
            redirect: "follow"
        };

        try {
            const response_ltp = await fetch(FETCH_QTY, requestOptions_ltp);
            if (!response_ltp.ok) {
                if (response_ltp.status === 400) {
                    const data = await response_ltp.json();
                    alertDialogDisplay("", data.detail);
                }
                throw new Error("HTTP status " + response_ltp.status);
            }

            const result_ltp = await response_ltp.json();
            return result_ltp.response_body;
        } catch (error) {
            CustomConsole("Get LTP api exception: " + error);
            return null;
        }
    };

    // excute basket api call
    async function executeBasketApi() {
        try {

            if (totalAmount == 0) {
                alertDialogDisplay(APP_NAME, "Please change order quantity.")
            } else {

                setIsLoading(true);
                
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
                        "trading_symbol": basketsList[i].instrument_display_name,
                        "transaction_type": basketsList[i].recommended_action,
                        "exchange": basketsList[i].exchange,
                        "quantity": basketsList[i].qty,
                        "stop_loss": basketsList[i].stop_loss,
                        "target_1": basketsList[i].target_1,
                        "trigger_price_target": basketsList[i].target_1,
                        "trigger_price_stop_loss": basketsList[i].stop_loss,
                        "trading_token": basketsList[i].instrument_code,
                        "is_after_market": false,
                        "order_tag": "",
                    });
                }

                const raw = JSON.stringify({
                    "orders": orders,
                    "broker": broker,
                    "segment": "EQUITY"
                });

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
                                setIsLoading(false);
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
                        setIsLoading(false);
                        navigation.navigate(RouteNames.ORDERSUCCESSSCREEN);
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        CustomConsole("Execute api exception: " + error);
                    });

            }

        } catch (error) {
            setIsLoading(false);
            CustomConsole("Execute api error: " + error);
        }
    }

    const handlePress = async () => {
        const broker_token = await getSession(BROKER_TOKEN);
        if (broker_token != null) {
            if (basketsList.length > 0) {
                executeBasketApi();
            } else {

            }
        } else {
            navigation.navigate(RouteNames.SELECTBROKERSCREEN);
        }
    };

    // Swipeable Action Component
    const renderSwipeableAction = () => (
        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.55)', justifyContent: 'center' }}>
            <Text style={{ color: colors.white, padding: 20 }}></Text>
        </View>
    );

    // Function to increment the qty of a basket item
    const incrementQty = (id) => {
        const updatedBaskets = basketsList.map(basket => {
            if (basket._id === id) {
                return { ...basket, qty: basket.qty + 1 };
            }
            return basket;
        });
        setBasketsList(updatedBaskets);
    };

    // Function to decrement the qty of a basket item
    const decrementQty = (id) => {
        const updatedBaskets = basketsList.map(basket => {
            if (basket._id === id && basket.qty > 0) {
                return { ...basket, qty: basket.qty - 1 };
            }
            return basket;
        });
        setBasketsList(updatedBaskets);
    };


    // Calculate the total amount whenever the basket list is updated
    useEffect(() => {
        const total = basketsList.reduce((sum, basket) => {
            return sum + basket.qty * basket.ltp;
        }, 0);
        setTotalAmount(total);
    }, [basketsList]);

    return (
        <SafeAreaView style={externalStyles.mainContainer}>
            {/* header */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: SH(35), marginHorizontal: SW(35) }}>
                {/* back button */}
                <Pressable onPress={() => navigation.goBack()}
                    style={externalStyles.backButtonContainer2}>
                    <Image source={images.back_arrow} style={externalStyles.backArrowImage} />
                </Pressable>
                {/* end of back button */}

                {/* title */}
                <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.white, fontFamily: getInterBoldFont(), textAlign: "center" }}>Order Confirmation</Text>
                </View>
                {/* end of title */}
                <View style={{ width: SH(30) }} />
            </View>
            {/* end of header */}

            {isLoading ? progressView(isLoading) :
                <>
                    <View style={{ flex: 1 }}>
                        <FlatList data={basketsList} style={{ borderTopWidth: basketsList.length != 0 ? 0.5 : 0, borderTopColor: colors.white, marginTop: SH(44) }}
                            ItemSeparatorComponent={<View style={{ margin: 5 }} />}
                            renderItem={({ item }) => (
                                <View style={{ borderRadius: 10, paddingHorizontal: SW(15), paddingTop: SH(15), paddingBottom: SH(15), borderBottomWidth: 0.5, borderBottomColor: colors.white, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                                    <View style={{}}>
                                        <Text style={{ fontSize: SF(15), color: '#B9B9B9', flex: 1, fontFamily: getRegularFont() }}>LTP : ₹ {formatIndianNumber(parseFloat(item.ltp))}</Text>
                                        <Text style={{ fontSize: SF(22), color: colors.white, flex: 1, fontFamily: getRegularFont(), marginTop: SH(5) }}>{item.instrument_display_name}</Text>
                                        <Text style={{ fontSize: SF(15), color: '#B9B9B9', flex: 1, fontFamily: getRegularFont(), marginTop: SH(5) }}>Investment : ₹ {formatIndianNumber((parseFloat(item.ltp) * parseFloat(item.qty)).toFixed(2))}</Text>
                                    </View>
                                    <View>
                                        <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#5E5E5E", borderRadius: 15 }}>
                                            <Pressable onPress={() => decrementQty(item._id)}
                                                style={{ padding: SW(5) }}>
                                                <Text style={{ fontSize: SF(35), color: colors.white, fontFamily: getRegularFont(), marginHorizontal: SW(10) }}>{"-"}</Text>
                                            </Pressable>
                                            <Text style={{ fontSize: SF(24), color: colors.white, fontFamily: getRegularFont(), marginHorizontal: SW(10) }}>{item.qty}</Text>
                                            <Pressable onPress={() => incrementQty(item._id)}
                                                style={{ padding: SW(5) }}>
                                                <Text style={{ fontSize: SF(35), color: colors.white, fontFamily: getRegularFont(), marginHorizontal: SW(10) }}>{"+"}</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            )}
                            ListEmptyComponent={<View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
                                <Text style={{ fontSize: SF(20), color: colors.white, fontFamily: getInterRegularFont() }}>No recommendation found.</Text>
                            </View>}
                        />

                        <Text style={{ fontSize: SF(15), color: '#B9B9B9', fontFamily: getRegularFont(), marginHorizontal: SW(22), marginBottom: SH(31) }}>{"NOTE: Investment amount is auto-calculated. Please change if required."}</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: SW(35), marginBottom: SH(40) }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: SF(15), color: '#B9B9B9', fontFamily: getRegularFont() }}>{"Investment Amount (approx)"}</Text>
                            <Text style={{ fontSize: SF(24), color: '#B9B9B9', fontFamily: getRegularFont() }}>₹ {formatIndianNumber(totalAmount.toFixed(2))}</Text>
                        </View>
                        <TouchableOpacity onPress={executeBasketApi} disabled={isLoading}>
                            <LinearGradient colors={[colors.themeButtonColor1, colors.themeButtonColor2]}
                                style={{ borderRadius: 15, paddingVertical: SH(25), paddingHorizontal: SW(47) }}>
                                <Text style={externalStyles.buttonText}>Submit</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </>}





        </SafeAreaView>
    );
}

export default AddOrderScreen;