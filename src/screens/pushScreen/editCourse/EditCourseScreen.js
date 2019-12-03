import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import EditCourseForm from "../../../sd_showCurrCourse/EditCourseForm";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  saveBtnBox: {
    marginTop: 20,
    height: 46,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden"
  }
});

//
export default class EditCourseScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <EditCourseForm />
        <View style={styles.saveBtnBox}>
          <TouchableOpacity style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 26,
                backgroundColor: "#fed200"
              }}
            >
              <Text style={{ color: "#fff" }}>保存</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
