import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Pressable, Image, Text, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, } from 'react-native';
import { colors } from '../utils/colors';
import { SF, SH, SW } from '../utils/dimensions';
import { getInterRegularFont, getMediumFont, getRegularFont, getSemiBoldFont, } from '../utils/Fonts';
import images from '../images';
import { RouteNames } from '../navigators/RouteNames';
import { BROKER, BROKER_TOKEN, getSession, LOGIN_TOKEN, TOKEN_TYPE } from '../utils/LocalStorage';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { BASKETS, BASKETS_LTP, TRADE_HISTORY } from '../utils/API';
import { alertDialogDisplay, CustomConsole } from '../utils/Functions';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { progressView } from '../utils/components';
import { useIsFocused } from '@react-navigation/native';
import HistoryItem from '../components/HistoryItem';

function PastTradeHistory({ route, navigation }) {

    const [accessToken, setAccessToken] = useState(null);
    const [broker, setBroker] = useState(null);
    const [isLoading, setIsLoading] = useState("");
    const [basketsList, setBasketsList] = useState([]);
    // const [basketsList, setBasketsList] = useState([
    //     {
    //         "symbol": "TATAPOWER",
    //         "quantity": "100",
    //         "buy_price": "100",
    //         "sell_price": "200",
    //         "invest_amt": "30,745.52",
    //         "per": "+3.8%",
    //         "plus_amt": "+4000"
    //     },
    //     {
    //         "symbol": "ZENTEC",
    //         "quantity": "100",
    //         "buy_price": "100",
    //         "sell_price": "200",
    //         "invest_amt": "30,745.52",
    //         "per": "+3.8%",
    //         "plus_amt": "+4000"
    //     },
    //     {
    //         "symbol": "JIOFIN",
    //         "quantity": "100",
    //         "buy_price": "100",
    //         "sell_price": "200",
    //         "invest_amt": "30,745.52",
    //         "per": "+3.8%",
    //         "plus_amt": "+4000"
    //     },
    //     {
    //         "symbol": "TRENT",
    //         "quantity": "100",
    //         "buy_price": "100",
    //         "sell_price": "200",
    //         "invest_amt": "30,745.52",
    //         "per": "+3.8%",
    //         "plus_amt": "+4000"
    //     }
    // ]);
    const focused = useIsFocused();

    useEffect(() => {
        getSessionData();
    }, [focused]);

    // get session data method
    const getSessionData = async () => {
        try {
            const accessToken = await getSession(BROKER_TOKEN);
            const broker = await getSession(BROKER);
            setAccessToken(accessToken);
            setBroker(broker);
            getBasketsApi();
        } catch (error) {

        }
    };

    // // get baskets api call
    // async function getBasketsApi() {
    //     try {

    //         const login_token = await getSession(LOGIN_TOKEN);
    //         const login_token_type = await getSession(TOKEN_TYPE);

    //         const myHeaders = new Headers();
    //         myHeaders.append("Accept", "application/json");
    //         myHeaders.append("Content-Type", "application/json");
    //         myHeaders.append("Authorization", login_token_type + " " + login_token);

    //         const requestOptions = {
    //             method: "GET",
    //             headers: myHeaders,
    //             redirect: "follow"
    //         };

    //         CustomConsole(TRADE_HISTORY);

    //         setIsLoading(true);
    //         fetch(TRADE_HISTORY, requestOptions)
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

    //                 let total_amt = 0;
    //                 let basketsList = [];

    //                 for (let i = 0; i < result.length; i++) {

    //                     // Fetch LTP for each basket
    //                     const ltp = await fetchBasketLTP(result[i], login_token_type, login_token, accessToken);


    //                     basketsList.push({
    //                         "order_tag": result[i].order_tag,
    //                         "trading_symbol": result[i].trading_symbol,
    //                         "trading_token": result[i].trading_token,
    //                         "transaction_type": result[i].transaction_type,
    //                         "exchange": result[i].exchange,
    //                         "quantity": result[i].quantity,
    //                         "stop_loss": result[i].stop_loss,
    //                         "target_1": result[i].target_1,
    //                         "target_2": result[i].target_2,
    //                         "is_after_market": result[i].is_after_market,
    //                         "trigger_price_target": result[i].trigger_price_target,
    //                         "trigger_price_stop_loss": result[i].trigger_price_stop_loss,
    //                         "order_placement_status": result[i].order_placement_status,
    //                         "user_id": result[i].user_id,
    //                         "broker": result[i].broker,
    //                         "filled_shares": result[i].filled_shares,
    //                         "order_status": result[i].order_status,
    //                         "unfilled_shares": result[i].unfilled_shares,
    //                         "price": result[i].price,
    //                         "updated_at": result[i].updated_at,
    //                         "invest_amt": (parseFloat(result[i].price) * parseFloat(result[i].quantity)).toFixed(2),
    //                         "plus_amt": ((parseFloat(ltp) - parseFloat(result[i].price)) * parseFloat(result[i].quantity)).toFixed(2),
    //                         "plus_amt_plus_minus": ((parseFloat(ltp) - parseFloat(result[i].price)) * parseFloat(result[i].quantity)) >= 0 ? "+" : "",
    //                         "plus_amt_color": ((parseFloat(ltp) - parseFloat(result[i].price)) * parseFloat(result[i].quantity)) >= 0 ? "#32B22E" : "red",
    //                         "per": (((parseFloat(ltp) - parseFloat(result[i].price)) / parseFloat(result[i].price)) * 100).toFixed(2),
    //                         "per_plus_minus": (((parseFloat(ltp) - parseFloat(result[i].price)) / parseFloat(result[i].price)) * 100) >= 0 ? "+" : "",
    //                         "per_color": (((parseFloat(ltp) - parseFloat(result[i].price)) / parseFloat(result[i].price)) * 100) >= 0 ? "#32B22E" : "red",
    //                     });
    //                 }

    //                 // if (result.response_body.hydrated_basket_list[0]) {
    //                 //     for (let i = 0; i < result.response_body.hydrated_basket_list[0].recommendation_list.length; i++) {
    //                 //         basketsList.push(result.response_body.hydrated_basket_list[0].recommendation_list[i])
    //                 //     }
    //                 // }
    //                 setBasketsList(basketsList);
    //                 CustomConsole("Trade History: ");
    //                 CustomConsole(basketsList)
    //                 setIsLoading(false);
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
    //             "stock_symbol": basket.trading_symbol,
    //             "exchange": basket.exchange,
    //             "segment": "EQUITY",
    //             "stock_token": basket.trading_token
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

    //     async function getBasketsApi() {
    //         try {
    //             const login_token = await getSession(LOGIN_TOKEN);
    //             const login_token_type = await getSession(TOKEN_TYPE);

    //             const myHeaders = new Headers();
    //             myHeaders.append("Accept", "application/json");
    //             myHeaders.append("Content-Type", "application/json");
    //             myHeaders.append("Authorization", `${login_token_type} ${login_token}`);

    //             const requestOptions = {
    //                 method: "GET",
    //                 headers: myHeaders,
    //                 redirect: "follow"
    //             };

    //             CustomConsole(TRADE_HISTORY);
    //             setIsLoading(true);

    //             // Fetch initial basket data
    //             const response = await fetch(TRADE_HISTORY, requestOptions);
    //             if (!response.ok) {
    //                 if (response.status === 400) {
    //                     const data = await response.json();
    //                     alertDialogDisplay("", data.detail);
    //                 }
    //                 throw new Error("HTTP status " + response.status);
    //             }

    //             const result = await response.json();
    //             console.log("Baskets Result:", result);

    //             // Fetch LTPs for all baskets at once
    //             const ltpData = await fetchBasketLTP(result, login_token_type, login_token, accessToken);

    //             if (!ltpData || ltpData.length === 0) {
    //                 CustomConsole("LTP data is empty or failed to fetch.");
    //             } else {
    //                 // Map each item in result with corresponding LTP
    //                 let basketsList = result.map((item, index) => {
    //                     const ltp = ltpData[index]?.ltp || 0;
    //                     console.log(ltp);

    //                     return {
    //                         "order_tag": item.order_tag,
    //                         "trading_symbol": item.trading_symbol,
    //                         "trading_token": item.trading_token,
    //                         "transaction_type": item.transaction_type,
    //                         "exchange": item.exchange,
    //                         "quantity": item.quantity,
    //                         "stop_loss": item.stop_loss,
    //                         "target_1": item.target_1,
    //                         "target_2": item.target_2,
    //                         "is_after_market": item.is_after_market,
    //                         "trigger_price_target": item.trigger_price_target,
    //                         "trigger_price_stop_loss": item.trigger_price_stop_loss,
    //                         "order_placement_status": item.order_placement_status,
    //                         "user_id": item.user_id,
    //                         "broker": item.broker,
    //                         "filled_shares": item.filled_shares,
    //                         "order_status": item.order_status,
    //                         "unfilled_shares": item.unfilled_shares,
    //                         "price": item.price,
    //                         "updated_at": item.updated_at,
    //                         "invest_amt": (parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2),
    //                         "plus_amt": ((parseFloat(ltp) - parseFloat(item.price)) * parseFloat(item.quantity)).toFixed(2),
    //                         "plus_amt_plus_minus": ((parseFloat(ltp) - parseFloat(item.price)) * parseFloat(item.quantity)) >= 0 ? "+" : "",
    //                         "plus_amt_color": ((parseFloat(ltp) - parseFloat(item.price)) * parseFloat(item.quantity)) >= 0 ? "#32B22E" : "red",
    //                         "per": (((parseFloat(ltp) - parseFloat(item.price)) / parseFloat(item.price)) * 100).toFixed(2),
    //                         "per_plus_minus": (((parseFloat(ltp) - parseFloat(item.price)) / parseFloat(item.price)) * 100) >= 0 ? "+" : "",
    //                         "per_color": (((parseFloat(ltp) - parseFloat(item.price)) / parseFloat(item.price)) * 100) >= 0 ? "#32B22E" : "red",
    //                     };
    //                 });

    //                 // Set the updated baskets list after processing the LTP data
    //                 setBasketsList(basketsList);
    //                 CustomConsole("Trade History Baskets List:", basketsList);
    //             }

    //             setIsLoading(false);
    //         } catch (error) {
    //             setIsLoading(false);
    //             CustomConsole("Get baskets api exception:", error);
    //         }
    //     }

    //     // Modified fetchBasketLTP to return LTP data for all baskets at once
    //     const fetchBasketLTP = async (baskets, login_token_type, login_token, accessToken, retryCount = 0) => {
    //         const myHeaders_ltp = new Headers();
    //         myHeaders_ltp.append("Accept", "application/json");
    //         myHeaders_ltp.append("Content-Type", "application/json");
    //         myHeaders_ltp.append("Authorization", `${login_token_type} ${login_token}`);
    //         myHeaders_ltp.append("x-broker-access-token", accessToken);

    //         const raw_ltp = JSON.stringify(
    //             baskets.map(basket => ({
    //                 "stock_symbol": basket.trading_symbol,
    //                 "exchange": basket.exchange,
    //                 "segment": "EQUITY",
    //                 "stock_token": basket.trading_token
    //             }))
    //         );

    //         const requestOptions_ltp = {
    //             method: "POST",
    //             headers: myHeaders_ltp,
    //             body: raw_ltp,
    //             redirect: "follow"
    //         };

    //         CustomConsole(BASKETS_LTP);
    //         console.log("Request Payload:", raw_ltp);

    //         try {
    //             const response_ltp = await fetch(BASKETS_LTP, requestOptions_ltp);
    //             if (!response_ltp.ok) {
    //                 if (response_ltp.status === 400) {
    //                     const data = await response_ltp.json();
    //                     alertDialogDisplay("", data.detail);
    //                 }
    //                 throw new Error("HTTP status " + response_ltp.status);
    //             }

    //             const result_ltp = await response_ltp.json();
    //             CustomConsole("LTP API Result:", result_ltp);
    // console.log(result_ltp.response_body)
    //             return result_ltp.response_body || []; // Return an empty array if no response_body
    //         } catch (error) {
    //             if (retryCount < 1) {  // Retry once if first attempt fails
    //                 CustomConsole("Retrying LTP fetch...");
    //                 return fetchBasketLTP(baskets, login_token_type, login_token, accessToken, retryCount + 1);
    //             }
    //             CustomConsole("Get LTP api exception:", error);
    //             return []; // Return an empty array if error occurs after retry
    //         }
    //     };


    async function getBasketsApi() {
        try {
            const login_token = await getSession(LOGIN_TOKEN);
            const login_token_type = await getSession(TOKEN_TYPE);
            const accessToken = await getSession(BROKER_TOKEN);

            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `${login_token_type} ${login_token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            setIsLoading(true);
            fetch(TRADE_HISTORY, requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        if (response.status === 400) {
                            return response.json().then((data) => {
                                alertDialogDisplay("", data.detail);
                            });
                        }
                        throw new Error("HTTP status " + response.status);
                    }
                    return response.json();
                })
                .then(async (result) => {
                    // console.log(result)
                    // Gather unique symbols for LTP call
                    const uniqueSymbols = result.reduce((acc, item) => {
                        const symbolKey = `${item.trading_symbol}_${item.exchange}`;
                        if (!acc[symbolKey]) {
                            acc[symbolKey] = {
                                stock_symbol: item.trading_symbol,
                                exchange: item.exchange,
                                segment: "EQUITY",
                                stock_token: item.trading_token
                            };
                        }
                        return acc;
                    }, {});

                    // Extract unique trading_token values
                    const uniqueTradingTokens = Object.values(uniqueSymbols).map(symbol => symbol.stock_token);
                    const ltpData = await fetchBatchLTP(Object.values(uniqueTradingTokens), login_token_type, login_token, accessToken);

                    const basketsList = result.map((item) => {
                        // const symbolKey = `${item.trading_symbol}_${item.exchange}`;
                        const symbolKey = `${item.trading_token}`;
                        const ltp = ltpData[symbolKey] || 0;
                        const investAmt = (parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2);
                        const plusAmt = ((parseFloat(ltp) - parseFloat(item.price)) * parseFloat(item.quantity)).toFixed(2);
                        const per = (((parseFloat(ltp) - parseFloat(item.price)) / parseFloat(item.price)) * 100).toFixed(2);

                        return {
                            ...item,
                            invest_amt: investAmt,
                            plus_amt: plusAmt,
                            plus_amt_plus_minus: plusAmt >= 0 ? "+" : "",
                            plus_amt_color: plusAmt >= 0 ? "#32B22E" : "red",
                            per: per,
                            per_plus_minus: per >= 0 ? "+" : "",
                            per_color: per >= 0 ? "#32B22E" : "red",
                        };
                    });

                    setBasketsList(basketsList);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setIsLoading(false);
                    CustomConsole("Get baskets api exception: " + error);
                });
        } catch (error) {
            setIsLoading(false);
            CustomConsole("Get baskets api error: " + error);
        }
    }

    // Batch LTP fetch function
    const fetchBatchLTP = async (uniqueSymbols, login_token_type, login_token, accessToken) => {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Authorization", `${login_token_type} ${login_token}`);
        // myHeaders.append("x-broker-access-token", accessToken);

        const rawLTP = JSON.stringify({
            "tokens": uniqueSymbols
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: rawLTP,
            redirect: "follow",
        };

        try {
            const response = await fetch(BASKETS_LTP, requestOptions);
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
            const result = await response.json();
            // Transform LTP result to a dictionary for quick access
            return result;
            // return result.reduce((acc, item) => {
            //     console.log(item)
            //     const symbolKey = `${item.stock_symbol}_${item.exchange}`;
            //     acc[symbolKey] = { ltp: item.ltp };
            //     return acc;
            // }, {});
        } catch (error) {
            CustomConsole("Get LTP api exception: " + error);
            return {};
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#201830" }}>

            <View style={{ flex: 1, }}>

                {/* today's recommendation text */}
                <View style={{ alignItems: "center", marginHorizontal: SW(50), marginTop: SH(10) }}>
                    <Text style={{ fontSize: SF(22), color: colors.white, textAlign: "center", marginTop: SH(33) }}>Trade History</Text>
                </View>
                <Text style={{ marginHorizontal: SW(10), fontSize: SF(16), color: colors.white, textAlign: "center", marginTop: SH(33) }}>Your ongoing and completed trades are being displayed here.</Text>
                {/* end of today's recommendation text */}


                <View style={{ paddingVertical: SH(19) }}>
                    {isLoading ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ borderRadius: 10, padding: 25 }}>
                                <Text style={{ fontSize: SF(15), color: colors.white, fontWeight: "300" }}>Loading</Text>
                                <ActivityIndicator size="large" color={colors.white} />
                            </View>
                        </View>
                        :
                        <FlatList data={basketsList} style={{ marginHorizontal: SW(10) }}
                            // ItemSeparatorComponent={<View style={{ margin: 5 }} />}
                            renderItem={({ item }) => <HistoryItem item={item} />}

                            // renderItem={({ item }) => (
                            //     <View style={{ backgroundColor: "#241846", borderRadius: 10, paddingHorizontal: SW(15), paddingTop: SH(9), paddingBottom: SH(15), borderBottomColor: colors.white, marginHorizontal: SW(10) }}>

                            //         <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            //             {/* <Text style={{ fontSize: SF(15), color: '#B9B9B9', flex: 1, fontFamily: getRegularFont() }}>{"Buy Price : " + item.price + "  •  " + "Sell Price : " + item.sell_price}</Text> */}
                            //             <Text style={{ fontSize: SF(15), color: '#B9B9B9', flex: 1, fontFamily: getRegularFont() }}>{"Buy Price : ₹ " + item.price}</Text>
                            //             <Text style={{ fontSize: SF(15), color: '#FFFFFF', fontFamily: getRegularFont(), marginRight: SW(15) }}>{item.order_status}</Text>
                            //             <Text style={{ fontSize: SF(17), color: item.per_color, fontFamily: getRegularFont() }}>{item.per_plus_minus} {item.per}%</Text>
                            //         </View>

                            //         <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: SH(8) }}>
                            //             <Text style={{ fontSize: SF(22), color: '#B9B9B9', flex: 1, fontFamily: getRegularFont() }}>{item.trading_symbol}</Text>
                            //             <Text style={{ fontSize: SF(22), color: item.plus_amt_color, fontFamily: getRegularFont() }}>{item.plus_amt_plus_minus} {item.plus_amt}</Text>
                            //         </View>

                            //         <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            //             <Text style={{ fontSize: SF(15), color: '#B9B9B9', flex: 1, fontFamily: getRegularFont() }}>{"Invested : ₹ " + item.invest_amt + "  •  " + "Qty " + item.quantity}</Text>
                            //         </View>

                            //     </View>
                            // )}
                            ListEmptyComponent={<View style={{ alignItems: "center", flex: 1, justifyContent: "center", marginTop: Dimensions.get('window').height * 0.2 }}>
                                <Text style={{ fontSize: SF(20), color: colors.white, fontFamily: getInterRegularFont() }}>No trades are found.</Text>
                            </View>}
                        />
                    }

                </View>
            </View>


        </SafeAreaView>
    );
}

export default PastTradeHistory;