import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput
} from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@src/styles";
import { CSS } from "@common/SDCSS";
import ConnectWithActions from "@src/connectWithActions";
import { getUserBaseInfo } from "@src/users/usersSelector";
import SDList from "../common/SDList";
import { navScreen, navLightBox } from "@styles";
import SecretSettingScreen from "../screens/pushScreen/secretSetting/SecretSettingScreen";
import IdentifyManageScreen from "../screens/pushScreen/identifyManage/IdentifyManageScreen";
//我的 - 账号管理
import AccountManageScreen from "@src/screens/pushScreen/accountManage/AccountManageScreen";

import ShareButton from "../sd_shareButton/ShareButton";
import { hidePhone } from "../utils/funcs";
import EditUserBaseInfoScreen from "../screens/pushScreen/editUserBaseInfo/EditUserBaseInfoScreen";
import AppAboutScreen from "../screens/pushScreen/appAbout/AppAboutScreen";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f3f3"
  },
  saveBtnBox: {
    marginTop: CSS.pixel(540, true),
    height: CSS.pixel(80, true),
    width: CSS.pixel(550),
    alignSelf: "center",
    justifyContent: "center",
    paddingLeft: CSS.pixel(20),
    paddingRight: CSS.pixel(20),
    overflow: "hidden"
  }
});

// 我的-设置表单
class UserSettingForm extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };

  checkVerified() {}

  componentDidMount() {
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
    this.checkVerified();
  }

  onNavigatorEvent(event) {
    //console.log("event=======", event);
    if (event.id == "didAppear") {
      this.checkVerified();
    }
  }

  render() {
    const { user } = this.props;
    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: "#f3f3f3" }}>
          <SDList
            listOptions={[
              {
                name: "编辑个人资料",
                direction: ">",
                onPress: () => {
                  this.context.navigator.push(
                    navScreen("PushScreen", "编辑个人资料", {
                      passProps: {
                        screen: () => <EditUserBaseInfoScreen />,
                        fullScreen: true,
                        noScrollView: true,
                        header: {
                          title: "编辑个人资料"
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
                }
              },
              // {
              //   name: "身份管理",
              //   direction: ">",
              //   subInfo: `${user.total ? user.total.school_name : ""} ${
              //     user.total ? user.total.major_name : ""
              //   }`,
              //   subInfoStyle: {
              //     fontSize: 12,
              //     top: 1
              //   },
              //   onPress: () => {
              //     this.context.navigator.push(
              //       navScreen("PushScreen", "身份管理", {
              //         passProps: {
              //           screen: () => <IdentifyManageScreen />,
              //           fullScreen: true,
              //           noScrollView: true,
              //           header: {
              //             title: "身份管理"
              //           }
              //         }
              //       })
              //     );
              //   }
              // },
              {
                name: "账号与安全",
                direction: ">",
                subInfo:
                  user.phone &&
                  typeof user.phone === "string" &&
                  user.phone.length == 11
                    ? hidePhone(user.phone)
                    : "绑定手机号以接收更多消息",
                subInfoStyle: {
                  fontSize: 12,
                  color: sdStyles.SDMainColor,
                  top: 1
                },
                onPress: () => {
                  this.context.navigator.push(
                    //navScreen("AccountManageScreen", "账号管理")
                    navScreen("PushScreen", "账号与安全", {
                      passProps: {
                        screen: () => <AccountManageScreen />,
                        fullScreen: true,
                        noScrollView: true,
                        header: {
                          title: "账号与安全"
                        }
                      }
                    })
                  );
                }
              },
              {
                name: "隐私设置",
                direction: ">",
                onPress: () => {
                  this.context.navigator.push(
                    navScreen("PushScreen", "隐私设置", {
                      passProps: {
                        screen: () => <SecretSettingScreen />,
                        fullScreen: true,
                        noScrollView: true,
                        header: {
                          title: "隐私设置"
                        }
                      }
                    })
                  );
                }
              },
              {
                name: "关于",
                direction: ">",
                bottomBorder: false,
                onPress: () => {
                  this.context.navigator.push(
                    navScreen("PushScreen", "关于", {
                      passProps: {
                        screen: () => <AppAboutScreen />,
                        header: {
                          title: "关于"
                        }
                      }
                    })
                  );
                }
              }
            ]}
          />
        </View>

        <View style={styles.saveBtnBox}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={0.8}
            onPress={() => {
              navLightBox("ExitAppLightBoxScreen");
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: CSS.pixel(80),
                // backgroundColor: "#fed200",
                backgroundColor: "#e1e1e1",
                backgroundColor: "#fc7771"
              }}
            >
              <Text style={{ color: "#fff" }}>退出当前账号</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state)
}))(UserSettingForm);
