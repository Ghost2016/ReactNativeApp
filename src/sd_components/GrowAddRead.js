import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import { DatePicker, List } from "antd-mobile";
import LabelInput from "../common/SDLabelInput";
import { SDTakePhoto } from "@common";
import { Navigation } from "react-native-navigation";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height:
      Platform.OS === "ios"
        ? Dimensions.get("window").height - 130
        : Dimensions.get("window").height - 150
  },
  saveBtnBox: {
    marginTop: 20,
    height: 46,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden"
  }
});

// 添加书单
export default class GrowAddRead extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  state = {
    date: "2小时"
  };

  onChangDate(value) {
    this,
      setState({
        date: value
      });
  }

  onPressFinish() {
    Navigation.showLightBox({
      screen: "example.GrowCheckinScreen",
      style: {
        backgroundBlur: "xlight", //'dark' / 'light' / 'xlight' / 'none'
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        tapBackgroundToDismiss: true
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>添加书单</Text>
      </View>
    );
  }
}
