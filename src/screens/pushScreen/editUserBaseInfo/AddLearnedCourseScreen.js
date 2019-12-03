import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView
} from "react-native";
import PropTypes from "prop-types";
import { navScreen, navRightButton } from "@styles";
import LabelInput from "../../../common/SDLabelInput";
import { Toast } from "antd-mobile";
import ConnectWithActions from "../../../connectWithActions";
import { educationModel } from "../../../types";
import { CSS } from "../../../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  },
  saveBtnBox: {
    marginTop: 20,
    marginBottom: 20,
    height: 46,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden"
  }
});

type Props = {
  educationList: educationModel[],
  selectEducation: educationModel
};

// 添加用户学过的课程
class AddLearnedCourseScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      course: [
        {
          title: "",
          score: ""
        }
      ],
      selectId: this.props.selectEducation ? this.props.selectEducation.id : 0
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentDidMount() {
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "save_addLearnedCourseBtn"
    );
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "save_addLearnedCourseBtn") {
        if (
          this.state.course.filter(c => c.score == "" || c.title == "").length >
          0
        ) {
          Toast.fail("课程信息不能为空");
          return;
        } else {
          Toast.loading("保存中");
          let resetCourse = [];
          this.state.course.map(async item => {
            try {
              let res = await this.props.actions.addCourseItemAction({
                number: parseInt(item.score),
                course_name: item.title,
                education_id: parseInt(this.state.selectId)
              });

              if (res.status != "ok") {
                Toast.fail("请求错误，可能存在相同课程");
                resetCourse.push(item);
              }
            } catch (error) {

            }
          });
          Toast.success("添加成功");
          this.context.navigator.pop();
          return;
          // 保留没有添加成功的课程
          if (resetCourse.length > 0) {
            this.setState({
              course: resetCourse
            });
          } else {
            this.setState(
              {
                course: [
                  {
                    title: "",
                    score: ""
                  }
                ]
              },
              () => {
                Toast.info("添加成功", 1);
              }
            );
          }
        }
      }
    }
  }

  delCourseListItem(index) {
    this.state.course.splice(index, 1);
    this.setState({
      course: [].concat(this.state.course)
    });
  }

  makeCourseInputGroup() {
    let arrHtml = [];

    for (let i = 0; i < this.state.course.length; i++) {
      const element = this.state.course[i];
      arrHtml.push(
        <View
          key={i + ""}
          style={{ marginTop: CSS.pixel(30, true), backgroundColor: "#fff" }}
        >
          {i != 0 ? (
            <View
              style={{
                borderBottomColor: "#f1f1f1",
                borderBottomWidth: 1,
                alignItems: "flex-end",
                paddingHorizontal: 10,
                paddingVertical: 10,
                justifyContent: "flex-end"
              }}
            >
              <TouchableOpacity
                onPress={this.delCourseListItem.bind(this, i)}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 5,
                  paddingVertical: 3,
                  flexDirection: "row"
                }}
              >
                <Image
                  source={require("@img/my/TrackRecord/mine_Resume_ico_delet.png")}
                  style={{ marginRight: 3 }}
                />
                <Text style={{ color: "#fc8824", fontSize: 14 }}>删除</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <LabelInput
            placeholder={"课程名称"}
            // fixStr=" "
            placeholderRight={"请输入课程名称"}
            defaultValue={element.title ? element.title : ""}
            onChange={text => {
              this.state.course[i].title = text;
            }}
          />
          <LabelInput
            placeholder={"考试成绩"}
            defaultValue={element.score ? element.score : ""}
            fixStr="分"
            keyboardType="numeric"
            placeholderRight={"请输入分数"}
            onChange={text => {
              this.state.course[i].score = text;
            }}
          />
        </View>
      );
    }

    return arrHtml;
  }
  setOwnCourse(selectId) {
    this.setState({
      selectId: selectId
    });
  }
  render() {
    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: CSS.pixel(100, true),
            backgroundColor: "#fff"
          }}
        >
          {this.props.selectEducation ? (
            <Text style={{ fontSize: 16, color: "#333" }}>
              {this.props.selectEducation.school.name +
                "   " +
                this.props.selectEducation.degree.name +
                " · " +
                this.props.selectEducation.major.name}
            </Text>
          ) : null}
        </View>

        {this.makeCourseInputGroup()}

        <View style={styles.saveBtnBox}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={0.8}
            onPress={() => {
              this.setState({
                course: [].concat(this.state.course).concat([
                  {
                    title: "",
                    score: ""
                  }
                ])
              });
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 26,
                backgroundColor: "#fed200"
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                添加课程
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  educationList: state.userEducationList
}))(AddLearnedCourseScreen);
