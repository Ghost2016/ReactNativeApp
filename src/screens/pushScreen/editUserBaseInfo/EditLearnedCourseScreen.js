import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  Image,
  Keyboard,
  RefreshControl
} from "react-native";
import { Modal, Toast } from "antd-mobile";
import PropTypes from "prop-types";
import { navScreen, navRightButton } from "@styles";
import ConnectWithActions from "../../../connectWithActions";
import { UserState, courseModel, educationModel } from "../../../types";
import { navLightBox } from "@styles";
import { isIphoneX } from "../../../utils/iphonex";
import { CSS } from "../../../common/SDCSS";
import SDAccordion from "../../../common/SDAccordion";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor } from "../../../styles";
import EditLearnedCourseItemScreen from "./EditLearnedCourseItemScreen";
import AddLearnedCourseScreen from "./AddLearnedCourseScreen";
import AsyncCourseLightBox from "../../../sd_trackRecord/AsyncCourseLightBox";
import ImportSchoolCourse from "../../../sd_trackRecord/ImportSchoolCourse";
import { AddCourseLightBox } from "./AddCourseLightBox";
import { getCourseType } from "../../../utils/funcs";
// import ConfirmButtonGroup from "../../../sd_updateProfile/form/ConfirmButtonGroup";
import Rec from "reactotron-react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1"
  },
  saveBtnBox: {
    marginTop: 20,
    height: 46,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden"
  }
});

type Props = {
  userInfo: UserState,
  courseList: courseModel[],
  educationList: educationModel[]
};

// 编辑用户学过的课程
class EditLearnedCourseScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      accountRes: [],
      supportEducation: {},
      queryOk: false,
      isRefreshing: false
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  async componentWillMount() {
    // 获取自己的学校账号
    // this.props.actions.getSchoolAccountAction().then(accountRes => {
    //   this.setState({
    //     accountRes: accountRes.results
    //   });
    // });

    try {
      const accountRes = await this.props.actions.getSchoolAccountAction();
      this.state.accountRes = accountRes.results;
    } catch (error) {}

    for (let index = 0; index < this.props.educationList.length; index++) {
      try {
        const element = this.props.educationList[index];
        this.state.supportEducation[element.id] = false;
        const res = await this.props.actions.checkSyncCourseAction({
          education_id: element.id
        });
        if (res.status == "ok" && res.results == "support platform") {
          this.state.supportEducation[element.id] = true;
        }
      } catch (error) {
        // console.warn(error);
      }
    }
    this.setState({
      queryOk: true
    });
  }

  onDelCourseItem(id) {
    navLightBox("ConfirmLightBoxScreen", {
      passProps: {
        title: "你确定要删除此课程？",
        onOk: () => {
          Toast.loading("删除中");
          this.props.actions.delCourseItemAction(
            {
              id: id
            },
            () => {
              Toast.info("删除成功");
            }
          );
        }
      }
    });
  }

  renderSchoolCourse() {
    let arrHtml = [];
    let mapCourse = {};
    this.props.educationList.map(edu => {
      mapCourse[edu.id] = [];
    });
    this.props.courseList.map(item => {
      if (mapCourse[item.education_id]) {
        mapCourse[item.education_id].push(item);
      }
    });
    // let newList = [];
    Object.keys(mapCourse).map(async id => {
      // newList = newList.concat(mapCourse[arr]);
      let tempEdu = this.props.educationList.find(c => c.id == id);
      arrHtml.push(
        <SDAccordion
          open={tempEdu.is_default}
          key={tempEdu.id + ""}
          header={() => (
            <View
              style={{
                height: CSS.pixel(100, true),
                alignItems: "center",
                flex: 1,
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#fed200",
                  overflow: "hidden"
                }}
              />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text numberOfLines={1} style={{ fontSize: 16 }}>
                  {tempEdu.school.name +
                    "   " +
                    tempEdu.degree.name +
                    " · " +
                    tempEdu.major.name}
                </Text>
              </View>
            </View>
          )}
        >
          {mapCourse[id].length <= 0 ? (
            <View
              style={{
                // height: 100,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
                borderBottomColor: "#efefef",
                borderBottomWidth: 1
              }}
            >
              {this.renderSchoolActiveStatusBtn(tempEdu, false)}
            </View>
          ) : (
            <View
              style={{
                backgroundColor: "#fff",
                borderBottomColor: "#efefef",
                borderBottomWidth: 1
              }}
            >
              {this.renderSchoolActiveStatusBtn(tempEdu, true)}
              {mapCourse[id].map((course, index, self) => {
                return this.renderCourse(course, index == self.length - 1);
              })}
            </View>
          )}
        </SDAccordion>
      );
    });

    return arrHtml;
  }

  renderSchoolActiveStatusBtn(edu: educationModel, hasCourse: boolean) {
    if (hasCourse) {
      if (edu.course_status == "new") {
        return (
          <SDTouchOpacity
            style={{
              padding: 15,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "导入成绩", {
                  passProps: {
                    screen: () => (
                      <ImportSchoolCourse checked={true} education={edu} />
                    ),
                    fullScreen: true,
                    noScrollView: true,
                    header: {
                      title: "导入成绩"
                    }
                  }
                })
              );
            }}
          >
            <View
              style={{
                width: CSS.pixel(44),
                height: CSS.pixel(44),
                borderRadius: CSS.pixel(22),
                borderWidth: 1,
                borderColor: SDMainColor,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  margin: 0,
                  padding: 0,
                  color: SDMainColor,
                  fontSize: CSS.textSize(40),
                  top: -1
                }}
              >
                +
              </Text>
            </View>
            <View style={{ marginLeft: CSS.pixel(10) }}>
              <Text style={{ color: SDMainColor, fontSize: CSS.textSize(28) }}>
                添加在校成绩
              </Text>
            </View>
          </SDTouchOpacity>
        );
      } else if (edu.course_status == "doing") {
        return (
          <View
            style={{
              padding: CSS.pixel(40),
              alignContent: "center"
            }}
          >
            <View style={{ marginBottom: CSS.pixel(30) }}>
              <Text
                style={{
                  color: "#333",
                  fontSize: CSS.textSize(36),
                  fontWeight: "600",
                  textAlign: 'center',
                }}
              >
                正在验证中.......
              </Text>
            </View>
            <View>
              <Text
                style={{
                  textAlign: "center",
                  lineHeight: CSS.pixel(30),
                  color: "#999",
                  fontSize: CSS.textSize(24)
                }}
              >
                我们将验证你的教务系统信息，验证成功后将自动导入你的在校成绩。
              </Text>
            </View>
          </View>
        );
      } else if (edu.course_status == "ok") {
        return (
          <View
            style={{
              height: CSS.pixel(160, true),
              justifyContent: "center",
              alignItems: "center",
              borderBottomColor: "#efefef",
              borderBottomWidth: 1
            }}
          >
            <SDTouchOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={() => {
                Toast.loading("请求中");
                this.props.actions.addSyncCourseAction({
                  education_id: edu.id
                }).then(res => {
                  Toast.hide();
                  if (res.status === "ok") {
                    navLightBox("LightBoxScreen", {
                      passProps: {
                        screen: () => (
                          <AsyncCourseLightBox
                            isReFetch={true}
                            education={edu}
                            userId={this.props.userId}
                          />
                        )
                      }
                    });
                  }
                });
              }}
            >
              <Image
                source={require("@img/my/TrackRecord/mine_Resume_ico_Refresh.png")}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: SDMainColor,
                  marginLeft: 5
                }}
              >
                刷新成绩
              </Text>
            </SDTouchOpacity>
            <View style={{ marginTop: CSS.pixel(30) }}>
              <Text style={{ fontSize: 14, color: "#999" }}>
                (导入的课程分数不可修改)
              </Text>
            </View>
          </View>
        );
      } else if (edu.course_status == "error") {
        return (
          <TouchableOpacity
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "导入成绩", {
                  passProps: {
                    screen: () => (
                      <ImportSchoolCourse checked={true} education={edu} />
                    ),
                    fullScreen: true,
                    noScrollView: true,
                    header: {
                      title: "导入成绩"
                    }
                  }
                })
              );
            }}
            style={{
              padding: CSS.pixel(40),
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#999" }}>教务处信息有误,请更正</Text>
          </TouchableOpacity>
        );
      } else if (edu.course_status == "failed") {
        return (
          <TouchableOpacity
            style={{
              padding: CSS.pixel(40),
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => {
              Toast.loading("请求中");
              this.props.actions.addSyncCourseAction({
                education_id: edu.id
              }).then(res => {
                Toast.hide();
                if (res.status === "ok") {
                  navLightBox("LightBoxScreen", {
                    passProps: {
                      screen: () => (
                        <AsyncCourseLightBox
                          isReFetch={true}
                          education={edu}
                          userId={this.props.userId}
                        />
                      )
                    }
                  });
                }
              });
            }}
          >
            <Text style={{ color: "#999" }}>同步课程失败，请重试</Text>
          </TouchableOpacity>
        );
      }
    } else {
      if (edu.course_status == "new") {
        return (
          <SDTouchOpacity
            style={{
              padding: 15,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "导入成绩", {
                  passProps: {
                    screen: () => (
                      <ImportSchoolCourse checked={true} education={edu} />
                    ),
                    fullScreen: true,
                    noScrollView: true,
                    header: {
                      title: "导入成绩"
                    }
                  }
                })
              );
            }}
          >
            <View
              style={{
                width: CSS.pixel(44),
                height: CSS.pixel(44),
                borderRadius: CSS.pixel(22),
                borderWidth: 1,
                borderColor: SDMainColor,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  margin: 0,
                  padding: 0,
                  color: SDMainColor,
                  fontSize: CSS.textSize(40),
                  top: -1
                }}
              >
                +
              </Text>
            </View>
            <View style={{ marginLeft: CSS.pixel(10) }}>
              <Text style={{ color: SDMainColor, fontSize: CSS.textSize(28) }}>
                添加在校成绩
              </Text>
            </View>
          </SDTouchOpacity>
        );
      } else if (edu.course_status == "doing") {
        return (
          <View
            style={{
              padding: CSS.pixel(40),
              alignContent: "center"
            }}
          >
            <View style={{ marginBottom: CSS.pixel(30) }}>
              <Text
                style={{
                  color: "#333",
                  fontSize: CSS.textSize(36),
                  fontWeight: "600",
                  textAlign: 'center'
                }}
              >
                正在验证中.......
              </Text>
            </View>
            <View>
              <Text
                style={{
                  textAlign: "center",
                  lineHeight: CSS.pixel(30),
                  color: "#999",
                  fontSize: CSS.textSize(24)
                }}
              >
                我们将验证你的教务系统信息，验证成功后将自动导入你的在校成绩。
              </Text>
            </View>
          </View>
        );
      } else if (edu.course_status == "ok") {
        return (
          <View
            style={{
              height: CSS.pixel(160, true),
              justifyContent: "center",
              alignItems: "center",
              borderBottomColor: "#efefef",
              borderBottomWidth: 1
            }}
          >
            <SDTouchOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={() => {
                Toast.loading("请求中");
                this.props.actions.addSyncCourseAction({
                  education_id: edu.id
                }).then(res => {
                  Toast.hide();
                  if (res.status === "ok") {
                    navLightBox("LightBoxScreen", {
                      passProps: {
                        screen: () => (
                          <AsyncCourseLightBox
                            isReFetch={true}
                            education={edu}
                            userId={this.props.userId}
                          />
                        )
                      }
                    });
                  }
                }).catch(err => {});
              }}
            >
              <Image
                source={require("@img/my/TrackRecord/mine_Resume_ico_Refresh.png")}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: SDMainColor,
                  marginLeft: 5
                }}
              >
                刷新成绩
              </Text>
            </SDTouchOpacity>
            <View style={{ marginTop: CSS.pixel(30) }}>
              <Text style={{ fontSize: 14, color: "#999" }}>
                (导入的课程分数不可修改)
              </Text>
            </View>
          </View>
        );
      } else if (edu.course_status == "error") {
        return (
          <TouchableOpacity
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "添加在校成绩", {
                  passProps: {
                    screen: () => (
                      <ImportSchoolCourse checked={true} education={edu} />
                    ),
                    fullScreen: true,
                    noScrollView: true,
                    header: {
                      title: "添加课程"
                    }
                  }
                })
              );
            }}
            style={{
              padding: CSS.pixel(40),
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#999" }}>教务处信息有误,请更正</Text>
          </TouchableOpacity>
        );
      } else if (edu.course_status == "failed") {
        return (
          <TouchableOpacity
            onPress={() => {
              Toast.loading("请求中");
              this.props.actions.addSyncCourseAction({
                education_id: edu.id
              }).then(res => {
                Toast.hide();
                if (res.status === "ok") {
                  navLightBox("LightBoxScreen", {
                    passProps: {
                      screen: () => (
                        <AsyncCourseLightBox
                          isReFetch={true}
                          education={edu}
                          userId={this.props.userId}
                        />
                      )
                    }
                  });
                }
              });
            }}
            style={{
              padding: CSS.pixel(40),
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#999" }}>同步课程失败，请重试</Text>
          </TouchableOpacity>
        );
      }
    }
  }

  renderCourse(item: courseModel, isLast = false) {
    // console.warn(item);
    return (
      <View
        key={item.id + ""}
        style={{ flexDirection: "row", paddingTop: CSS.pixel(30, true) }}
      >
        <View style={{ width: 30 }} />
        <View
          style={{
            flex: 1,
            borderBottomColor: "#efefef",
            borderBottomWidth: isLast ? 0 : 1
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 20 }}>
              {item.is_system ? (
                <Image
                  source={require("@img/my/TrackRecord/mine_Resume_ico_YiRenZheng.png")}
                />
              ) : (
                <Image
                  source={require("@img/my/TrackRecord/mine_Resume_ico_WeiRenZheng.png")}
                />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#333", fontSize: 14 }}>
                {item.course_name + ` (${getCourseType(item.course_category)})`}
              </Text>
            </View>

            {/* 导入的课程不允许删除和编辑 */}
            {item.is_system ? null : (
              <View
                style={{
                  width: 130,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.context.navigator.push(
                      navScreen("PushScreen", "编辑所学课程", {
                        passProps: {
                          screen: () => (
                            <EditLearnedCourseItemScreen course={item} />
                          )
                          // course: item
                        },
                        ...navRightButton("save_editCourseItem", "保存")
                      })
                    );
                  }}
                  style={{
                    paddingHorizontal: 5,
                    paddingVertical: 3,
                    width: 40,
                    height: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row"
                  }}
                >
                  <Image
                    source={require("@img/my/TrackRecord/mine_Resume_btn_edit.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 5,
                    paddingVertical: 3,
                    width: 40,
                    height: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row"
                  }}
                  onPress={this.onDelCourseItem.bind(this, item.id)}
                >
                  <Image
                    source={require("@img/my/TrackRecord/mine_Resume_btn_delete.png")}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10
            }}
          >
            <View style={{ width: 20 }} />
            <View>
              <Text style={{ color: "#999", fontSize: 14 }}>考试成绩:</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <View
                style={{
                  backgroundColor: SDMainColor,
                  alignItems: "center",
                  justifyContent: "center",
                  width: CSS.pixel(70),
                  height: CSS.pixel(40)
                }}
              >
                <Text style={{ color: "#333", fontSize: 14 }}>
                  {item.number}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  componentWillUnmount() {
    // 刷新我的数据
    this.props.actions.getUserInfoAction();
  }

  async _onRefresh() {
    // this.forceUpdate();
    this.setState({
      isRefreshing: true
    });
    try {
      const accountRes = await this.props.actions.getSchoolAccountAction();
      this.state.accountRes = accountRes.results;
    } catch (error) {}

    for (let index = 0; index < this.props.educationList.length; index++) {
      try {
        const element = this.props.educationList[index];
        this.state.supportEducation[element.id] = false;
        const res = await this.props.actions.checkSyncCourseAction({
          education_id: element.id
        });
        if (res.status == "ok" && res.results == "support platform") {
          this.state.supportEducation[element.id] = true;
        }
      } catch (error) {}
    }

    this.props.actions
      .getCourseListAction({
        id: this.props.userInfo.id,
        size: 999
      })
      .then(res => {
        Toast.info("刷新成功", 0.2);
        this.setState({
          isRefreshing: false
        });
      });
  }

  render() {
    return (
      <View
        style={{
          height: "100%",
          position: "relative",
          backgroundColor: "#f3f3f3"
        }}
      >
        <View
          style={{
            height: CSS.pixel(20),
            width: "100%",
            backgroundColor: "#f3f3f3"
          }}
        />
        <View style={{ flex: 1 }}>
          {this.state.queryOk ? (
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
            >
              {this.renderSchoolCourse()}
            </ScrollView>
          ) : null}
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user,
  courseList: state.userCourseList,
  educationList: state.userEducationList
}))(EditLearnedCourseScreen);
