/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import SDPullScrollView, { RefreshState } from "./SDPullScrollView";
import SearchIndustryItem from "../sd_searchBox/SearchIndustryItem";

type Props = {
  onPressResult: Function,
  data: any,
  searchWord: string,
  queryAction: ?Function,
  enableRefresh: ?boolean
};

export default class SDIndustryResult extends PureComponent<Props> {

  constructor(props) {
    super(props);
    this.state = {
      refreshFooter: RefreshState.Idle,
      data: this.props.data || {
        results: []
      }
    };
  }

  onPressResult(text, id) {
    this.props.onPressResult && this.props.onPressResult(text, id);
  }

  _onFooterRefresh() {
    if (this.state.refreshFooter == RefreshState.Idle) {
      if (this.state.data.next) {
        this.setState(
          {
            refreshFooter: RefreshState.FooterRefreshing
          },
          () => {
            this.props
              .queryAction({
                _path: this.state.data.next
              })
              .then(res => {
                if(res && res.status == 'ok') {
                  this.setState({
                    data: {
                      results: []
                        .concat(this.state.data.results)
                        .concat(res.results),
                      next: res.next,
                      previous: res.previous
                    },
                    refreshFooter: res.next
                      ? RefreshState.Idle
                      : RefreshState.NoMoreData
                  });
                } else {
                  this.setState({
                    refreshFooter: RefreshState.Idle
                  })
                }
              })
              .catch(err => {});
          }
        );
      } else {
        this.setState({
          refreshFooter: RefreshState.NoMoreData
        });
      }
    }
  }

  componentWillReceiveProps(next) {
    this.setState({
      data: next.data
    });
  }

  render() {
    return (
      <SDPullScrollView
        refreshState={this.state.refreshFooter}
        style={{
          width: "100%",
          borderTopColor: "#efefef",
          borderTopWidth: 1,
          marginTop: 10
        }}
        data={this.state.data && this.state.data.results ? this.state.data.results : []}
        onFooterRefresh={
          this.props.enableRefresh ? this._onFooterRefresh.bind(this) : null
        }
        renderItem={(item, index) => {
          return (
            <SearchIndustryItem
              onPress={this.onPressResult.bind(this, item.industry, item.id)}
              key={index + ""}
              word={this.props.searchWord}
              fullText={item.industry}
            />
          );
        }}
        header={() =>
          this.props.data.results && this.props.data.results.length ? null : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: 200
              }}
            >
              <Text style={{ color: "#999", fontSize: 12 }}>
                搜索不到`
                {this.props.searchWord}
                `的信息
              </Text>
            </View>
          )
        }
      />
    );
  }
}
