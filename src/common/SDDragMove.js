/* @flow */
import React from "react";
import ReactNative, {
  UIManager,
  Image,
  StyleSheet,
  View,
  Text,
  Animated,
  PanResponder,
  Platform
} from "react-native";
import SDTouchOpacity from "./SDTouchOpacity";
import { CSS } from "./SDCSS";
import IMChat from "../boot/IMChat";
import LottieView from "lottie-react-native";
import { AudioMsgRef, AudioArrMsgs } from "../screens/pushScreen/imchat/IMChatctcScreen";

const styles = StyleSheet.create({});

const playBtn = require("@img/imchat/growing_btn_play.png");
const pauseBtn = require("@img/imchat/growing_btn_suspend.png");
const fetchBtn = require("@img/imchat/jiazai.gif");

type Props = {
  onPressProgess: ?Function,
  time: number
};

export const PlayStatus = {
  Idle: 0,
  Playing: 1,
  Stop: 2,
  Pause: 3,
  Fetching: 4
};

export const CurrAudioCom = {
  ref: null
};

export default class SDDragMove extends React.PureComponent<Props> {
  constructor(props) {
    super(props);

    this.state = {
      previousLeft: 0,

      showTip: false,
      currTipTime: 0,
      tipOffsetX: new Animated.Value(0),
      offsetX: new Animated.Value(0),
      progressLineWidth: 0,

      status: PlayStatus.Idle,

      msgId: this.props.msgId,

      isOnDrag: false     // 是否小点在拖动中
    };

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: this._handleMoveShouldSetPanResponderCapture.bind(
        this
      ),
      onPanResponderGrant: this._handlePanResponderGrant.bind(this),
      onPanResponderMove: this._handlePanResponderMove.bind(this),
      onPanResponderRelease: this._handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
      onShouldBlockNativeResponder: (event, gestureState) => false //表示是否用 Native 平台的事件处理，默认是禁用的，全部使用 JS 中的事件处理，注意此函数目前只能在 Android 平台上使用
    });
  }

  componentDidMount() {
    // if(AudioMsgRef) {
    //   AudioMsgRef[this.state.msgId + ""] = this;
    // }
  }

  /**
   * 是否需要成为move事件响应者，返回true直接走onPanResponderMove
   */
  _handleMoveShouldSetPanResponderCapture(
    event: Object,
    gestureState: Object
  ): boolean {
    //当垂直滑动的距离<10 水平滑动的距离>4的时候才让捕获事件
    return gestureState.dy < 10 && Math.abs(gestureState.dx) > 4;
  }

  /**
   * 表示申请成功，组件成为了事件处理响应者
   */
  _handlePanResponderGrant(event: Object, gestureState: Object): void {
    this.setState({
      isOnDrag: true,
      status: PlayStatus.Pause
    });
  }

  /**
   * 处理滑动事件
   */
  _handlePanResponderMove(event: Object, gestureState: Object): void {
    // if (this.state.previousLeft !== null) {
    //   this.state.previousLeft = this.state.offsetX._value;
    // }
    let nowLeft = this.state.previousLeft + gestureState.dx;
    // nowLeft = Math.min(nowLeft, 0); // 不让右滑
    // if (nowLeft < -this.state.actionItemNum * this.state.actionWidth) {
    //   nowLeft = -this.state.actionItemNum * this.state.actionWidth;
    // }
    nowLeft = nowLeft < 0 ? 0 : nowLeft;

    nowLeft =
      nowLeft >= this.state.progressLineWidth - CSS.pixel(12)
        ? this.state.progressLineWidth - CSS.pixel(12)
        : nowLeft;

    this.state.offsetX.setValue(nowLeft);

    this.state.tipOffsetX.setValue(nowLeft - CSS.pixel(38));

    let percent = nowLeft / (this.state.progressLineWidth - CSS.pixel(12));
    this.setState({
      showTip: true,
      currTipTime: percent * this.props.time,
    });
  }

  /**
   * 结束事件的时候回调
   * @param event
   * @param gestureState
   * @private
   */
  _handlePanResponderEnd(event: Object, gestureState: Object): void {
    let nowLeft = this.state.previousLeft + gestureState.dx;
    // nowLeft = Math.min(nowLeft, 0); // 不让右滑
    // if (nowLeft < -this.state.actionItemNum * this.state.actionWidth) {
    //   nowLeft = -this.state.actionItemNum * this.state.actionWidth;
    // }
    nowLeft = nowLeft < 0 ? 0 : nowLeft;
    nowLeft =
      nowLeft >= this.state.progressLineWidth - CSS.pixel(12)
        ? this.state.progressLineWidth - CSS.pixel(12)
        : nowLeft;
    this.state.offsetX.setValue(nowLeft);
    this.state.previousLeft = nowLeft;
    let percent = nowLeft / this.state.progressLineWidth;

    // 拖拽回调播放音频进度
    this.props.onPressProgess &&
      this.props.onPressProgess({
        type: "skip",
        percent: percent
      });

    this.setState({
      showTip: false,
      isOnDrag: false
    });

    // 判断当前播放的url 是否是和自己的一样
    // if(IMChat.getAudioUrl() == this.props.url) {
    //   // if(this.state.status == PlayStatus.Pause) {
    //   //   IMChat.resume().then(res => {
    //   //     IMChat.seekTo(this.props.time * percent);
    //   //   }).catch(err => {

    //   //   })
    //   // } else if(this.state.status == PlayStatus.Playing) {
    //   //   IMChat.seekTo(this.props.time * percent);
    //   // }
    // } else {

    // }
    // IMChat.play(this.props.url)
    // .then(res => {
    //   IMChat.seekTo(this.props.time * percent);
    //   this.play();
    // }).catch(err => {
    // })
    this.play();
  }

  componentWillUnmount() {
    this.stop();
  }

  /**
   * 点击进度条进行定位
   * @param {*} e
   */
  onPressProgess(e: NativeSyntheticEvent<NativeTouchEvent>) {
    // debugger;
    if (this.state.status == PlayStatus.Stop || this.state.status == PlayStatus.Pause || this.state.status == PlayStatus.Idle) {
      this.play();
    } else if(this.state.status == PlayStatus.Fetching) {
      this.stop();
    } else if(this.state.status == PlayStatus.Playing) {
      this.pause();
    }
    return;
    let locationX = e.nativeEvent.locationX;
    if(e.nativeEvent.target) UIManager.measure(e.nativeEvent.target, (x, y, w, h, px, py) => {
      // 所占百分比
      locationX = locationX < 0 ? 0 : locationX;
      locationX =
        locationX >= this.state.progressLineWidth - CSS.pixel(12)
          ? this.state.progressLineWidth - CSS.pixel(12)
          : locationX;

      let percent = parseFloat(locationX / w);

      this.state.offsetX.setValue(locationX);
      this.state.previousLeft = locationX;

      // 回调播放音频进度
      this.props.onPressProgess &&
        this.props.onPressProgess({
          type: "skip",
          percent: percent
        });

      // 判断当前播放的url 是否是和自己的一样
      // if(IMChat.getAudioUrl() == this.props.url) {
      //   if(this.state.status == PlayStatus.Pause) {
      //     IMChat.resume().then(res => {
      //       IMChat.seekTo(this.props.time * percent);
      //     }).catch(err => {

      //     })
      //   } else if(this.state.status == PlayStatus.Playing) {
      //     IMChat.seekTo(this.props.time * percent);
      //   }
      // } else {

      // }
      // IMChat.play(this.props.url)
      // .then(res => {
      //   // IMChat.seekTo(this.props.time * percent);
      //   this.play();
      // }).catch(err => {
      // })
      this.play();
    });
  }

  play() {
    try {
      if(CurrAudioCom.ref) {
        CurrAudioCom.ref.pause && CurrAudioCom.ref.pause();
      }
      CurrAudioCom.ref = this;
    } catch (error) {

    }

    this.setState({
      status: PlayStatus.Fetching,
      isOnDrag: false
    }, () => {
      IMChat.release();
      IMChat.play(this.props.url, () => {
        IMChat.seekTo(this.state.previousLeft / this.state.progressLineWidth * this.props.duration);
        this.setState({
          status: PlayStatus.Playing
        });
        Animated.timing(
          this.state.offsetX, // 动画中的变量值
          {
            duration:
              ((this.state.progressLineWidth - this.state.previousLeft) /
                this.state.progressLineWidth) *
              this.props.time,
            toValue: this.state.progressLineWidth - CSS.pixel(12)
          }
        ).start(finished => {
          let percent = this.state.previousLeft / this.state.progressLineWidth;
          this.props.onPressProgess &&
            this.props.onPressProgess({
              type: finished ? "stop" : "pause",
              percent: percent
            });
          if (finished) {
            // 如果是播放完
            this.state.offsetX.setValue(0);
            this.state.tipOffsetX.setValue(0);
            this.setState({
              status: PlayStatus.Stop
            });

            // 进行下一声音播放
            // let temp = AudioArrMsgs.find(c => c.msgId == (this.state.msgId + ""));
            // if(temp && temp.next && typeof AudioMsgRef[temp.next.msgId + ""] !== 'undefined' && temp.next.msgId != this.state.msgId) {
            //   try {
            //     AudioMsgRef[temp.next.msgId + ""].play && AudioMsgRef[temp.next.msgId + ""].play();
            //   } catch (error) {
            //   }
            // }
          } else {
            this.state.tipOffsetX.setValue(this.state.offsetX._value);
            this.setState({
              status: PlayStatus.Pause
            });
          }
        });
      });
    });


  }

  pause() {
    this.state.previousLeft = this.state.offsetX._value;
    Animated.timing(this.state.offsetX).stop();
    this.state.offsetX.setValue(this.state.previousLeft);
    IMChat.pause();

    this.setState({
      status: PlayStatus.Pause,
      isOnDrag: false
    });
  }

  stop() {
    Animated.timing(this.state.offsetX).stop();
    IMChat.stop();
    this.state.previousLeft = 0;
    this.state.offsetX.setValue(0);
    this.setState({
      status: PlayStatus.Stop,
      isOnDrag: false
    });
  }

  formatTime(time) {
    // 以秒为单位
    time = time / 1000;
    return `${parseInt(time / 60)}:${
      time % 60 >= 10 ? parseInt(time % 60) : "0" + parseInt(time % 60)
    }`;
  }

  render() {
    let _style = this.props.style || {};
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          // backgroundColor: 'red',
          ..._style
        }}
      >
        <View>
          <SDTouchOpacity
            style={{height: 30, alignItems: 'center', justifyContent: 'center', paddingRight: CSS.pixel(8)}}
            onPress={() => {
              if (this.state.status == PlayStatus.Stop || this.state.status == PlayStatus.Pause || this.state.status == PlayStatus.Idle) {
                // 判断当前播放的url 是否是和自己的一样
                // if(IMChat.getAudioUrl() == this.props.url && ) {
                //   IMChat.resume().then(res => {
                //   }).catch(err => {
                //   });
                // } else {
                  // IMChat.play(this.props.url, () => {
                    this.play();
                    // console.warn(this.state.previousLeft / this.state.progressLineWidth * this.props.duration)
                    // IMChat.seekTo(this.state.previousLeft / this.state.progressLineWidth * this.props.duration);
                    // IMChat.seekTo(2);
                  // });

                  // .then(res => {
                  //   this.play();
                  // }).catch(err => {
                  // })
              } else if(this.state.status == PlayStatus.Fetching) {
                this.stop();
              } else if(this.state.status == PlayStatus.Playing) {
                this.pause();
              }
            }}
          >
            {/* <Text>播放</Text> */}
            {
              this.state.status == PlayStatus.Fetching ?
              // <Image style={{height: CSS.pixel(30), width: CSS.pixel(24)}} source={fetchBtn}/> : <Image
              <LottieView
                  ref="_filtericon"
                  loop={true}
                  autoPlay={true}
                  style={{
                    height: CSS.pixel(24), width: CSS.pixel(22),
                    // marginLeft: -CSS.pixel(6),
                    // left: CSS.pixel(5),
                  }}
                  source={require("@img/animate/jiazai.json")}
                /> : <Image
              style={{height: CSS.pixel(30), width: CSS.pixel(24)}}
              resizeMode="stretch"
              source={
                this.state.status == PlayStatus.Playing ? pauseBtn :
                this.state.status == PlayStatus.Pause ? playBtn :
                this.state.status == PlayStatus.Stop ? playBtn :
                this.state.status == PlayStatus.Fetching ? fetchBtn : playBtn
              }
            />
            }

          </SDTouchOpacity>
        </View>
        <View
          style={{ flex: 1, position: "relative", justifyContent: "center" }}
        >
          <SDTouchOpacity
            activeOpacity={0.9}
            noDelay
            onPress={this.onPressProgess.bind(this)}
            style={{ height: 10, justifyContent: "center" }}
          >
            <View
              onLayout={e => {
                this.setState({
                  progressLineWidth: e.nativeEvent.layout.width
                });
              }}
              style={{ width: "100%", height: 2, backgroundColor: "#C0A10F" }}
            />
          </SDTouchOpacity>

          {this.state.showTip ? (
            <Animated.View
              style={{
                position: "absolute",
                left: this.state.tipOffsetX,
                top: Platform.OS == 'android' ? -18 : -37,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[{
                  paddingHorizontal: 10,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  borderRadius: 4,
                  alignItems: "center",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.15,
                  shadowRadius: 5,
                  shadowColor: "#000",
                }, Platform.OS == 'ios' ? {
                  height: CSS.pixel(50)
                }: {}]}
              >
                <Text style={{ color: "#333", fontSize: CSS.textSize(20) }}>
                  {this.formatTime(this.state.currTipTime)}
                </Text>
                {/* {Platform.OS == "android" && (
                  <View
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: "#ccc"
                    }}
                  />
                )} */}
              </View>
              {Platform.OS == "android" ? ( null
                // <View style={{ width: "100%", position: "relative" }}>
                //   <View
                //     style={{
                //       position: "absolute",
                //       zIndex: 1,
                //       left: "50%",
                //       bottom: -CSS.pixel(12),
                //       width: CSS.pixel(14),
                //       height: CSS.pixel(14),
                //       backgroundColor: "#fff",
                //       borderColor: "#ccc",
                //       borderWidth: 1,
                //       transform: [
                //         {
                //           rotateZ: "45deg"
                //         },
                //         {
                //           translateX: -CSS.pixel(7)
                //         }
                //       ]
                //     }}
                //   />
                //   <View
                //     style={{
                //       position: "absolute",
                //       zIndex: 2,
                //       left: "50%",
                //       bottom: CSS.pixel(-10),
                //       width: CSS.pixel(14),
                //       height: CSS.pixel(14),
                //       backgroundColor: "#fff",
                //       transform: [
                //         {
                //           rotateZ: "45deg"
                //         },
                //         {
                //           translateX: -CSS.pixel(7)
                //         }
                //       ]
                //     }}
                //   />
                // </View>
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    top: -1,
                    zIndex: 2
                  }}
                >
                  <View
                    style={{
                      borderColor: "transparent",
                      borderTopColor: "#fff",
                      borderWidth: CSS.pixel(10)
                    }}
                  />
                </View>
              )}
            </Animated.View>
          ) : null}

          {/* 当前进度条 */}
          <SDTouchOpacity noDelay style={{
            position: "absolute",
            height: '100%',
            width: '100%',
            backgroundColor: "transparent",
            justifyContent: 'center'
          }} onPress={() => {
            if (this.state.status == PlayStatus.Stop || this.state.status == PlayStatus.Pause || this.state.status == PlayStatus.Idle) {
              this.play();
            } else if(this.state.status == PlayStatus.Fetching) {
              this.stop();
            } else if(this.state.status == PlayStatus.Playing) {
              this.pause();
            }
          }}>
            <Animated.View
              style={{
                width: this.state.offsetX,
                height: 2,
                backgroundColor: "#333"
              }}
            />
          </SDTouchOpacity>
          {/* 播放球 */}
          <Animated.View {...this._panResponder.panHandlers} style={{left: this.state.offsetX, height: 30, width: CSS.pixel(30), justifyContent: 'center', alignItems: 'flex-start', position: 'absolute'}}>
            <Animated.View

              style={{
                width: this.state.isOnDrag && Platform.OS == 'ios' ? CSS.pixel(32) : CSS.pixel(24),
                height: this.state.isOnDrag && Platform.OS == 'ios' ? CSS.pixel(32) : CSS.pixel(24),
                borderRadius: this.state.isOnDrag && Platform.OS == 'ios' ? CSS.pixel(16) : CSS.pixel(12),
                backgroundColor: "#333",
                left: this.state.isOnDrag && Platform.OS == 'ios' ? -CSS.pixel(12) : 0
                // position: "absolute",
                // top: CSS.pixel(3),

              }}
            />
          </Animated.View>
        </View>
        <SDTouchOpacity noDelay onPress={() => {
          if (this.state.status == PlayStatus.Stop || this.state.status == PlayStatus.Pause || this.state.status == PlayStatus.Idle) {
            this.play();
          } else if(this.state.status == PlayStatus.Fetching) {
            this.stop();
          } else if(this.state.status == PlayStatus.Playing) {
            this.pause();
          }
        }} style={{ marginLeft: CSS.pixel(14), justifyContent: "center" }}>
          <Text>{this.formatTime(this.props.time)}</Text>
        </SDTouchOpacity>
      </View>
    );
  }

}
