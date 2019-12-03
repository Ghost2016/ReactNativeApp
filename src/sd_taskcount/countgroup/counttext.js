/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform
} from "react-native";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";

const styles = StyleSheet.create({
  textCountWrap: {
    //height: 30,
    flexDirection: "row",
    // justifyContent: "space-around",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderColor: "#f00",
    marginBottom: CSS.pixel(22, true)
  },
  textNomarl: {
    color: "#999",
    fontSize: CSS.textSize(24)
  },
  textBold: {
    color: sdStyles.SDMainColor,
    fontWeight: "bold",
    fontSize: CSS.textSize(24)
  }
});

// 任务完成数统计
export default class CountText extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    const { weekTask, weekPowerUp } = this.props;
    return (
      <View style={styles.textCountWrap}>
        <Text style={styles.textNomarl}>
          本周完成任务数
          <Text style={styles.textBold}>{weekTask || 0}</Text>
        </Text>
        <Text
          style={[
            styles.textNomarl,
            {
              marginLeft: CSS.pixel(34, true)
            }
          ]}
        >
          职么力增长
          <Text style={styles.textBold}>{weekPowerUp || 0}分</Text>
        </Text>
      </View>
    );
  }
}
