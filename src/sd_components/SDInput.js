/* @flow */
import React, { PureComponent } from "react";
import { View, StyleSheet,TextInput} from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { InputItem } from "antd-mobile";

import InputItemStyle from "antd-mobile/es/input-item/style/index.native";

//定制颜色样式
const newInputStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    newInputStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
  }
}
/*newInputStyle.text = {
  color:"#fff",
  fontSize:CSS.textSize(24),
  marginRight:0,
  textAlignVertical:"center",
}*/
//input
newInputStyle.input = {
  backgroundColor: "rgba(0,0,0,0.5)",
  color: "#fff",
  flex: 1,
  fontSize: CSS.textSize(24),
  height: CSS.pixel(80),
  paddingLeft: CSS.pixel(68)
};
/*newInputStyle.extra = {
  color:"#f00",
  fontSize:CSS.textSize(24),
  marginLeft:0, //CSS.pixel(63)
}*/
/*newInputStyle.inputErrorColor = {
  color:"#f00",
}*/
newInputStyle.container = {
  width: CSS.pixel(556),
  borderBottomWidth: 0,
  borderBottomColor: "transparent",
  flexDirection: "row",
  height: CSS.pixel(80),
  margin: CSS.pixel(15)
};
//console.log("newInputStyle", newInputStyle)

type Props = {};

export default class SDInput extends PureComponent<Props> {
  props: Props;
  constructor(props) {
    super(props);
  }
  /*state={
    newInputStyle : newInputStyle
  }*/
  /*componentWillMount(){
    const { width } = this.props;
    if(width){
      const _newInputStyle = Object.assign(newInputStyle, {
        container: {
          width: width, //CSS.pixel(380),
          borderBottomWidth: 0,
          borderBottomColor: "transparent",
          flexDirection: "row",
          height: CSS.pixel(80),
          margin: CSS.pixel(15)
        }
      })
      this.setState({
        newInputStyle : _newInputStyle
      })
    } else {
      this.setState({
        newInputStyle : newInputStyle
      })
    }
  }*/
  render() {
    //console.log("this.state.newInputStyle.container.width", this.state.newInputStyle.container.width)
    const {
      placeholder,
      placeholderTextColor,
      type,
      refName,
      onChange,
      icon,
      right
    } = this.props;
    const _placeholder = placeholder ? placeholder : "请输入";
    const _type = type ? type : "text";
    const _placeholderTextColor = placeholderTextColor
      ? placeholderTextColor
      : "#666";
    return (
      <View
        style={{
          flexDirection: "row",
          alignContent: "flex-start",
          zIndex: 2,
          position: "relative",
          left: CSS.pixel(-100),
          width: CSS.pixel(650)
        }}
      >
        {typeof icon === "function" ? icon() : null}
        <InputItem
          styles={newInputStyle}
          placeholderTextColor={_placeholderTextColor}
          placeholder={_placeholder}
          onChange={onChange}
          onSubmitEditing={this.props.onSubmitEditing ? this.props.onSubmitEditing : null}
          ref={refName}
          type={_type}
          returnKeyLabel={this.props.returnKeyLabel ? this.props.returnKeyLabel: "完成"}
          returnKeyType={this.props.returnKeyType ? this.props.returnKeyType : "done"}
          autoCorrect={false}
          spellCheck={false}
          testID={this.props.testID}
        />
        {typeof right === "function" ? right() : null}
      </View>
    );
  }
}
