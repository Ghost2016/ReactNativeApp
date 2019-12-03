import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
  Image,
  FlatList,
  RefreshControl
} from "react-native";

import { DatePicker, List, Tabs, Toast } from "antd-mobile";
import PropTypes from "prop-types";
import * as sdStyles from "@src/styles";
import { ScoreText, RankPopup } from "@src/sd_rank";
import {
  NormalizeChart
  // HorizontalBarChart
} from "@src/sd_charts";
import UserList from "@src/sd_userList/UserList";
import { Touchable } from "@src/sd_components";
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({});
import { Button } from "antd-mobile";
import { SectionView, SectionViewSeparator } from "@src/common";
import ConnectWithActions from "../../../connectWithActions";
import { parseUserList } from "@utils/user";
import FootSpace from "@sd_components/FootSpace";
import { CSS } from "../../../common/SDCSS";
import SDLoading from "@sd_components/SDLoading";
import {isIphoneX} from "../../../utils/iphonex";
type Props = {
  error: string
};
type State = {
  // error: string
};

const PULL_TO_REFRESH = '下拉加载';
const REFRESHING = '加载中...';

/**
 * 排名首页第三个Tab
 * 进步榜
 */
class RankTabThree extends React.Component<Props, State> {
  props: Props;
  state: State;
  state = {
    // 是否需要重新请求数据
    shouldUserArrayUpdate: true,
    // userArray: [],
    isFetching: false,
    // curPage: 1,
    // 获取前20位进步
    pageSize: 20,
    isRefreshing: false,
  };
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  handleItemClick = i => {
  };
  // onNavigatorEvent(event) {
  //   switch (event.id) {
  //     case "willAppear":
  //       this.doFetch();
  //       break;
  //     case "didAppear":
  //       break;
  //     case "willDisappear":
  //       break;
  //     case "didDisappear":
  //       break;
  //     case "willCommitPreview":
  //       break;
  //   }
  // }
  doFetch = () => {
    if (!this.state.shouldUserArrayUpdate) {
      return;
    }
    let params = {
      type: "progress",
      // type: "watch",
      size: this.state.pageSize
    };
    // console.log(params)
    // 请求进步榜单数据
    // this.props.actions.getWatchedListAction(
    //   { id: 1 },
    return new Promise((resolve, reject) => {
      this.props.actions.getRankStatisticsAction(params).then(
        res => {
          if(res.status === 'ok') {
            resolve()
          } else {
            reject(res.msg)
          }
        }
      ).catch(
        e => {
          reject(e)
        }
      )
    })
  };
  componentDidMount() {
    this.context.refs['rank_tab_three'] = this;
    this.setState({
      isFetching: true
    });
    this.doFetch().then(
      () => {
        this.setState({
          // shouldUserArrayUpdate: false,
          isFetching: false
        });
      }
    ).catch(
      e => {
        this.setState({
          isFetching: false
        });
      }
    )
    // this.context.navigator.setOnNavigatorEvent(
    //   this.onNavigatorEvent.bind(this)
    // );
  }
  handleActionToUpdateAllData = () => {
    this.doFetch()
  }
  _onRefresh = () => {
    this.setState({
      isRefreshing: true,
      shouldUserArrayUpdate: true
    }, () => {
      this.doFetch().then(
        () => {
          Toast.info('刷新成功',1,null, false);
          this.setState({
            isRefreshing: false
          });
        }
      ).catch(
        e => {
          Toast.info('刷新失败',1,null, false);
          this.setState({
            isRefreshing: false
          });
        }
      )
    });
  }
  render() {

    const { progressUserArray } = this.props;
    if (this.state.isFetching) {
      return <View style={{flex:1,backgroundColor:sdStyles.SDBGColorMain}}><SDLoading /></View>
    }
    return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={this.state.isRefreshing}
          onRefresh={this._onRefresh}
          tintColor={sdStyles.SDFontColorMinor}
          title={this.state.isRefreshing ? REFRESHING : PULL_TO_REFRESH}
          titleColor={sdStyles.SDFontColorMinor}
          colors={['red', 'green', 'blue']}
          progressBackgroundColor={sdStyles.SDBGColorMinor}
        />}
      style={{
        backgroundColor: sdStyles.SDBGColorMain,
        width: CSS.width()
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: CSS.pixel(30),
          marginTop: CSS.pixel(40),
        }}
      >
          <UserList
            withSpecialItem={true}
            users={progressUserArray}
            onFollowPress={this.handleItemFollowClick}
            withNoMoreData={true}
            style={{width: '100%'}}
          />
      </View>
    </ScrollView>)
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({
  progressUserArray: state.progressUserArray
}))(
  RankTabThree
));
