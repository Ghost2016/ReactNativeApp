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
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import CommentMsgItem from "./CommentItem";
import MyHomeScreen from "../myHome/MyHomeScreen";
import { navScreen } from "../../../styles";
import LiveCourseDetailScreen from "./LiveCourseDetailScreen";

// 职么课堂-我的课程评论
class MyCourseCommentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentData: {}
    };
  }

  componentDidMount() {
    this.props.actions.getCourseCommentAction({
      id: this.props.courseId
    }).then(res => {
      if(res.status == 'ok') {
        this.setState({
          commentData: res.results
        });
      }
    }).catch(err => {

    });
  }

  static contextTypes = {
    navigator: () => null
  }

  _renderItem() {
    let item = this.state.commentData;
    // console.warn(item);
    // return null;
    if(JSON.stringify(item) === '{}') {
      return null;
    }
    return (
      <View style={{ marginVertical: CSS.pixel(30), flexDirection: 'row', marginBottom: CSS.pixel(50, true)}}>
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
            item.user_info && item.user_info.gender == "female" ? (
              <Image resizeMode="stretch" source={require("@img/avator/female.png")} />
            ) : (
              <Image resizeMode="stretch" source={require("@img/avator/male.png")} />
            )
          }
        </SDTouchOpacity>
        <View style={{marginLeft: CSS.pixel(14), flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={{color: '#333', fontSize: CSS.textSize(28), lineHeight: CSS.pixel(40)}}>{item.user_info && item.user_info.nickname}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              {[1,2,3,4,5].map((d, index) => {
                let score = item && item.score ? (item.score * 10 % 10) < 5 ? Math.floor(item.score) : Math.ceil(item.score)  : 0;
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
              <Text style={{color: '#999', fontSize: CSS.textSize(20), lineHeight: CSS.pixel(28)}}>{item.edu_info && item.edu_info.school_name} {item.edu_info && item.edu_info && item.edu_info.degree_name} · {item.edu_info && item.edu_info.major_name}</Text>
            </View>
            <View>
              <Text style={{color: '#999', fontSize: CSS.textSize(20), lineHeight: CSS.pixel(28)}}>
                {item.created_time && item.created_time.replace("-", "年").replace("-", "月").replace("T", "日 ").slice(0, 17)}
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
                      {(item && item.teacher_info && item.teacher_info.avatar) ? 
                      <Image style={{width: CSS.pixel(60), height: CSS.pixel(60)}} source={{uri: item.teacher_info.avatar + '?imageView2/2/h/120'}}/> : 
                      // {gender == "female" ? (
                      //   <Image source={require("@img/rank/rank_ico_female.png")} />
                      // ) : (
                      //   <Image source={require("@img/rank/rank_ico_male.png")} />
                      // )}
                      // <Text>缺失头像</Text> 
                        item && item.teacher_info && item.teacher_info.gender == "female" ? (
                          <Image resizeMode="stretch" source={require("@img/female_master.png")} />
                        ) : (
                          <Image resizeMode="stretch" source={require("@img/male_master.png")} />
                        )
                      }
                    </View>
                    <View style={{marginLeft: CSS.pixel(14), flex: 1}}>
                      <Text style={{fontSize: CSS.textSize(28), color: '#333', lineHeight: CSS.pixel(40)}}>{item && item.teacher_info ? item.teacher_info.nickname: ""}</Text>
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

  render() {
    return (
        <View style={{flex: 1, paddingHorizontal: CSS.pixel(30), backgroundColor: '#fff'}}>
            <SDTouchOpacity onPress={() => {
              this.context.navigator.push(navScreen("PushScreen", "课程详情", {
                passProps: {
                  screen: () => <LiveCourseDetailScreen liveData={{
                    id: this.state.commentData.course_info.id
                  }} noToolbar/>,
                  noScrollView: true,
                  fullScreen: true,
                }
              }));
            }} style={{flexDirection: 'row', borderBottomColor: '#eee', borderBottomWidth: 1, alignItems: 'center',paddingVertical: CSS.pixel(30)}}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <View>
                        <Text style={{fontWeight: 'bold', fontSize: CSS.textSize(30), lineHeight: CSS.pixel(42), color: '#333'}}>{this.state.commentData.course_info ? this.state.commentData.course_info.name: ""}</Text>
                    </View>
                    <View>
                        <Text style={{fontWeight: '500', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34), color: '#333'}}>时间：{this.state.commentData.course_info && this.state.commentData.course_info.created_time ? this.state.commentData.course_info.created_time.replace("-", "年").replace("-", "月").replace("T", "日 ").slice(0, 17) : ""}</Text>
                    </View>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={require("@img/grow/growing_ico_click.png")}/>
                </View>
            </SDTouchOpacity>
            {this._renderItem()}
        </View>
    )
  }
}

export default connectWithActions((state, props) => ({
  user: state.user
}))(MyCourseCommentScreen);