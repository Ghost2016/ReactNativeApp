/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  TextInput,
  ScrollView,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import { SearchBar } from "antd-mobile";

type Props = {
  placeholder: string
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: 50,
    borderColor: "#eeeeee",
    borderBottomWidth: 1,
    justifyContent: "space-around",
    paddingLeft: 16,
    paddingRight: 16
  },
  schoolNameText: {
    color: "#666",
    fontSize: 18
  },
  remarkText: {
    color: "#c5c5c5"
  }
});
export default class JobResult extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.onPressResult}>
          <View>
            <Text style={styles.schoolNameText}>{this.props.name}</Text>
          </View>
          <View>
            <Text style={styles.remarkText}>{this.props.industry}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
