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
    marginTop: CSS.pixel(52),
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
class LoginMainScreen extends React.Component {
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
    this.bootstrapDeepLinks();
    if (Platform.OS == "android") {
      // this.permissionCheck();
      NativeModules.BackHome &&
      NativeModules.BackHome.getPermissions &&
      NativeModules.BackHome.getPermissions();
    }
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

    this.context.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onPressEyeAction(){
    //重设光标位置
    this.refs["_passwdInput"].refs.userPassword.setNativeProps({ selection:{ start:0, end:0 } })
    setTimeout(() => {
      this.refs["_passwdInput"].refs.userPassword.setNativeProps({ selection:{ start:this.state.userPassword.length, end:this.state.userPassword.length } })
    }, 10);
  }

  onPressTos() {
    this.context.navigator.push(
      navScreen("PushScreen", "用户协议", {
        passProps: {
          screen: () => <TosScreen />,
          fullScreen: true,
          header: {
            title: "用户协议",
            //fixed: true,
          }
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存"),
      })
    );

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

  onPressShare() {
    Alert.alert(
      "",
      "“职么开门”想要打开“微信”",
      [
        {
          text: "取消",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "打开",
          onPress: async () => {
            // await WeChat.openWXApp();
            WeChat.isWXAppInstalled().then(isInstalled => {
              if (isInstalled) {
                //发送授权请求
                WeChat.sendAuthRequest(config.wxScope, config.wxState)
                  .then(responseCode => {
                    // 返回code码，通过code获取access_token
                    // this.getAccessToken(responseCode.code);
                    // console.warn(responseCode);
                    // console.log(responseCode);
                    // this.props.actions.getWeChatTokenAction(responseCode)
                    Toast.loading("等待微信认证", 0);
                    this.props.actions.postWeChatCodeAction(
                      {
                        code: responseCode.code
                      },
                      res => {
                        if (res.status == "ok") {
                          // 判断是否有教育信息
                          // 跳转到主页
                          setTimeout(() => {
                            this.props.actions.wechatLoginAction(
                              res.results.token
                            );
                          }, 1000);
                        } else {
                          Toast.fail(res.msg);
                        }
                      }
                    );
                  })
                  .catch(err => {
                    try {
                      Toast.hide();
                      Toast.fail("登录授权发生错误：" + JSON.stringify(err));
                    } catch (error) {
                      Toast.fail(error);
                    }

                  });
              } else {
                Toast.fail("你尚未安装微信，请使用账号密码登录。");
              }
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

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

  // android权限检查
  permissionCheck() {
    // PermissionsAndroid.checkPermission
    try {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
        // {
        //   title: "职么开门想访问您的相机",
        //   message: "为了能拍照和使用图库 职么开门需要使用您的相机"
        // }
      ).then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //console.warn("相机权限开启成功");
        } else {
          // Alert.alert("为了更好的体验App，请您手动到设置里打开相机权限");
        }
      });

      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        // {
        //   title: "职么开门想获取文件写入权限",
        //   message: "为了能存储本地数据 职么开门需要使用您的文件权限"
        // }
      ).then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //console.warn("写入文件权限开启成功");
        } else {
          // Alert.alert("为了更好的体验App，请您手动到设置里打开文件写入权限");
        }
      });

      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        // {
        //   title: "职么开门想获取文件访问权限",
        //   message: "为了能访问本地数据 职么开门需要使用您的文件权限"
        // }
      ).then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //console.warn("读取文件权限开启成功");
        } else {
          // Alert.alert("为了更好的体验App，请您手动到设置里打开文件读取权限");
        }
      });

      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        // {
        //   title: "职么开门想获取GPS定位权限",
        //   message: "为了能访问位置信息 职么开门需要使用您的GPS定位权限"
        // }
      ).then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //console.warn("GPS定位权限开启成功");
        } else {
          // Alert.alert("为了更好的体验App，请您手动到设置里打开GPS定位权限");
        }
      });

      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        // {
        //   title: "职么开门想获取网络定位权限",
        //   message: "为了能访问位置信息 职么开门需要使用您的网络定位权限"
        // }
      ).then(granted => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //console.warn("网络定位权限开启成功");
        } else {
          // Alert.alert("为了更好的体验App，请您手动到设置里打开网络定位权限");
        }
      });

      // 后期读取通讯录列表权限
    } catch (error) {
      Alert.alert(error);
    }
  }

  tabChanged(index){
    console.log("tabChanged", index)
    setTimeout(() => {
      if(index === 0){
        this.refs["_userAccount"].refs.userAccount.focus();
      } else if(index === 1){
        this.refs["_userPhone"].refs.userPhone.focus();
      }
    }, 1000);

    this.setState({
      currentTab: index,
    })
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
          {/* <StatusBar backgroundColor="rgba(0,0,0,0)" translucent animated /> */}
          <View style={{ marginTop: CSS.pixel(90) }}>
            <Image
              source={require("@img/login/login_logo.png")}
              style={{ width: CSS.pixel(170), height: CSS.pixel(86) }}
            />
          </View>

          <SDTabs2
            tabTitles={["账号密码登录", "手机号快速登录"]}
            page={0}
            underLineWidth={CSS.pixel(90)}
            onChangeTab={this.tabChanged.bind(this)}
            style={{
              marginTop:CSS.pixel(64, true),
            }}
            tabWidthStyle={{
              width: width - CSS.pixel(100),
              borderWidth: 0,
              borderColor: '#f00',
            }}
          >
            <View style={styles.tabContent}>
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
              <View style={[styles.tabContent]}>
                <SDInput2
                  ref="_userPhone"
                  placeholder="输入手机号"
                  onChange={value => {
                    this.setState({ userPhone: value });
                    //this.setState({ userAccount: value })
                    if (value.match(/^1[0-9]{10}$/i)) {
                      this.setState({ isValidPhone: true });
                    } else {
                      this.setState({ isValidPhone: false });
                    }
                  }}
                  refName="userPhone"
                  type="number"
                  returnKeyLabel="下一步"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.refs["_userCodeInput"].refs.userCode.focus();
                  }}
                  defaultValue={this.state.userPhone}
                  icon={iconLoginPhone}
                />
                <SDInputHalf2
                  placeholder="输入短信验证码"
                  ref="_userCodeInput"
                  onChange={value => this.setState({ userCode: value })}
                  refName="userCode"
                  type="text"
                  returnKeyLabel="登录"
                  returnKeyType="done"
                  onSubmitEditing={e => {
                    if (
                      this.state.userAccount != "" &&
                      this.state.userCode != ""
                    ) {
                      Toast.loading("正在登录", 0.3);
                      this.props.actions.loginAction(
                        {
                          phone: this.state.userPhone,
                          code: this.state.userCode,
                          type: "code"
                        },
                        this.context.navigator
                      );
                    }
                  }}
                  icon={iconLoginCode}
                  right={this.getCountDown}
                  inputStyle={{
                    marginBottom: CSS.pixel(0, true),
                  }}
                />
              </View>
          </SDTabs2>

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
          <ShareIcons
            style={{
              opacity: this.state.isShowThirdLogin ? 1.0 : 0.0,
              borderWidth: 0,
              borderColor: "#f00",
              marginTop: CSS.pixel(321 - 86, true),
              marginBottom: CSS.pixel(86, true),
            }}
            textStyle={{
              color: "#bebebe",
              backgroundColor: "transparent",
              fontSize: CSS.textSize(20)
            }}
            iconList={[
              {
                type: "weixin",
                title: ""
              }
            ]}
            onPress={this.state.isShowThirdLogin ? this.onPressShare.bind(this) : () => null}
          />
          <View
            style={{
              width: CSS.pixel(550),
              //position: "relative",
              //bottom: "15%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: Platform.OS == "android" ? CSS.pixel(39, true) : CSS.pixel(39, true)
            }}
          >
            <Text style={{ fontSize: CSS.textSize(24), color: "#fff" }}>
              注册或登录表示同意
            </Text>
            <Touchable
              onPress={this.onPressTos.bind(this)}
              testID={'userAgreement_LoginMainScreen'}
              style={{ borderWidth: 0, borderColor: "#f00" }}
            >
              <Text
                style={{
                  fontSize: CSS.textSize(24),
                  color: sdStyles.SDMainColor
                }}
              >
                《职么开门用户协议》
              </Text>
            </Touchable>
          </View>
        </ImageBackground>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(LoginMainScreen);
