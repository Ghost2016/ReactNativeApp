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
import { getSelectorCompanyTableData } from "../selectors";
import CompanyTableItem from "./CompanyTableItem";
import { getMajor, getSchoolLevel } from "../directSelectors";
import SDLoading from "@sd_components/SDLoading";
import Reactotron from 'reactotron-react-native';

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff"
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
class CompanyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  _renderItem({ item, index, separators }) {
    return <CompanyTableItem data={item} />;
  }
  componentDidMount() {
    this.props.actions.getMajorCompanyAction(
      {
        major: this.props.majorName,
        sort: "-person_num",
        degree: this.props.degreeName
      },
      (res) => {
        // Reactotron.log(res);
        this.setState({
          loading: false
        });
      }
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.tbheader}>
          <Text style={[styles.tbheaderCol, { flex: 1 }]}>公司名称</Text>
          <Text style={[styles.tbheaderCol, { width: 80 }]}>选择占比</Text>
          <Text style={[styles.tbheaderCol, { width: 80 }]}>薪资</Text>
        </View>
        {this.state.loading ? <SDLoading /> : null}
        <FlatList
          style={{
            width: "100%"
          }}
          ref={flatList => (this._flatList = flatList)}
          renderItem={this._renderItem}
          data={this.props.tableData.slice(0, 10)}
          keyExtractor={item => "" + item.id}
        />
      </View>
    );
  }
}
export default ConnectWithActions((state, props) => ({
  majorName: getMajor(state, props),
  tableData: getSelectorCompanyTableData(state),
  degreeName: getSchoolLevel(state, props)
}))(CompanyTable);
