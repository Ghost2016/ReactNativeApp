/* @flow */
import React, { Component } from "react";
import { StyleSheet, FlatList, View, Text, ScrollView } from "react-native";
import * as sdStyles from "@src/styles";
import PropTypes from "prop-types";
//import type, { UserItem as UserItemType } from "@src/types";
import UserItem from "@src/sd_userItem/UserItem";
import SpecialUserItem from "@src/sd_userItem/SpecialUserItem";
import config from "@src/config";
import ConnectWithActions from "../../../connectWithActions";
// import { getUserAllInfo } from "@src/users/usersSelector";
import { getRecommendUserArrayWithoutMe } from "./watchSelector";
import UserList from "../../../sd_userList/UserList";
import {CSS} from "../../../common/SDCSS";

// 推荐
class Recommend extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false
    };
  }
  static defaultProps = {
    
  };

  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
  };
  componentDidMount() {
    this.setState({
      isFetching: true
    })
    this.props.actions.getRecommentUserArrayAction({
      dimension:'city',
      type:'top'
    }, res =>{
      this.setState({
        isFetching: false
      })
    })
  }
  
  render() {
    const { recommendUsers } = this.props;
    return <View style={{
      position:'relative',
      flex:1
    }}>
      <View 
      style={{
        backgroundColor:'#f8f8f8',
        height:CSS.pixel(100),
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text
        style={{
          color: '#999',
          fontSize: CSS.textSize(28)
        }}
        >你还没有关注任何人~~</Text>
      </View>
      <View style={{flex:1}}>
        <View 
        style={[sdStyles.default.separator, {
          height:CSS.pixel(80),
          justifyContent: "center",
        }]}>
          <Text
          style={{
            color: '#999',
            fontSize: CSS.textSize(24),
            paddingLeft: CSS.textSize(30),
          }}
          >为你推荐</Text>
        </View>
        <View style={{ flex:1 }}>
          <UserList
          users={recommendUsers}
          withRankNumber={false}
          loading={this.state.isFetching}
          />
        </View>
      </View>
    </View>
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({
  recommendUsers: getRecommendUserArrayWithoutMe(state, props),
  // recommendUsers: state.recommendUserArray
}))(Recommend));
