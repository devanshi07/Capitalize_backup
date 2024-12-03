import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
const IncrementIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 24 24"
    {...props}
  >
    <G
      fill="none"
      stroke={props.color || "#fff"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <Path d="m19 13-7-6-7 6" />
      <Path d="m19 17-7-6-7 6" />
    </G>
  </Svg>
);
export default IncrementIcon;
