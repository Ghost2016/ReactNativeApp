import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  ImageBackground,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { CSS } from "../../common/SDCSS";
import { isIphoneX } from "../../utils/iphonex";
import { headerPadding } from "../../common/SDHeader";
import LottieView from "lottie-react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { SDMainColor } from "../../styles";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

export default class AnimateLoginScreen extends PureComponent {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      currIndex: 0
    };
  }
  _renderItem(item) {
    switch (item) {
      case "0":
        return (
          <LottieView
            style={{
              height: CSS.pixel(860, true),
              width: CSS.width() - CSS.pixel(24),
            }}
            ref="_start00"
            loop={false}
            autoPlay={true}
            source={require("@img/animate/start01.json")}
          />
        );
      case "1":
        return (
          <LottieView
            style={{
              height: CSS.pixel(860, true),
              width: CSS.width() - CSS.pixel(24)
            }}
            ref="_start01"
            loop={false}
            autoPlay={true}
            source={require("@img/animate/start02.json")}
          />
        );
      case "2":
        return (
          <LottieView
            style={{
              height: CSS.pixel(860, true),
              width: CSS.width() - CSS.pixel(24)
            }}
            ref="_start02"
            loop={false}
            autoPlay={true}
            source={require("@img/animate/start03.json")}
          />
        );
    }
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingLeft: CSS.pixel(60)
        }}
      >
        <View
          style={{
            marginTop: isIphoneX()
              ? CSS.pixel(90, true) + 24
              : CSS.pixel(90, true)
          }}
        >
          <Text
            style={{
              color: "#333",
              fontSize: CSS.textSize(40),
              fontWeight: "600"
            }}
          >
            多维度职场就业大数据
          </Text>
        </View>
        <View
          style={{
            marginTop: CSS.pixel(34, true),
            marginBottom: CSS.pixel(43, true)
          }}
        >
          <Text>学校、行业、专业、职位宏观一览</Text>
        </View>
        <View
          style={{
            backgroundColor: "#333",
            width: CSS.pixel(54),
            height: CSS.pixel(4, true)
          }}
        />

        {/* <Carousel
          ref={c => {
            this._carousel = c;
          }}
          data={["0", "1", "2"]}
          renderItem={this._renderItem.bind(this)}
          sliderWidth={CSS.width() - CSS.pixel(24)}
          itemWidth={CSS.width() - CSS.pixel(24)}
          height={CSS.pixel(860, true)}
          testID={"Carousel"}
        /> */}
        <GestureRecognizer
          onSwipeRight={state => {
            if (this.state.currIndex <= 0) {
              return;
            } else {
              this.setState(
                {
                  currIndex: this.state.currIndex - 1
                },
                () => {
                  this.refs[`${"_start0" + this.state.currIndex}`].play();
                }
              );
            }
          }}
          onSwipeLeft={state => {
            if (this.state.currIndex >= 2) {
              return;
            } else {
              this.setState(
                {
                  currIndex: this.state.currIndex + 1
                },
                () => {
                  this.refs[`${"_start0" + this.state.currIndex}`].play();
                }
              );
            }
          }}
          config={{
            velocityThreshold: 0.1,
            directionalOffsetThreshold: 50
          }}
          style={{
            width: CSS.width() - CSS.pixel(24),
            height: CSS.pixel(860, true),
            top: -CSS.pixel(16, true)
          }}
        >
          {this.state.currIndex == 0 ? (
            <LottieView
              style={{
                height: CSS.pixel(860, true),
                width: CSS.width() - CSS.pixel(24),
              }}
              ref="_start00"
              loop={false}
              autoPlay={true}
              source={require("@img/animate/start01.json")}
            />
          ) : this.state.currIndex == 1 ? (
            <LottieView
              style={{
                height: CSS.pixel(860, true),
                width: CSS.width() - CSS.pixel(24)
              }}
              ref="_start01"
              loop={false}
              autoPlay={true}
              source={require("@img/animate/start02.json")}
            />
          ) : this.state.currIndex == 2 ? (
            <LottieView
              style={{
                height: CSS.pixel(860, true),
                width: CSS.width() - CSS.pixel(24)
              }}
              ref="_start02"
              loop={false}
              autoPlay={true}
              source={require("@img/animate/start03.json")}
            />
          ) : null}
        </GestureRecognizer>

        <Pagination
          dotsLength={3}
          activeDotIndex={this.state.currIndex}
          containerStyle={{
            paddingVertical: 8,
            position: "relative",
            left: -CSS.pixel(30),
            zIndex: 5
          }}
          dotColor={SDMainColor}
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
        />

        <View
          style={{
            position: "absolute",
            bottom: CSS.pixel(50, true),
            left: 0, 
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: CSS.pixel(290),
              height: CSS.pixel(80),
              borderRadius: CSS.pixel(40),
              borderColor: SDMainColor,
              borderWidth: 1
            }}
          >
            <Text
              style={{
                fontSize: CSS.textSize(32),
                color: SDMainColor,
                fontWeight: "600"
              }}
            >
              登录
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: CSS.pixel(290),
              height: CSS.pixel(80),
              borderRadius: CSS.pixel(40),
              backgroundColor: SDMainColor,
              marginLeft: CSS.pixel(20)
            }}
          >
            <Text
              style={{
                fontSize: CSS.textSize(32),
                color: "#333",
                fontWeight: "600"
              }}
            >
              注册
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
