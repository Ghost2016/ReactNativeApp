/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  Image,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import { getUserAllInfo } from "@src/users/usersSelector";
import MyHomeScreen from "../screens/pushScreen/myHome/MyHomeScreen";
import { NULL_USERSTATE } from "@src/nullObjects";
import { navScreen } from "@styles";
import { CSS } from "@common/SDCSS";
import SDButton from "@sd_components/SDButton";
import FansScreeen from "../screens/pushScreen/fansScreen/FansScreeen";
import config from "../config";
import { initialsFromName } from "../sd_components/TextAvatar";
import { colorHashFromName } from "../utils/color";
import SDPullScrollView from "../common/SDPullScrollView";
import { RightGroup } from "../screens/tabScreen/Person/PageHeader";
const styles = StyleSheet.create({
  container: {
    height: CSS.pixel(434, true),
    backgroundColor: "#f3f3f3",
    justifyContent: "flex-start"
  },
  bgImg: {
    height: CSS.pixel(434, true),
    width: Dimensions.get("window").width,
    position: "absolute",
    zIndex: -1
  },
  headerTitle: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: Platform.OS == "ios" ? 15 : 0
  },
  headerTitleText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },
  imgWrap: {
    height: CSS.pixel(154),
    justifyContent: "flex-start",
    alignItems: "center"
    //   marginTop: 30
  },
  imgBox: {
    borderRadius: CSS.pixel(77),
    width: CSS.pixel(154),
    height: CSS.pixel(154),
    borderColor: "#fff",
    borderWidth: CSS.pixel(6)
  },
  userName: {
    //height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  userNameText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: CSS.textSize(34),
    marginBottom: CSS.pixel(44)
  },
  userSchool: {
    //height: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  userSchoolText: {
    color: "#fff",
    fontSize: CSS.textSize(24)
  },
  userInfoBox: {
    height: 60,
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  },
  userInfoNumberBox: {
    justifyContent: "flex-start",
    backgroundColor: "rgba(0,0,0,0.2)",
    flex: 1,
    alignItems: "center",
    paddingVertical: CSS.pixel(5, true)
  },
  numText: {
    color: "#fff",
    fontSize: CSS.textSize(44)
  },
  remarkText: {
    color: "#fff",
    fontSize: CSS.textSize(24)
  }
});

const userInfoDefaultObj: UserState = NULL_USERSTATE;

class PersonMainTop extends React.PureComponent<Props> {
  props: Props;
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  componentWillMount() {
    this.props.actions.getNotifyUnreadCountAction();
  }
  gotoPersonPage = () => {
    this.context.navigator.push(
      navScreen("PushScreen", "我的主页", {
        navigatorButtons: {
          rightButtons: [
            {
              // title: "动态",
              icon: () => (
                <Image source={require("@img/my/mine_btn_Release.png")} />
              ), // for icon button, provide the local image asset name
              id: "post_trends"
            }
          ]
        },
        passProps: {
          // showTabBar: false,
          fullScreen: true,
          noScrollView: true,
          screen: () => <MyHomeScreen showTabBar={false} />,
          header: {
            title: "我的主页"
          }
          // screen: () => <SDPullScrollView onFooterRefresh={() => {}}/>
        }
      })
    );
  };

  render() {
    const { user } = this.props;
    return (
      <View style={styles.container}>
        <Image
          source={require("@img/my/PersonMainTop/mine_pic_data_bg.png")}
          style={styles.bgImg}
          resizeMode="stretch"
        />
        <View
          style={{
            flexDirection: "row",
            marginTop: 16,
            justifyContent: "flex-end"
          }}
        >
          <RightGroup
            num={this.props.notifyList.unReadCount}
          />
        </View>
        <TouchableOpacity
          style={[
            {
              flexDirection: "row",
              alignItems: "flex-start",
              marginLeft: CSS.pixel(30),
              borderWidth: 0,
              borderColor: "#f0f"
            },
            styles.imgWrap
          ]}
          onPress={this.gotoPersonPage}
        >
          <TouchableOpacity onPress={this.gotoPersonPage}>
            <View
              style={[
                {
                  overflow: "hidden",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                },
                styles.imgBox
              ]}
            >
              {/* {user.avatar ? (
                <Image
                  source={
                    user.avatar
                      ? { uri: user.avatar.url + "?imageView2/0/w/160" }
                      : user.gender == "female"
                        ? require("@img/avator/female.png")
                        : require("@img/avator/male.png")
                  }
                  style={{
                    width: CSS.pixel(160),
                    height: CSS.pixel(160)
                  }}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    backgroundColor: colorHashFromName(user.name),
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: CSS.textSize(44) }}>
                    {initialsFromName(user.name)}
                  </Text>
                </View>
              )} */}
              <Image
                source={
                  user.avatar
                    ? { uri: user.avatar.url + "?imageView2/0/h/280" }
                    : user.gender == "female"
                      ? require("@img/avator/female.png")
                      : require("@img/avator/male.png")
                }
                style={{
                  width: CSS.pixel(160),
                  height: CSS.pixel(160)
                }}
              />
            </View>

            {user.isVerified && (
              <View style={{ position: "absolute", right: 2, bottom: 2 }}>
                <Image
                  source={require("@img/mine_Resume_Authentication1.png")}
                />
              </View>
            )}
          </TouchableOpacity>

          <View
            style={{
              width: CSS.pixel(400),
              borderWidth: 0,
              borderColor: "#f00",
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: CSS.pixel(26)
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles.userName}>
                <Text numberOfLines={1} style={styles.userNameText}>{user.name}</Text>
              </View>
              {user.gender == "female" ? (
                <Image style={{marginLeft: CSS.pixel(6)}} source={require("@img/rank/rank_ico_female.png")} />
              ) : (
                <Image style={{marginLeft: CSS.pixel(6)}} source={require("@img/rank/rank_ico_male.png")} />
              )}
            </View>
            <View style={styles.userSchool}>
              <Text style={[styles.userSchoolText, {maxWidth: 200}]} numberOfLines={1}>
                {user.total.school_name} {user.total.major_name}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: CSS.pixel(100),
              height: CSS.pixel(100, true),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              alignSelf: "center",
              borderWidth: 0,
              borderColor: "#ff0"
            }}
          >
            <Image
              style={{
                width: CSS.pixel(12),
                height: CSS.pixel(24, true),
                alignSelf: "center"
              }}
              source={require("@img/my/PersonMainTop/mine_btn_list_white.png")}
            />
          </View>
        </TouchableOpacity>
        <View style={[styles.userInfoBox, { flexDirection: "row" }]}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "我的关注", {
                  passProps: {
                    screen: () => (
                      <FansScreeen
                        screenType="follow"
                        userId={this.props.user.id}
                      />
                    ),
                    header: {
                      title: "我的关注"
                    }
                  }
                })
              );
            }}
          >
            <View style={styles.userInfoNumberBox}>
              <Text style={styles.numText}>{user.total.watches}</Text>
              <Text style={styles.remarkText}>关注</Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              borderLeftColor: "#fff",
              borderLeftWidth: 1,
              height: 24,
              width: 1,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: [
                {
                  translateX: 0.5
                },
                {
                  translateY: -15
                }
              ]
            }}
          />
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "我的粉丝", {
                  passProps: {
                    screen: () => (
                      <FansScreeen
                        screenType="fans"
                        userId={this.props.user.id}
                      />
                    ),
                    header: {
                      title: "我的粉丝"
                    }
                  }
                })
              );
            }}
          >
            <View style={styles.userInfoNumberBox}>
              <Text style={styles.numText}>{user.total.fans}</Text>
              <Text style={styles.remarkText}>粉丝</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserAllInfo(state, props),
  notifyList: state.notifyInfo
}))(PersonMainTop);
