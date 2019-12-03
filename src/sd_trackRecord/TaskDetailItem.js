/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform
} from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between"
  }
});

// 我的履历 - 任务量化Item
export default class TaskDetailItem extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: this.props.color || "#fed200",
            borderRadius: 30,
            height: 60,
            width: 60,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 25,
              height: 50,
              width: 50,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#333", fontSize: 18, fontFamily: 'DINCondensedC' }}>
              {this.props.num}
            </Text>
            <Text style={{ color: "#333", fontSize: 12 }}>
              {this.props.unit}
            </Text>
          </View>
        </View>
        <Text style={{ color: "#999", fontSize: 12, marginTop: 5 }}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}
