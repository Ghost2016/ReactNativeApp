/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  View,
  Text,
  ImageBackground
} from "react-native";
//import { List } from "../common/index";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import IntlText from "@sd_components/IntlText";
import SDButton from "@sd_components/SDButton";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: -1,
    flexDirection: "column",
    width: CSS.pixel(670), // width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: "#ffffff",
    borderWidth: 0,
    borderColor: "#f00",
    borderRadius: 6,
    overflow: "hidden",

    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowColor: "#999",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4
  }
});

type Props = {
  title: string | React.Element,
  btnTitle: string,
  onPress: () => void
};

//lightBox弹窗组件
export default class SDBoxCard extends PureComponent<Props> {
  props: Props;
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }
  state = {
    hasPressFunc: false
  };

  componentWillMount() {
    if (this.props.hasOwnProperty("onPress")) {
      this.setState({
        hasPressFunc: true
      });
    }
  }

  componentDidMount() {
    //console.log("this.context.navigator", this.context.navigator);
    //const { height } = this.props
    /*if(typeof height === 'number'){
      styles.container.height = height;
    }*/
  }

  onPressAction = () => {
    if (this.state.hasPressFunc) {
      this.props.onPress();
    }
  };

  onPressDismiss() {
    this.context.navigator.dismissLightBox();
  }

  render() {
    const { hasPressFunc } = this.state;
    const {
      children,
      title,
      btnTitle,
      containerStyle,
      titleStyle,
      btnStyle,
      buttonInnerStyle,
      buttonInnerFontStyle
    } = this.props;
    //console.log("title====", title);
    return (
      <View style={[styles.container, containerStyle]}>
        {title ? (
          <View
            style={[
              {
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: sdStyles.SDMainColor,
                height: 80
              },
              titleStyle
            ]}
          >
            {typeof title === "function" ? (
              title()
            ) : (
              <ImageBackground
                resizeMode="cover"
                borderRadius={0}
                style={{
                  width: "100%", //CSS.pixel(width),
                  height: CSS.pixel(180, true),
                  borderWidth: 0,
                  borderColor: "#f00",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
                source={require("@img/grow/growing_ico_Popup_head.png")}
              >
                <Text
                  style={{
                    fontSize: CSS.pixel(34),
                    color: "#fff",
                    textAlign: "center"
                  }}
                >
                  {title}
                </Text>
              </ImageBackground>
            )}
          </View>
        ) : null}
        <ScrollView style={{
          maxHeight: 400,
          borderWidth: 0,
          borderColor: '#f00',
         }}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              borderWidth: 0,
              borderColor: "#f0f"
            }}
          >
            {children}
          </View>
        </ScrollView>
        {btnTitle ? <View
          style={[
            {
              backgroundColor: '#fff',//sdStyles.SDMainColor,
              height: CSS.pixel(100, true),
              justifyContent: "center",
              borderTopWidth: 1,
              borderTopColor: sdStyles.SDHelperColorline,
              marginTop: CSS.pixel(46, true),
            },
            btnStyle
          ]}
        >
          <SDButton
            style={[
              {
                flexDirection: "column",
                alignContent: "stretch",
                justifyContent: "center",
                backgroundColor: '#fff',//sdStyles.SDMainColor,
                borderRadius: 20,
                zIndex: 6,
                position: "relative",
                top: 0
              },
              buttonInnerStyle
            ]}
            btnStyle={[
              {
                fontSize: CSS.pixel(36),
                color: sdStyles.SDMainColor,
                borderWidth: 0,
                borderColor: "#0ff"
              },
              buttonInnerFontStyle
            ]}
            outerStyle={{
              width: '100%',
              height: CSS.pixel(80, true),
              borderWidth: 0,
              borderColor: "#0ff"
            }}
            onPress={
              hasPressFunc
                ? this.onPressAction.bind(this)
                : this.onPressDismiss.bind(this)
            }
            title={btnTitle}
          />
        </View> : null}
      </View>
    );
  }
}
