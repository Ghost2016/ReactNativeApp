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
import { SDMainColor } from "../../../styles/index";
import PropTypes from "prop-types";
import { CSS } from "../../../common/SDCSS";

const wIs320 = Dimensions.get("window").width <= 320;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  }
});

const areaText = {
  北京: "烤鸭文青－羡慕死了，你在帝都。除了吃烤鸭赏话剧，你想在哪个领域深耕？",
  成都: "天腐之国－羡慕死了，你在成都。除了吃串串逗基友，你想在哪个领域深耕？",
  广州: "养生胜地－羡慕死了，你在羊城。除了游珠江喝早茶，你想在哪个领域深耕？",
  杭州: "人间天堂—羡慕死了，你在杭州。除了游西湖品龙井，你想在哪个领域深耕？",
  上海: "红酒小资－羡慕死了，你在魔都。除了品红酒听JAZZ，你想在哪个领域深耕？",
  深圳:
    "土豪扎堆－羡慕死了，你在深圳。除了吸金狂shopping，你想在哪个领域深耕？",
  武汉: "学霸云集－羡慕死了，你在武汉。除了啃鸭脖赏樱花，你想在哪个领域深耕？",
  西安: "千年古都－羡慕死了，你在西安，除了逛皇陵忆历史，你想在哪个领域深耕？",
  重庆: "火锅辣妹－羡慕死了，你在山城。除了吃火锅看美女，你想在哪个领域深耕？"
};

// 计算薪资
export default class Salary01 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      domainText: "",
      cityText: this.props.cityText ? this.props.cityText : ""
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  onPressItem(text) {
    this.context.refs["calcSalaryScreen"].state.p.data.jobType = text;
    this.context.refs["calcSalaryScreen"].state.choosed["1"] = true;
    this.context.refs["calcSalaryScreen"].snapNext();
    this.setState({
      domainText: text
    });
    if (this.context.refs["_salary02"]) {
      this.context.refs["_salary02"].setState({
        jobText: text
      });
    }
  }
  componentDidMount() {
    this.context.refs['_salary01'] = this;
  }
  componentWillUnmount() {
    if (this.context.refs['_salary01']) {
      delete this.context.refs['_salary01'];
    }
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
            {this.state.cityText !== "" ? areaText[this.state.cityText] : "请先选择城市"}
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

        {/* <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
          <CityItem
            checked={this.state.domainText === "IT/互联网" ? true : false}
            title={"IT/互联网"}
            onPress={this.onPressItem.bind(this, "IT/互联网")}
          />
          <CityItem
            checked={this.state.domainText === "传媒/印刷" ? true : false}
            title={"传媒/印刷"}
            onPress={this.onPressItem.bind(this, "IT/互联网")}
          />
          <CityItem
            checked={this.state.domainText === "金融" ? true : false}
            title={"金融"}
            onPress={this.onPressItem.bind(this, "IT/互联网")}
          />
          <CityItem
            checked={this.state.domainText === "服务业" ? true : false}
            title={"服务业"}
            onPress={this.onPressItem.bind(this, "IT/互联网")}
          />
          <CityItem
            checked={this.state.domainText === "工业制造" ? true : false}
            title={"工业制造"}
            onPress={this.onPressItem.bind(this, "IT/互联网")}
          />
        </View> */}
        <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
          <CityItem
            checked={this.state.domainText === "产品狗" ? true : false}
            title={"产品狗"}
            onPress={this.onPressItem.bind(this, "产品狗")}
          />
          <CityItem
            checked={this.state.domainText === "攻城狮" ? true : false}
            title={"攻城狮"}
            onPress={this.onPressItem.bind(this, "攻城狮")}
          />
          <CityItem
            checked={this.state.domainText === "射鸡湿" ? true : false}
            title={"射鸡湿"}
            onPress={this.onPressItem.bind(this, "射鸡湿")}
          />
          <CityItem
            checked={this.state.domainText === "运营人猿" ? true : false}
            title={"运营人猿"}
            onPress={this.onPressItem.bind(this, "运营人猿")}
          />
          <CityItem
            checked={this.state.domainText === "市场商务" ? true : false}
            title={"市场商务"}
            onPress={this.onPressItem.bind(this, "市场商务")}
          />
          <CityItem
            checked={this.state.domainText === "暖心行政" ? true : false}
            title={"暖心行政"}
            onPress={this.onPressItem.bind(this, "暖心行政")}
          />
        </View>
      </View>
    );
  }
}

class CityItem extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          paddingHorizontal: CSS.pixel(26),
          justifyContent: "center",
          borderColor: this.props.checked === true ? SDMainColor : "#e1e1e1",
          borderRadius: CSS.pixel(3),
          borderWidth: 1,
          height: CSS.pixel(70, true),
          marginRight: CSS.pixel(20),
          marginBottom: CSS.pixel(20, true)
        }}
        onPress={this.props.onPress ? this.props.onPress : null}
      >
        <Text
          style={{
            fontSize: CSS.pixel(30),
            color: this.props.checked ? SDMainColor : "#666"
          }}
        >
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}
