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

// 学历
export default class Salary03 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workYear: ""
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  onPressItem(text) {
    // if (this.state.jobText == text) {
    this.context.refs["calcSalaryScreen"].state.p.data.degree = text;
    this.context.refs["calcSalaryScreen"].state.choosed["3"] = true;
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
            英雄莫问出处，学历这些都是浮云！
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

        <GroupItem groupName="我不问，你自己说">
          <CityItem
            checked={this.state.workYear === "博士" ? true : false}
            title={"博士真学霸"}
            onPress={this.onPressItem.bind(this, "博士")}
          />
          <CityItem
            checked={this.state.workYear === "硕士" ? true : false}
            title={"硕士学问家"}
            onPress={this.onPressItem.bind(this, "硕士")}
          />
          <CityItem
            checked={this.state.workYear === "本科" ? true : false}
            title={"本科大法好"}
            onPress={this.onPressItem.bind(this, "本科")}
          />
          <CityItem
            checked={this.state.workYear === "专科" ? true : false}
            title={"专科逆袭王"}
            onPress={this.onPressItem.bind(this, "专科")}
          />
        </GroupItem>
      </View>
    );
  }
}

class GroupItem extends React.Component {
  render() {
    return (
      <View>
        <Text
          style={{
            color: "#999",
            fontSize: CSS.pixel(28),
            marginBottom: CSS.pixel(20)
          }}
        >
          {this.props.groupName}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {this.props.children}
        </View>
      </View>
    );
  }
}

class CityItem extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          paddingHorizontal: CSS.pixel(26),
          justifyContent: "center",
          borderColor: this.props.checked === true ? SDMainColor : "#e1e1e1",
          borderRadius: CSS.pixel(3),
          borderWidth: 1,
          height: CSS.pixel(70, true),
          marginRight: CSS.pixel(20),
          marginBottom: CSS.pixel(20, true)
        }}
        onPress={this.props.onPress ? this.props.onPress : null}
      >
        <Text
          style={{
            fontSize: CSS.pixel(30),
            color: this.props.checked ? SDMainColor : "#666"
          }}
        >
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}
