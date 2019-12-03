/* @flow */
import React, { PureComponent } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator
} from "react-native";
import {Toast} from 'antd-mobile';
import { CSS } from "./SDCSS";
import { headerHeight } from "./SDHeader";

type Props = {
  onHeaderRefresh: Function,
  onFooterRefresh?: Function,

  renderItem: Function,
  data: Array<any>,

  refreshState: number,
  header: () => Element
};

type State = {};

export const RefreshState = {
  Idle: 0,
  HeaderRefreshing: 1,
  FooterRefreshing: 2,
  NoMoreData: 3
};

export default class SDPullScrollView extends PureComponent<Props, State> {
  state = {
    refreshState: RefreshState.Idle // 0-空闲，1-刷新header中，2-刷新footer中，3-footer（nomore数据）
  };

  _onScrool(e) {
    if (e.nativeEvent.contentOffset.y <= 0) {
      // 请求的下拉刷新
      return;
    }

    if (this.state.refreshState !== 0) {
      return;
    }

    const contentHeight = e.nativeEvent.contentSize.height;
    const scrollY = e.nativeEvent.contentOffset.y;
    const layoutHeight = e.nativeEvent.layoutMeasurement.height;

    // 滑倒快到底部的时候
    if(scrollY + layoutHeight >= contentHeight - 120 && this.props.noFooter) {
      if(this.state.refreshState == RefreshState.Idle && this.props.onFooterRefresh) {
        this.setState({
          refreshState: RefreshState.FooterRefreshing
        })
      }
    }

    if (scrollY + layoutHeight >= contentHeight - 10) {
      this.props.onFooterRefresh();
    }
  }

  componentWillReceiveProps(next) {
    if(next.refreshState == 2) {
      this.scrollToEnd();
    }
    this.setState({
      refreshState: next.refreshState
    });
  }

  renderFooter() {
    switch (this.state.refreshState) {
      case 0:
        return null;
      case 1:
        return null;
      case 2:
        return (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 40
            }}
          >
            <ActivityIndicator size="small" color="#888" />
            <Text style={{ fontSize: 14, color: "#333" }}>加载中</Text>
          </View>
        );
      case 3:
        return (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 40
            }}
          >
            <Text style={{ fontSize: 14, color: "#999" }}>{this.props.noShowMore && this.props.data.length <= 0 ? "" : "没有更多数据"}</Text>
          </View>
        );
    }
  }

  renderItem() {
    let listItem = null;
    if (this.props.renderItem && this.props.renderItem instanceof Function) {
      listItem =
        this.props.data && this.props.data.length
          ? this.props.data.map((c, index) => {
              return this.props.renderItem(c, index);
            })
          : null;
    }

    return <View>{listItem}</View>;
  }

  scrollToEnd() {
    this.refs["_scrollView"].scrollToEnd();
  }

  render() {
    let { renderItem, ...rest } = this.props;

    return (
      <View style={{ flex: 1, width: "100%" }}>
        <ScrollView
          ref="_scrollView"
          style={{ flex: 1, width: "100%" }}
          refreshControl={
            this.props.onHeaderRefresh ? (
              <RefreshControl
                refreshing={this.state.refreshState == 1 ? true : false}
                onRefresh={
                  this.props.onHeaderRefresh ? this.props.onHeaderRefresh : null
                }
                tintColor="#999"
                title={this.state.refreshState == 1 ? "刷新中..." : "请求刷新"}
                titleColor="#999"
                colors={["#999", "#00ff00", "#0000ff"]}
                progressBackgroundColor="#ffffff"
              />
            ) : null
          }
          scrollEventThrottle={
            this.state.refreshState !== RefreshState.Idle ? 0.5 : null
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScroll={
            this.props.onFooterRefresh ? this._onScrool.bind(this) : null
          }
          alwaysBounceVertical={true}
          {...rest}
        >
          {this.props.header && this.props.header instanceof Function ? (
            <View style={{ width: "100%" }}>{this.props.header()}</View>
          ) : null}
          {/* <View>
          <Text>list</Text>
        </View> */}
          {this.props.data && this.props.data.length <= 0 &&
            this.props.empty && (
              <View
                style={{
                  height: 200,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#999", fontSize: CSS.pixel(28) }}>
                  暂无数据
                </Text>
              </View>
            )}
          {this.renderItem()}
          {this.renderFooter()}
        </ScrollView>
      </View>
    );
  }
}
