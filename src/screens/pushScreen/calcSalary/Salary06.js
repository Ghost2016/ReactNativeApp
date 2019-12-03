import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Dimensions
} from "react-native";
import { SDMainColor } from "../../../styles";
import PropTypes from "prop-types";
import { CSS } from "../../../common/SDCSS";
import { isIphoneX } from "../../../utils/iphonex";

const wIs320 = Dimensions.get("window").width <= 320;

const c_01 = require("@img/home/home_ico_Aries_nor.png"); // 白羊座
const s_01 = require("@img/home/home_ico_Aries_sel.png");

const c_02 = require("@img/home/home_ico_Taurus_nor.png"); // 金牛座
const s_02 = require("@img/home/home_ico_Taurus_sel.png");

const c_03 = require("@img/home/home_ico_Gemini_nor.png"); // 双子座
const s_03 = require("@img/home/home_ico_Gemini_sel.png");

const c_04 = require("@img/home/home_ico_Cancer_nor.png"); // 巨蟹座
const s_04 = require("@img/home/home_ico_Cancer_sel.png");

const c_05 = require("@img/home/home_ico_Leo_nor.png"); // 狮子座
const s_05 = require("@img/home/home_ico_Leo_sel.png");

const c_06 = require("@img/home/home_ico_Virgo_nor.png"); // 处女座
const s_06 = require("@img/home/home_ico_Virgo_sel.png");

const c_07 = require("@img/home/home_ico_Libra_nor.png"); // 天秤座
const s_07 = require("@img/home/home_ico_Libra_sel.png");

const c_08 = require("@img/home/home_ico_Scorpio_nor.png"); // 天蝎座
const s_08 = require("@img/home/home_ico_Scorpio_sel.png");

const c_09 = require("@img/home/home_ico_Sagittarius_nor.png"); // 射手座
const s_09 = require("@img/home/home_ico_Sagittarius_sel.png");

const c_10 = require("@img/home/home_ico_Capricorn_nor.png"); // 摩羯座
const s_10 = require("@img/home/home_ico_Capricorn_sel.png");

const c_11 = require("@img/home/home_ico_Aquarius_nor.png"); // 水瓶座
const s_11 = require("@img/home/home_ico_Aquarius_sel.png");

const c_12 = require("@img/home/home_ico_Pisces_nor.png"); // 双鱼座
const s_12 = require("@img/home/home_ico_Pisces_sel.png");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  }
});

// 计算薪资
export default class Salary06 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      constellationText: "",
      pageIndex: typeof this.props.pageIndex !== 'undefined' ? this.props.pageIndex + "" : "6"
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  onPressItem(text) {
    // if (this.state.constellationText == text) {
    this.context.refs["calcSalaryScreen"].state.p.data.constellation = text;
    this.context.refs["calcSalaryScreen"].state.choosed[this.state.pageIndex] = true;
    this.context.refs['calcSalaryScreen'].snapNext();
    this.setState({
      constellationText: text
    });
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
              fontWeight: "bold",
              lineHeight: CSS.pixel(40, true)
            }}
          >
            这年头，新朋友认识不问问星座都不好意思聊天，那你是？
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
        <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
          <ConstellationItem
            onPress={this.onPressItem.bind(this, "白羊座")}
            title="白羊座"
            checked={this.state.constellationText == "白羊座" ? true : false}
            icon={this.state.constellationText == "白羊座" ? s_01 : c_01}
          />
          <ConstellationItem
            onPress={this.onPressItem.bind(this, "金牛座")}
            title="金牛座"
            checked={this.state.constellationText == "金牛座" ? true : false}
            icon={this.state.constellationText == "金牛座" ? s_02 : c_02}
          />
          <ConstellationItem
            onPress={this.onPressItem.bind(this, "双子座")}
            title="双子座"
            checked={this.state.constellationText == "双子座" ? true : false}
            icon={this.state.constellationText == "双子座" ? s_03 : c_03}
          />
          <ConstellationItem
            onPress={this.onPressItem.bind(this, "巨蟹座")}
            title="巨蟹座"
            checked={this.state.constellationText == "巨蟹座" ? true : false}
            icon={this.state.constellationText == "巨蟹座" ? s_04 : c_04}
            marginRight={0}
          />
          <ConstellationItem
            onPress={this.onPressItem.bind(this, "狮子座")}
            title="狮子座"
            checked={this.state.constellationText == "狮子座" ? true : false}
            icon={this.state.constellationText == "狮子座" ? s_05 : c_05}
          />
          <ConstellationItem
            onPress={this.onPressItem.bind(this, "处女座")}
            title="处女座"
            checked={this.state.constellationText == "处女座" ? true : false}
            icon={this.state.constellationText == "处女座" ? s_06 : c_06}
          />
          <ConstellationItem
            onPress={this.onPressItem.bind(this, "天秤座")}
            title="天秤座"
            checked={this.state.constellationText == "天秤座" ? true : false}
            icon={this.state.constellationText == "天秤座" ? s_07 : c_07}
          />
          <ConstellationItem
            onPress={this.onPressItem.bind(this, "天蝎座")}
            title="天蝎座"
            checked={this.state.constellationText == "天蝎座" ? true : false}
            icon={this.state.constellationText == "天蝎座" ? s_08 : c_08}
            marginRight={0}
          />
          <ConstellationItem
            onPress={this.onPressItem.bind(this, "射手座")}
            title="射手座"
            checked={this.state.constellationText == "射手座" ? true : false}
            icon={this.state.constellationText == "射手座" ? s_09 : c_09}
          />
          <ConstellationItem
            onPress={this.onPressItem.bind(this, "摩羯座")}
            title="摩羯座"
            checked={this.state.constellationText == "摩羯座" ? true : false}
            icon={this.state.constellationText == "摩羯座" ? s_10 : c_10}
          />
          <ConstellationItem
            onPress={this.onPressItem.bind(this, "水瓶座")}
            title="水瓶座"
            checked={this.state.constellationText == "水瓶座" ? true : false}
            icon={this.state.constellationText == "水瓶座" ? s_11 : c_11}
          />
          <ConstellationItem
            onPress={this.onPressItem.bind(this, "双鱼座")}
            title="双鱼座"
            checked={this.state.constellationText == "双鱼座" ? true : false}
            icon={this.state.constellationText == "双鱼座" ? s_12 : c_12}
            marginRight={0}
          />
        </View>
      </View>
    );
  }
}

class ConstellationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: this.props.icon
    };
  }
  componentWillReceiveProps(next) {
    this.setState({
      icon: next.icon
    });
  }
  render() {
    return (
      <TouchableOpacity
        style={{
          justifyContent: "center",
          width: CSS.pixel(100),
          marginRight:
            typeof this.props.marginRight !== "undefined"
              ? this.props.marginRight
              : CSS.pixel(52),
          marginBottom: isIphoneX() ? CSS.pixel(30, true) : CSS.pixel(60, true)
        }}
        onPress={this.props.onPress ? this.props.onPress : null}
      >
        <View style={{ width: CSS.pixel(100), height: CSS.pixel(100) }}>
          <Image
            source={this.state.icon}
            style={{ width: CSS.pixel(100), height: CSS.pixel(100) }}
            resizeMode="stretch"
          />
        </View>
        <Text
          style={{
            fontSize: CSS.pixel(30),
            color: this.props.checked ? "#333" : "#999",
            marginTop: CSS.pixel(10, true)
          }}
        >
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}
