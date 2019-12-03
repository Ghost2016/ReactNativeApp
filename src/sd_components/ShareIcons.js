/* @flow */
import React, { PureComponent } from "react";
import { View, Text, Platform } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDImage from "@sd_components/SDImage";
// import LineSplit from "@sd_components/LineSplit";
import Line from "@sd_components/Line";

type Props = {
  onPress: () => void
};

//const shareToWeixin = require("@img/share2.png");
//const shareToFriend = require("@img/share3.png");

const getIconImg = type => {
  const icons = {
    weixin: require("@img/login/login_ico_WeChat.png")
    //friend: require("@img/share3.png"),
  };
  return icons[type] ? icons[type] : require("@img/login/login_ico_name.png");
};

export default class ShareIcons extends PureComponent<Props> {
  props: Props;

  onPressShare = source => {
    //Alert.alert(source);
    this.props.onPress(source);
  };

  render() {
    const { style, textStyle, lineStyle, iconList } = this.props;
    const _iconList = Array.isArray(iconList) ? iconList : [];
    return (
      <View
        style={[
          {
            flexDirection: "column",
            alignItems: "center",
            marginTop: CSS.pixel(0, true),
            width: CSS.pixel(550),
            height: Platform.OS == "android" ? CSS.pixel(139, true) : CSS.pixel(129, true),
            //borderTopWidth: 1,
            //borderTopColor: '#f0f',
            //backgroundColor:'#ccc'
          }, style
        ]}
      >
        {/* <LineSplit lineStyle={lineStyle} /> */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Line style={[{
            flex: 1,
            backgroundColor: "#b4b4b1",
            position: 'relative',
            top: CSS.pixel(-6, true),
           }, lineStyle]} />
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              top: CSS.pixel(-4, true),
            }}
          >
            <Text
              style={[
                {
                  textAlign: "center",
                  backgroundColor: "#fff",
                  marginHorizontal: 10,
                },
                textStyle
              ]}
            >
              第三方登录
            </Text>
          </View>
          <Line style={[{
            flex: 1,
            backgroundColor: "#b4b4b1",
            position: 'relative',
            top: CSS.pixel(-6, true),
           }, lineStyle]} />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            top: CSS.pixel(29),
          }}
        >
          {_iconList.map((n, i) => {
            return (
              <SDImage
                key={i}
                style={{
                  marginHorizontal: 8,
                 }}
                imgStyle={{
                  width: CSS.pixel(78),
                  height: CSS.pixel(78, true),
                  borderRadius: 5,
                }}
                source={getIconImg(n.type)}
                onPress={this.onPressShare.bind(this)}
                alt={n.title || ""}
              />
            );
          })}
        </View>
      </View>
    );
  }
}
