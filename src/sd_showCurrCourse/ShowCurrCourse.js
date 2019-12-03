import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import SDList from "../common/SDList";
import PropTypes from "prop-types";
import { navScreen } from "@styles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

//
export default class AddNewCourse extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <View style={styles.container}>
        <SDList
          listOptions={[
            {
              name: "计算机科学与技术",
              subTitle: "考试成绩：94分",
              direction: "编辑",
              directionStyle: {
                fontSize: 12,
                color: "#333"
              },
              onPress: () => {
                this.context.navigator.push(
                  navScreen("EditCourseScreen", "编辑所选课程")
                );
              }
            },
            {
              name: "C++语言",
              subTitle: "考试成绩：92分",
              direction: "编辑",
              directionStyle: {
                fontSize: 12,
                color: "#333"
              },
              onPress: () => {
                this.context.navigator.push(
                  navScreen("EditCourseScreen", "编辑所选课程")
                );
              }
            }
          ]}
        />
      </View>
    );
  }
}
