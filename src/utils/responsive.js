import { heightPercentageToDP } from "react-native-responsive-screen";

const one_dp = 0.116666;

const resp = (value) => {
  const calculatedValue = value * one_dp;

  return heightPercentageToDP(calculatedValue);
};

export { resp };
