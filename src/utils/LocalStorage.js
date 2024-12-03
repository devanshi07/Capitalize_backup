// https://react-native-async-storage.github.io/async-storage/docs/usage/
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomConsole } from './Functions';

export const saveSession = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
        CustomConsole("Key=>" + key + ":" + "Value=>" + value);
    } catch (e) {
        // saving error
    }
}

export const removeItemSession = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        CustomConsole("Key=>" + key + ":");
    } catch (e) {
        // saving error
    }
}

export const clearAsyncStorage = async () => {
    AsyncStorage.clear();
}

export const getSession = async (key) => {
    var value = "";
    try {
        value = await AsyncStorage.getItem(key)
        CustomConsole("Key=>" + key + ":" + "Value=>" + value);
    } catch (e) {
        // error reading value
        // CustomConsole("Error=>" + e);
    }
    return value;
}

// User Data
export const LOGIN_TOKEN = "login_token";
export const TOKEN_TYPE = "token_type";
export const lAST_LOGIN_DATE = "lastLoginDate";

export const BROKER = "broker";
export const BROKER_TOKEN = "broker_token";
export const BROKER_EXPIRE_TIME = "broker_expire_time";

export const BROKER_FUND = "broker_fund";
export const BROKER_UNUSED_FUND = "broker_unused_fund";

export const USER_NAME = "user_name";
export const EMAIL = "user_email";

