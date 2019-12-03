import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Image,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform
} from "react-native";

import { navScreen } from "../../styles";

const styles = StyleSheet.create({
  img: {
    width: Dimensions.get("window").width,
    height: 180
  },
  titleBox: {
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    display: "flex",
    fontSize: 20,
    color: "#000"
  },
  subtitleBox: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  subtitle: {
    fontSize: 12,
    color: "#999",
    justifyContent: "center",
    lineHeight: 20,
    textAlign: "center"
  },
  appRemark: {
    height: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  appRemarkText: {
    fontSize: 18,
    color: "#000",
    textAlign: "center"
  },
  btnGroup: {
    height: 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  btnBox: {
    display: "flex",
    width: 130,
    height: 50,
    backgroundColor: "#b5b5b5",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default class LoginRealScreen extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };

  onNavigatorEvent(event) {
    //console.log("event", event);
    if (event.type == "NavBarButtonPress") {
      /*if (config.isDev)
        actionGotoGrow(store, loginActions, event, "after-login");*/
    }
  }

  componentDidMount() {
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
    //自动跳转到成长页面，方便开发
    // if (config.isDev) store.dispatch(loginActions());
    return;

    //raise error test
    if (Platform.OS == "ios") {
      throw new Error("test error ios");
    } else {
      throw new Error("test error android");
    }
  }

  // 进入登陆界面
  onPressLogin() {
    this.context.navigator.push(
      navScreen("LoginMainScreen", "登录", {
        navigatorStyle: {
          navBarHidden: true
        }
      })
    );
    // this.context.navigator.push({
    //   screen: "example.LoginMainScreen",
    //   title: "登录",
    //   backButtonTitle: "",
    //   navigatorStyle: {
    //     navBarButtonColor: "#fff"
    //   }
    // });
  }
  // 进入注册界面
  onPressRegister() {
    // ios
    this.context.navigator.push(
      navScreen("RegisterScreen", "注册", {
        navigatorStyle: {
          navBarHidden: true
        }
      })
    );
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Image
            style={styles.img}
            resizeMode="stretch"
            source={require("../../../img/launch01.jpg")}
          />
          <View style={styles.titleBox}>
            <Text style={styles.title}>引导在校大学生成才</Text>
          </View>
          <View style={styles.subtitleBox}>
            <Text style={styles.subtitle}>
              以海量毕业生职业成长数据为基础，为在校大学生提供最科学，最快捷的职业引导，让用户通过职业生涯规划路线不断进步，成为更优质的人才。
            </Text>
          </View>
          <View style={styles.appRemark}>
            <Text style={styles.appRemarkText}>多纬度职场就业大数据</Text>
          </View>
          <View style={styles.appRemark}>
            <Text style={styles.appRemarkText}>制定科学的职业规划</Text>
          </View>
          <View style={styles.appRemark}>
            <Text style={styles.appRemarkText}>逐步落实职业成长路径</Text>
          </View>
        </ScrollView>
        <View style={styles.btnGroup}>
          <TouchableOpacity onPress={this.onPressLogin.bind(this)}>
            <View style={[styles.btnBox, { marginRight: 10 }]}>
              <Text style={{ color: "#fff" }}>
                {this.context.intl.formatMessage({ id: "Log in" })}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPressRegister.bind(this)}>
            <View style={[styles.btnBox, { backgroundColor: "#a0a0a0" }]}>
              <Text style={{ color: "#fff" }}>
                {this.context.intl.formatMessage({ id: "Regis" })}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
