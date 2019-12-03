/* @flow */
import React, { Component } from "react";
import { StyleSheet, FlatList, View, Text, ScrollView } from "react-native";
import * as sdStyles from "@src/styles";
import PropTypes from "prop-types";
//import type, { UserItem as UserItemType } from "@src/types";
import UserItem from "@src/sd_userItem/UserItem";
// import SpecialUserItem from "@src/sd_userItem/SpecialUserItem";
import SpecialUserItem from "@src/sd_userItem/SpecialUserItem_2";
const componentStyles = StyleSheet.create({});
import { navScreen } from "@styles";
import config from "@src/config";
import ConnectWithActions from "../connectWithActions";
import { getUserId } from "../selectors";
import { dismissModal, dismissAllModals } from "@styles";
import MyHomeScreen from "../screens/pushScreen/myHome/MyHomeScreen";
import { ActivityIndicator } from "antd-mobile";
import SDUpPullScrollView from "../common/SDUpPullScrollView.js";

type Props = {
  //users: UserItem[],
  withSpecialItem: boolean,
  withOwnerInfo: boolean,
  onPress: (id: number) => void,
  onFollowPress: (id: number) => void
};

class UserList extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      searchWords: ""
    };
  }
  static defaultProps = {
    style: {},
    users: [],
    // 是否带有特殊的一项
    withSpecialItem: false,
    // 是否带有我本人的信息
    withOwnerInfo: false,
    searchWords: [],
    searchType: "",
    // onPress: () => {},
    onFollowPress: () => {},
    // 是否在转圈
    loading: false,
    // 是否会带有没有更多数据的显示
    withNoMoreData: false,
    inModalScreen: false,
    // 是否需要安全区下部
    needSafeArea: false
  };

  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
  };

  // 统一处理跳转
  handlePress = id => {
    const { onPress, userId, inModalScreen } = this.props;
    // 如果在外面有定义了onPress事件，则由外面来处理
    if(typeof onPress === 'function') {
      onPress(id);
      return
    }
    // 如果与当前用户的id一致
    if (id === userId) {
      // 弹出到根目录
      this.context.navigator.popToRoot({
        animated: true, // does the pop have transition animation or does it happen immediately (optional)
        animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
      });
      this.context.refs["_rankScreen"].navToPerson();
    } else{
      if(inModalScreen) {
        this.context.refs["_rankScreen"].navToOtherHomeTab(id)
      } else {
        this.context.navigator.push(
          navScreen("PushScreen", "个人主页", {
            passProps: {
              screen: () => <MyHomeScreen userId={id} />,
              fullScreen: true,
              noScrollView: true,
              header: {
                title: '个人主页'
              }
            }
          })
        );
      }
    }
  };
  // 统一处理关注
  // 关注由各个子项去处理
  handleFollowPress = id => {
    // const { onFollowPress } = this.props;
    // onFollowPress(id);
  };
  componentWillReceiveProps(nextProps) {
    this.setState({
      searchWords: nextProps.searchWords
    });
  }
  render() {
    const {
      searchType,
      users,
      withSpecialItem,
      withOwnerInfo,
      loading,
      withNoMoreData,
      needSafeArea
    } = this.props;
    const { searchWords } = this.state;
    if (loading) {
      return (
        <View
          style={{ justifyContent: "center", alignItems: "center", margin: 40 }}
        >
          <ActivityIndicator
          animating={true}
          ></ActivityIndicator>
        </View>
      );
    }
    if (users.length === 0 && !withOwnerInfo && withNoMoreData) {
      return (
        <View
          style={{ justifyContent: "center", alignItems: "center", margin: 40 }}
        >
          <Text>暂无数据</Text>
        </View>
      );
    }
    return (
      <View
        style={[
          {
            backgroundColor: sdStyles.SDBGColorMain,
            maxHeight: "100%",
            overflow: "scroll"
          },
          this.props.style
        ]}
      >
        {/* 用户自己的信息 */}
        {withOwnerInfo &&(
          <UserItem
            // 右侧带有红色的排名盒子
            {...withOwnerInfo}
            withRankNumberOnRight={true}
            withExtraInfo={false}
            withRankNumber={false}
            withFollow={false}
            onPress={this.handlePress}
          />
        )}
        {withSpecialItem &&
          users.length > 0 && (
            <SpecialUserItem
              withSpecialItem={withSpecialItem}
              onPress={this.handlePress}
              onFollowPress={this.handleFollowPress}
              {...users.slice(0, 1)[0]}
              getUserInfo={() => {return users.slice(0, 1)[0]}}
            />
          )}
        <SDUpPullScrollView
          listKey={(item, index) => item.key + ''}
          data={withSpecialItem ? users.slice(1) : users}
          refreshState={this.props.refreshState}
          needSafeArea={needSafeArea}
          onFooterRefresh={(state) => {
            this.props.onFooterRefresh &&
                this.props.onFooterRefresh(state);
          }}
          renderItem={({ item, index }) => (
            <UserItem
              {...item}
              key={item.key + ""}
              searchWords={searchWords}
              searchType={searchType}
              onPress={this.handlePress}
              onFollowPress={this.handleFollowPress}
              getUserInfo={() => item}
            />
          )}
        />
      </View>
    );
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({
  userId: getUserId(state, props)
}))(UserList));
