/* @flow */
import React, { PureComponent } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDIcon from "@sd_components/SDIcon";

type Props = {};

export default class SDInputHalf2 extends PureComponent<Props> {
  props: Props;
  constructor(props) {
    super(props);
  }

  render() {
    //console.log("this.state.newInputStyle.container.width", this.state.newInputStyle.container.width)
    const {
      placeholder,
      placeholderTextColor,
      type,
      refName,
      onChange,
      icon,
      right,
      style,
      inputStyle,
      ...otherProps,
    } = this.props;
    const _placeholder = placeholder ? placeholder : "请输入";
    const _type = type ? type : "text";
    const _placeholderTextColor = placeholderTextColor
      ? placeholderTextColor
      : sdStyles.SDFontColorSubtitle;
    return (
      <View
        style={[{
          flexDirection: "row",
          alignContent: "flex-start",
          zIndex: 2,
          position: "relative",
          left: CSS.pixel(-80),
          width: CSS.pixel(634),
          backgroundColor: "transparent"
        }, style]}
      >
        {icon ? <SDIcon
                        source={icon}
                        style={{
                          position: 'relative',
                          top: 0,
                          left: CSS.pixel(74),
                        }}
                      /> : null}
        <TextInput
            style={[{
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "#fff",
                flex: 1,
                fontSize: CSS.textSize(24),
                height: CSS.pixel(80, true),
                width: CSS.pixel(380),
                paddingLeft: CSS.pixel(68),
                marginBottom: CSS.pixel(30, true),
            }, inputStyle]}
          placeholderTextColor={_placeholderTextColor}
          placeholder={_placeholder}
          onChangeText={onChange}
          ref={refName}
          type={_type}
          secureTextEntry={_type == "password" ? true : false}
          autoCorrect={false}
          spellCheck={false}
          returnKeyType={this.props.returnKeyType ?this.props.returnKeyType : "done"}
          returnKeyLabel={this.props.returnKeyLabel ?this.props.returnKeyLabel : "完成"}
          underlineColorAndroid="transparent"
          {...otherProps}
        />
        {typeof right === "function" ? right() : null}
      </View>
    );
  }
}
