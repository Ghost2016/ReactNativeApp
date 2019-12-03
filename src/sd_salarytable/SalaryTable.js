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
  //ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../connectWithActions";
import { getSelectorSalaryTableData } from "../selectors";
import SalaryTableItem from "./SalaryTableItem";
import { getUserAllInfo } from "../users/usersSelector";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5
  },
  tbheader: {
    height: 40,
    backgroundColor: "#fed200",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  tbheaderCol: {
    height: 40,
    textAlign: "center",
    lineHeight: 40,
    color: "#333"
  }
});
class SalaryTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      salaryData: []
    }
  }
  _renderItem({ item, index, separators }) {
    return <SalaryTableItem data={item} />;
  }
  componentDidMount() {
    this.props.actions.getProfessionalSalaryAction({
      school_name: this.props.schoolName,
      //work_year: 5,
      //sort: "-avg_salary",
      degree: "不限", //this.props.user.total.degree_name || "不限"
    }).then(res => {
      if(res && res.status == 'ok' && res.results && res.results.length > 0) {
        this.setState({
          salaryData: res.results.map((item, index) => {
            return Object.assign(
              {},
              {
                id: index,
                rank: index + 1,
                //salary: "¥" + item.avg_salary,
                salary: item.median_salary ? "¥" + item.median_salary : "¥" + item.avg_salary,
                major: item.major
              }
            );
          })
        })
      }
    }).catch(err => {

    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.tbheader}>
          <Text style={[styles.tbheaderCol, { width: 80 }]}>排名</Text>
          <Text style={[styles.tbheaderCol, { flex: 1 }]}>专业名称</Text>
          <Text style={[styles.tbheaderCol, { width: 120 }]}>毕业五年薪资</Text>
        </View>
        <FlatList
          style={{
            width: "100%"
          }}
          ref={flatList => (this._flatList = flatList)}
          renderItem={this._renderItem}
          // data={this.props.tableData.slice(0, 10)}
          data={this.state.salaryData.slice(0, 10)}
          keyExtractor={item => "" + item.id}
        />
      </View>
    );
  }
}
export default ConnectWithActions((state, props) => ({
  // tableData: getSelectorSalaryTableData(state),
  user: getUserAllInfo(state, props)
}))(SalaryTable);
