/* @flow */
import React, { PureComponent } from "react";
import {
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
  Dimensions,
  Platform
} from "react-native";
import PropTypes from "prop-types";
import { Toast } from "antd-mobile";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { isIphoneX } from "@utils/iphonex";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

type Props = {};

const img1 = require("@img/growPath/growing_path_job.png");
const img2 = require("@img/growPath/growing_path_civil_servant.png");
const img3 = require("@img/growPath/growing_path_Postgraduate.png");
const img4 = require("@img/growPath/growing_path_study_abroad.png");
const img5 = require("@img/growPath/growing_path_work.png");

export default class ImageChoose extends PureComponent<Props> {
  props: Props;

  state = {
    current: 0,
    imgs: [img5, img4, img1, img2, img3]
  };

  onPressAction_old() {
    let c = this.state.current;
    if (this.state.current < this.state.imgs.length - 1) {
      c++;
    } else {
      c = 0;
    }
    this.setState({
      current: c
    });
    if (typeof this.props.onPress === "function") this.props.onPress(c);
  }

  onPressAction1() {
    Toast.info("暂未开放！", 0.1)
    return false;
    this.setState({
      current: 1
    });
    if (typeof this.props.onPress === "function") this.props.onPress(1, "留学");
  }
  onPressAction2() {
    this.setState({
      current: 2
    });
    if (typeof this.props.onPress === "function") this.props.onPress(2, "求职");
  }
  onPressAction3() {
    Toast.info("暂未开放！", 0.1)
    return false;
    this.setState({
      current: 3
    });
    if (typeof this.props.onPress === "function") this.props.onPress(3, "公务员");
  }
  onPressAction4() {
    Toast.info("暂未开放！", 0.1)
    return false;
    this.setState({
      current: 4
    });
    if (typeof this.props.onPress === "function") this.props.onPress(4, "考研");
  }

  render() {
    const { style, size } = this.props;
    const _size = size ? size : 180;
    const borderWidth = 0;
    return (
      <View
        style={{
          //flex: 1,
          //alignSelf: "stretch",
          width: '100%', //CSS.pixel(540),
          //height: CSS.pixel(650, true),
          /* height:
            Platform.OS === "android"
              ? CSS.pixel(880, true)
              : CSS.pixel(780, true), */
          borderWidth: 0,
          borderColor: "#ff0",
          alignSelf: 'center',
        }}

      >

        <TouchableOpacity
          style={{
            borderWidth: borderWidth,
            borderColor: "#333",
            height: "100%",
            justifyContent: "center",
            position:'relative',
            //留学
            top:isIphoneX()? CSS.pixel(286, true) : CSS.pixel(386, true),
            left:CSS.pixel(460),
            width: CSS.pixel(_size),
            height: CSS.pixel(_size, true),
            zIndex: 15,
          }}
          onPress={this.onPressAction1.bind(this)}
        />
        <TouchableOpacity
          style={{
            borderWidth: borderWidth,
            borderColor: "#333",
            height: "100%",
            justifyContent: "center",
            position:'relative',
            //求职
            top:isIphoneX()? CSS.pixel(290, true) : CSS.pixel(390, true),
            left:CSS.pixel(360),
            width: CSS.pixel(_size),
            height: CSS.pixel(_size, true),
            zIndex: 15,
          }}
          onPress={this.onPressAction2.bind(this)}
        />
        <TouchableOpacity
          style={{
            borderWidth: borderWidth,
            borderColor: "#333",
            height: "100%",
            justifyContent: "center",
            position:'relative',
            //公务员
            top:isIphoneX()? CSS.pixel(104, true) : CSS.pixel(204, true),
            left:CSS.pixel(150),
            width: CSS.pixel(_size),
            height: CSS.pixel(_size, true),
            zIndex: 15,
          }}
          onPress={this.onPressAction3.bind(this)}
        />
        <TouchableOpacity
          style={{
            borderWidth: borderWidth,
            borderColor: "#333",
            height: "100%",
            justifyContent: "center",
            position:'relative',
            //考研
            top:isIphoneX()? CSS.pixel(-260, true) : CSS.pixel(-160, true),
            left:CSS.pixel(50),
            width: CSS.pixel(_size),
            height: CSS.pixel(_size, true),
            zIndex: 15,
          }}
          onPress={this.onPressAction4.bind(this)}
        />
        <Image source={this.state.imgs[this.state.current]}
          style={{
            position: "absolute",
            top: Platform.OS == "android" ? CSS.pixel(0) : CSS.pixel(20),
            //left: CSS.pixel(10),
            //width: Platform.OS == "android" ? CSS.pixel(620) : CSS.pixel(670),
            //height: Platform.OS == "android" ? CSS.pixel(680) : CSS.pixel(610),
            width: CSS.pixel(690 * 0.8),
            height: CSS.pixel(896 * 0.8),
            resizeMode: "contain",
            zIndex: 5,
            borderWidth: 0,
            borderColor: "#f0f",
            alignSelf: 'center',
          }}
        />
      </View>
    );
  }
}
