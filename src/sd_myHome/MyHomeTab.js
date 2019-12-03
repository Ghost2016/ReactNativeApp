import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import { Tabs } from "antd-mobile";
import defaultStyle, { antdTabsConfig } from "@styles";
import HomeTabItem from "./homeTab/HomeTabItem";
import TrendsHistory from "./homeTab/TrendsHistory";
import { SDTabs2 } from "../sd_components";
import { CSS } from "../common/SDCSS";
import { RefreshState } from "../common/SDPullScrollView";

const styles = StyleSheet.create({
  container: {
    marginTop: CSS.pixel(30),
    backgroundColor: "#fff",
    flex: 1
  }
});

// 我的主页 tab组件
export default class MyHomeTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currPage: 0,
      isShowImageViewer: false,
      imagesUrls: [],
      imageViewerIndex: 0,
      refreshState: RefreshState.Idle
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    otherId: PropTypes.number.isRequired
  };

  refreshTrends() {
    this.setState({
      refreshState: RefreshState.FooterRefreshing
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Tabs
          tabs={[
            { title: (this.context.otherId !== 0 ? "TA" : "我") + "的主页" },
            { title: "动态" }
          ]}
          {...antdTabsConfig}
          onTabClick={(data, index) => {
            this.setState({
              currPage: index
            });
          }}
          animated={false}
          swipeable={false}
          page={this.state.currPage}
        >
        {/* <SDTabs2
          noChange
          tabTitles={[(this.context.otherId !== 0 ? "TA" : "我") + "的主页", "动态"]}
          page={this.state.currPage}
          underLineWidth={CSS.pixel(60)}
          onChangeTab={index => {
            this.setState({
              currPage: index
            });
          }}
          activeColor={"#333333"}
          inActiveColor={"#999"}
          style={{
            paddingTop: CSS.pixel(30),
            backgroundColor: "#fff"
          }}
          tabContentStyle={{
            width: Dimensions.get("window").width,
            minHeight: 0,
            paddingTop: 0
          }}
        > */}
          <HomeTabItem
            switchTab={() => {
              this.setState({
                currPage: 1
              });
            }}
            hide={this.state.currPage == 1}
          />
          <TrendsHistory onFooterCallBack={(state) => {
            this.state.refreshState = state
          }} hide={this.state.currPage == 0} refreshState={this.state.refreshState}/>
        {/* </SDTabs2> */}
        </Tabs>
      </View>
    );
  }
}
