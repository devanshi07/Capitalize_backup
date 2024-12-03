import { ActivityIndicator, Text, View } from "react-native";
import { colors } from "./colors";
import { SF } from "./dimensions";

// custom loading view
export const progressView = (isProgressVisible) => {
    return (
        <View style={{ backgroundColor: colors.themeBackground, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
                <Text style={{ fontSize: SF(15), color: "black", fontWeight: "300" }}>Loading</Text>
                <ActivityIndicator size="large" color={colors.themeGreen} />
            </View>
        </View>
    );
}