// 数据查询页面
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  Animated,
  Image,
  BackHandler
} from "react-native";
import PropTypes from "prop-types";
import ConfirmButtonGroup from "./ConfirmButtonGroup";
import defaultStyle from "@styles";
import { Navigation } from "react-native-navigation";
import ConnectWithActions from "@src/connectWithActions";
import { dismissLightBox, SDMainColor } from "../../styles";
import { CSS } from "../../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width - 50 * 2,
    height: Dimensions.get("window").height / 2,
    position: "absolute",
    borderRadius: 5,
    backgroundColor: "#1e1e1e",
    left: 50,
    top: "30%"
  }
});

let hotUpdateLightBox = null;

export default class HotUpdateLightBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: "正在检查更新",
      widthOffset: new Animated.Value(0),
      progress: this.props.progress
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.back);
    hotUpdateLightBox = this;
  }
  componentWillUnmount() {
    hotUpdateLightBox = null;
    BackHandler.removeEventListener("hardwareBackPress", this.back);
  }
  back() {
    return false;
  }
  render() {
    const resetStyle = this.props.style || {};
    this.state.widthOffset = new Animated.Value(CSS.pixel(Math.floor((this.state.progress ? this.state.progress : 0)  * 600)));
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center", ...resetStyle }
        ]}
      >
        <View>
          <Image
            source={require("@img/login/login_logo.png")}
            style={{
              width: CSS.pixel(176),
              height: CSS.pixel(240, true)
            }}
            resizeMode="contain"
          />
        </View>
        <View style={{ marginTop: CSS.pixel(100, true) }}>
          <View style={{width: CSS.pixel(600), height: CSS.pixel(10), backgroundColor: '#efefef'}}>
            <Animated.View style={{width: this.state.widthOffset, height: CSS.pixel(10), backgroundColor: SDMainColor}}>
            </Animated.View>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', marginTop: CSS.pixel(30, true)}}>
            <Text style={{color: '#999', fontSize: CSS.textSize(28)}}>正在更新数据{this.state.progress ? (this.state.progress * 100).toString().slice(0, 4): 0}%</Text>
          </View>
        </View>
      </View>
    );
  }
}

export {hotUpdateLightBox};