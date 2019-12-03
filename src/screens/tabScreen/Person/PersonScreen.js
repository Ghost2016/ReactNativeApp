import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
  RefreshControl,
  StatusBar
} from "react-native";
import { DatePicker } from "antd-mobile";
import PropTypes from "prop-types";
import { Toast } from "antd-mobile";
import ConnectWithActions from "@src/connectWithActions";
import { getUserAllInfo } from "@src/users/usersSelector";
import PersonMainTop from "../../../sd_personMainTop/PersonMainTop";
import MainPageButton from "../../../sd_personMainTop/mainPageButton/MainPageButton";
import SDList from "../../../common/SDList";
import { navScreen } from "@styles";
import { CSS } from "@common/SDCSS";
import PageHeader from "./PageHeader";
import PhonePoint from "./PhonePoint";
import ShareButton from "../../../sd_shareButton/ShareButton";
import PowerNSalary from "@sd_components/PowerNSalary";
import { Navigation } from "react-native-navigation";
import { isIphoneX } from "../../../utils/iphonex";
import FeedBackScreen from "../../pushScreen/feedback/FeedBackScreen";
import HelpScreen from "../../pushScreen/help/HelpScreen";
import { navLightBox } from "../../../styles";
import SDHeader, { androidTopArea } from "../../../common/SDHeader";
import ExpDetailScreen from "../../pushScreen/expDetail/ExpDetailScreen";
import SDTabBar from "../../../common/SDTabBar";
import { getSchoolName, getMajor, getSchoolLevel } from "../../../directSelectors";
import MobStat from "../../../boot/MobStat";
import config from "../../../config";
import IMChat from "../../../boot/IMChat";
import MyChatGroupScreen from "../../pushScreen/imchat/MyChatGroupScreen";
import TrackRecordScreen from "../../pushScreen/trackRecord/TrackRecordScreen";
import MyCollectionScreen from "../../pushScreen/myCollection/MyCollectionScreen";
import MyLiveCourseScreen from "../../pushScreen/liveCourse/MyLiveCourseScreen";
import { cv2UnixTime } from "../../../utils/funcs";
import * as HOSTS from "@src/host";
import QQShare from "../../../boot/QQShare";

const styles = StyleSheet.create({});
const iconRightArrowDark = require("@img/my/PersonMainTop/mine_btn_list_black.png");

// 我的页面
class PersonScreen extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      // offBottom: Platform.OS == "ios" ? (isIphoneX() ? 84 : 50) : 55,
      loading: true,
      isNotSelected: true,
      isRefreshing: false,
      isShowBindPhone: true,

      noCommentCount: 0,
      days: 0
    };
  }

  // onNavigatorEvent(event) {
  //   if (event.id === "bottomTabSelected") {
  //     if (this.state.isNotSelected != false) {
  //       this.setState({
  //         isNotSelected: false
  //       });
  //     }
  //   } else if (event.id === "bottomTabReselected") {
  //     console.warn("Tab reselected!");
  //   }
  // }

  componentWillUnmount() {
    MobStat.onPageEnd("我的");
  }

  componentDidMount() {
    // 获取当前用户在系统使用了多少天
    try {
      this.state.days = parseInt((Date.now() - new Date(this.props.user.created_time.replace(/-/g, "\/").slice(0, 10)).getTime()) / 1000 / 60 / 60 / 24);
      this.state.days = this.state.days + 1;
      // console.warn(this.state.days)
    } catch (error) {

    }

    MobStat.onPageStart("我的");
    this.context.refs["personScreen"] = this;

    // 获取未评论课程数
    this.props.actions.getNoCommentNumAction().then(res => {
      if(res && res.status == 'ok') {
        this.setState({
          noCommentCount: res.results.count
        })
      }
    }).catch(err => {

    });

    // let userId = Platform.OS == 'ios' ? "1006224221" : "1006224221";

    this.loginIm();
  }

  refreshNoCommentCount() {
    this.props.actions.getNoCommentNumAction().then(res => {
      if(res && res.status == 'ok') {
        this.setState({
          noCommentCount: res.results.count
        })
      }
    }).catch(err => {

    });
  }

  onUserStatus(callback) {
    callback && callback(true);
    IMChat.on("userStatus", (res) => {
      if((res && res.type == 'forceOffline') || (res && res.type == 'sigExpired')) {
        Toast.info("用户身份过期或你被强制下线了");
        setTimeout(() => {
          this.props.actions.logoutAction({});
        }, 3000);
        return;
      }
    })
  }

  loginIm(callback) {
    // // 初始化用户IM和数据
    IMChat.init(config.imAppId, config.imAccountType);
    // 判断是否有sig
    if (this.props.user.sig !== "") {
      IMChat.login(`loo00${this.props.user.id}`, this.props.user.sig).then(res => {
        console.warn("login success");
        this.onUserStatus(callback);
      }).catch(err => {
        // 可能sig已经过期
          console.warn(err);
        this.props.actions.getV1ImSigAction().then(res => {
          IMChat.login(`loo00${this.props.user.id}`, res.results).then(res => {
            console.warn("login success");
            this.onUserStatus(callback);
          }).catch(err => {
            IMChat.login(`loo00${this.props.user.id}`, this.props.user.sig).then(res => {
              console.warn("login success");
              this.onUserStatus(callback);
            }).catch(err => {
              callback && callback(false);
            });
          });
        }).catch(err => {
          callback && callback(false);
        })
      })
    } else {
      this.props.actions.getV1ImSigAction().then(res => {
        // IMChat.login(`_sig_${this.props.user.id}`, res.results).then(res => {
        // IMChat.login(`loo001`, "eJw9zl1PgzAYBeC-svR2RvoBmyzxQmEL84OFOBx6Qyp0Wx1SbAsDjP99goHb8*Q97-kB26eXa5okosx1rJuCgcUEQHA16YGnLNd8z5ns4kwICNFgtCh4GlMdE5l2OuQqPcW9dSEy-y5MRPB8YFYXXLKY7vV-KbZsDOH4sWJScZH3AtENtNFImn-165BFZraNLTJOUfzQwfMydNaBszH9x0RF0TTzZB02lUdX7fm7VYQivyzDCmbHYKODKc7v1geXR-Ik5o4roLpvje3D0d*9EoVST7tLY2V8Ns3Mk7uP*v3tFvxeAMbJWSk_").then(res => {
        IMChat.login(`loo00${this.props.user.id}`, res.results).then(res => {
          // console.warn(res.results.sig)
          // IMChat.login(`19`, res.results.sig).then(res => {
          console.warn("login success");
          this.onUserStatus(callback);
        }).catch(err => {
          this.props.actions.getV1ImSigAction().then(res => {
            IMChat.login(`loo00${this.props.user.id}`, res.results).then(res => {
              console.warn("login success");
              this.onUserStatus(callback);
            }).catch(err => {
              callback && callback(false);
            });
          }).catch(err => {
            callback && callback(false);
          });
        });
      })
    }
  }

  _onRefresh() {
    this.setState({
      isRefreshing: true
    });
    Promise.all([
      this.props.actions.getUserInfoAction(),
      this.props.actions.getNotifyAction(),
      this.props.actions.getNoCommentNumAction()
    ])
      .then(values => {
        Toast.info("刷新成功", 0.2);
        if(values && values[2] && values[2].status == 'ok') {
          this.state.noCommentCount = values[2].results.count;
        }
        this.setState({
          isRefreshing: false
        });
      })
      .catch(err => {});
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {/* <PageHeader /> */}

        {/* {this.props.user.phone && this.props.user.phone != "" ? null : this.state.isShowBindPhone == true ? <PhonePoint /> : null} */}

        {/* {this.state.isNotSelected ? null : ( */}

        <ScrollView
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
          scrollEventThrottle={0.5}
          style={{
            flex: 1,
            backgroundColor: "#f3f3f3"
          }}
          // onScroll={e => {
          //   this.refs['_sdHeader'].onScrollHeaderBackground(e.nativeEvent.contentOffset.y)
          // }}
        >
          <PersonMainTop />
          {this.props.user.phone && this.props.user.phone != "" ? null : this
            .state.isShowBindPhone == true ? (
            <PhonePoint />
          ) : null}

          <View style={{marginTop: CSS.pixel(30), backgroundColor: 'red'}}>
            <SDList
              listOptions={[
                {
                  leftIcon: () => (
                    <Image source={require("@img/my/mine_ico_ZhiTongLi.png")} />
                  ),
                  name: "我的职么力",
                  direction: ">",
                  rightIcon: () => {
                    return (
                      <View
                        style={{
                          width: CSS.pixel(80),
                          height: CSS.pixel(280),
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center"
                          //backgroundColor:'#ccc',
                        }}
                      >
                        <Image source={iconRightArrowDark} />
                      </View>
                    );
                  },
                  onPress: () => {
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
                  },
                  listHeaderStyle: {
                    borderColor: "#efefef",
                    borderBottomWidth: 1
                  },
                  bottomBorder: false,
                  footter: (
                    <PowerNSalary
                      power={this.props.user.power || 0}
                      salary={this.props.user.salary || 0}
                      height={20}
                    />
                  )
                }
              ]}
            />
          </View>

          <View style={{ marginVertical: CSS.pixel(30, true) }}>
            <SDList
              listOptions={[
                {
                  leftIcon: () => (
                    <Image source={require("@img/home/home_ico_Resume.png")} />
                  ),
                  name: "个人履历",
                  direction: ">",
                  onPress: () => {
                    this.context.navigator.push(
                      navScreen("PushScreen", "我的履历", {
                        passProps: {
                          screen: () => <TrackRecordScreen/>,
                          fullScreen: true,
                          noScrollView: true,
                          header: {
                            title: "我的履历",
                          },
                          navigatorButtons: {
                            rightButtons: [
                              {
                                icon: () => <Image source={require("@img/salary/home_ico_share02.png")}/>,
                                id: "track_share"
                              }
                            ]
                          }
                        }
                      }),
                    );
                  }
                },
                {
                  leftIcon: () => (
                    <Image source={require("@img/my/mine_ico_curriculum.png")} />
                  ),
                  name: "我的课程",
                  direction: ">",
                  subInfo: this.state.noCommentCount > 0 ? `${this.state.noCommentCount}场待评价` : '',
                  subInfoStyle: {color: '#FE8800'},
                  onPress: () => {
                    this.context.navigator.push(
                      navScreen("PushScreen", "我的课程", {
                        passProps: {
                          screen: () => <MyLiveCourseScreen />,
                          header: {
                            title: "我的课程"
                          },
                          fullScreen: true,
                          noScrollView: true,
                          navigatorButtons: {
                            rightButtons: [
                              {
                                icon: () => <Image source={require("@img/imchat/mine_ico_screen.png")}/>,
                                id: "filter_my_course"
                              }
                            ]
                          }
                        }
                      })
                    );
                  }
                },
                {
                  leftIcon: () => (
                    <Image source={require("@img/my/mine_ico_Collection.png")} />
                  ),
                  name: "我的收藏",
                  direction: ">",
                  bottomBorder: false,
                  onPress: () => {
                    this.context.navigator.push(
                      navScreen("PushScreen", "我的收藏", {
                        passProps: {
                          screen: () => <MyCollectionScreen />,
                          header: {
                            title: "我的收藏"
                          },
                          fullScreen: true,
                          noScrollView: true
                        },
                        navigatorButtons: {
                          rightButtons: [
                            {
                              title: "管理", // for icon button, provide the local image asset name
                              id: "collect_manage" // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            }
                          ]
                        }
                      })
                    );
                  }
                }
              ]}
            />
          </View>

          <View style={{ marginBottom: CSS.pixel(30, true) }}>
            <SDList
              listOptions={[
                {
                  leftIcon: () => (
                    <Image source={require("@img/my/mine_ico_help.png")} />
                  ),
                  name: "帮助中心",
                  direction: ">",
                  onPress: () => {
                    this.context.navigator.push(
                      navScreen("PushScreen", "帮助中心", {
                        passProps: {
                          fullScreen: true,
                          noScrollView: true,
                          screen: () => <HelpScreen />,
                          header: {
                            title: "帮助中心"
                          } // 自定义传递props
                        }
                      })
                    );
                  }
                },
                {
                  leftIcon: () => (
                    <Image source={require("@img/my/mine_ico_share.png")} />
                  ),
                  name: "分享给好友",
                  direction: ">",
                  onPress: () => {
                    const {
                      gender,
                      nickname,
                      avatar,
                      power,
                      salary
                    } = this.props.user;
                    const name = nickname;
                    const task =
                      (this.props.user.total.certificate_count
                        ? this.props.user.total.certificate_count
                        : 0) +
                      (this.props.user.total.tech_count
                        ? this.props.user.total.tech_count
                        : 0);

                    /* console.warn("freind url", `${HOSTS.SHARE}/#/track?name=${nickname}&gender=${gender}&school=${
                      this.props.schoolName
                    }&major=${
                      this.props.majorName
                    }&degree=${
                      this.props.degreeName
                    }&power=${power
                      .toString()
                      .slice(0, 4)}&salary=${salary}&task=${task}` +
                    (avatar && avatar.file_name
                      ? `&userpic=${avatar.file_name}`
                      : "")) */

                    navLightBox("LightBoxScreen", {
                      passProps: {
                        screen: () => (
                          <ShareButton
                            timeLineOptions={{
                              type: "news",
                              title: `职业规划，成长进阶，我在职么开门的第${this.state.days}天，职通力${this.props.user.power.toString()
                                .slice(0, 4)}分，毕业能拿月薪¥${this.props.user.salary}`,
                              description: `职业规划，成长进阶，我在职么开门的第${this.state.days}天，职通力${this.props.user.power.toString()
                                .slice(0, 4)}分，毕业能拿月薪¥${this.props.user.salary}`,
                              webpageUrl:
                                `${HOSTS.SHARE}/#/track?name=${nickname}&gender=${gender}&school=${
                                  this.props.schoolName
                                }&major=${
                                  this.props.majorName
                                }&power=${power
                                  .toString()
                                  .slice(0, 4)}&salary=${salary}&task=${task}` +
                                (avatar && avatar.file_name
                                  ? `&userpic=${avatar.file_name}`
                                  : "")
                              // webpageUrl: `http://192.168.100.7:30005/#/track?name=${nickname}&gender=${gender}&school=${this.props.schoolName}&major=${this.props.majorName}&power=${power.toString().slice(0, 4)}&salary=${salary}&task=${task}`+(avatar && avatar.file_name ? `&userpic=${avatar.file_name}` : '')
                            }}
                            sessionOptions={{
                              type: "news",
                              description: `职业规划，成长进阶，我在职么开门的第${this.state.days}天，职通力${this.props.user.power.toString()
                                .slice(0, 4)}分，毕业能拿月薪¥${this.props.user.salary}`,
                              title: `职业规划，成长进阶，我在职么开门的第${this.state.days}天，职通力${this.props.user.power.toString()
                                .slice(0, 4)}分，毕业能拿月薪¥${this.props.user.salary}`,
                              webpageUrl:
                                `${HOSTS.SHARE}/#/track?name=${nickname}&gender=${gender}&school=${
                                  this.props.schoolName
                                }&major=${
                                  this.props.majorName
                                }&degree=${
                                  this.props.degreeName
                                }&power=${power
                                  .toString()
                                  .slice(0, 4)}&salary=${salary}&task=${task}` +
                                (avatar && avatar.file_name
                                  ? `&userpic=${avatar.file_name}`
                                  : "")
                            }}
                            qqTimeLineOptions={{
                              type: "news",
                              description: `职业规划，成长进阶，我在职么开门的第${this.state.days}天，职通力${this.props.user.power.toString()
                                .slice(0, 4)}分，毕业能拿月薪¥${this.props.user.salary}`,
                              title: `职业规划，成长进阶，我在职么开门的第${this.state.days}天，职通力${this.props.user.power.toString()
                                .slice(0, 4)}分，毕业能拿月薪¥${this.props.user.salary}`,
                              url:
                                `${HOSTS.SHARE}/?from=singlemessage#/track?name=${nickname}&gender=${gender}&school=${
                                  this.props.schoolName
                                }&major=${
                                  this.props.majorName
                                }&degree=${
                                  this.props.degreeName
                                }&power=${power
                                  .toString()
                                  .slice(0, 4)}&salary=${salary}&task=${task}` +
                                (avatar && avatar.file_name
                                  ? `&userpic=${avatar.file_name}`
                                  : "")
                            }}
                            qqSessionOptions={{
                              type: "news",
                              description: `职业规划，成长进阶，我在职么开门的第${this.state.days}天，职通力${this.props.user.power.toString()
                                .slice(0, 4)}分，毕业能拿月薪¥${this.props.user.salary}`,
                              title: `职业规划，成长进阶，我在职么开门的第${this.state.days}天，职通力${this.props.user.power.toString()
                                .slice(0, 4)}分，毕业能拿月薪¥${this.props.user.salary}`,
                              url:
                                `${HOSTS.SHARE}/?from=singlemessage#/track?name=${nickname}&gender=${gender}&school=${
                                  this.props.schoolName
                                }&major=${
                                  this.props.majorName
                                }&degree=${
                                  this.props.degreeName
                                }&power=${power
                                  .toString()
                                  .slice(0, 4)}&salary=${salary}&task=${task}` +
                                (avatar && avatar.file_name
                                  ? `&userpic=${avatar.file_name}`
                                  : "")
                            }}
                          />
                        )
                      }
                    });
                  }
                },
                {
                  leftIcon: () => (
                    <Image source={require("@img/my/mine_ico_Opinion.png")} />
                  ),
                  name: "意见反馈",
                  direction: ">",
                  bottomBorder: false,
                  onPress: () => {
                    // QQShare.login().then(res => {
                    //   console.warn(res);
                    // }).catch(err => {

                    // });
                    this.context.navigator.push(
                      navScreen("PushScreen", "意见反馈", {
                        passProps: {
                          screen: () => <FeedBackScreen />,
                          header: {
                            title: "意见反馈"
                          }
                        }
                      })
                    );
                  }
                }
              ]}
            />
          </View>
        </ScrollView>
        {/* <SDHeader ref="_sdHeader" animate title="我的"/> */}
        <SDTabBar selectIndex={3} />
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: state.user,
  schoolName: getSchoolName(state, props),
  majorName: getMajor(state, props),
  degreeName: getSchoolLevel(state, props),
}))(PersonScreen);
