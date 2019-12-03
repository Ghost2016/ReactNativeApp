import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  AlertIOS,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  NativeModules
} from "react-native";
import PropTypes from "prop-types";
import TakePhoto from "../../../common/SDTakePhoto";
import ConnectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";
import { Toast } from "antd-mobile";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { navScreen } from "../../../styles";
import ChoosePoi from "./ChoosePoi";
import Geolocation from "../../../boot/Geolocation";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
  }
});

// 发布动态页面
class PostTrendsScreen extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  constructor(props) {
    super(props);
    this.state = {
      postContentText: "",
      location: this.props.location.address ? this.props.location.address : "",
      offsetKeyboard: 0
    };

    this.isPosting = false;
  }

  componentDidMount() {
    // 检查android权限
    Platform.OS == "android" &&
    NativeModules.BackHome &&
    NativeModules.BackHome.getPermissions &&
    NativeModules.BackHome.getPermissions();
    Geolocation.getLastLocation();

    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "save_postTrends"
    );

    this.context.refs["_postTrends"] = this;
  }

  componentWillUnmount() {
    if (this.context.refs["_postTrends"]) {
      delete this.context.refs["_postTrends"];
    }
  }

  async onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_postTrends") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        if(this.isPosting) {
          return;
        }
        this.isPosting = true;
        Keyboard.dismiss();
        if (
          this.context.refs["_takePhoto"].state.list.length <= 1 &&
          this.state.postContentText == ""
        ) {
          Toast.info("请先说点什么吧", 0.5);
          this.isPosting = false;
          return;
        } else {
          if (this.context.refs["_takePhoto"].state.list.length > 1) {
            Toast.loading("上传图片中", 0);
          }
          const timer = setTimeout(() => {
            if (timer) {
              clearTimeout(timer);
              timer = null;
              Toast.info("上传图片超时");
              this.isPosting = false;
            }
          }, 100000);
          const ids = await this.context.refs["_takePhoto"].uploadPic();
          if (timer) {
            clearTimeout(timer)
            timer = null;
          }
          Toast.loading("发布中", 0);
          this.props.actions.createDynamicAction(
            {
              content: this.state.postContentText,
              location: this.state.location,
              attachment_ids: ids
            },
            res => {
              // this.isPosting = false;
              Toast.show("发布完成");
              this.context.navigator.pop();
            }
          );
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ padding: CSS.pixel(30), height: CSS.pixel(250, true) }}>
          <TextInput
            numberOfLines={2}
            multiline={true}
            underlineColorAndroid="transparent"
            placeholder="说点什么吧"
            style={{fontSize: CSS.textSize(30)}}
            returnKeyType="next"
            returnKeyLabel="换行"
            onChangeText={text => this.setState({ postContentText: text })}
          />
        </View>
        {/* <KeyboardAvoidingView
          // ref={keyborad => this._keyborad = keyborad}
          behavior={Platform.OS == "ios" ? "position" : "padding"}
          keyboardVerticalOffset={this.state.offsetKeyboard}
          style={{ backgroundColor: "#fff" }}
        > */}
          <ScrollView
            keyboardShouldPersistTaps="never"
            style={{ backgroundColor: "#fff", backfaceVisibility: "hidden" }}
          >
            <View
              style={{ padding: CSS.pixel(30), marginTop: CSS.pixel(30, true) }}
            >
              <View style={{ marginBottom: CSS.pixel(30, true) }}>
                <Text style={{ color: "#999", fontSize: CSS.textSize(32) }}>
                  图片
                </Text>
              </View>
              <TakePhoto dynamic={true} ref="_takePhoto" />
            </View>

            <View
              style={{
                padding: CSS.pixel(30),
                flexDirection: "row",
                marginTop: CSS.pixel(30, true),
                alignItems: "center"
              }}
            >
              <Image source={require("@img/home/home_ico_Location.png")} />
              {/* <Icon name="pin" style={{ color: "#999", fontSize: CSS.textSize(32) }} /> */}
              <SDTouchOpacity
                onPress={() => {
                  this.context.navigator.push(
                    navScreen("PushScreen", "所在位置", {
                      passProps: {
                        screen: () => <ChoosePoi />,
                        header: {
                          title: '选择位置'
                        }
                      },
                    })
                  );
                }}
              >
                <Text style={{marginLeft: CSS.pixel(10), paddingRight: CSS.pixel(30), color: '#999', fontSize: CSS.textSize(30)}}>
                  {this.state.location ? this.state.location : "地理位置"}
                </Text>
              </SDTouchOpacity>
            </View>
          </ScrollView>
        {/* </KeyboardAvoidingView> */}
      </View>
    );
  }
}
export default ConnectWithActions((state, props) => ({
  location: state.location
}))(PostTrendsScreen);
