/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { Icon } from "@shoutem/ui";
import defaultStyle from "@styles";
import * as sdStyles from "@src/styles";
import { CSS } from "@common/SDCSS";

const styles = StyleSheet.create({
  container: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

// 我的履历 - 任务量化Item
export default class TitleWrap extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    return (
      <View
        style={[styles.container, defaultStyle.flexRow, defaultStyle.center]}
      >
        <View
          style={{
            width: 1,
            height: CSS.pixel(28, true),
            marginRight: CSS.pixel(14),
            borderLeftColor: this.props.borderColor
              ? this.props.borderColor
              : sdStyles.SDFontColorMain,
            borderLeftWidth: CSS.pixel(4),
            //borderWidth: 0,
            //borderColor: '#f00',
          }}
        />
        <View style={{
            flex: 1,
            justifyContent: "center",
            borderWidth: 0,
            borderColor: '#f00', }}>
          <Text style={{
            color: sdStyles.SDFontColorMain,
            fontSize: CSS.textSize(28),
            fontWeight: sdStyles.SDFontBold,
             }}>
            {this.props.title}
          </Text>
        </View>
        <TouchableOpacity
          onPress={this.props.onPress ? this.props.onPress : null}
          style={{
            flexDirection: "row",
            width: 120,
            height: "100%",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          {this.props.icon ? (
            typeof this.props.icon === "string" ? (
              <Icon name={this.props.icon} style={this.props.iconStyle || {}} />
            ) : typeof this.props.icon === "object" ? (
              this.props.icon
            ) : (
              this.props.icon()
            )
          ) : null}

          <Text style={{
            color: this.props.moreColor ? this.props.moreColor : "#fed200",
            fontSize: this.props.moreSize ? this.props.moreSize : 12,
             }}>
            {(this.props.subInfo ? " " + this.props.subInfo : "")}
          </Text>
          <Text style={{
            color: this.props.moreColor ? this.props.moreColor : "#fed200",
            fontSize: this.props.moreSize ? this.props.moreSize + 4 : 12,
            //fontWeight: sdStyles.SDFontMedium,
            position: 'relative',
            top: CSS.pixel(-3, true),
             }}>
            {(this.props.direction ? " " + this.props.direction : "")}
          </Text>
          {this.props.arrow ? <Image
                source={this.props.arrow}
                resizeMode="contain"
                style={{
                  marginLeft: CSS.pixel(10),
                  width: CSS.pixel(10),
                 }}
              /> : null}
        </TouchableOpacity>
      </View>
    );
  }
}
