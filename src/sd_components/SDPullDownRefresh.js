/* @flow */
import React, { PureComponent } from "react";
import { ScrollView, RefreshControl } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";

type Props = {
  onRefresh: () => Promise<void>,
};

const PULL_TO_REFRESH = '下拉加载';
const REFRESHING = '加载中...';
const REFRESHING_DONE = '加载成功';

export default class SDPullDownRefresh extends PureComponent<Props> {
  props: Props;

  constructor(props) {
    super(props);
  }
  state = {
    isRefreshing: false,
    isDone: false,
  };

  onRefreshAction(){
    this.setState({
        isRefreshing: true,
        isDone: false,
    }, () => {
        this.props.onRefresh().then(() => {
            this.setState({
                isRefreshing: false,
                isDone: true,
            });
        }).catch(e => {
            //console.log(e)
            this.setState({
                isRefreshing: false,
                isDone: true,
            });
        })
    });
  }

  componentDidMount = () => {
    //console.log("xurrenttab===22", this.props.currentTab, this.props.tabStatus)
  }

  render() {
    const { style, children } = this.props;
    return (
        <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.onRefreshAction.bind(this)}
            tintColor="#666"
            title={this.state.isRefreshing ? REFRESHING : this.state.isDone ? REFRESHING_DONE : PULL_TO_REFRESH}
            titleColor="#666"
            colors={['red', 'green', 'blue']}
            progressBackgroundColor="#ffffff"
          />}
        style={[{
          flex: 1,
          backgroundColor: "#f3f3f3"
        }, style]}
      >
        {children}
      </ScrollView>
    );
  }
}
