import React from "react";
import PropTypes from "prop-types";
import ReactNative, {
  AppState,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  NativeModules,
  RefreshControl,
  ActivityIndicator,
  Linking,
  WebView
} from "react-native";
const packageConfig = require("../../../../package.json");
import { Toast } from "antd-mobile";
import ConnectWithActions from "@src/connectWithActions";
import * as sdStyles from "@src/styles";
import { CSS } from "../../../common/SDCSS";
import SplashScreen from "react-native-splash-screen";
import JPushModule from "jpush-react-native";
import { Sentry } from "react-native-sentry";
import Ascription from "../../../sd_ascription/Ascription";
import ScroeChartWrap from "../../../sd_scroechartwrap/Scroechartwrap";
import EmploymentInfo from "../../../sd_employmentinfo/EmploymentInfo";
import { navScreen } from "@styles";
import { Navigation } from "react-native-navigation";
import { getUserBaseInfo } from "@src/users/usersSelector";
import CalcSalaryHomeScreen from "../../pushScreen/calcSalary/CalcSalaryHomeScreen";
import StudentShare from "../../pushScreen/studentShare/StudentShare";
import { navRightButton, navLightBox, SDMainColor } from "../../../styles";
import GrowCheckinCalendar from "@sd_components/GrowCheckinCalendar";
import config from "../../../config";
import HotUpdateLightBox from "../../lightBoxScreen/HotUpdateLightBox";
import ShareButton from "../../../sd_shareButton/ShareButton";
import { isCodePushLast, SERVER_TIME_CONFIG } from "../../AppLaunchScreen";
import AscriptionChart from "./AscriptionChart";
import SDHeader, {
  headerHeight,
  headerPadding,
  headerOffsetHeight
} from "../../../common/SDHeader";
import HomeFixHeader from "./HomeFixHeader";
import FooterLine from "../../../sd_footertLine/FooterLine";
import GrowCheckin from "@sd_components/GrowCheckin";
import BarPowerSalary from "@sd_components/BarPowerSalary";
import SDSection from "@sd_components/SDSection";
import ExpDetailScreen from "@src/screens/pushScreen/expDetail/ExpDetailScreen";
import * as HOSTS from '@src/host';

import SafeArea from "react-native-safe-area";
import TrackRecordScreen from "../../pushScreen/trackRecord/TrackRecordScreen";
import OtherInfoRegisterScreen from "../../registerScreen/OtherInfoRegisterScreen";
import GrowTargetSwitch2 from "@sd_components/GrowTargetSwitch2";
import { currentJobPlan, getIsFirstEnterIndex } from "@src/selectors";
import { refreshJobPlanListAction } from "@utils/funcs";
import SDTabBar from "../../../common/SDTabBar";
import MobStat from "../../../boot/MobStat";
import IMChat from "../../../boot/IMChat";
import ImagePicker from "react-native-image-crop-picker";
import IMChatctcScreen from "../../pushScreen/imchat/IMChatctcScreen";
import SDDragMove, { CurrAudioCom } from "../../../common/SDDragMove";
import TitleWrap from "../../../sd_employmentinfo/titlelistwarp/TitleWrap";
import LiveCourseListScreen from "../../pushScreen/liveCourse/LiveCourseListScreen";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import LiveCourseDetailScreen from "../../pushScreen/liveCourse/LiveCourseDetailScreen";
import DirectInfoDetailScreen from "../../pushScreen/directInfoDetail/DirectInfoDetailScreen";
import { getServerTime } from "../../../api";
import QQShare from "../../../boot/QQShare";
import { AndroidWebsite, IosWebsite } from "../../../host";
import { SDGuidePage } from "@sd_components";
import { ScreenType } from "../..";
import { PageNames } from "../../pushScreen/PushScreen";
import { lastApiPath, lastApiReq, lastApiRes } from "../../../api/apiFetch";

const styles = StyleSheet.create({});
// 主页屏幕
class HomeScreen extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
    //socket: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.bootstrapDeepLinks();
    this.state = {
      isRefreshing: false,
      courseList: [],
      newsList: [],
      loading: true,

      noUserData: false,      // 是否有用户数据
    };
  }

  bootstrapDeepLinks() {
    console.log('[deeplink3] bootstrapDeepLinks');
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
      console.log('[deeplink3] Updated url in IOS is: ' + event.url);
    //}
  }

  // This will check for deeplink changes in android only
  _handleAppStateChange(currentAppState) {
    this._appState = currentAppState;
    this._checkInitialURL();
  }

  _checkInitialURL() {
    Linking.getInitialURL().then((url) => {
      console.log('[deeplink3] getInitialURL', url);
      if (url) {
        //if(__DEV__) {
          if(Platform.OS === 'android') {
            console.log('[deeplink3] Updated url in Android is: ' + url);
          } else {
            // Linking.getInitialURL() will only be fired once in IOS
            console.log('[deeplink3] Initial url is: ' + url);
          }
        //}
      }
    }).catch(err => console.warn('[deeplink3] Linking An error occurred', err));
  }

  componentWillMount() {
    if (Platform.OS === "android") {
      if (Platform.OS === "android") {
        JPushModule.initPush();
        JPushModule.notifyJSDidLoad(resultCode => {});
      } else {
        JPushModule.setupPush();
      }

      JPushModule.addReceiveCustomMsgListener(map => {
        this.props.actions.getNotifyAction();
        try {
          CurrAudioCom && CurrAudioCom.ref && CurrAudioCom.ref.pause && CurrAudioCom.ref.pause();
        } catch (error) {
        }
      });

      // 接收推送通知&&iOS 10 以下的系统点击推送回调；
      JPushModule.addReceiveNotificationListener(message => {
        try {
          CurrAudioCom && CurrAudioCom.ref && CurrAudioCom.ref.pause && CurrAudioCom.ref.pause();
        } catch (error) {

        }
        this.props.actions.getNotifyAction();
        // 处理iOS10以下APP打开状态接收推送消息的状态；
        if (Platform.OS == "ios" && message.localNotice && AppState.currentState == "active") {
          return false;
        }
        // 解决APP打开状态接收到消息不增加消息徽标
        if (Platform.OS == "ios" && Platform.Version.split(".")[0] >= 10) {
          //因为iOS10以下APP打开状态时接收到消息但是不显示在通知栏所以暂时先这样处理；
          let sumbagde = message.aps.badge;
          JPushModule.setBadge(sumbagde, (success) => {
          });
        }
        if (Platform.OS == "ios" && Platform.Version.split(".")[0] < 10 && AppState.currentState !== "active") {
          // let params = Platform.OS === "android" ? JSON.parse(message.extras) : message;
          JPushModule.getBadge((badge) => {
            if (badge > 0) {
              badge--;
              JPushModule.setBadge(badges, (success) => {
              });
            }
          });
        }
        //if (Platform.OS == "ios" && Platform.Version.split(".")[0] < 10 && AppState.currentState == "active") {
          // let params = Platform.OS === "android" ? JSON.parse(message.extras) : message;
          // let cdate = new Date();
          // JPushModule.sendLocalNotification({
          //     fireTime: cdate.getTime() + 500,
          //     content: params.aps.alert,
          //     badge: params.aps.badge,
          //     extra: {localNotice: true,...params}
          // })
        //}
      });

      //应用没有启动情况；
      JPushModule.addOpenNotificationLaunchAppListener(message => {
        try {
          CurrAudioCom && CurrAudioCom.ref && CurrAudioCom.ref.pause && CurrAudioCom.ref.pause();
        } catch (error) {

        }
        if (Platform.OS == "ios") {
          JPushModule.getBadge((badge) => {
            if (badge > 0) {
              badge--;
              JPushModule.setBadge(badge, (success) => {
              });
            }
          });
        }
      });

      //点击推送消息打开应用回调
      JPushModule.addReceiveOpenNotificationListener(message => {
        try {
          CurrAudioCom && CurrAudioCom.ref && CurrAudioCom.ref.pause && CurrAudioCom.ref.pause();
        } catch (error) {

        }
        this.props.actions.getNotifyAction();
        // let params = Platform.OS === "android" ? JSON.parse(message.extras) : message;
        if (Platform.OS == "ios") {
          JPushModule.getBadge((badge) => {
            badges = badge;
            if (badge > 0) {
              badge--;
              JPushModule.setBadge(badges, (success) => {
              });
            }
          });
        }
      });
    }
  }

  // componentDidMount(){
  //   this.refs['suanxinzi_webview'].reload();
  // }

  componentWillUnmount() {
    MobStat.onPageEnd("首页");
  }

  async componentDidMount() {
    MobStat.onPageStart("首页");

    // 注册qq
    QQShare.init(config.tencentId);

    // this.context.navigator.push(
    //   navScreen("PushScreen", "职么开门", {
    //     override: {
    //       overrideBackPress: true,
    //       navigatorStyle: {
    //         disabledBackGesture: true,
    //         statusBarColor: "transparent",
    //         statusBarTextColorScheme: "light",
    //         drawUnderStatusBar: true,
    //         navBarNoBorder: true,
    //         navBarHidden: true,
    //         tabBarHidden: true // 隐藏tab
    //       }
    //     },
    //     passProps: {
    //       screen: () => <OtherInfoRegisterScreen />,
    //       fullScreen: true,
    //       noScrollView: true,
    //       statusBarColor: "light"
    //     }
    //   })
    // );
    // return;
    // Toast.info("测试更新");
    // 通过ref访问 homeScreen
    this.context.refs["_homeScreen"] = this;
    const res = await this.props.actions.getUserInfoAction();
    //this.props.actions.getUserInfoAction().then(res => {
      // 判断是否信息完整
      if (res && res.results && res.results.total) {
        const { school_name, major_name, degree_name } = res.results.total;
        if (!school_name || !major_name || !degree_name) {
          setTimeout(() => {
            Toast.info("你的注册信息不完整，请先完善！")
          }, 1000);
          // 说明此人信息不完整
          // 进入补充信息界面
          this.context.navigator.push(
            navScreen("PushScreen", "职么开门", {
              override: {
                overrideBackPress: true,
                navigatorStyle: {
                  disabledBackGesture: true,
                  statusBarColor: "transparent",
                  statusBarTextColorScheme: "light",
                  drawUnderStatusBar: true,
                  navBarNoBorder: true,
                  navBarHidden: true,
                  tabBarHidden: true // 隐藏tab
                }
              },
              passProps: {
                screen: () => <OtherInfoRegisterScreen />,
                fullScreen: true,
                noScrollView: true,
                statusBarColor: "light"
              }
            })
          );
          return;
        } else {

          this.sentryExcepion();
          this.state.noUserData = true;
        }
      } else {
        //console.warn("用户信息丢失！", res)
        //Toast.fail("用户信息丢失！请与我们联系。");
        return
      }
    //});
    //检查是否有职业规划
    refreshJobPlanListAction(this);

    // 已废弃 更新为使用缓存机制
    // this.props.actions
    //   .getLiveListAction({ size: 3 })
    //   .then(res => {
    //     if(res && res.results && Array.isArray(res.results)) this.setState({
    //       courseList: res.results
    //     });
    //   })
    //   .catch(err => {});
    // 使用缓存获取
    this.props.actions.getHomeCourseAction({
      size: 3
    }).then(res => {}).catch(err => {});

    this.props.actions.getHomeNewsAction({
      size: 5
    }).then(res => {}).catch(err => {});

    // this.props.actions.getNewsAction({size: 5}).then(res => {
    //   if(res && res.results && Array.isArray(res.results)) this.setState({
    //     newsList: res.results
    //   });
    // }).catch(err => {});

    //自动跳转到成长页面，方便开发
    // if (config.isDev)
    //   this.context.navigator.switchToTab({
    //     tabIndex: config.devTabIndex
    //   });

    // 获取服务器时间
    // if(SERVER_TIME_CONFIG.timer) {
    //   clearInterval(SERVER_TIME_CONFIG.timer);
    // }
    // // let a = new Date(1538047334000);
    // // console.warn();
    // getServerTime().then(res => {
    //   // console.warn(res.results.timestamp * 1000);
    //   // console.warn(new Date(parseInt(res.results.timestamp * 1000)).getTime());
    //   if(res.status == 'ok') {
    //     SERVER_TIME_CONFIG.time = new Date(parseInt(res.results.timestamp + "" + "000"));
    //     // let offsetmsec = SERVER_TIME_CONFIG.time.getTimezoneOffset() * 60000;
    //     // SERVER_TIME_CONFIG.time = new Date(SERVER_TIME_CONFIG.time.getTime() - offsetmsec);
    //     SERVER_TIME_CONFIG.timer = setInterval(() => {
    //       // 加一秒
    //       SERVER_TIME_CONFIG.time = new Date(SERVER_TIME_CONFIG.time.getTime() + 1000);
    //     }, 1000);
    //   }
    // }).catch(err => {

    // })

    if (!config.isEmulator) {
      // 注册设备id
      if (Platform.OS === "ios") {
        setTimeout(() => {
          JPushModule.getRegistrationID(registrationId => {
            console.log(
              "Device register succeed, registrationId " + registrationId
            );
            if (registrationId) {
              this.props.actions.addDeviceAction({
                platform: Platform.OS,
                registration_id: registrationId
              });
            }
          });
        }, 5000);
      } else {
        JPushModule.getRegistrationID(registrationId => {
          console.log(
            "Device register succeed, registrationId " + registrationId
          );
          if (registrationId) {
            this.props.actions.addDeviceAction({
              platform: Platform.OS,
              registration_id: registrationId
            });
          }
        });
        JPushModule.addGetRegistrationIdListener(registrationId => {
          console.log(
            "Device register succeed, registrationId " + registrationId
          );
          if (registrationId) {
            this.props.actions.addDeviceAction({
              platform: Platform.OS,
              registration_id: registrationId
            });
          }
        });
      }
    }

    // 检查android权限
    Platform.OS == "android" &&
      NativeModules.BackHome &&
      NativeModules.BackHome.getPermissions &&
      NativeModules.BackHome.getPermissions();

    // 检查版本是否最新
    this.props.actions.getAppVersionAction({}, res => {
      //console.warn("version", res.version, packageConfig.appVersion)
      if (res.version != packageConfig.appVersion) {
        // debugger;
        // console.warn(res.version, packageConfig.appVersion)
        setTimeout(() => {
          // 判断code-push是否已经是最新了
          //if (isCodePushLast) {
          //isForceUpdate 是否强制更新
          if (res.hasOwnProperty('isForceUpdate') && res.isForceUpdate === "1") {
            Toast.fail(
              res.message ||
                "App不是最新版本, 请到商店下载更新功能，以免影响使用"
            );
            setTimeout(() => {
              if(Platform.OS == "android"){
                Linking.openURL(AndroidWebsite).catch(err =>
                    console.error("An error occurred", err)
                  );
              } else {
                Linking.openURL(IosWebsite).catch(err =>
                    console.error("An error occurred", err)
                  );
              }
             this.props.actions.logoutAction({});
            }, 2000);

          }
        }, 5000);
      }
    });

    setTimeout(() => {
      this.setState({
        loading: false,
      })
    }, 100);


    setTimeout(() => {
      if(this.state.noUserData == false) {
        this.reCheckLogin();
      }
    }, 8000);
  }

  sentryExcepion() {
    Sentry.setShouldSendCallback((e) => {
      Sentry.setUserContext({
        id: this.props.user.id ? this.props.user.id + "" : "",
        username: this.props.user.name ? this.props.user.name + "" : "",
        extra: {
          lastApiPath: lastApiPath,
          lastApiReq: lastApiReq,
          lastApiRes: lastApiRes,
          errorPage: ScreenType.name + " ==> " + (PageNames.length > 0 ? PageNames.join(" > ") : "")
        }
      });
      return true;
    });
  }

  reCheckLogin() {
    this.setState({
      noUserData: true
    });
    this.props.actions.getUserInfoAction().then(res => {
      if (res && res.results && res.results.total) {
        const { school_name, major_name, degree_name } = res.results.total;
        if (!school_name || !major_name || !degree_name) {
          Toast.info("你的注册信息不完整，请先完善！")
          // 说明此人信息不完整
          // 进入补充信息界面
          this.context.navigator.push(
            navScreen("PushScreen", "职么开门", {
              override: {
                overrideBackPress: true,
                navigatorStyle: {
                  disabledBackGesture: true,
                  statusBarColor: "transparent",
                  statusBarTextColorScheme: "light",
                  drawUnderStatusBar: true,
                  navBarNoBorder: true,
                  navBarHidden: true,
                  tabBarHidden: true // 隐藏tab
                }
              },
              passProps: {
                screen: () => <OtherInfoRegisterScreen />,
                fullScreen: true,
                noScrollView: true,
                statusBarColor: "light"
              }
            })
          );
          return;
        }
      } else {
        //console.warn("用户信息丢失！", res)
        //Toast.fail("用户信息丢失！请与我们联系。");
        return
      }

    }).catch(err => {

    })
  }

  onSafeAreaInsetsForRootViewChange = result => {
    // Called every time that safe area insets changed
    this.props.actions.initSafeAreaInsets({
      safeAreaInsets: result.safeAreaInsets
    });
    // { safeAreaInsets: { top: 0, left: 44, bottom: 21, right: 44 } }
  };

  gotoCalendar() {
    this.context.navigator.push(
      navScreen("PushScreen", "每日打卡", {
        passProps: {
          screen: () => <GrowCheckinCalendar />,
          fullScreen: true,
          header: {
            title: "每日打卡"
            //fixed: true,
          }
        }
        //...navRightButton("save_editCourseItem", "保存")
      })
    );
  }

  gotoPersonPage = () => {
    this.context.navigator.push(
      navScreen("PushScreen", "我的履历", {
        passProps: {
          screen: () => <TrackRecordScreen />,
          fullScreen: true,
          noScrollView: true,
          header: {
            title: "我的履历"
          },
          navigatorButtons: {
            rightButtons: [
              {
                icon: () => (
                  <Image source={require("@img/salary/home_ico_share02.png")} />
                ),
                id: "track_share"
              }
            ]
          }
        }
      })
    );
  };

  gotoStudentShare() {
    this.context.navigator.push(
      navScreen("PushScreen", "开门指路", {
        passProps: {
          screen: () => <StudentShare />,
          fullScreen: true,
          noScrollView: true,

          header: {
            title: "开门指路"
          }
        },
        ...navRightButton(
          "filter_studentNewsBtn",
          // require("@img/home/growing_ico_screen.png")
          () => <Image source={require("@img/home/growing_ico_screen.png")} />
        )
      })
    );
  }

  _onRefresh() {
    // return;
    this.setState({
      isRefreshing: true
    });
    Promise.all([
      this.context.refs["homeCardGroup"].fetchData(),
      this.props.actions.getUserInfoAction(),
      this.props.actions.getHomeCourseAction({
        size: 3
      }),
      this.props.actions.getHomeNewsAction({
        size: 5
      }),
    ])
      .then(values => {
        Toast.info("刷新成功", 0.2);
        this.setState({
          isRefreshing: false
        });
      })
      .catch(err => {});
  }

  renderEmptyHome() {
    return (
      <View
        style={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <ActivityIndicator animating={true} />
      </View>
    );
  }

  _onScrollView(e) {
    this.context.refs["ascriptionChart"].onParentScrooly(
      e.nativeEvent.contentOffset.y
    );
    this.context.refs["homeFixHeader"].onParentScrooly(
      e.nativeEvent.contentOffset.y
    );
  }

  _onScrollEndDragView(e) {
    if (
      e.nativeEvent.contentOffset.y > 0 &&
      e.nativeEvent.contentOffset.y <= headerOffsetHeight / 2
    ) {
      this.refs["scrollView"].scrollTo({
        y: 0,
        animated: true
      });
    } else if (
      e.nativeEvent.contentOffset.y > headerOffsetHeight / 2 &&
      e.nativeEvent.contentOffset.y < headerOffsetHeight
    ) {
      this.refs["scrollView"].scrollTo({
        y: headerOffsetHeight + 1,
        animated: true
      });
    }
  }
  // 安卓下载： https://www.pgyer.com/qEkh
  // ios下载：https://www.pgyer.com/b8y3 (ios下载密码: huige) 需要udid才能安装
  renderCourse() {
    return (
      <View style={{backgroundColor: '#fff', marginBottom: CSS.pixel(30, true)}}>
        <View
          style={{
            backgroundColor: "#fff",
            padding: CSS.pixel(30),
            paddingBottom: 0
          }}
        >
          <TitleWrap title="职么课堂" direction=">" onPress={() => {
            this.context.navigator.push(navScreen("PushScreen", "职么课堂", {
              passProps: {
                screen: () => <LiveCourseListScreen />,
                noScrollView: true,
                fullScreen: true,
                header: {
                  title: "职么课堂"
                }
              }
            }))
          }} />
        </View>
        <ScrollView style={{paddingLeft: CSS.pixel(30)}} horizontal={true} showsHorizontalScrollIndicator={false}>
          <WebView source={{uri: HOSTS.SHARE}} style={{height: 0, position: 'absolute', zIndex: -99}}/>

            {this.props.homeLiveCourseList && this.props.homeLiveCourseList.map((c, i) => {
              return (
                <SDTouchOpacity
                  key={i + ""}
                  style={{
                    width: CSS.pixel(440),
                    height: CSS.pixel(290, true),
                    marginRight: CSS.pixel(30),
                    marginTop: CSS.pixel(30, true)
                  }}
                  onPress={() => {
                    if(c) this.context.navigator.push(navScreen("PushScreen", "课程详情", {
                      passProps: {
                        screen: () => <LiveCourseDetailScreen liveData={c}/>,
                        noScrollView: true,
                        fullScreen: true,
                        saveBg: SDMainColor,
                      }
                    }))
                  }}
                >
                  <View
                    style={{
                      width: CSS.pixel(440),
                      height: CSS.pixel(190, true),
                      borderRadius: 4,
                      overflow: "hidden"
                    }}
                  >
                    {(c && c.image && c.image.url) ? <Image
                      style={{
                        width: CSS.pixel(440),
                        height: CSS.pixel(190, true)
                      }}
                      resizeMode="cover"
                      source={{uri: c.image.url + `?imageView2/2/h/440`}}
                    /> : null}
                  </View>
                  <View
                    style={{
                      marginTop: CSS.pixel(16, true)
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      style={{
                        color: "#333",
                        fontSize: CSS.textSize(24),
                        lineHeight: CSS.pixel(34),
                        borderWidth: 0,
                        borderColor: '#f00',

                      }}
                    >
                      {c ? (c.name || c.category_name) : ""}
                    </Text>
                  </View>
                </SDTouchOpacity>
              );
            })}
          </ScrollView>
      </View>
    );
  }

  renderNews() {
    return (
      <View style={{backgroundColor: "#fff"}}>
        <View
          style={{
            padding: CSS.pixel(30),
            paddingBottom: 0
          }}
        >
          <TitleWrap title="开门指路" direction=">" onPress={() => {

            this.context.navigator.push(
              navScreen("PushScreen", "开门指路", {
                passProps: {
                  screen: () => <StudentShare />,
                  fullScreen: true,
                  noScrollView: true,

                  header: {
                    title: "开门指路"
                  }
                },
                ...navRightButton(
                  "filter_studentNewsBtn",
                  // require("@img/home/growing_ico_screen.png")
                  () => <Image source={require("@img/home/growing_ico_screen.png")} />
                )
              })
            );
          }} />

        </View>
        <ScrollView style={{paddingLeft: CSS.pixel(30)}} horizontal={true} showsHorizontalScrollIndicator={false}>
          {this.props.homeNewsList && this.props.homeNewsList.map(c => {
            return (
              <SDTouchOpacity
                key={c.id + ""}
                style={{
                  width: CSS.pixel(440),
                  height: CSS.pixel(290, true),
                  marginRight: CSS.pixel(30),
                  marginTop: CSS.pixel(30, true)
                }}
                onPress={() => {
                  this.context.navigator.push(navScreen("PushScreen", "文章详情", {
                    passProps: {
                      screen: () => <DirectInfoDetailScreen id={c.id} />,
                      fullScreen: true,
                      noScrollView: true,
                      header: {
                        title: "文章详情"
                      }
                    },
                    ...navRightButton("shareNewsBtn", () => (
                      <Image source={require("@img/salary/home_ico_share02.png")} />
                    ))
                  }))
                }}
              >
                <View
                  style={{
                    width: CSS.pixel(440),
                    height: CSS.pixel(190, true),
                    borderRadius: 4,
                    overflow: "hidden"
                  }}
                >
                  {(c.image && c.image.url) ? <Image
                    style={{
                      width: CSS.pixel(440),
                      height: CSS.pixel(190, true)
                    }}
                    resizeMode="cover"
                    source={{
                      uri: c.image ? c.image.url + `?imageView2/2/h/440` : ""
                    }}
                  /> : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text style={{alignItems: 'center', justifyContent: 'center', color: '#999'}}>缺少封面</Text></View>}
                </View>
                <View
                  style={{
                    marginTop: CSS.pixel(16, true)
                  }}
                >
                  <Text
                    numberOfLines={2}
                    style={{
                      color: "#333",
                      fontSize: CSS.textSize(24),
                      lineHeight: CSS.pixel(34)
                    }}
                  >
                    {c.title || c.category_name}
                  </Text>
                </View>
              </SDTouchOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
  render() {
    //开放成长任务
    const { school_name, major_name, degree_name } = this.props.user.total;

    if(!this.state.noUserData) {
      if (!school_name || !major_name || !degree_name) {
        return this.renderEmptyHome();
      }
    }

    // 开放成长任务
    // 如果是第一次进入
    let isFirstEnter = false
    // console.warn(this.props.settings)
    if(this.props.settings === null ) {
      isFirstEnter = true
    } else if(this.props.settings === ""){
      isFirstEnter = true
    } else {
      try {
        let notFirstEnterIndex = JSON.parse(this.props.settings).notFirstEnterIndex
        // 如果没有定义才会显示
        if(notFirstEnterIndex === undefined) {
          isFirstEnter = true
        } else {
          isFirstEnter = false
        }
      } catch (error) {
        isFirstEnter = true;
      }
    }
    if(isFirstEnter) {
      return (<SDGuidePage type="home"/>)
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          ref="scrollView"
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor="#999"
              title="加载中..."
              titleColor="#999"
              colors={["#999", "#00ff00", "#0000ff"]}
              progressBackgroundColor="#ffffff"
            />
          }
          style={{
            flex: 1,
            backgroundColor: "#f3f3f3"
          }}
          scrollEventThrottle={0.1}
          onScroll={this._onScrollView.bind(this)}
          onScrollEndDrag={this._onScrollEndDragView.bind(this)}
        >
          <View><AscriptionChart
            mainBar={() => {
              return (
                <TouchableOpacity
                  style={{
                    marginVertical: CSS.pixel(10, true),
                    flexDirection: "column",
                    alignItems: "center",
                    borderWidth: 0,
                    borderColor: '#f00',
                  }}
                  onPress={() => {
                    this.context.navigator.push(
                      navScreen("PushScreen", "职么力", {
                        passProps: {
                          screen: () => <ExpDetailScreen />, // 自定义传递props
                          // fullScreen: true,
                          // noScrollView: true,
                          header: {
                            title: "职么力"
                            //fixed: true,
                          }
                        }
                      })
                    );
                  }}
                  activeOpacity={0.8}
                >
                  <BarPowerSalary
                    salary={false}
                    barColor={sdStyles.SDBGColorBlue}
                    style={{
                      marginTop: CSS.pixel(14, true),
                      marginBottom: CSS.pixel(8, true)
                    }}
                  />
                  <BarPowerSalary
                    salary={true}
                    barColor={sdStyles.SDMainColor}
                    style={{
                      position: "relative",
                      top: CSS.pixel(-10, true)
                    }}
                  />
                  {/* <Text
                    style={{
                      fontSize: CSS.textSize(24),
                      color: sdStyles.SDFontColorSubtitle,
                      marginTop: CSS.pixel(0, true),
                      position: "relative",
                      top:
                        Platform.OS == "android"
                          ? CSS.pixel(-8, true)
                          : CSS.pixel(-8, true)
                    }}
                  >
                    完善履历、做成长任务可提升职么力
                  </Text> */}
                </TouchableOpacity>
              );
            }}
          />
          {!this.state.loading ? <View style={{
              height: CSS.pixel(30, true),
              width: '100%',
            }}/> : null}
          </View>

          <SDSection>
            <View
            style={{
              backgroundColor: "#fff"
            }}>
            <GrowTargetSwitch2
              hasGoal={this.props.currentJobPlan.position.title ? true : false}
              goalName={this.props.currentJobPlan.position.title}
              twoLinkStyle={{
                paddingLeft: CSS.pixel(10),
                position: 'relative',
                top: Platform.OS=="android"? CSS.pixel(0, true) : CSS.pixel(11, true),
              }}
              noBg={true}
            /></View>
          </SDSection>

          {/* <Ascription />
          <ScroeChartWrap /> */}

          {this.renderCourse()}

          {this.renderNews()}

          <EmploymentInfo />
          <View
            style={{
              height: CSS.pixel(197, true),
              backgroundColor: "#fff",
              marginBottom: CSS.pixel(30, true)
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.context.navigator.push(
                  navScreen("PushScreen", "算薪资", {
                    passProps: {
                      screen: () => (<CalcSalaryHomeScreen />),
                      fullScreen: true,
                      noScrollView: true,
                      header: {
                        title: "算薪资",
                        //fixed: true,
                      }
                    },
                    ...navRightButton("newSuanxinziShareBtn", () => (<Image source={require("@img/salary/home_ico_share02.png")}/>))
                  })
                );
                /* this.context.navigator.push(
                  navScreen("PushScreen", "算薪资", {
                    passProps: {
                      screen: () => <CalcSalaryHomeScreen />, // 自定义传递props
                      fullScreen: true,
                      header: false,
                      statusBarColor: "light"
                    },
                    navigatorStyle: {
                      navBarHidden: true,
                      tabBarHidden: true // 隐藏tab
                    }
                  })
                ); */
              }}
              style={{
                flex: 1,
                width: "100%",
                height: CSS.pixel(198, true),
                padding: CSS.pixel(0),
                borderWidth: 0,
                borderColor: '#f0f',
               }}
            >
              <Image
                style={{
                  flex: 1,
                  alignContent: 'center',
                  width: CSS.pixel(750),
                  height: CSS.pixel(198, true),
                  borderWidth: 0,
                  borderColor: '#f00',
                  //marginVertical: CSS.pixel(20)
                 }}
                source={require("@img/home/home_pic_banner.png")}
                resizeMode="center"
              />
            </TouchableOpacity>
          </View>

          <FooterLine />
        </ScrollView>
        <HomeFixHeader ref="_homeFixHeader" />
        <SDTabBar selectIndex={0} />
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  settings: state.user.settings,
  user: getUserBaseInfo(state),
  currentJobPlan: currentJobPlan(state, props),
  isFirstEnterIndex: getIsFirstEnterIndex(state),
  homeLiveCourseList: state.homeLiveCourseList,
  homeNewsList: state.homeNewsList
}))(HomeScreen);
