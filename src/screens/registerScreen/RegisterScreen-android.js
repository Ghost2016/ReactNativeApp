import React from "react";
import ReactNative, {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  Dimensions,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  UIManager,
  TouchableOpacity
  //KeyboardAvoidingView
} from "react-native";
import PropTypes from "prop-types";
import { Toast } from "antd-mobile";
import ConnectWithActions from "../../connectWithActions";
import * as sdStyles from "@src/styles";
import { CSS } from "@common/SDCSS";
import SDInput2 from "@sd_components/SDInput2";
import SDInputHalf2 from "@sd_components/SDInputHalf2";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SDIcon from "@sd_components/SDIcon";
import SDButton from "@sd_components/SDButton";
import CountDownButton from "@sd_components/CountDownButton";
import { _onPressGetCode, notValidField, responseOk, toastErr } from "@utils/funcs";
import { changeAppRoot } from "../launchScreenActions";
import { setAppToken } from "../../boot/actions";
import store from "../../boot/store";
import KeyboardSpacer from "../../common/SDKeyboardSpacer";

const sWidth = Dimensions.get("window").width;
const sHeight = Dimensions.get("window").height;

const iconLoginPhone = require("@img/login/login_ico_phone.png");
const iconLoginPasswd = require("@img/login/login_ico_password.png");
const iconLoginCode = require("@img/login/login_ico_code.png");
const iconLoginName = require("@img/login/login_ico_name.png");

const styles = StyleSheet.create({
  inputWrap: {
    height: CSS.pixel(140, true),
    paddingLeft: CSS.pixel(50),
    paddingRight: CSS.pixel(80)
  },
  borderInput: {
    borderColor: "#efefef",
    borderWidth: 1,
    flexDirection: "row",
    width: CSS.pixel(480),
    height: CSS.pixel(80, true),
    marginBottom: CSS.pixel(20, true)
  },
  saveBtnBox: {
    marginBottom: CSS.pixel(40, true),
    height: CSS.pixel(72, true),
    overflow: "hidden",
    marginTop: CSS.pixel(40, true)
  }
});

const inputWhiteStyle = {
  backgroundColor: "#fff",
  color: sdStyles.SDFontColorMain,
  borderWidth: 1,
  borderColor: sdStyles.SDHelperColorline
};

class RegisterAndroidScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadCode: false, // 是否在获取code
      isNeedReLoad: false, //重新获取
      isValidPhone: false, // 是否有手机号
      isActive: true, // 是否可点击
      currLeftTime: 60,

      phoneText: "",
      passwordText: "",
      codeText: "",
      nickText: "",

      keyOffset: 280, //键盘偏移
      isSubmitting: false
    };
    this.timer = null;
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  getCountDown = () => {
    // console.log("this.state", this.state);
    return (
      <CountDownButton
        isLoadCode={this.state.isLoadCode}
        isActive={this.state.isValidPhone && this.state.isActive}
        currLeftTime={this.state.currLeftTime}
        isNeedReLoad={this.state.isNeedReLoa}
        onPress={this.onPressGetCode.bind(this)}
      />
    );
  };

  onPressRegister() {
    console.log('reg click')
    if (notValidField(this.state.phoneText, "phone")) {
      return;
    }
    if (notValidField(this.state.codeText, "code")) {
      return;
    }
    if (notValidField(this.state.passwordText, "password")) {
      return;
    }
    /* if (notValidField(this.state.nickText, "nickname")) {
      return;
    } */
    if(this.state.isSubmitting){
      return
    }

    this.setState({
      isSubmitting: true
    });

    /* setTimeout(() => {
      this.setState({
        isSubmitting: false,
      })
    }, 10000);
    return */

    this.props.actions
      .signupAction(
        {
          phone: this.state.phoneText,
          password: this.state.passwordText,
          code: this.state.codeText,
          //nickname: this.state.nickText,
          type: "phone"
        },
        res => {}
      )
      .then(res => {
        if (res.status == "ok") {
          this.props.actions
            .loginAfterRegisteAction({
              phone: this.state.phoneText,
              password: this.state.passwordText,
              type: "phone"
            })
            .then(loginRes => {
              this.setState({
                isSubmitting: false
              });
              if (loginRes.status === "ok") {
                store.dispatch(setAppToken(loginRes.results.token));
                // 设置登录方式
                store.dispatch({
                  type: "UPDATE_LOGIN_TYPE",
                  json: "password"
                });
                // 保留注册登录后完善信息流程
                store.dispatch(changeAppRoot("after-login"));
              }
            })
            .catch(err => {
              this.setState({
                isSubmitting: false
              });
            });
        } else {
          toastErr(Toast, res)
          /* Toast.fail(
            res && res.results && res.results.form && res.results.form.code
              ? res.results.form.code
              : res.msg || "接口错误，暂时无法注册！"
          ); */
          this.setState({
            isSubmitting: false
          });
        }
      })
      .catch(err => {
        this.setState({
          isSubmitting: false
        });
      });
  }

  async onPressGetCode() {
    await _onPressGetCode(this, Toast, () => {
      return new Promise((resolve, reject) => {
        if (
          notValidField(
            this.state.phoneText,
            "phone",
            "请先输入手机号，再获取验证码！"
          )
        ) {
          reject(null);
        } else {
          resolve({
            phone: this.state.phoneText,
            type: "signup"
          });
        }
      });
    });
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  render() {
    return (
      // <KeyboardAwareScrollView
      //   extraHeight={200}
      //   enableOnAndroid={true}
      //   style={{
      //     backgroundColor: "#fff",
      //     borderWidth: 0,
      //     borderColor: '#00f',
      //   }}
      //   keyboardShouldPersistTaps="handled"
      // >
      <ScrollView
        ref="_scrollview"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
          backgroundColor: "#fff",
          borderWidth: 0,
          borderColor: "#00f"
        }}
      >
        <View
          style={{
            position: "absolute",
            width: sWidth,
            height: sHeight
          }}
        >
          <Image
            source={require("@img/login/login_bg.png")}
            style={{ width: sWidth, height: sHeight }}
          />
        </View>
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: sWidth,
            height: sHeight
            //borderWidth: 1,
            //borderColor: '#f00',
          }}
        >
          <View
            style={{
              height: CSS.pixel(424, true),
              width: "100%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.context.navigator.pop();
              }}
              style={{
                position: "absolute",
                left: CSS.pixel(30),
                top: CSS.pixel(100, true),
                width: CSS.pixel(80),
                height: CSS.pixel(80, true)
                //backgroundColor:'#ccc',
              }}
            >
              <Image
                source={require("@img/home/home_ico_back.png")}
                style={{ width: CSS.pixel(20), height: CSS.pixel(37, true) }}
              />
            </TouchableOpacity>
            <View>
              <Image
                source={require("@img/login/login_logo.png")}
                style={{
                  width: CSS.pixel(176),
                  height: CSS.pixel(86, true),
                  position: "relative",
                  top: CSS.pixel(-53, true), //-118到status bar 间距65
                  borderWidth: 0,
                  borderColor: "#f00"
                }}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
        <View style={{flex: 1, height: sHeight}}>
          <View
            style={{
              // height: CSS.pixel(400, true)
              flex: 1,
              width: '100%',
            }}
          />
          <View
            style={{
              width: "100%",
              //flex: 1,
              // height: "100%",
              height: CSS.pixel(934, true),
              // backgroundColor: 'red',
              backgroundColor: "#fff",
              alignItems: "center",
              borderWidth: 0,
              borderColor: "#f00"
            }}
          >
            <View style={{ marginTop: CSS.pixel(30, true) }}>
              <Text
                style={{
                  fontSize: CSS.pixel(34),
                  fontWeight: "bold",
                  color: "#333"
                }}
              >
                注册
              </Text>
            </View>
            {/* 下划线 */}
            <View
              style={{
                width: CSS.pixel(64),
                borderBottomColor: "#333",
                borderBottomWidth: 2,
                marginTop: CSS.pixel(20, true)
              }}
            />

            <View
              style={{
                //marginTop: CSS.pixel(40, true),
                padding: 0,
                paddingTop:
                  Platform.OS === "ios" ? CSS.pixel(50) : CSS.pixel(60),
                width: CSS.pixel(550),
                height: "100%", //CSS.pixel(850),
                flexDirection: "column",
                alignContent: "flex-start",
                justifyContent: "flex-start",
                //backgroundColor: '#ffc',
                alignSelf: "center",
                borderWidth: 0,
                borderColor: "#f0f"
              }}
            >
              <SDInput2
                placeholder="输入手机号"
                onChange={value => {
                  this.setState({ phoneText: value });
                  if (value.match(/^1[0-9]{10}$/i)) {
                    this.setState({ isValidPhone: true });
                  } else {
                    this.setState({ isValidPhone: false });
                  }
                }}
                returnKeyType="next"
                returnKeyLabel="下一步"
                refName="phoneText"
                type="number"
                // onFocus={() => {
                //   this.setState({
                //     keyOffset: 280
                //   })
                // }}
                onSubmitEditing={() => {
                  this.refs["codeInpuy"].refs.codeText.focus();
                }}
                icon={iconLoginPhone}
                inputStyle={inputWhiteStyle}
              />

              <SDInputHalf2
                ref="codeInpuy"
                placeholder="输入短信验证码"
                onChange={value => this.setState({ codeText: value })}
                refName="codeText"
                type="number"
                returnKeyType="next"
                returnKeyLabel="下一步"
                // onFocus={() => {
                //   this.setState({
                //     keyOffset: 220
                //   })
                // }}
                onSubmitEditing={() => {
                  this.refs["password"].refs.passwordText.focus();
                }}
                icon={iconLoginCode}
                right={this.getCountDown}
                inputStyle={inputWhiteStyle}
              />

              <SDInput2
                placeholder="设置登录密码"
                onChange={value => this.setState({ passwordText: value })}
                refName="passwordText"
                type="password"
                returnKeyType={Platform.OS == "android" ? "none" : "done"}
                returnKeyLabel="下一步"
                ref="password"
                onSubmitEditing={() => {
                  //this.refs["name"].refs.nickText.focus();
                }}
                // onFocus={() => {
                //   this.setState({
                //     keyOffset: 140
                //   })
                // }}
                icon={iconLoginPasswd}
                inputStyle={inputWhiteStyle}
              />
              {/* <SDInput2
                placeholder="设置昵称"
                onChange={value => this.setState({ nickText: value })}
                refName="nickText"
                ref="name"
                returnKeyType={Platform.OS == "android" ? "none" : "done"}
                type="text"
                // onFocus={() => {
                //   this.setState({
                //     keyOffset: 100
                //   })
                // }}
                // blurOnSubmit={}
                icon={iconLoginName}
                inputStyle={inputWhiteStyle}
              /> */}

              <TouchableOpacity
                style={{
                  width: CSS.pixel(550),
                  height: CSS.pixel(80, true),
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginTop: CSS.pixel(40),
                  borderWidth: 0,
                  borderColor: "#f00"
                }}
                ref="_regiBtn"
              >
                <SDButton
                  disabled={this.state.isSubmitting}
                  style={{
                    zIndex: 7,
                    backgroundColor: sdStyles.SDMainColor,
                    borderRadius: CSS.pixel(50),
                    width: CSS.pixel(550),
                    height: CSS.pixel(80, true),
                    position: "relative",
                    top: 0,
                    marginTop: 0, //CSS.pixel(40)
                    borderWidth: 0,
                    borderColor: "#00f"
                  }}
                  btnStyle={{
                    fontSize: CSS.textSize(30),
                    color: sdStyles.SDFontColorMain
                  }}
                  title={this.state.isSubmitting ? "提交中..." : "完成注册"}
                  onPress={this.onPressRegister.bind(this)}
                />
              </TouchableOpacity>
            </View>


          </View>
          <KeyboardSpacer />
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(
  RegisterAndroidScreen
);
