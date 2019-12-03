/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView
} from "react-native";
import { Tabs } from "antd-mobile";
import PropTypes from "prop-types";
import DirectInfo from "../sd_directinfo/DirectInfo";
import { antdTabsConfig } from "../styles/index";
import { RefreshState } from "../common/SDUpPullScrollView";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  }
});
export default class DirectInfoTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    };
  }

  onFooterRefresh(ref) {
    ref.getNextNews();
  }

  onHeaderRefresh(ref) {
    ref.getHeaderNews();
  }

  render() {
    return (
      <View style={styles.container}>
        <Tabs
          tabs={[
            { title: "校园聚焦" },
            { title: "就业快讯" },
            { title: "考研直达" },
            { title: "留学资讯" }
          ]}
          {...antdTabsConfig}
        >
          <DirectInfo onHeaderRefresh={this.onHeaderRefresh.bind(this)} onFooterRefresh={this.onFooterRefresh.bind(this)} newsType="校园聚焦" isShowTitle={false} />
          <DirectInfo onHeaderRefresh={this.onHeaderRefresh.bind(this)} onFooterRefresh={this.onFooterRefresh.bind(this)} newsType="就业快讯" isShowTitle={false} />
          <DirectInfo onHeaderRefresh={this.onHeaderRefresh.bind(this)} onFooterRefresh={this.onFooterRefresh.bind(this)} newsType="考研直达" isShowTitle={false} />
          <DirectInfo onHeaderRefresh={this.onHeaderRefresh.bind(this)} onFooterRefresh={this.onFooterRefresh.bind(this)} newsType="留学资讯" isShowTitle={false} />
        </Tabs>
      </View>
    );
  }
}
