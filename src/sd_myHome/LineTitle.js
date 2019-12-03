import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image
} from "react-native";
import PropTypes from "prop-types";
import defaultStyle, { antdTabsConfig } from "@styles";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: 30,
    top: 10
  }
});

// 我的主页 tab组件
export default class MyHomeTab extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "flex-end", alignItems: "center" }
        ]}
      >
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "#e1e1e1",
            height: 1,
            width: "100%"
          }}
        />
        <View
          style={{
            top: -8,
            backgroundColor: "#fff",
            paddingLeft: 5,
            paddingRight: 5
          }}
        >
          <Text style={{ color: "#333", fontSize: 12 }}>
            {this.props.title}
          </Text>
        </View>
      </View>
    );
  }
}
