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

// 计算薪资
export default class Salary00 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      areaText: ""
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  onPressItem(text) {
    this.context.refs["calcSalaryScreen"].state.p.data.city = text;
    this.context.refs["calcSalaryScreen"].state.choosed["0"] = true;
    this.context.refs['calcSalaryScreen'].snapNext();
    this.setState({
      areaText: text
    });
    if (this.context.refs['_salary01']) {
      this.context.refs['_salary01'].setState({
        cityText: text
      })
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
              fontWeight: "bold"
            }}
          >
            日照香炉生紫烟，姐们儿你在哪混圈？
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
          <CityItem
            title={"北京"}
            checked={this.state.areaText === "北京" ? true : false}
            onPress={this.onPressItem.bind(this, "北京")}
          />
          <CityItem
            title={"上海"}
            checked={this.state.areaText === "上海" ? true : false}
            onPress={this.onPressItem.bind(this, "上海")}
          />
          <CityItem
            title={"广州"}
            checked={this.state.areaText === "广州" ? true : false}
            onPress={this.onPressItem.bind(this, "广州")}
          />
          <CityItem
            title={"深圳"}
            checked={this.state.areaText === "深圳" ? true : false}
            onPress={this.onPressItem.bind(this, "深圳")}
          />
          <CityItem
            title={"杭州"}
            checked={this.state.areaText === "杭州" ? true : false}
            onPress={this.onPressItem.bind(this, "杭州")}
          />
          <CityItem
            title={"成都"}
            checked={this.state.areaText === "成都" ? true : false}
            onPress={this.onPressItem.bind(this, "成都")}
          />
          <CityItem
            title={"重庆"}
            checked={this.state.areaText === "重庆" ? true : false}
            onPress={this.onPressItem.bind(this, "重庆")}
          />
          <CityItem
            title={"武汉"}
            checked={this.state.areaText === "武汉" ? true : false}
            onPress={this.onPressItem.bind(this, "武汉")}
          />
          <CityItem
            title={"西安"}
            checked={this.state.areaText === "西安" ? true : false}
            onPress={this.onPressItem.bind(this, "西安")}
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
          height: CSS.pixel(70),
          marginRight: CSS.pixel(20),
          marginBottom: CSS.pixel(20)
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
