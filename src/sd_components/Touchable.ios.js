/* @flow */
import React from "react";
import { TouchableHighlight, TouchableOpacity, View } from "react-native";
import { debounce } from "lodash";
// import type { ChildrenArray, Style } from '../types';
// import { HIGHLIGHT_COLOR } from '../styles';
import * as sdStyles from "@src/styles";

type Props = {
  onPress?: () => void | Promise<any>,
  onLongPress?: () => void
  // style?: Style,
  // children?: ChildrenArray<*>,
};

export default ({ onPress, style, children, onLongPress, ...restProps }: Props) => {
  // const WrapperComponent = onPress || onLongPress ? TouchableHighlight : View;
  const WrapperComponent = onPress || onLongPress ? TouchableOpacity : View;
  return (
    <WrapperComponent
      {...restProps}
      underlayColor={sdStyles.SDBGColorClick}
      style={style}
      activeOpacity={0.9}
      // 添加消抖 1000ms
      // onPress={typeof onPress === "function" && debounce(onPress, 1000/* ,{ leading: true } */)}
      onPress={typeof onPress === "function" && debounce(onPress, 1000,{ leading: true })}
      //onLongPress={onLongPress}
    >
      <View>{children}</View>
    </WrapperComponent>
  );
};
