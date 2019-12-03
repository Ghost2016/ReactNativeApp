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
import LabelInput from "../common/SDLabelInput";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  }
});

//
export default class EditCourseForm extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <View style={styles.container}>
        <LabelInput placeholder="课程名称" defaultValue="计算机工程" />
        <LabelInput placeholder="考试成绩" defaultValue="94" fixStr="分" />
      </View>
    );
  }
}
