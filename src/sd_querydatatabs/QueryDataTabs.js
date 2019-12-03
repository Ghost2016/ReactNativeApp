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
import { Tabs } from "antd-mobile";
import PropTypes from "prop-types";
import QuerySchoolView from "./queryView/tabView/QuerySchoolView";
import QueryMajorView from "./queryView/tabView/QueryMajorView";
import QueryJobView from "./queryView/tabView/QueryJobView";
import QueryIndustryView from "./queryView/tabView/QueryIndustryView";
import ConnectWithActions from "../connectWithActions";
import SDTabs2 from "../sd_components/SDTabs2";
import { CSS } from "../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  }
});
class QueryDataTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      collectData: []
    };
    this.tabsConfig = {
      tabBarUnderlineStyle: {
        //tabBar 下划线样式
        backgroundColor: "#fed200"
      },
      tabBarBackgroundColor: "#fff", //tabBar背景色
      tabBarActiveTextColor: "#fed200", // tabBar激活Tab文字颜色
      tabBarInactiveTextColor: "#666", // tabBar非激活Tab文字颜色
      tabBarTextStyle: {} //tabBar文字样式
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };

  onTabChange(index) {
    this.setState({
      tabIndex: index
    });
  }

  componentWillMount() {
    this.fetchCollectRecord();
  }

  componentDidMount() {
    this.context.refs['g_queryDataTabs'] = this;
  }

  componentWillUnmount() {
    if (this.context.refs['g_queryDataTabs']) {
      delete this.context.refs['g_queryDataTabs'];
    }
  }

  fetchCollectRecord() {
    this.props.actions.getLikeRecordAction().then(res => {
      if (res && res.status == 'ok') {
        this.state.collectData = res.results;
      }
    }).catch(err => {

    })
  }

  render() {
    return (
      <View style={styles.container}>
        <SDTabs2
          tabTitles={["学校", "专业", "行业", "职位"]}
          page={this.state.tabIndex}
          underLineWidth={30}
          onChangeTab={this.onTabChange.bind(this)}
          activeColor={"#333333"}
          inActiveColor={"#999"}
          style={{
            paddingTop: CSS.pixel(30),
            backgroundColor: '#fff'
          }}
          tabContentStyle={{
            width: '100%',
            height: '100%',
          }}
        >
          <QuerySchoolView />
          <QueryMajorView />
          <QueryIndustryView />
          <QueryJobView />
        </SDTabs2>
      </View>
    );
  }
}

export default ConnectWithActions(state => ({
}))(QueryDataTabs);