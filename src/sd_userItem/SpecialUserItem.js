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
const componentStyles = StyleSheet.create({});
const { width, height } = Dimensions.get("window");
import { CSS } from "../common/SDCSS";
import ConnectWithActions from "../connectWithActions";
import { getUserBaseInfo, getUserAllInfo } from "@src/users/usersSelector";
import { formatPower } from "@utils/user";
type Props = {
  id: number,
  rank: number,
  fullName: string,
  avatarUrl: string,
  score: number,
  college: string,
  major: string,
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
      withSpecialItem
    } = this.props;
    // console.warn(id, user.id);
    const { follow } = this.state;
    return (
      <Touchable
        onPress={this.handlePress}
        style={{
          marginLeft: CSS.pixel(20),
          marginRight: CSS.pixel(20),
          marginBottom: CSS.pixel(30, true),
          marginTop: CSS.pixel(10, true)
        }}
      >
        <ImageBackground
          source={
            withSpecialItem === 'top' ? require("@img/rank/rank_pic_NO.1.png") : require("@img/rank/rank_pic_NO.1_JinBu.png")}
          style={[
            {
              alignItems: "center",
              height: CSS.pixel(378),
              width: CSS.pixel(710)
            }
          ]}
          resizeMode="stretch"
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: CSS.pixel(110, true)
            }}
          >
            {/* 姓名相关信息 */}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <View
                style={[
                  sdStyles.default.flexRow,
                  { paddingBottom: CSS.pixel(14, true),
                    maxWidth: CSS.pixel(200) }
                ]}
              >
                <Text
                  style={{
                    fontSize: CSS.textSize(30),
                    fontWeight: "600",
                    color: "#333"
                  }}
                  numberOfLines={1}
                >
                  {fullName}
                </Text>
                <Image
                  source={
                    sex === 0
                      ? require("@img/rank/rank_ico_female.png")
                      : require("@img/rank/rank_ico_male.png")
                  }
                  style={{ marginLeft: CSS.pixel(5) }}
                />
                {certified && (
                  <Image
                    source={require("@img/rank/rank_ico_Authentication.png")}
                    style={{ marginLeft: CSS.pixel(24) }}
                  />
                )}
              </View>
              <View
                style={{
                  backgroundColor: sdStyles.SDMainColor,
                  // marginLeft: CSS.pixel(-50),
                  borderColor: sdStyles.SDMainColor,
                  borderRadius: CSS.pixel(3)
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    paddingLeft: CSS.pixel(10),
                    paddingRight: CSS.pixel(10),
                    height: CSS.pixel(34, true),
                    lineHeight: CSS.pixel(34, true),
                    borderRadius: CSS.pixel(3, true),
                    fontSize: CSS.textSize(24),
                    fontWeight: "600"
                  }}
                >
                  {`${formatPower(score)}分`}
                </Text>
              </View>
            </View>
            {/* 头像 */}
            <View
              style={{
                // flex: 1,
                justifyContent: "center",
                alignItems: "center"
                // width:CSS.pixel(260)
              }}
            >
              <Avatar
                size={CSS.pixel(150)}
                avatarUrl={avatarUrl}
                sex={sex}
                name={fullName}
                type="circle"
                onPress={this.handlePress}
                styles={{
                  borderColor: sdStyles.SDMainColor,
                  borderWidth: CSS.pixel(5),
                  borderRadius: CSS.pixel(80),
                  position: "relative",
                  width: CSS.pixel(160),
                  height: CSS.pixel(160)
                }}
              />
              <Image
                style={{
                  bottom: 0,
                  width: CSS.pixel(186),
                  height: CSS.pixel(72),
                  position: "absolute"
                }}
                source={withSpecialItem === 'top' 
                ? require("@img/rank/rank_ico_DengFeng.png")
              : require("@img/rank/rank_ico_FenJin.png")}
              />
            </View>

            {/* 学校专业 */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontSize: sdStyles.SD_FONTSIZE_SMALL,
                  padding: sdStyles.SD_HALF_SPACING
                }}
              >
                {college}
              </Text>
              <Text
                style={{
                  fontSize: sdStyles.SD_FONTSIZE_SMALL
                }}
              >
                {major}
              </Text>
            </View>
            {/* </View> */}
          </View>
          {/* 关注相关的 */}
          {(type === "follow" || withFollow) &&
            user.id !== id && (
              <FollowUser
                style={{
                  marginTop: CSS.pixel(30, true),
                  marginBottom: CSS.pixel(20, true)
                }}
                id={id}
                follow={follow}
                beFollowed={beFollowed}
                onPress={this.handleFollowPress}
                loading={this.state.isFollowUserLoading}
              />
            )}
          {(type === "follow" || withFollow) &&
            user.id === id && (
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                  paddingRight: sdStyles.SD_HALF_SPACING,
                  marginTop: CSS.pixel(30, true),
                  marginBottom: CSS.pixel(20, true)
                }}
              >
                <Text
                  style={{
                    alignItems: "flex-end",
                    fontSize: CSS.textSize(20),
                    color: "#333"
                  }}
                >
                  {"我"}
                </Text>
              </View>
            )}
        </ImageBackground>
        {withExtraInfo && (
          <ExtraUserInfo
            style={{
              backgroundColor: "#fff",
              marginLeft: CSS.pixel(10),
              paddingTop: CSS.pixel(30),
              paddingBottom: CSS.pixel(30, true)
            }}
            score={this.props.progressScore}
            percentage={this.props.progressPercent}
            // score={score}
            // percentage={score}
          />
        )}
      </Touchable>
    );
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({
  user: getUserAllInfo(state, props)
}))(SpecialUserItem));
