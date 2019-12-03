/* @flow */
import React, { PureComponent } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { formatPower } from "@utils/user"

type Props = {
  styleName: string,
  power: number,
  salary: number,
  height: number
};

export default class PowerNSalary extends PureComponent<Props> {
  props: Props;
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };
  state = {
    isIntl: false
  };

  onPressAction(){
    if(typeof this.props.onPress === 'function') this.props.onPress();
  }

  render() {
    const { style, styleName, power, salary, height, onPress } = this.props;
    const _height = typeof height === "number" ? height : CSS.pixel(80);
    const Container = (typeof onPress === 'function') ? TouchableOpacity : View;
    return (
      <Container
        style={[{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          // width: CSS.pixel(550),
          height: _height,
          marginHorizontal: CSS.pixel(40),
          marginTop: CSS.pixel(40),
          marginBottom: CSS.pixel(50),
          borderWidth: 0,
          borderColor: "#f00"
        }, style]}
        onPress={this.onPressAction.bind(this)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            borderWidth: 0,
            borderColor: "#f00"
          }}
        >
          <Text
            style={{
              fontSize: CSS.textSize(30),
              color: sdStyles.SDFontColorMain
            }}
          >
            职么力
          </Text>
          <Text
            style={{
              fontSize: CSS.textSize(30),
              color: sdStyles.SDMainColor,
              marginRight: CSS.pixel(30),
             }}
          >
            {formatPower(power)}分
          </Text>

          <Text
            style={{
              fontSize: CSS.textSize(30),
              color: sdStyles.SDFontColorMain
            }}
          >
            预估薪资
          </Text>
          <Text
            style={{ fontSize: CSS.textSize(30), color: sdStyles.SDMainColor }}
          >
            ¥{salary}
          </Text>
        </View>
      </Container>
    );
  }
}
