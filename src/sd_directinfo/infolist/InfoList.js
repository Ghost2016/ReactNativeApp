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
import PropTypes from 'prop-types';
import ConnectWithActions from "@src/connectWithActions";
import ListItem from "./ListItem";
import SDLoading from "@sd_components/SDLoading";
import SDUpPullScrollView, {
  RefreshState
} from "../../common/SDUpPullScrollView";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center"
  }
});

class DirectInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isNeedCheck:
        typeof this.props.isNeedCheck !== "undefined"
          ? !!this.props.isNeedCheck
          : false,
      data: [],
      count: 0,
      refreshState: RefreshState.Idle
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    if (this.props.gRef) {
      this.context.refs[this.props.gRef] = this;
    }
    const { newsType } = this.props;
    let postData = {
      size: 5
    };
    const types = ["校园聚焦", "就业快讯", "考研直达", "留学资讯"];
    if (typeof newsType === "string" && types.includes(newsType)) {
      postData["category__title"] = newsType;
    }
    this.props.actions.getNewsAction(postData, res => {
      if (res.status == "ok") {
        //console.log("getNews", res)
        this.setState({
          loading: false,
          count: res.count,
          data: res.results.map((n, i) => {
            return {
              id: n.id,
              title: n.title,
              time: "1小时前",
              like_num: n.like_num,
              read_num: n.read_num,
              type: n.type,
              uri:
                "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2007798831,768211337&fm=27&gp=0.jpg"
            };
          })
        });
      }
    });
  }

  getHeaderNews(params) {
    params = {
      page: 1,
      size: this.state.data.length,
      ...params
    };
    if (this.props.newsType) {
      params["category__title"] = this.props.newsType;
    }

    this.setState({
      refreshState: RefreshState.HeaderRefreshing
    });
    
    return this.props.actions.getNewsAction(params, res => {
      if (res.status == "ok") {
        //console.log("getNews", res)
        this.setState({
          loading: false,
          refreshState: res.count == 0 ? RefreshState.EmptyData : RefreshState.Idle,
          count: res.count,
          data: res.results
            .map((n, i) => {
              return {
                id: n.id,
                title: n.title,
                time: "1小时前",
                like_num: n.like_num,
                read_num: n.read_num,
                type: n.type,
                uri:
                  "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2007798831,768211337&fm=27&gp=0.jpg"
              };
            })
        });
      } else {
        this.setState({
          refreshState: RefreshState.Failure
        });
      }
    });
  }

  getNextNews() {
    if (this.state.data.length >= this.state.count) {
      this.setState({
        refreshState: RefreshState.NoMoreData
      });
      return;
    }
    
    let params = {
      page: 2,
      size: this.state.data.length
    };
    if (this.props.newsType) {
      params["category__title"] = this.props.newsType;
    }
    this.setState({
      refreshState: RefreshState.FooterRefreshing
    });
    return this.props.actions.getNewsAction(params, res => {
      if (res.status == "ok") {
        //console.log("getNews", res)
        this.setState({
          loading: false,
          refreshState: res.count == 0 ? RefreshState.EmptyData : RefreshState.Idle,
          count: res.count,
          data: this.state.data.concat(
            res.results.slice(0, Platform.OS === "ios" ? 2 : 4).map((n, i) => {
              return {
                id: n.id,
                title: n.title,
                time: "1小时前",
                like_num: n.like_num,
                read_num: n.read_num,
                type: n.type,
                uri:
                  "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2007798831,768211337&fm=27&gp=0.jpg"
              };
            })
          )
        });
      } else {
        this.setState({
          refreshState: RefreshState.Failure
        });
      }
    });
  }

  setItemShouldCheck(should) {
    this.setState({
      isNeedCheck: should
    });
  }

  _renderItem({ item, index, separators }) {
    return <ListItem style={{
      marginBottom: index == this.state.data.length - 1 ? 0 : 10
    }} data={item} isNeedCheck={this.state.isNeedCheck} />;
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <TitleWrap title="资讯直击" /> */}
        {this.state.loading ? <SDLoading /> : null}
        <SDUpPullScrollView
          style={{
            width: "100%"
          }}
          onFooterRefresh={
            this.props.onFooterRefresh
              ? () => {
                  this.props.onFooterRefresh(this);
                }
              : null
          }
          onHeaderRefresh={
            this.props.onHeaderRefresh
              ? () => {
                  this.props.onHeaderRefresh(this);
                }
              : null
          }
          refreshState={this.state.refreshState}
          renderItem={this._renderItem.bind(this)}
          keyExtractor={item => "" + item.id}
          data={this.state.data}
        />

      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(DirectInfo);
