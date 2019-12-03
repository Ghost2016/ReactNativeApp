import React from "react";
import {
  AppState,
  Platform,
  PermissionsAndroid,
  Alert,
  BackHandler,
  NativeModules,
  Dimensions,
  Linking,
  NetInfo
} from "react-native";
import { Provider } from "react-redux";
import { Navigation } from "react-native-navigation";
import store from "../boot/store";
import {
  registerLoginScreens,
  registerScreenVisibilityListener
} from "./index";
import { Toast } from "antd-mobile";
import * as WeChat from "react-native-wechat";
import codePush from "react-native-code-push";
import JPushModule from "jpush-react-native";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { navStyle } from "@utils/navigationHelper";
import config from "../config";
import HotUpdateLightBox, {
  hotUpdateLightBox
} from "./lightBoxScreen/HotUpdateLightBox";
require("../sentry");
import Geolocation from "../boot/Geolocation";
import { navLightBox, dismissLightBox } from "../styles";
import MobStat from "../boot/MobStat";
import { getServerTime } from "../api";
import { CurrAudioCom } from "../common/SDDragMove";
import { getAddressInfo } from "../api/aMap";
Geolocation.init({
  ios: config.aMapIosKey,
  android: config.aMapAndroidKey
}).then(() => {
  Geolocation.setOptions({
    interval: 180000, // android only
    distanceFilter: 20, // ios only
    reGeocode: false // android & ios  如果为true的话在偏僻环境会崩
  });
  Geolocation.addLocationListener(location => {
    // 获取到经纬度后查询逆地理编码
    if(!location || !location.longitude || !location.latitude) {
      return;
    } else {
      Platform.OS == 'ios' && Geolocation.stop();
    }
    getAddressInfo({
      longitude: location.longitude,
      latitude: location.latitude
    }).then(res => {
      let reg = res && res.regeocode ? res.regeocode : {};
      let regDetail = {
        adCode: reg.addressComponent && reg.addressComponent.adcode ? reg.addressComponent.adcode : "",
        country: reg.addressComponent && reg.addressComponent.country ? reg.addressComponent.country : "",
        city: reg.addressComponent && reg.addressComponent.city ? reg.addressComponent.city : "",
        province: reg.addressComponent && reg.addressComponent.province ? reg.addressComponent.province : "",
        address: reg.formatted_address ? reg.formatted_address : "",
        street: reg.addressComponent && reg.addressComponent.streetNumber && reg.addressComponent.streetNumber.street ? reg.addressComponent.streetNumber.street : "",
      }
      store.dispatch({
        type: "UPDATE_LOCATION",
        json: {
          ...location,
          ...regDetail
        }
      });
    }).catch(err => {})
  });

  Geolocation.start();   // 启动定位
});

// 设置百度统计
MobStat.setAppKey({
  ios: config.mobStatIosKey,
  android: config.mobStatAndroidKey
});
MobStat.setDebugOn(true);

// $FlowFixMe
console.ignoredYellowBox = [
  "Possible Unhandled Promise Rejection (id: 0):",
]; // eslint-disable-line

registerLoginScreens(store, Provider);
registerScreenVisibilityListener();

let receivedUpdate = 0;
let totalUpdate = 0;

export let isCodePushLast = false;

export let SERVER_TIME_CONFIG = {
  time: null,
  timer: null
};

export let NetWorkStatus = {
  NetWorkConnected: true
};

NetInfo.isConnected.addEventListener("connectionChange", (connected) => {
  NetWorkStatus.NetWorkConnected = connected;
});

// notice that this is just a simple class, it's not a React component
export default class AppLaunchScreen {
  _appState = '';
  constructor() {
    // this.updateTimer = null;
    this.isUpdating = false;
    this.bootstrapDeepLinks();
    new Promise((resolve, reject) => {
      try{
        // 注册微信
        WeChat.registerApp(config.wxAppId);

        // // 注册code-push
        AppState.addEventListener("change", newState => {
          // 关闭后台声音播放
          try {
            CurrAudioCom && CurrAudioCom.ref && CurrAudioCom.ref.pause && CurrAudioCom.ref.pause();
          } catch (error) {

          }

          if(newState === "active") {
            // 判断是否已经登录了
            if(store.getState && store.getState().user && store.getState().user.token) {
              codePush.sync(
                {
                  updateDialog: {
                    appendReleaseDescription: true, // 显示更新内容
                    descriptionPrefix: "",
                    // descriptionPrefix: "\n\n更新内容：\n",
                    title: "版本更新",
                    mandatoryUpdateMessage: "",
                    mandatoryContinueButtonLabel: "立即更新"
                  },
                  mandatoryInstallMode: codePush.InstallMode.IMMEDIATE
                },
                this.codePushStatusDidChange.bind(this),
                this.codePushDownloadDidProgress.bind(this)
              );
            }
          }
          // 获取服务器时间
          if(SERVER_TIME_CONFIG.timer) {
            clearInterval(SERVER_TIME_CONFIG.timer);
          }
          if(store.getState && store.getState().user && store.getState().user.token) {
            getServerTime().then(res => {
              if(res.status == 'ok') {
                SERVER_TIME_CONFIG.time = new Date(parseInt(res.results.timestamp + "" + "000"));
                // let offsetmsec = SERVER_TIME_CONFIG.time.getTimezoneOffset() * 60000;
                // SERVER_TIME_CONFIG.time = new Date(SERVER_TIME_CONFIG.time.getTime() - offsetmsec);
                SERVER_TIME_CONFIG.timer = setInterval(() => {
                  // 加一秒
                  SERVER_TIME_CONFIG.time = new Date(SERVER_TIME_CONFIG.time.getTime() + 1000);
                }, 1000);
              }
            }).catch(err => {

            })
          }
        });

        // 注册极光推送
        // android 模拟器 不能在这里注册极光推送 要卡屏
        // 所以选择在Home里注册
        if (!config.isEmulator) {
          if (Platform.OS === "ios") {
            if (Platform.OS === "android") {
              JPushModule.initPush();
              JPushModule.notifyJSDidLoad(resultCode => {});
            } else {
              JPushModule.setupPush();
            }

            JPushModule.addReceiveCustomMsgListener(map => {
              console.log("extras: " + map.extras);
            });

            JPushModule.addReceiveNotificationListener(map => {
              console.log("alertContent: " + map.alertContent);
              console.log("extras: " + map.extras);
            });

            JPushModule.addReceiveOpenNotificationListener(map => {
              console.log("Opening notification!");
              console.log("map.extra: " + map.extras);
            });
          }
        }

        resolve(true)
      } catch (err) {
        reject(err)
      }

    }).then(data => {
      //APP初始化成功
      store.subscribe(this.onStoreUpdate.bind(this));
    }).catch(err => {
      Toast.fail("APP初始化失败！暂时无法使用，抱歉。", 1);
    })
    // Platform.OS === 'android' && this.permissionCheck();
    // Platform.OS === "android" && this.registerBackHome();
  }

  bootstrapDeepLinks() {
    console.log('[deeplink] bootstrapDeepLinks');
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
      console.log('[deeplink] Updated url in IOS is: ' + event.url);
    //}
  }

  // This will check for deeplink changes in android only
  _handleAppStateChange(currentAppState) {
    this._appState = currentAppState;
    this._checkInitialURL();
  }

  _checkInitialURL() {
    console.log('[deeplink] _checkInitialURL');
    Linking.getInitialURL().then((url) => {
      console.log('[deeplink] getInitialURL', url);
      if (url) {
        //if(__DEV__) {
          if(Platform.OS === 'android') {
            console.log('[deeplink] Updated url in Android is: ' + url);
          } else {
            // Linking.getInitialURL() will only be fired once in IOS
            console.log('[deeplink] Initial url is: ' + url);
          }
        //}
      }
    }).catch(err => console.warn('[deeplink] Linking An error occurred', err));
  }

  onStoreUpdate() {
    const { root } = store.getState().launchScreen;
    if (root !== "" && this.currRoot !== root) {
      this.currRoot = root;
      this.startApp(root);
    }
  }

  codePushStatusDidChange(syncStatus) {
    switch (syncStatus) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        //console.warn("检查是否有新版本");
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        // Platform.OS == "ios"
          // ? navLightBox("LightBoxScreen", {
          this.isUpdating = true;
          navLightBox("LightBoxScreen", {
              passProps: {
                screen: () => (
                  <HotUpdateLightBox
                    style={{
                      left: 0,
                      top: 0,
                      borderRadius: 0,
                      width: Dimensions.get("window").width,
                      height: Dimensions.get("window").height
                    }}
                    progress={receivedUpdate / totalUpdate}
                  />
                )
              }
            })
          // : Toast.loading("更新中", 0);
        //console.warn("下载更新包中");
        break;
      case codePush.SyncStatus.AWAITING_USER_ACTION:
        //console.warn("正在等待用户选择");
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        dismissLightBox();
        //console.warn("安装更新中");
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        isCodePushLast = true;
        // console.warn("App已经是最新版");
        break;
      case codePush.SyncStatus.UPDATE_IGNORED:
        //console.warn("用户手动取消");
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        dismissLightBox();
        //console.warn("更新完成，App正在重启");
        break;
      case codePush.SyncStatus.UNKNOWN_ERROR:
        //console.warn("code push key 不正确");
        break;
    }
  }

  //下载资源包
  codePushDownloadDidProgress(progress) {
    receivedUpdate = progress.receivedBytes || 0;
    totalUpdate = progress.totalBytes || 100;

    // if (this.context.refs["_updateHotLightBox"]) {
    //   this.context.refs["_updateHotLightBox"].setState({
    //     progress: receivedUpdate / totalUpdate
    //   });
    // }
    // if (Platform.OS == "android") {
    //   if (receivedUpdate >= totalUpdate - 3000) {
    //     dismissLightBox();
    //   }
    // }

    // if (Platform.OS == "ios" && hotUpdateLightBox) {
    if (hotUpdateLightBox) {
      hotUpdateLightBox.setState({
        progress: receivedUpdate / totalUpdate
      });
      if((receivedUpdate >= totalUpdate) || (totalUpdate - receivedUpdate <= 10000) || (receivedUpdate / totalUpdate * 1.0) >= 0.9) {
        // Toast.info("更新完成, 请重启app", 1.5);
        hotUpdateLightBox.setState({
          progress: 1
        });
        setTimeout(() => {
          dismissLightBox();
        })
      }
    } else {

    }
    // if (this.updateTimer) {
    //   return;
    // } else {
    //   this.updateTimer = setInterval(() => {
    //     if (receivedUpdate >= totalUpdate - 1000) {
    //       clearInterval(this.updateTimer);
    //     }
    //     Toast.loading(`接收${receivedUpdate} / 总共${totalUpdate}`, 0);
    //   }, 800);
    // }
  }

  // android权限检查
  permissionCheck() {
    // PermissionsAndroid.checkPermission
    try {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        // title: "职么开门想访问您的相机",
        // message: "为了能拍照和使用图库 职么开门需要使用您的相机"
      }).then(granted => {
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
      //Alert.alert(error);
      Toast.fail("我们需要你提供相机、储存、网络权限，以免影响APP使用体验", 1);
    }
  }

  registerBackHome() {}

  checkUpdate() {
    if(Platform.OS == 'ios') {
      setTimeout(() => {
        if(this.isUpdating) {
          return;
        } else {
          codePush.sync(
            {
              updateDialog: {
                appendReleaseDescription: true, // 显示更新内容
                descriptionPrefix: "",
                // descriptionPrefix: "\n\n更新内容：\n",
                title: "版本更新",
                mandatoryUpdateMessage: "",
                mandatoryContinueButtonLabel: "立即更新"
              },
              mandatoryInstallMode: codePush.InstallMode.IMMEDIATE
            },
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this)
          );
        }
      }, 4000);
    }
  }

  startApp(root) {
    this.isUpdating = false;
    switch (root) {
      case "login":
        if (Platform.OS === "ios") {
          Navigation.startSingleScreenApp({
            screen: {
              // screen: "example.AnimateLoginScreen",
              screen: "example.StartScreen",
              title: "职么开门",
              navigatorStyle: {
                navBarHidden: true, // 隐藏Tab栏
                navBarTextColor: "#fff",

                navBarHidden: true,

                statusBarHidden: true,

                // ios
                statusBarTextColorScheme: "light"
              }
            },
            animationType: "fade"
          });
        } else {
          Navigation.startSingleScreenApp({
            screen: {
              screen: "example.StartScreen",
              title: "职么开门",
              navigatorStyle: {
                navBarHidden: true, // 隐藏Tab栏
                statusBarHidden: true, // 隐藏状态栏
                navBarBackgroundColor: "#bfbfbf",
                navBarTextColor: "#fff",
                navBarTitleTextCentered: true,
                navBarSubTitleTextCentered: true,

                statusBarHidden: true,
                statusBarColor: "#a0a0a0"
              }
            },
            animationType: "fade"
          });
        }
        return;
      case "loginReal":
        if (Platform.OS === "ios") {
          Navigation.startSingleScreenApp({
            screen: {
              screen: "example.LoginMainScreen",
              //screen: "example.OtherInfoRegisterScreen",
              title: "职么开门",
              navigatorStyle: {
                navBarHidden: true, // 隐藏Tab栏
                // statusBarHidden: true // 隐藏状态栏
                // navBarBackgroundColor: "#bfbfbf",
                navBarTextColor: "#fff",

                navBarHidden: true,

                statusBarHidden: true,

                // ios
                statusBarTextColorScheme: "light"
              }
            },
            animationType: "fade"
          });
        } else {
          Navigation.startSingleScreenApp({
            screen: {
              screen: "example.LoginMainScreen",
              title: "职么开门",
              navigatorStyle: {
                navBarHidden: true, // 隐藏Tab栏
                statusBarHidden: true, // 隐藏状态栏
                navBarBackgroundColor: "#bfbfbf",
                navBarTextColor: "#fff",
                navBarTitleTextCentered: true,
                navBarSubTitleTextCentered: true,
                // android
                statusBarColor: "#a0a0a0"
              }
            },
            animationType: "fade"
          });
        }
        return;
      case "after-login":
        Navigation.startTabBasedApp({
          tabs: [
            {
              label: "首页",
              screen: "example.HomeScreen",
              //screen: "example.OtherInfoRegisterScreen",
              icon: require("@img/home/01tab_bar/tab_bar_ico_home.png"),
              selectedIcon: require("@img/home/01tab_bar/tab_bar_ico_home_pre.png"),
              title: "首页",
              // overrideBackPress: true,
              navigatorStyle: {
                navBarTitleTextCentered: true,
                navBarSubTitleTextCentered: true,
                navBarHidden: true,
                drawUnderStatusBar: true,
                statusBarColor: "transparent",
                statusBarTextColorScheme: "dark"
                // drawUnderTabBar: true,

                // android
                // statusBarColor: "#a0a0a0",
                // statusBarColor: sdStyles.SDMainColor,
                // collapsingToolBarImage: "http://lorempixel.com/400/200/", // Collapsing Toolbar image.
                // collapsingToolBarImage: require("../../img/topbar.jpg"), // Collapsing Toolbar image. Either use a url or require a local image.
                // collapsingToolBarCollapsedColor: "#0f2362", //
              }
              //navigatorButtons: config.isDev ? backToLoginBtn : {}
            },
            {
              label: "排名",
              screen: "example.RankScreen",
              icon: require("@img/home/01tab_bar/tab_bar_ico_Rank.png"),
              selectedIcon: require("@img/home/01tab_bar/tab_bar_ico_Rank_pre.png"),
              title: "排名",
              // navigatorStyle: navStyle({
              //   navBarBackgroundColor: sdStyles.SDMainColor,
              //   // navBarHidden: false,
              //   navBarHidden: true,
              //   statusBarColor: sdStyles.SDMainColor
              // })
              navigatorStyle: {
                navBarTitleTextCentered: true,
                navBarSubTitleTextCentered: true,
                navBarHidden: true,
                drawUnderStatusBar: true,
                statusBarColor: "transparent",
                statusBarTextColorScheme: "light"
              }
            },
            {
              label: "成长",
              screen: "example.GrowScreen", //"example.GrowScreen",
              icon: require("@img/home/01tab_bar/tab_bar_ico_growing.png"),
              selectedIcon: require("@img/home/01tab_bar/tab_bar_ico_growing_pre.png"),
              title: "成长",
              // navigatorStyle: navStyle({
              //   navBarBackgroundColor: sdStyles.SDMainColor,
              //   navBarHidden: false,
              //   statusBarColor: sdStyles.SDMainColor
              // })
              navigatorStyle: {
                navBarTitleTextCentered: true,
                navBarSubTitleTextCentered: true,
                navBarHidden: true,
                drawUnderStatusBar: true,
                statusBarColor: "transparent",
                statusBarTextColorScheme: "dark"
              }
              //navigatorButtons: config.isDev ? backToLoginBtn : {}
            },
            {
              label: "我的",
              screen: "example.PersonScreen",
              icon: require("@img/home/01tab_bar/tab_bar_ico_mine.png"),
              selectedIcon: require("@img/home/01tab_bar/tab_bar_ico_mine_pre.png"),
              title: "我的",
              navigatorStyle: {
                navBarTitleTextCentered: true, // default: false. centers the title.
                navBarSubTitleTextCentered: true,
                navBarHidden: true,
                drawUnderStatusBar: true,
                statusBarColor: "transparent",
                statusBarTextColorScheme: "light"
              }
            }
          ],
          // animationType: "slide-down",
          animationType: "fade",
          tabsStyle: {
            tabBarBackgroundColor: "#fff", // 底部
            tabBarButtonColor: "#d4d4d4",
            tabBarSelectedButtonColor: "#a0a0a0"
            //tabFontFamily: "BioRhyme-Bold",
          },
          appStyle: {
            // navBarButtonColor: "#ffffff",
            navBarTextColor: "#fff",
            navBarBackgroundColor: "#a0a0a0", // 顶部
            //tabFontFamily: "BioRhyme-Bold",
            tabBarHidden: true,
            drawUnderTabBar: true,
            tabBarBackgroundColor: "#fff",
            tabBarButtonColor: "#d3d3d3",
            tabBarSelectedLabelColor: "#666",
            tabBarHideShadow: true,
            forceTitlesDisplay: true,
            tabBarSelectedButtonColor: sdStyles.SDMainColor,
            // tabBarTranslucent: false,
            // statusBarHidden: true,
            //tabFontFamily: 'Avenir-Medium',  // existing font family name or asset file without extension which can be '.ttf' or '.otf' (searched only if '.ttf' asset not found)
            tabFontSize: CSS.pixel(18),
            selectedTabFontSize: CSS.pixel(18)
          }
        });
        this.checkUpdate();
        return;
      default:
        console.error("Unknown app root");
    }
  }
}
