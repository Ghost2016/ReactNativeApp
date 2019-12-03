/* @flow */
import React, { PureComponent } from "react";
import { Subtitle } from "@shoutem/ui";
import { Dimensions, View, Platform } from "react-native";
import ConnectWithActions from "@src/connectWithActions";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import IntlText from "@sd_components/IntlText";
import ButtonSection from "@sd_components/ButtonSection";
import ImageChoose from "@sd_components/ImageChoose";
import { Toast } from "antd-mobile";
import FootSpace from "@sd_components/FootSpace";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

type Props = {
  onPress: () => void
};

class GrowingPath extends PureComponent<Props> {
  props: Props;
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    //intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }
  state = {
    currentPath: 0,
    currentTitle: '',
  };

  onPressAction = () => this.props.onPress(this.state.currentPath, this.state.currentTitle);

  componentDidMount(){
    //this.context.refs["_growScreen"].changeTopTab(0);
  }

  onPressImage(index, title) {
    //Toast.info(index)
    this.setState({
      currentPath: index,
      currentTitle: title,
    });
  }

  render() {
    const { style } = this.props;
    return (
      <View style={{
        backgroundColor: sdStyles.SDBGColorMain,
        //height: height,
      }}>

        <ButtonSection
          title="SD(点亮路径)"
          onPress={this.onPressAction.bind(this)}
          style={{
            width: CSS.pixel(690),
            height: CSS.pixel(996, true),
            marginTop: CSS.pixel(30, true),
            /* height:
              Platform.OS === "android"
                ? CSS.pixel(1080, true)
                : CSS.pixel(880, true) */
          }}
        >
          <View style={{
            alignItems: "center",
            paddingTop: CSS.pixel(50, true),
            paddingBottom: CSS.pixel(40, true),
            }}>
            <Subtitle>
              <IntlText style={{
                fontSize: CSS.textSize(28),
              }} title="SD(选择点亮未来路径)" />
            </Subtitle>
          </View>
          <ImageChoose onPress={this.onPressImage.bind(this)} />
        </ButtonSection>
        <FootSpace />
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
}))(GrowingPath);
