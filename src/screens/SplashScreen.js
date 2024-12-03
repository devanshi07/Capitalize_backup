import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Text, Modal, Image, StyleSheet, TouchableOpacity, } from 'react-native';
import { BROKER_TOKEN, clearAsyncStorage, getSession, lAST_LOGIN_DATE, LOGIN_TOKEN, } from '../utils/LocalStorage';
import { RouteNames } from '../navigators/RouteNames';
import { externalStyles } from '../utils/style';
import { APP_NAME } from '../utils/string';
import NetInfo from '@react-native-community/netinfo';
import images from '../images';
import moment from 'moment';

function SplashScreen({ route, navigation }) {

    const [isConnected, setIsConnected] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        checkLoginStatus();
        checkConnection(); // Initial check
    }, []);

    const checkConnection = () => {
        NetInfo.fetch().then(state => {
            console.log(state.isConnected)
            if (!state.isConnected) {
                console.log("in if");
                setIsConnected(false);
                setModalVisible(true); // Show modal if no internet
            } else {
                console.log("in else");
                setIsConnected(true);
                setModalVisible(false); // Hide modal if connected
            }
        });
    };

    const handleRetryPress = () => {
        checkConnection();
    };

    var isCall = true;

    // function callFunctionSplash(){
    // setTimeout(() => {
    //     {
    //         async function checkData() {
    //             const login_token = await getSession(LOGIN_TOKEN);
    //             const broker_token = await getSession(BROKER_TOKEN);

    //             if (isCall) {
    //                 if (login_token === null) {
    //                     navigation.navigate(RouteNames.LOGINSCREEN);
    //                     navigation.reset({
    //                         index: 0,
    //                         routes: [{ name: RouteNames.LOGINSCREEN }],
    //                     });
    //                     isCall = false;
    //                 } else {
    //                     if (broker_token === null) {
    //                         navigation.navigate(RouteNames.SELECTBROKERSCREEN);
    //                         navigation.reset({
    //                             index: 0,
    //                             routes: [{ name: RouteNames.SELECTBROKERSCREEN }],
    //                         });
    //                     } else {
    //                         navigation.navigate(RouteNames.MYTABS);
    //                         navigation.reset({
    //                             index: 0,
    //                             routes: [{ name: RouteNames.MYTABS }],
    //                         });
    //                     }
    //                     isCall = false;
    //                 }
    //             }
    //         }
    //         NetInfo.fetch().then(state => {
    //             console.log(state.isConnected)
    //             if (!state.isConnected) {
    //                 console.log("in if");
    //                 setIsConnected(false);
    //                 setModalVisible(true); // Show modal if no internet
    //             } else {
    //                 console.log("in else");
    //                 checkData();
    //                 setIsConnected(true);
    //                 setModalVisible(false); // Hide modal if connected
    //             }
    //         });
    //         // if(isConnected){
    //         //     checkData();
    //         // }
    //     }
    // }, 3000);
    // }

    const checkLoginStatus = async () => {
        try {
            const lastLoginDate = await getSession(lAST_LOGIN_DATE);
            console.log("lastLoginDate==>" + lastLoginDate);
            const todayDate = moment().format("YYYY-MM-DD"); // Get only the date part
            console.log("todayDate==>" + todayDate);

            if (lastLoginDate !== todayDate) {
                console.log("in if")
                // If the dates don't match, log out and update the date
                clearAsyncStorage();
                navigation.navigate(RouteNames.LOGINSCREEN);
            } else {
                // If the dates match, keep the user logged in
                // setIsLoggedIn(true);
                setTimeout(() => {
                    {
                        async function checkData() {
                            const login_token = await getSession(LOGIN_TOKEN);
                            const broker_token = await getSession(BROKER_TOKEN);

                            if (isCall) {
                                if (login_token === null) {
                                    navigation.navigate(RouteNames.LOGINSCREEN);
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: RouteNames.LOGINSCREEN }],
                                    });
                                    isCall = false;
                                } else {
                                    if (broker_token === null) {
                                        navigation.navigate(RouteNames.SELECTBROKERSCREEN);
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: RouteNames.SELECTBROKERSCREEN }],
                                        });
                                    } else {
                                        navigation.navigate(RouteNames.MYTABS);
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: RouteNames.MYTABS }],
                                        });
                                    }
                                    isCall = false;
                                }
                            }
                        }
                        NetInfo.fetch().then(state => {
                            console.log(state.isConnected)
                            if (!state.isConnected) {
                                console.log("in if");
                                setIsConnected(false);
                                setModalVisible(true); // Show modal if no internet
                            } else {
                                console.log("in else");
                                checkData();
                                setIsConnected(true);
                                setModalVisible(false); // Hide modal if connected
                            }
                        });
                        // if(isConnected){
                        //     checkData();
                        // }
                    }
                }, 3000);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    };

    return (
        <SafeAreaView style={externalStyles.mainContainer}>
            <View style={externalStyles.splashSubContainer}>
                <View style={externalStyles.splashSubSubContainer}>
                    <Text style={externalStyles.splashAppNameText}>{APP_NAME}</Text>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleRetryPress}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Please check your internet connection</Text>
                        <Image
                            source={images.no_internet}
                            style={{ height: 70, width: 70, tintColor: '#0E0422', marginBottom: 10 }}
                        />
                        {/* <Button title="OK" onPress={handleRetryPress} color="#DE8602" style={{borderRadius:7,padding:10}} /> */}
                        <TouchableOpacity onPress={handleRetryPress} style={styles.okButton}>
                            {/* <Text style={styles.okButtonText}>Retry</Text> */}
                            <Image
                                style={{ tintColor: 'white', height: 25, width: 25 }}
                                source={images.retry}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

export default SplashScreen;

const styles = StyleSheet.create({
    // modalContainer: {
    //   // flex: 1,
    //   justifyContent: 'flex-start', // Align modal at the top
    //   alignItems: 'center',
    //   marginTop: 10, // Adjust margin to position modal where you want
    // },
    // modalContent: {
    //   width: '80%',
    //   padding: 20,
    //   backgroundColor: 'white',
    //   borderRadius: 10,
    //   alignItems: 'center',
    //   elevation: 5, // Adds shadow effect on Android
    // },
    // textWithIconContainer: {
    //   flexDirection: 'row',
    //   justifyContent: 'space-between',
    //   marginBottom: 20,
    // },

    // icon: {
    //   marginTop: 10,
    //   marginLeft: 10,
    //   width: 30,
    //   height: 30,
    // },
    // modalText: {
    //   fontSize: 18,
    //   marginBottom: 20,
    //   color: 'black'
    // },
    // buttonContainer: {
    //   flexDirection: 'row',
    //   justifyContent: 'space-between',
    //   width: '100%',
    // },
    // button: {
    //   padding: 10,
    //   borderRadius: 5,
    //   width: '45%',
    // },
    // acceptButton: {
    //   backgroundColor: '#4CAF50',
    // },
    // rejectButton: {
    //   backgroundColor: '#F44336',
    // },
    // buttonText: {
    //   color: 'white',
    //   textAlign: 'center',
    //   fontSize: 16,
    // },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5, // Shadow and elevation for modal
    },
    modalText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 0,
        color: '#333',
    },
    okButton: {
        backgroundColor: '#0E0422',
        borderRadius: 7,
        paddingVertical: 10,
        paddingHorizontal: 30,
    },
    okButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});