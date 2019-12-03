import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  AlertIOS
} from "react-native";
import PropTypes from "prop-types";
import UserSettingForm from "../../../sd_userSetting/UserSettingForm";
import { CSS } from "../../../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  }
});

// 我的-设置界面
export default class UserSettingScreen extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{marginTop: CSS.pixel(20)}}></View>
        <UserSettingForm />
      </View>
    );
  }
}
