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
import ConnectWithActions from "../connectWithActions";
import { CSS } from "../common/SDCSS";
import { dismissLightBox } from "../styles";
import { CourseItem } from "./LearnCourse";
import connectWithActions from "../connectWithActions";
import { educationModel, courseModel } from "../types";
import { getCourseType } from "../utils/funcs";

const styles = StyleSheet.create({});

type Props = {
  schoolName: string,
  level: string,
  major: string,
  education: educationModel,
  courseList: courseModel[]
};

// 我的履历 - 点击更多课程的弹窗
class MoreCourseLightBox extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View
        style={{
          position: "absolute",
          width: Dimensions.get("window").width - 2 * 30,
          left: 30,
          top: 100,
          backgroundColor: "#fff",
          borderRadius: 5
        }}
      >
        <View
          style={{
            position: "absolute",
            right: CSS.pixel(30),
            top: CSS.pixel(30)
          }}
        >
          <TouchableOpacity
            onPress={() => {
              dismissLightBox();
            }}
          >
            <Image source={require("@img/my/TrackRecord/mine_Resume_delete.png")} />
          </TouchableOpacity>
        </View>
        <View
          style={{ marginTop: CSS.pixel(80, true), alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600" }}>在校成绩</Text>
        </View>
        <View style={{ alignItems: "center", marginTop: CSS.pixel(60, true) }}>
          <Text style={{ fontSize: 16, color: "#333" }}>{`${
            this.props.schoolName
          } ${this.props.level}·${this.props.major}`}</Text>
        </View>
        <ScrollView style={{maxHeight: CSS.pixel(600, true), marginTop: CSS.pixel(60, true), paddingBottom: CSS.pixel(30), paddingLeft: CSS.pixel(30)}}>
          {this.props.courseList.filter(c => c.education_id == this.props.education.id).map(item => {
            return (
              <CourseItem key={item.id + ""} type={getCourseType(item.course_category)}  is_default={item.is_system ? item.is_system: false} score={item.number} course={item.course_name} />
            )
          })}
        </ScrollView>
      </View>
    );
  }
}

export default connectWithActions((state, props) => ({
  courseList: state.userCourseList
}))(MoreCourseLightBox)
