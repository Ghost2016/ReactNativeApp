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
    borderBottomColor: "#eee",

    borderLeftWidth: 1,
    borderLeftColor: "#efefef",

    borderRightWidth: 1,
    borderRightColor: "#efefef"
  },
  tbrowCol: {
    height: 40
  }
});
export default class SalaryTableItem extends React.Component {
  render() {
    return (
      <View style={styles.tbrow}>
        <View
          style={[
            styles.tbrowCol,
            { width: 80, justifyContent: "center", alignItems: "center" }
          ]}
        >
          <View
            style={{
              width: 20,
              height: 20,
              backgroundColor: this.props.data.rank > 3 ? "#dcdcdc" : "#fed200",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* {this.props.data.companyName} */}
            <Text style={{ color: this.props.data.rank > 3 ? "#fff" : '#333', fontSize: 14 }}>
              {this.props.data.rank}
            </Text>
          </View>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 14, color: "#999" }}>
            {/* {this.props.data.averageSalary} */}
            {this.props.data.major}
          </Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 14, color: "#999" }}>
            {/* {this.props.data.percent} */}
            {this.props.data.salary}
          </Text>
        </View>
      </View>
    );
  }
}
