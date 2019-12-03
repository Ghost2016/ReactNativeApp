import React from "react";
import ReactNative, {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  UIManager
  //KeyboardAvoidingView
} from "react-native";
import PropTypes from "prop-types";
import { Toast } from "antd-mobile";
import ConnectWithActions from "../../connectWithActions";
import * as sdStyles from "@src/styles";
import { CSS } from "@common/SDCSS";
import SDInput2 from "@sd_components/SDInput2";
import SDInputHalf2 from "@sd_components/SDInputHalf2";
import SDIcon from "@sd_components/SDIcon";
import SDButton from "@sd_components/SDButton";
import CountDownButton from "@sd_components/CountDownButton";
import { changeAppRoot } from "../launchScreenActions";
import { setAppToken } from "../../boot/actions";
import store from "../../boot/store";
import { _onPressGetCode, notValidField, responseOk, toastErr } from "@utils/funcs";

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
  borderColor: sdStyles.SDHelperColorline,
};

class RegisterScreen extends React.Component {
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

      keyOffset: 0, //键盘偏移
      isSubmitting: false,
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
        style={{
          position: "relative",
          //top: CSS.pixel(-9, true),
          left: CSS.pixel(5, true),
        }}
      />
    );
  };

  onPressRegister() {

    if(notValidField(this.state.phoneText, 'phone')){
      return
    }
    if(notValidField(this.state.codeText, 'code')){
      return
    }
    if(notValidField(this.state.passwordText, 'password')){
      return
    }
    /* if(notValidField(this.state.nickText, 'nickname')){
      return
    } */
    if(this.state.isSubmitting){
      return
    }

    this.setState({
      isSubmitting: true,
    })

    this.props.actions.signupAction(
      {
        phone: this.state.phoneText,
        password: this.state.passwordText,
        code: this.state.codeText,
        //nickname: this.state.nickText,
        type: "phone"
      },
      res => {}
    ).then(res => {

      if (res.status === "ok") {
        this.props.actions.loginAfterRegisteAction({
          phone: this.state.phoneText,
          password: this.state.passwordText,
          type: "phone"
        }).then((loginRes) => {
          this.setState({
            isSubmitting: false,
          })
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
        }).catch(err => {
          this.setState({
            isSubmitting: false,
          })
        })
      } else {
        /*
        msg: 'form error',
  results: { form: { phone: '该手机号已被注册' } } }, 'https://server-beat.zhimekaimen.com:443/api/sd/v1/auth/signup/'
        */
        toastErr(Toast, res)
        //Toast.fail((res && res.results && res.results.form && res.results.form.phone) ? res.results.form.phone : (res.msg || "接口错误，暂时无法注册！"));
        this.setState({
          isSubmitting: false,
        })
      }
    }).catch(err => {
      this.setState({
        isSubmitting: false,
      })
    })
  }

  async onPressGetCode() {
    await _onPressGetCode(this, Toast, () => {
      return new Promise((resolve, reject) => {
        if (notValidField(this.state.phoneText, 'phone', "请先输入手机号，再获取验证码！")) {
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

  componentDidMount() {
    setTimeout(() => {
      if(this.refs["_regiBtn"]) {
        UIManager.measure(
          ReactNative.findNodeHandle(this.refs["_regiBtn"]),
          (x, y, w, h, px, py) => {
            // this.refs["select_tipDocker"].show(px + 40, py + 20);
            this.setState({
              keyOffset: Dimensions.get("window").height - py - h
            });
          }
        );
      }
    });
  }

  render() {
    return (
      <View style={{
        backgroundColor: 'transparent',
      }}>
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: sWidth,
            height: sHeight
          }}
        >
          <Image
            source={require("@img/login/login_bg.png")}
            style={{ width: sWidth, height: sHeight }}
            resizeMode="stretch"
          />
        </View>

        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: sWidth,
            height: sHeight,
            zIndex: 1,
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
              testID={'backButton_RegisterScreen'}
              onPress={() => {
                this.context.navigator.pop();
              }}
              style={{
                position: "absolute",
                left: CSS.pixel(30),
                top: CSS.pixel(80, true),
                width: CSS.pixel(80),
                height: CSS.pixel(80, true),
                //backgroundColor:'#ccc',
                borderWidth: 0,
                borderColor: '#f00',
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
                  width: CSS.pixel(170),
                  height: CSS.pixel(86, true),
                  position: 'relative',
                  top: CSS.pixel(-53), //-118到status bar 间距65
                  borderWidth: 0,
                  borderColor: '#f00',
                }}
                resizeMode="contain"
              />
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={"position"}
            keyboardVerticalOffset={Platform.OS == 'ios' ? -this.state.keyOffset : -180}
          >
            <ScrollView
              style={{
                height: Dimensions.get("window").height - CSS.pixel(424, true),
                backgroundColor: "#fff",
              }}
              keyboardShouldPersistTaps="always"
            >
              <View
                style={{
                  marginTop: CSS.pixel(44, true),
                  alignItems: "center",
                 }}
              >
                <View>
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
              </View>

              <View
                style={{
                  //marginTop: CSS.pixel(40, true),
                  padding: 0,
                  paddingTop:
                    Platform.OS === "ios" ? CSS.pixel(50) : CSS.pixel(60),
                  width: CSS.pixel(550),
                  height: '100%',//CSS.pixel(850),
                  flexDirection: "column",
                  alignContent: "flex-start",
                  justifyContent: "flex-start",
                  //backgroundColor: '#ffc',
                  alignSelf: "center",
                }}
              >
                <SDInput2
                  placeholder="输入手机号"
                  testID={'SetPhoneNumber_RegisterScreen'}
                  onChange={value => {
                    this.setState({ phoneText: value });
                    if(value.match(/^1[0-9]{10}$/i)){
                      this.setState({ isValidPhone: true });
                    } else {
                      this.setState({ isValidPhone: false });
                    }
                  }}
                  refName="phoneText"
                  type="number"
                  icon={iconLoginPhone}
                  inputStyle={inputWhiteStyle}
                />

                <SDInputHalf2
                  placeholder="输入短信验证码"
                  testID={"codeText_RegisterScreen"}
                  onChange={value => this.setState({ codeText: value })}
                  refName="codeText"
                  type="number"
                  icon={iconLoginCode}
                  right={this.getCountDown}
                  inputStyle={inputWhiteStyle}
                />

                <SDInput2
                  placeholder="设置登录密码"
                  testID={"SetPassword_RegisterScreen"}
                  onChange={value => this.setState({ passwordText: value })}
                  refName="passwordText"
                  type="password"
                  returnKeyType={Platform.OS == 'android' ? "none" : "done"}
                  returnKeyLabel="下一步"
                  icon={iconLoginPasswd}
                  inputStyle={inputWhiteStyle}
                />
                {/* <SDInput2
                  placeholder="设置昵称"
                  testID={"SetNickname_RegisterScreen"}
                  onChange={value => this.setState({ nickText: value })}
                  refName="nickText"
                  returnKeyType={Platform.OS == 'android' ? "none" : "done"}
                  type="text"
                  icon={iconLoginName}
                  inputStyle={inputWhiteStyle}
                /> */}

                <TouchableOpacity
                  style={{
                    width: CSS.pixel(550),
                    height: CSS.pixel(82),
                    paddingLeft: 0,
                    paddingRight: 0,
                    marginTop: CSS.pixel(40)
                  }}
                  ref="_regiBtn"
                  testID={"submitRegister_RegisterScreen"}
                >
                  <SDButton
                    disabled={this.state.isSubmitting}
                    style={{
                      zIndex: 7,
                      backgroundColor: sdStyles.SDMainColor,
                      borderRadius: CSS.pixel(50),
                      width: CSS.pixel(550),
                      position: "relative",
                      top: 0,
                      marginTop: 0 //CSS.pixel(40)
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
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(RegisterScreen);
