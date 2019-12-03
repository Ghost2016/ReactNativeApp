/* @flow */
import React from "react";
import { StyleSheet, View } from "react-native";
import { SearchBar } from "antd-mobile";
import { CSS } from "../../common/SDCSS";
import searchBarDefaultStyles from "antd-mobile/lib/search-bar/style/index.native.js";
import * as sdStyles from "../../styles";

console.log("searchBarDefaultStyles", searchBarDefaultStyles);
let searchBarStyles = JSON.parse(JSON.stringify(searchBarDefaultStyles));
searchBarStyles.wrapper = {
  ...searchBarStyles.wrapper,
  height: CSS.pixel(80),
  backgroundColor: sdStyles.SDMainColor,
  paddingLeft: CSS.pixel(30),
  paddingRight: CSS.pixel(30),
};
searchBarStyles.inputWrapper = {
  ...searchBarStyles.inputWrapper
};
searchBarStyles.input = {
  ...searchBarStyles.input,
  // 此处设置透明时会把文字也变成透明的
  // backgroundColor: "#fbe57b",
  fontSize: CSS.textSize(28),
  paddingLeft: CSS.pixel(60),
  // marginLeft: CSS.pixel(60),
  borderWidth: 0,
  color: "#333",
  paddingRight: CSS.pixel(0),
};
searchBarStyles.search = {
  ...searchBarStyles.search,
  left: CSS.pixel(50),
  height: CSS.pixel(22),
  width: CSS.pixel(22),
  tintColor: "#282828",
  top: CSS.textSize(30)
};
searchBarStyles.cancelTextContainer = {
  ...searchBarStyles.cancelTextContainer,
  alignItems: "flex-start",
  height: CSS.pixel(60)
};
searchBarStyles.cancelText = {
  ...searchBarStyles.cancelText,
  fontSize: CSS.textSize(24),
  // color: "#fff",
  color: sdStyles.SDFontColorMinor,
  marginRight: -CSS.pixel(10),
  paddingLeft: CSS.pixel(20)
};

// const searchBarDefaultStyles = {
//   ...searchBarStyles
// }
const styles = StyleSheet.create({
  container: {
    borderRadius: CSS.pixel(50),
    height: CSS.pixel(58, true)
  }
});
export default class SearchInput extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    // padding下方距离
    wrapperPaddingBottom: 0
  };
  render() {
    return (
      <View
        style={{
          backgroundColor: sdStyles.SDMainColor,
          paddingBottom: CSS.pixel(this.props.wrapperPaddingBottom),
          height: 44,
          width: '100%'
        }}
      >
        <SearchBar
          placeholderTextColor={"#999"}
          placeholder="搜索你感兴趣的用户、专业、学校"
          style={styles.container}
          maxLength={15}
          showCancelButton={false}
          styles={searchBarStyles}
          {...this.props}
        />
      </View>
    );
  }
}
