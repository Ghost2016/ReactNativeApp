/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import SDPullScrollView, { RefreshState } from "./SDPullScrollView";
import SearchSchoolItem from "../sd_searchBox/SearchSchoolItem";

type Props = {
  onPressResult: Function,
  data: any,
  searchWord: string,
  queryAction: ?Function,
  enableRefresh: ?boolean
};

export default class SDMajorResult extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      refreshFooter: RefreshState.Idle,
      data: this.props.data || {
        results: []
      }
    };
  }

  onPressResult(text, level) {
    this.props.onPressResult && this.props.onPressResult(text, level ? level : "");
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
                  });
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
            <SearchSchoolItem
              onPress={this.onPressResult.bind(this, item.major, item.level)}
              key={index + ""}
              searchText={this.props.searchWord}
              fullText={item.major}
              subFullText={item.level + " " + item.level1 + " " + item.level2}
            />
          );
        }}
        header={() =>
          this.state.data.results && this.state.data.results.length ? null : (
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
