import React from "react";
import {
  View,
  Text
} from "react-native";
import PropTypes from "prop-types";
import { CSS } from "../common/SDCSS";

// 编辑自我评价表单
export default class FooterLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      contact: this.props.phone || "",
      isDisabled: true
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: CSS.pixel(160),
          justifyContent: "center",
          alignItems: "center",
          marginTop: CSS.pixel(10),
          marginBottom: CSS.pixel(40)
        }}
      >
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: "#DFDFDF"
          }}
        />
        <View style={{paddingHorizontal: 10}}>
          <Text style={{color: '#999', fontSize: CSS.textSize(24)}}>我是有底线的</Text>
        </View>
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: "#DFDFDF"
          }}
        />
      </View>
    );
  }
}


