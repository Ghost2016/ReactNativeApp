/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Button, Image } from "react-native";
import { Avatar, Touchable } from "../sd_components/";
import * as sdStyles from "@src/styles";
import PropTypes from "prop-types";
import { CSS } from "../common/SDCSS";
import { ActivityIndicator } from 'antd-mobile';
const componentStyles = StyleSheet.create({});

type Props = {
  id: number,
  follow: boolean,
  beFollowed: boolean,
  onPress: (id: number) => void
};

export default class FollowUser extends PureComponent<Props> {
  context: Context;
  props: Props;

  static contextTypes = {
    styles: () => null
  };
  static defaultProps = {
    style: {},
    loading: false,
    textStyle: {},
    textContainerStyle: {},
    special: false
  }
  handlePress = () => {
    // console.warn('pressed')
    const { id, onPress } = this.props;
    this.props.onPress(id);
  };

  render() {
    const { id, follow, beFollowed, style, textStyle, textContainerStyle, special } = this.props;

    return (
      <View
        style={[
          {
            flex: 1,
            alignItems: "flex-end"
          },
          style
        ]}
      >
        <Touchable onPress={this.handlePress}>

          <View
            style={[{
              borderColor: !follow ? sdStyles.SDMainColor : "#e1e1e1",
              padding: CSS.pixel(12),
              borderWidth: 1, // StyleSheet.hairlineWidth,
              borderRadius: CSS.pixel(3),
              flexDirection: "row",
              // flexDirection: 'row',
              // flex:1
              justifyContent: "center",
              alignItems: "center",
              height: CSS.pixel(48),
              position:'relative'
            }, textContainerStyle]}
          >
            {this.props.loading && <View
            style={{zIndex:1, position:'absolute',flex:1}}
            >
              <ActivityIndicator
                animating={this.props.loading}
              />
            </View>}
            {!follow ? (
              <Image  resizeMode="contain" style={{width:CSS.pixel(16),height:CSS.pixel(17)}} source={special ? require("@img/rank/rank_ico_follow_black.png") : require("@img/rank/rank_btn_follow.png")} />
            ) : beFollowed ? (
              <Image resizeMode="contain" style={{width:CSS.pixel(16),height:CSS.pixel(17)}} source={special ? require("@img/rank/rank_ico_closely_black.png") : require("@img/rank/rank_ico_closely.png")} />
            ) : (
              <Image resizeMode="contain" style={{width:CSS.pixel(16),height:CSS.pixel(17)}} source={special ? require("@img/rank/rank_ico_follow_on_black.png") : require("@img/rank/rank_ico_follow_on.png")} />
            )}

            <Text
              style={[{
                paddingLeft: 2,
                textAlign: "right",
                color: !follow ? sdStyles.SDMainColor : "#999",
                fontSize: 12
              }, textStyle]}
            >
              {!follow ? "关注" : beFollowed ? "相互关注" : "已关注"}
            </Text>
          </View>
        </Touchable>
      </View>
    );
  }
}
