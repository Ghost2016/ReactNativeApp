/* @flow */
import React, { PureComponent } from "react";
import { ImageBackground, View, Image } from "react-native";
import PropTypes from "prop-types";
// import type { ChildrenArray } from '../types';
// import { nullFunction } from '../nullObjects';
import { Touchable } from "./";

type Props = {
  avatarUrl: string,
  size: number,
  shape: string,
  // children: ChildrenArray<*>,
  onPress: () => void
};

export default class ImageAvatar extends PureComponent<Props> {
  props: Props;

  static defaultProps = {
    styles: {}
  };

  render() {
    // const {  children, size, shape, onPress, styles, sex } = this.props;
    // const avatarUrl = null
    const { avatarUrl, children, size, shape, onPress, styles, sex } = this.props;
    const touchableStyle = {
      position: "relative",
      height: size,
      width: size,
      overflow: 'hidden'
    };

    const borderRadius =
      shape === "rounded"
        ? size / 8
        : shape === "circle"
          ? size / 2
          : shape === "square"
            ? 0
            : 0;
    // console.warn(styles)
    return (
      <View style={[touchableStyle, styles]}>
        <Touchable onPress={typeof onPress==='function' ? onPress : ()=>{}}>
          <Image
            style={{
              width: "100%",
              height: "100%"
            }}
            // source={{ 
            //   uri: avatarUrl.indexOf('http')>-1 ? `${avatarUrl}?imageView2/0/w/160`: avatarUrl 
            // }}
            source={
              // 如果有头像
              avatarUrl ? { 
              uri: `${avatarUrl}?imageView2/0/w/160`
            } : sex === 0
            ? require("@img/avator/female.png")
            : require("@img/avator/male.png") }
            resizeMode="cover"
            borderRadius={size / 2}
            defaultSource={require('@img/rank/rank_pic_head_male.png')}
          >
          </Image>
          {children}
        </Touchable>
      </View>
    );
  }
}
