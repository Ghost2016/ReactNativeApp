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
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../connectWithActions";
import { CSS } from "../common/SDCSS";
import { dismissLightBox, navScreen } from "../styles";
import { CourseItem } from "./LearnCourse";
import ImportSchoolCourse from "./ImportSchoolCourse";
import { educationModel } from "../types";
import SDTouchOpacity from "../common/SDTouchOpacity";

const styles = StyleSheet.create({});

type Props = {
  education: educationModel
};

// 我的履历 - 提示可以导入学校成绩的弹窗
export default class ImportCourseLightBox extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  render() {
    return (
      <View
        style={{
          position: "absolute",
          width: Dimensions.get("window").width - 2 * 30,
          left: 30,
          top: 200,
          backgroundColor: "#fff",
          borderRadius: 5,
          overflow: "hidden"
        }}
      >
        <View
          style={{
            position: "absolute",
            right: CSS.pixel(30),
            top: CSS.pixel(30),
            zIndex: 2
          }}
        >
          <SDTouchOpacity
            onPress={() => {
              dismissLightBox();
            }}
          >
            <Image
              source={require("@img/my/TrackRecord/mine_Resume_delete.png")}
            />
          </SDTouchOpacity>
        </View>
        <View style={{paddingHorizontal: CSS.pixel(50), paddingTop: CSS.pixel(70), flex: 1}}>
          <View style={{ justifyContent: 'center', alignItems: "center" }}>
            <Text style={{ fontSize: CSS.pixel(34), color: '#333', fontWeight: "700" }}>在校成绩</Text>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: CSS.pixel(78)
            }}
          >
            <Text style={{ textAlign: 'center', fontSize: CSS.pixel(28), color: '#333', lineHeight: CSS.pixel(40)}}>
              {`你所添加的`}
              {this.props.education ? (
                <Text style={{ fontSize: CSS.pixel(28), color: '#000', fontWeight: "600" }}>{`“${
                  this.props.education.school.name
                } ${this.props.education.degree.name}·${
                  this.props.education.major.name
                }”`}</Text>
              ) : null}

              {`在校成绩可通过教务系统查询导入了。`}
            </Text>
          </View>

          <View style={{height: CSS.pixel(120), width: '100%'}}></View>
        </View>
        
        <SDTouchOpacity
          onPress={() => {
            dismissLightBox();
            this.context.refs["_trackRecord"].context.navigator.push(
              navScreen("PushScreen", "添加在校成绩", {
                passProps: {
                  screen: () => (
                    <ImportSchoolCourse checked={true} education={this.props.education} />
                  ),
                  fullScreen: true,
                  noScrollView: true,
                  header: {
                    title: "添加在校成绩"
                  }
                }
              })
            );
          }}
          style={{
            backgroundColor: "#fed200",
            height: CSS.pixel(80),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: CSS.pixel(30), color: "#333" }}>添加在校成绩</Text>
        </SDTouchOpacity>
      </View>
    );
  }
}
