import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  Image,
  RefreshControl
} from "react-native";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { navScreen, navRightButton } from "@styles";
import { Toast } from "antd-mobile";
import ConnectWithActions from "../../../connectWithActions";
import { UserState, educationModel } from "../../../types";
import { CSS } from "../../../common/SDCSS";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import EditEducationScreen from "../identifyManage/EditEducationScreen";
import AddEducationScreen from "../identifyManage/AddEducationScreen";
import { SDMainColor } from "../../../styles";
import AddSchoolAccount from "../addChisAccount/AddSchoolAccount";
import AddChisAccount from "../addChisAccount/AddChisAccount";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  },
  saveBtnBox: {
    marginTop: 20,
    marginBottom: 20,
    height: 46,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden"
  }
});

type Props = {
  userInfo: UserState,
  educationList: educationModel[]
};

// 显示用户教育记录
class ShowUserEducationScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false
    }
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentDidMount() {
    Promise.all([
      this.props.actions.getSchoolAccountAction({
        size: 99
      }),
      this.props.actions.getEducationAction({
        id: this.props.userInfo.id
      })
    ]).then(values => {
    }).catch(err => {});

    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "show_add_education_btn"
    );
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "show_add_education_btn") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        this.context.navigator.push(
          navScreen("PushScreen", "添加教育经历", {
            passProps: {
              screen: () => <AddEducationScreen />,
              header: {
                title: "添加教育经历"
              }
            },
            ...navRightButton("save_addEducation", "保存")
          })
        );
      }
    }
  }

  _onRefresh() {
    this.setState({
      isRefreshing: true
    })
    Promise.all([
      this.props.actions.getSchoolAccountAction({
        size: 99
      }),
      this.props.actions.getEducationAction({
        id: this.props.userInfo.id
      })
    ]).then(values => {
      this.setState({
        isRefreshing: false
      })
    }).catch(err => {

    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}
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
          <View style={{ marginTop: CSS.pixel(20) }} />
          {this.props.educationList.map((item, index, self) => {
            return (
              <View
                key={item.id + ""}
                style={{
                  height: CSS.pixel(204),
                  marginTop: index > 0 ? CSS.pixel(20) : 0,
                  padding: CSS.pixel(30),
                  backgroundColor: "#fff"
                }}
              >
                <View
                  style={{
                    height: CSS.pixel(44),
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <Text
                      style={{
                        color: "#333",
                        fontSize: CSS.textSize(24)
                      }}
                    >
                      {item.start_date.slice(0, 7).replace(/-/, ".") +
                        "-" +
                        item.end_date.slice(0, 7).replace(/-/, ".")}
                    </Text>

                    {/* {item.isChecked && ( */}
                    {item.edu_status == "ok" && (
                      <Image
                        style={{ marginLeft: CSS.pixel(CSS.pixel(10)) }}
                        source={require("@img/mine_Resume_Authentication1.png")}
                      />
                    )}

                    {item.edu_status == "doing" && (
                      <Text
                        style={{ marginLeft: CSS.pixel(10), color: "#fc8924", fontSize: CSS.textSize(24) }}
                      >
                        认证中...
                      </Text>
                    )}

                    {/* {item.edu_status == "failed" && (
                      <Text
                        style={{ marginLeft: CSS.pixel(10), color: "#fc8924", fontSize: CSS.textSize(24) }}
                      >
                        认证失败
                      </Text>
                    )} */}

                    {/* {item.edu_status == "error" && (
                      <Text
                        style={{ marginLeft: CSS.pixel(10), color: "#fc8924", fontSize: CSS.textSize(24) }}
                      >
                        认证填写信息错误
                      </Text>
                    )} */}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    {/* {!item.isChecked && ( */}
                    {(item.edu_status == "failed" ||
                      item.edu_status == "new" ||
                      item.edu_status == "error") && (
                      <SDTouchOpacity
                        onPress={() => {
                          if (item.edu_status == "failed") {
                            Toast.loading("再次认证中");
                            this.props.actions
                              .updateAuthAccountAction({
                                id: this.props.userAccount.filter(c => c.type == 'chsi')[0].id,
                                type: "chsi",
                                education_id: item.id
                              })
                              .then(res => {
                                Promise.all([
                                  this.props.actions.getSchoolAccountAction({
                                    size: 99
                                  }),
                                  this.props.actions.getEducationAction({
                                    id: this.props.userInfo.id
                                  })
                                ]).then(values => {
                                  Toast.hide();
                                });
                              })
                              .catch(err => {});
                          } else if (item.edu_status == "new") {
                            this.context.navigator.push(
                              navScreen("PushScreen", "认证教育经历", {
                                passProps: {
                                  screen: () => (
                                    <AddChisAccount education={item} />
                                  ),
                                  fullScreen: true,
                                  noScrollView: true,
                                  header: {
                                    title: "认证教育经历"
                                  }
                                }
                              })
                            );
                          } else if (item.edu_status == "error") {
                            this.context.navigator.push(
                              navScreen("PushScreen", "认证教育经历", {
                                passProps: {
                                  screen: () => (
                                    <AddChisAccount update education={item} accountId={this.props.userAccount.filter(c => c.type == 'chsi')[0].id}/>
                                  ),
                                  fullScreen: true,
                                  noScrollView: true,
                                  header: {
                                    title: "认证教育经历"
                                  }
                                }
                              })
                            );
                          }
                        }}
                      >
                        <Image
                          style={{
                            width: CSS.pixel(100),
                            height: CSS.pixel(42)
                          }}
                          resizeMode="stretch"
                          source={require("@img/my/TrackRecord/mine_Resume_btn_Authentication.png")}
                        />
                      </SDTouchOpacity>
                    )}

                    <SDTouchOpacity
                      style={{ marginLeft: CSS.pixel(20) }}
                      onPress={() => {
                        this.context.navigator.push(
                          navScreen("PushScreen", "编辑教育经历", {
                            passProps: {
                              screen: () => (
                                <EditEducationScreen education={item} />
                              ),
                              fullScreen: true,
                              noScrollView: true,
                              header: {
                                title: "编辑教育经历"
                              }
                            },
                            ...navRightButton("save_editEducation", "保存")
                          })
                        );
                      }}
                    >
                      <Image
                        resizeMode="stretch"
                        source={require("@img/my/TrackRecord/mine_Resume_btn_edit.png")}
                      />
                    </SDTouchOpacity>
                  </View>
                </View>

                <View style={{ marginTop: CSS.pixel(15) }}>
                  <Text style={{ fontSize: CSS.textSize(28), color: "#333" }}>
                    {item.school.name + "   " + item.college.name}
                  </Text>
                </View>

                <View style={{ marginTop: CSS.pixel(24) }}>
                  <Text style={{ fontSize: CSS.textSize(28), color: "#333" }}>
                    {item.degree.name +
                      " · " +
                      item.major.name +
                      " " +
                      `(${item.is_full_time ? "全日制" : "非全日制"})`}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        {/* <SDTouchOpacity
          style={{
            height: CSS.pixel(80),
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: SDMainColor
          }}
          onPress={() => {
            this.context.navigator.push(
              navScreen("PushScreen", "添加教育经历", {
                passProps: {
                  screen: () => <AddEducationScreen />,
                  header: {
                    title: "添加教育经历"
                  }
                },
                ...navRightButton("save_addEducation", "保存")
              })
            );
          }}
        >
          <Text style={{ fontSize: CSS.pixel(32), color: "#333" }}>
            + 添加教育经历
          </Text>
        </SDTouchOpacity> */}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user,
  educationList: state.userEducationList,
  userAccount: state.schoolAccount
}))(ShowUserEducationScreen);
