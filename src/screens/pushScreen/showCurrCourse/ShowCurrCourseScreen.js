import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import ShowCurrCourse from "../../../sd_showCurrCourse/ShowCurrCourse";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

//
export default class ShowCurrCourseScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <ShowCurrCourse />
      </View>
    );
  }
}
