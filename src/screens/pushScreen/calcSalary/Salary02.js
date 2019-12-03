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
import { CSS } from "../../../common/SDCSS";
import { isIphoneX } from "../../../utils/iphonex";

const wIs320 = Dimensions.get("window").width <= 320;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  }
});

const labelJson = {
  "产品狗": ['产品经理', '产品总监', '产品助理'],
  "攻城狮": [
    'C/C++',
    'C#',
    'Java',
    'Python',
    'PHP',
    'JavaScript',
    'Android',
    'iOS',
    '前端',
    '后端',
    '测试',
    '运维',
    '项目经理',
    '架构师',
    '总监',
  ],
  "射鸡湿": [
    '视觉设计',
    '交互设计',
    '平面设计',
    '游戏美术',
    '动画',
    '原画',
    '用研',
    'UI',
    'UE',
    'WEB',
    'APP',
    '总监',
  ],
  "运营人猿": ['运营专员', '运营总监', '编辑', '主编'],
  "市场商务": ['销售', '市场推广', '总监'],
  "暖心行政": ['行政', '人事', '财务', '客服', '总监/经理', '助理'],
};


// 职位标签
export default class Salary02 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectLabel: [],
      jobText: this.props.jobText ? this.props.jobText: "",
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    this.context.refs['_salary02'] = this;
  }
  componentWillUnmount() {
    if (this.context.refs['_salary02']) {
      delete this.context.refs['_salary02'];
    }
  }
  onPressItem(text) {
    // if (this.state.selectLabel.indexOf(text) >= 0) {
    //   let newLabel = this.state.selectLabel.filter(c => c != text);
    //   this.setState({
    //     selectLabel: newLabel
    //   }, () => {
    //     this.context.refs[
    //       "calcSalaryScreen"
    //     ].state.p.data.secondClass = this.state.selectLabel

    //     if (this.state.selectLabel.length > 0) {
    //       this.context.refs["calcSalaryScreen"].state.choosed['2'] = true;
    //       this.context.refs["calcSalaryScreen"].setState({
    //         nextDisabled: false,
    //       });
    //     } else {
    //       this.context.refs["calcSalaryScreen"].state.choosed['2'] = false;
    //       this.context.refs["calcSalaryScreen"].setState({
    //         nextDisabled: true
    //       });
    //     }
    //   });
    // } else {
    //   this.setState({
    //     selectLabel: [text].concat(this.state.selectLabel)
    //   }, () => {
    //     this.context.refs[
    //       "calcSalaryScreen"
    //     ].state.p.data.secondClass = this.state.selectLabel;
    //     if (this.state.selectLabel.length > 0) {
    //       this.context.refs["calcSalaryScreen"].state.choosed['2'] = true;
    //       this.context.refs["calcSalaryScreen"].setState({
    //         nextDisabled: false
    //       });
    //     } else {
    //       this.context.refs["calcSalaryScreen"].state.choosed['2'] = false;
    //       this.context.refs["calcSalaryScreen"].setState({
    //         nextDisabled: true
    //       });
    //     }
    //   });
    // }

    this.context.refs["calcSalaryScreen"].state.p.data.secondClass = [text];
    this.context.refs["calcSalaryScreen"].state.choosed["2"] = true;
    this.context.refs["calcSalaryScreen"].snapNext();
    this.setState({
      selectLabel: [text]
    });


    //   return;
    // } else {
    //   this.setState({
    //     jobText: text
    //   });
    // }
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
            选择职位标签
          </Text>
        </View>
        <View
          style={{
            marginTop: CSS.pixel(40, true),
            marginBottom: isIphoneX()
              ? CSS.pixel(50, true)
              : CSS.pixel(70, true),
            width: CSS.pixel(60),
            borderBottomColor: "#333",
            borderBottomWidth: CSS.pixel(6)
          }}
        />

        <GroupItem groupName={this.state.jobText}>
        {
          this.state.jobText !== "" ? labelJson[this.state.jobText].map((item, index) => {
            return (
              <CityItem
                key={index + ""}
                checked={
                  this.state.selectLabel.indexOf(item) >= 0 ? true : false
                }
                title={item}
                onPress={this.onPressItem.bind(this, item)}
              />
            )
          }): null
        }

        </GroupItem>
      </View>
    );
  }
}

class GroupItem extends React.Component {
  render() {
    return (
      <View>
        <Text
          style={{
            color: "#999",
            fontSize: CSS.pixel(28),
            marginBottom: CSS.pixel(20)
          }}
        >
          {this.props.groupName}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {this.props.children}
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
          height: isIphoneX() ? CSS.pixel(60, true) : CSS.pixel(70, true),
          marginRight: CSS.pixel(20),
          marginBottom: isIphoneX() ? CSS.pixel(14, true) : CSS.pixel(20, true)
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
