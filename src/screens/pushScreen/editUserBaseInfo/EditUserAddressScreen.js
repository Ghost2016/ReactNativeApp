import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { Toast } from "antd-mobile";
import { navScreen, navRightButton } from "@styles";
import ConnectWithActions from "../../../connectWithActions";
import SDList from "../../../common/SDList";
import { UserState, LocalModel } from "../../../types";
import { SDMainColor } from "../../../styles";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { CSS } from "../../../common/SDCSS";
const iconRightArrowDark = require("@img/my/PersonMainTop/mine_btn_list_black.png");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1"
  }
});

type Props = {
  userInfo: UserState,
  location: LocalModel
};

// 编辑用户所在地区
class EditUserAddressScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      city: ""
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
      "save_userAddress"
    );

    this.context.refs["_editUserAddressScreen"] = this;

    this.state.city =
      this.props.location &&
      this.props.location.province &&
      this.props.location.city
        ? this.props.location.city
        : "";
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_userAddress") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        if (
          this.props.location &&
          this.props.location.province &&
          this.props.location.city
        ) {
          Toast.loading("保存中");
          this.props.actions.updateBaseInfoAction(
            {
              city_name: this.props.location.city,
              province_name: this.props.location.province
            },
            res => {
              Toast.info("保存成功");
              this.context.navigator.pop();
            }
          );
        } else {
          Toast.fail("定位信息获取不到，请检查是否开启了定位权限");
        }
      }
    }
  }

  componentWillUnmount() {
    // 判断是否在选择完善注册
    if (this.context.refs["_schoolCard"]) {
      if (this.state.city !== "") {
        this.context.refs["_schoolCard"].fetchSuggestSchool(this.state.city);
      }
    }

    if (this.context.refs["_editUserAddressScreen"]) {
      delete this.context.refs["_editUserAddressScreen"];
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View>
          <View style={{ paddingHorizontal: CSS.pixel(30), marginTop: 20 }}>
            <Text style={{ color: "#999", fontSize: 12 }}>定位到的位置</Text>
          </View>

          <SDTouchOpacity
            style={{
              marginTop: 5,
              justifyContent: "center",
              backgroundColor: "#fff",
              height: 60,
              paddingHorizontal: CSS.pixel(30),
              flexDirection: "row"
            }}
            onPress={() => {
              this.context.navigator.push(
                navScreen(
                  "EditUserProvinceScreen",
                  "地区",
                  // navRightButton("save_editProvince", "保存")
                  {
                    navigatorStyle: this.context.refs["regis_Screen"]
                      ? {
                          //android 透明statusbar
                          // navBarHidden: true,
                          statusBarColor: "transparent",
                          statusBarHidden: true,

                          navBarTextColor: "#fff",
                          navBarButtonColor: "#fff",
                          navBarBackgroundColor: SDMainColor,
                          navBarTitleTextCentered: true,
                          navBarSubTitleTextCentered: true,
                          topBarElevationShadowEnabled: false,
                          statusBarTextColorScheme: "light"
                        }
                      : {
                          navBarTextColor: "#fff",
                          navBarButtonColor: "#fff",
                          navBarBackgroundColor: SDMainColor,
                          navBarTitleTextCentered: true,
                          navBarSubTitleTextCentered: true,
                          topBarElevationShadowEnabled: false,
                          statusBarTextColorScheme: "light"
                        }
                  }
                )
              );
            }}
          >
            {/* <Text style={{ color: "#333", fontSize: 16 }}>中国 四川 成都</Text> */}
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={{ color: "#333", fontSize: 16 }}>
                {this.props.location
                  ? (this.props.location.province != "" && this.props.location.city != "")
                    ? this.props.location.province +
                      " " +
                      this.props.location.city
                    : "定位失败，请手动选择地区"
                  : "定位失败，请手动选择地区"}
              </Text>
            </View>
            <View
              style={{
                width: CSS.pixel(60),
                height: "100%",
                justifyContent: "center",
                alignItems: "flex-end"
              }}
            >
              <Image source={iconRightArrowDark} />
            </View>
          </SDTouchOpacity>

          {/* <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
            <Text style={{ color: "#999", fontSize: 12 }}>全部</Text>
          </View>

          <View style={{ marginTop: 5 }}>
            <SDList
              listOptions={[
                {
                  name: "中国",
                  direction: ">",
                  subInfo:
                    // this.props.userInfo.city.province.title +
                    this.props.userInfo.city &&
                    this.props.userInfo.city.title !== ""
                      ? "已选地区"
                      : "请选择",
                  subInfoStyle: {
                    color: "#999"
                  },
                  onPress: () => {
                    this.context.navigator.push(
                      navScreen(
                        "EditUserProvinceScreen",
                        "地区",
                        // navRightButton("save_editProvince", "保存")
                        {
                          navigatorStyle: this.context.refs["regis_Screen"] ? {
                            //android 透明statusbar
                            // navBarHidden: true,
                            statusBarColor: "transparent",
                            statusBarHidden: true,
        
                            navBarTextColor: "#fff",
                            navBarButtonColor: "#fff",
                            navBarBackgroundColor: SDMainColor,
                            navBarTitleTextCentered: true,
                            navBarSubTitleTextCentered: true,
                            topBarElevationShadowEnabled: false,
                            statusBarTextColorScheme: "light"
                          } : {
                            navBarTextColor: "#fff",
                            navBarButtonColor: "#fff",
                            navBarBackgroundColor: SDMainColor,
                            navBarTitleTextCentered: true,
                            navBarSubTitleTextCentered: true,
                            topBarElevationShadowEnabled: false,
                            statusBarTextColorScheme: "light"
                          }
                        } 
                      )
                    );
                  }
                }
                // {
                //   name: "阿尔巴尼亚",
                //   onPress: () => {}
                // },
                // {
                //   name: "阿尔及利亚",
                //   onPress: () => {}
                // },
                // {
                //   name: "美国",
                //   direction: ">",
                //   onPress: () => {}
                // },
                // {
                //   name: "日本",
                //   direction: ">",
                //   onPress: () => {}
                // }
              ]}
            />
          </View> */}
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user,
  location: state.location
}))(EditUserAddressScreen);
