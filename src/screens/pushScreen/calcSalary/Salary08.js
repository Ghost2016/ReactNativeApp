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
import { SDMainColor } from "../../../styles";
import PropTypes from "prop-types";
import { CSS } from "../../../common/SDCSS";

const wIs320 = Dimensions.get("window").width <= 320;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  }
});

// 计算薪资
export default class Salary08 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workYear: "",
      pageIndex: typeof this.props.pageIndex !== 'undefined' ? this.props.pageIndex + "" : "8"
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  onPressItem(index, text) {
    this.context.refs["calcSalaryScreen"].state.p.ext.q1 = {};
    this.context.refs["calcSalaryScreen"].state.p.ext.q1[index] = text;
    this.context.refs["calcSalaryScreen"].state.choosed[this.state.pageIndex] = true;
    this.context.refs['calcSalaryScreen'].snapNext();
    this.setState({
      workYear: text
    });
  }
  render() {
    return (
      <View
        style={[
          styles.container,
          {
            paddingHorizontal: CSS.pixel(30),
            paddingVertical: CSS.pixel(50, true)
          }
        ]}
      >
        <View>
          <Text
            style={{
              fontSize: CSS.pixel(32),
              color: "#333",
              fontWeight: "bold"
            }}
          >
            如果BOSS周末给你打电话，你第一反应是
          </Text>
        </View>
        <View
          style={{
            marginTop: CSS.pixel(40, true),
            marginBottom: CSS.pixel(70, true),
            width: CSS.pixel(60),
            borderBottomColor: "#333",
            borderBottomWidth: CSS.pixel(6)
          }}
        />

        <ButtonItem
          checked={
            this.state.workYear === "妈蛋，肯定又让我加班" ? true : false
          }
          onPress={this.onPressItem.bind(this, 1, "妈蛋，肯定又让我加班")}
          title={"妈蛋，肯定又让我加班"}
        />
        <ButtonItem
          checked={
            this.state.workYear === "难道工作出什么突发状况了？" ? true : false
          }
          onPress={this.onPressItem.bind(this, 2, "难道工作出什么突发状况了？")}
          title={"难道工作出什么突发状况了？"}
        />
        <ButtonItem
          checked={
            this.state.workYear === "新发现一家不错的餐厅，相约一同前往" ? true : false
          }
          onPress={this.onPressItem.bind(
            this,
            3,
            "新发现一家不错的餐厅，相约一同前往"
          )}
          title={"新发现一家不错的餐厅，相约一同前往"}
        />
      </View>
    );
  }
}

class ButtonItem extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          paddingHorizontal: CSS.pixel(26),
          justifyContent: "center",
          borderColor: this.props.checked === true ? SDMainColor : "#e1e1e1",
          borderRadius: CSS.pixel(3),
          borderWidth: 1,
          width: CSS.pixel(570),
          alignItems: "center",
          height: CSS.pixel(70, true),
          marginRight: CSS.pixel(20),
          marginBottom: CSS.pixel(20, true)
        }}
        onPress={this.props.onPress ? this.props.onPress : null}
      >
        <Text
          style={{
            width: '100%',
            flexWrap: 'wrap',
            fontSize: CSS.pixel(28),
            color: this.props.checked ? SDMainColor : "#666"
          }}
        >
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}
