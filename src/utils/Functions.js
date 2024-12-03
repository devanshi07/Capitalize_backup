import { Alert } from "react-native";

// custom console
export const CustomConsole = (visible) => {
    console.log(visible);
}

// common alert box
export function alertDialogDisplay(title, msg) {
    Alert.alert(title, msg, [
        { text: 'OK' },
    ]);
}

// Common alert box with onPress for "OK" button
export function alertDialogOnpressDisplay(title, msg, onPress = () => {}) {
    Alert.alert(
        title,
        msg,
        [
            { text: 'OK', onPress: onPress }
        ]
    );
}

//validate email method
export const validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
        return false;
    }
    else {
        return true;
    }
}

// validate password method
export const validatePassword = (text) => {
    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (reg.test(text) === false) {
        return false;
    }
    else {
        return true;
    }
}