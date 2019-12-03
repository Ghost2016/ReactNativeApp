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
import MyCollectionTab from "../../../sd_myCollection/MyCollectionTab";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

// 我的收藏页面
export default class MyCollectionScreen extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <MyCollectionTab />
      </View>
    );
  }
}
