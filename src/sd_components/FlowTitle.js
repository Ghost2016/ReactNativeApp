/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Platform, Image } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
//import Dot from "@sd_components/Dot";

type Props = {
  step: number
};

const styles = StyleSheet.create({
  dot: {
    position: "relative",
    top: 5,
    left: 0,
    borderColor: sdStyles.SDBGColorMain,
    backgroundColor: sdStyles.SDBGColorMain,
    width: 14,
    height: 14,
    borderRadius: 10,
  },
  dotSelect: {
    position: "relative",
    top: 5,
    left: 0,
    width: 14,
    height: 14,
    borderRadius: 10,
  },
  innerDot: {
    backgroundColor: sdStyles.SDHelperColortable,
    width: 7,
    height: 7,
    borderRadius: 5,
   },
  innerDotSelected: {
    width: 7,
    height: 7,
    borderRadius: 5,
  }
});

const iconChoosed = require("@img/home/home_ico_set_goal_step1.png")
const iconUnChoosed = require("@img/home/home_ico_set_goal_step2_white.png")
const iconChoosed2 = require("@img/home/home_ico_set_goal_step2.png")

export default class FlowTitle extends PureComponent<Props> {
  props: Props;

  state = {
    _step: 1
  };

  componentWillMount() {
    const { step } = this.props;
    this.setState({
      _step: step
    });
  }

  render() {
    const { style, step } = this.props;
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          //height: CSS.pixel(60, true),
          //backgroundColor: "#fff",
          borderWidth: 0,
          borderColor: '#f00',
        }}
      >
        <View
          style={{
            width: CSS.pixel(120),
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
            zIndex: 5,
            //backgroundColor: "transparent",
            position: "relative",
            top: Platform.OS == "android" ? 0 : -2,
            left: 30,
            borderWidth: 0,
            borderColor: "#cff"
          }}
        >
          {/* <Dot
            style={
              [1, 2].includes(this.state._step) ? styles.dotSelect : styles.dot
            }
            innerStyle={
              [1, 2].includes(this.state._step)
                ? styles.innerDotSelected
                : styles.innerDot
            }
          /> */}
          {
            //[1, 2].includes(this.state._step) ? styles.dotSelect : styles.dot
            [1, 2].includes(this.state._step) ? <Image
              resizeMode='contain'
              style={{
                width:CSS.pixel(36),
                height:CSS.pixel(36, true),
              }}
             source={iconChoosed} /> : <Image
             resizeMode='contain'
             style={{
               width:CSS.pixel(36),
               height:CSS.pixel(36, true),
             }}
              source={iconUnChoosed} />
          }
          <Text
            style={{
              overflow: "visible",
              zIndex: 7,
              paddingTop: CSS.pixel(20, true),
              //backgroundColor: "transparent",
              position: "relative",
              top: CSS.pixel(-16, true),
              left: 0,
              borderWidth: 0,
              borderColor: "#ccc",
              color: sdStyles.SDFontColorMain, //[1, 2].includes(this.state._step) ? sdStyles.SDMainColor: sdStyles.SDFontColorMinor,
              fontSize: CSS.textSize(28),
            }}
          >
            选择行业
          </Text>
        </View>

        <View
          style={{
            zIndex: 2,
            width: CSS.pixel(280),
            height: 2,
            borderWidth: 0,
            borderColor: '#fff',//sdStyles.SDMainColor,
            backgroundColor: '#fff',
            //opacity: 0.5,
            position: "relative",
            top: Platform.OS == "android" ? CSS.pixel(-33, true) : CSS.pixel(-28, true),
          }}
        >
          <View
          style={{
            zIndex: 2,
            width: step == 1 ? CSS.pixel(135) : CSS.pixel(269),
            height: 2,
            borderWidth: 0,
            borderColor: '#fff',//sdStyles.SDMainColor,
            backgroundColor: sdStyles.SDFontColorMain,
            //opacity: 0.5,
            position: "relative",
            top: CSS.pixel(0, true),
            left: step == 1 ? CSS.pixel(10) : CSS.pixel(10),
          }} />

          </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
            zIndex: 5,
            //backgroundColor: "transparent",
            position: "relative",
            top: Platform.OS == "android" ? 0 : -2,
            left: -22,
            borderWidth: 0,
            borderColor: "#ffc"
          }}
        >
          {/* <Dot
            style={
              [2].includes(this.state._step) ? styles.dotSelect : styles.dot
            }
            innerStyle={
              [2].includes(this.state._step)
                ? styles.innerDotSelected
                : styles.innerDot
            }
          /> */}
          {
            //[2].includes(this.state._step) ? styles.dotSelect : styles.dot
            [2].includes(this.state._step) ? <Image
            resizeMode='contain'
            style={{
              width:CSS.pixel(36),
              height:CSS.pixel(36, true),
            }} source={iconChoosed2} /> : <Image
            resizeMode='contain'
            style={{
              width:CSS.pixel(36),
              height:CSS.pixel(36, true),
            }} source={iconUnChoosed} />
          }
          <Text
            style={{
              overflow: "visible",
              zIndex: 7,
              paddingTop: CSS.pixel(20, true),
              //backgroundColor: "transparent",
              position: "relative",
              top: CSS.pixel(-16, true),
              left: 0,
              borderWidth: 0,
              borderColor: "#ccc",
              color: sdStyles.SDFontColorMain, //[2].includes(this.state._step) ? sdStyles.SDMainColor: sdStyles.SDFontColorMinor,
              fontSize: CSS.textSize(28),
            }}
          >
            选择职位
          </Text>
        </View>
      </View>
    );
  }
}
