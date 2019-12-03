/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  FlatList
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../connectWithActions";
import { getSelectorCompanyTableData } from "../selectors";

const styles = StyleSheet.create({
  tbrow: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#efefef"
  },
  tbrowCol: {
    height: 40,
    textAlign: "center",
    lineHeight: 40,
    color: "#333"
  }
});
export default class CompanyTableItem extends React.Component {
  render() {
    return (
      <View style={styles.tbrow}>
        <Text style={[styles.tbrowCol, { flex: 1 }]}>
          {this.props.data.companyName}
        </Text>
        <Text style={[styles.tbrowCol, { width: 80 }]}>
          {this.props.data.percent}
        </Text>
        <Text style={[styles.tbrowCol, { width: 80 }]}>
          {this.props.data.averageSalary}
        </Text>
      </View>
    );
  }
}
