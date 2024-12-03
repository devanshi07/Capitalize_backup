import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Button, SafeAreaView, Image, Pressable } from 'react-native';
import { externalStyles } from '../utils/style';
import images from '../images';
import { colors } from '../utils/colors';
import { getInterBoldFont, getRegularFont } from '../utils/Fonts';
import { SH, SW } from '../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import { getSession, LOGIN_TOKEN, TOKEN_TYPE } from '../utils/LocalStorage';
import { RISK_PROFILE_QUESTIONS, RISK_PROFILE_STATE, RISK_PROFILE_VERSION } from '../utils/API';
import { alertDialogDisplay, alertDialogOnpressDisplay, CustomConsole } from '../utils/Functions';
import { APP_NAME } from '../utils/string';

// const questions = [
//     {
//         id: 1,
//         question: "What level of financial loss can you tolerate?",
//         options: ["No loss, play it safe", "Minimal loss, cautious gains", "Moderate loss, open to calculated risks", "High loss, willing to pursue high returns"],
//     },
//     {
//         id: 2,
//         question: "How long are you willing to invest?",
//         options: ["Less than 1 year", "1-3 years", "3-5 years", "More than 5 years"],
//     },
//     {
//         id: 3,
//         question: "What is your investment experience?",
//         options: ["Beginner", "Intermediate", "Advanced", "Expert"],
//     },
//     {
//         id: 4,
//         question: "How do you feel about market volatility?",
//         options: ["Very anxious", "Somewhat concerned", "Neutral", "Comfortable"],
//     },
//     {
//         id: 5,
//         question: "What is your primary investment goal?",
//         options: ["Capital preservation", "Steady income", "Growth", "Aggressive growth"],
//     }
// ];

const RiskAnalysisScreen = ({ navigation }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [questions, setQuestions] = useState([]);
    const [login_token_type, setLoginTokenType] = useState('');
    const [login_token, setLoginToken] = useState('');
    const [version, setVersion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getSessionData()
    }, []);

    // get session data method
    const getSessionData = async () => {
        const login_token_type = await getSession(TOKEN_TYPE);
        const login_token = await getSession(LOGIN_TOKEN);
        setLoginToken(login_token);
        setLoginTokenType(login_token_type);
        getRiskProfileStateApi(login_token_type, login_token);
    };

    // get risk profile state
    async function getRiskProfileStateApi(param_login_token_type, param_login_token) {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", param_login_token_type + " " + param_login_token);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            CustomConsole(RISK_PROFILE_STATE);
            setIsLoading(true);
            fetch(RISK_PROFILE_STATE, requestOptions)
                .then(async (response) => {
                    if (!response.ok) {
                        if (response.status === 400) {
                            return response.json().then((data) => {
                                alertDialogDisplay(APP_NAME, data.detail); // Set the 'detail' message from the response
                            });
                        }
                        else if (response.status === 500) {
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
                    CustomConsole("result");
                    CustomConsole(result);
                    answers.length == 0;
                    for (var i = 0; i < result.page_state.length; i++) {
                        setAnswers(prev => ({
                            ...prev,
                            [result.page_state[i]?.page_id]: {
                                option_number: result.page_state[i]?.option_number,
                                page_id: result.page_state[i]?.page_id
                            }
                        }));
                    }
                    getRiskProfileQuestionsApi(param_login_token_type, param_login_token);

                    // setIsLoading(false);
                })
                .catch((error) => {
                    setIsLoading(false);
                    CustomConsole("Get risk profile state api exception: " + error);
                });

        } catch (error) {
            setIsLoading(false);
            CustomConsole("Get risk profile state api error: " + error);
        }
    }

    // get risk profile questions
    async function getRiskProfileQuestionsApi(param_login_token_type, param_login_token) {
        try {
            console.log(param_login_token_type);
            console.log(param_login_token);

            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", param_login_token_type + " " + param_login_token);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            CustomConsole(RISK_PROFILE_QUESTIONS);
            setIsLoading(true);
            fetch(RISK_PROFILE_QUESTIONS, requestOptions)
                .then(async (response) => {
                    if (!response.ok) {
                        if (response.status === 400) {
                            return response.json().then((data) => {
                                alertDialogDisplay(APP_NAME, data.detail); // Set the 'detail' message from the response
                            });
                        }
                        else if (response.status === 500) {
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
                    CustomConsole("result");
                    CustomConsole(result);
                    setQuestions(result.pages);
                    setVersion(result.version);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setIsLoading(false);
                    CustomConsole("Get risk profile question api exception: " + error);
                });

        } catch (error) {
            setIsLoading(false);
            CustomConsole("Get risk profile question api error: " + error);
        }
    }

    const handleOptionPress = (option, currentQuestionItem) => {
        CustomConsole(currentQuestionItem);
        // setAnswers(prev => ({ ...prev, [questions[currentQuestionIndex]?.page_id]: option.option_number }));
        setAnswers(prev => ({
            ...prev,
            [questions[currentQuestionIndex]?.page_id]: {
                option_number: option.option_number,
                page_id: questions[currentQuestionIndex]?.page_id
            }
        }));
    };

    const nextQuestion = () => {
        if (answers[questions[currentQuestionIndex]?.page_id]) {

        console.log(currentQuestionIndex);
        console.log(questions[currentQuestionIndex]?.page_id);
        console.log(answers[questions[currentQuestionIndex]?.page_id]);
        console.log(answers[questions[currentQuestionIndex]?.page_id]?.option_number);

        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", login_token_type + " " + login_token);

        const raw = JSON.stringify({
            "page_id": questions[currentQuestionIndex]?.page_id,
            "option_number": answers[questions[currentQuestionIndex]?.page_id]?.option_number
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        CustomConsole(RISK_PROFILE_STATE);
        CustomConsole(raw);

        fetch(RISK_PROFILE_STATE, requestOptions)
            .then((response) => {
                console.log(response)
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

                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                }

                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                CustomConsole("Post answer api exception: " + error);
            });


        } else {
            alertDialogDisplay(APP_NAME, "Please answer the question.");
            return;
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        // Handle the submit logic here
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", login_token_type + " " + login_token);

        const raw = JSON.stringify({
            "page_id": questions[currentQuestionIndex]?.page_id,
            "option_number": answers[questions[currentQuestionIndex]?.page_id]?.option_number
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        CustomConsole(RISK_PROFILE_STATE);
        CustomConsole(raw);

        fetch(RISK_PROFILE_STATE, requestOptions)
            .then((response) => {
                console.log(response)
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

                const raw = JSON.stringify({});

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow"
                };

                CustomConsole(RISK_PROFILE_VERSION + version);
                CustomConsole(raw);

                fetch(RISK_PROFILE_VERSION + version, requestOptions)
                    .then((response_version) => {
                        console.log(response_version)
                        if (!response_version.ok) {
                            if (response_version.status === 400) {
                                // Parse the response_version to extract the error details
                                return response_version.json().then((data) => {
                                    alertDialogDisplay("", data.detail); // Set the 'detail' message from the response_version
                                });
                            }
                            throw new Error("HTTP status " + response_version.status);
                        }
                        return response_version.json();
                    })
                    .then(async (result_version) => {
                        CustomConsole("in result");
                        CustomConsole(result_version);
                        alertDialogOnpressDisplay(APP_NAME,
                            "Your profile has been submitted.",
                            () => navigation.goBack()); // Set the 'detail' message from the response
                        setIsLoading(false);
                    })
                    .catch((error_version) => {
                        setIsLoading(false);
                        CustomConsole("Version update api exception: " + error_version);
                    });
                // setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                CustomConsole("Post answer api exception: " + error);
            });
    };

    const renderOptions = () => (
        <FlatList style={{ marginTop: SH(30), }}
            data={questions[currentQuestionIndex]?.options}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[
                        styles.option,
                        answers[questions[currentQuestionIndex]?.page_id]?.option_number === item.option_number && styles.selectedOption,
                    ]}
                    onPress={() => handleOptionPress(item, questions[currentQuestionIndex])}
                >
                    <Text style={styles.optionText}>{item.option_content}</Text>
                </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
    );

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
                    <Text style={{ color: colors.white, fontFamily: getInterBoldFont(), textAlign: "center" }}>Risk Profile</Text>
                </View>
                {/* end of title */}
                <View style={{ width: SH(43) }} />
            </View>
            {/* end of header */}
            {!isLoading ?
                <>
                    <View style={{ marginHorizontal: SW(35), marginTop: SH(50), flex: 1 }}>
                        {console.log("====>", answers)}
                        <Text style={externalStyles.questionText}>
                            {questions[currentQuestionIndex]?.question}
                        </Text>

                    </View>

                    <View style={{ backgroundColor: "rgba(255, 255, 255, 0.20)", borderRadius: 30, paddingHorizontal: SW(17), paddingVertical: SH(19), marginHorizontal: SW(20), marginBottom: SH(30) }}>

                        {renderOptions()}
                        <View style={styles.buttonContainer}>
                            {/* <Button
                    title="Previous"
                    onPress={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                /> */}
                            <TouchableOpacity onPress={previousQuestion}
                                disabled={currentQuestionIndex === 0}>
                                <LinearGradient colors={[colors.themeButtonColor1, colors.themeButtonColor2]}
                                    style={{ borderRadius: 15, paddingVertical: SH(20), paddingHorizontal: SW(20) }}>
                                    {/* <Text style={externalStyles.buttonText}>Previous</Text> */}
                                    <Image source={images.back_arrow} style={externalStyles.backArrowImage} />
                                </LinearGradient>
                            </TouchableOpacity>
                            {currentQuestionIndex === questions.length - 1 ? (
                                // <Button title="Submit" onPress={handleSubmit} />
                                <TouchableOpacity onPress={handleSubmit}>
                                    <LinearGradient colors={['#0E0422', '#0E0422']}
                                        style={{ borderRadius: 15, paddingVertical: SH(20), paddingHorizontal: SW(55) }}>
                                        <Text style={externalStyles.buttonText}>Submit</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ) : (
                                // <Button title="Next" onPress={nextQuestion} />
                                <TouchableOpacity onPress={nextQuestion}>
                                    <LinearGradient colors={['#0E0422', '#0E0422']}
                                        style={{ borderRadius: 15, paddingVertical: SH(20), paddingHorizontal: SW(60) }}>
                                        <Text style={externalStyles.buttonText}>Next</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </> : <></>}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },

    option: {
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
    },
    selectedOption: {
        // backgroundColor: '#32B22E',
        backgroundColor: colors.themeButtonColor1,
        // borderColor: '#32B22E',
        borderColor: colors.borderColor
    },
    optionText: {
        fontSize: 16,
        textAlign: 'left',
        color: "white",
        fontFamily: getRegularFont()
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        marginTop: 20,
        // alignItems: "flex-end",
        marginBottom: SH(20),
        // marginRight: SW(20)
    },
});

export default RiskAnalysisScreen;
