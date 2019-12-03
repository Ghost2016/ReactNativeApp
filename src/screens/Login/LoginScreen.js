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
import SplashScreen from "react-native-splash-screen";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

export default class LoginScreen extends PureComponent {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }
  state = {
    isLoading: true
  };
  componentDidMount() {
    // setTimeout(() => {
    this.setState({
      isLoading: false
    });
    this.context.navigator.resetTo({
      screen: "example.StartScreen",
      /*style: {
                  backgroundBlur: "none",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  //tapBackgroundToDismiss: true
                }*/
      title: "职么开门",
      navigatorStyle: {
        navBarHidden: true, // 隐藏Tab栏
        // statusBarHidden: true // 隐藏状态栏
        navBarBackgroundColor: "#bfbfbf",
        navBarTextColor: "#fff",

        // ios
        statusBarTextColorScheme: "light"
      }
    });
  }

  /*


 */
  render() {
    const { isLoading } = this.state;

    return (
      <View style={styles.container}>
        <Image
          style={{
            width: width,
            height: height,
            position: "relative",
            top: -30
          }}
          source={require("../../../img/splash_screen.jpg")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", //sdStyles.SDMainColor,
    marginTop: 30,
    flexDirection: "column",
    alignContent: "stretch"
  }
});
