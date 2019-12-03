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
import { courseModel, educationModel } from "../types";
import { getUserId } from "../directSelectors";
import { CSS } from "../common/SDCSS";
import { SDMainColor, navLightBox } from "../styles";
import MoreCourseLightBox from "./MoreCourseLightBox";
import { getCourseType } from "../utils/funcs";

const styles = StyleSheet.create({});

type Props = {
  userId: number,
  courseList: courseModel[],
  educationList: educationModel[]
};

// 我的履历 - 所学课程
class LearnCourse extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.actions.getCourseListAction({
      id: this.props.userId,
      size: 999
    });
  }
  renderCourseList() {
    let _this = this;
    let arrHtml = this.props.educationList.map((itemEdu, indexRoot, self) => {
      let arrCourse = _this.props.courseList
        .filter(c => c.education_id == itemEdu.id)
        .map((itemCourse, index, self) => {
          return (
            <CourseItem
              is_default={
                itemCourse.course && itemCourse.is_system ? true : false
              }
              score={itemCourse.number}
              key={itemCourse.id + ""}
              course={itemCourse.course_name}
              type={getCourseType(itemCourse.course_category)}
              style={{
                marginBottom: index == self.length - 1 ? 0 : 10
              }}
            />
          );
        });
      if (this.props.isSavePic && itemEdu.course_status != "ok") {
        return null;
      }
      return (
        <View
          key={indexRoot + ""}
          style={{
            minHeight: this.props.isSavePic ? CSS.pixel(120, true) : CSS.pixel(300, true),
            // marginTop: indexRoot == 0 ? 0 : CSS.pixel(40),
            marginBottom: indexRoot >= (self.length - 1) ? 0 : CSS.pixel(40),
            display: arrCourse.length <= 0 && itemEdu.course_status == 'new' ? 'none' : 'flex'
          }}
        >
          <View
            style={{
              backgroundColor: "#fed200",
              height: CSS.pixel(60, true),
              justifyContent: "center",
              paddingLeft: CSS.pixel(30)
            }}
          >
            <Text style={{ fontSize: 14, color: "#333" }}>{`${
              itemEdu.school.name
            } ${itemEdu.degree.name} · ${itemEdu.major.name}`}</Text>
          </View>
          <View
            style={{
              flex: 1,
              borderColor: "#efefef",
              borderWidth: 1,
              borderTopWidth: 0
            }}
          >
            {arrCourse.length <= 0 ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {itemEdu.course_status == "doing" ? (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1
                    }}
                  >
                    <View>
                      <Text
                        style={{ color: "#333", fontSize: CSS.textSize(40) }}
                      >
                        正在验证中.......
                      </Text>
                    </View>
                    <View
                      style={{
                        marginTop: CSS.pixel(20),
                        paddingHorizontal: CSS.pixel(60)
                      }}
                    >
                      <Text
                        style={{
                          color: "#999",
                          fontSize: CSS.textSize(24),
                          lineHeight: CSS.pixel(30),
                          textAlign: "center"
                        }}
                      >
                        我们将验证你的教务系统信息，验证成功后将自动导入你的在校成绩。
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text style={{ fontSize: 14, color: "#999" }}>暂无记录，教务系统账号密码有误</Text>
                )}
              </View>
            ) : (
              <View>
                <View style={{paddingHorizontal: CSS.pixel(12), paddingTop: CSS.pixel(30), justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                  <View style={{flex: 1, marginBottom: CSS.pixel(30), backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', height: CSS.pixel(60)}}>
                    <Text style={{color: '#333', fontSize: CSS.textSize(32)}}>GPA	：{itemEdu.gpa}</Text>
                  </View>
                </View>
                {
                  this.props.isSavePic ? null :
                  <View style={{padding: CSS.pixel(30), paddingLeft: 0, paddingTop: 0}}>
                  {arrCourse.slice(0, 2)}
                  {arrCourse.length > 2 ? (
                    <View style={{ alignItems: "center" }}>
                      <TouchableOpacity
                        onPress={() => {
                          navLightBox("LightBoxScreen", {
                            passProps: {
                              screen: () => (
                                <MoreCourseLightBox
                                  education={itemEdu}
                                  schoolName={itemEdu.school.name}
                                  major={itemEdu.major.name}
                                  level={itemEdu.degree.name}
                                />
                              )
                            }
                          });
                        }}
                      >
                        <Text style={{ fontSize: 12, color: SDMainColor }}>
                          查看更多>>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  </View>
                  }
              </View>
            )}
          </View>
        </View>
      );
    });
    return arrHtml;
  }
  render() {
    if (this.props.isSavePic && this.props.educationList.every(c => c.course_status != 'ok')) {
      return null;
    }
    return !this.props.educationList.some(
      c => c.course_status == "doing" || c.course_status == "ok"
    ) ? null : (
      <View
        style={{
          backgroundColor: "#fff",
          paddingHorizontal: CSS.pixel(20),
          paddingTop: this.props.educationList.some(
            c => c.course_status == "doing" || c.course_status == "ok"
          )
            ? Platform.OS == "ios"
              ? CSS.pixel(94)
              : CSS.pixel(94)
            : CSS.pixel(60),
          paddingBottom: CSS.pixel(40)
        }}
      >
        <View
          style={{
            position: "absolute",
            right: CSS.pixel(10),
            top: CSS.pixel(30),
            zIndex: 2
          }}
        >
          {this.props.edit ? this.props.edit() : null}
        </View>
        {this.renderCourseList()}
      </View>
    );
  }
}

export class CourseItem extends React.PureComponent {
  render() {
    const _style = this.props.style || {};
    return (
      <View
        style={{
          height: CSS.pixel(60, true),
          flexDirection: "row",
          marginBottom: 10,
          ..._style
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: CSS.pixel(60)
          }}
        >
          <Image
            source={require("@img/my/TrackRecord/mine_Resume_ico_YiRenZheng.png")}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            numberOfLines={1}
            style={{ fontSize: CSS.textSize(28), color: "#333" }}
          >
            {this.props.course} ({this.props.type})
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#FED200",
            marginRight: CSS.pixel(50),
            alignItems: "center",
            justifyContent: "center",
            width: CSS.pixel(80),
            height: CSS.pixel(50, true)
          }}
        >
          <Text
            style={{
              color: "#333",
              fontSize: CSS.textSize(28),
              fontWeight: "600"
            }}
          >
            {this.props.score}
          </Text>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  courseList: state.userCourseList,
  userId: getUserId(state),
  educationList: state.userEducationList
}))(LearnCourse);
