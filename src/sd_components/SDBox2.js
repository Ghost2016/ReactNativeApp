/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground
} from "react-native";
//import { List } from "../common/index";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDButton from "@sd_components/SDButton";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

type Props = {};

export default class SDBox2 extends PureComponent<Props> {
  props: Props;
  static contextTypes = {
    navigator: PropTypes.object.isRequired
    //intl: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }
  onPressAction() {
    if (typeof this.props.onPress === "function") this.props.onPress();
  }

  render() {
    const { header, body, footer, btnTitle, height } = this.props;
    const noBtn = true;
    //console.log("title====", title);
    return (
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          margin: 0,
          width: width,
          overflow: "visible",
          borderWidth: 0,
          borderColor: "#f00",
          backgroundColor: sdStyles.SDBGColorMain,
        }}
      >
        <View
          style={{
            alignItems: "center",
            //paddingVertical: 0,
            backgroundColor: "#fff",
            paddingTop: CSS.pixel(50, true),
            paddingBottom: CSS.pixel(0, true)
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: width,
              backgroundColor: "#fff",
            }}
          >
            {typeof header === "function" ? header() : null}
          </View>
        </View>

        <View
          style={{
            paddingVertical: 10,
            backgroundColor: "#fff",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 0,
            borderColor: "#f00"
          }}
        >
          <View
            style={{
              width: "90%",
              height: height || 280,
              overflow: "hidden",
              borderWidth: 0,
              borderColor: '#f00',
              //overflow: 'hidden',
            }}
          >
            {typeof body === "function" ? body() : null}
          </View>
          <View style={{
            zIndex: 10,
            position: 'relative',
            top: Platform.OS == "android"?CSS.pixel(-60, true) : CSS.pixel(-20, true),
            width: CSS.pixel(550),
            height: CSS.pixel(50, true),
            borderWidth: 0,
            borderColor: '#f00',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {typeof footer === "function" ? footer() : null}
          </View>
        </View>

        {!noBtn ? (
          <SDButton
            style={{
              flexDirection: "column",
              alignSelf: "center",
              marginVertical: 20,
              backgroundColor: sdStyles.SDMainColor,
              borderRadius: 20,
              width: CSS.pixel(550),
              zIndex: 6,
              position: "relative",
              top: 0
            }}
            btnStyle={{
              fontSize: CSS.pixel(36),
              color: "#fff",
              position: "relative",
              top: 0 //-4
            }}
            onPress={this.onPressAction.bind(this)}
            title={typeof btnTitle === "function" ? btnTitle() : btnTitle}
          />
        ) : null}
      </View>
    );
  }
}
