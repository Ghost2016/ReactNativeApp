/* @flow */
import React, { PureComponent } from "react";
import { View, Image, Text, Platform } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";
import SDButton from "@sd_components/SDButton";

type Props = {};

//const iconFinished = require("@img/grow/growing_ico_read_finish.png");
//const iconFinished = require("@img/grow/growing_ico__finish.png");
const iconFinished = require("@img/grow/growing_ico__finishY.png");

export default class SelectButton extends PureComponent<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
      data: {},
      index: 0,
    };
  }

  onPressAction() {
    if (typeof this.props.onPress === "function")
      this.props.onPress(this.state.isSelected, this.props.data, this.state.index);
  }

  componentWillMount() {
    const { isSelected, data, index } = this.props;
    this.setState({
      isSelected: isSelected,
      data: data,
      index: index,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { isSelected, data, index } = nextProps;
    if(isSelected != this.props.isSelected) this.setState({
      isSelected: isSelected,
      data: data,
      index: index,
    });
  }

  render() {
    const { selectTitle, unSelectTitle, selectIcon, unSelectIcon, style, textSelectStyle, textStyle, icon } = this.props;
    const _selectTitle = selectTitle ? selectTitle : "已完成";
    const _unSelectTitle = unSelectTitle ? unSelectTitle : "完成";
    const _selectIcon = selectIcon ? selectIcon : null;
    const _unSelectIcon = unSelectIcon ? (
      unSelectIcon
    ) : (
      <Image
        source={icon ? icon : iconFinished}
        style={{
          marginHorizontal: CSS.pixel(10),
          borderWidth: 0,
          borderColor: "#00f",
          alignSelf: 'center',
          width: CSS.pixel(22),
          height: CSS.pixel(22),
        }}
      />
    );

    if (this.state.isSelected) {
      return (
        <SDButton
          style={[{
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: "transparent", //sdStyles.SDMainColor,
            backgroundColor: "transparent", //sdStyles.SDMainColor,
            borderRadius: 0,
            width: CSS.pixel(111),
            zIndex: 3,
            flexDirection: "row",
            justifyContent: "flex-start",
            height: CSS.pixel(50, true),
            borderWidth: 0,
            borderColor: "#00f",
          }, style]}
          title={() => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  position: "relative",
                  left: Platform.OS === "android" ? CSS.pixel(10) : CSS.pixel(10),
                }}
              >
                {_selectIcon}
                <Text
                  style={[{
                    fontSize: CSS.pixel(24),
                    color: sdStyles.SDMainColor, //'#fff',
                  }, textSelectStyle]}
                >
                  {_selectTitle}
                </Text>
              </View>
            );
          }}
          onPress={this.onPressAction.bind(this)}
        />
      );
    } else {
      return (
        <SDButton
          style={[{
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: sdStyles.SDMainColor,
            backgroundColor: sdStyles.SDMainColor,
            borderRadius: 2,
            width: Platform.OS === "android" ? CSS.pixel(111) : CSS.pixel(111),
            zIndex: 3,
            flexDirection: "row",
            justifyContent: "flex-start",
            height: CSS.pixel(50, true),
            position: "relative",
            left: CSS.pixel(Platform.OS === "android" ? -24 : -24),
            borderWidth: 0,
            borderColor: "#00f",
          }, style]}
          title={() => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  position: "relative",
                  left: Platform.OS === "android" ? CSS.pixel(0) : CSS.pixel(0),
                }}
              >
                {_unSelectIcon}
                <Text
                  style={[{
                    fontSize: CSS.pixel(24),
                    color: sdStyles.SDFontColorMain,
                    alignSelf: 'center',
                    //position: "relative",
                    //top: CSS.pixel(Platform.OS === "android" ? 1 : 1, true),
                    //left: Platform.OS === "android" ? CSS.pixel(-2) : CSS.pixel(0),
                  }, textStyle]}
                >
                  {_unSelectTitle}
                </Text>
              </View>
            );
          }}
          onPress={this.onPressAction.bind(this)}
        />
      );
    }
  }
}
