/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  Fragment,
  Image,
  View,
  Text
} from "react-native";
import * as sdStyles from "@styles";
import GrowGoalList from "@sd_components/GrowGoalList";
//import SDRadioList, {SDRadioForm} from "@sd_components/SDRadioList";
//import RadioForm from "react-native-simple-radio-button";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");
//console.log("width", width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

// 成长 - 我的目标
export default class GrowGoal extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }
  state = {};

  componentDidMount() {}
  //componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <GrowGoalList selectMode={true} />
      </View>
    );
  }
}
