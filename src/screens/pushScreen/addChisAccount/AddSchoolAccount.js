import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import { CSS } from "../../../common/SDCSS";
import LabelInput from "../../../common/SDLabelInput";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor, navLightBox, navScreen } from "../../../styles";
import { educationModel } from "../../../types";
import CheckCodeLightBox from "../../../sd_trackRecord/CheckCodeLightBox";
import AddSchoolOk from "./AddSchoolOk";
import connectWithActions from "../../../connectWithActions";
import { Toast } from "antd-mobile";
import { getUserId } from "../../../directSelectors";
import AddAcountOkLightBox from "./AddAcountOkLightBox";

type Props = {
  education: educationModel
};

// 添加教务经历界面
class AddSchoolAccount extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      password: ""
    };
  }
  static contextTypes = {
    navigator: () => null,
    refs: () => null
  };

  componentDidMount() {
    // 模拟弹出验证码
    // setTimeout(() => {
    //   navLightBox("LightBoxScreen", {
    //     passProps: {
    //       screen: () => <CheckCodeLightBox />
    //     }
    //   });
    // }, 2000);
    this.context.refs['_addSchoolAccount'] = this;
  }
  componentWillUnmount() {
    if (this.context.refs['_addSchoolAccount']) {
      delete this.context.refs['_addSchoolAccount'];
    }

    Promise.all([
      this.props.actions.getSchoolAccountAction({ size: 99 }),
      this.props.actions.getEducationAction({
        id: this.props.userId
      })
    ]).then(values => {
      Toast.hide();
    }).catch(err => {});
  }
  onPressBind() {
    // 判断此教育是否已经添加过学信网的账号
    Toast.loading("添加中");
    const account = this.props.userAccount.filter(
      c => c.type == "education" && c.education_id == this.props.education.id
    );
    
    if (account.length > 0) {
      // Toast.fail("你之前已经绑定过学信网账号了")
      // 进行修改操作
      // 判断此学校是否已经对接教务系统了
      this.props.actions
        .checkSyncCourseAction({
          education_id: this.props.education.id
        })
        .then(res2 => {
          this.props.actions
            .updateSchoolAccountAction({
              id: account[0].id,
              type: "education",
              password: this.state.password,
              education_id: this.props.education.id,
              account: this.state.account
            })
            .then(res => {
              Toast.hide();
              if (res2.status == "ok" && res2.results == "support platform") {
                this.context.navigator.push(
                  navScreen("PushScreen", "添加教务系统账号", {
                    passProps: {
                      screen: () => (
                        <AddSchoolOk education={this.props.education} />
                      ),
                      header: {
                        title: "添加教务系统账号"
                      },
                      noScrollView: true,
                      fullScreen: true
                    }
                  })
                );
              } else {
                // 如果是没有支持的学校
                navLightBox("LightBoxScreen", {
                  passProps: {
                    screen: () => <AddAcountOkLightBox />
                  }
                });
              }
            })
            .catch(err => {});
        })
        .catch(err => {});
    } else {
      // 判断此学校是否已经对接教务系统了
      this.props.actions
        .checkSyncCourseAction({
          education_id: this.props.education.id
        })
        .then(res2 => {
          this.props.actions
            .addSchoolAccountAction({
              password: this.state.password,
              type: "education",
              education_id: this.props.education.id,
              account: this.state.account
            })
            .then(res => {
              if (res2.status == "ok" && res2.results == "support platform") {
                Toast.hide();
                this.context.navigator.push(
                  navScreen("PushScreen", "添加教务系统账号", {
                    passProps: {
                      screen: () => (
                        <AddSchoolOk education={this.props.education} />
                      ),
                      header: {
                        title: "添加教务系统账号"
                      },
                      noScrollView: true,
                      fullScreen: true
                    }
                  })
                );
              } else {
                // 如果是没有支持的学校
                navLightBox("LightBoxScreen", {
                  passProps: {
                    screen: () => <AddAcountOkLightBox />
                  }
                });
              }
            })
            .catch(err => {});
        })
        .catch(err => {

        });
    }
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              backgroundColor: "#fff"
            }}
          >
            <View
              style={{ height: CSS.pixel(20), backgroundColor: "#f3f3f3" }}
            />
            <LabelInput
              placeholder="教育经历"
              editable={false}
              disablePress
              direction=">"
              defaultValue={
                this.props.education.school.name +
                " " +
                this.props.education.degree.name +
                " · " +
                this.props.education.major.name
              }
            />
            <LabelInput
              placeholder="学号"
              placeholderRight="请输入在校学号"
              onChange={text => {
                this.setState({
                  account: text
                });
              }}
            />
            <LabelInput
              placeholder="密码"
              placeholderRight="请输入教务系统查询密码"
              onChange={text => {
                this.setState({
                  password: text
                });
              }}
            />
          </View>

          <View
            style={{
              marginTop: CSS.pixel(80),
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <SDTouchOpacity
              disabled={
                this.state.account == "" || this.state.password == ""
                  ? true
                  : false
              }
              style={{
                width: CSS.pixel(550),
                height: CSS.pixel(80),
                borderRadius: CSS.pixel(40),
                backgroundColor:
                  this.state.account == "" || this.state.password == ""
                    ? "#D2D2D2"
                    : SDMainColor,
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={this.onPressBind.bind(this)}
            >
              <Text style={{ fontSize: CSS.textSize(32), color: "#333" }}>
                绑定账号
              </Text>
            </SDTouchOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default connectWithActions((state, props) => ({
  userId: getUserId(state),
  educationList: state.userEducationList,
  userAccount: state.schoolAccount
}))(AddSchoolAccount);
