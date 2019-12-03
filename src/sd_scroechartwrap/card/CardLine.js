import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform
} from "react-native";
export default class CardLine extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
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
