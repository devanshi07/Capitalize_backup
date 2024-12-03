import { Platform } from "react-native"

// regular fonts
export const getRegularFont = () => {
    if (Platform.OS === 'ios') {
        return "OpenSans-Regular";
    } else {
        return "OpenSans-Regular";
    }
}

// semibold fonts
export const getSemiBoldFont = () => {
    if (Platform.OS === 'ios') {
        return "OpenSans-SemiBold";
    } else {
        return "OpenSans-SemiBold";
    }
}

// bold fonts
export const getBoldFont = () => {
    if (Platform.OS === 'ios') {
        return "OpenSans-Bold";
    } else {
        return "OpenSans-Bold";
    }
}

// regular syne fonts
export const getSyneRegularFont = () => {
    if (Platform.OS === 'ios') {
        return "Syne-Regular";
    } else {
        return "Syne-Regular";
    }
}

// regular inter fonts
export const getInterRegularFont = () => {
    if (Platform.OS === 'ios') {
        return "Inter_28pt-Bold";
    } else {
        return "Inter_28pt-Bold";
    }
}

// semibold inter fonts
export const getInterSemiBoldFont = () => {
    if (Platform.OS === 'ios') {
        return "Inter_28pt-SemiBold";
    } else {
        return "Inter_28pt-SemiBold";
    }
}

// bold inter fonts
export const getInterBoldFont = () => {
    if (Platform.OS === 'ios') {
        return "Inter_28pt-Bold";
    } else {
        return "Inter_28pt-Bold";
    }
}