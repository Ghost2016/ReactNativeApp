/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView,
  Image
} from "react-native";
import PropTypes from "prop-types";
import defaultStyle, { navLightBox } from "@styles";
import { CSS } from "../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
    height: CSS.pixel(180, true)
  }
});

// 证书列表
export default class CertificateList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: this.props.style || {}
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  render() {
    return (
      <View
        style={[styles.container, defaultStyle.center, { ...this.state.style }]}
      >
        <View
          style={[
            defaultStyle.center,
            defaultStyle.flexRow,
            { height: CSS.pixel(50, true) }
          ]}
        >
          <View
            style={{
              width: CSS.pixel(40),
              alignItems: "flex-end",
              marginRight: CSS.pixel(10)
            }}
          >
            <Image source={require("@img/home/home_ico_choose.png")} />
          </View>
          <Text style={{ flex: 1, flexWrap: 'wrap' }}>{this.props.name}</Text>
          <Text style={{ width: CSS.pixel(180), textAlign: "right" }}>
            {this.props.time}
          </Text>
        </View>
        <View
          style={[
            defaultStyle.center,
            defaultStyle.flexRow,
            { height: CSS.pixel(50, true), paddingLeft: CSS.pixel(10) }
          ]}
        >
          <View style={{ width: CSS.pixel(40) }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#333", fontSize: 12 }}>
              成绩:{this.props.scroe}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
