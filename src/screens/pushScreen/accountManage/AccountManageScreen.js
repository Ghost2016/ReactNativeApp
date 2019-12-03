import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
  Image,
  RefreshControl
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import * as sdStyles from "@styles";
import * as WeChat from "react-native-wechat";
import { CSS } from "@common/SDCSS";
import { Toast } from "antd-mobile";
import { getUserBaseInfo } from "@src/users/usersSelector";
import defaultStyle, { navScreen } from "@styles";
import SDList from "../../../common/SDList";
import config from "../../../config";
import { hidePhone, getEducationStatusName } from "../../../utils/funcs";

//我的 - 添加手机号
import AddTelPhoneScreen from "@src/screens/pushScreen/addTelPhone/AddTelPhoneScreen";
//我的 - 手机号码
import PhoneManageScreen from "@src/screens/pushScreen/accountManage/PhoneManageScreen";
import AddChisAccount from "../addChisAccount/AddChisAccount";
import ImportSchoolCourse from "../../../sd_trackRecord/ImportSchoolCourse";
import ShowEducationAccount from "../../../sd_trackRecord/ShowEducationAccount";
import { SDMainColor } from "../../../styles";
import AddSchoolAccount from "../addChisAccount/AddSchoolAccount";
import LabelInput from "../../../common/SDLabelInput";
import SDTouchOpacity from "../../../common/SDTouchOpacity";

const iconRightArrowDark = require("@img/my/PersonMainTop/mine_btn_list_black.png");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  },
  footter: {
    height: 60
  },
  saveBtnBox: {
    marginTop: 20,
    height: 46,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden"
  }
});

// 我的-账号管理
class AccountManageScreen extends React.PureComponent {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false
    };
  }

  componentDidMount() {
    Toast.loading("加载中");
    Promise.all([
      this.props.actions.getSchoolAccountAction({ size: 99 }),
      this.props.actions.getEducationAction({
        id: this.props.user.id
      })
    ])
      .then(values => {
        Toast.hide();
      })
      .catch(err => {});
  }

  onPressSetPwd() {
    // this.goToScreen("example.SetPasswordScreen", "设置密码");
    this.context.navigator.push(navScreen("SetPasswordScreen", "设置密码"));
  }

  onPressChangePhone() {
    // this.goToScreen("example.ChangePhoneScreen");
    this.context.navigator.push(navScreen("ChangePhoneScreen", "修改手机"));
  }

  bindWechat(isBindWechat) {
    if (isBindWechat) {
      Toast.info("您已经绑定了微信", 0.2);
      return;
    }
    Alert.alert(
      "",
      "“职么开门”想要打开“微信”进行绑定授权",
      [
        {
          text: "取消",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "打开",
          onPress: async () => {
            // await WeChat.openWXApp();
            WeChat.isWXAppInstalled().then(isInstalled => {
              if (isInstalled) {
                //发送授权请求
                WeChat.sendAuthRequest(
                  config.wxScope,
                  config.wxState + config.wxState
                )
                  .then(responseCode => {
                    this.props.actions
                      .bindWeChatAction({
                        code: responseCode.code
                      })
                      .then(res => {
                        if (res.status == "ok") {
                          // 重新获取用户信息
                          Toast.info("绑定成功");
                          this.props.actions.getUserInfoAction();
                        } else {
                          Toast.fail(res.msg || "请求发生错误");
                        }
                      });
                  })
                  .catch(err => {
                    Toast.fail("授权发生错误：" + JSON.stringify(err));
                  });
              } else {
                Toast.fail("你没有安装微信");
              }
            });
          }
        }
      ],
      { cancelable: false }
    );
  }

  _onRefresh() {
    this.setState({
      isRefreshing: true
    });
    Promise.all([
      this.props.actions.getSchoolAccountAction({
        size: 99
      }),
      this.props.actions.getEducationAction({
        id: this.props.user.id
      })
    ])
      .then(values => {
        this.setState({
          isRefreshing: false
        });
      })
      .catch(err => {});
  }

  render() {
    const { user } = this.props;

    // 判断当前默认教育经历
    const defaultEdus = this.props.educationList.filter(
      c => c.is_default == true
    );
    let defaultEdu = null;
    let accountChsi = null;
    let accountEdu = null;
    if (defaultEdus.length > 0) {
      defaultEdu = defaultEdus[0];
      accountChsi = this.props.userAccount.filter(
        c => c.type == "chsi" && c.education_id == defaultEdu.id
      );
      accountEdu = this.props.userAccount.filter(
        c => c.type == "education" && c.education_id == defaultEdu.id
      );
      if (accountChsi.length <= 0) {
        accountChsi = null;
      } else {
        accountChsi = accountChsi[0];
      }

      if (accountEdu.length <= 0) {
        accountEdu = null;
      } else {
        accountEdu = accountEdu[0];
      }
    }

    // console.warn(accountChsi, accountEdu)

    return (
      <ScrollView
        style={styles.container}
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
        <View
          style={{
            height: 36,
            paddingLeft: 10,
            paddingBottom: 5,
            justifyContent: "flex-end"
          }}
        >
          <Text style={{ color: "#999", fontSize: CSS.pixel(24) }}>手机号</Text>
        </View>
        <SDList
          listOptions={[
            {
              name: "手机号码",
              direction: ">",
              subInfo:
                user.phone &&
                typeof user.phone === "string" &&
                user.phone.length == 11
                  ? hidePhone(user.phone)
                  : "绑定手机号以接收更多消息",
              subInfoStyle: {
                color: user.phone ? sdStyles.SDFontColorMinor : "#FE8900"
              },
              bottomBorder: false,
              onPress: () => {
                if (user.phone) {
                  this.context.navigator.push(
                    //navScreen("PhoneManageScreen", "手机号码")
                    navScreen("PushScreen", "手机号码", {
                      passProps: {
                        screen: () => <PhoneManageScreen />,
                        fullScreen: true,
                        noScrollView: true,
                        header: {
                          title: "手机号码"
                          //fixed: true,
                        }
                      }
                      //...navRightButton("save_addLearnedCourseBtn", "保存"),
                    })
                  );
                } else {
                  this.context.navigator.push(
                    //navScreen("AddTelPhoneScreen", "添加手机号")
                    navScreen("PushScreen", "添加手机号", {
                      passProps: {
                        screen: () => <AddTelPhoneScreen />,
                        fullScreen: true,
                        noScrollView: true,
                        header: {
                          title: "添加手机号"
                          //fixed: true,
                        }
                      }
                      //...navRightButton("save_addLearnedCourseBtn", "保存"),
                    })
                  );
                }
              }
            }
          ]}
        />
        <View
          style={{
            height: 36,
            paddingLeft: 10,
            paddingBottom: 5,
            justifyContent: "flex-end"
          }}
        >
          <Text style={{ color: "#999", fontSize: CSS.pixel(24) }}>
            第三方账号
          </Text>
        </View>

        <SDTouchOpacity
          style={{
            height: CSS.pixel(110, true),
            flexDirection: "row",
            paddingLeft: CSS.pixel(30),
            paddingRight: CSS.pixel(30),
            backgroundColor: "#fff"
          }}
          onPress={() => {
            this.bindWechat(user.isBindWechat);
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <Text style={{ fontSize: CSS.textSize(30), color: "#333" }}>
              微信
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            {!user.isBindWechat && (
              <Text style={{ fontSize: CSS.textSize(30), color: "#999" }}>
                未绑定
              </Text>
            )}
            {!user.isBindWechat && (
              <Image
                style={{ marginLeft: CSS.pixel(30) }}
                source={iconRightArrowDark}
              />
            )}

            {user.isBindWechat && (
              <View
                style={{
                  width: CSS.pixel(60),
                  height: CSS.pixel(60),
                  borderRadius: CSS.pixel(30),
                  overflow: "hidden"
                }}
              >
                <Image
                  style={{ width: CSS.pixel(60), height: CSS.pixel(60) }}
                  source={{
                    uri:
                      user.wechatInfo.head_image_url + "?ImageView2/w/120/h/120"
                  }}
                />
              </View>
            )}

            {user.isBindWechat && (
              <Text
                style={{
                  fontSize: CSS.textSize(30),
                  color: "#333",
                  marginLeft: CSS.pixel(20)
                }}
              >
                {user.wechatInfo.nickname}
              </Text>
            )}
          </View>
        </SDTouchOpacity>
        <View style={{ height: 1, backgroundColor: "#f3f3f3" }} />

        {/* 判断是否有教务系统账号 */}
        {this.props.userAccount.length >= 0 && this.props.userAccount.some(c => c.name != null && c.type == "education") ? (
          <View
            style={{
              backgroundColor: "#fff"
            }}
          >
            <View
              style={{
                height: CSS.pixel(70, true),
                paddingHorizontal: CSS.pixel(30),
                flexDirection: "row",
                alignItems: "flex-end"
              }}
            >
              <View>
                <Text style={{ fontSize: CSS.textSize(30), color: "#333" }}>
                  教务系统
                </Text>
              </View>
            </View>

            <View>
              {/* 展示教务系统绑定记录 */}
              {this.props.userAccount.map(c => {
                // 如果是已经对接成功了
                if (c.name && c.name != "" && c.type == 'education') {
                  return (
                    <View key={c.id + ""}>
                      <View
                        style={{
                          height: CSS.pixel(110, true),
                          flexDirection: "row",
                          alignItems: "center",
                          paddingLeft: CSS.pixel(50),
                          paddingRight: CSS.pixel(30)
                        }}
                      >
                        <View>
                          <Text
                            numberOfLines={1}
                            style={{
                              color: "#333",
                              fontSize: CSS.textSize(30)
                            }}
                          >
                            {/* {c.education_name} */}
                            {this.props.educationList.filter(d => d.id == c.education_id)[0].school.name + "   " 
                            + this.props.educationList.filter(d => d.id == c.education_id)[0].degree.name + " · " 
                            + this.props.educationList.filter(d => d.id == c.education_id)[0].major.name}
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center"
                          }}
                        >
                          <Text style={{ color: "#333", textAlign: "right" }}>
                            已绑定
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          width: "100%",
                          height: 1,
                          backgroundColor: "#f3f3f3"
                        }}
                      />
                    </View>
                  );
                }
                return null;
              })}
            </View>
          </View>
        ) : null}

        {/* {this.props.user.isVerified && ( */}
        {this.props.userAccount.length >= 0 && this.props.userAccount.some(c => c.name != null && c.type == "chsi") ? 
          (<View style={{
            height: CSS.pixel(110, true),
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: CSS.pixel(30),
            backgroundColor: '#fff'
          }}>
            <View>
              <Text
                style={{
                  color: "#333",
                  fontSize: CSS.textSize(30)
                }}
              >
                学信网
              </Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{textAlign: 'right', fontSize: CSS.textSize(30), color: '#333'}}>已绑定</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state, props),
  educationList: state.userEducationList,
  userAccount: state.schoolAccount
}))(AccountManageScreen);
