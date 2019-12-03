/* @flow */
import React, { Component } from "react";
import { StyleSheet, View, Text, Image, PixelRatio } from "react-native";

// import type { Context, Presence } from '../types';
import { Avatar, Touchable } from "../sd_components/";
import { SectionView } from "../common";
// import { BRAND_COLOR } from '../styles';
import * as sdStyles from "@src/styles";
// import separator from "@src/styles/index";
import PropTypes from "prop-types";
// import FollowUser from "./FollowUser";
// import ExtraUserInfo from "./ExtraUserInfo";
import { CSS } from "../common/SDCSS";
import { Grid } from "antd-mobile";
// import { Touchable } from '@sd_components';
import moment from "moment-timezone";

const componentStyles = StyleSheet.create({});

type Props = {
  id: number,
  fullName: string,
  avatarUrl: string,
  // date: Date,
  date: string,
  sex: number,
  contentText: string,
  contentPicUrl: string,
  location: string,
  onPress: (id: number) => void
};
// 关注动态
export default class NewsItem extends Component<Props> {
  context: Context;
  props: Props;

  static contextTypes = {
    styles: () => null,
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
  };

  static defaultProps = {
    // id
    id: 0,
    // 全称
    fullName: "",
    // 头像url
    avatarUrl: "",
    onPress: () => {},
    // date: new Date(1970, 0, 1),
    date: '1970-01-01T00:00:00.999999',
    // 0 for male, 1 for female
    sex: 0,
    contentText: "",
    contentPicUrl: "",
    location: "",
    // 是否显示认证信息
    certified: false,
    onAvatarPress: () => {}
  };
  // 当前条目被点击
  handlePress = () => {
    const { id, onPress } = this.props;
    onPress(id);
  };
  handleAvatarPress = () => {
    const { userId, onAvatarPress } = this.props;
    onAvatarPress(userId)
  }
  
  render() {
    const { styles } = this.context;
    const {
      // 动态id
      id,
      // 用户id
      userId,
      fullName,
      avatarUrl,
      date,
      sex,
      contentText,
      contentPicUrl,
      location,
      certified,
      // images,
      onPress
    } = this.props;
    let { images } = this.props;

    // // 如果是显示4张图，则添加一个空位置
    if (images.length === 4) {
      images.splice(2, 0, "");
      // 事先保存一个index以方便传递
      images.map((item, index) => {
        item.realIndex = index >=2 ? index - 1 : index
      })
    }

    let ImagesSection = null;
    if (images.length === 1) {
      let desc = {
        width: 0,
        height: 0
      };
      try {
        desc = JSON.parse(images[0].desc)
      } catch (error) {
        
      }
      
      // 如果宽度大于高度
      if(desc.width > desc.height) {
        ImagesSection = (
          // 横向排布的图片
          <Touchable
            onPress={() => {
              console.log(images[0].id);
              this.context.refs['rank_news_within_follower'].viewImages(images)
            }}
            style={{
              height: CSS.pixel(226, true),
              width: CSS.pixel(310),
              marginTop: CSS.pixel(20, true)
            }}
          >
            <Image
              style={{
                height: CSS.pixel(226, true),
                width: CSS.pixel(310),
              }}
              // 有个模拟的图片
              source={{ uri: `${images[0].url}?imageView2/0/w/${parseInt(CSS.pixel(310)*PixelRatio.get())}/h/${parseInt(CSS.pixel(226, true)*PixelRatio.get())}`}}
            />
          </Touchable>
        )
      }
      else {
        ImagesSection = (
          // 竖向排布的图片
          <Touchable
            onPress={() => {
              // console.log(images[0].id);
              this.context.refs['rank_news_within_follower'].viewImages(images)
            }}
            style={{
              height: CSS.pixel(310, true),
              width: CSS.pixel(226),
              marginTop: CSS.pixel(20, true)
            }}
          >
            <Image
              style={{
                height: CSS.pixel(310, true),
                width: CSS.pixel(226),
              }}
              // 有个模拟的图片
              source={{ uri: `${images[0].url}?imageView2/0/w/${parseInt(CSS.pixel(226)*PixelRatio.get())}/h/${parseInt(CSS.pixel(310, true)*PixelRatio.get())}`}}
            />
          </Touchable>
        )
      }
    } else {
      ImagesSection = (
      <View
        style={{
          width: 3 * CSS.pixel(150) + 3 * CSS.pixel(10)
        }}
      >
        <Grid
          data={images}
          columnNum={3}
          activeStyle={false}
          hasLine={false}
          styles={{
            grayBorderBox: {
              height: CSS.pixel(150),
              marginTop: CSS.pixel(10, true)
            }
          }}
          itemStyle={{ height: CSS.pixel(150) }}
          renderItem={(dataItem, index, arr) => {
            if (dataItem === "") return;
            return (
              <View>
                {index !== 6 && (
                  <Touchable
                    onPress={() => {
                      // console.log('ly88', index, dataItem.realIndex);
                      this.context.refs['rank_news_within_follower'].viewImages(images, dataItem.realIndex || index)
                    }}
                  >
                    <Image
                      style={{
                        height: CSS.pixel(150),
                        width: CSS.pixel(150)
                      }}
                      source={{ uri: `${images[index].url}?imageView2/0/w/${parseInt(CSS.pixel(150)*PixelRatio.get())}/h/${parseInt(CSS.pixel(150, true)*PixelRatio.get())}` }}
                    />
                  </Touchable>
                )}
              </View>
            );
          }}
        />
      </View>)
    }
    // console.warn(sdStyles.default.separator);
    return (
      <View onPress={this.handlePress}>
        <View
          style={[
            sdStyles.default.separator,
            { flexDirection: "column", padding: CSS.pixel(40) }
          ]}
        >
          {/* 上半部分 */}
          <View style={{ flexDirection: "row" }}>
            <Avatar
              // 头像
              certified={false}
              size={CSS.pixel(70)}
              avatarUrl={avatarUrl}
              name={fullName}
              onPress={this.handleAvatarPress}
            />
            <View
              // 名字和日期
              style={{ paddingLeft: CSS.pixel(8) }}
            >
              <Text
                style={{
                  fontSize: CSS.textSize(28),
                  fontWeight: sdStyles.SDFontMedium,
                  paddingBottom: CSS.pixel(4)
                }}
              >
                {fullName}
                {/* <Image
                  source={
                    sex === 0
                      ? require("@img/rank/rank_ico_female.png")
                      : require("@img/rank/rank_ico_male.png")
                  }
                  style={{ marginLeft: CSS.pixel(5) }}
                /> */}
              </Text>
              <Text style={{ fontSize: CSS.textSize(24), color: sdStyles.SDFontColorSubtitle }}>
                {/* {moment(date).tz('Asia/Shanghai').format("YYYY-MM-DD HH:mm")} */}
                {date.slice(0, 10).replace(/-/g, ".") + " " + date.slice(11, 16)}
                {/* {`${date.getHours()}:${date.getMinutes()}`} */}
              </Text>
            </View>
          </View>
          <View
            // 下面
            style={{
              paddingTop: CSS.pixel(30, true),
              paddingLeft: CSS.pixel(58)
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: CSS.textSize(28),
                  fontWeight: sdStyles.SDFontMedium
                }}
              >
                {contentText}
              </Text>

              {ImagesSection}
              {!!location && (
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: CSS.pixel(22, true),
                    alignItems: 'center'
                  }}
                >
                  <Image source={require("@img/rank/rank_ico_Location.png")} />
                  <Text
                    style={{
                      fontSize: CSS.textSize(20),
                      color: sdStyles.SDFontColorSubtitle,
                      marginLeft: CSS.pixel(10)
                    }}
                  >
                    {location}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
