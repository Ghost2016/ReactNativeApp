/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  StatusBar,
  ScrollView
} from "react-native";
import { Picker, DatePicker } from "antd-mobile";
import PropTypes from "prop-types";
import SDTouchOpacity from "../common/SDTouchOpacity";
import { CSS } from "../common/SDCSS";
import { SDMainColor } from "../styles";
import { isIphoneX } from "../utils/iphonex";
import { SDHeader } from "../common";
import SDSearchBar from "../common/SDSearchBar";
import SDPullScrollView, { RefreshState } from "../common/SDPullScrollView";

let wHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({});

type Props = {
  style: ?object,
  renderItem: Function,
  onChange: Function,
  onSubmit: Function,
  refreshAction: Function,
  queryKey: string,
  useCustom: ?boolean,
  enterText: ?string
};

let searchNow = new Date().getTime();

export default class SearchBox extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      data: {
        results: []
      },
      next: null,
      refreshState: RefreshState.Idle
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  _renderItem(item, index) {
    if (this.props.renderItem && this.state.value) {
      return this.props.renderItem(item, index, this.state.value);
    }
    return null;
  }

  componentDidMount() {
    this.context.refs["g_searchBox"] = this;
  }

  componentWillUnmount() {
    if (this.context.refs["g_searchBox"]) {
      delete this.context.refs["g_searchBox"];
    }
  }

  _onChange(text) {
    
    let {extralKey} = this.props;
    text = text && text.trim ? text.trim() : "";
    
    // console.warn(text);
    if(text == "") {
      this.setState({
        data: {
          results: []
        }
      });
      return;
    }

    extralKey = extralKey || {};
    this.props.refreshAction &&
      this.props
        .refreshAction({
          [this.props.queryKey]: text,
          ...extralKey,
          size: 10
        })
        .then(res => {
          if(res && res.status == 'ok') {
            this.setState({
              data: res || {
                results: []
              },
              next: res.next ? res.next : null,
              refreshState: res.next ? RefreshState.Idle : RefreshState.NoMoreData
            });
          } else {
            this.setState({
              refreshState: RefreshState.Idle
            });
          }
        })
        .catch(err => {
          this.setState({
            data: {
              results: []
            },
            next: null,
            refreshState: RefreshState.NoMoreData
          });
        });
    
    this.props.onChange && this.props.onChange(text);
    this.setState({
      value: text
    });
  }

  _onSubmit(text) {
    this.props.onSubmit && this.props.onSubmit(text);
    this.setState({
      value: text
    });
  }

  onHeaderRefresh() {
    if (!this.props.refreshAction) {
      return;
    }
    let {extralKey} = this.props;
    extralKey = extralKey || {};
    if (this.state.next) {
      this.setState({ refreshState: RefreshState.HeaderRefreshing });

      this.props.refreshAction &&
        this.props
          .refreshAction(this.props.noAutoNext ? {
            [this.props.queryKey]: this.state.value,
            ...extralKey,
            size: 10
          } : {
            _path: this.state.data.next,
            size: 10
          })
          .then(res => {
            if (res && res.status == 'ok') {
              this.setState({
                data: res || {
                  results: []
                },
                next: res.next ? res.next : null,
                refreshState: res.next
                  ? RefreshState.Idle
                  : RefreshState.NoMoreData
              });
            } else {
              this.setState({
                refreshState: RefreshState.Idle
              })
            }
          })
          .catch(err => {
            this.setState({
              data: {
                results: []
              },
              next: null,
              refreshState: RefreshState.NoMoreData
            });
          });
    } else {
      this.setState({
        refreshState: RefreshState.NoMoreData
      });
    }
  }

  onFooterRefresh() {
    if (!this.props.refreshAction) {
      return;
    }
    let {extralKey} = this.props;
    extralKey = extralKey || {};
    if (this.state.next) {
      this.setState({
        refreshState: RefreshState.FooterRefreshing
      });
      let next = 0;
      // 判断下一页
      if(this.state.next) {
        let nextpageMatch = this.state.next.match(/\?page=([\d]+?)\&/);
        if(nextpageMatch) {
          next = nextpageMatch[1];
        } else {
          this.setState({
            refreshState: RefreshState.NoMoreData
          });
          return ;
        }
      } else {
        this.setState({
          refreshState: RefreshState.NoMoreData
        });
        return
      }
      this.props
        .refreshAction(this.props.noAutoNext ? {
          [this.props.queryKey]: this.state.value,
          ...extralKey,
          page: next,
          size: 10
        } : {
          _path: this.state.next
        })
        .then(res => {
          if(res && res.status == 'ok') {
            this.setState({
              data: {
                results: [].concat(this.state.data.results).concat(res.results),
                previous: res.previous
              },
              next: res.next,
              refreshState: res.next
                ? RefreshState.Idle
                : RefreshState.NoMoreData
            });
          } else {
            this.setState({
              refreshState: RefreshState.Idle
            })
          }
        })
        .catch(err => {
          this.setState({
            next: null,
            refreshState: RefreshState.NoMoreData
          });
        });
    } else {
      this.setState({
        refreshState: RefreshState.NoMoreData
      });
    }
  }

  render() {
    return (
      <View style={{ height: "100%", backgroundColor: "#fff" }}>
        <SDHeader
          backgroundColor="#fff"
          custom={() => {
            return (
              <SDSearchBar
                autoFocus
                enterText={this.props.enterText}
                onChange={this._onChange.bind(this)}
                onSubmit={this._onSubmit.bind(this)}
                onCancel={text => {
                  if (this.props.useCustom) {
                    this.props.onChange && this.props.onChange(text, true);
                  }
                  this.context.navigator && this.context.navigator.pop();
                }}
              />
            );
          }}
        />
        {/* <FlatList
          keyExtractor={(item, index) => (item.id ? item.id + "" : index + "")}
          data={this.state.data}
          renderItem={this._renderItem.bind(this)}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        /> */}
        <SDPullScrollView
          data={this.state.data.results}
          renderItem={this._renderItem.bind(this)}
          style={{ flex: 1 }}
          refreshState={this.state.refreshState}
          onHeaderRefresh={this.onHeaderRefresh.bind(this)}
          onFooterRefresh={this.onFooterRefresh.bind(this)}
          noShowMore
        />
        {this.state.value !== "" && this.state.data && this.state.data.results && this.state.data.results.length <= 0 ? (
          <View
            style={{
              height: 200,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              left: 0,
              top: 100,
              right: 0
            }}
          >
            <View>
              <Text style={{ color: "#999", fontSize: 14 }}>
                找不到关于"
                {this.state.value}
                "的信息
              </Text>
            </View>
            <View style={{ marginTop: CSS.pixel(60, true) }}>
              <Text style={{ color: "#999", fontSize: 14 }}>
                试试搜索其它内容吧
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}
