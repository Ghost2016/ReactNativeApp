import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  Animated
} from "react-native";
import {Toast} from 'antd-mobile';
import PropTypes from "prop-types";
import connectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";
import SDUpPullScrollView, {
  RefreshState
} from "../../../common/SDUpPullScrollView";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor, navScreen, navLightBox } from "../../../styles";
import { SDHeader } from "../../../common";
import { isIphoneX } from "../../../utils/iphonex";
import { headerHeight, androidTopArea, headerPadding } from "../../../common/SDHeader";
import TitleWrap from "../../../sd_employmentinfo/titlelistwarp/TitleWrap";
import CommentMsgItem from "./CommentItem";
import MoreCommentScreen from "./MoreCommentScreen";
import IMChat from "../../../boot/IMChat";
import MyChatGroupScreen from "../imchat/MyChatGroupScreen";
import config from "../../../config";
import BindPhoneLightBox from "./BindPhoneLightBox";
import CourseBuyLightBox from "./CourseBuyLightBox";
import MyHomeScreen from "../myHome/MyHomeScreen";
import ShareButton from "../../../sd_shareButton/ShareButton";
import IMChatctcScreen from "../imchat/IMChatctcScreen";
import * as HOSTS from "@src/host";

import { SERVER_TIME_CONFIG } from "../../AppLaunchScreen";
import { getServerTime } from "../../../api";
const darkBackIcon = require("@img/salary/home_Salary_back.png");

// 我的-职么课堂详情
class LiveCourseDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liveData: {},
      headerOpacity: new Animated.Value(0),
      headerInfoHeight: new Animated.Value(255),
      scrollViewTop: new Animated.Value(255),

      commentCount: 0,
      commentData: [],
      hasFetch: false
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: () => null
  };

  componentWillUnMount() {
    if(SERVER_TIME_CONFIG.timer) {
      clearInterval(SERVER_TIME_CONFIG.timer);
    }
  }

  componentWillMount() {
    Toast.loading("加载中");
    this.props.actions
      .getLiveCourseDetailAction({
        id: this.props.liveData.id
      })
      .then(res => {
        this.setState({
          liveData: res.results,
          hasFetch: true
        });
        Toast.hide();

        // 如果课程已经结束则获取评论
        if(res.results && res.results.end_time != null) {
          this.props.actions.getLiveCourseCommentAction({
            id: this.props.liveData.id,
            size: 2
          }).then(res => {
            this.setState({
              commentCount: res.count,
              commentData: res.results
            })
          }).catch(err => {

          })
        }
      })
      .catch(err => {
        //console.warn(err)
        this.setState({
          liveData: null,
          hasFetch: true
        });
        Toast.hide();
      });
  }

  componentDidMount() {
    /* setTimeout(() => {
      console.log("[][]=share course url", `${HOSTS.MASTER}/#/detail?id=${this.state.liveData.id}&fromApp=1&fromShare=1`)
    }, 1000); */

  };

  renderCourseLiveCoverInfo() {
    return JSON.stringify(this.state.liveData) !== "{}" ?(
      <View
        style={{ position: "absolute", left: 0, top: isIphoneX() ? headerPadding - 14 : 0, right: 0, bottom: 0 }}
      >
        <Image
          style={{ width: "100%", height: isIphoneX() ? CSS.pixel(260, true) : CSS.pixel(332, true) }}
          resizeMode="cover"
          source={{
            uri: this.state.liveData.image ? this.state.liveData.image.url + "?imageView2/2/h/788" : ""
          }}
        />
        <View
          style={{position: 'absolute', width: "100%", height: isIphoneX() ? CSS.pixel(260, true) : CSS.pixel(332, true), backgroundColor: '#000', opacity: 0.15}}
        />
      </View>
    ) : null
  }

  renderCourseBaseInfoHeight() {
    let opacity = this.state.headerOpacity.interpolate({
      inputRange: [0, 255], //输入值
      outputRange: [1, 0] //输出值
    });
    return JSON.stringify(this.state.liveData) !== "{}" ? (
      <Animated.View
        style={{ height: isIphoneX() ? CSS.pixel(260, true) : CSS.pixel(320, true), opacity: opacity, zIndex: 1}}
      >
      </Animated.View>) : null;
  }

  // 头部课程基本等信息
  renderCourseBaseInfo() {
    return JSON.stringify(this.state.liveData) !== "{}" ? (
      <View style={{flexDirection: 'row', justifyContent: 'center', paddingTop: CSS.pixel(20)}}>
        <View style={{flex: 1}}>
          <View>
            <Text numberOfLines={1} style={{fontWeight: '600', color: '#333', fontSize: CSS.textSize(30), lineHeight: CSS.pixel(42)}}>
              {this.state.liveData.name}
            </Text>
          </View>
          <View>
            <Text numberOfLines={1} style={{fontWeight: '500', color: '#333', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>
              开课时间:{" "}
              {this.state.liveData.start_time
                .slice(0, 16)
                .replace("-", "年")
                .replace("-", "月")
                .replace("T", "日 ")}
            </Text>
          </View>
          <View style={{marginTop: CSS.pixel(8)}}>
            <Text style={{fontWeight: '500', color: '#999', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>
              {this.state.liveData.teacher_name}
            </Text>
          </View>
        </View>
        <View>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{
              color: "#FE8800",
              fontSize: CSS.textSize(44),
              lineHeight: CSS.pixel(52),
            }}>{this.state.liveData.price ? '¥' : ''}</Text>
            <Text style={{
              color: "#FE8800",
              fontSize: CSS.textSize(44),
              lineHeight: CSS.pixel(52),
              fontFamily: "DINCondensedC",
            }}>{this.state.liveData.price ? this.state.liveData.price : "免费"}</Text>
          </View>
        </View>
      </View>
    ) : null;
  }

  _onScrollView(e) {
    // this.refs["_sdHeader"].onScrollHeaderBackground(
    //   e.nativeEvent.contentOffset.y
    // );
    if (e.nativeEvent.contentOffset.y <= 0) {
      this.state.headerInfoHeight.setValue(255);
      this.state.headerOpacity.setValue(0);
      this.state.scrollViewTop.setValue(255);
      return;
    }
    let totalOffset = parseInt(CSS.pixel(394, true) - headerHeight);
    if (e.nativeEvent.contentOffset.y <= totalOffset) {
      // if (Platform.OS == "android") {
      //   return;
      // } else {
        let percent = parseInt(
          (e.nativeEvent.contentOffset.y / totalOffset) * 255
        );
        this.state.headerInfoHeight.setValue(255 - percent);
        this.state.headerOpacity.setValue(percent);
        //   this.state.scrollViewTop.setValue(
        //     255 - 2 * percent <= 0 ? 0 : 255 - 2 * percent
        //   );
      // }
    } else {
      this.state.headerInfoHeight.setValue(0);
      this.state.headerOpacity.setValue(255);
      this.state.scrollViewTop.setValue(0);
    }
  }

  renderWhiteHeader() {
    let opacity = this.state.headerOpacity.interpolate({
      inputRange: [0, 255], //输入值
      outputRange: [1, 0] //输出值
    });
    return (
      <Animated.View
        style={{
          minHeight: headerHeight,
          paddingTop:
            Platform.OS === "ios" ? (isIphoneX() ? 44 : 20) : androidTopArea,
          alignItems: "center",
          position: "absolute",
          zIndex: 3,
          // backgroundColor: 'red',
          flexDirection: "row",
          opacity: opacity
        }}
      >
        <View
          style={{
            width: 60,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-start",
            paddingLeft: CSS.pixel(30)
          }}
        >
          <SDTouchOpacity
            style={{ flex: 1 }}
            onPress={
              this.props.onPressBack
                ? this.props.onPressBack
                : () => {
                    this.context.navigator &&
                      this.context.navigator.pop &&
                      this.context.navigator.pop();
                  }
            }
          >
            <Image source={require("@img/login/home_ico_back.png")} />
          </SDTouchOpacity>
        </View>
        <View
          style={{
            flex: 1,
            width: Dimensions.get("window").width - 60 * 2,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize:
                Platform.OS == "ios" ? CSS.textSize(36) : CSS.textSize(36)
            }}
            numberOfLines={1}
          >
            {/* {this.props.liveData.name || this.props.liveData.category_name} */}
          </Text>
        </View>
        <SDTouchOpacity
          style={{
            width: 60,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingRight: CSS.pixel(30)
          }}
          onPress={() => {

            navLightBox("LightBoxScreen", {
              passProps: {
                screen: () => (
                  <ShareButton
                    onShareLog={()=>{
                      //console.warn('onShareLog', this.props.actions.logShareLiveAction)
                      this.props.actions.logShareLiveAction({ id: this.state.liveData.id })
                        .then(res => {})
                        .catch(err => {});
                    }}
                    qqSessionOptions={{
                      type: "news",
                      title: this.state.liveData.name,
                      description: this.state.liveData.introduction,
                      imageUrl: this.state.liveData && this.state.liveData.image ? this.state.liveData.image.url : `${HOSTS.SHARE}/images/logo.png`,
                      url: `${HOSTS.MASTER}/?from=singlemessage#/detail?id=${this.state.liveData.id}&fromApp=1&fromShare=1`
                    }}
                    qqTimeLineOptions={{
                      type: "news",
                      title: this.state.liveData.name,
                      description: this.state.liveData.introduction,
                      imageUrl: this.state.liveData && this.state.liveData.image ? this.state.liveData.image.url : `${HOSTS.SHARE}/images/logo.png`,
                      url: `${HOSTS.MASTER}/?from=singlemessage#/detail?id=${this.state.liveData.id}&fromApp=1&fromShare=1`
                    }}
                    timeLineOptions={{
                      type: "news",
                      thumbImage: this.state.liveData && this.state.liveData.image ? this.state.liveData.image.url : `${HOSTS.SHARE}/images/logo.png`,
                      title: this.state.liveData.name,
                      description: this.state.liveData.introduction,
                      webpageUrl: `${HOSTS.MASTER}/#/detail?id=${this.state.liveData.id}&fromApp=1&fromShare=1`
                    }}
                    sessionOptions={{
                      type: "news",
                      thumbImage: this.state.liveData && this.state.liveData.image ? this.state.liveData.image.url : `${HOSTS.SHARE}/images/logo.png`,
                      title: this.state.liveData.name,
                      description: this.state.liveData.introduction,
                      webpageUrl: `${HOSTS.MASTER}/#/detail?id=${this.state.liveData.id}&fromApp=1&fromShare=1`
                    }}
                  />
                )
              }
            });
          }}
        >
          <Image source={require("@img/salary/home_ico_share.png")} />
        </SDTouchOpacity>
      </Animated.View>
    );
  }

  renderHeader() {
    let opacity = this.state.headerOpacity.interpolate({
      inputRange: [0, 255], //输入值
      outputRange: [0, 1] //输出值
    });
    return (
      <Animated.View
        style={{
          minHeight: headerHeight,
          paddingTop:
            Platform.OS === "ios" ? (isIphoneX() ? 44 : 20) : androidTopArea,
          alignItems: "center",
          position: "absolute",
          zIndex: 3,
          flexDirection: "row",
          opacity: opacity,
          backgroundColor: "#fff"
        }}
      >
        <View
          style={{
            width: 60,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-start",
            paddingLeft: CSS.pixel(30)
          }}
        >
          <SDTouchOpacity
            style={{ flex: 1 }}
            onPress={
              this.props.onPressBack
                ? this.props.onPressBack
                : () => {
                    this.context.navigator &&
                      this.context.navigator.pop &&
                      this.context.navigator.pop();
                  }
            }
          >
            <Image source={darkBackIcon} />
          </SDTouchOpacity>
        </View>
        <View
          style={{
            flex: 1,
            width: Dimensions.get("window").width - 60 * 2,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text
            style={{
              fontSize:
                Platform.OS == "ios" ? CSS.textSize(36) : CSS.textSize(36)
            }}
            numberOfLines={1}
          >
            {this.state.liveData.name || this.state.liveData.category_name}
          </Text>
        </View>
        <SDTouchOpacity
          style={{
            width: 60,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingRight: CSS.pixel(30)
          }}
          onPress={() => {
            navLightBox("LightBoxScreen", {
              passProps: {
                screen: () => (
                  <ShareButton
                    onShareLog={()=>{
                      //console.warn('onShareLog', this.props.actions.logShareLiveAction)
                      this.props.actions.logShareLiveAction({ id: this.state.liveData.id })
                        .then(res => {})
                        .catch(err => {});
                    }}
                    qqSessionOptions={{
                      type: "news",
                      title: this.state.liveData.name,
                      description: this.state.liveData.introduction,
                      imageUrl: this.state.liveData && this.state.liveData.image ? this.state.liveData.image.url : `${HOSTS.SHARE}/images/logo.png`,
                      url: `${HOSTS.MASTER}/?from=singlemessage#/detail?id=${this.state.liveData.id}&fromApp=1&fromShare=1`
                    }}
                    qqTimeLineOptions={{
                      type: "news",
                      title: this.state.liveData.name,
                      description: this.state.liveData.introduction,
                      imageUrl: this.state.liveData && this.state.liveData.image ? this.state.liveData.image.url : `${HOSTS.SHARE}/images/logo.png`,
                      url: `${HOSTS.MASTER}/?from=singlemessage#/detail?id=${this.state.liveData.id}&fromApp=1&fromShare=1`
                    }}
                    timeLineOptions={{
                      type: "news",
                      title: this.state.liveData.name,
                      description: this.state.liveData.introduction,
                      thumbImage: this.state.liveData && this.state.liveData.image ? this.state.liveData.image.url : `${HOSTS.SHARE}/images/logo.png`,
                      webpageUrl: `${HOSTS.MASTER}/#/detail?id=${this.state.liveData.id}&fromApp=1&fromShare=1`
                    }}
                    sessionOptions={{
                      type: "news",
                      title: this.state.liveData.name,
                      description: this.state.liveData.introduction,
                      thumbImage: this.state.liveData && this.state.liveData.image ? this.state.liveData.image.url : `${HOSTS.SHARE}/images/logo.png`,
                      webpageUrl: `${HOSTS.MASTER}/#/detail?id=${this.state.liveData.id}&fromApp=1&fromShare=1`
                    }}
                  />
                )
              }
            });
          }}
        >
          <Image source={require("@img/salary/home_ico_share02.png")} />
        </SDTouchOpacity>
      </Animated.View>
    );
  }

  // 人员限制
  renderUserLimitNum() {
    return JSON.stringify(this.state.liveData) === '{}' ? null :(
      <View
        style={{
          flexDirection: "row",
          paddingTop: CSS.pixel(44, true),
          paddingBottom: CSS.pixel(50),
          borderBottomColor: "#eee",
          borderBottomWidth: 1
        }}
      >
        <View style={{ flexDirection: "row", flex: 1 }}>
          {
            (this.state.liveData && this.state.liveData.number_count && this.state.liveData.number_count != "") ?
            <Text style={{ color: "#333", fontSize: CSS.textSize(24) }}>
              {this.state.liveData.number_count.slice(0, this.state.liveData.number_count.indexOf("等") + 1)}
            </Text> : null
          }
          {
            (this.state.liveData && this.state.liveData.number_count && this.state.liveData.number_count != "" )?
          <Text style={{ color: SDMainColor, fontSize: CSS.textSize(24) }}>
            {this.state.liveData.number_count.slice(this.state.liveData.number_count.indexOf("等") + 1)}
          </Text> : null
          }
          {
            (this.state.liveData && this.state.liveData.number_count && this.state.liveData.number_count != "" )?
            <Text style={{ color: '#333', fontSize: CSS.textSize(24)}}>已参与</Text> : null
          }

          {(this.state.liveData && this.state.liveData.number_count && this.state.liveData.number_count != "") ? null : <Text style={{ color: "#333", fontSize: CSS.textSize(24)}}>暂无人员参与</Text>}
        </View>
        {
          JSON.stringify(this.state.liveData) !== "{}" && this.state.liveData.end_time == null ? (

        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: "#333", fontSize: CSS.textSize(24) }}>
            名额限制:{" "}
          </Text>
          <Text style={{ color: SDMainColor, fontSize: CSS.textSize(24) }}>
            {(this.state.liveData && this.state.liveData.limit ) ? this.state.liveData.limit : 0}人
          </Text>
          </View>) : null
        }
      </View>
    );
  }

  // 课程简介
  renderCourseIntroduction() {
    return JSON.stringify(this.state.liveData) !== "{}" ? (
      <View
        style={{
          marginTop: CSS.pixel(34),
          paddingBottom: CSS.pixel(34),
          borderBottomColor: "#eee",
          borderBottomWidth: 1
        }}
      >
        <TitleWrap title="课程简介" nomore={true} />
        <View style={{ marginTop: CSS.pixel(26) }}>
          <Text
            style={{
              color: "#333",
              fontSize: CSS.textSize(24),
              lineHeight: CSS.pixel(34)
            }}
          >
            {this.state.liveData.introduction}
          </Text>
        </View>
      </View>
    ) : null;
  }

  // 内容大纲
  renderCourseOutline() {
    return JSON.stringify(this.state.liveData) !== "{}" ? (
      <View
        style={{
          marginTop: CSS.pixel(34),
          paddingBottom: CSS.pixel(34),
          borderBottomColor: "#eee",
          borderBottomWidth: 1
        }}
      >
        <TitleWrap title="课程大纲" nomore={true} />
        <View style={{ marginTop: CSS.pixel(26) }}>
          <Text
            style={{
              color: "#333",
              fontSize: CSS.textSize(24),
              lineHeight: CSS.pixel(34)
            }}
          >
            {this.state.liveData.outline}
          </Text>
        </View>
      </View>
    ) : null;
  }

  // 导师介绍
  renderMasterProfile() {
    return JSON.stringify(this.state.liveData) !== "{}" ? (
      <View
        style={{
          marginTop: CSS.pixel(34),
          paddingBottom: CSS.pixel(34),
          borderBottomColor: "#eee",
          borderBottomWidth: 1
        }}
      >
        <TitleWrap title="导师介绍" nomore={true} />
        <View style={{ marginTop: CSS.pixel(26), flexDirection: "row" }}>
          <View
            style={{
              width: CSS.pixel(140),
              height: CSS.pixel(140),
              overflow: "hidden",
              borderRadius: 4,
              marginTop: CSS.pixel(4)
            }}
          >
            {(this.state.liveData && this.state.liveData.teacher_avatar) ?
            <Image
              style={{ width: CSS.pixel(140), height: CSS.pixel(140) }}
              source={{
                uri: this.state.liveData.teacher_avatar.url + "?imageView2/2/h/280"
              }}
            /> :
              this.state.liveData.teacher_gender == "female" ? (
                <Image resizeMode="cover" style={{ width: CSS.pixel(140), height: CSS.pixel(140) }} source={require("@img/female_master.png")} />
              ) : (
                <Image resizeMode="cover" style={{ width: CSS.pixel(140), height: CSS.pixel(140) }} source={require("@img/male_master.png")} />
              )
              // <Text>缺失头像</Text>
            }
          </View>

          <View style={{ marginLeft: CSS.pixel(36), flex: 1 }}>
            <Text
              style={{
                color: "#333",
                fontSize: CSS.textSize(28),
                lineHeight: CSS.pixel(40),
                fontWeight: "600"
              }}
            >
              {this.state.liveData.teacher_name}
            </Text>
            <Text
              style={{
                color: "#333",
                fontSize: CSS.textSize(24),
                lineHeight: CSS.pixel(34)
              }}
            >
              {this.state.liveData.teacher_info}
            </Text>
          </View>
        </View>
      </View>
    ) : null;
  }

  getContext() {
    return this.context;
  }

  getDetailThis() {
    return this;
  }

  fetNewData(isEnd) {
    this.props.actions
      .getLiveCourseDetailAction({
        id: this.props.liveData.id
      })
      .then(res => {
        this.setState({
          liveData: res.results
        })
      }).catch(err => {
        this.setState({
          liveData: null,
          hasFetch: true
        })
      });
    // 如果课程已经结束则获取评论
    if(this.state.liveData && (this.state.liveData.end_time != null || isEnd)) {
      this.props.actions.getLiveCourseCommentAction({
        id: this.props.liveData.id,
        size: 2
      }).then(res => {
        this.setState({
          commentCount: res.count,
          commentData: res.results
        })
      }).catch(err => {

      });
    }
  }

  // 底部按钮
  renderFooterChooise() {
    if (this.props.noToolbar) {
      return null;
    }
    return JSON.stringify(this.state.liveData) !== '{}' ? (
      <SDTouchOpacity
        style={{
          height: 50,
          // backgroundColor: this.state.liveData.end_time != null && this.state.liveData.is_income == false ? '#d2d2d2' : SDMainColor,
          backgroundColor: SDMainColor,
          justifyContent: "center",
          alignItems: "center"
        }}
        // disabled={this.state.liveData.end_time != null && this.state.liveData.is_income == false ? true : false}
        onPress={() => {
          // 判断此用户有没有绑定手机号
          if (!this.props.user.phone || this.props.user.phone == "") {
            // 弹出绑定手机lightbox
            navLightBox("LightBoxScreen", {
              passProps: {
                screen: () => <BindPhoneLightBox />,
                tapBackgroundToDismiss: false
              }
            });
            return;
          }

          // 如果是老师自己的课程

          if(this.props.user.id == this.state.liveData.teacher) {
            // 直接进入课程
            // 刷新课程详情数据
            // 判断此课程是否已经结束了
            if(this.state.liveData.end_time) {
              this.props.actions.getLiveCourseDetailAction({id: this.props.liveData.id}).then(res => {
                Toast.hide();
                if(res.status == 'ok') {
                  this.setState({
                    liveData: res.results
                  });
                  this.context.navigator.push(
                    navScreen("ChatScreen", "聊天室", {
                      passProps: {
                        screen: () => <IMChatctcScreen getDetailThis={this.getDetailThis.bind(this)} group={res.results} />,
                        fullScreen: true,
                        noScrollView: true,
                        header: {
                          title: this.props.liveData.name
                        },
                        saveBg: '#f3f3f3',
                        navigatorButtons: {
                          rightButtons: [
                            {
                              icon: () => (
                                <Image
                                  source={require("@img/imchat/growing_ico_more.png")}
                                />
                              ),
                              id: "group_chat_menu_btn"
                            }
                          ]
                        }
                      }
                    })
                  );
                } else {
                  Toast.fail("进入Live失败");
                }
              }).catch(err => {
                Toast.hide();
              });
            } else {
              Toast.loading("等待中", 3);
              IMChat.isLogin().then(res => {
                if(res) {
                  this.props.actions.getLiveCourseDetailAction({id: this.props.liveData.id}).then(res => {
                    Toast.hide();
                    if(res.status == 'ok') {
                      this.setState({
                        liveData: res.results
                      });
                      this.context.navigator.push(
                        navScreen("ChatScreen", "聊天室", {
                          passProps: {
                            screen: () => <IMChatctcScreen getDetailThis={this.getDetailThis.bind(this)} group={res.results} />,
                            fullScreen: true,
                            noScrollView: true,
                            header: {
                              title: this.props.liveData.name
                            },
                            saveBg: '#f3f3f3',
                            navigatorButtons: {
                              rightButtons: [
                                {
                                  icon: () => (
                                    <Image
                                      source={require("@img/imchat/growing_ico_more.png")}
                                    />
                                  ),
                                  id: "group_chat_menu_btn"
                                }
                              ]
                            }
                          }
                        })
                      );
                    } else {
                      Toast.fail("进入Live失败");
                    }
                  }).catch(err => {
                    Toast.hide();
                  });
                } else {
                  Toast.loading("检测到失去云通信连接, 正在重连...");
                  if(this.context.refs && this.context.refs["personScreen"] && this.context.refs["personScreen"].loginIm) {
                    this.context.refs["personScreen"].loginIm((loginRes) => {
                      if(loginRes) {
                        Toast.info("已连接云通信，请重新进入", 2);
                      } else {
                        Toast.info("连接失败，请重试", 2);
                      }
                    });
                  } else {
                    Toast.info("你已被强制下线，请重新登录", 2);
                    setTimeout(() => {
                      this.props.actions.logoutAction({});
                    }, 2000);
                  }
                }
              });
            }
            return;
          }

          // 区分
          // 免费参与
          // 立即购买
          // 立即进入
          if (this.state.liveData.is_income == true) {
            // 刷新课程详情数据
            // 判断IM是否已经登录
            // 判断此课程是否已经结束了
            if(this.state.liveData.end_time) {
              Toast.loading("等待中", 3);
              this.props.actions.getLiveCourseDetailAction({id: this.props.liveData.id}).then(res => {
                Toast.hide();
                if(res.status == 'ok') {
                  this.setState({
                    liveData: res.results
                  });
                  this.context.navigator.push(
                    navScreen("ChatScreen", "聊天室", {
                      passProps: {
                        screen: () => <IMChatctcScreen getDetailThis={this.getDetailThis.bind(this)} group={res.results} />,
                        fullScreen: true,
                        noScrollView: true,
                        header: {
                          title: this.props.liveData.name
                        },
                        saveBg: '#f3f3f3',
                        navigatorButtons: {
                          rightButtons: [
                            {
                              icon: () => (
                                <Image
                                  source={require("@img/imchat/growing_ico_more.png")}
                                />
                              ),
                              id: "group_chat_menu_btn"
                            }
                          ]
                        }
                      }
                    })
                  );
                } else {
                  Toast.fail("进入Live失败");
                }
              }).catch(err => {
                Toast.hide();
              });
            } else {
              // 进行云通讯连接
              Toast.loading("等待中", 3);
              IMChat.isLogin().then(res => {
                // console.warn(res);
                if(res && res != "") {
                  // 获取后台时间
                  if(SERVER_TIME_CONFIG.timer) {
                    clearInterval(SERVER_TIME_CONFIG.timer);
                  }
                  getServerTime().then(res => {
                    if(res.status == 'ok') {
                      SERVER_TIME_CONFIG.time = new Date(parseInt(res.results.timestamp + "" + "000"));
                      SERVER_TIME_CONFIG.timer = setInterval(() => {
                        // 加一秒
                        SERVER_TIME_CONFIG.time = new Date(SERVER_TIME_CONFIG.time.getTime() + 1000);
                      }, 1000);
                    }
                  }).catch(err => {

                  })
                  this.props.actions.getLiveCourseDetailAction({id: this.props.liveData.id}).then(res => {
                    Toast.hide();
                    if(res.status == 'ok') {
                      this.setState({
                        liveData: res.results
                      });
                      this.context.navigator.push(
                        navScreen("ChatScreen", "聊天室", {
                          passProps: {
                            screen: () => <IMChatctcScreen getDetailThis={this.getDetailThis.bind(this)} group={res.results} />,
                            fullScreen: true,
                            noScrollView: true,
                            header: {
                              title: this.props.liveData.name
                            },
                            saveBg: '#f3f3f3',
                            navigatorButtons: {
                              rightButtons: [
                                {
                                  icon: () => (
                                    <Image
                                      source={require("@img/imchat/growing_ico_more.png")}
                                    />
                                  ),
                                  id: "group_chat_menu_btn"
                                }
                              ]
                            }
                          }
                        })
                      );
                    } else {
                      Toast.fail("进入Live失败");
                    }
                  }).catch(err => {
                    Toast.hide();
                  });
                } else {
                  Toast.loading("检测到失去云通信连接, 正在重连...");
                  if(this.context.refs && this.context.refs["personScreen"] && this.context.refs["personScreen"].loginIm) {
                    this.context.refs["personScreen"].loginIm((loginRes) => {
                      if(loginRes) {
                        Toast.info("已连接云通信，请重新进入", 2);
                      } else {
                        Toast.info("连接失败，请重试", 2);
                      }
                    });
                  } else {
                    Toast.info("你已被强制下线，请重新登录", 2);
                    setTimeout(() => {
                      this.props.actions.logoutAction({});
                    }, 2000);
                  }
                }
              });
            }
          } else {
            if (this.state.liveData.price > 0) {
              // 如果是收费的
              // 则判断是否已购买
              if(this.state.liveData.is_pay) {
                // 加入课程
                Toast.loading("报名中");
                this.props.actions.addLiveCourseStudentAction({
                  id: this.state.liveData.id
                }).then(res => {
                  Toast.hide();
                  if (res.status == 'ok') {
                    if(this.state.liveData.status == '未开始') {
                      Toast.success("参与成功，请注意开课时间，以免错过哦～", 1.5);
                    } else if(this.state.liveData.status == '进行中'){
                      Toast.success("参与成功，课程正在进行，快快加入吧", 1.5);
                    } else if(this.state.liveData.status == '已结束') {
                      Toast.success("参与成功，此课程已结束，可以进入Live查看回放哦～", 1.5);
                    } else {
                      Toast.success("参与成功", 1);
                    }
                    this.setState({
                      liveData: Object.assign({}, this.state.liveData, {
                        is_income: true
                      })
                    });
                    this.fetNewData();
                  } else {
                    Toast.fail(res.msg || "参与失败");
                  }
                }).catch(err => {
                  if(err && err.status_code == '400') {
                    Toast.fail(err.msg || "参与失败")
                  }
                });
              } else {
                // 立即购买
                // 弹出购买窗口
                navLightBox("LightBoxScreen", {
                  passProps: {
                    screen: () => <CourseBuyLightBox getContext={this.getContext.bind(this)} getDetailThis={this.getDetailThis.bind(this)} liveData={this.state.liveData}/>
                  }
                }, {
                  backgroundColor: 'transparent'
                });
              }
            } else {
              // 免费参与
              // 加入此课程
              Toast.loading("报名中");
              this.props.actions.addLiveCourseStudentAction({
                id: this.state.liveData.id
              }).then(res => {
                Toast.hide();
                if (res.status == 'ok') {
                  if(this.state.liveData.status == '未开始') {
                    Toast.success("参与成功，请注意开课时间，以免错过哦～", 1.5);
                  } else if(this.state.liveData.status == '进行中'){
                    Toast.success("参与成功，课程正在进行，快快加入吧", 1.5);
                  } else if(this.state.liveData.status == '已结束') {
                    Toast.success("参与成功，此课程已结束，可以进入Live查看回放哦～", 1.5);
                  } else {
                    Toast.success("参与成功", 1);
                  }
                  this.setState({
                    liveData: Object.assign({}, this.state.liveData, {
                      is_income: true
                    })
                  });
                  this.fetNewData();
                } else {
                  Toast.fail(res.msg || "参与失败");
                }
              }).catch(err => {
                if(err && err.status_code == '400') {
                  Toast.fail(err.msg || "参与失败")
                }
                // Toast.hide();
              });
            }
          }
        }}
      >
        {
          // // 如果不是自己老师的课程
          // this.props.user.id != this.state.liveData.teacher &&
          // this.state.liveData.end_time != null && this.state.liveData.is_income == false ?
          // <Text style={{
          //   color: "#666",
          //   fontSize: CSS.textSize(32),
          //   lineHeight: CSS.pixel(44)
          // }}>课程已结束，无法参与</Text> :
          <Text
            style={{
              color: "#333",
              fontSize: CSS.textSize(32),
              lineHeight: CSS.pixel(44)
            }}
          >
            {/* 如果不是自己老师的课程 */}
            {
              this.props.user.id == this.state.liveData.teacher ? '立即进入' :
              this.state.liveData.is_income == true ? "立即进入" :
              this.state.liveData.price > 0 ?
              this.state.liveData.is_pay ?
              '立即参与' :
              "立即购买" :
              "免费参与"
            }
          </Text>
        }
      </SDTouchOpacity>
    ) : null;
  }

  // 课程评论
  renderCourseComment() {
    return JSON.stringify(this.state.liveData) !== '{}' && this.state.liveData.end_time != null ? (
      <View
        style={{
          marginTop: CSS.pixel(34),
          paddingBottom: CSS.pixel(34),
          borderBottomColor: "#eee",
          borderBottomWidth: 1
        }}
      >
        <TitleWrap title="课程评价" nomore={true} />
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <View style={{ marginTop: CSS.pixel(16), flexDirection: "row", alignItems: 'center', flex: 1}}>
              {[1, 2, 3, 4, 5].map((c, index) => {
                // let score = this.state.liveData && this.state.liveData.score ? (this.state.liveData.score * 10 % 10) < 5 ? Math.floor(this.state.liveData.score) : Math.ceil(this.state.liveData.score) : 0;
                // let leftMin = this.state.liveData.score * 10 % 10;
                let score = this.state.liveData && this.state.liveData.score ? this.state.liveData.score : 0;
                let intScore = Math.floor(score);
                let dotScore = score * 10 % 10;
                if(intScore >= c) {
                  return (
                    <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                      <Image
                        source={require("@img/imchat/evaluate_ico_yellow.png")}
                      />
                    </View>
                  )
                } else {
                  if (c - intScore >= 2) {
                    return (
                      <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                        <Image
                          source={require("@img/imchat/evaluate_ico_gray.png")}
                        />
                      </View>
                      )
                  } else {
                    if(dotScore > 6) {
                      return (
                        <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                          <Image
                            source={require("@img/imchat/course/evaluate_ico_3_2.png")}
                          />
                        </View>
                      )
                    } else if(dotScore > 3){
                      return (
                        <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                          <Image
                            source={require("@img/imchat/course/evaluate_ico_3_21.png")}
                          />
                        </View>
                      )
                    } else if(dotScore > 0){
                      return (
                        <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                          <Image
                            source={require("@img/imchat/course/evaluate_ico_3_1.png")}
                          />
                        </View>
                      )
                    } else {
                      return (
                        <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                          <Image
                            source={require("@img/imchat/evaluate_ico_gray.png")}
                          />
                        </View>
                      )
                    }
                  }
                }
              })}

              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: CSS.textSize(24),
                    color: SDMainColor,
                    lineHeight: CSS.pixel(34),
                    fontWeight: '600'
                  }}
                >
                  {this.state.liveData && this.state.liveData.score ? parseFloat(this.state.liveData.score).toFixed(1) + '分' : ''}
                </Text>
              </View>
            </View>

            <View style={{marginTop: CSS.pixel(8), marginBottom: CSS.pixel(28)}}>
                <Text style={{color: '#999', fontSize: CSS.textSize(20), lineHeight: CSS.pixel(28)}}>{this.state.commentCount ? this.state.commentCount + "条评论" : '暂无评论'}</Text>
            </View>
          </View>

          {/* 立即评价按钮 */}
          {/* 判断是否需要评论 */}
          {
            (!this.state.liveData.is_comment && this.state.liveData.is_income) ?
            <View style={{alignItems: 'flex-end', justifyContent: 'flex-start', marginTop: CSS.pixel(16)}}>
              <SDTouchOpacity onPress={() => {
                this.context.navigator.push(navScreen("PushScreen", "课程评价", {
                  passProps: {
                    screen: () => <MoreCommentScreen getDetailThis={this.getDetailThis.bind(this)} isNeedComment={true} commentCount={this.state.commentCount} liveData={this.state.liveData}/>,
                      noScrollView: true,
                      fullScreen: true,
                      header: {
                        title: "课程评价"
                      }
                    }
                }))
              }} style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderRadius: CSS.pixel(22), borderWidth: 1, borderColor: SDMainColor, paddingHorizontal: CSS.pixel(15), paddingVertical: CSS.pixel(4)}}>
                <Image source={require("@img/my/TrackRecord/mine_Resume_ico_edit.png")}/>
                <Text style={{color: SDMainColor, fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34), marginLeft: CSS.pixel(8)}}>评价</Text>
              </SDTouchOpacity>
            </View> : null
          }

        </View>

        {/* 加载评论 */}
        <View>
          {this.state.commentData.map((c, index) => {
            return (
              <View key={index + ""} style={{flexDirection: 'row', marginBottom: CSS.pixel(50, true)}}>
                <SDTouchOpacity onPress={() => {
                  // 跳转到个人主页
                  // 判断是否是自己的头像
                  if (this.props.user.id == c.user_info.id) {
                    this.context.navigator.push(
                      navScreen("PushScreen", "我的主页", {
                        navigatorButtons: {
                          rightButtons: [
                            {
                              // title: "动态",
                              icon: () => (
                                <Image source={require("@img/my/mine_btn_Release.png")} />
                              ), // for icon button, provide the local image asset name
                              id: "post_trends"
                            }
                          ]
                        },
                        passProps: {
                          fullScreen: true,
                          noScrollView: true,
                          screen: () => <MyHomeScreen showTabBar={false} />,
                          header: {
                            title: "我的主页"
                          }
                        }
                      })
                    );
                  } else {
                    this.context.navigator.push(navScreen("PushScreen", "我的主页", {
                      passProps: {
                        fullScreen: true,
                        noScrollView: true,
                        screen: () => <MyHomeScreen userId={c.user_info.id} />,
                        header: {
                          title: '个人主页'
                        }
                      }
                    }));
                  }
                }} style={{width: CSS.pixel(60), height: CSS.pixel(60), borderRadius: CSS.pixel(30), overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
                  {/* <Text>缺失头像</Text> */}
                  {c.user_info && c.user_info.avatar ? <Image style={{width: CSS.pixel(60), height: CSS.pixel(60)}} source={{uri: c.user_info.avatar + "?imageView2/2/h/120"}}/>
                  :
                    c.user_info.gender == "female" ? (
                      <Image style={{width: CSS.pixel(60), height: CSS.pixel(60)}} resizeMode="cover" source={require("@img/avator/female.png")} />
                    ) : (
                      <Image style={{width: CSS.pixel(60), height: CSS.pixel(60)}} resizeMode="cover" source={require("@img/avator/male.png")} />
                    )
                  }
                </SDTouchOpacity>
                <View style={{marginLeft: CSS.pixel(14), flex: 1}}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={{flex: 1}}>
                      <Text style={{color: '#333', fontSize: CSS.textSize(28), lineHeight: CSS.pixel(40)}}>{c.user_info && c.user_info.nickname}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                      {[1,2,3,4,5].map((d, index) => {
                        let score = c && c.score ? Math.floor(c.score) : 0;
                        return (
                          <View key={index + ""} style={{marginLeft: CSS.pixel(6), padding: 0, justifyContent: 'center'}}>
                            <Image
                              source={
                                d <= score
                                  ? require("@img/imchat/evaluate_ico_yellow2.png")
                                  : require("@img/imchat/evaluate_ico_gray2.png")
                              }
                            />
                          </View>
                        );
                      })}
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: CSS.pixel(2)}}>
                      <View style={{flex: 1}}>
                        <Text style={{color: '#999', fontSize: CSS.textSize(20), lineHeight: CSS.pixel(28)}}>{c.edu_info.school_name} {c.edu_info.degree_name} · {c.edu_info.major_name}</Text>
                      </View>
                      <View>
                        <Text style={{color: '#999', fontSize: CSS.textSize(20), lineHeight: CSS.pixel(28)}}>
                          {c.created_time.replace("-", "年").replace("-", "月").replace("T", "日 ").slice(0, 17)}
                        </Text>
                      </View>
                  </View>
                  {/* 学生评论 */}
                  <View style={{marginTop: CSS.pixel(28)}}>
                    <CommentMsgItem msg={c.content}/>
                  </View>
                  {/* 老师回复的评论 */}
                  {
                    c.reply_content && c.reply_content != "" ?
                    <View>
                        <View style={{position: 'absolute', borderWidth: CSS.pixel(24), borderColor: 'transparent', borderBottomColor: '#eee', left: 10, top: 2}}></View>
                        <View style={{backgroundColor: '#eee', marginTop: CSS.pixel(48), borderRadius: CSS.pixel(8), paddingHorizontal: CSS.pixel(24), paddingVertical: CSS.pixel(32)}}>
                          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <View style={{width: CSS.pixel(60), height: CSS.pixel(60), borderRadius: CSS.pixel(30), overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
                              {(this.state.liveData && this.state.liveData.teacher_avatar) ?
                              <Image style={{width: CSS.pixel(60), height: CSS.pixel(60)}} source={{uri: this.state.liveData.teacher_avatar.url + "?imageView2/2/h/120"}}/> :
                              // 引用默认头像
                                this.state.liveData.teacher_gender == "female" ? (
                                  <Image resizeMode="stretch" source={require("@img/female_master.png")} />
                                ) : (
                                  <Image resizeMode="stretch" source={require("@img/male_master.png")} />
                                )
                              }
                            </View>
                            <View style={{marginLeft: CSS.pixel(14), flex: 1}}>
                              <Text style={{fontSize: CSS.textSize(28), color: '#333', lineHeight: CSS.pixel(40)}}>{this.state.liveData.teacher_name}</Text>
                            </View>
                            <View>
                              <Text style={{color: '#999', fontSize: CSS.textSize(20), lineHeight: CSS.pixel(28)}}>{c.reply_time && c.reply_time.replace("-", "年").replace("-", "月").replace("T", "日 ").slice(0, 17)}</Text>
                            </View>
                          </View>
                          <View style={{marginTop: CSS.pixel(20), flexWrap: 'wrap'}}>
                            <Text style={{color: '#666', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>{c.reply_content}afasdfa</Text>
                          </View>
                        </View>
                    </View> : null
                  }
                </View>
              </View>
            )
          })}
          {
            this.state.commentData.length <= 0 ?
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {
                this.state.liveData.is_income ?
                <SDTouchOpacity onPress={() => {
                  this.context.navigator.push(navScreen("PushScreen", "课程评价", {
                    passProps: {
                      screen: () => <MoreCommentScreen isNeedComment={true} commentCount={this.state.commentCount} liveData={this.state.liveData}/>,
                        noScrollView: true,
                        fullScreen: true,
                        header: {
                          title: "课程评价"
                        }
                      }
                  }))
                }}>
                  <Text style={{color: '#999', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>撰写评论 >></Text>
                </SDTouchOpacity> :
                <View>
                  <Text style={{color: '#999', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>暂无评论</Text>
                </View>
               }
            </View> :
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <SDTouchOpacity onPress={() => {
                this.context.navigator.push(navScreen("PushScreen", "课程评价", {
                  passProps: {
                    screen: () => <MoreCommentScreen commentCount={this.state.commentCount} liveData={this.state.liveData}/>,
                    noScrollView: true,
                    fullScreen: true,
                    header: {
                      title: "课程评价"
                    }
                  }
                }))
              }}>
                <Text style={{color: SDMainColor, fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>查看更多评价 >></Text>
              </SDTouchOpacity>
            </View>
          }
        </View>

      </View>
    ) : null;
  }

  // 底部职么课程介绍
  renderBottomAbout() {
    return (
      <View
        style={{
          backgroundColor: "#eee",
          paddingHorizontal: CSS.pixel(28),
          paddingVertical: CSS.pixel(20),
          marginTop: CSS.pixel(34),
          marginBottom: CSS.pixel(30)
        }}
      >
        <View>
          <Text
            style={{
              color: "#333",
              fontSize: CSS.textSize(28),
              lineHeight: CSS.pixel(40),
              fontWeight: "600"
            }}
          >
            什么是职么课堂？
          </Text>
        </View>
        <View style={{ marginTop: CSS.pixel(4) }}>
          <Text
            style={{
              color: "#666",
              fontSize: CSS.textSize(24),
              lineHeight: CSS.pixel(42)
            }}
          >
            职么课堂是职么开门全新推出的实时语音问答产品，主要定位于大学生的职业规划，导师针对面试咨询、简历精修等职场经验进行知识分享、授课讲解，学生可以实时提问并得到导师的答疑解惑。
          </Text>
        </View>
      </View>
    )
  }

  // 结束后的课程统计
  renderCourseCount() {
    return JSON.stringify(this.state.liveData) !== '{}' && this.state.liveData.end_time != null ? (
      <View
        style={{
          marginTop: CSS.pixel(34),
          borderBottomColor: "#eee",
          borderBottomWidth: 1
        }}
      >
        <View style={{flex: 1, flexDirection: 'row'}}>

          {/* 评价 */}
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', flex: 1}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {[1, 2, 3, 4, 5].map((c, index) => {
                  let score = this.state.liveData && this.state.liveData.score ? this.state.liveData.score : 0;
                  let intScore = Math.floor(score);
                  let dotScore = score * 10 % 10;
                  if(intScore >= c) {
                    return (
                      <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                        <Image
                          source={require("@img/imchat/evaluate_ico_yellow.png")}
                        />
                      </View>
                    )
                  } else {
                    if (c - intScore >= 2) {
                      return (
                        <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                          <Image
                            source={require("@img/imchat/evaluate_ico_gray.png")}
                          />
                        </View>
                        )
                    } else {
                      if(dotScore > 6) {
                        return (
                          <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                            <Image
                              source={require("@img/imchat/course/evaluate_ico_3_2.png")}
                            />
                          </View>
                        )
                      } else if(dotScore > 3){
                        return (
                          <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                            <Image
                              source={require("@img/imchat/course/evaluate_ico_3_21.png")}
                            />
                          </View>
                        )
                      } else if(dotScore > 0){
                        return (
                          <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                            <Image
                              source={require("@img/imchat/course/evaluate_ico_3_1.png")}
                            />
                          </View>
                        )
                      } else {
                        return (
                          <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                            <Image
                              source={require("@img/imchat/evaluate_ico_gray.png")}
                            />
                          </View>
                        )
                      }
                    }
                  }
                })}
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: CSS.pixel(4)}}>
                <Text
                  style={{
                    fontSize: CSS.textSize(24),
                    color: SDMainColor,
                    lineHeight: CSS.pixel(34),
                    fontWeight: '600'
                  }}
                >
                  {this.state.liveData && this.state.liveData.score ? parseFloat(this.state.liveData.score).toFixed(1) + '分' : ''}
                </Text>
              </View>
            </View>
            <View style={{marginTop: CSS.pixel(8), marginBottom: CSS.pixel(28)}}>
              <Text style={{color: '#999', fontSize: CSS.textSize(20), lineHeight: CSS.pixel(28)}}>{this.state.commentCount ? this.state.commentCount + "条评论" : '暂无评论'}</Text>
            </View>
          </View>

          {/* 时间 文件数 */}
          <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text style={{color: '#333', fontSize: CSS.textSize(50), lineHeight: CSS.pixel(60), fontWeight: '600', fontFamily: 'DINCondensedC'}}>{parseInt(this.state.liveData.duration)}</Text>
              <Text style={{color: '#999', fontSize: CSS.textSize(20), lineHeight: CSS.pixel(28), top: -4}}>分钟</Text>
            </View>

            <View style={{marginLeft: CSS.pixel(30), flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text style={{color: '#333', fontSize: CSS.textSize(50), lineHeight: CSS.pixel(60), fontWeight: '600', fontFamily: 'DINCondensedC'}}>{this.state.liveData.file_num}</Text>
              <Text style={{color: '#999', fontSize: CSS.textSize(20), lineHeight: CSS.pixel(28), top: -4}}>文件</Text>
            </View>
          </View>
        </View>
      </View>
    ) : null
  }

  render() {
    if(!this.state.liveData && this.state.hasFetch == true) {
      // 可能原因是网络不好
      // 找不到此课程
      // 
      return (
        <View style={{flex: 1, backgroundColor: '#f3f3f3'}}>
          <Animated.View
              style={{
                minHeight: headerHeight,
                paddingTop:
                  Platform.OS === "ios" ? (isIphoneX() ? 44 : 20) : androidTopArea,
                alignItems: "center",
                position: "absolute",
                zIndex: 3,
                flexDirection: "row",
                opacity: 1,
                backgroundColor: "#fff"
              }}
            >
              <View
                style={{
                  width: 60,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  paddingLeft: CSS.pixel(30)
                }}
              >
                <SDTouchOpacity
                  style={{ flex: 1 }}
                  onPress={
                    this.props.onPressBack
                      ? this.props.onPressBack
                      : () => {
                          this.context.navigator &&
                            this.context.navigator.pop &&
                            this.context.navigator.pop();
                        }
                  }
                >
                  <Image source={darkBackIcon} />
                </SDTouchOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  width: Dimensions.get("window").width - 60 * 2,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text
                  style={{
                    fontSize:
                      Platform.OS == "ios" ? CSS.textSize(36) : CSS.textSize(36)
                  }}
                  numberOfLines={1}
                >
                  {this.props.liveData.name || this.props.liveData.category_name}
                </Text>
              </View>
              <SDTouchOpacity
                style={{
                  width: 60,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingRight: CSS.pixel(30),
                }}
                onPress={() => {
                }}
              >
              </SDTouchOpacity>
            </Animated.View>
          <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <View>
              <Image source={require("@img/imchat/course/mine_pic_Invalid.png")}/>
            </View>
            <View style={{marginTop: CSS.pixel(20), justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#999', fontSize: CSS.textSize(28)}}>{"可能因为网络原因，找不到该课程或课程已下架"}</Text>
            </View>
            <SDTouchOpacity onPress={() => {
              this.fetNewData(true);
            }} style={{borderWidth: 1, borderColor: SDMainColor, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5, backgroundColor: SDMainColor, marginTop: CSS.pixel(20), justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#fff', fontSize: CSS.textSize(28)}}>{"请重试"}</Text>
            </SDTouchOpacity>
          </View>
        </View>
      )
    }
    return (!this.state.liveData.is_valid && this.state.hasFetch == true?
        <View style={{flex: 1, backgroundColor: '#f3f3f3'}}>
          <Animated.View
              style={{
                minHeight: headerHeight,
                paddingTop:
                  Platform.OS === "ios" ? (isIphoneX() ? 44 : 20) : androidTopArea,
                alignItems: "center",
                position: "absolute",
                zIndex: 3,
                flexDirection: "row",
                opacity: 1,
                backgroundColor: "#fff"
              }}
            >
              <View
                style={{
                  width: 60,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  paddingLeft: CSS.pixel(30)
                }}
              >
                <SDTouchOpacity
                  style={{ flex: 1 }}
                  onPress={
                    this.props.onPressBack
                      ? this.props.onPressBack
                      : () => {
                          this.context.navigator &&
                            this.context.navigator.pop &&
                            this.context.navigator.pop();
                        }
                  }
                >
                  <Image source={darkBackIcon} />
                </SDTouchOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  width: Dimensions.get("window").width - 60 * 2,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text
                  style={{
                    fontSize:
                      Platform.OS == "ios" ? CSS.textSize(36) : CSS.textSize(36)
                  }}
                  numberOfLines={1}
                >
                  {this.state.liveData.name || this.state.liveData.category_name}
                </Text>
              </View>
              <SDTouchOpacity
                style={{
                  width: 60,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingRight: CSS.pixel(30)
                }}
                onPress={() => {
                }}
              >
              </SDTouchOpacity>
            </Animated.View>
          <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <View>
              <Image source={require("@img/imchat/course/mine_pic_Invalid.png")}/>
            </View>
            <View style={{marginTop: CSS.pixel(20), justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#999', fontSize: CSS.textSize(28)}}>{this.state.liveData.invalid_reason || "课程已失效"}</Text>
            </View>
          </View>
      </View> : this.state.liveData && JSON.stringify(this.state.liveData) !== "{}" ?
      (<View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              zIndex: 2,
              flex: 1,
            }}
            scrollEventThrottle={0.5}
            alwaysBounceVertical={true}
            onScroll={this._onScrollView.bind(this)}
          >
            {isIphoneX() ? <View style={{height: headerPadding, backgroundColor: 'rgba(0,0,0,0.4)'}}></View> : null}
            {this.renderCourseBaseInfoHeight()}

            {this.renderCourseLiveCoverInfo()}

            <View style={{
              paddingHorizontal: CSS.pixel(24),
              borderRadius: CSS.pixel(20),
              backgroundColor: '#fff',
              top: -10,
              overflow: 'hidden',
            }}>
              {this.renderCourseBaseInfo()}

              {this.renderCourseCount()}

              {this.renderUserLimitNum()}

              {this.renderCourseIntroduction()}

              {this.renderCourseOutline()}

              {this.renderMasterProfile()}

              {this.renderCourseComment()}

              {this.renderBottomAbout()}
            </View>
          </ScrollView>
        {this.renderFooterChooise()}

        {this.renderWhiteHeader()}

        {this.renderHeader()}
      </View>) : null
    );
  }
}

export default connectWithActions((state, props) => ({
  user: state.user
}))(
  LiveCourseDetailScreen
);
