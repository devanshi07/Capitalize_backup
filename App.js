/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  AppState,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from './src/utils/colors';
import LoginScreen from './src/screens/LoginScreen';
import RegisterOnlyNameScreen from './src/screens/RegisterOnlyNameScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DhanRegistrationScreen from './src/screens/DhanRegistrationScreen';
import StartingScreen from './src/screens/StartingScreen';
import { RouteNames } from './src/navigators/RouteNames';
import WebviewScreen from './src/screens/WebviewScreen';
import DashboardScreen2 from './src/screens/DashboardScreen2';
import images from './src/images';
import { SF, SH, SW } from './src/utils/dimensions';
import { getInterRegularFont, getRegularFont } from './src/utils/Fonts';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SelectBrokerScreen from './src/screens/SelectBrokerScreen';
import SplashScreen from './src/screens/SplashScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import OrderSuccessScreen from './src/screens/OrderSuccessScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BROKER, BROKER_TOKEN } from './src/utils/LocalStorage';
import PastRecommendationsScreen from './src/screens/PastRecommendationsScreen';
import PastTradeHistory from './src/screens/PastTradeHistory';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AddOrderScreen from './src/screens/AddOrderScreen';
import RiskAnalysisScreen from './src/screens/RiskAnalysisScreen';
import LoginScreen2 from './src/screens/LoginScreen2';
import NetInfo from '@react-native-community/netinfo';
import OtpScreen from './src/screens/OtpScreen';

function App() {

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const Drawer = createDrawerNavigator();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkSessionValidity();
      }
    });

    // Clean up the event listener
    return () => {
      subscription.remove();
    };
  }, []);

  const checkSessionValidity = async () => {
    const loginTimestamp = await AsyncStorage.getItem('loginTimestamp');
    if (loginTimestamp) {
      const currentTime = Date.now();
      const timeElapsed = currentTime - JSON.parse(loginTimestamp); // in milliseconds
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (timeElapsed >= twentyFourHours) {
        // Log the user out
        handleLogout();
      }
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loginTimestamp');
    await AsyncStorage.removeItem(BROKER);
    await AsyncStorage.removeItem(BROKER_TOKEN);
    // Redirect to the login screen or perform other logout actions...
  };

  // bottom tab navigation
  function MyTabs() {
    return (
      <View style={{ backgroundColor: colors.themeBlue, flex: 1 }}>
        <Tab.Navigator
          // tabBarPosition='bottom'
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: "rgba(14, 4, 34, 1)", height: SH(80), borderTopWidth: 0, paddingBottom: SH(10) },
            tabBarLabelStyle: { fontSize: SF(15), fontFamily: getInterRegularFont(), fontWeight: "500", },
            // swipeEnabled: false,
            // tabBarIndicatorStyle: { borderBottomWidth: SH(3), borderBottomColor: colors.white },
            // lazy: false,
            // tabBarLabelPosition: "beside-icon"
            tabBarActiveTintColor: colors.secondThemeColor,
            tabBarInactiveTintColor: colors.white
          }}
          initialRouteName='HomeScreen'
          backBehavior='initialRoute'
        >

          <Tab.Screen name="PastRecommendationsScreen" component={PastRecommendationsScreen}
            options={{
              tabBarLabel: "Past Trades",
              tabBarIcon: ({ focused, color }) => <Image source={focused ? images.history_2 : images.trade_history} style={{ height: SH(25), width: SH(25), resizeMode: "contain" }} />,
            }} />

          <Tab.Screen name="HomeScreen" component={DashboardScreen2}
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ focused, color }) => <Image source={focused ? images.home_2 : images.home} style={{ height: SH(30), width: SH(30), resizeMode: "contain" }} />,
            }} />

          <Tab.Screen name="PastTradeHistory" component={PastTradeHistory}
            options={{
              tabBarLabel: "My Trades",
              tabBarIcon: ({ focused, color }) => <Image source={focused ? images.briefcase_2 : images.briefcase} style={{ height: SH(25), width: SH(25), resizeMode: "contain" }} />,
            }} />

          {/* <Tab.Screen name={RouteNames.PROFILESCREEN} component={ProfileScreen}
            options={{
              tabBarLabel: "Profile",
              tabBarIcon: ({ focused, color }) => <Image source={focused ? images.Profile : images.Profile_2} style={{ height: SH(30), width: SH(30), resizeMode: "contain", }} />,
            }} /> */}
        </Tab.Navigator>
      </View>
    );
  }

  // drawer method
  function MyDrawer() {
    return (
      <Drawer.Navigator screenOptions={{
        headerShown: false
      }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={MyTabs} />
        <Drawer.Screen name="MyResultsScreen" component={MyResultsScreen} />
        {/* <Drawer.Screen name="ConsistResultsScreen" component={ConsistResultsScreen} />
        <Drawer.Screen name="PerformanceResultsScreen" component={PerformanceResultsScreen} /> */}

      </Drawer.Navigator>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            headerShown: false
          }}
            initialRouteName={RouteNames.SPLASHSCREEN}
            // initialRouteName={RouteNames.MYTABS}
            // initialRouteName={RouteNames.OTPSCREEN}
            // initialRouteName={RouteNames.PROFILESCREEN}
          //  initialRouteName={RouteNames.RISKANALYSISSCREEN}
          >
            <Stack.Screen name={RouteNames.SPLASHSCREEN} component={SplashScreen} />
            <Stack.Screen name={RouteNames.LOGINSCREEN2} component={LoginScreen2} />
            <Stack.Screen name={RouteNames.OTPSCREEN} component={OtpScreen} />
            {/* <Stack.Screen name={RouteNames.STARTINGSCREEN} component={StartingScreen} /> */}
            <Stack.Screen name={RouteNames.LOGINSCREEN} component={LoginScreen} />
            <Stack.Screen name={RouteNames.REGISTERONLYNAMESCREEN} component={RegisterOnlyNameScreen} />
            <Stack.Screen name={RouteNames.REGISTERSCREEN} component={RegisterScreen} />
            <Stack.Screen name={RouteNames.DHANREGISTRATIONSCREEN} component={DhanRegistrationScreen} />
            <Stack.Screen name={RouteNames.WEBVIEWSCREEN} component={WebviewScreen} />
            <Stack.Screen name={RouteNames.DASHBOARDSCREEN2} component={DashboardScreen2} />
            <Stack.Screen name={RouteNames.MYTABS} component={MyTabs} />
            <Stack.Screen name={RouteNames.SELECTBROKERSCREEN} component={SelectBrokerScreen} />
            <Stack.Screen name={RouteNames.ORDERSUCCESSSCREEN} component={OrderSuccessScreen} />
            <Stack.Screen name={RouteNames.PROFILESCREEN} component={ProfileScreen} />
            <Stack.Screen name={RouteNames.ADDORDERSCREEN} component={AddOrderScreen} />
            <Stack.Screen name={RouteNames.RISKANALYSISSCREEN} component={RiskAnalysisScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

export default App;
