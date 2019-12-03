import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  //Linking,
  //Image,
  ImageBackground,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDButton from "@sd_components/SDButton";
//import Dot from "@sd_components/Dot";
import { navScreen } from "../../styles";
import { isIphoneX, isAndroidX } from "@utils/iphonex";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");
let topOffset = Platform.OS == "android" ? 38.0 : 88.0;
if (isIphoneX()) topOffset = 148.0;
//if (isAndroidX()) topOffset = 88.0;

const originOpacity = 1.0; //0.8;

export default class FullImageScreen extends PureComponent {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      fadeAnim: new Animated.Value(0.1),
      fadeAnimText: new Animated.Value(CSS.pixel(topOffset, true)), //new Animated.Value(0.0),
      fadeAnimTextOpacity: new Animated.Value(originOpacity),
      title: '',
      subTitle: '',
    };
  }

  startAnim(isBack = false, isScrolling = false){
    if(isScrolling){
      return
    }
    this.setState({
      //fadeAnim: new Animated.Value(this.props.currIndex === 2 ? 140 : 40),
      fadeAnimText: new Animated.Value(CSS.pixel(topOffset, true)), //new Animated.Value(isBack ? CSS.pixel(topOffset, true) : 0.0),
      fadeAnimTextOpacity: new Animated.Value(isBack ? 1.0 : originOpacity),
      title: !isBack? this.props.title : '',
      subTitle: !isBack? this.props.subTitle : '',
    });

    setTimeout(() => {
      Animated.parallel([
        /* Animated.timing(this.state.fadeAnimText, {
          toValue: isBack ? 0.0 : CSS.pixel(topOffset, true),
          easing: Easing.inOut(Easing.ease),
          duration: isBack ? 0 : 100
        }), */
        /* Animated.timing(this.state.fadeAnimTextOpacity, {
          toValue: isBack ? originOpacity : 1.0,
          easing: Easing.inOut(Easing.ease),
          duration: isBack ? 0 : 10
        }) */
      ]).start(() => {

      });

    }, 0);
  }

  componentDidMount() {
    this.setState({
      title: this.props.title? this.props.title : '',
      subTitle: this.props.subTitle? this.props.subTitle : '',
    })
    /*setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 10000);*/
    /* this.setState({
      fadeAnim: new Animated.Value(this.props.currIndex === 2 ? 140 : 40),
      fadeAnimText: new Animated.Value(0.1)
    }); */

    //if(this.props.hasLink){

    /* Animated.timing(this.state.fadeAnim, {
      toValue: this.props.currIndex === 2 ? 40 : 140,
      easing: Easing.inOut(Easing.ease),
      duration: this.props.currIndex === 2 ? 1000 : 30
    }).start(); */

    this.startAnim(false, this.props.isScrolling)

    //}
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.isScrolling !== this.props.isScrolling && nextProps.isScrolling){
      this.startAnim(true, nextProps.isScrolling)
    }
    if(nextProps.isScrolling !== this.props.isScrolling && !nextProps.isScrolling){
      this.startAnim(false, nextProps.isScrolling)
    }
  }

  onPressLogin() {
    this.context.navigator.push(
      navScreen("LoginMainScreen", "登录", {
        navigatorStyle: {
          navBarHidden: true,

          //android 透明statusbar
          statusBarColor: "transparent",
          statusBarHidden: true
        }
      })
    );
  }

  onPressSignup() {
    this.context.navigator.push(
      navScreen("RegisterScreen", "注册", {
        navigatorStyle: {
          navBarHidden: true,

          //android 透明statusbar
          statusBarColor: "transparent",
          statusBarHidden: true
        }
      })
    );
  }

  render() {
    const { isLoading } = this.state;
    const { img, children, index, btnBoxStyle, currIndex, title, subTitle } = this.props;
    const hasLink = false;
    return (
      <View
        style={{
          width: width, //CSS.pixel(width),
          height: '100%',//height, //CSS.pixel(height),
          //flex: 1,
          position: "relative",
          top: 0,
          borderWidth: 0,
          backgroundColor: "#fff"
        }}
      >
        <ImageBackground
          resizeMode="stretch"
          borderRadius={0}
          style={{
            width: width, //CSS.pixel(width),
            height: height, //CSS.pixel(height),
            position: "relative",
            //top: CSS.pixel(0, true),
            borderWidth: 0,
            borderColor: "#f00",
            flexDirection: "column",
            justifyContent: "flex-end"
          }}
          source={img}
        >
          {this.state.title ? <Animated.View style={{
            opacity: this.state.fadeAnimTextOpacity,
            flexDirection: "column",
            alignItems: 'center',
            justifyContent: "center",
            position: "absolute",
            top: this.state.fadeAnimText,
            borderWidth: 0,
            width: '100%',
          }}>
            <Text style={{
              fontSize: CSS.textSize(44),
              fontWeight: CSS.SDFontBold,
              justifyContent: "center",
            }}>{this.state.title}</Text>
            <Text style={{
              fontSize: CSS.textSize(28),
              fontWeight: CSS.SDFontNormal,
              justifyContent: "center",
              marginTop: CSS.pixel(10, true),
            }}>{this.state.subTitle}</Text>
          </Animated.View>: null}
          {/*<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',}}>
                  <Dot  />
                  <Dot  />
                  <Dot  />
                </View>*/}
          {hasLink ? (
            <Animated.View
              style={{
                top: this.state.fadeAnim,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f00",
                position: "relative",
                //top: 40,
                height: 120
              }}
            >
              <View
                style={[
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  btnBoxStyle
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    width: CSS.pixel(290),
                    height: CSS.pixel(80, true),
                    borderWidth: 0,
                    borderColor: "#f00",
                    position: "relative",
                    top: CSS.pixel(-87, true),
                    marginHorizontal: CSS.pixel(10)
                  }}
                >
                  <SDButton
                    style={{
                      position: "relative",
                      top: CSS.pixel(-4, true),
                      left: 0
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
                      textAlign: "center"
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
                    top: CSS.pixel(-87, true),
                    marginHorizontal: CSS.pixel(10)
                  }}
                >
                  <SDButton
                    style={{
                      position: "relative",
                      top: CSS.pixel(-4, true),
                      left: 0
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
                      color: "#fff",
                      textAlign: "center"
                    }}
                    title="注册"
                    onPress={this.onPressSignup.bind(this)}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          ) : null}
        </ImageBackground>
      </View>
    );
  }
}
