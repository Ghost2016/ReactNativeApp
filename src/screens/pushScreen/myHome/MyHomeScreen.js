import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  AlertIOS,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import TopMainInfo from "../../../sd_myHome/TopMainInfo";
import LikeAndFans from "../../../sd_myHome/LikeAndFans";
import MyHomeTab from "../../../sd_myHome/MyHomeTab";
import defaultStyle from "@styles";
import SDSafeArea from "../../../common/SDSafeArea";
import { navScreen, navRightButton } from "../../../styles";
import connectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";
import { isIphoneX } from "../../../utils/iphonex";
import { ActivityIndicator } from "antd-mobile";
import { getUserBaseInfo } from "../../../users/usersSelector";
import { formatPower } from "@utils/user";
import { Context } from "../../../types";
import PostTrendsScreen from "../postTrends/PostTrends";
import PlayerKillScreen from "../playerKillScreen/PlayerKillScreen";
import MobStat from "../../../boot/MobStat";
import { RefreshState } from "../../../common/SDPullScrollView";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
    //height: '100%', //isIphoneX() ? Dimensions.get("window").height - 34 - 88 : "100%"
  }
});

// 我的主页页面
class MyHomeScreen extends React.Component {
  context: Context;

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs:PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  constructor(props) {
    super(props);
    this.state = {
      isFollowUserLoading: false
    };
  }

  componentDidMount() {
    if (this.context.navigatorEvent) {
      this.context.navigatorEvent.setOnNavigatorEvent(
        this.onNavigatorEvent.bind(this),
        "post_trends"
      );
    }
    // this.context.navigator.setOnNavigatorEvent(
    //   this.onNavigatorEvent.bind(this)
    // );

    // MobStat.onPageStart(
    //   "myhomescreen_userid_" + (this.props.userId || this.props.user.id)
    // );
  }

  componentWillUnmount() {
    // MobStat.onPageEnd(
    //   "myhomescreen_userid_" + (this.props.userId || this.props.user.id)
    // );
  }

  onNavigatorEvent(event) {
    // this is the onPress handler for the two buttons together
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "post_trends") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        this.context.navigator.push(
          navScreen("PushScreen", "发布动态", {
            passProps: {
              screen: () => <PostTrendsScreen />,
              header: {
                title: "发布动态"
              }
            },
            navigatorButtons: {
              rightButtons: [
                {
                  title: "发布",
                  id: "save_postTrends"
                }
              ]
            }
          })
        );
      }
    }
  }
  // PK一下
  handlePK = () => {
    this.context.navigator.push(
      navScreen("PlayerKillScreen", "PK一下", {
        passProps: {
          otherId: this.props.userId
        },
        navigatorStyle: {
          navBarTransparent: true,
          navBarTranslucent: Platform.OS === "ios",
          // screenBackgroundColor: 'yellow'
          navBarBackgroundColor: "yellow",
          navBarHidden: true,
          navBarNoBorder: true,
          tabBarHidden: true // 隐藏tab
        }
      })
    );
    // navScreen("PushScreen", "职么力", {
    //   passProps: {
    //     screen: () => <PlayerKillScreen />, // 自定义传递props
    //     // fullScreen: true,
    //     header: {
    //       style:{height:0},
    //       title: "PK一下",
    //       fixed: true,
    //       noScrollView: true
    //     }
    //   }
    // })
    // );
  };
  // 关注
  handleWatch = () => {
    this.setState({
      isFollowUserLoading: true
    });
    // console.log('otherUserInfo', this.props.otherUserInfo)
    const user = this.props.otherUserInfo;
    this.props.actions.toggleWatchAction(
      { id: user.id },
      res => {
        this.setState({
          isFollowUserLoading: false
        }, () => {
          this.context.refs['rank_tab_two'] && this.context.refs['rank_tab_two'].handleActionToUpdateAllData();
          this.props.actions.getOtherUserInfoAction({
            id: this.props.userId
          });
        });
      },
      {
        key: user.watch_info.related + user.id + "",
        id: user.id,
        rank: user.rank,
        fullName: user.nickname,
        score: formatPower(user.power),
        college: user.edu_info.school_name || "",
        major: user.edu_info.major_name || "",
        avatarUrl: (user.avatar && user.avatar.url) || "",
        is_verified: user.is_verified,
        sex: user.gender === "female" ? 0 : 1,
        withExtraInfo: false,
        withRankNumber: true,
        withFollow: false,
        withCompare: true
      }
    );
  };

  async componentWillMount() {
    if (this.props.userId) {
      // 获取他人主页信息
      try {
        const a = await this.props.actions.getOtherUserInfoAction({
          id: this.props.userId
        });
      } catch (error) {

      }
    } else {
      this.props.actions.clearOtherUserInfoAction();
    }
  }

  static childContextTypes = {
    otherId: PropTypes.number.isRequired
  };

  getChildContext() {
    return {
      otherId:
        this.props.userId && this.props.userId != this.props.user.id
          ? this.props.userId
          : 0
    };
  }

  _onScroll(e) {
    if (this.refs["homeTab"].state.currPage == 1) {
      // 在动态界面
      // 判断是否需要进行刷新
      // if (e.nativeEvent.contentOffset.y <= 0) {
      //   // 请求的下拉刷新
      //   return;
      // }

      // if (this.props.refreshState !== RefreshState.Idle) {
      //   return;
      // }
      const contentHeight = e.nativeEvent.contentSize.height;
      const scrollY = e.nativeEvent.contentOffset.y;
      const layoutHeight = e.nativeEvent.layoutMeasurement.height;
      if (scrollY + layoutHeight >= contentHeight - 20 && this.refs['homeTab'].state.refreshState == RefreshState.Idle) {
        this.refs["homeTab"].refreshTrends();
        // 解决安卓显示不了文字提示bug
        Platform.OS == 'android' && setTimeout(() => {
          this.refs['_scrollView'].scrollToEnd();
        }, 10)
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          onScroll={this._onScroll.bind(this)}
          scrollEventThrottle={0.5}
          ref="_scrollView"
        >
          <TopMainInfo />
          {/* <LikeAndFans /> */}
          <MyHomeTab ref="homeTab" />
        </ScrollView>
        {this.props.showTabBar !== false ? (
          <View
            style={{
              borderTopWidth: 1,
              borderColor: "#e1e1e1",
              height: 49,
              backgroundColor: "#fff",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1
              }}
              onPress={this.handleWatch}
            >
              {this.state.isFollowUserLoading && (
                <View style={{ zIndex: 3, position: "absolute", flex: 1 }}>
                  <ActivityIndicator
                    animating={this.state.isFollowUserLoading}
                  />
                </View>
              )}
              <Text
                style={{
                  color: "#fed200",
                  fontSize: CSS.textSize(30),
                  fontWeight: "600"
                }}
              >
                {this.props.otherUserInfo.watch_info.related.indexOf("watch") >
                -1
                  ? "已关注"
                  : "+关注"}
              </Text>
            </TouchableOpacity>
            <View style={defaultStyle.singleLine} />
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1
              }}
              onPress={this.handlePK}
            >
              <Text
                style={{
                  color: "#fe8900",
                  fontSize: CSS.textSize(30),
                  fontWeight: "600"
                }}
              >
                PK一下
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

export default connectWithActions((state, props) => ({
  otherUserInfo: state.otherUserInfo,
  user: getUserBaseInfo(state)
}))(MyHomeScreen);
