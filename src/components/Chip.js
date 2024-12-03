import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { resp } from "../utils/responsive";
import { colors } from "../utils/colors";

const Chip = ({ text, isOngoing }) => {
  return (
    <View
      style={[
        styles.chipContainer,
        {
          backgroundColor: isOngoing
            ? colors.success + "80"
            : colors.danger + "80",
        },
      ]}
    >
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
};

export default Chip;

const styles = StyleSheet.create({
  chipContainer: {
    paddingVertical: resp(4),
    paddingHorizontal: resp(10),
    width: resp(70),
    height: resp(22),
    borderRadius: resp(7),
    opacity: 0.8,
  },
  chipText: {
    fontSize: resp(10),
    color: colors.foreground,
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: resp(0.4),
  },
});
