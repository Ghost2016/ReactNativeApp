// 数据查询页面
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions
} from "react-native";
import UserProfile from "../../../sd_userProfile/UserProfile";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

// 用户基本信息界面
export default class UserProfileScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <UserProfile />
        <View style={{ height: 30 }} />
      </ScrollView>
    );
  }
}
