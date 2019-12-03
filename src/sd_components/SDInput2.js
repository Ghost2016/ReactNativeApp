/* @flow */
import React, { PureComponent } from "react";
import { View, StyleSheet,TextInput,Platform } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDIcon from "@sd_components/SDIcon";
import { Touchable } from "./index";

type Props = {};

const iconEyeClose = require("@img/login/login_ico_cloae_eye.png");
const iconEyeOpen = require("@img/login/login_ico_open_eye.png");

export default class SDInput2 extends PureComponent<Props> {
  props: Props;
  constructor(props) {
    super(props);
    state={
      type: 'password',
      eyeIcon: iconEyeClose,
    }
  }

  componentWillMount(){
    this.setState({
      type: this.props.type ? this.props.type : "text",
      eyeIcon: this.props.type == "password" ? iconEyeClose : iconEyeOpen,
    })
  };

  onPressEyeAction(){
    const temp = this.state.type == "password" ? "text" : "password"
    this.setState({
      type: temp,
      eyeIcon: temp == "password" ? iconEyeClose : iconEyeOpen,
    })
    if(typeof this.props.onPressEye == "function") this.props.onPressEye();
  }

  render() {
    //console.log("this.state.newInputStyle.container.width", this.state.newInputStyle.container.width)
    const {
      placeholder,
      placeholderTextColor,
      //type,
      refName,
      onChange,
      icon,
      right,
      style,
      inputStyle,
      ...otherProps,
    } = this.props;
    const _placeholder = placeholder ? placeholder : "请输入";
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
          width: CSS.pixel(622),
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
                paddingLeft: CSS.pixel(68),
                marginBottom: CSS.pixel(30, true),
            }, inputStyle]}
          placeholderTextColor={_placeholderTextColor}
          placeholder={_placeholder}
          onChangeText={onChange}
          onSubmitEditing={this.props.onSubmitEditing ? this.props.onSubmitEditing : null}
          ref={refName}
          type={this.state.type}
          secureTextEntry={this.state.type == "password" ? true : false}
          returnKeyLabel={this.props.returnKeyLabel ? this.props.returnKeyLabel: "完成"}
          returnKeyType={this.props.returnKeyType ? this.props.returnKeyType : "done"}
          autoCorrect={false}
          spellCheck={false}
          testID={this.props.testID}
          underlineColorAndroid="transparent"
          {...otherProps}
        />
        {/*  && this.props.isShowEye */}
        {(this.props.type == "password") ? <Touchable
            style={{
              zIndex: 10,
              width: CSS.pixel(80),
              height: Platform.OS == "android" ? CSS.pixel(80, true) : CSS.pixel(80, true),
              borderWidth: 0,
              borderColor: "#f00",
            }}
            onPress={this.onPressEyeAction.bind(this)}
            testID={"_icon_input_password_eye"}
          ><SDIcon
              source={this.state.eyeIcon}
              style={{
                //position: 'absolute',
                top: Platform.OS == "android" ? CSS.pixel(0, true) : CSS.pixel(0, true),
                left: Platform.OS == "android" ? CSS.pixel(0) : CSS.pixel(0),
                borderWidth: 0,
                borderColor: "#f00",
                zIndex: 10,
                backgroundColor: this.props.inputStyle.backgroundColor == "#fff" ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.5)",
                width: CSS.pixel(80),
                height: Platform.OS == "android" ? CSS.pixel(86, true) : CSS.pixel(80, true),
              }}
              imgStyle={{
                width: CSS.pixel(26),
                height: this.props.type == "password" ? CSS.pixel(14, true) : CSS.pixel(18, true),
              }}
            /></Touchable> : null}
        {typeof right === "function" ? right() : null}
      </View>
    );
  }
}
