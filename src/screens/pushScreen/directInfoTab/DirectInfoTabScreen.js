// 数据查询页面
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import DirectInfoTabs from "../../../sd_directInfoTabs/DirectInfoTabs";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9"
  }
});

// 资讯直击tab屏幕
export default class DirectInfoTabsScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <DirectInfoTabs />
      </View>
    );
  }
}
