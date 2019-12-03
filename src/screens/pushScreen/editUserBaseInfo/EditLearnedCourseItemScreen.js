import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../../../connectWithActions";
import { Toast } from "antd-mobile";
import { courseModel } from "../../../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    paddingTop: 10
  }
});

type Props = {
  course: courseModel
};

// 编辑某一项学过的课程
class EditLearnedCourseItemScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      scoreText: this.props.course.number + "",
      courseText: this.props.course.course_name
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_editCourseItem") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");

        if (this.state.courseText == "" || this.state.scoreText == "") {
          Toast.fail("课程信息不能为空");
          return;
        } else {
          
          Toast.loading("保存中");
          this.props.actions.updateCourseItemAction(
            {
              id: this.props.course.id,
              number: parseInt(this.state.scoreText),
              course_name: this.state.courseText,
              education_id: this.props.course.education_id
            },
            res => {
              Toast.info("保存成功");
              this.context.navigator.pop();
            }
          );
        }
      }
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 10,
            justifyContent: "center",
            height: 60
          }}
        >
          <TextInput
            underlineColorAndroid={"transparent"}
            style={{ borderBottomWidth: 0 }}
            placeholder="课程名称"
            defaultValue={this.props.course.course_name}
            onChangeText={text => this.state.courseText = text}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            borderTopColor: "#f1f1f1",
            borderTopWidth: 1,
            backgroundColor: "#fff",
            paddingHorizontal: 10,
            justifyContent: "center",
            height: 60
          }}
        >
          <TextInput
            underlineColorAndroid={"transparent"}
            style={{ borderBottomWidth: 0, flex: 1 }}
            placeholder="课程分数"
            keyboardType="numeric"
            defaultValue={this.props.course.number + ""}
            onChangeText={text => this.state.scoreText = text}
          />
          <View
            style={{
              width: 40,
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          >
            <Text style={{ color: "#333" }}>分</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}
export default ConnectWithActions((state, props) => ({}))(
  EditLearnedCourseItemScreen
);
