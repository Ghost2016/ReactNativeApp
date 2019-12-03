import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions
} from "react-native";
import ShowCurrCourse from "../../../sd_showCurrCourse/ShowCurrCourse";

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: Dimensions.get("window").width,
    backgroundColor: "#fed200",
    position: "absolute",
    bottom: 0,
    flexDirection: "row"
  }
});

//
export default class ScreenFootter extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  makeFootterBtnText() {
    let arrComps = [];
    for (let i = 0; i < this.props.options.length; i++) {
      const element = this.props.options[i];
      arrComps.push(
        <TouchableOpacity
          key={i}
          onPress={element.onPress ? element.onPress : null}
          activeOpacity={0.8}
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>{element.label}</Text>
        </TouchableOpacity>
      );
      // 判断是否需要竖线分割
      if (
        typeof this.props.hasLine === "undefined" ||
        this.props.hasLine !== false
      ) {
        if (i < this.props.options.length - 1) {
          arrComps.push(
            <View
              key={i + "line"}
              style={{
                height: 15,
                width: 1,
                borderLeftWidth: 1,
                borderColor: "#fff"
              }}
            />
          );
        }
      }
    }
    return arrComps;
  }
  render() {
    return <View style={styles.container}>{this.makeFootterBtnText()}</View>;
  }
}
