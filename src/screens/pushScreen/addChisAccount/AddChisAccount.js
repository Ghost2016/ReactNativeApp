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
import { SDMainColor, navScreen } from "../../../styles";
import AddChisOk from "./AddChisOk";
import { Toast } from "antd-mobile";
import connectWithActions from "../../../connectWithActions";
import { getUserId } from "../../../directSelectors";

// 添加证书界面
class AddChisAccount extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      password: "",
      accountData: []
    };
  }
  static contextTypes = {
    navigator: () => null,
    refs: () => null
  };

  componentWillMount() {
    // 获取自己的学校账号
    this.props.actions.getSchoolAccountAction({ size: 99 }).then(res => {
      this.state.accountData = res.results;
    });

    // 获取自己的教育经历
    this.props.actions.getEducationAction({
      id: this.props.userId
    });
  }

  componentWillUnmount() {
    Promise.all([
      this.props.actions.getSchoolAccountAction({
        size: 99
      }),
      this.props.actions.getEducationAction({
        id: this.props.userId
      })
    ]).then(values => {
      Toast.hide();
    }).catch(err => {});
  }

  onPressBind() {
    // 判断是新增还是修改账号

    if (this.props.update) {
      this.props.actions
        .updateSchoolAccountAction({
          id: this.props.accountId,
          type: "chsi",
          password: this.state.password,
          education_id: this.props.education.id,
          account: this.state.account
        })
        .then(res => {
          Toast.hide();
          this.context.navigator.push(
            navScreen("PushScreen", "添加学信网账号", {
              passProps: {
                screen: () => <AddChisOk />,
                header: {
                  title: "添加学信网账号"
                },
                noScrollView: true,
                fullScreen: true
              }
            })
          );
        })
        .catch(err => {});
    } else {
      this.props.actions
        .addSchoolAccountAction({
          password: this.state.password,
          type: "chsi",
          education_id: this.props.education.id,
          account: this.state.account
        })
        .then(res => {
          Toast.hide();
          this.context.navigator.push(
            navScreen("PushScreen", "添加学信网账号", {
              passProps: {
                screen: () => <AddChisOk />,
                header: {
                  title: "添加学信网账号"
                },
                noScrollView: true,
                fullScreen: true
              }
            })
          );
        })
        .catch(err => {});
    }

    // // 判断是否已经添加过学信网的账号
    // Toast.loading("添加中");
    // // 获取自己的默认教育经历id
    // const defaultId = this.props.educationList.filter(c => c.is_default == true)[0].id;
    // const account = this.state.accountData.filter(c => c.type == 'chsi' && c.education_id == defaultId);
    // if (account.length > 0) {
    //   // Toast.fail("你之前已经绑定过学信网账号了")
    //   // 进行修改操作
    //   this.props.actions.updateSchoolAccountAction({
    //     id: account[0].id,
    //     type: "chsi",
    //     password: this.state.password,
    //     education_id: defaultId,
    //     account: this.state.account
    //   }).then(res => {
    //     Toast.hide();
    //     this.context.navigator.push(
    //       navScreen("PushScreen", "添加学信网账号", {
    //         passProps: {
    //           screen: () => <AddChisOk />,
    //           header: {
    //             title: "添加学信网账号"
    //           },
    //           noScrollView: true,
    //           fullScreen: true
    //         }
    //       })
    //     );
    //   }).catch(err => {})

    // } else {
    //   this.props.actions.addSchoolAccountAction({
    //     password: this.state.password,
    //     type: "chsi",
    //     education_id: defaultId,
    //     account: this.state.account
    //   }).then((res) => {
    //     Toast.hide();
    //     this.context.navigator.push(
    //       navScreen("PushScreen", "添加学信网账号", {
    //         passProps: {
    //           screen: () => <AddChisOk />,
    //           header: {
    //             title: "添加学信网账号"
    //           },
    //           noScrollView: true,
    //           fullScreen: true
    //         }
    //       })
    //     );
    //   }).catch(err => {})
    // }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
        <View
          style={{
            height: CSS.pixel(90),
            justifyContent: "center",
            backgroundColor: "#fff",
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: CSS.pixel(28), color: "#999" }}>
            绑定学信网账号认证教育经历
          </Text>
        </View>
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              marginTop: CSS.pixel(30),
              backgroundColor: "#fff"
            }}
          >
            <LabelInput
              placeholder="账号"
              placeholderRight="请输入学信网账号"
              onChange={text => {
                this.setState({
                  account: text
                });
              }}
            />
            <LabelInput
              placeholder="密码"
              placeholderRight="请输入学信网密码"
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
                认证
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
  educationList: state.userEducationList
}))(AddChisAccount);
