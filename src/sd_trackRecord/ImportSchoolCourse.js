/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  Keyboard
} from "react-native";
import PropTypes from "prop-types";
import { Toast } from "antd-mobile";
import ConnectWithActions from "../connectWithActions";
import { CSS } from "../common/SDCSS";
import {
  dismissLightBox,
  navScreen,
  navLightBox,
  navRightButton
} from "../styles";
import { CourseItem } from "./LearnCourse";
import SDList from "../common/SDList";
import QuerySchoolCourseResult from "./QuerySchoolCourseResult";
import LabelInput from "../common/SDLabelInput";
import CheckCodeLightBox from "./CheckCodeLightBox";
import { educationModel, SchoolAccountModel } from "../types";
import AddLearnedCourseScreen from "../screens/pushScreen/editUserBaseInfo/AddLearnedCourseScreen";
import SDTouchOpacity from "../common/SDTouchOpacity";
import connectWithActions from "../connectWithActions";
import AsyncCourseLightBox from "./AsyncCourseLightBox";
import { getUserId } from "../directSelectors";
import AddAcountOkLightBox from "../screens/pushScreen/addChisAccount/AddAcountOkLightBox";

const styles = StyleSheet.create({});

type Props = {
  checked: ?boolean,
  education: educationModel,
  schoolAccount: SchoolAccountModel[]
};

// 我的履历 - 提示可以导入学校成绩的弹窗
class ImportSchoolCourse extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      hasChecked: this.props.checked ? this.props.checked : false, // 是否此学校已经对接过来教务系统
      userCode: "",
      userPass: "",
      schoolAccount: [], // 学校账号
      isSupport: false
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  changeBtnStatus(text, flag) {
    if (flag == "学号") {
      this.setState({
        userCode: text
      });
    } else if (flag == "密码") {
      this.setState({
        userPass: text
      });
    }
  }
  componentDidMount() {
    // 模拟弹出验证码
    // setTimeout(() => {
    //   navLightBox("LightBoxScreen", {
    //     passProps: {
    //       screen: () => <CheckCodeLightBox />
    //     }
    //   });
    // }, 2000);
    this.context.refs["_importSchoolCourse"] = this;

    // 判断是否此学校已经有了教务系统的对接
    this.props.actions.checkSyncCourseAction(
      {
        education_id: this.props.education.id
      },
      res => {
        if (res.status == "ok" && res.results == "support platform") {
          this.state.isSupport = true;
        } else {
          this.state.isSupport = false;
        }
      }
    ).then(res => {}).catch(err => {})
  }

  componentWillUnmount() {
    if (this.context.refs["_importSchoolCourse"]) {
      delete this.context.refs["_importSchoolCourse"];
    }

    Promise.all([
      this.props.actions.getSchoolAccountAction({ size: 99 }),
      this.props.actions.getEducationAction({
        id: this.props.userId
      })
    ]).then(values => {}).catch(err => {});
  }

  exit() {
    this.context.navigator.pop();
  }

  onPressQuerySchool() {
    // todo
    // 查询是否之前有过此学校的账号了
    // console.warn(2)
    Toast.loading("请求中");
    // console.log(this.props.education.id)
    // return;
    let account = this.props.schoolAccount.find(
      c => c.education_id == this.props.education.id && c.type == 'education'
    );
    // console.log(account);
    if (account) {
      // 如果有
      // 则使用修改接口
      this.props.actions
        .updateSchoolAccountAction({
          id: account.id,
          type: "education",
          password: this.state.userPass,
          education_id: this.props.education.id,
          account: this.state.userCode
        })
        .then(res => {
          // 重新获取学生账号
          this.props.actions.getSchoolAccountAction();
          // 调用同步接口
          if (res && res.status == "ok") {
            if (this.state.isSupport) {
              // 如果是已经支持的教务系统 才进行调用同步课程接口
              this.props.actions.addSyncCourseAction({
                education_id: this.props.education.id,
              }).then(res => {
                Toast.hide();
                Keyboard.dismiss();
                if (res && res.status === "ok") {
                  navLightBox("LightBoxScreen", {
                    passProps: {
                      screen: () => (
                        <AsyncCourseLightBox
                          education={this.props.education}
                          userId={this.props.userId}
                        />
                      )
                    }
                  });
                  this.setState({
                    userCode: "",
                    userPass: ""
                  });
                  this.refs["_codeInput"].setState({
                    value: ""
                  });
                  this.refs["_passInput"].setState({
                    value: ""
                  });
                }
              });
            } else {
              // 如果是没有支持的学校
              navLightBox("LightBoxScreen", {
                passProps: {
                  screen: () => <AddAcountOkLightBox />
                }
              });
            }
          }
        });
    } else {
      this.props.actions
        .addSchoolAccountAction({
          password: this.state.userPass,
          education_id: this.props.education.id,
          type: "education",
          account: this.state.userCode
        })
        .then(res => {
          // 重新获取学生账号
          this.props.actions.getSchoolAccountAction();
          // 调用同步接口
          Toast.hide();
          if (res && res.status == "ok") {
            Keyboard.dismiss();
            if (this.state.isSupport) {
              // 如果是已经支持的教务系统 才进行调用同步课程接口
              this.props.actions.addSyncCourseAction({
                education_id: this.props.education.id,
              }).then(res => {
                if (res && res.status === "ok") {
                  navLightBox("LightBoxScreen", {
                    passProps: {
                      screen: () => (
                        <AsyncCourseLightBox
                          education={this.props.education}
                          userId={this.props.userId}
                        />
                      )
                    }
                  });
                  this.setState({
                    userCode: "",
                    userPass: ""
                  });
                  this.refs["_codeInput"].setState({
                    value: ""
                  });
                  this.refs["_passInput"].setState({
                    value: ""
                  });
                }
              });
            } else {
              // 如果是没有支持的学校
              navLightBox("LightBoxScreen", {
                passProps: {
                  screen: () => <AddAcountOkLightBox />
                }
              });
            }
          }
        });
    }
  }

  render() {
    return (
      <ScrollView style={{ backgroundColor: "#f3f3f3" }}>
        <View
          style={{
            height: Dimensions.get("window").height - 60,
            backgroundColor: "#f3f3f3",
            position: "relative"
          }}
        >
          <View style={{ height: CSS.pixel(20), backgroundColor: "#f3f3f3" }} />
          {this.state.hasChecked ? (
            <View style={{ backgroundColor: "#fff" }}>
              <LabelInput
                placeholder="教育经历"
                defaultValue={`${this.props.education.school.name} ${
                  this.props.education.degree.name
                }·${this.props.education.major.name}`}
                editable={false}
                _placeholderRight="选择教育经历"
              />

              <LabelInput
                ref="_codeInput"
                onChange={text => {
                  this.changeBtnStatus(text, "学号");
                }}
                placeholder="学号"
                placeholderRight={"输入在校学号"}
              />
              <LabelInput
                ref="_passInput"
                onChange={text => {
                  this.changeBtnStatus(text, "密码");
                }}
                placeholder="密码"
                placeholderRight={"输入校教务系统查询密码"}
                isPassword={true}
              />
            </View>
          ) : (
            <View>
              <LabelInput
                style={{ backgroundColor: "#fff" }}
                placeholder="教育经历"
                direction=">"
                defaultValue={
                  this.props.education
                    ? `${this.props.education.school.name} ${
                        this.props.education.degree.name
                      }·${this.props.education.major.name}`
                    : ""
                }
                editable={false}
                _placeholderRight="选择教育经历"
              />

              <View
                style={{
                  height: CSS.pixel(140, true),
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f3f3f3",
                  marginTop: CSS.pixel(60, true)
                }}
              >
                <Text style={{ fontSize: 12, color: "#ccc" }}>
                  抱歉，暂未对接该学校教务系统，请先自主添加课程成绩
                </Text>
              </View>
            </View>
          )}

          {this.state.hasChecked ? (
            <View
              style={{
                marginTop: CSS.pixel(80, true),
                height: CSS.pixel(90, true),
                width: CSS.pixel(600),
                paddingLeft: 20,
                paddingRight: 20,
                overflow: "hidden",
                alignSelf: "center"
              }}
            >
              <SDTouchOpacity
                disabled={
                  this.state.userCode == "" || this.state.userPass == ""
                    ? true
                    : false
                }
                style={{ flex: 1 }}
                activeOpacity={0.8}
                onPress={this.onPressQuerySchool.bind(this)}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 26,
                    backgroundColor:
                      this.state.userCode == "" || this.state.userPass == ""
                        ? "#e1e1e1"
                        : "#fed200"
                  }}
                >
                  <Text style={{ color: "#333", fontSize: 16 }}>导入成绩</Text>
                </View>
              </SDTouchOpacity>
            </View>
          ) : (
            <View
              style={{
                marginTop: CSS.pixel(80, true),
                height: CSS.pixel(90, true),
                width: CSS.pixel(600),
                paddingLeft: 20,
                paddingRight: 20,
                overflow: "hidden",
                alignSelf: "center"
              }}
            >
              <SDTouchOpacity
                style={{ flex: 1 }}
                activeOpacity={0.8}
                onPress={() => {
                  this.context.navigator.push(
                    navScreen("PushScreen", "添加所学课程", {
                      passProps: {
                        screen: () => (
                          <AddLearnedCourseScreen
                            selectEducation={this.props.education}
                          />
                        )
                      },
                      ...navRightButton("save_addLearnedCourseBtn", "保存")
                    })
                  );
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 26,
                    backgroundColor: "#fed200"
                    // backgroundColor: "#e1e1e1"
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 16 }}>添加成绩</Text>
                </View>
              </SDTouchOpacity>
            </View>
          )}

          {this.state.hasChecked ? null : (
            <View
              style={{
                padding: CSS.pixel(30),
                position: "absolute",
                bottom: 0,
                left: 0
              }}
            >
              <Text style={{ fontSize: 12, color: "#fa8a24", lineHeight: 26 }}>
                温馨提示：填写虚假成绩会被列入黑名单，请确保所填信息的真实性。待与该学校教务系统对接后，系统内的课程成绩将会覆盖自主填写的内容
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

export default connectWithActions(state => ({
  schoolAccount: state.schoolAccount,
  userId: getUserId(state)
}))(ImportSchoolCourse);
