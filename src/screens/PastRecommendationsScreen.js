import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Pressable, Image, Text, TouchableOpacity, FlatList, ActivityIndicator, Modal, Dimensions, } from 'react-native';
import { colors } from '../utils/colors';
import { SF, SH, SW } from '../utils/dimensions';
import { getInterRegularFont, getMediumFont, getRegularFont, getSemiBoldFont, } from '../utils/Fonts';
import images from '../images';
import { RouteNames } from '../navigators/RouteNames';
import { BROKER, BROKER_TOKEN, getSession, LOGIN_TOKEN, TOKEN_TYPE } from '../utils/LocalStorage';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { BASKETS, BASKETS_LTP } from '../utils/API';
import { alertDialogDisplay, CustomConsole } from '../utils/Functions';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { progressView } from '../utils/components';
import { useIsFocused } from '@react-navigation/native';

function PastRecommendationsScreen({ route, navigation }) {

    const [accessToken, setAccessToken] = useState(null);
    const [broker, setBroker] = useState(null);
    const [isLoading, setIsLoading] = useState("");
    const [basketsList, setBasketsList] = useState([]);
    const [farmerDetailsModalVisible, setFarmerDetailsModalVisible] = useState(false);

    const [date, setDate] = useState(new Date(Date.now()));

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        getBasketsApi(moment(currentDate).format("YYYY-MM-DD"));
        setFarmerDetailsModalVisible(false)
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const focused = useIsFocused();

    useEffect(() => {
        setBasketsList([]);
        getSessionData();
    }, [focused]);

    // get session data method
    const getSessionData = async () => {
        try {
            const accessToken = await getSession(BROKER_TOKEN);
            const broker = await getSession(BROKER);
            setAccessToken(accessToken);
            setBroker(broker);
            getBasketsApi('');
        } catch (error) {

        }
    };

    // // get baskets api call
    // async function getBasketsApi(date) {
    //     try {

    //         const login_token_type = await getSession(TOKEN_TYPE);
    //         const login_token = await getSession(LOGIN_TOKEN);
    //         const accessToken = await getSession(BROKER_TOKEN);

    //         const myHeaders = new Headers();
    //         myHeaders.append("Accept", "application/json");
    //         myHeaders.append("Content-Type", "application/json");

    //         var raw

    //         if (date != "") {

    //             // Parse the provided date string into a Date object
    //             let startDate = new Date(date);

    //             // Create the next day's date
    //             let endDate = new Date(startDate);
    //             endDate.setDate(startDate.getDate() + 1);

    //             console.log("end date: " + moment(endDate).format('YYYY-MM-DD'));

    //             raw = JSON.stringify({
    //                 "filters": [
    //                     {
    //                         "field": "start_datetime",
    //                         "values": [
    //                             date
    //                         ]
    //                     }
    //                     // ,
    //                     // {
    //                     //     "field": "end_datetime",
    //                     //     "values": [
    //                     //         moment(endDate).format('YYYY-MM-DD')
    //                     //     ]
    //                     // }
    //                 ]
    //             });
    //         } else {
    //             raw = JSON.stringify({
    //                 "filters": []
    //             });

    //         }

    //         const requestOptions = {
    //             method: "POST",
    //             headers: myHeaders,
    //             body: raw,
    //             redirect: "follow"
    //         };

    //         CustomConsole("BASKETS");
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
    //                 CustomConsole(result.response_body);

    //                 basketsList.length = 0;

    //                 console.log(result.response_body.hydrated_basket_list)
    //                 // if(result.response_body.hydrated_basket_list[0]){
    //                 //     for (let i = 0; i < result.response_body.hydrated_basket_list[0].recommendation_list.length; i++) {
    //                 //         basketsList.push(result.response_body.hydrated_basket_list[0].recommendation_list[i])
    //                 //     }
    //                 // }
    //                 if (result.response_body.hydrated_basket_list) {

    //                     for (let j = 0; j < result.response_body.hydrated_basket_list.length; j++) {
    //                         // console.log(result.response_body.hydrated_basket_list[j]);
    //                         var recommendation_list = [];
    //                         if (result.response_body.hydrated_basket_list[j].recommendation_list.length != 0) {
    //                             for (let i = 0; i < result.response_body.hydrated_basket_list[j].recommendation_list.length; i++) {
    //                                 console.log(result.response_body.hydrated_basket_list[j].recommendation_list[i]);
    //                                 // Fetch LTP for each basket
    //                                 const ltp = await fetchBasketLTP(result.response_body.hydrated_basket_list[j].recommendation_list[i], login_token_type, login_token, accessToken);

    //                                 // // Check if ltp was successfully fetched
    //                                 if (ltp !== null) {

    //                                     const input = result.response_body.hydrated_basket_list[j].recommendation_list[i].recommended_price;
    //                                     const parts = input.split("-");
    //                                     // const secondPart = parts[1];
    //                                     const firstPart = parts[0];
    //                                     console.log("secondPart==>" + firstPart);

    //                                     recommendation_list.push({
    //                                         ltp: ltp,
    //                                         // percentage: (((parseFloat(result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) - parseFloat(ltp)) / result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) * 100).toFixed(2),
    //                                         // plus_minus: (((parseFloat(result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) - parseFloat(ltp)) / result.response_body.hydrated_basket_list[0].recommendation_list[i].target_1) * 100) >= 0 ? "+" : "-",

    //                                         // percentage: (((parseFloat(secondPart) - parseFloat(ltp)) / parseFloat(ltp)) * 100).toFixed(2),
    //                                         // plus_minus: (((parseFloat(secondPart) - parseFloat(ltp)) / parseFloat(ltp)) * 100) >= 0 ? "+" : "",
    //                                         // percentage_color: (((parseFloat(secondPart) - parseFloat(ltp)) / parseFloat(ltp)) * 100) >= 0 ? "#32B22E" : "red",

    //                                         percentage: (((parseFloat(ltp) - parseFloat(firstPart)) / parseFloat(firstPart)) * 100).toFixed(2),
    //                                         plus_minus: (((parseFloat(ltp) - parseFloat(firstPart)) / parseFloat(firstPart)) * 100) >= 0 ? "+" : "",
    //                                         percentage_color: (((parseFloat(ltp) - parseFloat(firstPart)) / parseFloat(firstPart)) * 100) >= 0 ? "#32B22E" : "red",
    //                                         instrument_display_name: result.response_body.hydrated_basket_list[j].recommendation_list[i].instrument_display_name,
    //                                         recommended_action: result.response_body.hydrated_basket_list[j].recommendation_list[i].recommended_action,
    //                                         exchange: result.response_body.hydrated_basket_list[j].recommendation_list[i].exchange,
    //                                         stop_loss: result.response_body.hydrated_basket_list[j].recommendation_list[i].stop_loss,
    //                                         target_1: result.response_body.hydrated_basket_list[j].recommendation_list[i].target_1,
    //                                         recommended_price: result.response_body.hydrated_basket_list[j].recommendation_list[i].recommended_price,
    //                                         _id: result.response_body.hydrated_basket_list[j].recommendation_list[i]._id,
    //                                         timestamp: result.response_body.hydrated_basket_list[j].recommendation_list[i].timestamp,
    //                                         source_id: result.response_body.hydrated_basket_list[j].recommendation_list[i].source_id,
    //                                         recommendation_type: result.response_body.hydrated_basket_list[j].recommendation_list[i].recommendation_type,
    //                                         instrument_code: result.response_body.hydrated_basket_list[j].recommendation_list[i].instrument_code,
    //                                         target_2: result.response_body.hydrated_basket_list[j].recommendation_list[i].target_2,
    //                                         target_3: result.response_body.hydrated_basket_list[j].recommendation_list[i].target_3,
    //                                         is_ongoing: result.response_body.hydrated_basket_list[j].recommendation_list[i].is_ongoing,
    //                                         trade_duration: result.response_body.hydrated_basket_list[j].recommendation_list[i].trade_duration,



    //                                     });
    //                                 }

    //                             }
    //                             basketsList.push({
    //                                 recommendation_list: recommendation_list,
    //                                 created_at: moment(result.response_body.hydrated_basket_list[j].basket.created_at).format('DD MMM, YYYY'),
    //                                 is_ongoing: result.response_body.hydrated_basket_list[j].basket.is_ongoing,
    //                                 trade_duration: result.response_body.hydrated_basket_list[j].basket.trade_duration,
    //                             });
    //                         }



    //                     }
    //                 }

    //                 setBasketsList(basketsList);
    //                 CustomConsole("basketsList: ");
    //                 CustomConsole(basketsList)
    //                 setIsLoading(false);
    //                 //setBasketsList(result.response_body.hydrated_basket_list[0].recommendation_list[0])
    //             })
    //             .catch((error) => {
    //                 setBasketsList([]);
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

    //     CustomConsole(BASKETS_LTP);
    //     CustomConsole(raw_ltp);

    //     try {
    //         const response_ltp = await fetch(BASKETS_LTP, requestOptions_ltp);
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

    //         return result_ltp.response_body[0].ltp;
    //     } catch (error) {
    //         CustomConsole("Get LTP api exception: " + error);
    //         return null; // Return null if error occurs
    //     }
    // };

    async function getBasketsApi(date) {
        try {
            const login_token_type = await getSession(TOKEN_TYPE);
            const login_token = await getSession(LOGIN_TOKEN);
            const accessToken = await getSession(BROKER_TOKEN);

            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");

            let raw;
            if (date) {
                let startDate = new Date(date);
                let endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 1);

                raw = JSON.stringify({
                    "filters": [{
                        "field": "start_datetime", "values": [date]
                    }, {
                        "field": "end_datetime", "values": [moment(endDate).format('YYYY-MM-DD')]
                    }]
                });
            } else {
                raw = JSON.stringify({ "filters": [] });
            }

            // console.log("API===> ", BASKETS);
            // console.log("raw===> ", raw);
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            setIsLoading(true);
            const response = await fetch(BASKETS, requestOptions);
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);

            const result = await response.json();
            const hydratedBasketList = result.response_body.hydrated_basket_list;

            if (!hydratedBasketList) return;

            // console.log("baskets", hydratedBasketList);

            // Flatten all recommendations for a single LTP call
            let allRecommendations = hydratedBasketList.flatMap(basket => basket.recommendation_list);
            const ltps = await fetchBasketLTP(allRecommendations, login_token_type, login_token, accessToken);
            // console.log("ltps=> ", ltps);

            const updatedBasketsList = hydratedBasketList
                .filter(basket => basket.recommendation_list.length > 0) // Only include baskets with non-empty recommendation_list
                .map((basket, j) => ({
                    recommendation_list: basket.recommendation_list.map((recommendation, i) => {
                        // const ltp = ltps.find(element => element == recommendation.instrument_code);
                        const ltp = ltps[recommendation.instrument_code];
                        const recommendedPrice = parseFloat(recommendation.recommended_price.split("-")[0]);
                        // console.log("ltp==>", (ltps), "single ltp=>", typeof (ltp));
                        // console.log("0==>", (ltp))
                        // console.log("1==>", (ltp - recommendedPrice))
                        // console.log("2==>", (((ltp - recommendedPrice) / recommendedPrice)))
                        // console.log("3==>", (((ltp - recommendedPrice) / recommendedPrice) * 100))

                        return {
                            ...recommendation,
                            ltp: ltp,
                            percentage: (((ltp - recommendedPrice) / recommendedPrice) * 100).toFixed(2),
                            plus_minus: ((ltp - recommendedPrice) >= 0) ? "+" : "",
                            percentage_color: ((ltp - recommendedPrice) >= 0) ? "#32B22E" : "red",
                        };
                    }),
                    created_at: moment(basket.basket.created_at).format('DD MMM, YYYY'),
                    is_ongoing: basket.basket.is_ongoing,
                    trade_duration: basket.basket.trade_duration,
                }));

            setBasketsList(updatedBasketsList);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            CustomConsole("Get baskets API error: " + error);
        }
    }

    // Fetch LTPs for an array of recommendations
    const fetchBasketLTP = async (recommendations, login_token_type, login_token, accessToken) => {
        // console.log(recommendations)
        const myHeaders_ltp = new Headers();
        myHeaders_ltp.append("Accept", "application/json");
        myHeaders_ltp.append("Content-Type", "application/json");
        // myHeaders_ltp.append("Authorization", login_token_type + " " + login_token);
        // myHeaders_ltp.append("x-broker-access-token", accessToken);

        // const requestBody = recommendations.map(rec => ({
        //     "stock_symbol": rec.instrument_display_name,
        //     "exchange": rec.exchange,
        //     "segment": "EQUITY",
        //     "stock_token": rec.instrument_code
        // }));
        const requestBody = Object.values(recommendations).map(symbol => symbol.instrument_code);

        // console.log("requestBody=> ", requestBody);

        const requestOptions_ltp = {
            method: "POST",
            headers: myHeaders_ltp,
            body: JSON.stringify({
                "tokens": requestBody
            }),
            redirect: "follow"
        };

        try {
            const response_ltp = await fetch(BASKETS_LTP, requestOptions_ltp);
            if (!response_ltp.ok) throw new Error(`HTTP status ${response_ltp.status}`);

            const result_ltp = await response_ltp.json();
            // console.log("Response body==> ", result_ltp)
            // return result_ltp.response_body; // Array of LTPs
            return result_ltp; // Array of LTPs
        } catch (error) {
            CustomConsole("Get LTP API exception: " + error);
            return []; // Return empty array if error occurs
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.themeBackground }}>

            <View style={{ flex: 1, justifyContent: "center" }}>

                {/* today's recommendation text */}
                <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: SW(30), marginTop: SH(33), justifyContent: "space-between" }}>
                    <View style={{ width: SH(30), height: SH(30) }} />
                    <Text style={{ fontSize: SF(22), color: colors.white, textAlign: "center", }}>Past Trades</Text>
                    <TouchableOpacity onPress={() => setFarmerDetailsModalVisible(true)}>
                        <Image source={images.filter} style={{ width: SH(30), height: SH(30), resizeMode: "contain" }} />
                    </TouchableOpacity>
                </View>
                {/* end of today's recommendation text */}



                {/* <View style={{ height: 350, backgroundColor: "rgba(255, 255, 255, 0.25)", borderRadius: 30, paddingHorizontal: SW(17), paddingVertical: SH(19), marginHorizontal: SW(20), marginTop: SH(40) }}> */}
                {/* {accessToken != null ? */}
                {isLoading ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ borderRadius: 10, padding: 25 }}>
                            <Text style={{ fontSize: SF(15), color: colors.white, fontWeight: "300" }}>Loading</Text>
                            <ActivityIndicator size="large" color={colors.white} />
                        </View>
                    </View>
                    :
                    <FlatList data={basketsList} style={{ marginTop: SH(20) }}
                        ItemSeparatorComponent={<View style={{ margin: 10 }} />}
                        keyExtractor={({ item, index }) => index}
                        renderItem={({ item }) => (
                            <View key={item} style={{ backgroundColor: "rgba(255, 255, 255, 0.25)", borderRadius: 30, paddingHorizontal: SW(17), paddingVertical: SH(19), marginHorizontal: SW(20), }}>
                                <Text style={{ fontSize: SF(17), color: colors.white, fontFamily: getRegularFont(), marginBottom: SH(10) }}>{"Date: " + item.created_at}</Text>

                                {item.recommendation_list.map((recommendation) => (
                                    <LinearGradient key={recommendation}
                                        colors={["rgba(196, 38, 255, 0.38)", "rgba(57, 31, 220, 0.38)"]}
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        style={{ borderRadius: 10, paddingHorizontal: SW(15), paddingTop: SH(7), paddingBottom: SH(14), marginBottom: SH(5) }}>

                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <Text style={{ fontSize: SF(22), color: colors.white, flex: 1, fontFamily: getRegularFont() }}>{recommendation.instrument_display_name}</Text>
                                            <Text style={{ fontSize: SF(22), color: recommendation.percentage_color, fontFamily: getRegularFont() }}>{recommendation.plus_minus} {recommendation.percentage}%</Text>
                                        </View>
                                        <View style={{ marginTop: SH(22), flexDirection: "row", }}>
                                            <View style={{ flex: 1, alignItems: "flex-start" }}>
                                                <View>
                                                    <Text style={{ fontSize: SF(17), color: colors.white, textAlign: "center", fontFamily: getRegularFont() }}>{"Buy"}</Text>
                                                    <Text style={{ fontSize: SF(17), color: colors.white, textAlign: "center", fontFamily: getRegularFont() }}>₹ {recommendation.recommended_price}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, alignItems: "center" }}>
                                                <View>
                                                    <Text style={{ fontSize: SF(17), color: colors.white, textAlign: "center", fontFamily: getRegularFont() }}>{"Stop Loss"}</Text>
                                                    <Text style={{ fontSize: SF(17), color: colors.white, textAlign: "center", fontFamily: getRegularFont() }}>₹ {recommendation.stop_loss}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, alignItems: "flex-end" }}>
                                                <View>
                                                    <Text style={{ fontSize: SF(17), color: colors.white, textAlign: "center", fontFamily: getRegularFont() }}>{"Target"}</Text>
                                                    <Text style={{ fontSize: SF(17), color: colors.white, textAlign: "center", fontFamily: getRegularFont() }}>₹ {recommendation.target_1}</Text>
                                                </View>
                                            </View>
                                        </View>

                                    </LinearGradient>
                                ))}
                            </View>
                        )}
                        ListEmptyComponent={<View style={{ alignItems: "center", flex: 1, justifyContent: "center", marginTop: SH(Dimensions.get("window").height / 2) }}>
                            <Text style={{ fontSize: SF(20), color: colors.white, fontFamily: getInterRegularFont() }}>No trades are found.</Text>
                        </View>}
                    />
                }

                {/* :
                        <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
                            <Text style={{ fontSize: SF(20), color: colors.white, fontFamily: getInterRegularFont() }}>Please login with broker</Text>

                            <TouchableOpacity onPress={async () => {
                                navigation.navigate(RouteNames.SELECTBROKERSCREEN);
                            }}
                                style={{ borderRadius: 38, backgroundColor: "rgba(255, 255, 255, 0.55)", flexDirection: "row", alignSelf: "center", alignItems: "center", marginTop: SH(18), paddingVertical: SH(10), paddingHorizontal: SW(15) }}>
                                <Text style={{ fontSize: SF(18), color: colors.themeBlue, textTransform: 'uppercase', fontFamily: getSemiBoldFont() }}>Login with broker</Text>
                            </TouchableOpacity>
                        </View>} */}
                {/* <View style={{ marginTop: SH(30), marginHorizontal: SW(16) }}>
                        <Text style={{ fontSize: SF(17), color: colors.white, fontFamily: getRegularFont() }}>
                            On executing this basket, buy orders along with stop loss and targets will be placed.
                        </Text>
                    </View>
                </View> */}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={farmerDetailsModalVisible}
                onRequestClose={() => {
                    setFarmerDetailsModalVisible(!farmerDetailsModalVisible);
                }}
            >
                <View
                    style={{
                        flex: 1,
                        // backgroundColor: '#00000080',
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
                                <Text style={{ fontSize: SF(22), color: colors.white, textAlign: "center", }}>Filters</Text>

                                <Pressable onPress={() => setFarmerDetailsModalVisible(false)}
                                    style={{ alignSelf: "flex-end", marginRight: SH(10), marginTop: SH(10), padding: 5, }}>
                                    <Image source={images.close} style={{ width: SH(24), height: SH(24), resizeMode: "contain" }} />
                                </Pressable>
                            </View>

                            <TouchableOpacity onPress={showDatepicker}
                                style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.white, paddingVertical: SH(10), alignSelf: "center", paddingHorizontal: SW(20), borderRadius: 8, marginTop: SH(24), marginBottom: SH(50) }}>
                                <Text style={{ fontSize: SF(22), color: colors.black, textAlign: "center", }}>{moment(date).format('DD-MM-YYYY')}</Text>
                                <Text style={{ fontSize: SF(22), color: colors.black, textAlign: "center", marginLeft: SW(5) }}>{"(" + moment(date).format('dddd') + ")"}</Text>
                                <Image source={images.down_arrow} style={{ width: SH(15), height: SH(15), resizeMode: "contain", marginLeft: SW(10) }} />
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>

            </Modal>

        </SafeAreaView>
    );
}

export default PastRecommendationsScreen;