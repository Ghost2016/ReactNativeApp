import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions
} from "react-native";
import { SDMainColor } from "../../../styles";
import PropTypes from "prop-types";
import config from "../../../config";
import { CSS } from "../../../common/SDCSS";

const wIs320 = Dimensions.get("window").width <= 320;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  }
});

// 计算薪资
export default class Salary09 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workYear: "",
      pageIndex: typeof this.props.pageIndex !== 'undefined' ? this.props.pageIndex + "" : "9"
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
  };
  onPressItem(index, text) {
    this.context.refs["calcSalaryScreen"].state.p.ext.q2 = {};
    this.context.refs["calcSalaryScreen"].state.p.ext.q2[index] = text;
    this.context.refs["calcSalaryScreen"].state.choosed[this.state.pageIndex] = true;
    this.context.refs['calcSalaryScreen'].snapNext();
    this.setState({
      workYear: text
    });

    // this.props.actions.calcSalaryAction({

    // });

    // this.context.navigator.push({
    //   screen: `${config.projName}.CalcSalaryResultScreen`,
    //   navigatorStyle: {
    //     tabBarHidden: true,
    //     navBarHidden: true,
    //     statusBarColor: '#000',
    //     // collapsingToolBarImage: "http://lorempixel.com/400/200/", // Collapsing Toolbar image.
    //     // collapsingToolBarImage: require("../../img/topbar.jpg"), // Collapsing Toolbar image. Either use a url or require a local image.
    //     // collapsingToolBarCollapsedColor: "#0f2362", //

    //     // ios
    //     statusBarTextColorScheme: "dark"
    //   }
    // })
  }
  render() {
    return (
      <View
        style={[
          styles.container,
          {
            paddingHorizontal: CSS.pixel(30),
            paddingVertical: CSS.pixel(50, true)
          }
        ]}
      >
        <View>
          <Text
            style={{
              fontSize: CSS.pixel(32),
              color: "#333",
              fontWeight: "bold"
            }}
          >
            同事今天上班提了一个山寨LV的包包，你会
          </Text>
        </View>
        <View
          style={{
            marginTop: CSS.pixel(40, true),
            marginBottom: CSS.pixel(70, true),
            width: CSS.pixel(60),
            borderBottomColor: "#333",
            borderBottomWidth: CSS.pixel(6)
          }}
        />

        <ButtonItem
          checked={this.state.workYear === "默默的称赞" ? true : false}
          onPress={this.onPressItem.bind(this, 1, "默默的称赞")}
          title={"默默的称赞"}
        />
        <ButtonItem
          checked={
            this.state.workYear === "莫不作声，继续做自己的是事情"
              ? true
              : false
          }
          onPress={this.onPressItem.bind(
            this,
            2,
            "莫不作声，继续做自己的是事情"
          )}
          title={"莫不作声，继续做自己的是事情"}
        />
        <ButtonItem
          checked={
            this.state.workYear === "认真的说：\"仿得还不赖，哪买的？\""
              ? true
              : false
          }
          onPress={this.onPressItem.bind(
            this,
            3,
            "认真的说：”仿得还不赖，哪买的？“"
          )}
          title={"认真的说：”仿得还不赖，哪买的？“"}
        />
      </View>
    );
  }
}

class ButtonItem extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          paddingHorizontal: CSS.pixel(26),
          justifyContent: "center",
          borderColor: this.props.checked === true ? SDMainColor : "#e1e1e1",
          borderRadius: CSS.pixel(3),
          borderWidth: 1,
          width: CSS.pixel(570),
          alignItems: "center",
          height: CSS.pixel(70, true),
          marginRight: CSS.pixel(20),
          marginBottom: CSS.pixel(20, true)
        }}
        onPress={this.props.onPress ? this.props.onPress : null}
      >
        <Text
          style={{
            width: '100%',
            flexWrap: 'wrap',
            fontSize: CSS.pixel(28),
            color: this.props.checked ? SDMainColor : "#666"
          }}
        >
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}
