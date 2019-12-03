/* @flow */
import React, { PureComponent } from "react";
import { View, Animated, Text, Image, TextInput } from "react-native";
import SDTouchOpacity from "../common/SDTouchOpacity";
import { CSS } from "../common/SDCSS";
import { SDMainColor } from "../styles";
import { isIphoneX } from "../utils/iphonex";

type Props = {
  onChange: Function,
  onSubmit: Function,
  onCancel: ?Function,
  enterText: ?string,
};

let searchNow = new Date().getTime();

export default class SDSearchBar extends PureComponent<Props> {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };

    this.timer = null;
  }

  onChange(text) {
    // 如果之前的搜索值为“”
    // 直接可以搜索
    if (this.state.value == "") {
      this.setState({
        value: text
      });
      searchNow = currTime;
      this.props.onChange && this.props.onChange(text)//text.indexOf("+") >= 0 ? text : text.replace(/\s/g, ""));
      return;
    }

    this.setState({
      value: text
    });
    
    let currTime = new Date().getTime();
    if (currTime - searchNow <= 500 && text != '') {
      if(this.timer != null) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.props.onChange && this.props.onChange(this.state.value)
      }, 500);
      return;
    }
    searchNow = currTime;

    this.props.onChange && this.props.onChange(text)//.indexOf("+") >= 0 ? text : text.replace(/\s/g, ""));
  }

  componentDidMount() {
    this.props.autoFocus ? setTimeout(() => {
      this._textInput.focus();
    }, 700): null
  }
  
  onSubmit(text) {
    this.props.onSubmit && this.props.onSubmit(this.state.value);
  }

  render() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          backgroundColor: "#fff",
          paddingLeft: CSS.pixel(60),
          paddingRight: CSS.pixel(20)
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            height: CSS.pixel(58),
            borderRadius: 60,
            backgroundColor: "#f6f6f6"
          }}
        >
          <View
            style={{
              height: "100%",
              marginLeft: CSS.pixel(40),
              marginRight: CSS.pixel(20),
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image source={require("@img/home/rank_ico_search.png")} />
          </View>
          <View
            style={{ height: CSS.pixel(58), justifyContent: "center", flex: 1 }}
          >
            <TextInput
              underlineColorAndroid="transparent"
              placeholder={this.props.placeholder || "搜索你感兴趣的内容"}
              placeholderTextColor="rgba(153,153,153,1)"
              style={{ fontSize: CSS.textSize(28), padding: 0}}
              onChangeText={this.onChange.bind(this)}
              onSubmitEditing={this.onSubmit.bind(this)}
              returnKeyType="search"
              autoCapitalize="none"
              value={this.state.value}
              onEndEditing={e => {}}
              ref={input => (this._textInput = input)}
            />
          </View>
          {this.state.value ? (
            <SDTouchOpacity
              style={{
                paddingHorizontal: CSS.pixel(20),
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
              }}
              onPress={() => {
                this.onChange("")
              }}
            >
              <Image source={require("@img/home/rank_search_btn_delete.png")} />
            </SDTouchOpacity>
          ) : null}
        </View>
        <SDTouchOpacity
          style={{ marginLeft: CSS.pixel(20) }}
          onPress={this.props.onCancel ? () => {
            this.props.onCancel(this.state.value)
          } : null}
        >
          <Text
            style={{ color: "rgba(102,102,102,1)", fontSize: CSS.pixel(24) }}
          >
            {this.props.enterText || "取消"}
          </Text>
        </SDTouchOpacity>
      </View>
    );
  }
}
