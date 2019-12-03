/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  TouchableOpacity,
  Image
} from "react-native";

// import { BoxShadow } from "react-native-shadow";

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  imgBtn: {
    width: 145 * 1.2,
    height: 40 * 1.2,
    marginTop: Platform.OS == "ios" ? 10 : 20
  }
});

// 任务完成数统计
export default class CountBtn extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.6}>
          <Image
            style={styles.imgBtn}
            source={require("../../../img/home-btn-01.jpg")}
            resizeMode="stretch"
          />
        </TouchableOpacity>
      </View>
    );
  }
}
