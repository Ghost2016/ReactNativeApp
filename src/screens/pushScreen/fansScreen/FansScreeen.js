import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import * as sdStyles from "@src/styles";
import PropTypes from "prop-types";
import UserList from "../../../sd_userList/UserList";
import config from "../../../config";
import ConnectWithActions from "../../../connectWithActions";
import { getUserAllInfo } from "@src/users/usersSelector";
import { parseUserList } from "@utils/user";
import { getFans, getWatches } from "../../../directSelectors";
import Recommend from "./Recommend";
import { ActivityIndicator } from "antd-mobile";
import SDUpPullScrollView, {
  RefreshState
} from "../../../common/SDUpPullScrollView";
import{
  CSS
} from "../../../common/SDCSS";
import { Touchable } from "../../../sd_components"
import { SDSafeAreaView } from "../../../common"
const styles = StyleSheet.create({});

/**
 *  粉丝页面列表或者关注列表页面
 */
let nav = null;
class FansScreeen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userArray: [],
      refreshState: RefreshState.Idle,
      isFetching: false,
      curPage: 1,
      pageSize: 10,
      count: 999,
      isRecommending: false
    };
  }

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  static defaultProps = {
    // 查询指定id的用户相关信息
    userId: 0,
    // 全称
    fullName: "",
    // 页面类型
    // fans, follow
    screenType: config.SCREEN_TYPE.FANS,
  };
  handlePress = id => {
    //console.warn(id);
  };
  doFetch = () => {
    console.log('ly88', 'this.props.myUserArray', this.props.myUserArray)
    // 如果正在请求，则返回
    if(this.state.isFetching) return Promise.resolve()
    const { screenType, userId, user } = this.props;
    const { curPage, pageSize, count } = this.state;
    let id = userId !== 0 ? userId : user.id;
    const params = {
      id: id,
      page: curPage,
      size: pageSize
    }
    return new Promise((resolve, reject) => {
      if (screenType === config.SCREEN_TYPE.FANS) {
        // 如果是本人的粉丝
        if(userId === user.id) {
          // 需要优化
          // if(this.props.fans.length === 0) {
          //   this.props.actions.getFansAction({ id: id })
          // }
          // 获取自己的粉丝
          this.props.actions.getFansAction(params).then(
            res => {
              if(res.status === 'ok') {
                this.setState({
                  count: res.count
                }, () => {
                  resolve({
                    noMoreData: (this.props.myUserArray.length) === res.count,
                    count: res.count
                  });
                }
               )
              } else {
                reject(res.msg)
              }
            }
          ).catch(
            e => {
              reject(e)
            }
          )
          return
        }
        // 其他人的粉丝
        this.props.actions.getOthersFansAction(params).then(
          res => {
            if(res.status === 'ok') {
              let userArray = parseUserList(res.results, {
                withExtraInfo: false,
                withRankNumber: false,
                withFollow: true
              });
              // 如果不是第一页
              if (params.page !== 1) {
                userArray = [...this.state.userArray, ...userArray]
              }
              this.setState({
                userArray: userArray
              }, () => {
                resolve({
                  noMoreData: (userArray.length) === res.count,
                  count: res.count
                })
              });
            } else {
              reject(res.msg)
            }
          }
        ).catch(
          e => {
            reject(e)
          }
        );
      } else {
        // 如果是本人的关注
        if(userId === user.id) {
          // 当长度为0时，默认没有请求（需要优化）
          // if(this.props.watches.length === 0) {
          //   this.props.actions.getWatchedListAction({ id: id })
          // }
          // 获取自己的关注
          this.props.actions.getWatchedListAction(params).then(
            res => {
              if(res.status === 'ok') {
                // 第一页 没数据
                if(res.results.length === 0 && curPage === 1) {
                  this.setState({
                    isRecommending: true
                  })
                }
                // 先dispatch了
                this.setState({
                  count: res.count
                },() => {
                  resolve({
                    noMoreData: (this.props.myUserArray.length) === res.count,
                    // noMoreData: (this.props.myUserArray.length + res.results.length) === res.count,
                    count: res.count
                  })
                  // innerResolve()
                })
              } else {
                reject(res.msg)
              }
            }
          ).catch(
            e => {
              reject(e)
            }
          );
          return
        }
        // 获取其他人的关注列表
        this.props.actions.getOtherWatchedListAction(params).then(
          res => {
            if(res.status === 'ok') {
              let userArray = parseUserList(res.results, {
                withExtraInfo: false,
                withRankNumber: false,
                withFollow: true
              });
              // 如果不是第一页
              if (params.page !== 1) {
                userArray = [...this.state.userArray, ...userArray]
              }
              this.setState({
                userArray: userArray
              }, () => {
                console.log('ly88', 'noMoreData', userArray.length === res.count)
                resolve({
                  noMoreData: userArray.length === res.count,
                  count: userArray.length
                });
              });
            } else {
              reject(res.msg)
            }
          }
        ).catch(
          e => {
            reject(e)
          }
        );
      }
    })
  }
  initFetch = () => {
    this.setState({
      isFetching: true
    })
    this.doFetch().then(
      ({noMoreData = false, count = 0}) => {
        console.log('ly88', 'noMoreData', noMoreData)
        this.setState({
          isFetching: false,
          refreshState: noMoreData ? RefreshState.NoMoreData : RefreshState.Idle,
        })
      }
    ).catch(
      e => {
        console.log(e)
        this.setState({
          isFetching: false,
          refreshState: RefreshState.Failure
        })
      }
    )
  }
  componentDidMount() {
    this.initFetch()
    nav = this.context.navigator;
  }
  componentWillReceiveProps(props) {
    const { count } = this.state;
    const { myUserArray, screenType } = props;
    // 去掉关注时，会判断是否删除完了
    if(!this.state.isRecommending && myUserArray.length === 0 && screenType !== config.SCREEN_TYPE.FANS) {
      // 如果删除完了，会再次请求
      this.setState({
        curPage: 1
      },this.initFetch)
    }
    // 判断是否已经加载完了
    if(myUserArray.length === count) {
      this.setState({
        refreshState: RefreshState.NoMoreData,
      })
    }
  }
  onFooterRefresh = (state) => {
    this.setState({
      curPage: this.state.curPage + 1,
      refreshState: RefreshState.FooterRefreshing,
    }, () => {
      this.doFetch().then(
        ({noMoreData = false, count = 999}) => {
          this.setState({
            refreshState: noMoreData ? RefreshState.NoMoreData : RefreshState.Idle,
          })
        }
      ).catch(
        e => {
          this.setState({
            refreshState: RefreshState.Idle,
          })
          console.log(e)
        }
      )
    })
  }
  render() {
    const { screenType, user, userId } = this.props;
    const userArray =  (userId !== user.id) ? this.state.userArray : this.props.myUserArray
    // const userArray = []
    // console.warn(userArray)
    if (this.state.isRecommending) {
      return (
         <View style={{
          flex:1,
          backgroundColor:'#fff'
        }}>
          <Recommend/>
        </View>
      )
    }
    if(this.state.isFetching) {
      return (
        <View style={{
         flex:1,
         backgroundColor:'#fff',
         paddingTop: CSS.pixel(40)
       }}>
        <ActivityIndicator animating={true}/>
       </View>
     )
    }
    return (
      <View style={{
        flex:1,
        backgroundColor: sdStyles.SDBGColorMain,
        paddingTop: CSS.pixel(20)
      }}>
        {userArray.length !== 0 && [
          <View
            style={[
              sdStyles.default.separator,
              { 
                paddingVertical: CSS.pixel(14),
                paddingLeft: CSS.pixel(30),
                backgroundColor: '#fff'
              }
            ]}
            key={'1'}
          >
            <Text style={{
              fontSize: CSS.textSize(24),
              color: sdStyles.SDFontColorMinor
            }}>
              {screenType === config.SCREEN_TYPE.FANS
                ? `这些人关注了${userId === user.id ? "我" : "TA"}`
                : `${userId === user.id ? "我" : "TA"}关注了这些人`}
            </Text>
          </View>,
          <UserList
            key={'2'}
            users={userArray}
            style={{flex:1}}
            loading={this.state.isFetching}
            onFooterRefresh={this.onFooterRefresh}
            refreshState={this.state.refreshState}
            needSafeArea={true}
          />
        ]}
        {/* 其他人 */}
        {(userArray.length === 0) && (userId !== user.id) && (
          // 显示没有数据
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%"
            }}
          >
            <Image
              source={
                screenType === config.SCREEN_TYPE.FANS
                  ? require("@img/rank/rank_pic_No_fans.png")
                  : require("@img/rank/rank_pic_No_concern.png")
              }
            />
            <Text
            style={{
              paddingTop:CSS.pixel(60),
              fontSize:CSS.textSize(28),
              color: sdStyles.SDFontColorSubtitle
            }}
            >
            {screenType === config.SCREEN_TYPE.FANS
                ? `还没有任何人关注${userId === user.id ? "我" : "TA"}~~`
                : `${userId === user.id ? "我" : "TA"}还没有关注任何人~~`}
            </Text>
          </View>
        )}
        {/* 我自己 粉丝*/}
        {(userArray.length === 0) && (userId === user.id) && (screenType === config.SCREEN_TYPE.FANS) && (
          // 显示没有数据
          <View
            style={{
              // borderColor: 'red',
              // borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              // marginTop: -CSS.pixel(100, true)
              // paddingBottom: 100
            }}
          >
            <Image
              source={
                screenType === config.SCREEN_TYPE.FANS
                  ? require("@img/rank/rank_pic_No_fans.png")
                  : require("@img/rank/rank_pic_No_concern.png")
              }
            />
            <Text
            style={{
              paddingTop:CSS.pixel(60, true),
              fontSize:CSS.textSize(28),
              color: sdStyles.SDFontColorSubtitle
            }}
            >
            啊哦，还没有任何人关注你，魅力还不够哦
            </Text>
          {/* <Touchable
            style={{
              marginTop:CSS.pixel(80, true)
            }}
            onPress={() =>{
            nav.popToRoot({
              animated: false
            });
            nav.switchToTab({
              tabIndex: 2
            });
          }}>
            <View
              style={{
                height: CSS.pixel(92, true),
                width: CSS.pixel(420),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: CSS.pixel(50),
                backgroundColor: sdStyles.SDMainColor // "#fed200"
              }}
            >
              <Text style={{ color: "#fff" }}>点亮我的个人魅力</Text>
            </View>
          </Touchable> */}
          </View>
        )}
      </View>
    );
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({
  user: getUserAllInfo(state, props),
  myUserArray: (props.screenType === config.SCREEN_TYPE.FANS) ? getFans(state, props) : getWatches(state, props)
  // myUserArray: []
  // fans: getFans(state, props),
  // watches: getWatches(state, props),
}))(FansScreeen));
