/* @flow */
import React, { PureComponent } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import DotArrow from "@sd_components/DotArrow";

type Props = {};

const iconArrowUpDark = require("@img/rank/rank_ico_screen1.png");
const iconArrowDownDark = require("@img/rank/rank_ico_screen2.png");

export default class SDCollapse extends PureComponent<Props> {
  props: Props;

  constructor(props) {
    super(props);
    state = {
      collapse: false
    };
  }

  componentWillMount() {
    this.setState({
      collapse:
        typeof this.props.collapse === "boolean" ? this.props.collapse : false
    });
  }

  onPressAction() {
    this.setState({
      collapse: !this.state.collapse
    });
    console.log("this.props.onPress======", this.props.onPress)
    if(typeof this.props.onPress === 'function'){
      this.props.onPress(this.state.collapse, this.props.data);
    }
  }

  render() {
    const {
      style,
      innerStyle,
      title,
      children,
      containerStyle,
      right
    } = this.props;
    return (
      <View
        style={[
          {
            width: "100%"
          },
          containerStyle
        ]}

      >
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={this.onPressAction.bind(this)}
        ><View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff", //sdStyles.SDBGColorMain,
              width: "100%",
              height: CSS.pixel(88, true),
              marginBottom: CSS.pixel(1, true)
            },
            style
          ]}
        >
          <DotArrow
            title=""
            style={{
              backgroundColor: sdStyles.SDMainColor,
              borderColor: sdStyles.SDMainColor,
              width: 6,
              height: 6,
              position: "relative",
              left: CSS.pixel(10)
            }}
            innerStyle={{
              backgroundColor: sdStyles.SDMainColor,
              width: 3,
              height: 3
            }}
            textStyle={{ color: sdStyles.SDMainColor }}
            onPress={() => {}}
          />
          <View
            style={{
              flexGrow: 1,
              borderWidth: 0,
              borderColor: "#f00"
            }}
          >
            <Text style={{
              fontSize: CSS.textSize(28),
              color: sdStyles.SDFontColorMain,
            }}>{title}</Text>
          </View>
          <View
            style={{
              width: CSS.pixel(80),
              height: CSS.pixel(80, true),
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 0,
              borderColor: "#f0f"
            }}
          >
            {typeof right === "function" ? (
              right()
            ) : (
              <Image
                source={
                  this.state.collapse ? iconArrowUpDark : iconArrowDownDark
                }
              />
            )}
          </View>
        </View></TouchableOpacity>
        {this.state.collapse ? null : children}
      </View>
    );
  }
}
