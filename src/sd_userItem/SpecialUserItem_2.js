/* @flow */
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions,
  Image,
  ImageBackground
} from "react-native";

// import type { Context, Presence } from '../types';
import { Avatar, Touchable } from "../sd_components/";
// import { BRAND_COLOR } from '../styles';
import * as sdStyles from "@src/styles";
import PropTypes from "prop-types";
import FollowUser from "./FollowUser";
import ExtraUserInfo from "./ExtraUserInfo";
import { CSS } from "../common/SDCSS";
import ConnectWithActions from "../connectWithActions";
import { getUserBaseInfo, getUserAllInfo } from "@src/users/usersSelector";
import { formatPower } from "@utils/user";

const { width, height } = Dimensions.get("window");
const componentStyles = StyleSheet.create({
  touchableContainer: {
    marginBottom: CSS.pixel(30, true),
  },
  imageBackgroundContainer: {
    height: CSS.pixel(280, true),
    width: '100%'
  },
  userInfoContainer: {
    marginTop: CSS.pixel(40, true),
    marginLeft: CSS.pixel(60),
    flexDirection: "row"
  },
  majorText: {
    fontSize: CSS.textSize(24),
    lineHeight: CSS.textSize(30),
    fontWeight: sdStyles.SDFontMedium,
  },
  scoreContainer: {
    backgroundColor: sdStyles.SDFontColorMain,
    marginLeft: CSS.pixel(30),
    borderColor: sdStyles.SDMainColor,
    borderRadius: CSS.pixel(3)
  },
  scoreText: {
    color: sdStyles.SDMainColor,
    paddingLeft: 5,
    paddingRight: 5,
    height: CSS.pixel(34, true),
    lineHeight: CSS.pixel(34, true),
    fontSize: CSS.textSize(24),
    fontWeight: "400"
  },
  educationContainer: {
    marginTop: CSS.textSize(28),
    paddingLeft: sdStyles.SD_HALF_SPACING,
    justifyContent:'flex-start'
  },
  fullNameText: {
    fontSize: CSS.textSize(30),
    fontWeight: sdStyles.SDFontMedium,
  },
  goldImage: {
    position:'absolute',
    right: CSS.pixel(30),
    top: 0,
    height:CSS.pixel(240),
    width:CSS.pixel(240)
  },
  extraUserInfoContainer: {
    backgroundColor: "transparent",
    marginLeft: CSS.pixel(10),
    paddingTop: CSS.pixel(14),
    paddingBottom: CSS.pixel(30, true)
  }
});

type Props = {
  id: number,
  rank: number,
  fullName: string,
  avatarUrl: string,
  score: number,
  college: string,
  major: string,
  degree: string,
  follow: boolean,
  beFollowed: boolean,
  withExtraInfo: boolean,
  onPress: (id: number) => void,
  onFollowPress: (id: number) => void
};

class SpecialUserItem extends Component<Props> {
  context: Context;
  props: Props;

  state = {
    follow: this.props.follow,
    isFollowUserLoading: false
  };
  static contextTypes = {
    styles: () => null,
    refs: PropTypes.object.isRequired
  };

  static defaultProps = {
    id: 0,
    rank: 0,
    fullName: "",
    avatarUrl: "",
    score: 0,
    college: "",
    major: "",
    follow: false,
    beFollowed: false,
    // follow, compare
    withExtraInfo: false,
    degree: '',
    type: "follow",
    certified: false,
    sex: 0,
    withFollow: false,
    // top or progress
    withSpecialItem: 'top',
    onPress: () => {},
    onFollowPress: () => {}
  };
  // 当前条目被点击
  handlePress = () => {
    const { id, onPress } = this.props;
    onPress(id);
  };
  // 关注相当的项目被点击
  handleFollowPress = () => {
    const { id } = this.props;
    this.setState({
      isFollowUserLoading: true
    });
    // 自己处理了
    this.props.actions.toggleWatchAction({ id: id }, res => {
      console.log(res);
      this.setState({
        follow: !this.state.follow,
        isFollowUserLoading: false
      }, () => {
        this.context.refs['rank_tab_two'] && this.context.refs['rank_tab_two'].handleActionToUpdateAllData()
      });
    }, {
      ...this.props.getUserInfo()
    });
  };
  render() {
    const { styles } = this.context;
    const {
      id,
      rank,
      fullName,
      avatarUrl,
      score,
      college,
      major,
      // follow,
      beFollowed,
      type,
      withExtraInfo,
      compare,
      certified,
      sex,
      withFollow,
      user,
      // 用于区分是登峰榜单还是进步榜单
      withSpecialItem,
      degree
    } = this.props;
    // console.warn(id, user.id);
    const { follow } = this.state;
    return (
      <Touchable
        onPress={this.handlePress}
        style={[componentStyles.touchableContainer]}
      >
        <ImageBackground
          // source={
          //   withSpecialItem === 'top' ? require("@img/rank/rank_pic_NO.1_pg.png") : require("@img/rank/rank_pic_NO.1_JinBu.png")}
            source={require("@img/rank/rank_pic_NO.1_pg.png")}
            style={[componentStyles.imageBackgroundContainer, withSpecialItem !== 'top'&&{height: CSS.pixel(330, true)}]}
            resizeMode="stretch"
          >
          <View style={[componentStyles.userInfoContainer]}>
          {/* 头像 */}
            <Avatar
              size={CSS.pixel(110)}
              shape="circle"
              styles={{
                borderColor: '#fff',
                borderWidth: CSS.pixel(7),
                borderRadius: CSS.pixel(80),
                position: "relative",
                width: CSS.pixel(130),
                height: CSS.pixel(130)
              }}
              avatarUrl={avatarUrl}
              name={fullName}
              onPress={this.handlePress}
              certified={certified}
              sex={sex}
            />
            <View
              style={{
                justifyContent: "space-around",
                height: CSS.pixel(120, true),
                paddingTop: CSS.pixel(10, true),
              }}
            >
              <View
                style={{
                  paddingLeft: CSS.pixel(20),
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <View style={[
                  sdStyles.default.flexRow, 
                  {
                    maxWidth: CSS.pixel(200)
                  }]}>
                  {/* 全称 */}
                  <Text
                    numberOfLines={1}
                    style={[componentStyles.fullNameText]}
                  >
                    {fullName}
                  </Text>
                  {/* <Image
                    source={
                      sex === 0
                        ? require("@img/rank/rank_ico_female.png")
                        : require("@img/rank/rank_ico_male.png")
                    }
                    style={{ marginLeft: CSS.pixel(5) }}
                  /> */}
                </View>
                <View style={[componentStyles.scoreContainer]}>
                  {/* 分数 */}
                  <Text style={[componentStyles.scoreText]}>{`${formatPower(score)}分`}</Text>
                </View>
              </View>
              <View
                style={[componentStyles.educationContainer,{}]}
              >
                {/* 大学 */}
                <View style={[
                  {
                    maxWidth: CSS.pixel(300)
                  }]}>
                  <Text numberOfLines={1} style={[componentStyles.majorText, {paddingRight: CSS.textSize(12)}]}>{college}</Text>
                </View>
                {/* 专业 */}
                <View style={[
                  {
                    maxWidth: CSS.pixel(300)
                  }]}>
                <Text numberOfLines={1} style={[componentStyles.majorText]}>{degree}{major}</Text>
                </View>
              </View>
            </View>
          </View>
          <Image 
          style={[componentStyles.goldImage]}
          source={require('@img/rank/rank_ico_gold_NO.1.png')}/>
          {withExtraInfo && (
            <ExtraUserInfo
              style={[componentStyles.extraUserInfoContainer]}
              score={this.props.progressScore}
              percentage={this.props.progressPercent}
            />
          )}
          {(type === "follow" || withFollow) &&
            user.id !== id && (
              <FollowUser
                style={{
                  position: 'absolute',
                  bottom: CSS.pixel(24),
                  width: '100%',
                  alignItems: "center"
                }}
                textContainerStyle={{
                  borderColor: sdStyles.SDFontColorMain
                }}
                textStyle={{
                  color: sdStyles.SDFontColorMain
                }}
                id={id}
                follow={follow}
                beFollowed={beFollowed}
                onPress={this.handleFollowPress}
                loading={this.state.isFollowUserLoading}
                special={true}
              />
            )}
            {(type === "follow" || withFollow) &&
            user.id === id && (
              <View
                style={{
                  position: 'absolute',
                  bottom: CSS.pixel(32),
                  width: '100%'
                }}
              >
                <View style={{alignItems: "center", flex: 1,}}>
                  <Text style={{fontSize: CSS.textSize(20)}}>{"我"}</Text>
                </View > 
              </View>
            )}
        </ImageBackground>
      </Touchable>
    )
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({
  user: getUserAllInfo(state, props)
}))(SpecialUserItem));
