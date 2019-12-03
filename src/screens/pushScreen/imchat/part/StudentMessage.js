import React from "react";
import ReactNative, {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  UIManager,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { CSS } from "../../../../common/SDCSS";
import { SDMainColor, navScreen } from "../../../../styles";
import SDTouchOpacity from "../../../../common/SDTouchOpacity";
import SDDragMove from "../../../../common/SDDragMove";
import { StudentMsgView } from "../IMChatctcScreen";
import MyHomeScreen from "../../myHome/MyHomeScreen";
import LottieView from "lottie-react-native";
import connectWithActions from "../../../../connectWithActions";

// 我的-导师的消息
type Props = {
    msg: ?string,
    type: string,
    faceUrl: string,
    name: string,
    soundUrl: string,
    soundDuration: number
}

class StudentMessage extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: () => null
  };

  componentDidMount() {
    if (StudentMsgView) {
      StudentMsgView[this.props.msg.messageId] = this;
    }
  }

  componentWillUnmount() {
    if (StudentMsgView && StudentMsgView[this.props.msg.messageId]) {
      delete StudentMsgView[this.props.msg.messageId];
    }
  }

  getMsgView() {
    return this.refs['msgView'];
  }
  
  onLongPressFailedMsg() {
    if(this.refs['buttonRect']) {
      UIManager.measure(
        ReactNative.findNodeHandle(this.refs['buttonRect']),
        (x, y, w, h, px, py) => {
          // console.warn(py)
          let temp = this.props.msg.data.msg;
          if (typeof temp === 'string') {
            temp = JSON.parse(temp);
          }
          this.props.getGroupRoom().setState({
            isVisiblePop: true,
            buttonRect: {x: px, y: py, width: w, height: h},
            selectLocalMsgId: this.props.msg.messageId,
            selectLocalMsgText: temp.data.msg
          });
      });
    }
  }

  renderTextMessage() {
    // 判断文本消息指定的类型
    try {
      // let temp = this.props.msg.data.msg.replace(/&quot;/g, "\"");
      let temp = this.props.msg.data.msg;
      if (typeof temp === 'string') {
        temp = JSON.parse(temp);
      }
      // return;
      // 如果是系统消息 已经被过滤
      switch(temp.type) {
        case "text":
          return (
                <SDTouchOpacity
                  // 暂时测试开放长按操作
                  activeOpacity={this.props.status == 'failed' ? 0.8 : 1}
                  onLongPress={this.props.status == 'failed' ? this.onLongPressFailedMsg.bind(this) : null}
                  style={{
                      backgroundColor: '#f3f3f3',
                      paddingHorizontal: CSS.pixel(28),
                      paddingVertical: CSS.pixel(18),
                      borderRadius: CSS.pixel(30),
                      borderTopRightRadius: 0,
                      flexWrap: 'wrap',
                      alignItems: 'flex-end'
                  }}
                  ref="buttonRect"
                >
                  <Text style={{lineHeight: CSS.pixel(36), color: '#333', fontSize: CSS.textSize(28)}}>
                      {temp.data.msg}
                  </Text>
                </SDTouchOpacity>
          )
        case "image":
          return (
            <SDTouchOpacity
              style={{
                borderRadius: CSS.pixel(8),
                overflow: "hidden",
                borderColor: "#fafafa",
                borderWidth: 1
              }}
              onPress={() => {
                // this.props.onPressImg && this.props.onPressImg(this.props.msg);
              }}
            >
              <Image
                source={{ uri: temp.data.url }}
                style={{
                  width: parseInt(parseInt(temp.data.w) / 2),
                  height: parseInt(parseInt(temp.data.h) / 2),
                }}
              />
            </SDTouchOpacity>
          )
        case "audio":
          return (
            <View
              style={{
                backgroundColor: SDMainColor,
                paddingHorizontal: CSS.pixel(28),
                paddingVertical: CSS.pixel(24),
                borderRadius: CSS.pixel(30),
                borderTopRightRadius: 0,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <SDDragMove
                onPressProgess={percent => {
                  // console.warn(percent);
                }}
                // time={60000 * 1}
                url={temp.data.url}
                time={parseInt(temp.data.duration) * 1000}
              />
            </View>
          )
        default:
          break;
      }
    } catch (error) {
        
    }
  }

  render() {
    return (
        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}} ref="msgView">
            <View style={{width: CSS.pixel(70), height: 30}}>
            </View>
            <View style={{marginRight: CSS.pixel(16), flex: 1}}>
                <View style={{alignItems: 'flex-end'}}>
                    <View style={{alignItems: 'flex-end', marginBottom: CSS.pixel(8, true)}}>
                        <Text style={{color: '#666', fontSize: CSS.textSize(20)}}>
                            {/* {this.props.msg.sender.nickName || "x学生"} */}
                            {this.props.msg.data && this.props.msg.data.msg && this.props.msg.data.msg.sender && this.props.msg.data.msg.sender.name != "" ? this.props.msg.data.msg.sender.name : "学生"}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      {this.props.status == 'sending' ? 
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                          <LottieView
                            loop={true}
                            autoPlay={true}
                            style={{
                              height: CSS.pixel(30), width: CSS.pixel(36), justifyContent: 'center', right: 1
                            }}
                            source={require("@img/animate/jiazai.json")}
                          />
                        </View> : <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                          <SDTouchOpacity>
                            {/* <Text>{this.props.status == 'failed' ? 'err' : 'ok'}</Text> */}
                          </SDTouchOpacity>
                        </View>
                      }
                    {this.props.msg.type == 'text' ?
                      this.renderTextMessage() : null
                    }
                    </View>
                    {
                        this.props.isReplyed ? 
                        <SDTouchOpacity style={{marginTop: CSS.pixel(6, true)}} onPress={() => {
                          try {
                            let node = this.props.getGroupRoom().findMsgNode(this.props.msg.messageId);
                            if(!node || node == true) return;
                            UIManager.measure(
                              ReactNative.findNodeHandle(node),
                              (x, y, w, h, px, py) => {
                              // console.warn(x, y, w, h, px, py, parseInt(py + CSS.pixel(384)))

                              // 如果回复在之前
                              // this.props.getGroupRoom().refs["containerScroll"].scrollTo({
                              //     y: parseInt(py + this.props.getGroupRoom().state.scrollViewOffsetY - 100)
                              // });
                              node.flash();
                              // 如果在回复之后
                              // console.warn(x, y, w, h, px, py, this.props.getGroupRoom().state.scrollViewOffsetY)
                              this.props.getGroupRoom().refs["containerScroll"].scrollTo({
                                  // y: parseInt(py - this.props.getGroupRoom().state.masterHeaderAnimate._value * 2)
                                  y: this.props.getGroupRoom().state.scrollViewOffsetY + py - 300
                              });
                            });
                          } catch (error) {
                            
                          }
                        }}>
                            <Text style={{lineHeight: CSS.pixel(36), color: SDMainColor, fontSize: CSS.textSize(24)}}>查看回复</Text>
                        </SDTouchOpacity> : null
                    }
                </View>
            </View>
            <SDTouchOpacity style={{
                justifyContent: "center",
                alignItems: "center",
                width: CSS.pixel(70),
                height: CSS.pixel(70),
                borderRadius: CSS.pixel(35),
                borderColor: '#fff',
                borderWidth: 1,
                overflow: 'hidden',
            }} onPress={() => {
              // 跳转到个人主页
              // 判断是否是自己的头像
              if (this.props.msg.data && this.props.msg.data.msg && this.props.msg.data.msg.sender && this.props.msg.data.msg.sender) {
                if (this.props.msg.data.msg.sender.id == this.props.user.id) {
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
                      screen: () => <MyHomeScreen userId={this.props.msg.data.msg.sender.id} />,
                      header: {
                        title: '个人主页'
                      }
                    }
                  }));
                }
              }
            }}>
              {this.props.msg.data && this.props.msg.data.msg && this.props.msg.data.msg.sender && this.props.msg.data.msg.sender.url != "" ? 
                <Image style={{width: CSS.pixel(70), height: CSS.pixel(70)}} source={{uri: this.props.msg.data.msg.sender.url + "?imageView2/2/w/140/h/140"}}/>
              : 
              this.props.msg.data && this.props.msg.data.msg && this.props.msg.data.msg.sender && this.props.msg.data.msg.sender.gender == "female" ?
              <Image style={{width: CSS.pixel(70), height: CSS.pixel(70)}} source={require("@img/avator/female.png")} /> : this.props.msg.data && this.props.msg.data.msg && this.props.msg.data.msg.sender && this.props.msg.data.msg.sender.gender == "male" ? 
              <Image style={{width: CSS.pixel(70), height: CSS.pixel(70)}} source={require("@img/avator/male.png")} /> : 
              <Image style={{width: CSS.pixel(70), height: CSS.pixel(70)}} source={require("@img/avator/male.png")} />
              }
            </SDTouchOpacity>
        </View>
    );
  }
}

export default connectWithActions((state, props) => ({
  user: state.user
}))(StudentMessage);