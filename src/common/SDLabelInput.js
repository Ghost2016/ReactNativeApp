import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity, TextInput } from "react-native";
import * as sdStyles from "@styles";
import { CSS } from "./SDCSS";

type Props = {
  placeholder: string,
  placeholderRight: string,
  direction: string,
  onPress: ?Function,
  onChange: ?Function,
  defaultValue: ?string,
  editable: ?boolean,
  fixStr: ?string,
  footter: ?React.CElement | ?Function,
  //other表示其它组件，替代input
  other: ?Function,
  footterStyle: ?object,
  placeholderRightColor: ?object,
  isPassword: ?boolean,
  keyboardType: ?string,
  disablePress: boolean,
  isSelector: ?boolean,
  titleFontStyle: ?object,
  placeholderColor: ?string
};

export default class LabelInput extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue || ""
    };
  }
  componentWillReceiveProps(next) {
    this.setState({
      value: next.defaultValue
    });
  }
  renderFootterView() {
    const footterStyle = this.props.footterStyle || {};
    return (
      <View
        style={[{ width: "100%" }, this.props.style]}
        onPress={this.props.onPress ? this.props.onPress : null}
      >
        <View
          style={{
            paddingLeft: CSS.pixel(30),
            borderBottomWidth: 1,
            borderColor: "#e1e1e1",
            ...footterStyle
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <View
              style={{
                width: this.props.placeholderWidth || 150,
                justifyContent: "center",
                alignItems: "flex-start",
                borderWidth: 0,
                borderColor: "#f00"
              }}
            >
              <Text style={[{ color: this.props.placeholderColor || "#666", fontSize: CSS.textSize(30) }, this.props.footerTitleStyle]}>
                {this.props.placeholder ? this.props.placeholder : "请输入文字"}
              </Text>
            </View>
            {this.props.isSelector ? (
              <View
                style={{
                  flex: 1,
                  paddingRight: 2,
                  justifyContent: "center",
                  alignItems: "flex-end"
                }}
              >
                <Text
                  style={{
                    fontSize: CSS.textSize(30),
                    color:
                      this.state.value && this.state.value != ""
                        ? "#333"
                        : "#999",
                    marginRight: this.props.fixStr ? 0 : CSS.pixel(20)
                  }}
                >
                  {this.state.value && this.state.value != ""
                    ? this.state.value
                    : _placeholderRight}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-end",
                  paddingRight: 2
                }}
                onPress={this.props.onPress ? this.props.onPress : null}
              >
                <TextInput
                  editable={
                    typeof this.props.editable !== "undefined"
                      ? this.props.editable
                      : true
                  }
                  returnKeyLabel="完成"
                  returnKeyType="done"
                  underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                  style={{
                    textAlign: "right",
                    width: "100%",
                    height: 40,
                    top: 1,
                    color: "#333",
                    borderBottomWidth: 0,
                    marginRight: this.props.fixStr ? 0 : CSS.pixel(20),
                    fontSize: CSS.textSize(30)
                  }}
                  secureTextEntry={this.props.isPassword ? true : false}
                  onTouchStart={this.props.onPress ? this.props.onPress : null}
                  keyboardType={
                    this.props.keyboardType
                      ? this.props.keyboardType
                      : "default"
                  }
                  value={this.state.value}
                  placeholder={this.props.placeholderRight || ""}
                  placeholderTextColor={
                    this.props.placeholderRight || sdStyles.SDFontColorSubtitle
                  }
                  onChangeText={this.onChange.bind(this)}
                />
              </TouchableOpacity>
            )}

            {this.props.fixStr ? (
              <View
                style={{
                  height: "100%",
                  justifyContent: "center",
                  marginRight: CSS.pixel(20)
                }}
              >
                <Text style={{ fontSize: CSS.textSize(30), color: "#333" }}>
                  {this.props.fixStr}
                </Text>
              </View>
            ) : null}
            {typeof this.props.direction !== "undefined" ? (
              // <TouchableOpacity
              //   onPress={this.props.onPress ? this.props.onPress : null}
              // >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: CSS.pixel(30)
                }}
              >
                {this.props.direction == ">" &&
                typeof this.props.other !== "function" ? (
                  <Image source={require("@img/my/mine_btn_list_black.png")} />
                ) : (
                  <Text style={{ fontSize: CSS.textSize(30), color: "#333" }}>
                    {this.props.direction}
                  </Text>
                )}
              </View>
            ) : // </TouchableOpacity>
            null}
          </View>
          <View
            style={[
              {
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 5,
                paddingBottom: 5
              },
              { ...footterStyle }
            ]}
          >
            {this.props.footter instanceof Function
              ? this.props.footter()
              : this.props.footter}
          </View>
        </View>
      </View>
    );
  }

  onChange = value => {
    //console.log("onChange", value);
    this.setState({
      value: value
    });
    if (this.props.onChange) this.props.onChange(value);
  };

  render() {
    const {
      placeholderRight,
      placeholderRightColor,
      titleStyle,
      titleFontStyle
    } = this.props;
    if (this.props.footter) {
      return this.renderFootterView();
    }
    const _placeholderRight = placeholderRight ? placeholderRight : "";
    const _placeholderRightColor = placeholderRightColor
      ? placeholderRightColor
      : sdStyles.SDFontColorSubtitle;
    return (
      <View
        // style={{ width: 30, height: "100%", justifyContent: "center" }}
        style={{ width: "100%" }}
        disabled={this.props.disablePress ? true : false}
        // onPress={
        //   this.props.onPress
        //     ? this.props.onPress
        //     : e => {
        //         return true;
        //       }
        // }
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            paddingLeft: CSS.pixel(30),
            height: CSS.pixel(110, true),
            borderBottomWidth: 1,
            borderColor: "#efefef",
            ...this.props.style
          }}
        >
          <View
            style={[
              {
                width: 100,
                justifyContent: "center",
                alignItems: "flex-start"
              },
              titleStyle
            ]}
          >
            <Text style={[{ color: this.props.placeholderColor || "#666", fontSize: CSS.textSize(30)}, titleFontStyle]}>
              {this.props.placeholder ? this.props.placeholder : "请输入文字"}
            </Text>
          </View>
          {this.props.isSelector ? (
            <View
              style={{
                flex: 1,
                paddingRight: 2,
                justifyContent: "center",
                alignItems: "flex-end"
              }}
            >
              <Text
                style={{
                  fontSize: CSS.textSize(30),
                  color:
                    this.state.value && this.state.value != ""
                      ? "#333"
                      : "#999",
                  marginRight: this.props.fixStr ? 0 : CSS.pixel(20)
                }}
              >
                {this.state.value && this.state.value != ""
                  ? this.state.value
                  : _placeholderRight}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-end",
                paddingRight: 2,
                //backgroundColor: '#ccc',
                borderWidth: 0,
                borderColor: '#f00',
              }}
              onPress={this.props.onPress ? this.props.onPress : null}
            >
              {typeof this.props.other === "function" ? (
                this.props.other()
              ) : (
                <TextInput
                  underlineColorAndroid="transparent" //设置下划线背景色透明 达到去掉下划线的效果
                  editable={
                    typeof this.props.editable !== "undefined"
                      ? this.props.editable
                      : true
                  }
                  returnKeyLabel="完成"
                  returnKeyType="done"
                  style={{
                    textAlign: "right",
                    width: "100%",
                    height: 40,
                    top: 1,
                    borderBottomWidth: 0,
                    marginRight: this.props.fixStr ? 0 : CSS.pixel(20),
                    fontSize: CSS.textSize(30),
                    color: "#333"
                  }}
                  onTouchStart={this.props.onPress ? this.props.onPress : null}
                  keyboardType={
                    this.props.keyboardType
                      ? this.props.keyboardType
                      : "default"
                  }
                  secureTextEntry={this.props.isPassword ? true : false}
                  value={this.state.value}
                  placeholder={_placeholderRight}
                  placeholderTextColor={_placeholderRightColor}
                  onChangeText={this.onChange.bind(this)}
                />
              )}
            </TouchableOpacity>
          )}

          {this.props.fixStr ? (
            <View
              style={{
                height: "100%",
                justifyContent: "center",
                marginRight: CSS.pixel(20)
              }}
            >
              <Text style={{ fontSize: CSS.textSize(30), color: "#333" }}>
                {this.props.fixStr}
              </Text>
            </View>
          ) : null}
          {typeof this.props.direction !== "undefined" ? (
            // <TouchableOpacity
            //   // style={{ width: 30, height: "100%", justifyContent: "center" }}
            //   onPress={this.props.onPress ? this.props.onPress : null}
            // >
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginRight: CSS.pixel(30)
              }}

              onPress={this.props.onPress ? this.props.onPress : null}
            >
              {this.props.direction == ">" &&
              typeof this.props.other !== "function" ? (
                <Image source={require("@img/my/mine_btn_list_black.png")} />
              ) : (
                <Text style={{ fontSize: CSS.textSize(30), color: "#333" }}>
                  {typeof this.props.other === "function"
                    ? null
                    : this.props.direction}
                </Text>
              )}
            </TouchableOpacity>
          ) : // </TouchableOpacity>
          null}
        </View>
      </View>
    );
  }
}
