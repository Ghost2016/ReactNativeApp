import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  Dimensions,
  Keyboard
} from "react-native";
import PropTypes from "prop-types";
import LabelInput from "../common/SDLabelInput";
import { SDTakePhoto } from "@common";
import { isIphoneX } from "../utils/iphonex";
import connectWithActions from "../connectWithActions";
import { Toast } from "antd-mobile";
import { CSS } from "../common/SDCSS";
import SDTouchOpacity from "../common/SDTouchOpacity";
import { SDMainColor } from "../styles";
import { notValidField } from "../utils/funcs";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f3f3",
    height:
      Platform.OS === "ios"
        ? isIphoneX()
          ? Dimensions.get("window").height - 164
          : Dimensions.get("window").height - 130
        : Dimensions.get("window").height - 150
  },
  saveBtnBox: {
    marginTop: 20,
    height: 46,
    width: CSS.pixel(550),
    overflow: "hidden"
  }
});

let beforeNotSendFeed = "";

// 编辑自我评价表单
class FeedBackForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      contact: this.props.phone || "",
      isDisabled: true,
      selectIndex: 0
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        style={styles.container}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#fff",
            marginBottom: CSS.pixel(20),
            paddingHorizontal: CSS.pixel(30),
            height: CSS.pixel(90),
            alignItems: "center"
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{color: '#666', fontSize: CSS.pixel(28)}}>反馈类型</Text>
          </View>
          <SDTouchOpacity
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              flex: 1
            }}
            onPress={() => {
              this.setState({
                selectIndex: 0
              });
            }}
          >
            <View
              style={{
                width: CSS.pixel(28),
                height: CSS.pixel(28),
                padding: 0,
                borderRadius: CSS.pixel(14),
                borderWidth: 2,
                borderColor: SDMainColor,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff"
              }}
            >
              <View
                style={{
                  width: CSS.pixel(10),
                  height: CSS.pixel(10),
                  borderRadius: CSS.pixel(6),
                  padding: 0,
                  backgroundColor:
                    this.state.selectIndex == 0 ? SDMainColor : "#fff"
                }}
              />
            </View>
            <View style={{ marginLeft: CSS.pixel(14), alignItems: "center" }}>
              <Text style={{ color: "#333", fontSize: CSS.textSize(30) }}>
                产品建议
              </Text>
            </View>
          </SDTouchOpacity>
          <SDTouchOpacity
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              flex: 1
            }}
            onPress={() => {
              this.setState({
                selectIndex: 1
              });
            }}
          >
            <View
              style={{
                width: CSS.pixel(28),
                height: CSS.pixel(28),
                borderRadius: CSS.pixel(14),
                borderWidth: 2,
                padding: 0,
                borderColor: SDMainColor,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff"
              }}
            >
              <View
                style={{
                  width: CSS.pixel(10),
                  height: CSS.pixel(10),
                  padding: 0,
                  borderRadius: CSS.pixel(6),
                  backgroundColor:
                    this.state.selectIndex == 0 ? "#fff" : SDMainColor
                }}
              />
            </View>
            <View style={{ marginLeft: CSS.pixel(14), alignItems: "center" }}>
              <Text style={{ color: "#333", fontSize: CSS.textSize(30) }}>
                故障错误
              </Text>
            </View>
          </SDTouchOpacity>
        </View>
        <View style={{ backgroundColor: "#fff", minHeight: 160 }}>
          <LabelInput
            placeholder="意见内容"
            editable={false}
            footterStyle={{ borderBottomWidth: 0}}
            footter={() => (
              <TextInput
                onChangeText={text => {
                  this.state.content = text;
                  beforeNotSendFeed = text;
                  if (this.state.contact !== "" && this.state.content !== "") {
                    this.setState({
                      isDisabled: false
                    });
                  } else {
                    this.setState({
                      isDisabled: true
                    });
                  }
                }}
                defaultValue={beforeNotSendFeed}
                style={{ marginBottom: 10, padding: 0}}
                placeholder="你的意见将有助于我们提升服务质量"
                multiline={true}
                underlineColorAndroid="transparent"
              />
            )}
          />
        </View>
        <View style={{ backgroundColor: "#fff", marginTop: CSS.pixel(20), minHeight: 100 }}>
          <LabelInput
            placeholder="联系方式"
            editable={false}
            footterStyle={{ borderBottomWidth: 0 }}
            footter={() => (
              <TextInput
                onChangeText={text => {
                  this.state.contact = text;
                  if (this.state.contact !== "" && this.state.content !== "") {
                    this.setState({
                      isDisabled: false
                    });
                  } else {
                    this.setState({
                      isDisabled: false
                    });
                  }
                }}
                style={{padding: 0}}
                placeholder="请留下你的联系方式"
                multiline={true}
                defaultValue={this.props.phone}
                underlineColorAndroid="transparent"
              />
            )}
          />
        </View>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={styles.saveBtnBox}>
            <TouchableOpacity
              disabled={beforeNotSendFeed !== "" ? false : true}
              style={{ flex: 1 }}
              activeOpacity={0.8}
              onPress={() => {
                if(notValidField(this.state.contact, "phone", "请输入正确的手机联系方式")) {
                  return false;
                }
                
                Keyboard.dismiss();
                Toast.loading("提交中", 0);
                
                this.props.actions
                  .addFeedbackAction({
                    content: beforeNotSendFeed,
                    contact: this.state.contact
                  })
                  .then(() => {
                    beforeNotSendFeed = "";
                    Toast.hide();
                    Toast.info("反馈成功");
                    this.context.navigator.pop();
                  })
                  .catch(() => {
                    Toast.hide();
                    Toast.fail("反馈失败");
                  });
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 26,
                  // backgroundColor: "#fed200",
                  backgroundColor:
                    beforeNotSendFeed === "" ? "#e1e1e1" : "#fed200"
                }}
              >
                <Text
                  style={{
                    color: beforeNotSendFeed === "" ? "#fff" : "#333",
                    fontSize: CSS.textSize(32)
                  }}
                >
                  提交
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default connectWithActions((state, props) => ({}))(FeedBackForm);
