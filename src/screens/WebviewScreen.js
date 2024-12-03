import React, { useRef, useState } from 'react';
import { View, SafeAreaView, Pressable, Image, Text, ActivityIndicator, Alert, } from 'react-native';
import { colors } from '../utils/colors';
import { SF, SH, SW } from '../utils/dimensions';
import { getMediumFont, } from '../utils/Fonts';
import images from '../images';
import { RouteNames } from '../navigators/RouteNames';
import { WebView } from 'react-native-webview';
import { BROKER_TOKEN, saveSession } from '../utils/LocalStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

function WebviewScreen({ route, navigation }) {

  const Link = route.params?.paramLink;

  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const webViewRef = useRef(null);

  // const handleNavigationStateChange = (navState) => {
  //     const { url } = navState;

  //     // Check if the URL contains 'tokenId='
  //     if (url.startsWith('https://capitalize.onrender.com/dhan/redirect?tokenId=')) {
  //       const token = extractTokenFromUrl(url);
  //       if (token) {
  //         setAccessToken(token);
  //         Alert.alert("Access Token Retrieved", token);
  //       }
  //     }
  //   };

  //   const extractTokenFromUrl = (url) => {
  //     const regex = /tokenId=([^&]*)/;
  //     const match = url.match(regex);
  //     return match ? match[1] : null;
  //   };

  const handleLoadEnd = () => {
    setLoading(false);

    const injectedJavaScript = `
          (function() {
            // Assuming the access token is embedded in a specific element
            // Update the selector based on your page's structure
            const tokenElement = document.querySelector('pre');
            if (tokenElement) {
              const tokenText = tokenElement.innerText;
              // Clean the text and extract the token
              const tokenMatch = tokenText.match(/"access_token":"([^"]+)"/);
              if (tokenMatch) {
                window.ReactNativeWebView.postMessage(tokenMatch[1]); // Send the token to React Native
              }
            }
          })();
        `;

    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(injectedJavaScript);
    }
  };

  const handleMessage = async (event) => {
    const message = event.nativeEvent.data;
    // console.log('Received access token from WebView:', message);
    setAccessToken(message);
    saveSession(BROKER_TOKEN, message);
    const currentTime = Date.now(); // Current timestamp in milliseconds
    await AsyncStorage.setItem('loginTimestamp', JSON.stringify(currentTime));
    // Proceed with the rest of the login logic...
    navigation.navigate(RouteNames.MYTABS);
    // Alert.alert("Access Token Retrieved", message);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* {console.log(accessToken)} */}
      {/* {loading && <ActivityIndicator size="large" color="#0000ff" />} */}
      <WebView
        source={{ uri: Link }}
        ref={webViewRef}
        onLoadEnd={handleLoadEnd}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        startInLoadingState={true}
      />
      {/* {accessToken && <Text style={{ color: "red" }}>Access Token: {accessToken}</Text>} */}
    </SafeAreaView>
  );
}

export default WebviewScreen;