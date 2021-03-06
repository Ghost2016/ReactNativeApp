import React from "react";
import {
  AppState,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Platform,
  Button,
  Dimensions,
  ScrollView,
  StatusBar,
  Alert,
  PermissionsAndroid,
  NativeModules,
  Linking,
  TouchableOpacity,
} from "react-native";
import * as WeChat from "react-native-wechat";
import PropTypes from "prop-types";
import ConnectWithActions from "../connectWithActions";
import { Toast } from "antd-mobile";
import * as sdStyles from "@src/styles";
import { CSS } from "@common/SDCSS";
import ShareIcons from "@sd_components/ShareIcons";
import SDInput2 from "@sd_components/SDInput2";
import SDInputHalf2 from "@sd_components/SDInputHalf2";
import CountDownButton from "@sd_components/CountDownButton";
import { _onPressGetCode, notValidField, responseOk, toastErr } from "@utils/funcs";
import config from "../config";
import { navScreen, navRightButton, SDMainColor } from "../styles";
//import RegisterScreeAndroid from "./registerScreen/RegisterScreen-android";
import { isTesting, testAccount, testPassword } from 'react-native-dotenv'
import SDTabs2 from "../sd_components/SDTabs2";

// 忘记密码页面
import ForgetPasswordScreen from "./ForgetPasswordScreen";
import TosScreen from "./registerScreen/TosScreen";
import RegisterScreen from "./registerScreen/RegisterScreen";
import RegisterScreenAndroid from "./registerScreen/RegisterScreen-android";
import Touchable from "@src/sd_components/Touchable";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  tabs: {
    width: "100%", //CSS.pixel(550),
    paddingTop: CSS.pixel(120),
    backgroundColor: "transparent",
    paddingBottom: 0
  },
  tabContent: {
    width: CSS.pixel(550),
    display: "flex",
    alignSelf: "center",
    borderWidth: 0,
    borderColor: "#f00",
    marginTop: CSS.pixel(152),
  },
  inputWrap: {
    //height: CSS.pixel(70),
    //paddingLeft: CSS.pixel(25),
    //paddingRight: CSS.pixel(40),
  }
});

const iconLoginPhone = require("@img/login/login_ico_phone.png");
const iconLoginPasswd = require("@img/login/login_ico_password.png");
const iconLoginCode = require("@img/login/login_ico_code.png");
/**
 * 登录主页
 */
class LoginMainScreenWithPassword extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
    //refs: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoadCode: false, // 是否在获取code
      isValidPhone: false, // 是否有手机号
      isActive: true, // 是否可点击
      isNeedReLoad: false, //重新获取
      currLeftTime: 60,
      userAccount: isTesting === "true" ? testAccount : "",
      userPassword: isTesting === "true" ? testPassword : "",
      userPhone: "",
      userCode: "",
      currentTab: 0,
      isShowThirdLogin: false,
      isSubmitting: false,
    };
    this.onPressLogin = this.onPressLogin.bind(this);
    this.handleForget = this.handleForget.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.getCountDown = this.getCountDown.bind(this);
  }

  onNavigatorEvent(event) {
    // handle a deep link
    if (event.type == 'DeepLink') {
      const parts = event.link.split('/'); // Link parts
      const payload = event.payload; // (optional) The payload
      //console.log("onNavigatorEvent", event, parts[0] == 'register')
      if (parts && parts[0] == 'register') {
        // handle the link somehow, usually run a this.props.navigator command
        this.handleRegister();
      }
    }
  }

  bootstrapDeepLinks() {
    console.log('[deeplink2] bootstrapDeepLinks');
    if(Platform.OS === 'android') {
      //This will watch for updates in the deeplink in android. This will also fire on first app load.
      AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    } else {
      //This will watch for updates in the deeplink in ios. This will not fire on first app load.
      Linking.addEventListener('url', this._handleOpenURL);
      //Fire on first load in ios
      this._checkInitialURL()
    }
  }

  // This will check for deeplink changes in ios only
  _handleOpenURL(event) {
    //if(__DEV__) {
      console.log('[deeplink2] Updated url in IOS is: ' + event.url);
    //}
  }

  // This will check for deeplink changes in android only
  _handleAppStateChange(currentAppState) {
    this._appState = currentAppState;
    this._checkInitialURL();
  }

  _invokeDeepLink(url) {
    console.log('[deeplink2] _invokeDeepLink ', url);
    if(url.match(/elephantapp:\/\/signUp/i)){
      console.log('[deeplink2] Initial url is: ' + url,  this.context.navigator.handleDeepLink);
      //打开注册页面
      this.context.navigator.handleDeepLink({
        link: 'register/',
        payload: url // (optional) Extra payload with deep link
      });
    }
  }

  _checkInitialURL() {
    console.log('[deeplink2] _checkInitialURL');
    Linking.getInitialURL().then((url) => {
      console.log('[deeplink2] getInitialURL', url);
      if (url) {
        //if(__DEV__) {
          if(Platform.OS === 'android') {
            //console.warn('[deeplink2] Updated url in Android is: ' + url);
            this._invokeDeepLink(url)
          } else {
            // Linking.getInitialURL() will only be fired once in IOS
            this._invokeDeepLink(url)
          }
        //}
      }
    }).catch(err => {
      //console.warn('[deeplink2] Linking An error occurred', err)
    });
  }

  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  componentDidMount() {
    //this.bootstrapDeepLinks();
    /* if (Platform.OS == "android") {
      // this.permissionCheck();
      NativeModules.BackHome &&
      NativeModules.BackHome.getPermissions &&
      NativeModules.BackHome.getPermissions();
    } */
    setTimeout(() => {
      //this.refs["_userAccount"].refs.userAccount.focus();
      // if(config.isDev) {
      //   this.setState({
      //     isShowThirdLogin: true,
      //   })
      // } else{
        WeChat.isWXAppInstalled().then(isInstalled => {
          if (isInstalled) {
            this.setState({
              isShowThirdLogin: true,
            })
          }
        })
      // }
    }, 1000);

    //this.context.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onPressEyeAction(){
    //重设光标位置
    this.refs["_passwdInput"].refs.userPassword.setNativeProps({ selection:{ start:0, end:0 } })
    setTimeout(() => {
      this.refs["_passwdInput"].refs.userPassword.setNativeProps({ selection:{ start:this.state.userPassword.length, end:this.state.userPassword.length } })
    }, 10);
  }

  handleRegister() {
    this.context.navigator.push(
      navScreen("PushScreen", "注册", {
        passProps: {
          screen: () => Platform.OS == "ios" ? <RegisterScreen /> : <RegisterScreenAndroid />,
          fullScreen: true,
          backgroundColor: '#fff',
          //header: {title:""}
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存"),
      })
    );
  }

  handleForget() {
    // console.warn('forget')
    this.context.navigator.push(
      navScreen("PushScreen", "忘记密码", {
        passProps: {
          screen: () => <ForgetPasswordScreen />,
          fullScreen: true,
          header: {
            title: "忘记密码",
            //fixed: true,
          }
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存"),
      })
    );

  }
  onPressLogin() {
    //console.warn('click')
    // ios
    Toast.loading("正在登录");
    if (this.state.currentTab === 0) {

      if(this.state.userAccount == "" || this.state.userPassword ==""){
        Toast.fail("账号密码不能为空", 2);
        return
      }
      //账号密码登录
      if(notValidField(this.state.userAccount, 'phone')){
        return
      }

      if(!config.isDev) {
        if(notValidField(this.state.userPassword, 'password')){
          return
        }
      }
      // if(notValidField(this.state.userPassword, 'password')){
      //   return
      // }

      if(this.state.isSubmitting){
        return
      }
      this.setState({
        isSubmitting: true,
      })
      this.props.actions.loginAction(
        {
          phone: this.state.userAccount,
          password: this.state.userPassword,
          type: "phone"
        },
        this.context.navigator
      ).then(data => {
        responseOk(data).then(data => {
          this.setState({
            isSubmitting: false,
          })
        }).catch(err=>{
          toastErr(Toast, err)
          this.setState({
            isSubmitting: false,
          })
        })

      }).catch(err => {
        this.setState({
          isSubmitting: false,
        })
      })
    } else {
      //验证码登录
      if(notValidField(this.state.userPhone, 'phone')){
        return
      }
      if(notValidField(this.state.userCode, 'code')){
        return
      }
      if(this.state.isSubmitting){
        return
      }
      this.setState({
        isSubmitting: true,
      })
      this.props.actions.loginAction(
        {
          phone: this.state.userPhone,
          code: this.state.userCode,
          type: "code"
        },
        this.context.navigator
      ).then(data => {
        responseOk(data).then(data => {
          this.setState({
            isSubmitting: false,
          })
        }).catch(err=>{
          toastErr(Toast, err)
          this.setState({
            isSubmitting: false,
          })
        })
      }).catch(err => {
        this.setState({
          isSubmitting: false,
        })
      })
    }
  }
  onPressGetCode = () => {
    if (this.state.isLoadCode) {
      return;
    }
    this.setState({
      isActive: false
    });
    setTimeout(() => {
      _onPressGetCode(this, Toast, () => {
        return new Promise((resolve, reject) => {
          this.setState({
            isActive: true
          })
          if (notValidField(this.state.userPhone, 'phone')) {
            reject(null);
          } else {
            resolve({
              phone: this.state.userPhone,
              type: "login"
            });
          }
        });
      });
    }, 200);
  };

  getCountDown() {
    return (
      <CountDownButton
        isLoadCode={this.state.isLoadCode}
        // isActive={this.state.isValidPhone && this.state.isActive}
        isActive={this.state.isValidPhone && this.state.isActive}
        currLeftTime={this.state.currLeftTime}
        isNeedReLoad={this.state.isNeedReLoa}
        onPress={this.onPressGetCode}
        outerStyle={{
          position: "relative",
          top: Platform.OS === "android" ? CSS.pixel(0, true) : CSS.pixel(0, true)
        }}

      />
    );
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="handled" style={{
        borderWidth: 0,
        borderColor:'#f00',
      }}>

        <ImageBackground
          resizeMode="cover"
          borderRadius={0}
          style={[
            styles.container,
            {
              width: width, //CSS.pixel(width),
              height: height, //CSS.pixel(height),
              position: "relative",
              top: 0,
              borderWidth: 0,
              borderColor: "#f00"
              //flexDirection: "column",
              //justifyContent: "flex-end"
            }
          ]}
          source={require("@img/login/login_bg.png")}
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

          {/* <StatusBar backgroundColor="rgba(0,0,0,0)" translucent animated /> */}

          <View style={{ marginTop: CSS.pixel(90) }}>
            <Image
              source={require("@img/login/login_logo.png")}
              style={{ width: CSS.pixel(170), height: CSS.pixel(86) }}
            />
          </View>

        <View style={[styles.tabContent]}>
            <SDInput2
                ref="_userAccount"
                placeholder="输入账号"
                onChange={value => {
                this.setState({ userAccount: value })
                //this.setState({ userPhone: value });
                }}
                type={isTesting === "true" ? "number" : "text"}
                returnKeyLabel="下一步"
                returnKeyType="next"
                onSubmitEditing={() => {
                this.refs["_passwdInput"].refs.userPassword.focus();
                }}
                refName="userAccount"
                defaultValue={isTesting === "true" ? testAccount : this.state.userAccount}
                icon={iconLoginPhone}
                testID={"loginPhone_LoginMainScreen"}
            />

            <SDInput2
                ref="_passwdInput"
                placeholder="输入密码"
                onChange={value => this.setState({ userPassword: value })}
                type={isTesting === "true" ? "number" : "text"}
                refName="userPassword"
                returnKeyLabel="登录"
                returnKeyType="done"
                onSubmitEditing={e => {
                if (
                    this.state.userAccount != "" &&
                    this.state.userPassword
                ) {
                    Toast.loading("正在登录", 0.3);
                    this.props.actions.loginAction(
                    {
                        phone: this.state.userAccount,
                        password: this.state.userPassword,
                        type: "phone"
                    },
                    this.context.navigator
                    );
                }
                }}
                // type="number"
                type="password"
                isShowEye={true}
                onPressEye={this.onPressEyeAction.bind(this)}
                icon={iconLoginPasswd}
                defaultValue={isTesting === "true" ? testPassword : ""}
                testID={"password_LoginMainScreen"}
                inputStyle={{
                marginBottom: CSS.pixel(0, true),
                }}
            />
            </View>

          <View
            style={{
              marginTop: CSS.pixel(50, true),
              marginBottom: CSS.pixel(40, true),
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Touchable
              style={{
                backgroundColor: SDMainColor,
                borderRadius: CSS.pixel(50),
                justifyContent: "center",
                alignItems: "center",
                width: CSS.pixel(550),
                height: CSS.pixel(80, true)
              }}
              onPress={this.onPressLogin.bind(this)}
              testID={'loginButton_LoginMainScreen'}
            >
              <Text
                style={{
                  fontSize: CSS.textSize(34),
                  color: sdStyles.SDFontColorMain,
                  //fontWeight: "600"
                }}
              >
                登 录
              </Text>
            </Touchable>
          </View>
          <View
            style={{
              width: CSS.pixel(550),
              backgroundColor: "transparent",
              paddingLeft: 0,
              paddingRight: 0,
              flexDirection: "row",
              justifyContent: "space-between",
              borderWidth: 0,
              borderColor: "#f00",
            }}
          >
            <Touchable testID={"ForgetPassword_LoginMainScreen"} onPress={this.handleForget}>
              <Text style={{ color: "#fff", fontSize: CSS.textSize(26) }}>
                忘记密码
              </Text>
            </Touchable>
            <Touchable testID={"SignupText_LoginMainScreen"} onPress={this.handleRegister}>
              <Text style={{ color: "#fff", fontSize: CSS.textSize(26) }}>
                没有账号？点击注册
              </Text>
            </Touchable>
          </View>
        </ImageBackground>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(LoginMainScreenWithPassword);
