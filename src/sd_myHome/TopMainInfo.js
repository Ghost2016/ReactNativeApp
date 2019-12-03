import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
import defaultStyle from "@styles";
import { CSS } from "../common/SDCSS";
import ConnectWithActions from "../connectWithActions";
import { getUserBaseInfo } from "../users/usersSelector";
import { otherUserInfoModel, userBaseInfoModel, UserState } from "../types";
import { initialsFromName } from "../sd_components/TextAvatar";
import { colorHashFromName } from "../utils/color";
import SDTouchOpacity from "../common/SDTouchOpacity";
import ImageViewer from "react-native-image-zoom-viewer";
import { isIphoneX } from "../utils/iphonex";
import { navScreen } from "../styles";
import FansScreeen from "../screens/pushScreen/fansScreen/FansScreeen";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fed200",
    height: CSS.pixel(210, true)
  }
});

type Props = {
  otherUserInfo: otherUserInfoModel,
  userBaseInfo: UserState
};

// 我的主页顶部信息组件
class TopMainInfo extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isShowImageViewer: false,
      imagesUrls: [],
      imageViewerIndex: 0
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    otherId: PropTypes.number.isRequired,
    refs: PropTypes.object.isRequired
  };

  static defaultProps = {
    isShowFans: true
  }

  render() {
    // console.warn(this.context.otherId)
    let name = "",
      gender = "",
      school = "",
      major = "",
      degree = "",
      isVerified = false,
      avatar = "",
      fans = 0,
      watches = 0;
    if (this.context.otherId === 0) {
      fans = this.props.userBaseInfo.total.fans;
      watches = this.props.userBaseInfo.total.watches;
    } else {
      fans = this.props.otherUserInfo.watch_info.fans;
      watches = this.props.otherUserInfo.watch_info.watches;
    }

    if (this.context.otherId === 0) {
      name = this.props.userBaseInfo.nickname;
      gender = this.props.userBaseInfo.gender;
      school = this.props.userBaseInfo.total
        ? this.props.userBaseInfo.total.school_name
        : "";
      major = this.props.userBaseInfo.total
        ? this.props.userBaseInfo.total.major_name
        : "";
      degree = this.props.userBaseInfo.total
        ? this.props.userBaseInfo.total.degree_name
        : "";
      isVerified = this.props.userBaseInfo.is_verified;
      avatar = this.props.userBaseInfo.avatar;
    } else {
      name = this.props.otherUserInfo.nickname;
      gender = this.props.otherUserInfo.gender;
      school = this.props.otherUserInfo.edu_info.school_name;
      major = this.props.otherUserInfo.edu_info.major_name;
      degree = this.props.otherUserInfo.edu_info.degree_name;
      isVerified = this.props.otherUserInfo.is_verified;
      avatar = this.props.otherUserInfo.avatar;
    }

    return (
      <View
        style={{
          backgroundColor: "#fff",
          paddingHorizontal: CSS.pixel(30),
          paddingTop: CSS.pixel(10),
          paddingBottom: CSS.pixel(30),
          position: "relative"
        }}
      >
        {/* 背景 */}
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
        <View style={{ paddingLeft: CSS.pixel(30), paddingTop: CSS.pixel(30) }}>
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
                      source={{ uri: avatar.url + "?imageView2/2/w/280/h/280" }}
                      style={{ width: CSS.pixel(140), height: CSS.pixel(140) }}
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
              {
                isVerified &&
                <View style={{ position: "absolute", right: 2, bottom: 2 }}>
                  <Image
                    source={require("@img/mine_Resume_Authentication1.png")}
                  />
                </View>
              }
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
                  style={{
                    color: "#333",
                    fontSize: CSS.textSize(30),
                    fontWeight: "600"
                  }}
                  numberOfLines={1}
                >
                  {name && name.slice(0, 10)}
                </Text>
                {gender == "female" ? (
                  <Image style={{marginLeft: 5}} source={require("@img/rank/rank_ico_female.png")} />
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
                  {school + " "}
                  {major + " "}
                  {degree}
                </Text>
              </View>
            </View>
          </View>

          {/* 粉丝数及关注数 */}
          {this.props.isShowFans ? (
            <View
              style={{
                top: -6,
                marginTop: CSS.pixel(30),
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <SDTouchOpacity
                onPress={() => {
                  this.context.navigator.push(
                    navScreen("PushScreen", "关注", {
                      passProps: {
                        screen: () => (
                          <FansScreeen
                            screenType="follow"
                            userId={
                              this.context.otherId !== undefined &&
                              this.context.otherId !== 0
                                ? this.context.otherId
                                : this.props.userBaseInfo.id
                            }
                          />
                        ),
                        header: {
                          title:
                            this.context.otherId !== undefined &&
                            this.context.otherId !== 0
                              ? "他的关注"
                              : "我的关注"
                        }
                      }
                    })
                  );
                }}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View>
                  <Text style={{ fontSize: CSS.textSize(34), color: "#333" }}>
                    {watches}
                  </Text>
                </View>
                <View style={{ marginTop: CSS.pixel(10) }}>
                  <Text style={{ fontSize: CSS.textSize(20), color: "#333" }}>
                    关注
                  </Text>
                </View>
              </SDTouchOpacity>
              <View style={{ width: 1, height: 20, backgroundColor: "#fff" }} />
              <SDTouchOpacity
                onPress={() => {
                  this.context.navigator.push(
                    navScreen("PushScreen", "粉丝", {
                      passProps: {
                        screen: () => (
                          <FansScreeen
                            screenType="fans"
                            userId={
                              this.context.otherId !== undefined &&
                              this.context.otherId !== 0
                                ? this.context.otherId
                                : this.props.userBaseInfo.id
                            }
                          />
                        ),
                        header: {
                          title:
                            this.context.otherId !== undefined &&
                            this.context.otherId !== 0
                              ? "他的粉丝"
                              : "我的粉丝"
                        }
                      }
                    })
                  );
                }}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View>
                  <Text style={{ fontSize: CSS.textSize(34), color: "#333" }}>
                    {fans}
                  </Text>
                </View>
                <View style={{ marginTop: CSS.pixel(10) }}>
                  <Text style={{ fontSize: CSS.textSize(20), color: "#333" }}>
                    粉丝
                  </Text>
                </View>
              </SDTouchOpacity>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userBaseInfo: state.user,
  otherUserInfo: state.otherUserInfo
}))(TopMainInfo);
