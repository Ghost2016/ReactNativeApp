import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform
} from "react-native";
import ScroeProgress from "../../sd_scroeprogress/ScroeProgress";
export default class CardPipe extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <ScroeProgress scoreNum={40.6} />
        <View
          style={{
            flex: 1,
            backgroundColor: "#ccc"
          }}
        />
      </View>
    );
  }
}
