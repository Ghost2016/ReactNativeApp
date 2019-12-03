import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import ConnectWithActions from "@src/connectWithActions";
import SDBox from "@sd_components/SDBox";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

class BoxMsg extends PureComponent<Props> {
  props: Props;

  render() {
    const { children, btnTitle, data } = this.props;
    return (
      <SDBox btnTitle="确定" noClose={true}
      containerStyle={{
        maxHeight: CSS.pixel(450, true),
        paddingTop: CSS.pixel(54, true),
        paddingBottom: CSS.pixel(0, true),
      }}
      >
        <View style={{
        paddingHorizontal: CSS.pixel(60),
          }}>
          {/* <Text
            style={{
              fontSize: CSS.textSize(34),
              color: sdStyles.SDFontColorMain,
              marginBottom: CSS.pixel(40, true),
              textAlign: "center"
            }}
          >
            {data.title}
          </Text> */}
          <View style={{
            width: CSS.textSize(540),
            alignSelf: 'center',
          }}><Text
            style={{
              fontSize: CSS.textSize(28),
              lineHeight: 23,
              color: sdStyles.SDFontColorMain,
              borderWidth: 0,
              borderColor: "#f00"
            }}
          >
            {data.description}
          </Text></View>
        </View>
      </SDBox>
    );
  }
}
export default ConnectWithActions((state, props) => ({
  //user: getUserAllInfo(state, props),
}))(BoxMsg);