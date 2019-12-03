/* @flow */
import React from "react";
import { TouchableNativeFeedback,TouchableOpacity, Platform, View } from "react-native";
import { debounce } from "lodash";
// import type { ChildrenArray, Style } from '../types';
// import { HIGHLIGHT_COLOR } from '../styles';
import * as sdStyles from "@src/styles";

const background =
  Platform.Version >= 21
    ? TouchableNativeFeedback.Ripple(sdStyles.SDBGColorClick)
    : TouchableNativeFeedback.SelectableBackground();

type Props = {
  onPress?: () => void | Promise<any>,
  onLongPress?: () => void
  // style?: Style,
  // children?: ChildrenArray<*>,
};

export default ({ onPress, style, children, onLongPress }: Props) => {
  const WrapperComponent =
    // onPress || onLongPress ? TouchableNativeFeedback : View;
    onPress || onLongPress ? TouchableOpacity : View;

  return (
    <WrapperComponent
      background={background}
      activeOpacity={0.9}
      // onPress={onPress}
      // 添加消抖 1000ms
      // onPress={typeof onPress === "function" && debounce(onPress, 1000/* ,{ leading: true } */)}
      onPress={typeof onPress === "function" && debounce(onPress, 1000,{ leading: true })}
      onLongPress={onLongPress}
    >
      <View style={style}>{children}</View>
    </WrapperComponent>
  );
};
