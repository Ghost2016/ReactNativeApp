/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView
} from "react-native";
import defaultStyle from "@styles/index";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingLeft: 10
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },
  titleBox: {
    height: 40,
    justifyContent: "flex-start",
    alignItems: "center"
  }
});

// 学历时间线
export default class SchoolTimeLine extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <SchoolTimeLineTitle title={this.props.title} />
        <SchoolProfile />
      </View>
    );
  }
}

class SchoolTimeLineTitle extends React.PureComponent {
  render() {
    return (
      <View style={[defaultStyle.flexRow, styles.titleBox]}>
        <View style={styles.dot} />
        <View style={{ justifyContent: "center" }}>
          <Text>{this.props.title}</Text>
        </View>
      </View>
    );
  }
}

class SchoolProfile extends React.PureComponent {
  render() {
    return (
      <View
        style={{
          alignContent: "flex-start",
          justifyContent: "space-around",
          paddingLeft: 15
        }}
      >
        <Text style={[defaultStyle.fontMainColor, { fontSize: 14 }]}>
          西北工业大学
        </Text>
        <Text style={[defaultStyle.fontSubColor, { fontSize: 12 }]}>
          本科-计算机软件工程
        </Text>
      </View>
    );
  }
}
