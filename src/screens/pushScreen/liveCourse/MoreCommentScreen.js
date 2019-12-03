import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  TextInput
} from "react-native";
import { Toast } from 'antd-mobile';
import PropTypes from "prop-types";
import connectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";
import SDPullScrollView, {
  RefreshState
} from "../../../common/SDPullScrollView";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor, navScreen } from "../../../styles";
import CommentMsgItem from "./CommentItem";
import SDKeyboardSpacer from "../../../common/SDKeyboardSpacer";
import { isIphoneX } from "../../../utils/iphonex";
import MyHomeScreen from "../myHome/MyHomeScreen";

// 职么课堂-课程评论
class MoreCommentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currState: RefreshState.Idle,
      commentData: [],

      peerSize: 10,
      currPage: 1,

      isNeedComment: this.props.isNeedComment ? true : false,
      currScore: 0,
      leftCommentTextNum: 0,
      commentText: "",

      commentCount: 0, 
      liveData: this.props.liveData
    };
  }

  static contextTypes = {
    navigator: () => null
  }

  componentDidMount() {
    this.setState({
      currState: RefreshState.HeaderRefreshing
    });
    this.fetchCommentData();
    this.props.actions.getLiveCourseDetailAction({
      id: this.state.liveData.id
    })
    .then(res => {
      if (res.status == 'ok') {
        this.setState({
          liveData: res.results
        });
      }
    }).catch(err => {
      
    })
  }

  fetchCommentData(params = {}, reset = false) {
    this.props.actions
      .getLiveCourseCommentAction({
        id: this.props.liveData.id,
        ...params
      })
      .then(res => {
        this.state.commentData = reset
          ? [].concat(res.results)
          : [].concat(this.state.commentData).concat(res.results);
        if (res.count <= this.state.commentData.length) {
          this.setState({
            currState: RefreshState.NoMoreData,
            peerSize: res.per_page,
            currPage: res.current_page,
            commentCount: res.count
          });
        } else {
          this.setState({
            currState: RefreshState.Idle,
            peerSize: res.per_page,
            currPage: res.current_page,
            commentCount: res.count
          });
        }
      })
      .catch(err => {});
  }

  refreshFooter() {
    if (this.state.currState == RefreshState.NoMoreData || this.state.currState == RefreshState.HeaderRefreshing || this.state.currState == RefreshState.FooterRefreshing) {
      return;
    }
    this.setState(
      {
        currState: RefreshState.FooterRefreshing
      },
      () => {
        this.fetchCommentData({
          page: this.state.currPage + 1,
          size: this.state.peerSize
        });
      }
    );
  }

  _renderItem(item, index) {
    return (
      <View key={index + ""} style={{paddingHorizontal: CSS.pixel(30), marginVertical: CSS.pixel(30), flexDirection: 'row', marginBottom: CSS.pixel(50, true)}}>
        <SDTouchOpacity onPress={() => {
          // 跳转到个人主页
          // 判断是否是自己的头像
          if (this.props.user.id == item.user_info.id) {
            this.context.navigator.push(
              navScreen("PushScreen", "我的主页", {
                navigatorButtons: {
                  rightButtons: [
                    {
                      icon: () => (
                        <Image source={require("@img/my/mine_btn_Release.png")} />
                      ),
                      id: "post_trends"
                    }
                  ]
                },
                passProps: {
                  fullScreen: true,
                  noScrollView: true,
                  screen: () => <MyHomeScreen showTabBar={false} />,
                  header: {
                    title: "我的主页"
                  }
                }
              })
            );
          } else {
            this.context.navigator.push(navScreen("PushScreen", "我的主页", {
              passProps: {
                fullScreen: true,
                noScrollView: true,
                screen: () => <MyHomeScreen userId={item.user_info.id} />,
                header: {
                  title: '个人主页'
                }
              }
            }));
          }
        }} style={{width: CSS.pixel(60), height: CSS.pixel(60), borderRadius: CSS.pixel(30), overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
          {item.user_info && item.user_info.avatar ? <Image style={{width: CSS.pixel(60), height: CSS.pixel(60)}} source={{uri: item.user_info.avatar + "?imageView2/2/h/120"}}/> : 
          // {gender == "female" ? (
          //   <Image source={require("@img/rank/rank_ico_female.png")} />
          // ) : (
          //   <Image source={require("@img/rank/rank_ico_male.png")} />
          // )}
          // <Text>缺失头像</Text>
            item.user_info.gender == "female" ? (
              <Image style={{width: CSS.pixel(60), height: CSS.pixel(60)}} resizeMode="stretch" source={require("@img/avator/female.png")} />
            ) : (
              <Image style={{width: CSS.pixel(60), height: CSS.pixel(60)}} resizeMode="stretch" source={require("@img/avator/male.png")} />
            )
          }
        </SDTouchOpacity>
        <View style={{marginLeft: CSS.pixel(14), flex: 1}}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <View style={{flex: 1}}>
              <Text style={{color: '#333', fontSize: CSS.textSize(28), lineHeight: CSS.pixel(40)}}>{item.user_info.nickname}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              {[1,2,3,4,5].map((d, index) => {
                let score = item && item.score ? Math.floor(item.score) : 0;
                return (
                  <View key={index + ""} style={{marginLeft: CSS.pixel(6), padding: 0, justifyContent: 'center'}}>
                    <Image
                      source={
                        d <= score
                          ? require("@img/imchat/evaluate_ico_yellow2.png")
                          : require("@img/imchat/evaluate_ico_gray2.png")
                      }
                    />
                  </View>
                );
              })}
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: CSS.pixel(2)}}>
              <View style={{flex: 1}}>
                <Text style={{color: '#999', fontSize: CSS.textSize(20), lineHeight: CSS.pixel(28)}}>{item.edu_info.school_name} {item.edu_info.degree_name} · {item.edu_info.major_name}</Text>
              </View>
              <View>
                <Text style={{color: '#999', fontSize: CSS.textSize(20), lineHeight: CSS.pixel(28)}}>
                  {item.created_time.replace("-", "年").replace("-", "月").replace("T", "日 ").slice(0, 17)}
                </Text>
              </View>
          </View>
          {/* 学生评论 */}
          <View style={{marginTop: CSS.pixel(28)}}>
            <CommentMsgItem msg={item.content}/>
          </View>
          {/* 老师回复的评论 */}
          {
            item.reply_content && item.reply_content !== "" ?
            <View>
                <View style={{position: 'absolute', borderWidth: CSS.pixel(24), borderColor: 'transparent', borderBottomColor: '#eee', left: 10, top: 2}}></View>
                <View style={{backgroundColor: '#eee', marginTop: CSS.pixel(48), borderRadius: CSS.pixel(8), paddingHorizontal: CSS.pixel(24), paddingVertical: CSS.pixel(32)}}>
                  <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <View style={{width: CSS.pixel(60), height: CSS.pixel(60), borderRadius: CSS.pixel(30), overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
                      {(this.state.liveData && this.state.liveData.teacher_avatar) ? 
                      <Image style={{width: CSS.pixel(60), height: CSS.pixel(60)}} source={{uri: this.state.liveData.teacher_avatar.url + '?imageView2/2/h/120'}}/> : 
                      // {gender == "female" ? (
                      //   <Image source={require("@img/rank/rank_ico_female.png")} />
                      // ) : (
                      //   <Image source={require("@img/rank/rank_ico_male.png")} />
                      // )}
                      // <Text>缺失头像</Text> 
                        this.state.liveData.teacher_gender == "female" ? (
                          <Image style={{width: CSS.pixel(60), height: CSS.pixel(60)}} resizeMode="stretch" source={require("@img/female_master.png")} />
                        ) : (
                          <Image style={{width: CSS.pixel(60), height: CSS.pixel(60)}} resizeMode="stretch" source={require("@img/male_master.png")} />
                        )
                      }
                    </View>
                    <View style={{marginLeft: CSS.pixel(14), flex: 1}}>
                      <Text style={{fontSize: CSS.textSize(28), color: '#333', lineHeight: CSS.pixel(40)}}>{this.state.liveData && this.state.liveData.teacher_name}</Text>
                    </View>
                    <View>
                      <Text style={{color: '#999', fontSize: CSS.textSize(20), lineHeight: CSS.pixel(28)}}>{item.reply_time && item.reply_time.replace("-", "年").replace("-", "月").replace("T", "日 ").slice(0, 17)}</Text>
                    </View>
                  </View>
                  <View style={{marginTop: CSS.pixel(20), flexWrap: 'wrap'}}>
                    <Text style={{color: '#666', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>{ item.reply_content}</Text>
                  </View>
                </View>
            </View> : null
          }
        </View>
      </View>
    )
  }

  returnNeedComment() {
    return (
      <View style={{flex: 1, backgroundColor: '#f3f3f3'}}>
        <ScrollView ref="containerScroll" style={{flex: 1}} keyboardDismissMode="none" keyboardShouldPersistTaps="handled">
          <View style={{backgroundColor: '#fff', alignItems: 'center'}}>
            <View style={{marginTop: CSS.pixel(18), alignItems: 'center'}}>
              <Text style={{color: '#333', fontSize: CSS.textSize(28), lineHeight: CSS.pixel(50), fontWeight: '600'}}>{this.state.liveData.name}</Text>
            </View>
            <View style={{marginBottom: CSS.pixel(32), alignItems: 'center'}}>
              <Text style={{color: '#666', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(50)}}>导师: {this.state.liveData.teacher_name}</Text>
            </View>
          </View>
          <View style={{backgroundColor: '#f3f3f3', height: CSS.pixel(20)}}></View>

          <View style={{paddingHorizontal: CSS.pixel(28), paddingVertical: CSS.pixel(32),backgroundColor: '#fff'}}>
            <View>
              <Text style={{color: '#666', fontSize: CSS.textSize(28), lineHeight: CSS.pixel(40)}}>评分</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: CSS.pixel(12), marginBottom: CSS.pixel(6)}}>
              {[1, 2, 3, 4, 5].map((c, index) => {
                  let score = parseInt(this.state.currScore);
                  return (
                    <SDTouchOpacity onPress={() => {
                      this.setState({
                        currScore: c
                      })
                    }} key={index + ""} style={{marginRight: CSS.pixel(43), padding: 0, left: -1}}>
                      <Image
                        source={
                          c <= score
                            ? require("@img/imchat/course/evaluate_ico_yellow.png")
                            : require("@img/imchat/course/evaluate_ico_gray.png")
                        }
                      />
                    </SDTouchOpacity>
                  );
                })}
            </View>
          </View>
          <View style={{backgroundColor: '#f3f3f3', height: CSS.pixel(20)}}></View>
          
          <View style={{paddingHorizontal: CSS.pixel(28), paddingVertical: CSS.pixel(32), height: CSS.pixel(200), backgroundColor: '#fff'}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{color: '#666', fontSize: CSS.textSize(28), lineHeight: CSS.pixel(40)}}>评论</Text>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Text style={{color: '#666', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>{(150 - this.state.leftCommentTextNum) <= 0 ? 0 : (150 - this.state.leftCommentTextNum)}字</Text>
              </View>
            </View>
            <View style={{marginTop: CSS.pixel(16), flexWrap: 'wrap'}}>
              <TextInput autoCapitalize="none" autoCorrect={false} enablesReturnKeyAutomatically={true} returnKeyType="default" returnKeyLabel="换行" onChangeText={(t) => {
                this.setState({
                  commentText: t.slice(0, 150),
                  leftCommentTextNum: t.length
                })
                if(t.length > 150) {
                  Toast.info("已超出字数限制", 0.3)
                }
              }} multiline={true} numberOfLines={10} value={this.state.commentText} underlineColorAndroid="transparent" placeholder="课程讲解如何，是否有收获？" style={{padding: 0, paddingBottom: CSS.pixel(30), textAlignVertical: 'top'}}/>
            </View>
          </View>
          <View style={{alignItems: 'center', height: CSS.pixel(140), marginTop: CSS.pixel(80)}}>
            <SDTouchOpacity 
              onPress={this.commentOnPress.bind(this)} 
              disabled={this.state.currScore != 0 ? false : true} 
              style={{backgroundColor: this.state.currScore != 0 ? SDMainColor : '#d2d2d2', width: CSS.pixel(550), height: CSS.pixel(80), borderRadius: CSS.pixel(40), overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: CSS.textSize(32), color: '#333', lineHeight: CSS.pixel(44)}}>提交</Text>
            </SDTouchOpacity>
          </View>
      </ScrollView>


      <SDKeyboardSpacer onToggle={open => {
          if (open) {
            setTimeout(() => {
              this.refs["containerScroll"].scrollToEnd();
            });
          }
        }} topSpacing={isIphoneX() ? -34 : -30} />
    </View>
    )
  }

  commentOnPress() {
    if(this.state.currScore <= 0) {
      Toast.info("请评分", 1)
      return;
    }

    this.props.actions.addCourseCommentAction({
      id: this.state.liveData.id,
      score: this.state.currScore,
      content: this.state.commentText
    }).then(res => {
      if (res.status == 'ok') {
        Toast.success("评论成功", 1);
        // Todo 需要更新课程详情里是否有还可以评论按钮
        this.setState({
          currState: RefreshState.HeaderRefreshing,
          isNeedComment: false
        });
        this.fetchCommentData({}, true);

        this.props.actions.getLiveCourseDetailAction({
          id: this.state.liveData.id
        })
        .then(res => {
          if (res.status == 'ok') {
            this.setState({
              liveData: res.results
            });
          }
        }).catch(err => {
          
        })

        this.props.getDetailThis && this.props.getDetailThis().fetNewData(true);
      } else {
        Toast.fail("评论出错啦", 1);
      }
    }).catch(err => {
      Toast.fail("评论出错啦", 1);
    })
  }

  render() {
    if (this.state.isNeedComment) {
      return this.returnNeedComment();
    }
    return (
        <SDPullScrollView
          refreshState={this.state.currState}
          onFooterRefresh={this.refreshFooter.bind(this)}
          renderItem={this._renderItem.bind(this)}
          data={this.state.commentData}
          // keyExtractor={item => item.id + ""}
          style={{flex: 1, width: '100%', backgroundColor: '#fff'}}
          header={() => <LiveCourseCommenHeader commentCount={this.state.commentCount} liveData={this.state.liveData}/>}
        >
        </SDPullScrollView>
    );
  }
}

export default connectWithActions((state, props) => ({
  user: state.user
}))(MoreCommentScreen);

class LiveCourseCommenHeader extends React.PureComponent {
  render() {
    const {liveData, commentCount} = this.props;
    return(
      <View>
        <View style={{backgroundColor: '#fff', alignItems: 'center'}}>
          <View style={{marginTop: CSS.pixel(18), alignItems: 'center'}}>
            <Text style={{color: '#333', fontSize: CSS.textSize(28), lineHeight: CSS.pixel(50), fontWeight: '600'}}>{liveData.name}</Text>
          </View>
          <View style={{marginBottom: CSS.pixel(32), alignItems: 'center'}}>
            <Text style={{color: '#666', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(50)}}>导师: {liveData.teacher_name}</Text>
          </View>
        </View>
        <View style={{backgroundColor: '#f3f3f3', height: CSS.pixel(20)}}></View>
        <View style={{paddingTop: CSS.pixel(42), paddingBottom: CSS.pixel(8), paddingHorizontal: CSS.pixel(30), flexDirection: 'row'}}>
          <View style={{flexDirection: 'row'}}>
            {[1, 2, 3, 4, 5].map((c, index) => {
              let score = this.props.liveData && this.props.liveData.score ? this.props.liveData.score : 0;
                let intScore = Math.floor(score);
                let dotScore = score * 10 % 10;
                if(intScore >= c) {
                  return (
                    <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                      <Image
                        source={require("@img/imchat/evaluate_ico_yellow.png")}
                      />
                    </View>
                  )
                } else {
                  if (c - intScore >= 2) {
                    return (
                      <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                        <Image
                          source={require("@img/imchat/evaluate_ico_gray.png")}
                        />
                      </View>
                      ) 
                  } else {
                    if(dotScore > 6) {
                      return (
                        <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                          <Image
                            source={require("@img/imchat/course/evaluate_ico_3_2.png")}
                          />
                        </View>
                      )
                    } else if(dotScore > 3){
                      return (
                        <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                          <Image
                            source={require("@img/imchat/course/evaluate_ico_3_21.png")}
                          />
                        </View>
                      )
                    } else if(dotScore > 0){
                      return (
                        <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                          <Image
                            source={require("@img/imchat/course/evaluate_ico_3_1.png")}
                          />
                        </View>
                      )
                    } else {
                      return (
                        <View key={index + ""} style={{marginRight: CSS.pixel(6), padding: 0, left: -1}}>
                          <Image
                            source={require("@img/imchat/evaluate_ico_gray.png")}
                          />
                        </View>
                      ) 
                    }
                  }
                }
            })}
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: CSS.textSize(24),
                color: SDMainColor,
                lineHeight: CSS.pixel(34),
                fontWeight: '600'
              }}
            >
              {liveData && liveData.score ? parseFloat(liveData.score).toFixed(1) : 0}分
            </Text>
          </View>
        </View>
        
        <View style={{paddingLeft: CSS.pixel(30)}}>
            <Text style={{fontSize: CSS.textSize(20), color: '#999', lineHeight: CSS.pixel(28)}}>{commentCount}条评论</Text>
        </View>
      </View>
    )
  }
}