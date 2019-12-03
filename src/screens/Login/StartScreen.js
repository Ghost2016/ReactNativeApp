import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
  Easing,
  Platform,
  AppState
} from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import store from "@boot/store";
import { CSS } from "@common/SDCSS";
import ConnectWithActions from "@src/connectWithActions";
import FullImage from "./FullImageScreen";
import Carousel, { Pagination } from "react-native-snap-carousel";
import SDButton from "@sd_components/SDButton";
import { navScreen, navRightButton } from "@styles";
import { isIphoneX } from "@utils/iphonex";
import RegisterScreen from "@src/screens/registerScreen/RegisterScreen";
import RegisterScreenAndroid from "@src/screens/registerScreen/RegisterScreen-android";
import LoginMainScreen from "@src/screens/LoginMainScreen";

// 获取手机屏幕的大小
//const { height, width } = Dimensions.get("window");

let imgScreen1 = require("@img/launch_screen/02引导页.png");
let imgScreen2 = require("@img/launch_screen/03引导页.png");
let imgScreen3 = require("@img/launch_screen/04引导页.png");
//Alert.alert(isIphoneX())
if(Platform.OS === "android"){
  imgScreen1 = require("@img/launch_screen/androidx/02安卓-引导页.png");
  imgScreen2 = require("@img/launch_screen/androidx/03安卓-引导页.png");
  imgScreen3 = require("@img/launch_screen/androidx/04安卓-引导页.png");
}
if (isIphoneX()) {
  imgScreen1 = require("@img/launch_screen/iphonex/引导页1_iPhone_x.png");
  imgScreen2 = require("@img/launch_screen/iphonex/引导页2_iPhone_x.png");
  imgScreen3 = require("@img/launch_screen/iphonex/引导页3_iPhone_x.png");
}

const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80
};

class StartScreen extends PureComponent {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);

    store.dispatch({
      type: "SETAPPOPENED"
    });
  }
  state = {
    isLoading: true,
    isScrolling: false,
    myText: "",
    screenNum: 1,
    gestureName: "none",
    timeout: null,
    isCheckToken: false,

    entries: ["s1", "s2", "s3"],
    sliderWidth: Dimensions.get("window").width,
    itemWidth: Dimensions.get("window").width,
    currIndex: 0,
    fadeAnim: new Animated.Value(0.9)
  };

  _renderItem({ item, index }) {
    switch (item) {
      case "s1":
        return (
          <FullImage
            img={imgScreen1}
            hasLink={false}
            index={1}
            currIndex={this.state.currIndex}
            title="名企课堂"
            subTitle="名企HR授课，get实用职业技能"
            isScrolling={this.state.isScrolling}
          />
        );
      case "s2":
        return (
          <FullImage
            img={imgScreen2}
            hasLink={false}
            index={2}
            currIndex={this.state.currIndex}
            title="职业规划"
            subTitle="历届毕业生就业大数据，科学规划职业路径"
            isScrolling={this.state.isScrolling}
          />
        );
      case "s3":
        return (
          <FullImage
            img={imgScreen3}
            hasLink={true}
            index={3}
            currIndex={this.state.currIndex}
            title="能力榜单"
            subTitle="独一无二的全国大学生能力排行榜"
            isScrolling={this.state.isScrolling}
          />
        );
      default:
        break;
    }
  }

  onPressLogin() {
    this.context.navigator.push(
      navScreen("PushScreen", "登录", {
        passProps: {
          screen: () => <LoginMainScreen />,
          fullScreen: true,
          //header: {title:""}
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存"),
      })
    );
  }

  onPressSignup() {
    this.context.navigator.push(
      navScreen("PushScreen", "注册", {
        passProps: {
          screen: () => Platform.OS == "ios" ? <RegisterScreen /> : <RegisterScreenAndroid />,
          fullScreen: true,
          //header: {title:""}
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存"),
      })
    );
  }

  onScrollSnap(){
    this.setState({
      isScrolling: true,
    });
    setTimeout(() => {
      this.setState({
        isScrolling: false,
      });
    }, 1000);
  }

  changeSnap = index => {
    console.log("changeSnap", index);
    this.setState({
      currIndex: index
      //fadeAnim: new Animated.Value(0.0),
    });

    Animated.timing(this.state.fadeAnim, {
      toValue: 0.9,
      easing: Easing.inOut(Easing.ease),
      duration: 1000
    }).start();

    //if (index == 2)
    setTimeout(() => {
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        easing: Easing.inOut(Easing.ease),
        duration: 500
      }).start();
    }, 500);
  };

  render() {
    const { isLoading } = this.state;
    const dotSize = 16;

    return (
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <Carousel
          style={{ zIndex: 2 }}
          ref={c => {
            this._carousel = c;
          }}
          data={this.state.entries}
          renderItem={this._renderItem.bind(this)}
          sliderWidth={this.state.sliderWidth}
          itemWidth={this.state.itemWidth}
          // scrollEnabled={false}
          onSnapToItem={this.changeSnap.bind(this)}
          onScroll={this.onScrollSnap.bind(this)}
          testID={"Carousel"}
        />
        <Pagination
          dotsLength={this.state.entries.length}
          activeDotIndex={this.state.currIndex}
          containerStyle={{
            paddingVertical: 8,
            position: "relative",
            top: CSS.pixel(-200, true),
            left: 0, //CSS.pixel(0),
            zIndex: 5
          }}
          dotColor={sdStyles.SDMainColor}
          dotStyle={{
            width: 10, //CSS.pixel(dotSize),
            height: 10, //CSS.pixel(dotSize, true),
            borderRadius: 10, //CSS.pixel(10),
            marginHorizontal: 10, //CSS.pixel(15)
            marginTop: this.state.currIndex == 2 ? 0 : 0
          }}
          inactiveDotColor={"rgba(222, 222, 222, 0.92)"}
          inactiveDotOpacity={0.9}
          inactiveDotScale={0.6}
          carouselRef={this._carousel}
          tappableDots={!!this._carousel}
        />

        <Animated.View
          style={{
            //display: 'none',
            opacity: this.state.fadeAnim,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 7,
            position: "relative",
            top: CSS.pixel(-177, true),
            width: CSS.pixel(600),
            height: CSS.pixel(80, true)
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: CSS.pixel(290),
              height: CSS.pixel(80, true),
              borderWidth: 0,
              borderColor: "#f00",
              position: "relative",
              top: CSS.pixel(0, true),
              marginHorizontal: CSS.pixel(10)
            }}
          
          >
            <SDButton
              testID={"loginButton_StartScreen"}
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
              outerStyle={{
                position: "relative",
                top: 0, //CSS.pixel(-6),
                left: 0, //CSS.pixel(-4),
                borderRadius: CSS.pixel(40),
                width: CSS.pixel(290),
                height: CSS.pixel(80, true),
                borderWidth: 1,
                borderColor: sdStyles.SDMainColor,
                backgroundColor: "#fff"
              }}
              btnStyle={{
                fontSize: CSS.textSize(32),
                color: sdStyles.SDMainColor,
                textAlign: "center",
                fontWeight: sdStyles.SDFontMedium,
                position: "relative",
                top: CSS.pixel(-1, true),
              }}
              title="登录"
              onPress={this.onPressLogin.bind(this)}
          
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: CSS.pixel(290),
              height: CSS.pixel(80, true),
              borderWidth: 0,
              borderColor: "#f00",
              position: "relative",
              top: CSS.pixel(0, true),
              marginHorizontal: CSS.pixel(10)
            }}
          >
            <SDButton
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
              outerStyle={{
                position: "relative",
                top: 0, //CSS.pixel(-6),
                left: 0, //CSS.pixel(-4),
                borderRadius: CSS.pixel(40),
                width: CSS.pixel(290),
                height: CSS.pixel(80, true),
                borderWidth: 1,
                borderColor: sdStyles.SDMainColor,
                backgroundColor: sdStyles.SDMainColor
              }}
              btnStyle={{
                fontSize: CSS.textSize(32),
                color: sdStyles.SDFontColorMain,
                textAlign: "center",
                fontWeight: sdStyles.SDFontMedium,
                position: "relative",
                top: CSS.pixel(-1, true),
              }}
              title="注册"
              onPress={this.onPressSignup.bind(this)}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}
export default ConnectWithActions((state, props) => ({}))(StartScreen);
