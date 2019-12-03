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
  UIManager
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../../../connectWithActions";
import SDKeyboardSpacer from "../../../common/SDKeyboardSpacer";
import { CSS } from "../../../common/SDCSS";
import { isIphoneX } from "../../../utils/iphonex";
import MasterProfileInfo from "./part/MasterProfileInfo";
import StudentMessage from "./part/StudentMessage";
import MasterMessage, { MasterReplyMsg } from "./part/MasterMessage";
import IMChat from "../../../boot/IMChat";
import { navLightBox, SDMainColor } from "../../../styles";
import IMGroupHeaderMenu from "./IMGroupHeaderMenu";
import IMGroupAutoMind from "./IMGroupAutoMind";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import ImageViewer from "react-native-image-zoom-viewer";

const darkBackIcon = require("@img/salary/home_Salary_back.png");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  }
});

let hasOnMessage = false;
let masterProfileHeight = 384;

// 我的-群聊界面
class IMChatGroupScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        // {
        //   conversationId: "test01",
        //   conversationType: "group",
        //   messageId: "747983162",
        //   type: "text",
        //   otherReply: true,
        //   otherMessageId: "747983163",
        //   otherMsg: "我问的问题",
        //   data: {
        //     msg: "我的回复其他人的"
        //   },
        //   time: Date.now() + "",
        //   sender: {
        //     nickName: "sss",
        //     id: "1006224221"
        //   }
        // }
      ],
      beforeMessages: [],   // 开场前的消息
      masterHeaderAnimate: new Animated.Value(
        CSS.pixel(masterProfileHeight, true)
      ),
      masterTopAnimate: new Animated.Value(0),
      isRefreshing: false,
      isRefreshingAll: false,

      scrollViewOffsetY: 0,

      isShowCourseBeforeMsgs: true,             // 是否显示开课前的消息
      courseStartTime: new Date(this.props.group ? this.props.start_time : 1536424000000), // 2018-09-09

      beforeMsgShowTime: null,                  // 用于去掉开场前重复时间显示
      nowMsgShowTime: null,                     // 用于去掉开场后重复时间显示

      msgId: {},                                // 消息id集合 用于去重

      isShowImageViewer: false,
      imageViewerIndex: 0,

      imageMessage: [], // 图片消息

      imagesThumbUrls: [], // [{url: ''}, ...]
      imagesBigUrls: [],

      messageImgsIndex: {}, // 消息对应的图片索引

      isMasterOnly: this.props.group && this.props.group.end_time ? true : false, // 是否只看老师的消息

      userSendFormatInfo: '',                   // JSON.stringify 的文本消息
    };

    // 假设导师的id为 654207967
    this.masterId = this.props.group ? this.props.group.teacher ? this.props.group.teacher :  "1006224221" : "1006224221";
  }

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentDidMount() {
    // 注册消息接收器
    if (!hasOnMessage) {
      IMChat.on("message", res => {
        this.handleMessage(res.results);
      });
      IMChat.on("groupEventMessage", res => {
        //console.warn(res);
      });
      hasOnMessage = true;
    }

    // 获取之前的消息
    IMChat.getGroupMessage(this.props.group.groupId, 10, true).then(res => {
      this.handleMessage(res);
    });

    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "group_chat_menu_btn"
    );

    if(this.props.group && this.props.group.end_time) {
      // 提醒只开启老师
      /**
       * 未开始和进行中的课程进入Live聊天室时，只听导师默认为关闭状态（页面不予提示），
       * 展示所有消息记录，用户开启后，展示消息为导师消息、导师回复学生的消息以及用户自己发的消息
       */
      navLightBox(
        "LightBoxScreen",
        {
          passProps: {
            screen: () => <IMGroupAutoMind />,
            tapBackgroundToDismiss: false
          }
        },
        {
          backgroundColor: "transparent"
        }
      );
    }

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

  handleMessage(msgs, shift) {
    let uniqMsg = this.uniqueMsg(msgs);
    // 判断图片
    // 获取图片顺序
    let imagesNowMsg = uniqMsg.now.filter(c => {
      return c.type == "image";
    });
    let imagesBeforeMsg = uniqMsg.before.filter(c => {
      return c.type == "image";
    });
    if (shift) {
      let newMsgs = uniqMsg.now.concat(this.state.messages);
      let beforeMsgs = uniqMsg.before.concat(this.state.beforeMessages);
      this.setState({
        messages: newMsgs,
        beforeMessages: beforeMsgs,
        imageMessage: []
          .concat(imagesBeforeMsg)
          .concat(imagesNowMsg)
          .concat(this.state.imageMessage)
      });
    } else {
      let newMsgs = this.state.messages.concat(uniqMsg.now);
      let beforeMsgs = this.state.beforeMessages.concat(uniqMsg.before);
      this.setState({
        messages: newMsgs,
        beforeMessages: beforeMsgs,
        imageMessage: []
          .concat(this.state.imageMessage)
          .concat(imagesBeforeMsg)
          .concat(imagesNowMsg)
      });
    }
  }

  /**
   * 判断此消息属于此组和唯一的
   */
  uniqueMsg(arr) {
    let res = [];
    let beforeTimeRes = [];
    for (let i = 0; i < arr.length; i++) {
      let msgId = arr[i]["messageId"];
      if (!this.state.msgId[msgId]) {
        // 判断此消息是否属于此组
        if (
          arr[i].conversationId == this.props.group.groupId &&
          arr[i].conversationType == "Group"
        ) {
          // 判断是开课前的消息还是开课后的消息
          if (
            parseInt(arr[i]["time"] + "000") >
            this.state.courseStartTime.getTime()
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
      now: res.sort((a, b) => {
        return parseInt(a.time) - parseInt(b.time) >= 0;
      }),
      before: beforeTimeRes.sort((a, b) => {
        return parseInt(a.time) - parseInt(b.time) >= 0;
      })
    };
  }

  _onScrollView(e) {
    this.state.scrollViewOffsetY = e.nativeEvent.contentOffset.y;
    if (
      e.nativeEvent.contentOffset.y >
      CSS.pixel(masterProfileHeight, true) + 100
    ) {
      return;
    }

    const contentHeight = e.nativeEvent.contentSize.height;
    const scrollY = e.nativeEvent.contentOffset.y;
    const layoutHeight = e.nativeEvent.layoutMeasurement.height;
    if (scrollY + layoutHeight >= contentHeight) {
      // 如果已经到底部了
      return;
    }

    if (Platform.OS == "ios") {
      if (e.nativeEvent.contentOffset.y <= 0) {
        Animated.parallel([
          Animated.timing(this.state.masterHeaderAnimate, {
            toValue: parseInt(CSS.pixel(masterProfileHeight, true)),
            duration: 0
          }),
          Animated.timing(this.state.masterTopAnimate, {
            toValue: 0,
            duration: 0
          })
        ]).start();
      } else if (
        e.nativeEvent.contentOffset.y > CSS.pixel(masterProfileHeight, true)
      ) {
        Animated.parallel([
          Animated.timing(this.state.masterHeaderAnimate, {
            toValue: 0,
            duration: 0
          }),
          Animated.timing(this.state.masterTopAnimate, {
            toValue: parseInt(-CSS.pixel(masterProfileHeight, true)),
            duration: 0
          })
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(this.state.masterHeaderAnimate, {
            toValue: parseInt(
              CSS.pixel(masterProfileHeight, true) -
                e.nativeEvent.contentOffset.y
            ),
            duration: 0
          }),
          Animated.timing(this.state.masterTopAnimate, {
            toValue: -e.nativeEvent.contentOffset.y,
            duration: 0
          })
        ]).start();
      }
    } else {
      if (e.nativeEvent.contentOffset.y <= 0) {
        Animated.timing(this.state.masterHeaderAnimate, {
          toValue: parseInt(CSS.pixel(masterProfileHeight, true)),
          duration: 0
        }).start();
      } else if (
        e.nativeEvent.contentOffset.y > CSS.pixel(masterProfileHeight, true)
      ) {
        Animated.timing(this.state.masterHeaderAnimate, {
          toValue: 0,
          duration: 100
        }).start();
      } else {
        // Animated.timing(this.state.masterHeaderAnimate, {
        //   toValue: parseInt(
        //     CSS.pixel(masterProfileHeight, true) -
        //       e.nativeEvent.contentOffset.y
        //   ),
        //   duration: 0
        // }).start();
      }
    }
  }

  _onRefresh() {
    // 获取之前的消息
    IMChat.getGroupMessage(this.props.group.groupId, 10, true, false)
      .then(res => {
        if (res.length > 0) {
          this.handleMessage(res, true);
          this.setState({
            isRefreshing: false
          });
        } else {
          this.setState({
            isRefreshing: false,
            isRefreshingAll: true
          });
        }
      })
      .catch(err => {
        this.setState({
          isRefreshing: false
        });
      });
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
              return message.sender.id == this.masterId ? (
                <View key={index + ""}>
                  {this.renderMsgTime(message.time, true)}
                  <MasterMessage
                    msg={message}
                    onPressImg={this._onClickImage.bind(this)}
                  />
                </View>
              ) : (
                <View key={index + ""}>
                  {this.renderMsgTime(message.time, true)}
                  <StudentMessage msg={message} />
                </View>
              );
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
                  以下是课程开场后的内容
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
    let n = 13 - (time + "").length;
    if (13 - (time + "").length > 0);
    {
      let spinArr = new Array(n).fill("0").map(c => {
        time = time + "" + c;
      });
    }
    let currTime = new Date(parseInt(time));
    let str = `${currTime.getFullYear()}年${currTime.getMonth() +
      1}月${currTime.getDate()}日  ${currTime.getHours()}:${currTime.getMinutes()}`;
    if (isBeforeMsg) {
      if (this.state.beforeMsgShowTime == str) {
        return null;
      } else {
        this.state.beforeMsgShowTime = str;
        return (
          <View
            style={{
              marginTop: CSS.pixel(16),
              justifyContent: "center",
              alignItems: "center"
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
              marginTop: CSS.pixel(16),
              justifyContent: "center",
              alignItems: "center"
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

  _onClickImage(imgMsg) {
    // 判断此图片所在的数组里的索引

    let index = this.state.imageMessage.findIndex(
      c => c.messageId == imgMsg.messageId
    );
    this.setState({
      isShowImageViewer: true,
      imageViewerIndex: index,
      imagesBigUrls: this.state.imageMessage.map(c => {
        return { url: c.data[2].url };
      })
    });
  }

  _handleSendMessage(messageId) {
    // 判断当前的时间是否已经是大于开场时间了
    if (Date.now() >= this.state.courseStartTime.getTime()) {
      this.setState(
        {
          textSelf: "",
          messages: [].concat(this.state.messages).concat([
            {
              messageId: messageId,
              type: "text",
              conversationId: this.props.group.groupId,
              conversationType: "Group",
              data: this.state.userSendFormatInfo
            }
          ])
        },
        () => {
          setTimeout(() => {
            this.refs["containerScroll"].scrollToEnd();
          });
        }
      );
    } else {
      this.setState(
        {
          textSelf: "",
          messages: [].concat(this.state.beforeMessages).concat([
            {
              messageId: messageId,
              type: "text",
              conversationId: this.props.group.groupId,
              conversationType: "Group",
              data: this.state.userSendFormatInfo
            }
          ])
        },
        () => {
          setTimeout(() => {
            this.refs["containerScroll"].scrollToEnd();
          });
        }
      );
    }
  }

  findMsgNode(msgId) {
    return MasterReplyMsg[msgId];
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            overflow: "hidden",
            height: this.state.masterHeaderAnimate,
            backgroundColor: "#fff"
          }}
        >
          <Animated.View
            style={{
              flex: 1,
              top: this.state.masterTopAnimate
            }}
          >
            <MasterProfileInfo />
          </Animated.View>
          <View
            style={{ height: CSS.pixel(20, true), backgroundColor: "#f3f3f3" }}
          />
        </Animated.View>

        <ScrollView
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          ref="containerScroll"
          style={{
            flex: 1,
            backgroundColor: "#fff",
            paddingHorizontal: CSS.pixel(30)
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
          {!this.state.isRefreshingAll ? null : this.renderAllMessageShow()}

          {/* 开课前的消息 */}
          {this.renderCourseStartView()}

          {this.state.messages.map((message, index) => {
            return message.sender.id == this.masterId ? (
              <View key={index + ""}>
                {this.renderMsgTime(message.time)}
                <MasterMessage
                  msg={message}
                  onPressImg={this._onClickImage.bind(this)}
                />
              </View>
            ) : (
              <View key={index + ""}>
                {this.renderMsgTime(message.time)}
                <StudentMessage msg={message} getGroupRoom={this.getGroupRoom.bind(this)}/>
              </View>
            );
          })}

          <View style={{ height: CSS.pixel(30) }} />
        </ScrollView>
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
              backgroundColor: "#fff"
            }}
          >
            <TextInput
              value={this.state.textSelf}
              onChangeText={text => {
                this.setState({
                  textSelf: text
                });
              }}
              onSubmitEditing={() => {
                if (this.state.textSelf.replace(/[\s]/g, "") == "") {
                  return;
                }
                this.state.userSendFormatInfo = JSON.stringify({
                  isSystem: false,
                  type: "text",
                  time: Date.now(),
                  sender: {
                      id: this.props.user.id,
                      name: this.props.user.nickname,
                      url: this.props.user.avatar ? this.props.user.avatar.url : "",
                  },
                  data: {
                      msg: this.state.textSelf
                  }
                });
                IMChat.sendGroupTextMessage(
                  this.state.userSendFormatInfo,
                  this.props.group.groupId
                )
                  .then(res => {
                    this._handleSendMessage(res);
                  })
                  .catch(err => {
                    //console.warn("已被禁言");
                  });
              }}
              autoCorrect={false}
              autoCapitalize="none"
              enablesReturnKeyAutomatically={true}
              placeholder="说点什么..."
              returnKeyLabel="发送"
              returnKeyType="send"
              style={{ padding: 0, paddingLeft: 5 }}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
        <SDKeyboardSpacer
          topSpacing={isIphoneX() ? -34 : 0}
          onToggle={open => {
            if (open) {
              setTimeout(() => {
                this.refs["containerScroll"].scrollToEnd();
              });
            }
          }}
        />

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
            saveToLocalByLongPress={false}
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
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: state.user
}))(IMChatGroupScreen);
