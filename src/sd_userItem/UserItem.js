/* @flow */
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  ImageBackground,
  Image
} from "react-native";

// import type { Context, Presence } from '../types';
import { Avatar, Touchable } from "../sd_components/";
// import { BRAND_COLOR } from '../styles';
import * as sdStyles from "@src/styles";
import PropTypes from "prop-types";
import FollowUser from "./FollowUser";
import ExtraUserInfo from "./ExtraUserInfo";
// 高亮
import Highlighter from "react-native-highlight-words";
import config from "../config";
import { CSS } from "../common/SDCSS";
import ConnectWithActions from "../connectWithActions";
import { getUserId, getUserPower } from '../directSelectors'
import RightRankBox from "./RightRankBox";
import { formatPower } from "@utils/user";

const componentStyles = StyleSheet.create({});

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
  withCompare: boolean,
  withExtraInfo: boolean,
  withRankNumber: boolean,
  withRankNumberOnRight: boolean,
  withFollow: boolean,
  certified: boolean,
  // searchWords: array,
  onPress: (id: number) => void,
  onFollowPress: (id: number) => void
};

class UserItem extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      searchWords: props.searchWords,
      follow: props.follow,
      isFollowUserLoading: false
    };
  }

  static contextTypes = {
    styles: () => null,
    refs: PropTypes.object.isRequired
  };

  static defaultProps = {
    // id
    id: 0,
    // 排名
    rank: 0,
    // 全称
    fullName: "",
    // 头像url
    avatarUrl: "",
    // 分数
    score: 0,
    // 大学
    college: "",
    // 专业
    major: "",
    // 学历
    degree: "",
    // 是否已关注
    follow: false,
    // 是否被关注
    beFollowed: false,
    // follow, compare
    type: "",
    // 是否带有对比的信息
    withCompare: false,
    // 当type为compare或者withCompare为true的时候用:
    // 1为领先于我，0为自己，-1为我已领先
    compare: 0,
    // 是否带有关注的信息
    withFollow: false,
    // 是否带有额外的信息
    withExtraInfo: false,
    // 是否带有排名的数字信息,默认为true
    withRankNumber: false,
    // 是否带有排名的数字信息-----居右显示的
    withRankNumberOnRight: false,
    // 是否验证通过
    certified: false,
    // 搜索项目的类型，有3种：用户名，专业，学校
    // config.RANK_SEARCH_TYPE.USERNAME |
    // config.RANK_SEARCH_TYPE.COLLEGE |
    // config.RANK_SEARCH_TYPE.MAJOR
    searchType: "",
    // 搜索时需要进行高亮显示的项目
    searchWords: [],
    // 性别，女为0，男为1
    sex: 0,
    onPress: () => {},
    // 与关注相关的条目被点击
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
    this.props.actions.toggleWatchAction({ id: id }, res => {
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
  componentDidMount() {}

  render() {
    const {
      id,
      rank,
      fullName,
      avatarUrl,
      score,
      college,
      major,
      degree,
      type,
      withExtraInfo,
      beFollowed,
      compare,
      withRankNumber,
      withFollow,
      withCompare,
      searchType,
      searchWords,
      certified,
      sex,
      withRankNumberOnRight,
      userId,
      userPower
    } = this.props;
    const { follow } = this.state;
    // console.warn(score, userPower)
    return (
      <Touchable onPress={this.handlePress}>
        {/* <Text>{fullName}</Text> */}
        <View
          style={[
            sdStyles.default.separator,
            {
              backgroundColor: withRankNumberOnRight ? sdStyles.SDBGColorMain : sdStyles.SDBGColorMinor
            }
          ]}
        >
          <View
            style={[
              {
                flexDirection: "row",
                height: CSS.pixel(160, true),
                alignItems: "center",
                padding: CSS.pixel(30)
              }
            ]}
          >
            {/* 排名信息 */}
            {withRankNumber && (
              <View
                style={{
                  width: CSS.pixel(42),
                  height: CSS.pixel(52, true),
                  marginRight: CSS.pixel(10),
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {(rank > 3 || rank <= 0) && (
                  <View
                    style={{
                      backgroundColor: "#fffae5",
                      width: CSS.pixel(36),
                      height: CSS.pixel(36),
                      borderRadius: 20
                    }}
                  >
                    <Text
                      style={{
                        color: sdStyles.SDMainColor,
                        textAlign: "center",
                        fontSize: rank >= 1000 ? 7 : rank >= 100 ? 8 : 10,
                        // fontSize: 9,
                        fontWeight: "bold",
                        lineHeight: CSS.pixel(36),
                      }}
                    >
                      {rank}
                    </Text>
                  </View>
                )}
                {rank === 1 && (
                  <ImageBackground
                    source={require(`@img/rank/rank_ico_NO.1.png`)}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
                )}
                {rank === 2 && (
                  <ImageBackground
                    source={require(`@img/rank/rank_ico_NO.2.png`)}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
                )}
                {rank === 3 && (
                  <ImageBackground
                    source={require(`@img/rank/rank_ico_NO.3.png`)}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
                )}
              </View>
            )}
            {/* 头像 */}
            <Avatar
              style={{ justifyContent: "center", alignItems: "center" }}
              size={CSS.pixel(100)}
              avatarUrl={avatarUrl}
              name={fullName}
              onPress={this.handlePress}
              certified={certified}
              sex={sex}
            />
            <View
              style={{
                justifyContent: "space-around",
                height: CSS.pixel(100, true)
              }}
            >
              <View
                style={{
                  paddingLeft: CSS.pixel(16),
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <View style={[sdStyles.default.flexRow, {
                  maxWidth: CSS.pixel(230)
                  }]}>
                  {/* 全称 */}
                  <Text numberOfLines={1} style={{fontWeight: sdStyles.SDFontMedium}}>
                    {searchType === config.RANK_SEARCH_TYPE.USERNAME ? (
                      <Highlighter
                        highlightStyle={{ color: sdStyles.SDMainColor }}
                        searchWords={[searchWords]}
                        textToHighlight={fullName}
                        style={{fontWeight: sdStyles.SDFontMedium}}
                      />
                    ) : (
                      <Text
                        style={{
                          fontSize: CSS.textSize(30),
                          fontWeight: sdStyles.SDFontMedium
                        }}>
                        {fullName}
                      </Text>
                    )}
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
                <View
                  style={{
                    backgroundColor: sdStyles.SDMainColor,
                    marginLeft: CSS.pixel(30),
                    borderColor: sdStyles.SDMainColor,
                    borderRadius: CSS.pixel(3)
                  }}
                >
                  {/* 分数 */}
                  <Text
                    style={{
                      fontSize: CSS.pixel(10),
                      paddingHorizontal: 5,
                      height: 17,
                      lineHeight: 17,
                      // height: CSS.pixel(34, true),
                      // lineHeight: CSS.pixel(34, true),
                      borderRadius: CSS.pixel(3, true),
                      // fontSize: CSS.textSize(24),
                      fontSize: 12,
                      fontWeight: sdStyles.SDFontMedium
                    }}
                  >
                    {`${formatPower(score)}分`}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: sdStyles.SD_HALF_SPACING,
                  maxWidth:CSS.pixel(370),
                  flexWrap: 'wrap',
                  justifyContent:'flex-start'
                }}
              >
                {/* 大学 */}
                <Text
                numberOfLines={1}
                style={{
                  width: '100%',
                  fontSize: CSS.textSize(24),
                  paddingRight: 6,
                  color: sdStyles.SDFontColorSubtitle }}>
                  {searchType === config.RANK_SEARCH_TYPE.COLLEGE ? (
                    <Highlighter
                      highlightStyle={{ color: sdStyles.SDMainColor }}
                      searchWords={[searchWords]}
                      textToHighlight={college}
                      style={{color: sdStyles.SDFontColorSubtitle}}
                    />
                  ) : (
                    <Text style={{color: sdStyles.SDFontColorSubtitle}}>{college}</Text>
                  )}
                </Text>
                {/* 学历 */}
                <Text
                  style={{
                    fontSize: CSS.textSize(24)
                  }}
                >
                  {searchType === config.RANK_SEARCH_TYPE.MAJOR ? (
                    <Highlighter
                      highlightStyle={{ color: sdStyles.SDMainColor }}
                      searchWords={[searchWords]}
                      textToHighlight={degree}
                      style={{color: sdStyles.SDFontColorSubtitle}}
                    />
                  ) : (
                    <Text style={{color: sdStyles.SDFontColorSubtitle}}>{degree}</Text>
                  )}
                </Text>
                {/* 专业 */}
                <Text
                  style={{
                    fontSize: CSS.textSize(24)
                  }}
                >
                  {searchType === config.RANK_SEARCH_TYPE.MAJOR ? (
                    <Highlighter
                      highlightStyle={{ color: sdStyles.SDMainColor }}
                      searchWords={[searchWords]}
                      textToHighlight={major}
                      style={{color: sdStyles.SDFontColorSubtitle}}
                    />
                  ) : (
                    <Text style={{color: sdStyles.SDFontColorSubtitle}}>{major}</Text>
                  )}
                </Text>
              </View>
            </View>
            {withRankNumberOnRight && <RightRankBox rank={rank} />}
            {/* 关注相关的 */}
            {(type === "follow" || (withFollow && userId !== id)) && (
              <FollowUser
                id={id}
                follow={follow}
                beFollowed={beFollowed}
                onPress={this.handleFollowPress}
                loading={this.state.isFollowUserLoading}
              />
            )}
            {(type === "follow" || (withFollow && userId === id)) && (
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                  paddingRight: sdStyles.SD_HALF_SPACING
                }}
              >
                <Text
                  style={{
                    alignItems: "flex-end",
                    fontSize: CSS.textSize(20),
                  }}
                >
                  {"我"}
                </Text>
              </View>
            )}

            {/* 比较相关的 */}
            {(type === "compare" || withCompare) && (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "flex-end",
                  // paddingRight: CSS.pixel(30),
                  flexDirection:'row'
                }}
              >
                {userId === id ? (
                  null
                ) : score >= userPower ? (
                  <Image source={require("@img/rank/rank_ico_lead.png")} />
                ) : (
                  <Image source={require("@img/rank/rank_ico_backward.png")} />
                )}
                <Text
                  style={{
                    alignItems: "flex-end",
                    fontSize: CSS.textSize(20),
                    marginLeft: 5,
                    color:
                      userId === id
                        ? sdStyles.SDFontColorMain
                        : score > userPower
                          ? sdStyles.SDBGColorOrange //"#fe8900"
                          : sdStyles.SDMainColor //"#fed200"
                  }}
                >
                  {userId === id
                    ? "我"
                    : score >= userPower
                      ? "领先于我"
                      : "我已领先"}
                </Text>
              </View>
            )}
          </View>
          {/* 附加的其他信息 */}
          {withExtraInfo && (
            <ExtraUserInfo
              style={{
                marginTop: 3,
                marginBottom: 15
              }}
              score={this.props.progressScore}
              percentage={this.props.progressPercent}
            />
          )}
        </View>
      </Touchable>
    );
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({
  userId: getUserId(state, props),
  userPower: getUserPower(state, props)
}))(UserItem));
