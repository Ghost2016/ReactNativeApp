import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Image,
  Animated
} from "react-native";
import PropTypes from "prop-types";
import { CSS } from "../../../../common/SDCSS";
import { SDMainColor } from "../../../../styles";
import SDTouchOpacity from "../../../../common/SDTouchOpacity";
import SDDragMove from "../../../../common/SDDragMove";
import { MasterReplyMsgView, MasterMsgView, RemoveMsgs } from "../IMChatctcScreen";
import Reactotron from "reactotron-react-native";
// 我的-导师的消息

type Props = {
  msg: ?string,
  type: string,
  faceUrl: string,
  name: string,
  soundUrl: string,
  soundDuration: number
};

export default class MasterMessage extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      bgAnimate: new Animated.Value(255)
    }
  }

  static contextTypes = {
    navigator: () => null
  };

  htmlDecodeByRegExp(str){  
    // console.warn(str);
    var s = "";
    if(str.length == 0) {
      return "";
    }
    s = str.replace(/&amp;/g,"&");
    s = s.replace(/&lt;/g,"<");
    s = s.replace(/&gt;/g,">");
    s = s.replace(/&nbsp;/g," ");
    s = s.replace(/&#39;/g,"\'");
    s = s.replace(/&quot;/g,"\"");
    return s;
  }

  renderTextMessage() {
    // 判断文本消息指定的类型
    try {
      // let temp = this.props.msg.data.msg.replace(/&quot;/g, "\"");
      let temp = this.props.msg.data.msg;
      if (typeof temp === 'string') {
        temp = JSON.parse(temp);
      }
      // 如果是系统消息 已经被过滤
      switch(temp.type) {
        case "robot": 
          return (
            <View
              style={{
                backgroundColor: SDMainColor,
                paddingHorizontal: CSS.pixel(28),
                paddingVertical: CSS.pixel(18),
                borderRadius: CSS.pixel(30),
                borderTopLeftRadius: 0,
                flexDirection: "row"
              }}
            >
              <Text
                style={{
                  lineHeight: CSS.pixel(36),
                  color: "#333",
                  fontSize: CSS.textSize(28)
                }}
              >
                {this.htmlDecodeByRegExp(temp.data.msg)}
              </Text>
            </View>
          );
        case "text":
          return (
            <View
              style={{
                backgroundColor: SDMainColor,
                paddingHorizontal: CSS.pixel(28),
                paddingVertical: CSS.pixel(18),
                borderRadius: CSS.pixel(30),
                borderTopLeftRadius: 0,
                flexDirection: "row"
              }}
            >
              <Text
                style={{
                  lineHeight: CSS.pixel(36),
                  color: "#333",
                  fontSize: CSS.textSize(28)
                }}
              >
                {this.htmlDecodeByRegExp(temp.data.msg)}
              </Text>
            </View>
          )
        case "image":
          return (
            <SDTouchOpacity
              style={{
                borderRadius: CSS.pixel(8),
                overflow: "hidden",
                borderColor: "#fafafa",
                borderWidth: 1,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={() => {
                this.props.onPressImg && this.props.onPressImg(this.props.msg);
                // this.props.onPressImg && this.props.onPressImg(this.props.msg);
              }}
            >
              <Image
                source={{ uri: temp.data.url + `?imageView2/2/h/${parseInt(parseInt(temp.data.h) / 3) >= 400 ? 400 : parseInt(parseInt(temp.data.h) / 3)}` }}
                style={{
                  width: parseInt(parseInt(temp.data.w) / 2) > 150 ? 150 : parseInt(parseInt(temp.data.w) / 2),
                  height: parseInt(parseInt(temp.data.h) / 2) > 150 ? 150 : parseInt(parseInt(temp.data.h) / 2),
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
                paddingVertical: CSS.pixel(12),
                borderRadius: CSS.pixel(30),
                borderTopLeftRadius: 0,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <SDDragMove
                onPressProgess={percent => {
                  // console.warn(percent);
                }}
                msgId={temp.msgId}
                // time={60000 * 1}
                url={temp.data.url}
                duration={parseFloat(temp.data.duration)}
                time={parseInt(temp.data.duration) * 1000}
                // time={parseInt(8) * 1000}
              />
            </View>
          )
          case "reply":
            return (
              <View
                style={{
                  backgroundColor: SDMainColor,
                  paddingHorizontal: CSS.pixel(28),
                  paddingVertical: CSS.pixel(18),
                  borderRadius: CSS.pixel(30),
                  borderTopLeftRadius: 0,
                  flexDirection: "row"
                }}
              >
                <View>
                  <Text
                  style={{
                    lineHeight: CSS.pixel(36),
                    color: "#333",
                    fontSize: CSS.textSize(28)
                  }}
                >
                  {/* 判断此条回复的消息是否被删除 */}

                  {(RemoveMsgs[temp.data.to.msgId] || !this.props.msg.reply_id) ? <Text style={{color: '#888'}}>此消息已被删除</Text> : temp.data.to.data.msg}
                </Text>
                <View style={{height: 1, width: '100%', backgroundColor: 'rgba(51,51,51,0.2)', marginTop: CSS.pixel(15), marginBottom: CSS.pixel(10)}}></View>
                  {
                    // 判断是以什么样的类型回复
                    // 图片、文本、语音
                    temp.data.from.type == 'text' ?
                    <Text
                      style={{
                        lineHeight: CSS.pixel(36),
                        color: "#333",
                        fontSize: CSS.textSize(28)
                      }}
                    >
                      {this.htmlDecodeByRegExp(temp.data.from.data.msg)}
                    </Text> : temp.data.from.type == 'audio' ?
                      <SDDragMove
                        style={{minWidth: 100}}
                        onPressProgess={percent => {
                          // console.warn(percent);
                        }}
                        msgId={temp.data.from.msgId}
                        duration={parseFloat(temp.data.from.data.duration)}
                        time={parseInt(temp.data.from.data.duration) * 1000}
                        url={temp.data.from.data.url}
                      /> : temp.data.from.type == 'image' ?
                      <SDTouchOpacity
                        style={{
                          borderRadius: CSS.pixel(8),
                          overflow: "hidden",
                          maxWidth: '100%',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                        onPress={() => {
                          this.props.onPressImg && this.props.onPressImg(null, [{
                            url: temp.data.from.data.url
                          }]);
                          // this.props.onPressImg && this.props.onPressImg(this.props.msg);
                        }}
                      >
                        <Image
                          source={{ uri: temp.data.from.data.url + `?imageView2/2/h/${parseInt(parseInt(temp.data.from.data.h) / 3) >= 400 ? 400 : parseInt(parseInt(temp.data.from.data.h))}` }}
                          style={{
                            width: parseInt(parseInt(temp.data.from.data.w) / 2) >= 150 ? 150 : parseInt(parseInt(temp.data.from.data.w) / 2),
                            height: parseInt(parseInt(temp.data.from.data.h) / 2) >= 150 ? 150 : parseInt(parseInt(temp.data.from.data.h) / 2),
                          }}
                        />
                      </SDTouchOpacity> : null
                  }
                </View>
              </View>
            );
        default:
          break;
      }

    } catch (error) {
      // console.warn(error)
    }
  }

  renderImageMessage() {
    return (
      <SDTouchOpacity
        style={{
          borderRadius: CSS.pixel(8),
          overflow: "hidden",
          borderColor: "#fafafa",
          borderWidth: 1,
        }}
        onPress={() => {
          this.props.onPressImg && this.props.onPressImg(this.props.msg);
        }}
      >
        <Image
          source={{ uri: this.props.msg.data[0].url }}
          style={{
            width: parseInt(this.props.msg.data[1].width / 2),
            height: parseInt(this.props.msg.data[1].height / 2)
          }}
        />
      </SDTouchOpacity>
    );
  }

  renderSoundMessage() {
    return (
      <View
        style={{
          backgroundColor: SDMainColor,
          paddingHorizontal: CSS.pixel(28),
          paddingVertical: CSS.pixel(24),
          borderRadius: CSS.pixel(30),
          borderTopLeftRadius: 0,
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
          time={this.props.msg.data.duration * 1000}
        />
      </View>
    );
  }

  componentDidMount() {
    // 老师总的消息
    // if (MasterMsgView) {
    //   MasterMsgView[this.props.msg.messageId + ""] = this;
    // }
    // if (this.props.msg.data.msg.type == 'reply') {
    //   // debugger;
    //   // 老师回复的消息集合
    //   // console.warn(this.props.msg.data.msg.data.to.msgId)
    //   if (MasterReplyMsgView) {
    //     if (this.props.msg.data.msg.data.to.msgId != "") {
    //       MasterReplyMsgView[this.props.msg.data.msg.data.to.msgId + ""] = this;
    //     }
    //   }
    // }
    
  }

  componentWillUnmount() {
    // if (MasterMsgView && MasterMsgView[this.props.msg.messageId]) {
    //   delete MasterMsgView[this.props.msg.messageId + ""];
    // }

    // if (this.props.msg.data.msg.type == 'reply') {
    //   if (MasterReplyMsgView && this.props.msg.data.msg.data.to.msgId != "" && MasterReplyMsgView[this.props.msg.data.msg.data.to.msgId]) {
    //     delete MasterReplyMsgView[this.props.msg.data.msg.data.to.msgId + ""];
    //   }
    // }
    
  }

  flash() {
    Animated.timing(this.state.bgAnimate, {
      duration: 600,
      toValue: 0,
    }).start();
    setTimeout(() => {
      Animated.timing(this.state.bgAnimate, {
        duration: 600,
        toValue: 255,
      }).start();
    }, 600)
    
  }

  getMsgView() {
    return this.refs['msgView'];
  }

  // 回复消息类型
  renderReplyMessage() {
    return (
      <View
        style={{
          backgroundColor: SDMainColor,
          paddingHorizontal: CSS.pixel(28),
          paddingVertical: CSS.pixel(18),
          borderRadius: CSS.pixel(30),
          borderTopLeftRadius: 0,
          flexDirection: "row",
          width: '100%',
        }}
      >
        <View>
          <Text
          style={{
            lineHeight: CSS.pixel(36),
            color: "#333",
            fontSize: CSS.textSize(28)
          }}
        >
          {this.props.msg.otherMsg}
        </Text>
        <View style={{height: 1, width: '100%', backgroundColor: 'rgba(51,51,51,0.2)', marginVertical: CSS.pixel(20)}}></View>
        <Text
          style={{
            lineHeight: CSS.pixel(36),
            color: "#333",
            fontSize: CSS.textSize(28)
          }}
        >
          {this.props.msg.data.msg}
        </Text>
        </View>
      </View>
    );
  }

  renderSpaceWhite() {
    let temp = this.props.msg.data.msg;
    switch (temp.type) {
      case "audio": { // 判断时间长度
        let time = parseInt(temp.data.duration);
        let leftWidth = CSS.pixel(360); // 剩余宽带
        if (time >= 180) {
          // 如果多余了3分钟的语音
          return <View style={{ width: CSS.pixel(70), height: 30 }} />;
        } else {
          leftWidth = parseInt(leftWidth - (time / 180) * CSS.pixel(330));
          // leftWidth = parseInt(leftWidth - (180 / 180) * CSS.pixel(330));
        }
        return <View style={{ width: leftWidth, height: 30 }} />;
      }
      default:
        return <View style={{ width: CSS.pixel(70), height: 30 }} />;
    }
  }

  render() {
    let bgColor = this.state.bgAnimate.interpolate({
      inputRange: [0, 255],
      outputRange: ["rgba(254,210,0,0.4)", "rgba(0,0,0,0)"]
    });
    if (MasterReplyMsgView) {
      if (this.props.msg && this.props.msg.data && this.props.msg.data.msg && this.props.msg.data.msg.data && this.props.msg.data.msg.data.to && this.props.msg.data.msg.data.to.msgId != "") {
        MasterReplyMsgView[this.props.msg.data.msg.data.to.msgId + ""] = this;
      }
    }
    return (
      <Animated.View style={{ width: "100%", flexDirection: "row", marginTop: 10, backgroundColor: bgColor}} ref="msgView">
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: CSS.pixel(70),
            height: CSS.pixel(70),
            borderRadius: CSS.pixel(35),
            borderColor: '#fff',
            borderWidth: 1,
            overflow: "hidden"
          }}
        >
          {
            this.props.msg.data && this.props.msg.data.msg && this.props.msg.data.msg.type && this.props.msg.data.msg.type == 'robot' ?
            <Image source={require("@img/imchat/growing_head_pic_assistant.png")}/> : 
            this.props.msg.data && this.props.msg.data.msg && this.props.msg.data.msg.sender && this.props.msg.data.msg.sender.url != "" ? 
            <Image style={{width: CSS.pixel(70), height: CSS.pixel(70)}} source={{uri: this.props.msg.data.msg.sender.url + "?imageView2/2/w/140/h/140"}}/> : 
            this.props.gender == 'female' ? <Image style={{width: CSS.pixel(70), height: CSS.pixel(70)}} source={require("@img/female_master.png")}/> : 
            <Image style={{width: CSS.pixel(70), height: CSS.pixel(70)}} source={require("@img/male_master.png")}/>
          }
        </View>
        <View
          style={{
            flexWrap: "wrap",
            flex: 1,
            flexDirection: "row",
            marginLeft: CSS.pixel(16)
          }}
        >
          <View style={{maxWidth: '100%'}}>
            <View style={{ marginBottom: CSS.pixel(8, true) }}>
              <Text style={{ color: "#666", fontSize: CSS.textSize(20) }}>
              {
                this.props.msg.data && this.props.msg.data.msg && this.props.msg.data.msg.type && this.props.msg.data.msg.type == 'robot' ?
                "职么小助手" : 
                this.props.msg.data && this.props.msg.data.msg && this.props.msg.data.msg.sender && this.props.msg.data.msg.sender.name != "" ? 
                this.props.msg.data.msg.sender.name : 
                "老师"
              }
              </Text>
            </View>
            {this.props.msg.otherReply
              ? this.renderReplyMessage()
              : this.props.msg.type == "text"
                ? this.renderTextMessage()
                : this.props.msg.type == "image"
                  ? this.renderImageMessage()
                  : this.props.msg.type == "sound"
                    ? this.renderSoundMessage()
                    : null}
          </View>
        </View>
        {this.renderSpaceWhite()}
      </Animated.View>
    );
  }
}
