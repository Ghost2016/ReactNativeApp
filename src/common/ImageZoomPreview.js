import React, { Component } from "react";
import ReactNative, {
  Animated,
  View,
  Modal,
  UIManager,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
  Text,
  ActivityIndicator
} from "react-native";
import Carousel from "react-native-snap-carousel";
import SDTouchOpacity from "./SDTouchOpacity";
import { dismissLightBox } from "../styles";
import ImageZoom from 'react-native-image-pan-zoom';

const DRAG_DISMISS_THRESHOLD = 150;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const WINDOW_WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: 'transparent'
  },
  openStyle: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT
  }
});

export default class ImageZoomPreview extends React.Component {
  static defaultProps = {
    rootRef: null
  };

  constructor(props) {
    super(props)
    this.state = {
      hasClosed: false,
      hasLoaded: false,

      imageList: [1,2,3,4,5,6,7,8],
      currIndex: 0,
      closeing: false,

      visible: false,
      isAnimating: false,
      isPanning: false,
      target: {
        x: 0,
        y: 0,
        opacity: 1
      },
      origin: {
        w: 0,
        h: 0,
        x: 0,
        y: 0
      },

      panx: new Animated.Value(0),
      pany: new Animated.Value(0),

      openVal: new Animated.Value(0),

      imageWidth: new Animated.Value(100),
      imageHeight: new Animated.Value(100),

      imageLeft: new Animated.Value(100),
      imageTop: new Animated.Value(100),

      maskOpacity: new Animated.Value(0),

      containerX: new Animated.Value(0),
    };

    this.isScaled = false; // 是否放大缩小过了
  }

  componentWillMount() {
    let touchInterTime = Date.now();
    let noMove = true;
    let isTouching = false;
    let longPressTimer = null;

    let initDistend = 0;
    let isScaling = false;

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) =>
        !this.state.isAnimating || true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        isScaling = false;
        let touchLength = gestureState.numberActiveTouches;
        touchInterTime = Date.now();
        noMove = true;
        isTouching = true;

        longPressTimer && clearTimeout(longPressTimer);

        longPressTimer = setTimeout(() => {
          if(isTouching && noMove && touchLength == 1) {
            //console.warn("长按")
          }
        }, 800);

        // 处理两个手指的初始化状态
        // 这里计算初始的距离 √(x1-x2)^2+(y1-y2)^2
        if(touchLength == 2) {
          return;
          isScaling = true;
          initDistend = Math.sqrt(
            Math.pow(evt.nativeEvent.touches[0].pageX - evt.nativeEvent.touches[1].pageX, 2) +
            Math.pow(evt.nativeEvent.touches[0].pageY - evt.nativeEvent.touches[1].pageY, 2)
          );
        }

        return !this.state.isAnimating || true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        !this.state.isAnimating || true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        !this.state.isAnimating || true,

      onPanResponderGrant: (evt, gestureState) => {
        this.state.panx.setValue(0);
        this.state.pany.setValue(0);
      },
      onPanResponderMove: (e, gestureState) => {
        // Animated.event([null, { dy: this.state.pany, dx: this.state.panx }])

        // 判断省掉水平轴的滑动
        // snap到下一页的时候
        // if((gestureState.dy > 0 && gestureState.dx) > 0 || (gestureState.dy > 0 && gestureState.dx < 0)) {
        //   if(Math.abs(gestureState.dy / gestureState.dx) < 0.5) {
        //     // 丢弃
        //   } else {
        //     this.state.panx.setValue(gestureState.dx);
        //   }
        // } else {
        //   if(Math.abs(gestureState.dx / gestureState.dy) < 0.5) {
        //     // 丢弃
        //   } else {
        //     this.state.panx.setValue(gestureState.dx);
        //   }
        // }

        this.state.panx.setValue(gestureState.dx);
        this.state.pany.setValue(gestureState.dy);

        // 判断是否已经存在放大状态
        // Todo

        let touchLength = gestureState.numberActiveTouches;

        // 触发缩放大小
        // 缩放因子
        // 只有向下拉动图片的时候触发
        // 并且只有一个指拇手指的时候
        if(gestureState.dy > 0 && touchLength == 1) {
          let scaleRate = this.state.pany._value / ((WINDOW_HEIGHT / 2) - Math.abs(this.state.pany._value));
          let newWidth = parseInt(WINDOW_WIDTH - (WINDOW_WIDTH * scaleRate / 2));
          let newOpacity = (1 - (1 * scaleRate / 2)) <= 0 ? 0.1 : (1 - (1 * scaleRate / 2));
          newWidth = newWidth <= 150 ? 150 : newWidth;

          // 防止长按手指抖动
          if(WINDOW_WIDTH - newWidth >= 10) {
            noMove = false;
          }

          this.state.imageWidth.setValue(newWidth);
          this.state.imageLeft.setValue((WINDOW_WIDTH - newWidth) / 2);
          this.state.maskOpacity.setValue(newOpacity);
        } else {
          // 判断是否是手指缩放大小
          // 两个手指操作
          return;
          if(touchLength == 2 && isScaling && initDistend != 0) {
            let distend = Math.sqrt(
              Math.pow(e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX, 2) +
              Math.pow(e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY, 2)
            )
            // 缩放因子
            let scaleNumber = (distend - initDistend) / 1.5;

            // if(scaleNumber < 0) {
            //   // 判断图片大小是否太小
            //   if(this.state.imageWidth._value <= 150 || this.state.imageHeight._value <= 150) {
            //     return;
            //   }
            // }

            // 计算放大或者缩小结果
            this.state.imageWidth.setValue(this.state.imageWidth._value + scaleNumber);
            this.state.imageHeight.setValue(this.state.imageHeight._value + scaleNumber);

            this.state.imageLeft.setValue(this.state.imageLeft._value - scaleNumber / 2);
            this.state.imageTop.setValue(this.state.imageTop._value - scaleNumber / 2);

            if(this.state.imageHeight._value > this.state.origin.h) {
              this.isScaled = true;
            }

            initDistend = distend;
          } else if(touchLength == 2) {
            let distend = Math.sqrt(
              Math.pow(e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX, 2) +
              Math.pow(e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY, 2)
            );
            initDistend = distend;
          }
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        initDistend = 0;

        // 长按操作
        isTouching = false;
        longPressTimer && clearTimeout(longPressTimer);
        longPressTimer = null;

        let beforeLeft = this.state.imageLeft._value;
        let beforeTop = this.state.imageTop._value;
        this.state.imageLeft.setValue(this.state.imageLeft._value + this.state.panx._value);
        this.state.imageTop.setValue(this.state.imageTop._value + this.state.pany._value);

        // 差值
        let minx = this.state.imageLeft._value - beforeLeft;
        let miny = this.state.imageTop._value - beforeTop;

        this.state.panx.setValue(0);
        this.state.pany.setValue(0);

        // 释放间隔时间
        let minTime = Date.now() - touchInterTime;

        // 判断是否距离远了就可dismiss
        if(miny >= 140) {
          this.close();
        } if(minTime <= 100 && Math.abs(minx) <= 5 && Math.abs(miny) <= 5) {
          // 单击
          // 防止滑动点击
          this.close();
        } else if(minTime <= 200 && minx <= -30 && this.state.currIndex < this.state.imageList.length - 1) {
          // 向左翻
          //console.warn("左滑")
          this.snapLeft();
          this.isScaled = false;
        } if(minTime <= 200 && minx >= 30 && this.state.currIndex > 0) {
          // 向右翻
          //console.warn("右滑");
          this.snapRight();
          this.isScaled = false;
        } else {
          // 自动回到中间
          if(!this.state.closeing && (!this.isScaled || this.state.imageWidth._value < WINDOW_WIDTH)) {
            Animated.parallel([
              Animated.timing(this.state.imageLeft, {
                duration: 150,
                toValue: 0
              }),
              Animated.timing(this.state.imageTop, {
                duration: 150,
                toValue: Math.abs(WINDOW_HEIGHT / 2 - this.state.origin.h / 2)
              }),
              Animated.timing(this.state.imageWidth, {
                duration: 150,
                toValue: WINDOW_WIDTH
              }),
              Animated.timing(this.state.imageHeight, {
                duration: 150,
                toValue: this.state.origin.h
              }),
              Animated.timing(this.state.maskOpacity, {
                duration: 150,
                toValue: 1
              }),
            ]).start();
          }
        }
      }
    });
  }

  snapRight() {
    if(this.state.imageList.length > 0 && this.state.currIndex > 0) {
      Animated.timing(this.state.containerX, {
        toValue: -(this.state.currIndex - 1) * WINDOW_WIDTH,
        duration: 100
      }).start(() => {
        // 滑动到中间的图片保持在中间
        this.state.imageLeft.setValue(0);
        this.state.imageTop.setValue(Math.abs(WINDOW_HEIGHT / 2 - this.state.origin.h / 2));
        this.state.currIndex = this.state.currIndex - 1;
      });
    }
  }

  snapLeft() {
    if(this.state.imageList.length > 0 && this.state.currIndex < this.state.imageList.length - 1) {

      Animated.timing(this.state.containerX, {
        toValue: -(this.state.currIndex + 1) * WINDOW_WIDTH,
        duration: 100
      }).start(() => {
        // 滑动到中间的图片保持在中间
        this.state.imageLeft.setValue(0);
        this.state.imageTop.setValue(Math.abs(WINDOW_HEIGHT / 2 - this.state.origin.h / 2));
        this.state.currIndex = this.state.currIndex + 1;
      });
    }
  }

  close() {
    // 关闭预览
    this.state.closeing = true;
    Animated.parallel([
      Animated.timing(this.state.imageWidth, {
        toValue: this.state.origin.w,
        duration: 200
      }),
      Animated.timing(this.state.imageHeight, {
        toValue: this.state.origin.h,
        duration: 200
      }),
      Animated.timing(this.state.imageLeft, {
        toValue: this.state.origin.x,
        duration: 200
      }),
      Animated.timing(this.state.imageTop, {
        toValue: this.state.origin.y,
        duration: 200
      }),
      Animated.timing(this.state.maskOpacity, {
        toValue: 0,
        duration: 300
      }),
    ]).start(() => {
      this.setState({
        isAnimating: false,
        hasClosed: true,
      }, () => {
        dismissLightBox();
      });
      this.props.onClose && this.props.onClose();
    });
  }

  open() {
    setTimeout(() => {
      this.setState({
        hasLoaded: true
      }, () => {
        if (this.props._root) {
          // 获取原来的位置
          this.props._root.measure((x, y, w, h, px, py) => {
            this.setState({
              isAnimating: true,
              origin: {
                w,
                h,
                x: px,
                y: py
              },
              visible: true
            });

            this.state.imageWidth.setValue(w);
            this.state.imageHeight.setValue(h);
            this.state.imageLeft.setValue(px);
            this.state.imageTop.setValue(py);

            // 移动到中间位置
            // 打开预览
            Animated.parallel([
              Animated.timing(this.state.imageWidth, {
                toValue: WINDOW_WIDTH,
                duration: 200
              }),
              Animated.timing(this.state.imageLeft, {
                toValue: 0,
                duration: 200
              }),
              Animated.timing(this.state.imageTop, {
                toValue: Math.abs(WINDOW_HEIGHT / 2 - h / 2),
                duration: 200
              }),
            ]).start(() => {
              // 打开预览后
              this.state.closeing = false;
              this.state.isAnimating = false;

              Animated.timing(this.state.maskOpacity, {
                toValue: 1,
                duration: 200
              }).start();
            });
          });
        } else {
          this.close();
        }
      });
    }, 30)
  }
  componentWillReceiveProps(next) {
    if (next._root && next.visible) {
      // 获取原来的位置
      next._root.measure((x, y, w, h, px, py) => {
        this.setState({
          isAnimating: true,
          origin: {
            w,
            h,
            x: px,
            y: py
          },
          visible: true
        });

        this.state.imageWidth.setValue(w);
        this.state.imageHeight.setValue(h);
        this.state.imageLeft.setValue(px);
        this.state.imageTop.setValue(py);

        // 移动到中间位置
        // 打开预览
        Animated.parallel([
          Animated.timing(this.state.imageWidth, {
            toValue: WINDOW_WIDTH,
            duration: 200
          }),
          Animated.timing(this.state.imageLeft, {
            toValue: 0,
            duration: 200
          }),
          Animated.timing(this.state.imageTop, {
            toValue: Math.abs(WINDOW_HEIGHT / 2 - h / 2),
            duration: 200
          }),
        ]).start(() => {
          // 打开预览后
        });
      });
    } else {
      this.close();
    }
  }

  renderContainer() {
    return (
      <Animated.View
        style={[
          styles.background,
          { justifyContent: "center", alignItems: "center"}
        ]}
        // {...this._panResponder.panHandlers}
      >
        <Animated.View
          style={{
            position: 'absolute',
            width: this.state.imageList.length * WINDOW_WIDTH,
            height: WINDOW_HEIGHT,
            left: this.state.containerX,
            top: 0,
            backgroundColor: 'transparent'
          }}
        >
          {this.state.imageList.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  position: 'absolute',
                  left: index * WINDOW_WIDTH,
                  top: 0,
                  
                  width: WINDOW_WIDTH,
                  height: WINDOW_HEIGHT,

                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: index,
                }}
              >
                <ImageZoom
                  cropWidth={Dimensions.get('window').width}
                  cropHeight={Dimensions.get('window').height}
                  imageWidth={200}
                  imageHeight={200}
                  enableSwipeDown={true}
                >
                  <Image
                    enableHorizontalBounce={true}
                    style={{
                      width: 200,
                      height: 200
                    }}
                    source={{
                      uri:
                        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522606437962&di=f93f5c645225a5681155ebcde27b257f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0159fa5944bcd3a8012193a34b762d.jpg%402o.jpg'
                    }}
                  />
                </ImageZoom>
              </View>
            )
          })}
        </Animated.View>
      </Animated.View>
    )
  }

  render() {
    // if(!this.state.hasLoaded) {
    //   return (<View onLayout={this.open.bind(this)} 
    //     style={[styles.background, {justifyContent: 'center', alignItems: 'center'}]}>
    //     <ActivityIndicator size="small" color="#888888" />
    //   </View>)
    // }
    // return (
    //   this._renderItem()
    // );
    return (
      <Modal transparent={true} visible={this.state.visible}>
        {/* {this._renderItem()} */}
        {this.renderContainer()}
     </Modal>
    );
  }
}
