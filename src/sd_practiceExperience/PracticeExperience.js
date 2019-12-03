import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import SDList from "../common/SDList";
import PropTypes from "prop-types";
import { navScreen } from "@styles";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  }
});

//
export default class PracticeExperience extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <View style={styles.container}>
        <SDList
          listOptions={[
            {
              name: "2017.9-2017.12",
              subTitle: "蓝光国际有限公司/产品经理",
              direction: "编辑",
              listItemNameStyle: {
                fontSize: 14,
                color: "#666"
              },
              subTitleStyle: {
                fontSize: 14,
                color: "#666"
              },
              directionStyle: {
                fontSize: 14,
                color: "#fed200",
                marginRight: 5
              },
              bottomBorder: true,
              footter: (
                <PracticeRemark content="负责公司App产品规划，版本迭代实施，产品原型设计，跟进研发需求沟通等" />
              ),
              onPress: () => {
                this.context.navigator.push(
                  navScreen("EditPracticeScreen", "编辑实习经历")
                );
              }
            },
            {
              name: "2017.9-2017.12",
              subTitle: "蓝光国际有限公司/产品经理",
              direction: "编辑",
              listItemNameStyle: {
                fontSize: 14,
                color: "#666"
              },
              subTitleStyle: {
                fontSize: 14,
                color: "#666"
              },
              directionStyle: {
                fontSize: 14,
                color: "#fed200",
                marginRight: 5
              },
              bottomBorder: true,
              footter: (
                <PracticeRemark content="负责公司App产品规划，版本迭代实施，产品原型设计，跟进研发需求沟通等" />
              ),
              onPress: () => {
                this.context.navigator.push(
                  navScreen("EditPracticeScreen", "编辑实习经历")
                );
              }
            }
          ]}
        />
      </View>
    );
  }
}

class PracticeRemark extends React.PureComponent {
  render() {
    return (
      <View style={{ padding: 10 }}>
        <View style={{ padding: 10, backgroundColor: "#f5f5f5" }}>
          <Text style={{ color: "#999", lineHeight: 18 }}>
            {this.props.content}
          </Text>
        </View>
      </View>
    );
  }
}
