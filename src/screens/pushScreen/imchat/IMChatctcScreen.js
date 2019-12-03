import React from "react";
import ReactNative, {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Animated,
  RefreshControl,
  Platform,
  Modal,
  ActivityIndicator,
  UIManager,
  Keyboard,
  Image,
  AsyncStorage,
  CameraRoll,
  Alert
} from "react-native";
import { Toast } from 'antd-mobile';
import PropTypes from "prop-types";
import ConnectWithActions from "../../../connectWithActions";
import SDKeyboardSpacer from "../../../common/SDKeyboardSpacer";
import { CSS } from "../../../common/SDCSS";
import { isIphoneX } from "../../../utils/iphonex";
import MasterProfileInfo from "./part/MasterProfileInfo";
import StudentMessage from "./part/StudentMessage";
import MasterMessage from "./part/MasterMessage";
import IMChat from "../../../boot/IMChat";
import { navLightBox, SDMainColor } from "../../../styles";
import IMGroupHeaderMenu from "./IMGroupHeaderMenu";
import IMGroupAutoMind from "./IMGroupAutoMind";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import ImageViewer from "react-native-image-zoom-viewer";
import { getUnixTime, cv2UnixTime } from "../../../utils/funcs";
import CourseCommentLightBox from "./CourseCommentLightBox";
import RNFetchBlob from 'rn-fetch-blob';
import Reactotron from "reactotron-react-native";
import _ from 'lodash';
import { AudioMsg } from "./AudioMsg";
import { ScreenType } from "../..";
import { getServerTime } from "../../../api";
import { SERVER_TIME_CONFIG } from "../../AppLaunchScreen";
import { CurrAudioCom } from "../../../common/SDDragMove";
import Popover from "../../../common/Popover";

const darkBackIcon = require("@img/salary/home_Salary_back.png");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  }
});

let masterProfileHeight = 384;

export let MasterMsgView = {};          // 老师的消息view-ref 对应关系
export let StudentMsgView = {};         // 学生的消息view-ref 对应关系
export let MasterReplyMsgView = {};     // 回复的消息体集合view-ref
export let MasterIsRelyMsgs = {};       // 包含的已经回复的消息集合
export let RemoveMsgs = {};             // 被撤销的消息集合
export let AudioArrMsgs = [];           // 语音消息对应前后关系集合
export let AudioMsgRef = {};            // 语音消息对应的view-ref集合
export let currGroupId = null;          // 当前group_id

// 我的-单聊界面
class IMChatctcScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    // Alert.alert(this.props.group.start_time.replace(/-/g, "/").replace("T", " "))
    let cvTime = new Date(this.props.group.start_time.replace(/-/g, "/").replace("T", " "));
    // cvTime = new Date(cvTime.getTime() - cvTime.getTimezoneOffset() * 60000);
    // cvTime = new Date(cvTime.getTime() + cvTime.getTimezoneOffset() * 60000);
    // Alert.alert(cvTime);
    // Alert.alert(cvTime.getTimezoneOffset());
    this.state = {
      messages: [],                             // 开课后的消息
      beforeMessages: [],                       // 开场前的消息
      zhimeMessages: [],                        // 值么助手消息

      masterHeaderAnimate: new Animated.Value(
        CSS.pixel(masterProfileHeight, true)
      ),
      masterTopAnimate: new Animated.Value(0),
      isRefreshing: false,
      isRefreshingAll: false,
      scrollViewOffsetY: 0,

      isShowCourseBeforeMsgs: this.props.group && (this.props.group.status == '进行中' || this.props.group.status == '已结束') ? false : true,             // 是否显示开课前的消息
      courseStartTime: cvTime, // 2018-09-09

      beforeMsgShowTime: null,                  // 用于去掉开场前重复时间显示
      nowMsgShowTime: null,                     // 用于去掉开场后重复时间显示

      msgId: {},                                // 消息id集合 用于去重

      isShowImageViewer: false,
      imageViewerIndex: 0,
      imageMessage: [],                         // 图片消息
      imagesBigUrls: [],                        // 图片预览大图

      isMasterOnly: this.props.group && this.props.group.end_time ? true : false, // 是否只看老师的消息

      userSendFormatInfo: '',                   // JSON.stringify 的文本消息

      isShutUp:  false,                         // 是否已经被禁言
      isShutUpAll: false,                       // 是否全员禁言中
      shupUpTimer: null,                        // 个人禁言的timer
      shupUpAllTimer: null,                     // 是否全员禁言的timer

      isInitEnd: this.props.group.end_time ? true : false,                            // 如果课程一进来就是结束的
      courseEnd: this.props.group.end_time ? true : false,                            // 课程是否结束
      isNeedComment: !this.props.group.is_comment ? true : false,                     // 是否需要评论
      currScore: 0,                             // 课程结束评论
      leftCommentTextNum: 0,
      commentText: "",

      lastSendTime: null,                       // 最后一次发送消息的时间戳

      hasNewMsgs: false,                        // 是否有新的消息
      hasScrollToEnd: false,                    // 是否滚动到底部了

      endMsgCount: 0,                           // 结束消息后获取到的消息总数

      noMoreFooterMsgs: false,                  // 没有更多底部消息了


      localMessageIds: [],                      // 本地消息Ids
      localSendFailedMsgIds: [],                // 本地发送失败的消息Ids
      selectLocalMsgId: null,                   // 当前删除pop选择的消息id
      selectLocalMsgText: '',                   // 当前删除pop选择的消息Txt

      isVisiblePop: false,                      // 删除pop
      buttonRect: {},
    };

    // 假设导师的id为 654207967
    this.masterId = this.props.group ? this.props.group.teacher : 0;
    // this.masterId = 10;

    currGroupId = this.props.group.group_id;
  }

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentWillUnmount() {
    if (this.state.shupUpAllTimer) {
      clearTimeout(this.state.shupUpAllTimer);
    }
    if (this.state.shupUpTimer) {
      clearTimeout(this.state.shupUpTimer);
    }

    // MasterMsgView = {};
    // StudentMsgView = {};
    // MasterReplyMsgView = {};
    // MasterIsRelyMsgs = {};
    // RemoveMsgs = {};
    // AudioArrMsgs = [];
    // AudioMsgRef = {};
    currGroupId = null;
  }

  componentDidMount() {
    // 注册消息接收器
    // 如果课程已经结束
    if(this.props.group && this.props.group.end_time && this.props.group.end_time != "") {
      // 提醒只开启老师
      /**
       * 未开始和进行中的课程进入Live聊天室时，只听导师默认为关闭状态（页面不予提示），
       * 展示所有消息记录，用户开启后，展示消息为导师消息、导师回复学生的消息以及用户自己发的消息
       */

      // 判断是否自己已经评论
      // 放到一下个版本
      // if (this.state.isNeedComment) {
      //   // 弹出需要评论窗口
      //   // 并且判断是否是第一次结束后的聊天室
      //   AsyncStorage.getItem(this.props.group.group_id + "_end_first", (err, res) =>{
      //     if (!err && res) {
      //     } else {
      //       AsyncStorage.setItem(this.props.group.group_id + "_end_first", JSON.stringify({init: true}));
      //       navLightBox("LightBoxScreen", {
      //         passProps: {
      //           screen: () =>  <CourseCommentLightBox liveData={this.props.group} getDetailThis={this.props.getDetailThis}/>
      //         }
      //       })
      //     }
      //   });
      // }

      // 改成通过接口判断是否要评论
      this.props.actions.getPopCommentAction({
        id: this.props.group.id
      }).then(res => {
        if(res.status == 'ok') {
          if(res.results && res.results.status == true) {
            navLightBox("LightBoxScreen", {
              passProps: {
                screen: () =>  <CourseCommentLightBox liveData={this.props.group} getDetailThis={this.props.getDetailThis}/>
              }
            })
          }
        }
      }).catch(err => {

      })

      // 如果是结束后的课程
      // 判断是否是第一次进入
      AsyncStorage.getItem(this.props.group.group_id + "_first", (err, res) =>{
        if (!err && res) {
        } else {
          AsyncStorage.setItem(this.props.group.group_id + "_first", JSON.stringify({init: true}));
          Toast.info("已为你默认开启只听导师", 2);
        }
      });

      // 获取聊天室历史消息
      this.props.actions.getStartMsgAction({
        id: this.props.group.id
      }).then(res => {
        // console.warn(res);
        if(res.status == 'ok') {
          let msgs = [].concat(res.results.before ? res.results.before : []).concat(res.results.after ? res.results.after : []);
          let temp = msgs.map(c => {
            let newData = c.data;
              newData.sender.name = c.user_info ? c.user_info.nickname : "";
              newData.sender.url = c.user_info ? c.user_info.avatar : "";
            try {
              return {
                messageId: c.msg_id,
                type: "text",
                time: cv2UnixTime(newData.time),
                conversationId: this.props.group.group_id,
                conversationType: "Group",
                reply_id: c.reply_id ? c.reply_id : null,
                data: {
                  msg: newData
                }
              }
            } catch (error) {
              return null;
            }
          });
          // this.state.endMsgCount = res.count;
          this.handleMessage(false, temp.filter(c => c != null), false, true);
        }
        // if(res.status == 'ok') {
        //   let temp = res.results.map(c => {
        //     let newData = c.data;
        //       newData.sender.name = c.user_info ? c.user_info.nickname : "";
        //       newData.sender.url = c.user_info ? c.user_info.avatar : "";
        //     try {
        //       return {
        //         messageId: c.msg_id,
        //         type: "text",
        //         time: cv2UnixTime(newData.time),
        //         conversationId: this.props.group.group_id,
        //         conversationType: "Group",
        //         reply_id: c.reply_id ? c.reply_id : null,
        //         data: {
        //           msg: newData
        //         }
        //       }
        //     } catch (error) {
        //       return null;
        //     }
        //   });

        //   // this.state.endMsgCount = res.count;

        //   this.handleMessage(false, temp.filter(c => c != null));
        // }
      }).catch(err => {
      });

    } else {

      // 如果课程没有结束
      IMChat.on("message", res => {
        let msgs = res.results.map(c => {
          // 过滤不是此聊天室的消息
          if(c.conversationId != currGroupId || ScreenType.name != "example.ChatScreen") {
            return null;
          }
          if (c.type == 'text') {
            let temp = JSON.parse(c.data.msg.replace(/&quot;/g, "\""));
            // console.warn(temp)
            temp.msgId = c.messageId;
            temp.time = c.time;
            // 过滤掉空数据
            if (temp.data.msg == "") {
              return null;
            }
            // debugger;
            if(temp && temp.isSystem == true && temp.type == 'robot') {
              this.state.hasNewMsgs = true;
            } else if(temp && temp.isSystem != true && temp.type == 'text') {
              this.state.hasNewMsgs = true;
            }

            return Object.assign({}, c, {
              data: {
                msg: temp
              }
            });
          } else {
            // 考虑系统通知
            return null;
          }
        });

        // 判断有那些删除的数据
        let validMsgs = msgs.filter(c => c != null);
        // Reactotron.log(validMsgs);
        validMsgs.filter(c => c.data.msg.type == 'remove').map(c => {
          if(RemoveMsgs) {
            RemoveMsgs[c.data.msg.msgId + ""] = true;
          }
        });

        validMsgs = validMsgs.map(c => {
          c.reply_id = null;
          if(c.data.msg.type == 'reply') {
            if(RemoveMsgs[c.data.msg.data.to.msgId + ""]) {
              return c;
            } else {
              c.reply_id = c.data.msg.data.to.msgId;
              return c;
            }
          }
          return c;
        })

        // this.handleMessage(false, msgs.filter(c => c != null));
        this.handleMessage(false, validMsgs);

        // 判断如果现在已经是在底部了
        if(this.state.hasScrollToEnd) {
          // 获取到消息后自动滑动1
          // 为了获取新消息
          setTimeout(() => {
            this.refs["containerScroll"] && this.refs["containerScroll"].scrollToEnd();
          }, 100);
        } else {
          // 获取到消息后自动滑动1
          // 为了获取新消息
          setTimeout(() => {
            this.refs["containerScroll"] && this.refs["containerScroll"].scrollTo({
              y: this.state.scrollViewOffsetY + 1
            });
          }, 100);
        }

      });

      // 获取聊天室历史消息
      this.props.actions.getEndMessagesAction({
        id: this.props.group.id,
        desc: true,
        size: 100
      }).then(res => {
        if(res.status == 'ok') {
          let temp = res.results.map(c => {
            let newData = c.data;
              newData.sender.name = c.user_info ? c.user_info.nickname : "";
              newData.sender.url = c.user_info ? c.user_info.avatar : "";
            try {
              return {
                messageId: c.msg_id,
                type: "text",
                time: cv2UnixTime(newData.time),
                conversationId: this.props.group.group_id,
                conversationType: "Group",
                reply_id: c.reply_id ? c.reply_id : null,
                data: {
                  msg: newData
                }
              }
            } catch (error) {
              return null;
            }
          });

          // this.state.endMsgCount = res.count;

          this.handleMessage(false, temp.filter(c => c != null));
        }
      }).catch(err => {
      });

      // 获取之前的消息
      // IMChat.getGroupMessage(this.props.group.group_id, 10, true).then(res => {
      //   let msgs = res.map(c => {
      //     if (c.type == 'text') {
      //       let temp = JSON.parse(c.data.msg.replace(/&quot;/g, "\""));
      //       temp.msgId = c.messageId;
      //       temp.time = c.time;
      //       // 过滤掉空数据
      //       if (temp.data.msg == "") {
      //         return null
      //       }
      //       return Object.assign({}, c, {
      //         data: {
      //           msg: temp
      //         }
      //       });
      //     } else {
      //       return null;
      //     }
      //   });
      //   // 获取漫游消息时不需要系统消息
      //   // Reactotron.log(msgs);
      //   // msgs = msgs.filter(d => d.data.msg.isSystem != true);
      //   // Reactotron.log(msgs);
      //   this.handleMessage(true, msgs.filter(c => c != null));
      // });

      // 判断是否全员禁言
      IMChat.getGroupStatus(this.props.group.group_id).then(res => {
        this.setState({
          isShutUpAll: res.isSilenceAll
        })
      }).catch(err => {
        // console.warn(err);
      });

      // 判断个人是否禁言
      IMChat.getGroupSelfInfo(this.props.group.group_id).then(res => {
        //console.warn('getGroupSelfInfo', res);
        // 加载系统时间
        getServerTime().then(res2 => {
          //console.warn('getServerTime', res2);
          if(res2 && res2 != "") {
            // 获取后台时间
            if(SERVER_TIME_CONFIG.timer) {
              clearInterval(SERVER_TIME_CONFIG.timer);
            }
            if(res2.status == 'ok') {
              SERVER_TIME_CONFIG.time = new Date(parseInt(res2.results.timestamp + "" + "000"));
              SERVER_TIME_CONFIG.timer = setInterval(() => {
                // 加一秒
                SERVER_TIME_CONFIG.time = new Date(SERVER_TIME_CONFIG.time.getTime() + 1000);
              }, 1000);
            }

            let minus = cv2UnixTime(res.silentTime) - getUnixTime();
            //console.warn(minus, 'minus', cv2UnixTime(res.silentTime), getUnixTime(), res);
            // let minus = 5000000;
            if (minus && minus > 0) {
              Toast.info("你已被禁言啦");
              this.setState({
                isShutUp: true
              });
              if (this.state.shupUpTimer) {
                clearTimeout(this.state.shupUpTimer);
              }
              this.state.shupUpTimer = setTimeout(() => {
                this.setState({
                  isShutUp: false
                });
              }, Math.round(minus + 10000));
            }

          }
        }).catch(err => {})
      }).catch(err => {
      });
    }

    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "group_chat_menu_btn"
    );

    if(this.props.group.status == '进行中') {
      setTimeout(() => {
        this.refs["containerScroll"] && this.refs["containerScroll"].scrollToEnd();
      }, 1000);
    } else {
      setTimeout(() => {
        this.refs["containerScroll"] && this.refs["containerScroll"].scrollTo({y: 1});
      }, 100);
    }

    // 注册在进行课程中的退回到后台后更新是否还是禁言状态
    // Appsta

  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "group_chat_menu_btn") {
        navLightBox(
          "LightBoxScreen",
          {
            passProps: {
              screen: () => (
                <IMGroupHeaderMenu
                  isMasterOnly={this.state.isMasterOnly}
                  getGroupRoom={this.getGroupRoom.bind(this)}
                />
              ),
              tapBackgroundToDismiss: false
            }
          },
          {
            backgroundColor: "transparent"
          }
        );
      }
    }
  }

  getGroupRoom() {
    return this;
  }

  // 处理系统消息
  handleSystemMsg(sysMsgs) {
    sysMsgs.map(c => {
      // 判断是否是禁言
      try {
        let temp = c.data.msg;
        if(typeof c.data.msg == 'string') {
          temp = JSON.parse(c.data.msg.replace(/&quot;/g, "\""));
        }
        switch(temp.type) {
          case "shutup":
            this.handleShutup(c);
            break;
          case "openup":
            this.handleOpenup(c);
            break;
          case "shutupall":
            this.handleShutupAll(c);
            break;
          case "openupall":
            this.handleOpenupAll(c);
            break;
          case "courseend":
            this.handleCourseEnd(c);
            break;
          case "robot":
            this.handleRobotMsg(c);
            break;
          case "remove":
            this.handleRemoveMsg(c);
            break;
        }
      } catch (error) {

      }
    });
  }

  // 个人禁言
  handleShutup(msg) {
    // 如果禁言的是自己
    if (msg.data.msg.data.userId == this.props.user.id) {
      // 判断禁言的时间
      let toTime = cv2UnixTime(msg.data.msg.data.toTime);
      // 获取系统时间
      getServerTime().then(res => {
        if(res && res != "") {
          // 获取后台时间
          if(SERVER_TIME_CONFIG.timer) {
            clearInterval(SERVER_TIME_CONFIG.timer);
          }
          if(res.status == 'ok') {
            SERVER_TIME_CONFIG.time = new Date(parseInt(res.results.timestamp + "" + "000"));
            SERVER_TIME_CONFIG.timer = setInterval(() => {
              // 加一秒
              SERVER_TIME_CONFIG.time = new Date(SERVER_TIME_CONFIG.time.getTime() + 1000);
            }, 1000);
          }

          let timeMinus = toTime - getUnixTime();

          // console.warn(msg.data.msg.data.toTime)
          if (timeMinus > 0) {
            if (this.state.shupUpTimer != null) {
              clearTimeout(this.state.shupUpTimer);
            }

            Toast.info("你已被禁言");
            this.setState({
              isShutUp: true
            });
            Keyboard.dismiss();
            this.state.shupUpTimer = setTimeout(()=>{
              if(!this.state.isShutUpAll) {
                Toast.info("你已被解禁");
              }
              this.setState({
                isShutUp: false
              });
            }, Math.round(timeMinus + 10000));
          }

        }
      }).catch(err => {

      });

    }
  }

  // 个人解禁
  handleOpenup(msg) {
    // 如果解禁的是自己
    if (msg.data.msg.data.userId == this.props.user.id) {
      if(!this.state.isShutUpAll) {
        Toast.info("你已被解禁");
      }
      this.setState({
        isShutUp: false
      });
      if (this.state.shupUpTimer) {
        clearTimeout(this.state.shupUpTimer);
      }
    }
  }

  // 全员禁言
  handleShutupAll(msg) {
    // 判断禁言的时间
    Toast.info("已开启全员禁言");
    this.setState({
      isShutUpAll: true
    });

    Keyboard.dismiss();

    return;
    // 目前不考虑全员禁言到多久时间

    let toTime = cv2UnixTime(msg.data.msg.data.toTime);
    let timeMinus = toTime - getUnixTime();

    if (timeMinus > 0) {
      if (this.state.shupUpAllTimer != null) {
        clearTimeout(this.state.shupUpAllTimer);
      }

      Toast.info("你已被禁言");
      this.setState({
        isShutUpAll: true
      });

      Keyboard.dismiss();

      this.state.shupUpAllTimer = setTimeout(()=>{
        if(!this.state.isShutUp) {
          Toast.info("你已被解禁");
        }
        this.setState({
          isShutUpAll: false
        });
      }, Math.round(timeMinus + 10000));
    }

  }

  // 全员解禁
  handleOpenupAll(msg) {
    // if(this.state.isShutUp) {
    //   Toast.info("你已被解禁");
    // }
    if(this.state.isShutUp) {
      Toast.info("已解除全员禁言, 但你仍然被禁言中", 2);
    } else {
      Toast.info("已解除全员禁言", 2);
    }
    this.setState({
      isShutUpAll: false
    });
    if (this.state.shupUpAllTimer) {
      clearTimeout(this.state.shupUpAllTimer);
    }
  }

  // 课程结束
  handleCourseEnd(msg) {
    Toast.info("老师已经结束课程，请对课程进行评价吧～", 2);
    this.setState({
      courseEnd: true,
      isNeedComment: true
    }, () => {
      // 滚动到底部
      setTimeout(() => {
        this.refs["containerScroll"] && this.refs["containerScroll"].scrollToEnd();
      }, 200);
    })
  }

  // 撤销消息
  handleRemoveMsg(msg, toast = true) {
    // 判断此条消息说明的撤销信息是否自己的
    let temp = msg.data.msg;
    if(temp.data && temp.data.msg.sender && (temp.data.msg.sender.id == this.props.user.id)) {
      // 如果撤销的是自己的消息
      // 进行提示
      if(toast) {
        if (temp.data.msg.type == 'text') {
          // 如果撤销的是文本信息
          Toast.info(`你发送的消息"${temp.data.msg.data.msg.slice(0, 15)}"不合规，已被删除！`)
        } else if (temp.data.msg.type == 'image') {
          Toast.info(`你发送的图片，已被删除！`)
        } else if (temp.data.msg.type == 'audio') {
          Toast.info(`你发送的语音，已被删除！`)
        }
      }
    } else if(temp.data && temp.data.msg.sender && (temp.data.msg.sender.id == this.masterId)) {
      // 判断是否是老师撤回的消息
      if(toast) {
        if (temp.data.msg.type == 'text') {
          // 如果撤销的是文本信息
          Toast.info(`老师撤回了一条消息"${temp.data.msg.data.msg.slice(0, 15)}"`)
        } else if (temp.data.msg.type == 'image') {
          Toast.info(`老师撤回了一条图片！`)
        } else if (temp.data.msg.type == 'audio') {
          Toast.info(`老师撤回了一条语音！`)
        } else if (temp.data.msg.type == 'reply') {
          // 并且判断此消息是否是回复信息类消息
          // 如果是要进行去掉相应查看回复按钮的操作
          if(MasterIsRelyMsgs[temp.data.msg.data.to.msgId + ""]) {
            delete MasterIsRelyMsgs[temp.data.msg.data.to.msgId + ""];
          }
          Toast.info(`老师撤回了一条回复消息`);
        }
      }
    }
    // 值么助手的被删除不需要提示
    // Todo

    try {
      CurrAudioCom && CurrAudioCom.ref && CurrAudioCom.ref.pause && CurrAudioCom.ref.pause();
    } catch (error) {

    }

    // Reactotron.log(temp.data.msg.msgId);
    if(RemoveMsgs) {
      RemoveMsgs[temp.data.msg.msgId + ""] = true;
      this.setState({
        messages: [].concat(this.state.messages)
      });
    }
  }

  // 职么课堂-值么助手
  handleRobotMsg(msg) {
    // 判断值么助手说的话是在开课前还是开课后
    let msgs = this.uniqueMsg(msg.length ? msg : [msg]);
    let newMsgs = this.state.messages.concat(msgs.now);
    let beforeMsgs = this.state.beforeMessages.concat(msgs.before);
    this.setState({
      messages: _.sortBy(newMsgs, item => {
        return parseInt(item.data.msg.time);
      }),
      beforeMessages: _.sortBy(beforeMsgs, item => {
        return parseInt(item.data.msg.time);
      }),
    });
  }

  // 检查之前的消息是否有回复消息
  checkExistReplyMsg(msgs) {
    // 判断是否存在消息已经回复此条消息
    // 加入属于回复消息的数据
    msgs.map(c => {
      let temp = c.data.msg;
      if (temp.type == 'reply') {
        if (MasterIsRelyMsgs && temp.data.to.msgId != "") {
          MasterIsRelyMsgs[temp.data.to.msgId + ""] = true;
        }
      }
    });
  }

  // 消息分发处理入口
  handleMessage(isRoam, msgs, shift, isFetchNext) {
    // Reactotron.log(msgs);
    // 处理系统消息
    let sysMsgs = msgs.filter(c => c.data.msg.isSystem == true);
    // 判断是否获取的漫游数据
    try {
      if(isRoam) {
        // 处理系统消息是删除的
        sysMsgs.filter(c => c.data.msg.type == 'remove').map(c => {
          this.handleRemoveMsg(c, false);
        });
      } else {
        // 实时发送的系统消息
        this.handleSystemMsg(sysMsgs);
      }
    } catch (error) {

    }

    // 处理非系统消息
    msgs = msgs.filter(c => c.data.msg.isSystem != true);
    // Reactotron.log(msgs.filter(c => c.data.msg.type == 'audio'));

    // 处理聊天消息
    // 判断是否被回复
    this.checkExistReplyMsg(msgs);

    let uniqMsg = this.uniqueMsg(msgs);
    // Reactotron.log(uniqMsg);
    // 判断图片
    // 获取图片顺序
    let imagesNowMsg = uniqMsg.now.filter(c => {
      if (c.type == 'text') {
        d = c.data.msg;
        if (d.type == "image") {
          return true;
        }
        return false;
      } else {
        return false;
      }
    });
    let imagesBeforeMsg = uniqMsg.before.filter(c => {
      if (c.type == 'text') {
        d = c.data.msg;
        if (d.type == "image") {
          return true;
        }
        return false;
      } else {
        return false;
      }
    });

    // 判断语音消息顺序
    // let audioNowMsg = uniqMsg.now.filter(c => {
    //   if (c.type == 'text') {
    //     d = c.data.msg;
    //     if (d.type == "audio") {
    //       return true;
    //     }
    //     return false;
    //   } else {
    //     return false;
    //   }
    // });

    // let audioBeforeMsg = uniqMsg.before.filter(c => {
    //   if (c.type == 'text') {
    //     d = c.data.msg;
    //     if (d.type == "audio") {
    //       return true;
    //     }
    //     return false;
    //   } else {
    //     return false;
    //   }
    // });

    if (shift) {
      let newMsgs = uniqMsg.now.concat(this.state.messages);
      let beforeMsgs = uniqMsg.before.concat(this.state.beforeMessages);

      this.setState({
        messages: _.sortBy(newMsgs, item => {
          return parseInt(item.data.msg.time);
        }),
        beforeMessages: _.sortBy(beforeMsgs, item => {
          return parseInt(item.data.msg.time);
        }),
        imageMessage: []
          .concat(imagesBeforeMsg)
          .concat(imagesNowMsg)
          .concat(this.state.imageMessage)
      });

      // 语音消息
      // let audioBeforeMsg_ = audioBeforeMsg.map(c => {
      //   return new AudioMsg(c.data.msg.msgId, c.data.msg.data.url, c.data.msg.data.duration);
      // });

      // let audioNowMsg_ = audioNowMsg.map(c => {
      //   return new AudioMsg(c.data.msg.msgId, c.data.msg.data.url, c.data.msg.data.duration);
      // });

      // let temp = [].concat(audioBeforeMsg_).concat(audioNowMsg_);

      // for (let i = 0; i < temp.length; i++) {
      //   const element = temp[i];
      //   if(temp[i + 1]) {
      //     element.next = temp[i + 1];
      //   }
      // }

      // if(AudioArrMsgs && AudioArrMsgs.length > 0 && temp.length > 0) {
      //   temp[temp.length - 1].next = AudioArrMsgs[0];
      // }

      // AudioArrMsgs = [].concat(temp).concat(AudioArrMsgs);
      // Reactotron.log(AudioArrMsgs);
    } else {
      // console.warn("bbb")
      let newMsgs = this.state.messages.concat(uniqMsg.now);
      let beforeMsgs = this.state.beforeMessages.concat(uniqMsg.before);
      this.setState({
        messages: _.sortBy(newMsgs, item => {
          return parseInt(item.data.msg.time);
        }),
        beforeMessages: _.sortBy(beforeMsgs, item => {
          return parseInt(item.data.msg.time);
        }),
        imageMessage: []
          .concat(this.state.imageMessage)
          .concat(imagesBeforeMsg)
          .concat(imagesNowMsg)
      });

      // 语音消息
      // let audioBeforeMsg_ = audioBeforeMsg.map(c => {
      //   return new AudioMsg(c.data.msg.msgId, c.data.msg.data.url, c.data.msg.data.duration);
      // });

      // // 语音消息
      // let audioNowMsg_ = audioNowMsg.map(c => {
      //   return new AudioMsg(c.data.msg.msgId, c.data.msg.data.url, c.data.msg.data.duration);
      // });

      // let temp = [].concat(audioBeforeMsg_).concat(audioNowMsg_);

      // if(AudioArrMsgs && AudioArrMsgs.length > 0 && temp.length > 0){
      //   AudioArrMsgs[AudioArrMsgs.length - 1].next = temp[0];
      // }

      // for (let i = 0; i < temp.length; i++) {
      //   const element = temp[i];
      //   if(temp[i + 1]) {
      //     element.next = temp[i + 1];
      //   }
      // }

      // AudioArrMsgs = [].concat(AudioArrMsgs).concat(temp);
    }

    // 是否自动获取下一百条
    if(isFetchNext) {
      setTimeout(() => {
        if(this.props.group.status == '已结束' && this.state.noMoreFooterMsgs != true) {
          this.props.actions.getEndMessagesAction({
            id: this.props.group.id,
            // desc: false,
            size: 100,
            msg_id: this.state.messages.length > 0 ?
              this.state.messages[this.state.messages.length - 1].messageId :
              this.state.beforeMessages.length > 0 ? this.state.beforeMessages[this.state.beforeMessages.length - 1].messageId : 0
          }).then(res => {
            if(res.status == 'ok' && res.results.length > 0) {
              let temp = res.results.map(c => {
                let newData = c.data;
                newData.sender.name = c.user_info ? c.user_info.nickname : "";
                newData.sender.url = c.user_info ? c.user_info.avatar : "";
                try {
                  return {
                    messageId: c.msg_id,
                    type: "text",
                    time: cv2UnixTime(newData.time),
                    conversationId: this.props.group.group_id,
                    conversationType: "Group",
                    reply_id: c.reply_id ? c.reply_id : null,
                    data: {
                      msg: newData
                    }
                  }
                } catch (error) {
                  return null;
                }
              });
              this.handleMessage(false, temp.filter(c => c != null), false);
              // this.setState({
              //   isRefreshing: false
              // });
            } else {
              this.state.noMoreFooterMsgs = true;
            }
          }).catch(err => {
            this.state.noMoreFooterMsgs = true;
          });
        }
      }, 100);
    }
  }

  // 判断此消息属于此组和唯一的
  uniqueMsg(arr) {
    let res = [];
    let beforeTimeRes = [];
    for (let i = 0; i < arr.length; i++) {
      let msgId = arr[i]["messageId"];
      if (!this.state.msgId[msgId]) {
        // 判断此消息是否属于此组
        if (
          arr[i].conversationId == this.props.group.group_id &&
          arr[i].conversationType == "Group"
        ) {
          // 判断是开课前的消息还是开课后的消息
          // Reactotron.log(arr[i])
          if (
            cv2UnixTime(arr[i]["time"]) >
            (this.state.courseStartTime.getTime())
          ) {
            // 开课后
            res.push(arr[i]);
            this.state.msgId[msgId] = 1;
          } else {
            // 开课前的消息
            beforeTimeRes.push(arr[i]);
            this.state.msgId[msgId] = 1;
          }
        }
      }
    }
    return {
      now: _.sortBy(res, item => {
        return parseInt(item.data.msg.time);
      }),
      before: _.sortBy(beforeTimeRes, item => {
        return parseInt(item.data.msg.time);
      }),
    };
  }

  _onScrollView(e) {
    this.state.scrollViewOffsetY = e.nativeEvent.contentOffset.y;
    // return;
    // if (
    //   e.nativeEvent.contentOffset.y >
    //   CSS.pixel(masterProfileHeight, true) + 100
    // ) {
    //   return;
    // }
    const contentHeight = e.nativeEvent.contentSize.height;
    const scrollY = e.nativeEvent.contentOffset.y;
    const layoutHeight = e.nativeEvent.layoutMeasurement.height;
    if (scrollY + layoutHeight >= contentHeight - 20) {
      // 如果已经到底部了
      if(this.state.hasScrollToEnd != true) {
        this.setState({
          hasNewMsgs: false,
          hasScrollToEnd: true
        })
      }
      // return;
    } else {
      if(this.state.hasScrollToEnd != false) {
        this.setState({
          hasNewMsgs: false,
          hasScrollToEnd: false
        });
      }
    }

    // 已经快到底部需要刷新获取下面的数据
    if(scrollY + layoutHeight >= contentHeight - 160) {
      // 如果是已经结束了
      // 并且还有之后的数据
      if(this.props.group.status == '已结束' && this.state.noMoreFooterMsgs != true) {
        this.props.actions.getEndMessagesAction({
          id: this.props.group.id,
          // desc: false,
          size: 100,
          msg_id: this.state.messages.length > 0 ?
            this.state.messages[this.state.messages.length - 1].messageId :
            this.state.beforeMessages.length > 0 ? this.state.beforeMessages[this.state.beforeMessages.length - 1].messageId : 0
        }).then(res => {
          if(res.status == 'ok' && res.results.length > 0) {
            let temp = res.results.map(c => {
              let newData = c.data;
              newData.sender.name = c.user_info ? c.user_info.nickname : "";
              newData.sender.url = c.user_info ? c.user_info.avatar : "";
              try {
                return {
                  messageId: c.msg_id,
                  type: "text",
                  time: cv2UnixTime(newData.time),
                  conversationId: this.props.group.group_id,
                  conversationType: "Group",
                  reply_id: c.reply_id ? c.reply_id : null,
                  data: {
                    msg: newData
                  }
                }
              } catch (error) {
                return null;
              }
            });
            this.handleMessage(false, temp.filter(c => c != null), false);
            // this.setState({
            //   isRefreshing: false
            // });
          } else {
            this.state.noMoreFooterMsgs = true;
          }
        }).catch(err => {
          this.state.noMoreFooterMsgs = true;
        });
      }
    }




    return;
    // if (
    //   e.nativeEvent.contentOffset.y >
    //   CSS.pixel(masterProfileHeight, true) + 100
    // ) {
    //   return;
    // }

    // if (Platform.OS == "ios") {
    //   if (e.nativeEvent.contentOffset.y <= 0) {
    //     Animated.parallel([
    //       Animated.timing(this.state.masterHeaderAnimate, {
    //         toValue: parseInt(CSS.pixel(masterProfileHeight, true)),
    //         duration: 0
    //       }),
    //       Animated.timing(this.state.masterTopAnimate, {
    //         toValue: 0,
    //         duration: 0
    //       })
    //     ]).start();
    //   } else if (
    //     e.nativeEvent.contentOffset.y > CSS.pixel(masterProfileHeight, true)
    //   ) {
    //     Animated.parallel([
    //       Animated.timing(this.state.masterHeaderAnimate, {
    //         toValue: 0,
    //         duration: 0
    //       }),
    //       Animated.timing(this.state.masterTopAnimate, {
    //         toValue: parseInt(-CSS.pixel(masterProfileHeight, true)),
    //         duration: 0
    //       })
    //     ]).start();
    //   } else {
    //     Animated.parallel([
    //       Animated.timing(this.state.masterHeaderAnimate, {
    //         toValue: parseInt(
    //           CSS.pixel(masterProfileHeight, true) -
    //             e.nativeEvent.contentOffset.y
    //         ),
    //         duration: 0
    //       }),
    //       Animated.timing(this.state.masterTopAnimate, {
    //         toValue: -e.nativeEvent.contentOffset.y,
    //         duration: 0
    //       })
    //     ]).start();
    //   }
    // } else {
    //   if (e.nativeEvent.contentOffset.y <= 0) {
    //     Animated.timing(this.state.masterHeaderAnimate, {
    //       toValue: parseInt(CSS.pixel(masterProfileHeight, true)),
    //       duration: 0
    //     }).start();
    //   } else if (
    //     e.nativeEvent.contentOffset.y > CSS.pixel(masterProfileHeight, true)
    //   ) {
    //     Animated.timing(this.state.masterHeaderAnimate, {
    //       toValue: 0,
    //       duration: 100
    //     }).start();
    //   } else {
    //     // Animated.timing(this.state.masterHeaderAnimate, {
    //     //   toValue: parseInt(
    //     //     CSS.pixel(masterProfileHeight, true) -
    //     //       e.nativeEvent.contentOffset.y
    //     //   ),
    //     //   duration: 0
    //     // }).start();
    //   }
    // }
  }

  _onRefresh() {
    // 如果是结束课程后来进行获取消息
    // if(this.props.group && this.props.group.end_time && this.props.group.end_time != "") {
      // if(this.state.endMsgCount <= (this.state.messages.length + this.state.beforeMessages.length)) {
      if(this.state.isRefreshingAll) {
        // 已经没有数据了
        this.setState({
          isRefreshing: false,
        }, () => {
          setTimeout(() => {
            this.setState({
              isRefreshingAll: true
            })
          });
        });
        return;
      } else {
        // 继续获取数据
        this.props.actions.getEndMessagesAction({
          id: this.props.group.id,
          desc: true,
          size: 100,
          msg_id: this.state.beforeMessages.some(c => (c.messageId + "").indexOf("local") < 0) ?
            this.state.beforeMessages.find(c => (c.messageId + "").indexOf("local") < 0).messageId :
            this.state.messages.some(c => (c.messageId + "").indexOf("local") < 0) ? this.state.messages.find(c => (c.messageId + "").indexOf("local") < 0).messageId : 0
        }).then(res => {
          if(res.status == 'ok' && res.results.length > 0) {
            let temp = res.results.map(c => {
              let newData = c.data;
              newData.sender.name = c.user_info ? c.user_info.nickname : "";
              newData.sender.url = c.user_info ? c.user_info.avatar : "";
              try {
                return {
                  messageId: c.msg_id,
                  type: "text",
                  time: cv2UnixTime(newData.time),
                  conversationId: this.props.group.group_id,
                  conversationType: "Group",
                  reply_id: c.reply_id ? c.reply_id : null,
                  data: {
                    msg: newData
                  }
                }
              } catch (error) {
                return null;
              }
            });
            this.handleMessage(false, temp.filter(c => c != null), true);
            this.setState({
              isRefreshing: false
            });
          } else {
            this.setState({
              isRefreshing: false
            }, () => {
              setTimeout(() => {
                this.setState({
                  isRefreshingAll: true
                });
              })
            });
          }
        }).catch(err => {
          this.setState({
            isRefreshing: false
          });
        });
      }
      return;
    // }
  }

  // 已经加载所有数据
  renderAllMessageShow() {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 10
        }}
      >
        <Text style={{ color: "#999" }}>已加载所有消息</Text>
      </View>
    );
  }

  // 开课前的消息
  renderCourseStartView() {
    if (this.state.beforeMessages.length <= 0) {
      return null;
    }
    if (this.state.isShowCourseBeforeMsgs) {
      return (
        <View style={{ width: "100%" }}>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                marginTop: CSS.pixel(30),
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.05)",
                width: CSS.pixel(404),
                height: CSS.pixel(50, true),
                borderRadius: CSS.pixel(8)
              }}
            >
              <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                开场前的内容已被展开
              </Text>
              <SDTouchOpacity
                onPress={() => {
                  this.setState({
                    isShowCourseBeforeMsgs: false
                  });
                }}
              >
                <Text
                  style={{ color: SDMainColor, fontSize: CSS.textSize(24) }}
                >
                  点击收起
                </Text>
              </SDTouchOpacity>
            </View>
          </View>
          <View>
            {this.state.beforeMessages.map((message, index) => {
              // 判断此消息是否被删除
              // console.warn(message.messageId + "")
              // console.warn(message.data.msg.msgId + "")
              if(RemoveMsgs[message.messageId + ""]) {
                return null;
              }
              // 判断发送者是谁
              if (message.type == 'text') {
                // 判断是否是只显示老师及自己的消息、及学生被回复的消息
                let temp = message.data.msg;
                if (this.state.isMasterOnly) {
                  let isLeft = false;
                  if(MasterIsRelyMsgs[message.messageId]) {
                    // 如果此消息是被回复的
                    // isLeft = true;
                    if(temp && temp.sender && (temp.sender.id == this.props.user.id)) {
                      isLeft = true;
                    } else {
                      isLeft = false;
                    }
                  } else {
                    // 判断是否是老师的消息或者是自己的消息
                    if (temp && temp.sender && (temp.sender.id == this.masterId)) {
                      // 老师的消息
                      isLeft = true;
                    } else if(temp && temp.sender && (temp.sender.id == this.props.user.id)) {
                      // 自己的消息
                      isLeft = true;
                    }
                  }
                  if(isLeft == false) {
                    return null;
                  }
                }

                try {
                  if (temp && temp.sender && (temp.sender.id == this.masterId)) {
                    return (
                      <View style={{paddingHorizontal: CSS.pixel(30)}} key={index + ""}>
                        {/* {this.renderMsgTime(message.time, true)} */}
                        <MasterMessage
                          gender={this.props.group && this.props.group.teacher_gender ? this.props.group.teacher_gender : "male"}
                          msg={message}
                          onPressImg={this._onClickImage.bind(this)}
                        />
                      </View>
                    )
                  } else if(temp && temp.type == 'robot') {
                    // 如果是值么助手
                    return (
                      <View style={{paddingHorizontal: CSS.pixel(30)}} key={index + ""}>
                        {/* {this.renderMsgTime(message.time)} */}
                        <MasterMessage
                          gender={this.props.group && this.props.group.teacher_gender ? this.props.group.teacher_gender : "male"}
                          isRobot={true}
                          msg={message}
                          onPressImg={this._onClickImage.bind(this)}
                        />
                      </View>
                    );
                  } else {
                    let msgStatus = this.state.localSendFailedMsgIds.findIndex(c => c == message.messageId) >= 0 ? 'failed' :
                    this.state.localMessageIds.findIndex(c => c == message.messageId) >= 0 ? 'sending' :
                    (message.messageId + "").indexOf("local") >= 0 ? 'sended' : 'send';
                    if(msgStatus == 'sended') {
                      return null;
                    }
                    return (
                      <View style={{paddingHorizontal: CSS.pixel(30)}} key={index + ""}>
                        {/* {this.renderMsgTime(message.time, true)} */}
                        <StudentMessage status={msgStatus} userId={this.props.user.id} msg={message} getGroupRoom={this.getGroupRoom.bind(this)} isReplyed={MasterIsRelyMsgs && MasterIsRelyMsgs[message.data.msg.msgId]} />
                      </View>
                    )
                  }
                } catch(err) {
                  // console.warn(err);
                }
              }
            })}
          </View>
          {this.state.messages.length > 0 ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: CSS.pixel(82, true)
              }}
            >
              <View
                style={{
                  height: 1,
                  width: CSS.pixel(102),
                  backgroundColor: "#ddd"
                }}
              />
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={{
                    marginHorizontal: CSS.pixel(10),
                    color: "#999",
                    fontSize: CSS.textSize(24),
                    fontWeight: "600"
                  }}
                >
                  {this.state.messages.length > 0 ? '以下是课程开场后的内容' : ''}
                </Text>
              </View>
              <View
                style={{
                  height: 1,
                  width: CSS.pixel(102),
                  backgroundColor: "#ddd"
                }}
              />
            </View>
          ) : null}
        </View>
      );
    } else {
      return (
        <View style={{ width: "100%" }}>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                marginTop: CSS.pixel(30),
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.05)",
                width: CSS.pixel(404),
                height: CSS.pixel(50, true),
                borderRadius: CSS.pixel(8)
              }}
            >
              <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                开场前的内容已被收起
              </Text>
              <SDTouchOpacity
                onPress={() => {
                  this.setState({
                    isShowCourseBeforeMsgs: true
                  });
                }}
              >
                <Text
                  style={{ color: SDMainColor, fontSize: CSS.textSize(24) }}
                >
                  点击展开
                </Text>
              </SDTouchOpacity>
            </View>
          </View>
        </View>
      );
    }
  }

  // 是否开场前的消息
  renderMsgTime(time, isBeforeMsg) {
    // 判断是否此时间已经显示过了
    // 判断此时间是否是以毫秒结束 补充占位符
    let currTime = new Date(cv2UnixTime(time));
    let str = `${currTime.getFullYear()}年${currTime.getMonth() +
      1}月${currTime.getDate()}日  ${currTime.getHours()}:${currTime.getMinutes() < 10 ? "0" + currTime.getMinutes() : currTime.getMinutes()}`;
    if (isBeforeMsg) {
      if (this.state.beforeMsgShowTime == str) {
        return null;
      } else {
        this.state.beforeMsgShowTime = str;
        return (
          <View
            style={{
              marginTop: CSS.pixel(40),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
              {str}
            </Text>
          </View>
        );
      }
    } else {
      if (this.state.nowMsgShowTime == str) {
        return null;
      } else {
        this.state.nowMsgShowTime = str;
        return (
          <View
            style={{
              marginTop: CSS.pixel(40),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
              {str}
            </Text>
          </View>
        );
      }
    }
  }

  // 点击预览图片
  _onClickImage(imgMsg, urls) {
    if(urls) {
      this.setState({
        isShowImageViewer: true,
        imageViewerIndex: 0,
        imagesBigUrls: urls
      });
    } else {
      // 判断此图片所在的数组里的索引
      let index = this.state.imageMessage.findIndex(
        c => c.messageId == imgMsg.messageId
      );
      this.setState({
        isShowImageViewer: true,
        imageViewerIndex: index,
        imagesBigUrls: this.state.imageMessage.map(c => {
          try {
            // console.warn(c.data.msg)
            // let temp = JSON.parse(c.data.msg.replace(/&quot;/g, "\""));
            let temp = c.data.msg;
            return { url: temp.data.url };
          } catch (error) {
            return {
              url: ''
            }
          }
        })
      });
    }
  }

  // 发送消息处理
  _handleSendMessage(messageId) {
    // 判断当前的时间是否已经是大于开场时间了
    let msgData = JSON.parse(this.state.userSendFormatInfo);
    msgData.msgId = messageId;
    let timeNow = getUnixTime();
    if (timeNow >= this.state.courseStartTime.getTime()) {
      this.setState(
        {
          textSelf: "",
          messages: [].concat(this.state.messages).concat([
            {
              messageId: messageId,
              type: "text",
              time: timeNow,
              conversationId: this.props.group.group_id,
              conversationType: "Group",
              reply_id: null,
              data: {
                msg: msgData
              }
            }
          ])
        },
        () => {
          setTimeout(() => {
            this.refs["containerScroll"] && this.refs["containerScroll"].scrollToEnd();
          });
        }
      );
    } else {
      this.setState(
        {
          textSelf: "",
          beforeMessages: [].concat(this.state.beforeMessages).concat([
            {
              messageId: messageId,
              type: "text",
              time: timeNow,
              conversationId: this.props.group.group_id,
              conversationType: "Group",
              data: {
                msg: msgData
              }
            }
          ])
        },
        () => {
          setTimeout(() => {
            this.refs["containerScroll"] && this.refs["containerScroll"].scrollToEnd();
          });
        }
      );
    }
  }

  // 查找回复的消息节点
  findMsgNode(msgId) {
    return MasterReplyMsgView[msgId + ""];
  }

  // 课程结束
  renderCourseEnd() {
    if (!this.state.courseEnd || this.state.isInitEnd) {
      // 如果课程没结束
      // 或者课程一进来就是结束的
      return null;
    }
    if(this.state.isNeedComment && this.state.courseEnd) {
      return (
        <View style={{backgroundColor: '#fff'}}>
          <View style={{flexDirection: 'row', backgroundColor: '#f3f3f3', height: CSS.pixel(94), justifyContent: 'center', alignItems: 'center'}}>
            <View style={{height: 1, width: CSS.pixel(100), backgroundColor: '#ddd'}}></View>
            <View style={{marginHorizontal: CSS.pixel(10)}}>
              <Text style={{fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34), fontWeight: '600', color: '#999'}}>课程结束 {this.state.isNeedComment ? "" : "你已评论"}</Text>
            </View>
            <View style={{height: 1, width: CSS.pixel(100), backgroundColor: '#ddd'}}></View>
          </View>
          {
            this.returnNeedComment()
          }
          <SDKeyboardSpacer
            topSpacing={isIphoneX() ? -34 : -100}
            onToggle={open => {
              if (open) {
                setTimeout(() => {
                  this.refs["containerScroll"] && this.refs["containerScroll"].scrollToEnd();
                });
              }
            }}
          />
        </View>
      )
    }

  }

  // 课程评论
  returnNeedComment() {
    return (
      <View style={{flex: 1, backgroundColor: '#f3f3f3'}}>
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

      <View style={{paddingHorizontal: CSS.pixel(28), paddingVertical: CSS.pixel(32), height: CSS.pixel(600), backgroundColor: '#fff', paddingBottom: 104}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{color: '#666', fontSize: CSS.textSize(28), lineHeight: CSS.pixel(40)}}>评论</Text>
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text style={{color: '#666', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>{(150 - this.state.leftCommentTextNum) >= 0 ? (150 - this.state.leftCommentTextNum) : 0}字</Text>
          </View>
        </View>
        <View style={{marginTop: CSS.pixel(16), flexWrap: 'wrap'}}>
          <TextInput autoCapitalize="none" autoCorrect={false} enablesReturnKeyAutomatically={true} returnKeyType="default" returnKeyLabel="换行" onChangeText={(t) => {
            this.setState({
              commentText: t.slice(0, 150),
              leftCommentTextNum: t.length
            });
            if(t.length > 150) {
              Toast.info("已超出字数限制", 0.3);
            }
          }} multiline={true} numberOfLines={10} value={this.state.commentText} underlineColorAndroid="transparent" placeholder="课程讲解如何，是否有收获？" style={{padding: 0, textAlignVertical: 'top', paddingBottom: CSS.pixel(30)}}/>
        </View>
        <View style={{alignItems: 'center', backgroundColor: '#fff', position: 'absolute', bottom: 25, justifyContent: 'center', width: CSS.width()}}>
          <SDTouchOpacity
          onPress={this.commentOnPress.bind(this)}
          disabled={this.state.currScore != 0 ? false : true}
          style={{backgroundColor: this.state.currScore != 0 ? SDMainColor : '#d2d2d2', width: CSS.pixel(550), height: CSS.pixel(80), borderRadius: CSS.pixel(40), overflow: 'hidden', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: CSS.textSize(32), color: '#333', lineHeight: CSS.pixel(44)}}>提交</Text>
          </SDTouchOpacity>
        </View>
      </View>

    </View>
    )
  }

  // 评论按钮事件
  commentOnPress() {
    if(this.state.currScore <= 0) {
      Toast.info("请评分", 1)
      return;
    }
    this.props.actions.addCourseCommentAction({
      id: this.props.group.id,
      score: this.state.currScore,
      content: this.state.commentText || ""
    }).then(res => {
      if (res.status == 'ok') {
        Toast.success("评论成功", 1);
        this.setState({
          isNeedComment: false
        });

        this.props.getDetailThis && this.props.getDetailThis().fetNewData && this.props.getDetailThis().fetNewData(true);
      } else {
        Toast.fail("评论出错啦", 1);
      }
    }).catch(err => {
      Toast.fail("评论出错啦", 1);
    })
  }

  // 重新发送失败的信息
  onPressReSendMsg() {
    this.setState({
      isVisiblePop: false
    }, () => {
      if(this.state.selectLocalMsgId && this.state.selectLocalMsgText) {
        this.state.localMessageIds.splice(this.state.localMessageIds.findIndex(c => c == this.state.selectLocalMsgId), 1);
        this.state.localSendFailedMsgIds.splice(this.state.localSendFailedMsgIds.findIndex(c => c == this.state.selectLocalMsgId), 1);

        // 重新发送
        setTimeout(() => {
          this.sendEditMsg(this.state.selectLocalMsgText);
        }, 150)
      }
    });
  }

  // 发送消息
  sendEditMsg(txt) {
    // 获取系统时间
    getServerTime().then(res => {
      if(res && res.status == 'ok') {
        this.state.userSendFormatInfo = JSON.stringify({
          isSystem: false,
          msgId: "",
          type: "text",
          time: parseInt(res.results.timestamp),
          sender: {
              id: this.props.user.id,
              name: this.props.user.nickname,
              url: this.props.user.avatar ? this.props.user.avatar.url : "",
              gender: this.props.user.gender
          },
          data: {
              msg: txt ? txt : this.state.textSelf
          }
        });

        // 发送到本地消息
        let localId = "local" + parseInt(Math.random() * 10000);
        // 添加到本地消息
        this.state.localMessageIds.push(localId)
        this._handleSendMessage(localId);

        IMChat.sendGroupTextMessage(
          this.state.userSendFormatInfo,
          this.props.group.group_id
        )
          .then(res => {
            // 移除本地消息
            let index = this.state.localMessageIds.findIndex(c => c == localId);
            this.state.localMessageIds.splice(index, 1);

            // 处理发送的消息
            this._handleSendMessage(res);
          })
          .catch(err => {
            if(err && err.code) {
              switch(err.code) {
                case "80001":
                  Toast.info("不允许带有敏感词汇，发送失败");
                  break;
                case "10017":
                  Toast.info("你已被禁言，不允许发送消息");
                  break;
                case "10023":
                  Toast.info("发消息的频率超限");
                  break;
              }
            } else {
              Toast.info("发送失败");
            }
            this.setState({
              localSendFailedMsgIds: [].concat(this.state.localSendFailedMsgIds).concat([localId])
            });
          });
      } else {
        Toast.info("获取服务器时间出错");
      }
    }).catch(err => {
      Toast.info("获取服务器时间出错");
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          ref="containerScroll"
          style={{
            flex: 1,
            backgroundColor: "#fff",
            // paddingHorizontal: CSS.pixel(30)
          }}
          onScroll={this._onScrollView.bind(this)}
          bounces={true}
          alwaysBounceVertical={true}
          scrollEventThrottle={0.5}
          refreshControl={
            this.state.isRefreshingAll ? null : (
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh.bind(this)}
                tintColor="#999"
                title="加载中..."
                titleColor="#999"
                colors={["#999", "#00ff00", "#0000ff"]}
                progressBackgroundColor="#ffffff"
              />
            )
          }
        >

          <Animated.View
            style={{
              overflow: "hidden",
              height: CSS.pixel(masterProfileHeight, true),
              backgroundColor: "#fff"
            }}
          >
            <Animated.View
              style={{
                flex: 1,
                // top: this.state.masterTopAnimate
              }}
            >
              <MasterProfileInfo group={this.props.group}/>
            </Animated.View>
            <View
              style={{ height: CSS.pixel(20, true), backgroundColor: "#f3f3f3" }}
            />
          </Animated.View>

          {!this.state.isRefreshingAll ? null : this.renderAllMessageShow()}

          {/* 开课前的消息 */}
          {this.renderCourseStartView()}

          {this.state.messages.map((message, index) => {
            // 判断此消息是否被删除
            if(RemoveMsgs[message.messageId + ""]) {
              return null;
            }

            // 判断发送者是谁
            if (message.type == 'text') {
              // 判断是否是只显示老师及自己的消息、及学生被回复的消息
              let temp = message.data.msg;
              if(this.state.isMasterOnly) {

                // 是否留下
                let isLeft = false;
                if(MasterIsRelyMsgs[message.messageId]) {
                  // 如果此消息是被回复的
                  // 本来是要留下的
                  // isLeft = true;
                  if(temp && temp.sender && (temp.sender.id == this.props.user.id)) {
                    isLeft = true;
                  } else {
                    isLeft = false;
                  }
                } else {
                  // 判断是否是老师的消息或者是自己的消息
                  if (temp && temp.sender && (temp.sender.id == this.masterId)) {
                    // 老师的消息
                    isLeft = true;
                  } else if(temp && temp.sender && (temp.sender.id == this.props.user.id)) {
                    // 自己的消息
                    isLeft = true;
                  }
                }
                if(isLeft == false) {
                  return null;
                }
              }
              try {
                // let temp = JSON.parse(message.data.msg.replace(/&quot;/g, "\""));
                if (temp && temp.sender && (temp.sender.id == this.masterId)) {
                  return (
                    <View style={{paddingHorizontal: CSS.pixel(30)}} key={index + ""}>
                      {/* {this.renderMsgTime(message.time)} */}
                      <MasterMessage
                        gender={this.props.group && this.props.group.teacher_gender ? this.props.group.teacher_gender : "male"}
                        msg={message}
                        onPressImg={this._onClickImage.bind(this)}
                      />
                    </View>
                  )
                } else if(temp && temp.type == 'robot') {
                  // 如果是值么助手
                  return (
                    <View style={{paddingHorizontal: CSS.pixel(30)}} key={index + ""}>
                      {/* {this.renderMsgTime(message.time)} */}
                      <MasterMessage
                        gender={this.props.group && this.props.group.teacher_gender ? this.props.group.teacher_gender : "male"}
                        isRobot={true}
                        msg={message}
                        onPressImg={this._onClickImage.bind(this)}
                      />
                    </View>
                  );
                } else {
                  // 判断此条消息的状态 发生中？ 发生成功？ 发生失败？

                  let msgStatus = this.state.localSendFailedMsgIds.findIndex(c => c == message.messageId) >= 0 ? 'failed' :
                  this.state.localMessageIds.findIndex(c => c == message.messageId) >= 0 ? 'sending' :
                  (message.messageId + "").indexOf("local") >= 0 ? 'sended' : 'send';
                  if(msgStatus == 'sended') {
                    return null;
                  }
                  return (
                    <View style={{paddingHorizontal: CSS.pixel(30)}} key={index + ""}>
                      {/* {this.renderMsgTime(message.time)} */}
                      <StudentMessage status={msgStatus} userId={this.props.user.id} msg={message} getGroupRoom={this.getGroupRoom.bind(this)} isReplyed={MasterIsRelyMsgs && MasterIsRelyMsgs[message.data.msg.msgId]}/>
                    </View>
                  )
                }
              } catch (err) {

              }
            }
          })}

          <View style={{ height: CSS.pixel(30) }} />

          {this.renderCourseEnd()}

        </ScrollView>

        {
          (this.state.hasNewMsgs && !this.state.hasScrollToEnd)?
        (<SDTouchOpacity activeOpacity={0.8} onPress={() => {
          this.refs["containerScroll"] && this.refs["containerScroll"].scrollToEnd();
        }} style={{position:'absolute', zIndex:1, right: 0, bottom: isIphoneX() ? 60 : 50, backgroundColor: '#f3f3f3', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, paddingHorizontal: CSS.pixel(20), paddingVertical: CSS.pixel(10)}}>
          <Text style={{color: '#fc61ed', fontSize: CSS.textSize(24)}}>你有新消息</Text>
        </SDTouchOpacity>) : null
        }

        <View
          style={{
            height: CSS.pixel(90, true),
            padding: CSS.pixel(14),
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f3f3f3"
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              width: "100%",
              borderRadius: CSS.pixel(8),
              backgroundColor: (this.state.courseEnd || this.state.isShutUp || this.state.isShutUpAll) ? '#e9e9e9' : '#fff'
            }}
          >
            <TextInput
              value={
                this.state.courseEnd ? "课程已结束不能再发言" :
                this.state.isShutUpAll ? "已开启全员禁言" :
                this.state.isShutUp ? "你已被禁言" :
                this.state.textSelf
              }
              onChangeText={text => {
                this.setState({
                  textSelf: text != null && text != "" ? text.slice(0, 150) : ""
                });
                if(text.length > 150) {
                  Toast.info("已超出字数限制", 1);
                }
              }}
              onSubmitEditing={() => {
                // 添加到本地发送中的消息

                // if(this.state.lastSendTime && (Date.now() - this.state.lastSendTime <= 1000)) {
                //   Toast.info("您发言频率过快, 请稍后再发言");   // 不能一秒内同时发言
                //   return;
                // } else {
                //   this.state.lastSendTime = Date.now();
                // }

                if (this.state.textSelf.replace(/[\s]/g, "") == "") {
                  return;
                }
                if(this.state.textSelf.length > 150) {
                  Toast.info("已超出字数限制", 1);
                  return;
                }

                this.sendEditMsg();
              }}
              autoCorrect={false}
              autoCapitalize="none"
              editable={(this.state.courseEnd || this.state.isShutUp || this.state.isShutUpAll) ? false : true}
              enablesReturnKeyAutomatically={true}
              placeholder="说点什么..."
              returnKeyLabel="发送"
              returnKeyType="send"
              style={{padding: 0, paddingLeft: 5, color: (this.state.courseEnd || this.state.isShutUp || this.state.isShutUpAll) ? '#666' : '#333'}}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        {
          this.state.courseEnd ? null :
          <SDKeyboardSpacer
            topSpacing={isIphoneX() ? -34 : 0}
            onToggle={open => {
              if (open) {
                setTimeout(() => {
                  this.refs["containerScroll"] && this.refs["containerScroll"].scrollToEnd();
                });
              }
            }}
          />
        }

        <Modal
          onRequestClose={() => {
            this.setState({
              isShowImageViewer: false
            });
          }}
          visible={this.state.isShowImageViewer}
          transparent={false}
        >
          <ImageViewer
            enableSwipeDown={Platform.OS === "android" ? false : false}
            imageUrls={this.state.imagesBigUrls}
            index={this.state.imageViewerIndex}
            onClick={() => {
              this.setState({
                isShowImageViewer: false
              });
            }}
            onSave={(url) => {
              Toast.loading("保存中");
              RNFetchBlob
              .config({
                fileCache : true,
                appendExt: 'png'
              })
              .fetch('GET', url, {
                //some headers ..
              })
              .then((res) => {
                // the temp file path
                CameraRoll.saveToCameraRoll(res.path(), "photo").then(() => {
                  Toast.hide();
                  // Toast.success("保存成功");
                  Alert.alert("保存成功");
                  RNFetchBlob.fs.unlink(res.path()).then(() => {
                    // 删除临时文件
                  }).catch(err => {

                  })
                }).catch(err => {
                  Toast.hide();
                  Alert.alert('保存失败!');
                  RNFetchBlob.fs.unlink(res.path()).then(() => {
                    // 删除临时文件
                  }).catch(err => {

                  })
                });
              });
            }}
            // onLongPress={() => {
            //   CameraRoll.saveToCameraRoll(url,"photo").then(function(result) {
            //     Toast.success("保存成功");
            //   }).catch(err => {

            //   })
            // }}
            menuContext={{
              saveToLocal: "保存",
              cancel: "取消"
            }}
            saveToLocalByLongPress={true}
            loadingRender={() => (
              <View
                style={{
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <ActivityIndicator animating={true} />
              </View>
            )}
          />
        </Modal>

        <Popover
          onClose={() => {
            this.setState({
              isVisiblePop: false
            })
          }}
          placement="top"
          isVisible={this.state.isVisiblePop}
          fromRect={this.state.buttonRect}
        >
          <SDTouchOpacity onPress={this.onPressReSendMsg.bind(this)}>
            <Text style={{color: '#333'}}>重新发送</Text>
          </SDTouchOpacity>
        </Popover>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: state.user,
  localMessage: state.localMessage
}))(IMChatctcScreen);
