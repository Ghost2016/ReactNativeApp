/* @flow */
import React, { PureComponent } from "react";
import ReactNative, {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  FlatList,
  TouchableOpacity,
  Image,
  UIManager
} from "react-native";
import PropTypes from "prop-types";
import { navScreen } from "@styles";
import { NewsSimpleModel } from "../../types";
import * as sdStyles from "@styles";
import { CSS } from "../../common/SDCSS";
import DirectInfoDetailScreen from "../../screens/pushScreen/directInfoDetail/DirectInfoDetailScreen";
import { navRightButton, navLightBox } from "../../styles";
import SDAnimateScreen from "../../common/SDAnimateScreen";
const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 4,
    overflow: "hidden"
  },
  textInfoBox: {
    flex: 1,
    flexDirection: "column",

    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10
  },
  imgBox: {
    width: 150,
    height: 100,
    marginTop: 10,
    marginRight: 10
    // backgroundColor: "red"
  },
  titleBox: {
    marginTop: 10
  },
  otherInfoBox: {
    flexDirection: "row",
    marginBottom: 10
  },
  titleText: {
    color: "#333",
    fontSize: 16
  },
  otherInfoText: {
    color: "#ccc"
  },

  checker: {
    height: "100%",
    width: CSS.pixel(38),
    marginRight: CSS.pixel(30)
  }
});
const selectedIcon = require("@img/grow/growing_btn_MoRen.png");
const selectNorIcon = require("@img/grow/growing_btn_FeiMoRen.png");

type Props = {
  data: NewsSimpleModel
};

export default class ListItem extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isCheck:
        typeof this.props.isCheck !== "undefined" ? this.props.isCheck : false,
      isNeedCheck:
        typeof this.props.isNeedCheck !== "undefined"
          ? !!this.props.isNeedCheck
          : false,

      titleTop: new Animated.Value(0),
      numTop: new Animated.Value(0),
      imageTop: new Animated.Value(0),

      titleOpacity: new Animated.Value(1),
      numOpacity: new Animated.Value(1),
      imageOpacity: new Animated.Value(1),
      imageSize: new Animated.Value(1)
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: () => null
  };

  componentDidMount() {
    //console.warn("this.props.data", this.props.data)
  }
  componentWillReceiveProps(next) {
    this.setState({
      isNeedCheck: next.isNeedCheck,
      isCheck: next.isCheck
    });
  }

  closeDetailAnimate() {
    Animated.parallel([
      Animated.timing(this.state.titleTop, {
        duration: 200,
        toValue: 0
      }),
      Animated.timing(this.state.numTop, {
        duration: 200,
        toValue: 0
      }),
      Animated.timing(this.state.imageTop, {
        duration: 200,
        toValue: 0
      }),
      Animated.timing(this.state.titleOpacity, {
        duration: 200,
        toValue: 1
      }),
      Animated.timing(this.state.numOpacity, {
        duration: 200,
        toValue: 1
      }),
      Animated.timing(this.state.imageOpacity, {
        duration: 200,
        toValue: 1
      }),
      Animated.timing(this.state.imageSize, {
        duration: 200,
        toValue: 1
      })
    ]).start();
  }

  onPressListItem() {
    if(this.refs["_title"]) {
      UIManager.measure(
        ReactNative.findNodeHandle(this.refs["_title"]),
        (x, y, w, h, px, py) => {
          const { id } = this.props.data;
          if (this.context.refs["_studentShare"] && Platform.OS == 'ios') {
            this.context.refs["_studentShare"].showDetail(this.props.data, {
              titlePx: px,
              titlePy: py
            }, this.closeDetailAnimate.bind(this));
            Animated.parallel([
              Animated.timing(this.state.titleTop, {
                duration: 0,
                toValue: -200
              }),
              Animated.timing(this.state.numTop, {
                duration: 0,
                toValue: 200
              }),
              Animated.timing(this.state.imageTop, {
                duration: 0,
                toValue: -200
              }),
              Animated.timing(this.state.titleOpacity, {
                duration: 0,
                toValue: 0
              }),
              Animated.timing(this.state.numOpacity, {
                duration: 0,
                toValue: 0
              }),
              Animated.timing(this.state.imageOpacity, {
                duration: 0,
                toValue: 0
              }),
              Animated.timing(this.state.imageSize, {
                duration: 0,
                toValue: 1.5
              })
            ]).start();
          } else {
            this.context.navigator.push(
              navScreen("PushScreen", "文章详情", {
                passProps: {
                  screen: () => <DirectInfoDetailScreen id={id} categoryId={this.props.categoryId} />,
                  fullScreen: true,
                  noScrollView: true,
                  header: {
                    title: "文章详情"
                  }
                },
                ...navRightButton("shareNewsBtn", () => (
                  <Image source={require("@img/salary/home_ico_share02.png")} />
                ))
              })
            );
          }
        }
      );
    }


    // this.context.navigator.push(
    //   navScreen("PushScreen", "文章详情", {
    //     passProps: {
    //       screen: () => <DirectInfoDetailScreen id={id} />,
    //       fullScreen: true,
    //       noScrollView: true,
    //       header: {
    //         title: "文章详情"
    //       }
    //     },
    //     ...navRightButton("shareNewsBtn", () => (
    //       <Image source={require("@img/salary/home_ico_share02.png")} />
    //     ))
    //   })
    // );
    // this.context.navigator.push(navScreen("PushScreen", "文章详情", {
    //   passProps: {
    //     screen: () => <SDAnimateScreen title={"文章详情"}/>,
    //     custom: true,
    //   },
    //   override: {animated: false}
    // }));
  }
  checkItem() {
    this.props.onCheckItem &&
      this.props.onCheckItem instanceof Function &&
      this.props.onCheckItem(!this.state.isCheck, this.props.data);
    this.setState({
      isCheck: !this.state.isCheck
    });
  }
  render() {
    // console.warn(this.props.data);
    const { style } = this.props;
    let resetStyle = this.props.style || {};
    return (
      <View
        style={[{
          padding: CSS.pixel(30),
          paddingBottom: 0,
          flexDirection: "row",
          backgroundColor: this.props.backgroundColor || "#fff"
        }, style]}
      >
        {this.state.isNeedCheck ? (
          <View style={styles.checker}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={this.checkItem.bind(this)}
            >
              {/* <Icon
                name={this.state.isCheck ? "checkbox-on" : "checkbox-off"}
              /> */}
              <Image
                style={{ width: CSS.pixel(36), height: CSS.pixel(36) }}
                source={this.state.isCheck ? selectedIcon : selectNorIcon}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity
          onPress={this.onPressListItem.bind(this)}
          activeOpacity={1.0}
          style={[styles.container, { ...resetStyle }]}
        >
          <View style={{ flex: 1, borderRadius: 4}}>
            {this.props.data.order ? <View style={{
              top: CSS.pixel(20),
              zIndex: 5,
              backgroundColor: 'rgba(222,222,222,0.8)',
              paddingHorizontal: CSS.pixel(10),
              justifyContent: "center",
              alignItems: "center",
              height: CSS.pixel(34),
              position: "absolute",
              left: 0,
              borderBottomRightRadius: 10,
              borderTopRightRadius: 10
            }}>
              <Text style={{
                color: sdStyles.SDFontColorMain,
                fontSize: CSS.textSize(20)
              }}>置顶</Text>
            </View> : null}
            <View style={{ position: "relative", height: CSS.pixel(300)}}>
              <View
                style={{
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: CSS.pixel(300), //CSS.pixel(388),
                  position: "absolute",
                  zIndex: 0,
                  borderWidth: 0,
                  borderRadius: 4,
                  overflow: 'hidden',
                  borderColor: '#f00',
                }}
              >
                {/* <View
                  style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.32)', zIndex: 2}}
                >

                </View> */}
                {this.props.data.image ? (
                  <Animated.Image
                    style={{
                      height: CSS.pixel(300), //388
                      width: '100%', //parseInt(screenWidth),
                      top: this.state.imageTop,
                      opacity: this.state.imageOpacity,
                      transform: [{
                        scale: this.state.imageSize,
                      }],
                      borderWidth: 0,
                      borderColor: '#f00',
                      alignSelf: 'center',
                    }}
                    resizeMode="stretch"
                    source={{
                      uri:
                        this.props.data.image.url +
                        `?imageView2/0/w/${parseInt(screenWidth)}/h/${parseInt(CSS.pixel(388))}`
                    }}
                  />
                ) : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text style={{color: '#ccc', fontSize: CSS.textSize(30)}}>缺失封面</Text></View>}
              </View>

              <View
                style={{
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: CSS.pixel(300),//"100%",
                  position: "absolute",
                  backgroundColor: "rgba(0,0,0,0)",
                  zIndex: 1,
                  borderWidth: 0,
                  borderColor: '#f00',
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                justifyContent: "center",
                paddingHorizontal: this.props.paddingFix ? CSS.pixel(this.props.paddingFix) : CSS.pixel(0),
                marginTop: CSS.pixel(12),
                marginLeft: this.props.backgroundColor ? CSS.pixel(20) : 0,
                borderWidth: 0,
                borderColor: '#f00',
              }}
            >
              <Animated.Text
                ref="_title"
                style={{
                  color: "#333",
                  fontSize: CSS.pixel(30),
                  fontWeight: '600',
                  top: this.state.titleTop,
                  opacity: this.state.titleOpacity
                }}
                numberOfLines={1}
              >
                {this.props.data.title}
              </Animated.Text>
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                justifyContent: "center",
                paddingHorizontal: this.props.paddingFix ? CSS.pixel(this.props.paddingFix) : CSS.pixel(0),
                marginTop: CSS.pixel(5),
                marginBottom: CSS.pixel(5),
                marginLeft: this.props.backgroundColor ? CSS.pixel(20) : 0,
                borderWidth: 0,
                borderColor: '#f00',
              }}
            >
              <Animated.Text
                style={{
                  color: "#666",
                  fontSize: CSS.pixel(24),
                  top: this.state.numTop,
                  opacity: this.state.numOpacity,
                }}
              >
                {/* {this.props.data.category_name} */}
                {this.props.data && this.props.data.tags && this.props.data.tags.length > 0 ? this.props.data.tags.slice(0, 5).map(c => {
                  return c.name;
                }).join("/"): ""}
              </Animated.Text>
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                justifyContent: "center",
                paddingHorizontal: this.props.paddingFix ? CSS.pixel(this.props.paddingFix) : CSS.pixel(0),
                marginBottom: CSS.pixel(16),
                marginLeft: this.props.backgroundColor ? CSS.pixel(20) : 0,
              }}
            >
              <Animated.Text
                style={{
                  color: "#666",
                  fontSize: CSS.pixel(20),
                  top: this.state.numTop,
                  opacity: this.state.numOpacity
                }}
              >
                {this.props.data.use_num}
                人觉得有用
              </Animated.Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
