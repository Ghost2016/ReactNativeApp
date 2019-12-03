/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ImageBackground,
} from "react-native";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
//import TitleWrap from "@src/sd_employmentinfo/titlelistwarp/TitleWrap";
import TitleWrap from "@src/sd_titleWrap/TitleWrap";

type Props = {
    style: ?object,
    title: ?string,
    lrPadding: ?boolean,
    header: ?Function,
    footer: ?Function,
};

const iconArrowRightDark = require("@img/grow/growing_ico_click.png");

export default class SDSection extends PureComponent<Props> {
  props: Props;
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  onPressMoreAction(){
    if(typeof this.props.onPressMore == "function"){
      this.props.onPressMore();
    }
  }

  render() {
    const {style, title, lrPadding, header, footer, onPressMore} = this.props;
    return (
        <View style={[{
            borderWidth: 0,
            borderColor: '#f00',
            backgroundColor: "transparent",
            marginVertical: 0,
            marginHorizontal: lrPadding ? CSS.pixel(30, true) : 0,
            paddingVertical: 0,
            paddingHorizontal: CSS.pixel(0, true),
            marginBottom: CSS.pixel(30, true),
        }, style]}>
            {typeof header === "function" ? header() : null }
            {typeof title == "function" ? title() : typeof title == "string" ? <View style={{
              paddingVertical: CSS.pixel(20),
              paddingHorizontal: CSS.pixel(30),
              backgroundColor:'#fff',
            }}>
              <TitleWrap title={title} textStyle={{
                color: sdStyles.SDFontColorMain,
              }}
              nomore={true}
              subInfo={onPressMore ? "更多" : ""}
              direction=""
              arrow={onPressMore ? iconArrowRightDark : null}
              moreColor={onPressMore ? sdStyles.SDFontColorSubtitle : null}
              moreSize={onPressMore ? CSS.textSize(22) : null}
              onPress={this.onPressMoreAction.bind(this)}
              />
            </View> : null}
            {this.props.children}
            {typeof footer === "function" ? footer() : null }
        </View>
    );
  }
}
