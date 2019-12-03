/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import PropTypes from 'prop-types';
import {Toast} from 'antd-mobile';
import ConnectWithActions from "../connectWithActions";
import { courseModel, educationModel } from "../types";
import { getUserId } from "../directSelectors";
import { CSS } from "../common/SDCSS";
import { SDMainColor, navLightBox, navScreen } from "../styles";
import MoreCourseLightBox from "./MoreCourseLightBox";
import CheckCodeLightBox from "./CheckCodeLightBox";

const styles = StyleSheet.create({});

type Props = {};
let personScreen = null;
// 我的履历 - 教务处查询课程成绩
export default class QuerySchoolCourseResult extends React.PureComponent<
  Props
> {
  constructor(props) {
    super(props);
    this.state = {
      courseList: [
        {
          name: "编译技术",
          score: 95
        },
        {
          name: "编译技术",
          score: 95
        },

        {
          name: "编译技术",
          score: 95
        },
        {
          name: "编译技术",
          score: 95
        },
        {
          name: "编译技术",
          score: 95
        },
        {
          name: "编译技术",
          score: 95
        },
        {
          name: "编译技术",
          score: 95
        }
      ]
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  }
  componentDidMount() {
    personScreen = this.context.refs["personScreen"];


  }
  renderCourseItem() {
    let arrHtml = [];
    for (let i = 0; i < this.state.courseList.length; i++) {
      const element = this.state.courseList[i];
      arrHtml.push(
        <View
          key={i + ""}
          style={{
            height: CSS.pixel(90, true),
            flexDirection: "row",
            borderBottomWidth: i == this.state.courseList.length - 1 ? 0 : 1,
            borderBottomColor: "#efefef"
          }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "#333", fontSize: 14 }}>{element.name}</Text>
          </View>
          <View
            style={{
              width: 120,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                backgroundColor: "#fff9e6",
                alignItems: "center",
                justifyContent: "center",
                width: CSS.pixel(80),
                height: CSS.pixel(50, true)
              }}
            >
              <Text style={{ color: SDMainColor, fontSize: 14 }}>
                {element.score}
              </Text>
            </View>
          </View>
        </View>
      );
    }
    return arrHtml;
  }
  render() {
    return (
      <ScrollView style={{ padding: CSS.pixel(30) }}>
        <View
          style={{ marginTop: CSS.pixel(30, true) }}
          style={{ borderColor: "#efefef", borderWidth: 1, borderTopWidth: 0 }}
        >
          <View
            style={{
              backgroundColor: "#fed200",
              height: CSS.pixel(90, true),
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ fontSize: 14, color: "#fff" }}>课程名称</Text>
            </View>
            <View
              style={{
                width: 120,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ fontSize: 14, color: "#fff" }}>成绩</Text>
            </View>
          </View>
          {this.renderCourseItem()}
        </View>

        <View
          style={{
            marginTop: CSS.pixel(60, true),
            height: CSS.pixel(90, true),
            width: CSS.pixel(600),
            paddingLeft: 20,
            paddingRight: 20,
            overflow: "hidden",
            alignSelf: "center"
          }}
        >
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8} onPress={() => {
            Toast.loading("导入中", 1),
            setTimeout(() => {
              this.context.navigator.popToRoot({
                animated: true,
                animationType: 'fade',
              });
              Toast.loading("正在加载我的履历", 1);
              personScreen && this.context.refs["personScreen"].context.navigator.push(
                navScreen("TrackRecordScreen", "我的履历", {
                  navigatorButtons: {
                    rightButtons: [
                      {
                        icon: require("@img/salary/home_ico_share.png"), // require('../../img/navicon_add.png'), // for icon button, provide the local image asset name
                        id: "track_share" // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                      }
                    ]
                  },
                  animated: Platform.OS == 'ios' ? true : false,
                })
              )
            }, 1000);
          }}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 26,
                backgroundColor: "#fed200"
                // backgroundColor: "#e1e1e1"
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>
                一键导入我的履历
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            padding: CSS.pixel(30),
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 12, color: "#fa8a24", lineHeight: 26 }}>
            导入后能提升个人职么力
          </Text>
        </View>
      </ScrollView>
    );
  }
}
