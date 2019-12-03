import React from "react";
import ReactNative, {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  UIManager
} from "react-native";
import PropTypes from "prop-types";
import { Toast } from "antd-mobile";
import ViewShot from "react-native-view-shot";
import ConnectWithActions from "../../../connectWithActions";
import defaultStyle, { navScreen, navRightButton } from "@styles";
import TaskDetailItem from "../../../sd_trackRecord/TaskDetailItem";
import TitleWrap from "../../../sd_titleWrap/TitleWrap";
import UserInfocard from "../../../sd_trackRecord/UserInfoCard";
import EducationExperience from "../../../sd_trackRecord/EducationExperience";
import LearnCourse from "../../../sd_trackRecord/LearnCourse";
import PracticeExp from "../../../sd_trackRecord/PracticeExp";
import SchoolJobs from "../../../sd_trackRecord/SchoolJobs";
import AwardExp from "../../../sd_trackRecord/AwardExp";
import OwnCertificate from "../../../sd_trackRecord/OwnCertificate";
import NoDataButton from "../../../sd_noDataButton/NoDataButton";
import ShareButton from "../../../sd_shareButton/ShareButton";
import AddLearnedCourseScreen from "../../pushScreen/editUserBaseInfo/AddLearnedCourseScreen";
import EditLearnedCourseScreen from "../../pushScreen/editUserBaseInfo/EditLearnedCourseScreen";
import ImportCourseLightBox from "../../../sd_trackRecord/ImportCourseLightBox";
import {
  UserState,
  courseModel,
  schoolJobModel,
  practiceExpModel,
  awardExpModel,
  certificateModel,
  educationModel
} from "../../../types";
import {
  getUserPower,
  getSchoolName,
  getMajor
} from "../../../directSelectors";
import { CSS } from "../../../common/SDCSS";
import { navLightBox, SDMainColor } from "../../../styles";
import { isIphoneX } from "../../../utils/iphonex";
import { initialsFromName } from "../../../sd_components/TextAvatar";
import { colorHashFromName } from "../../../utils/color";
import { formatPower } from "../../../utils/user";
import { SDSafeAreaScrollView } from "../../../common";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import EditButton from "./EditButton";
import ShowInSchoolJobsScreen from "../editUserBaseInfo/ShowInSchoolJobsScreen";
import AddInSchoolJobsScreen from "../editUserBaseInfo/AddInSchoolJobsScreen";
import AddAwardExpScreen from "../editUserBaseInfo/AddAwardExpScreen";
import ShowPracticeExpScreen from "../editUserBaseInfo/ShowPracticeExpScreen";
import AddPracticeScreen from "../addPractice/AddPracticeScreen";
import EditUserBaseInfoScreen from "../editUserBaseInfo/EditUserBaseInfoScreen";
import ShowUserEducationScreen from "../editUserBaseInfo/ShowUserEducationScreen";
import ShowAwardExpScreen from "../editUserBaseInfo/ShowAwardExpScreen";
import ShowCertificateScreen from "../../../sd_showCertificate/ShowCertificateScreen";
import AddCertificateScreen from "../addCertificate/AddCertificateScreen";
import SelfEvaluationScreen from "../selfEvaluation/SelfEvaluationScreen";
import Reactotron from "reactotron-react-native";
import SendToEmailLightBox from "../../lightBoxScreen/SendToEmailLightBox";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
    // paddingBottom: isIphoneX() ? 34 : 0
  }
});

type Props = {
  userInfo: UserState,
  userPower: number,
  courseList: courseModel[],
  jobList: schoolJobModel[],
  practiceExpList: practiceExpModel[],
  awardExpList: awardExpModel[],
  certificateList: certificateModel[],
  educationList: educationModel[]
};

// 我的履历页面
class TrackRecordScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    // this.timer = null;
    this.state = {
      isSavePic: false
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentDidMount() {
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "track_share"
    );
    this.context.refs["_trackRecord"] = this;
    this.context.refs["g_viewShot"] = this.refs["viewShot"];
    // 判断是否需要跳转
    // if (this.props.skip) {
    //   setTimeout(() => {
    //     if (this.props.skip == "course_sync") {
    //       if (this.refs["course_sync"]) {
    //         UIManager.measure(
    //           ReactNative.findNodeHandle(this.refs["course_sync"]),
    //           (x, y, w, h, px, py) => {
    //             // this.refs["_scrollView"].scrollTo({
    //             //   y: py
    //             // });
    //             // Toast.info("成绩导入成功", 0.5);
    //           }
    //         );
    //       }
    //     } else if (this.props.skip == "audit_certificate") {
    //       if (this.refs["audit_certificate"]) {
    //         UIManager.measure(
    //           ReactNative.findNodeHandle(this.refs["audit_certificate"]),
    //           (x, y, w, h, px, py) => {
    //             this.refs["_scrollView"].scrollTo({
    //               y: py
    //             });
    //             Toast.info("查看证书审核结果", 0.5);
    //           }
    //         );
    //       }
    //     } else if (this.props.skip == "audit_winning") {
    //       if (this.refs["audit_winning"]) {
    //         UIManager.measure(
    //           ReactNative.findNodeHandle(this.refs["audit_winning"]),
    //           (x, y, w, h, px, py) => {
    //             this.refs["_scrollView"].scrollTo({
    //               y: py
    //             });
    //             Toast.info("查看奖项审核结果", 0.5);
    //           }
    //         );
    //       }
    //     }
    //   }, 1800);
    // }
  }

  componentWillUnmount() {
    if (this.context.refs["g_viewShot"]) {
      delete this.context.refs["g_viewShot"];
    }
    if (this.context.refs["_trackRecord"]) {
      delete this.context.refs["_trackRecord"];
    }

    // 刷新我的数据
    this.props.actions.getUserInfoAction();
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "track_share") {
        const { nickname, gender, avatar, power, salary } = this.props.userInfo;
        const task =
          (this.props.userInfo.total.certificate_count
            ? this.props.userInfo.total.certificate_count
            : 0) +
          (this.props.userInfo.total.tech_count
            ? this.props.userInfo.total.tech_count
            : 0);
        navLightBox("LightBoxScreen", {
          passProps: {
            screen: () => (
              <ShareButton needSendToEmail needSavePic={true} notNeedQQTimeLine notNeedTimeLine trackSession trackTimeline />
            )
          }
        });
      }
    }
  }

  render() {
    // Reactotron.log(this.props.educationList);
    const { avatar, gender, nickname, total } = this.props.userInfo;
    return (
      <ScrollView ref="_scrollView" style={[styles.container]}>
        <ViewShot ref="viewShot" options={{ quality: 1 }}>
          {/* 背景 */}
          <View
            style={{
              backgroundColor: "#fff",
              paddingHorizontal: CSS.pixel(30),
              paddingTop: CSS.pixel(10),
              paddingBottom: CSS.pixel(30),
              position: "relative"
            }}
          >
            <Image
              style={{
                position: "absolute",
                left: CSS.pixel(30),
                top: CSS.pixel(10),
                right: CSS.pixel(30),
                bottom: CSS.pixel(30),
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center"
              }}
              resizeMode="stretch"
              source={require("@img/my/rank_pic_Personal_home_bg.png")}
            />

            {/* 基本信息 */}
            <View
              style={{ paddingLeft: CSS.pixel(30), paddingTop: CSS.pixel(30) }}
            >
              <View
                style={{
                  flexDirection: "row"
                }}
              >
                {/* 头像 */}
                <View style={{ position: "relative" }}>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: CSS.pixel(154),
                      height: CSS.pixel(154),
                      backgroundColor: "#fff",
                      borderRadius: CSS.pixel(78),
                      overflow: "hidden"
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: CSS.pixel(140),
                        height: CSS.pixel(140),
                        backgroundColor: "#fff",
                        borderRadius: CSS.pixel(78),
                        overflow: "hidden"
                      }}
                    >
                      {avatar ? (
                        <Image
                          source={{ uri: avatar.url + "?imageView2/2/h/140" }}
                          style={{
                            width: CSS.pixel(140),
                            height: CSS.pixel(140)
                          }}
                        />
                      ) : gender == "female" ? (
                        <Image
                          source={require("@img/avator/female.png")}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode="cover"
                        />
                      ) : (
                        <Image
                          source={require("@img/avator/male.png")}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode="cover"
                        />
                      )}
                    </View>
                  </View>

                  {/* 是否认证 */}
                  {this.props.userInfo.is_verified && (
                    <View style={{ position: "absolute", right: 2, bottom: 2 }}>
                      <Image
                        source={require("@img/mine_Resume_Authentication1.png")}
                      />
                    </View>
                  )}
                </View>

                {/* 个人信息 */}
                <View
                  style={{
                    padding: CSS.pixel(20),
                    justifyContent: "space-between"
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row"
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        color: "#333",
                        maxWidth: 200,
                        fontSize: CSS.textSize(30),
                        fontWeight: "600",
                      }}
                    >
                      {nickname.slice(0, 10)}
                    </Text>
                    {gender == "female" ? (
                      <Image
                        style={{marginLeft: 5}}
                        source={require("@img/rank/rank_ico_female.png")}
                      />
                    ) : (
                      <Image style={{marginLeft: 5}} source={require("@img/rank/rank_ico_male.png")} />
                    )}
                  </View>
                  <View>
                    <Text
                      numberOfLines={1}
                      style={{
                        maxWidth: 200,
                        color: "#333",
                        fontSize: CSS.textSize(24),
                        fontWeight: "500"
                      }}
                    >
                      {total.school_name + " "}
                      {total.major_name + " "}
                      {total.degree_name}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* 描述 */}
            <View
              style={{
                paddingHorizontal: CSS.pixel(30),
                marginVertical: CSS.pixel(20)
              }}
            >
              {
                this.state.isSavePic ? null :
                <View
                  style={{
                    height: CSS.pixel(66, true),
                    backgroundColor: "#fff",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: CSS.pixel(34),
                    opacity: 0.9
                  }}
                >
                  <Text style={{ color: "#333", fontSize: CSS.textSize(24) }}>
                    尽可能全面完善履历，能帮助大幅度提升职么力
                  </Text>
                </View>
              }
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#f3f3f3",
              padding: CSS.pixel(30),
              width: "100%"
            }}
          >
            {/* 基本信息 */}
            <View>
              <TitleWrap
                // icon={this.state.isSavePic ? null : "edit"}
                // subInfo={this.state.isSavePic ? "" : "编辑"}
                icon={null}
                subInfo={""}
                title="基本信息"
                iconStyle={{ fontSize: CSS.textSize(24), color: "#fed200" }}
                onPress={null}
              />
              {this.props.userInfo.gender == "" &&
              !this.props.userInfo.city &&
              this.props.userInfo.contact == "" &&
              this.props.userInfo.email == "" ? (
                <NoDataButton
                  buttonName="编辑基本信息"
                  onPress={() => {
                    this.context.navigator.push(
                      navScreen("PushScreen", "编辑资料", {
                        passProps: {
                          screen: () => <EditUserBaseInfoScreen noPic />,
                          fullScreen: true,
                          noScrollView: true,
                          header: {
                            title: "编辑资料"
                          }
                        },
                        navigatorButtons: {
                          rightButtons: [
                            {
                              title: "保存",
                              id: "user_profile_save"
                            }
                          ]
                        }
                      })
                    );
                  }}
                />
              ) : (
                <UserInfocard
                  edit={
                    !this.state.isSavePic
                      ? () => (
                          <EditButton
                            onPress={() => {
                              this.context.navigator.push(
                                navScreen("PushScreen", "编辑基本信息", {
                                  passProps: {
                                    screen: () => (
                                      <EditUserBaseInfoScreen noPic />
                                    ),
                                    fullScreen: true,
                                    noScrollView: true,
                                    backgroundColor: "#f3f3f3",
                                    header: {
                                      title: "编辑基本信息"
                                    }
                                  },
                                  navigatorButtons: {
                                    rightButtons: [
                                      {
                                        title: "保存",
                                        id: "user_profile_save"
                                      }
                                    ]
                                  }
                                })
                              );
                            }}
                          />
                        )
                      : () => null
                  }
                />
              )}
            </View>

            {/* 教育经历 */}
            {this.state.isSavePic &&
            this.props.educationList.length <= 0 ? null : (
              <View
                style={{
                  marginTop: CSS.pixel(30, true)
                }}
              >
                <TitleWrap
                  // icon={this.state.isSavePic ? null : "edit"}
                  // subInfo={this.state.isSavePic ? "" : "编辑"}
                  icon={null}
                  subInfo={""}
                  title="教育经历"
                  iconStyle={{
                    fontSize: CSS.textSize(24),
                    color: "#fed200"
                  }}
                />
                <EducationExperience
                  edit={
                    this.props.educationList.length && !this.state.isSavePic
                      ? () => (
                          <EditButton
                            onPress={() => {
                              this.context.navigator.push(
                                navScreen(
                                  "PushScreen",
                                  "编辑教育经历",
                                  {
                                    passProps: {
                                      screen: () => <ShowUserEducationScreen />,
                                      fullScreen: true,
                                      noScrollView: true,
                                      header: {
                                        title: "编辑教育经历"
                                      }
                                    },
                                    navigatorButtons: {
                                      rightButtons: [
                                        {
                                          // title: "动态",
                                          icon: () => (
                                            <Image
                                              source={require("@img/my/TrackRecord/mine_Resume_btn_add.png")}
                                            />
                                          ), // for icon button, provide the local image asset name
                                          id: "show_add_education_btn"
                                        }
                                      ]
                                    }
                                  }
                                  //navRightButton("save_educationBtn", "保存")
                                )
                              );
                            }}
                          />
                        )
                      : null
                  }
                />
              </View>
            )}

            {/* 在校课程 */}
            {this.state.isSavePic &&
            this.props.courseList.length <= 0 ? null : (
            <View
              ref="course_sync"
              style={{
                marginTop: CSS.pixel(30, true)
              }}
              onLayout={(e) => {
                const h = e.nativeEvent.layout.y;
                // console.warn(e.nativeEvent.layout.y);
                if (this.props.skip == "course_sync") {
                  if (this.refs["course_sync"]) {
                    setTimeout(() => {
                      UIManager.measure(
                        ReactNative.findNodeHandle(this.refs["course_sync"]),
                        (x, y, w, h, px, py) => {
                            this.refs["_scrollView"].scrollTo({
                              y: py - 80
                            });
                            Toast.info("成绩导入成功", 0.5);
                        }
                      );
                    }, 300);
                  }
                }
              }}
            >
              <TitleWrap
                icon={null}
                subInfo={""}
                title="在校成绩"
                onPress={() => {}}
                iconStyle={{
                  fontSize: CSS.textSize(24),
                  color: "#fed200"
                }}
              />

              {this.props.educationList.some(
                c => c.course_status == "doing" || c.course_status == "ok"
              ) ? (
                <View
                  style={{
                    borderRadius: CSS.pixel(10),
                    overflow: "hidden"
                  }}
                >
                  <LearnCourse
                    isSavePic={this.state.isSavePic}
                    edit={this.state.isSavePic ? null : () => (
                      <EditButton
                        onPress={() => {
                          this.context.navigator.push(
                            navScreen("PushScreen", "编辑在校成绩", {
                              passProps: {
                                screen: () => <EditLearnedCourseScreen />,
                                fullScreen: true,
                                noScrollView: true,
                                header: {
                                  title: "编辑在校成绩"
                                }
                              }
                            })
                          );
                        }}
                      />
                    )}
                  />
                </View>
              ) : (
                <NoDataButton
                  onPress={() => {
                    this.context.navigator.push(
                      navScreen("PushScreen", "添加在校成绩", {
                        passProps: {
                          screen: () => <EditLearnedCourseScreen />,
                          fullScreen: true,
                          noScrollView: true,
                          header: {
                            title: "添加在校成绩"
                          }
                        }
                        // ...navRightButton("save_addLearnedCourseBtn", "保存")
                      })
                    );
                  }}
                  buttonName="添加在校成绩"
                  subInfo="你可以添加在校学习的课程及考试成绩"
                />
              )}
            </View>)}
            
            {this.state.isSavePic && this.props.jobList.length <= 0 ? null : (
              <View
                style={{
                  marginTop: CSS.pixel(30, true)
                }}
              >
                <TitleWrap
                  icon={null}
                  subInfo={""}
                  title="在校职位"
                  iconStyle={{
                    fontSize: CSS.textSize(24),
                    color: "#fed200"
                  }}
                />
                <View
                  style={{
                    borderRadius: CSS.pixel(10),
                    overflow: "hidden"
                  }}
                >
                  <SchoolJobs
                    edit={
                      this.props.jobList.length && !this.state.isSavePic
                        ? () => (
                            <EditButton
                              onPress={() => {
                                this.context.navigator.push(
                                  navScreen(
                                    "PushScreen",
                                    "编辑在校职务",
                                    {
                                      passProps: {
                                        screen: () => (
                                          <ShowInSchoolJobsScreen />
                                        ),
                                        fullScreen: true,
                                        noScrollView: true,
                                        header: {
                                          title: "编辑在校职务"
                                        }
                                      },
                                      navigatorButtons: {
                                        rightButtons: [
                                          {
                                            // title: "动态",
                                            icon: () => (
                                              <Image
                                                source={require("@img/my/TrackRecord/mine_Resume_btn_add.png")}
                                              />
                                            ), // for icon button, provide the local image asset name
                                            id: "show_add_schoolJob_btn"
                                          }
                                        ]
                                      }
                                    }
                                    //navRightButton("save_editSchoolJobsBtn", "保存")
                                  )
                                );
                              }}
                            />
                          )
                        : null
                    }
                  />
                  {this.props.jobList.length <= 0 ? (
                    <NoDataButton
                      style={{ paddingTop: 0 }}
                      onPress={() => {
                        this.context.navigator.push(
                          navScreen("PushScreen", "添加在校职务", {
                            passProps: {
                              screen: () => <AddInSchoolJobsScreen />,
                              fullScreen: true,
                              noScrollView: true,
                              header: {
                                title: "添加在校职务"
                              }
                            },
                            ...navRightButton("save_addSchoolJobsBtn", "保存")
                          })
                        );
                      }}
                      buttonName="添加在校职务"
                      subInfo="你可以填写你在校担任的职务，如班级组织委员、社团干部等"
                    />
                  ) : null}
                </View>
              </View>
            )}
            {this.state.isSavePic &&
            this.props.awardExpList.filter(c => c.audit_status == 'audit_pass').length <= 0 ? null : (
              <View
                ref="audit_winning"
                style={{
                  marginTop: CSS.pixel(30, true)
                }}
                onLayout={(e) => {
                  if (this.props.skip == "audit_winning") {
                    if (this.refs["audit_winning"]) {
                      setTimeout(() => {
                        UIManager.measure(
                          ReactNative.findNodeHandle(this.refs["audit_winning"]),
                          (x, y, w, h, px, py) => {
                            this.refs["_scrollView"].scrollTo({
                              y: py - 80
                            });
                            Toast.info("查看获奖经历审核结果", 0.5);
                          }
                        );
                      }, 300)
                    }
                  }
                }}
              >
                <TitleWrap
                  icon={null}
                  subInfo={""}
                  title="获奖经历"
                  iconStyle={{
                    fontSize: CSS.textSize(24),
                    color: "#fed200"
                  }}
                />
                <View
                  style={{
                    borderRadius: CSS.pixel(10),
                    overflow: "hidden"
                  }}
                >
                  <AwardExp
                    isSavePic={this.state.isSavePic}
                    edit={
                      this.props.awardExpList.length && !this.state.isSavePic
                        ? () => (
                            <EditButton
                              onPress={() => {
                                this.context.navigator.push(
                                  navScreen(
                                    "PushScreen",
                                    "添加获奖经历",
                                    {
                                      passProps: {
                                        screen: () => <ShowAwardExpScreen />,
                                        fullScreen: true,
                                        noScrollView: true,
                                        header: {
                                          title: "编辑获奖经历"
                                        }
                                      },
                                      navigatorButtons: {
                                        rightButtons: [
                                          {
                                            // title: "动态",
                                            icon: () => (
                                              <Image
                                                source={require("@img/my/TrackRecord/mine_Resume_btn_add.png")}
                                              />
                                            ), // for icon button, provide the local image asset name
                                            id: "show_add_awardExp_btn"
                                          }
                                        ]
                                      }
                                    }
                                    // navRightButton("save_addAwardExpBtn", "保存")
                                  )
                                );
                              }}
                            />
                          )
                        : null
                    }
                  />
                  {this.props.awardExpList.length <= 0 ? (
                    <NoDataButton
                      style={{ paddingTop: 0 }}
                      onPress={() => {
                        this.context.navigator.push(
                          navScreen("PushScreen", "添加获奖经历", {
                            passProps: {
                              screen: () => <AddAwardExpScreen />,
                              fullScreen: true,
                              noScrollView: true,
                              header: {
                                title: "添加获奖经历"
                              }
                            },
                            ...navRightButton("save_addAwardExpBtn", "保存")
                          })
                        );
                      }}
                      buttonName="添加获奖经历"
                      subInfo="你可以填写你在校所获奖项，如奖学金、活动奖项等"
                    />
                  ) : null}
                </View>
              </View>
            )}
            {this.state.isSavePic &&
            this.props.practiceExpList.length <= 0 ? null : (
              <View
                style={{
                  marginTop: CSS.pixel(30, true)
                }}
              >
                <TitleWrap
                  icon={null}
                  subInfo={""}
                  title="实习经历"
                  iconStyle={{
                    fontSize: CSS.textSize(24),
                    color: "#fed200"
                  }}
                />
                <View
                  style={{
                    borderRadius: CSS.pixel(10),
                    overflow: "hidden"
                  }}
                >
                  <PracticeExp
                    edit={
                      this.props.practiceExpList.length && !this.state.isSavePic
                        ? () => (
                            <EditButton
                              onPress={() => {
                                this.context.navigator.push(
                                  navScreen("PushScreen", "编辑实习经历", {
                                    passProps: {
                                      screen: () => <ShowPracticeExpScreen />,
                                      fullScreen: true,
                                      noScrollView: true,
                                      header: {
                                        title: "编辑实习经历"
                                      }
                                    },
                                    navigatorButtons: {
                                      rightButtons: [
                                        {
                                          // title: "动态",
                                          icon: () => (
                                            <Image
                                              source={require("@img/my/TrackRecord/mine_Resume_btn_add.png")}
                                            />
                                          ), // for icon button, provide the local image asset name
                                          id: "show_add_practiceExp_btn"
                                        }
                                      ]
                                    }
                                  })
                                );
                              }}
                            />
                          )
                        : null
                    }
                  />
                  {this.props.practiceExpList.length <= 0 ? (
                    <NoDataButton
                      style={{ paddingTop: 0 }}
                      onPress={() => {
                        this.context.navigator.push(
                          navScreen("PushScreen", "添加实习经历", {
                            passProps: {
                              screen: () => <AddPracticeScreen />,
                              fullScreen: true,
                              noScrollView: true,
                              header: {
                                title: "添加实习经历"
                              }
                            },
                            ...navRightButton("save_practiceExpBtn", "保存")
                          })
                        );
                      }}
                      buttonName="添加实习经历"
                      subInfo="你可以填写你大学期间的相关工作、实习经历"
                    />
                  ) : null}
                </View>
              </View>
            )}
            {this.state.isSavePic &&
            this.props.certificateList.filter(c => c.audit_status == 'audit_pass').length <= 0 ? null : (
              <View
                ref="audit_certificate"
                style={{
                  marginTop: CSS.pixel(30, true)
                }}
                onLayout={(e) => {
                  // console.warn(e.nativeEvent.layout.y);
                  if (this.props.skip == "audit_certificate") {
                    if (this.refs["audit_certificate"]) {
                      setTimeout(() => {
                        UIManager.measure(
                          ReactNative.findNodeHandle(this.refs["audit_certificate"]),
                          (x, y, w, h, px, py) => {
                              this.refs["_scrollView"].scrollTo({
                                y: py - 80
                              });
                              Toast.info("查看证书审核结果", 0.5);
                          }
                        );
                      }, 300)
                    }
                  }
                }}
              >
                <TitleWrap
                  icon={null}
                  subInfo={""}
                  title="所获证书"
                  iconStyle={{
                    fontSize: CSS.textSize(24),
                    color: "#fed200"
                  }}
                />
                <View
                  style={{
                    borderRadius: CSS.pixel(10),
                    overflow: "hidden"
                  }}
                >
                  <OwnCertificate
                    isSavePic={this.state.isSavePic}
                    edit={
                      this.props.certificateList.length && !this.state.isSavePic
                        ? () => (
                            <EditButton
                              onPress={() => {
                                this.context.navigator.push(
                                  navScreen(
                                    "PushScreen",
                                    "编辑证书",
                                    {
                                      passProps: {
                                        screen: () => <ShowCertificateScreen />,
                                        fullScreen: true,
                                        noScrollView: true,
                                        header: {
                                          title: "编辑证书"
                                        }
                                      },
                                      navigatorButtons: {
                                        rightButtons: [
                                          {
                                            // title: "动态",
                                            icon: () => (
                                              <Image
                                                source={require("@img/my/TrackRecord/mine_Resume_btn_add.png")}
                                              />
                                            ), // for icon button, provide the local image asset name
                                            id: "show_add_certificate_btn"
                                          }
                                        ]
                                      }
                                    }
                                    //navRightButton("save_CertificateBtn", "保存")
                                  )
                                );
                              }}
                            />
                          )
                        : null
                    }
                  />
                  {this.props.certificateList.length <= 0 ? (
                    <NoDataButton
                      style={{ paddingTop: 0 }}
                      onPress={() => {
                        this.context.navigator.push(
                          navScreen("PushScreen", "添加证书", {
                            passProps: {
                              screen: () => <AddCertificateScreen />,
                              fullScreen: true,
                              noScrollView: true,
                              header: {
                                title: "添加证书"
                              }
                            },
                            ...navRightButton("save_CertificateBtn", "保存")
                          })
                        );
                      }}
                      buttonName="添加证书"
                      subInfo="你可以填写你所考取的证书并上传凭证"
                    />
                  ) : null}
                </View>
              </View>
            )}

            {this.state.isSavePic &&
            (!this.props.userInfo.content ||
              this.props.userInfo.content == "") ? null : (
              <View
                style={{
                  marginTop: CSS.pixel(30, true)
                }}
              >
                <TitleWrap
                  icon={null}
                  subInfo={""}
                  title="自我评价"
                  iconStyle={{
                    fontSize: CSS.textSize(24),
                    color: "#fed200"
                  }}
                />
                <View
                  style={{
                    borderRadius: CSS.pixel(10),
                    overflow: "hidden"
                  }}
                >
                  {this.props.userInfo.content &&
                  this.props.userInfo.content !== "" ? (
                    <View
                      style={{
                        paddingHorizontal: CSS.pixel(40),
                        backgroundColor: "#fff",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingBottom: CSS.pixel(30)
                      }}
                    >
                      {!this.state.isSavePic ? (
                        <View
                          style={{
                            position: "absolute",
                            right: CSS.pixel(10),
                            top: CSS.pixel(30)
                          }}
                        >
                          <EditButton
                            onPress={() => {
                              this.context.navigator.push(
                                navScreen("PushScreen", "自我评价", {
                                  passProps: {
                                    screen: () => <SelfEvaluationScreen />,
                                    fullScreen: true,
                                    noScrollView: true,
                                    header: {
                                      title: "自我评价"
                                    }
                                  },
                                  ...navRightButton(
                                    "save_evaluationBtn",
                                    "保存"
                                  )
                                })
                              );
                            }}
                          />
                        </View>
                      ) : null}
                      <View
                        style={{
                          flex: 1,
                          paddingHorizontal: CSS.pixel(32),
                          width: "100%",
                          backgroundColor: "#f6f6f6",
                          marginTop: CSS.pixel(100),
                          paddingVertical: CSS.pixel(30)
                        }}
                      >
                        <Text
                          style={{ color: "#333", fontSize: CSS.textSize(24) }}
                        >
                          {/* 自我评价幽默风趣，思维缜密，热爱数学。 */}
                          {this.props.userInfo.content}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <NoDataButton
                      onPress={() => {
                        this.context.navigator.push(
                          navScreen("PushScreen", "自我评价", {
                            passProps: {
                              screen: () => <SelfEvaluationScreen />,
                              fullScreen: true,
                              noScrollView: true,
                              header: {
                                title: "自我评价"
                              }
                            },
                            ...navRightButton("save_evaluationBtn", "保存")
                          })
                        );
                      }}
                      buttonName="添加自我评价"
                      subInfo="几句话概括自己吧，让雇主更加了解你"
                    />
                  )}
                </View>
              </View>
            )}
          </View>
        </ViewShot>
        {/* <ShareButton ref="shareButton" /> */}
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user,
  userPower: getUserPower(state, props),
  courseList: state.userCourseList,
  jobList: state.userSchoolJobList,
  practiceExpList: state.userPracticeExpList,
  awardExpList: state.userAwardExpList,
  certificateList: state.certificateList,
  educationList: state.userEducationList,
  schoolName: getSchoolName(state, props),
  majorName: getMajor(state, props)
}))(TrackRecordScreen);
