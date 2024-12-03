import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, Pressable, Image, Text, TextInput } from 'react-native';
import { colors } from '../utils/colors';
import { SF, SH, SW } from '../utils/dimensions';
import { getInterBoldFont, getInterRegularFont, getInterSemiBoldFont, getMediumFont, getRegularFont } from '../utils/Fonts';
import { alertDialogDisplay, CustomConsole, validateEmail } from '../utils/Functions';
import { LOGIN, REGISTER } from '../utils/API';
import { RouteNames } from '../navigators/RouteNames';
import { externalStyles } from '../utils/style';
import LinearGradient from 'react-native-linear-gradient';
import images from '../images';
import { progressView } from '../utils/components';
import { Snackbar } from 'react-native-paper';
import { LOGIN_TOKEN, saveSession, TOKEN_TYPE, USER_NAME } from '../utils/LocalStorage';

function RegisterScreen({ route, navigation }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [passwordShow, setPasswordShow] = useState(false);
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
    const [visible, setVisible] = React.useState(false);

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    async function onRegisterApi() {
        try {
            if (first_name.trim().length == 0) {
                alertDialogDisplay("", "Please enter username");
            }
            // if (last_name.trim().length == 0) {
            //     alertDialogDisplay("", "Please enter last name");
            // }
            else if (email.trim().length == 0) {
                alertDialogDisplay("", "Please enter email");
            }
            else if (!validateEmail(email)) {
                alertDialogDisplay("", "Please enter proper email");
            }
            else if (password.trim().length == 0) {
                alertDialogDisplay("", "Please enter password");
            }
            else if (confirmPassword.trim().length == 0) {
                alertDialogDisplay("", "Please enter confirm password");
            }
            else if (password.trim() !== confirmPassword.trim()) {
                alertDialogDisplay("", "Passwords do not match");
            }
            else {
                const myHeaders = new Headers();
                // myHeaders.append("Accept", "application/json");
                myHeaders.append("Content-Type", "application/json");

                const raw = JSON.stringify({
                    "username": first_name,
                    "password": password
                });

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow"
                };

                CustomConsole(REGISTER);
                CustomConsole(raw);
                setIsLoading(true);
                fetch(REGISTER, requestOptions)
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
                        // setIsLoading(false);

                        onToggleSnackBar();

                        const login_raw = JSON.stringify({
                            "username": first_name,
                            "password": password
                        });

                        CustomConsole(LOGIN);
                        CustomConsole(login_raw);
                        fetch(LOGIN, requestOptions)
                            .then((response_login) => {
                                if (!response_login.ok) {
                                    if (response_login.status === 400) {
                                        // Parse the response to extract the error details
                                        return response_login.json().then((data) => {
                                            alertDialogDisplay("", data.detail); // Set the 'detail' message from the response
                                        });
                                    }
                                    throw new Error("HTTP status " + response_login.status);
                                }
                                setIsLoading(false);
                                return response_login.json();
                            })
                            .then((result_login) => {
                                CustomConsole("in result_login");
                                CustomConsole(result_login);
                                setIsLoading(false);
                                saveSession(LOGIN_TOKEN, result_login.access_token);
                                saveSession(TOKEN_TYPE, result_login.token_type);
                                saveSession(USER_NAME, first_name);
                                // navigation.navigate(RouteNames.DHANREGISTRATIONSCREEN, { paramItem: result_login })
                                navigation.navigate(RouteNames.SELECTBROKERSCREEN, { paramItem: result_login });
                                // setErrorMessage(null); // Clear error on success
                            })
                            .catch((error) => {
                                setIsLoading(false);
                                CustomConsole("Login api exception: " + error);
                            });
                        // navigation.navigate(RouteNames.LOGINSCREEN);
                        // setErrorMessage(null); // Clear error on success
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        CustomConsole("Register api exception: " + error);
                    });
            }
        } catch (error) {
            setIsLoading(false);
            CustomConsole("Register api error: " + error);
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
                        <Text style={{ fontSize: SF(24), color: colors.white, fontFamily: getInterBoldFont() }}>Sign Up</Text>
                        <Text style={{ fontSize: SF(16), color: "#949494", marginTop: SH(8), fontFamily: getInterRegularFont() }}>It only takes a minute to create your account</Text>
                    </View>

                    <View style={{ marginTop: SH(46), marginHorizontal: SW(35) }}>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>

                            <TextInput
                                style={{
                                    color: colors.white,
                                    fontSize: SF(15),
                                    fontFamily: getInterRegularFont(),
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: colors.borderColor,
                                    paddingHorizontal: SW(16),
                                    paddingVertical: SH(8),
                                    borderRadius: 8,
                                    flex: 1
                                }}
                                value={first_name}
                                onChangeText={txt => { setFirstName(txt); }}
                                placeholderTextColor={colors.placeHolderTextColor}
                                placeholder="User Name"
                            />

                            {/* <TextInput
                                style={{
                                    color: colors.white,
                                    fontSize: SF(15),
                                    fontFamily: getInterRegularFont(),
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: colors.borderColor,
                                    paddingHorizontal: SW(16),
                                    paddingVertical: SH(8),
                                    borderRadius: 8,
                                    marginLeft: SW(16),
                                    flex: 1
                                }}
                                value={last_name}
                                onChangeText={txt => { setLastName(txt); }}
                                placeholderTextColor={colors.placeHolderTextColor}
                                placeholder="Last Name"
                            /> */}
                        </View>

                        <TextInput
                            style={{
                                marginTop: SH(16),
                                color: colors.white,
                                fontSize: SF(15),
                                fontFamily: getInterRegularFont(),
                                borderRadius: 5,
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
                            placeholder="Email Address"
                        />

                        <View style={{
                            flexDirection: "row", alignItems: "center", borderRadius: 8,
                            borderWidth: 1,
                            borderColor: colors.borderColor, marginTop: SH(16),
                            paddingHorizontal: SW(16),
                            marginTop: SH(16),
                        }}>
                            <TextInput
                                style={{
                                    color: colors.white,
                                    fontSize: SF(15),
                                    fontFamily: getInterRegularFont(), flex: 1
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
                                    fontFamily: getInterRegularFont(), flex: 1
                                }}
                                value={confirmPassword}
                                onChangeText={txt => { setConfirmPassword(txt); }}
                                placeholderTextColor={colors.placeHolderTextColor}
                                placeholder="Confirm Password"
                                secureTextEntry={!confirmPasswordShow}
                            />
                            <Pressable onPress={() => setConfirmPasswordShow(!confirmPasswordShow)}
                                style={{ padding: SH(5) }}>
                                <Image source={confirmPasswordShow ? images.password_show : images.password_hide} style={{ height: SH(30), width: SH(30), resizeMode: "contain" }} />
                            </Pressable>
                        </View>

                        <Pressable onPress={onRegisterApi}
                            style={{ marginTop: SH(69), }}>
                            <LinearGradient colors={[colors.themeButtonColor1, colors.themeButtonColor2]}
                                style={externalStyles.buttonGrdientContainer}>
                                <Text style={externalStyles.buttonText}>Sign Up</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", flex: 1, marginBottom: SH(38) }}>
                        <Text style={{ fontSize: SF(16), color: "#949494", fontFamily: getInterSemiBoldFont(), alignSelf: "flex-end" }}>Already have account?</Text>
                        <Pressable onPress={() => navigation.navigate(RouteNames.LOGINSCREEN)}
                            style={{ alignSelf: "flex-end" }}>
                            <Text style={{ fontSize: SF(16), color: colors.secondThemeColor, fontFamily: getInterSemiBoldFont(), marginLeft: SW(5) }}>Sign In</Text>
                        </Pressable>
                    </View>

                </View>
            }

            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                duration={2000}
            // action={{
            //     label: 'Undo',
            //     onPress: () => {
            //         // Do something
            //     },
            // }}
            >
                Sign up successful. Logging in..
            </Snackbar>

        </SafeAreaView>
    );
}

export default RegisterScreen;