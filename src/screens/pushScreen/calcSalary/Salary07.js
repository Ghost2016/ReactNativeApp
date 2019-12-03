import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
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

// 男女选择
export default class Salary07 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workYear: "",
      pageIndex: typeof this.props.pageIndex !== 'undefined' ? this.props.pageIndex + "" : "7"
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  onPressItem(text) {
    // if (this.state.constellationText == text) {
    this.context.refs["calcSalaryScreen"].state.p.data.gender = text;
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
              fontWeight: "bold",
              lineHeight: CSS.pixel(40, true)
            }}
          >
            正确的自我认识
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
        <GroupItem groupName="你觉得你是">
          <CityItem
            checked={this.state.workYear === "男" ? true : false}
            title={"安静的美男子"}
            onPress={this.onPressItem.bind(this, "男")}
          />
          <CityItem
            checked={this.state.workYear === "女" ? true : false}
            title={"豪迈的萌妹子"}
            onPress={this.onPressItem.bind(this, "女")}
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
