import React from "react";
import ReactNative, {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  Animated,
  Image,
  Alert,
  WebView,
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../../../connectWithActions";
import SDUpPullScrollView, {
  RefreshState
} from "../../../common/SDUpPullScrollView";
import ListItem from "../../../sd_directinfo/infolist/ListItem";
import { navLightBox, dismissLightBox } from "../../../styles";
import FilterLightbox from "./FilterLightbox";
import { CSS } from "../../../common/SDCSS";
import * as WeChat from "react-native-wechat";
import SDHeader, {
  headerHeight,
  headerOffsetHeight,
  headerPadding
} from "../../../common/SDHeader";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import ShareButton from "../../../sd_shareButton/ShareButton";
import { isIphoneX } from "../../../utils/iphonex";
import TabsButton from "../../../sd_directInfoDetail/tabs/TabsButton";
import LottieView from "lottie-react-native";
import SDLoading from "@sd_components/SDLoading";
import * as HOSTS from "@src/host";
import QQShare from "../../../boot/QQShare";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const htmlStyle = StyleSheet.create({
  p: {
    color: "#666",
    lineHeight: CSS.pixel(40)
  }
});

class StudentShareTab extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newsList: [],
      count: 0,
      current_page: 1,
      per_page: 10,
      total_page: 0,
      currState: RefreshState.Idle,
      isUse: false,
      oldTitleDisplay: "none",
      detailDisplay: "none",
      oldIconDisplay: "none",
      oldTitle: new Animated.Value(1),
      newTitle: new Animated.Value(0),
      oldSpinValue: new Animated.Value(0),
      newSpinValue: new Animated.Value(1),
      newIconOpacity: new Animated.Value(0),
      oldIconOpacity: new Animated.Value(1),
      backgroundOpacity: new Animated.Value(0),
      detail: {},
      detailTitleTop: new Animated.Value(220),
      iconProcess: new Animated.Value(0),
      webviewHeight: 0,
      loading: false,
      categoryId: this.props.categoryId
    };

    this.closeEvent = null;
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentDidMount() {
    /* this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "filter_studentNewsBtn"
    );
 */
    this.context.refs["_studentShare_"+this.props.categoryId] = this;
  }

  componentWillUnmount() {
    if (this.context.refs["_studentShare_"+this.props.categoryId]) {
      delete this.context.refs["_studentShare_"+this.props.categoryId];
    }
  }

  onNavigatorEvent(event) {
    /* if (event.type == "NavBarButtonPress") {
      if (event.id == "filter_studentNewsBtn") {
        navLightBox("LightBoxScreen", {
          passProps: {
            screen: () => <FilterLightbox categoryId={this.props.categoryId} />
          }
        });
      }
    } */
  }

  hideDetail() {
    this.refs["_filtericon"].play(25, 10);
    this.setState(
      {
        oldTitleDisplay: "flex"
      },
      () => {
        Animated.timing(this.state.backgroundOpacity, {
          duration: 0,
          toValue: 0
        }).start();

        Animated.parallel([
          Animated.timing(this.state.oldTitle, {
            duration: 300,
            toValue: 1
          }),
          Animated.timing(this.state.newTitle, {
            duration: 300,
            toValue: 0
          })
        ]).start(() => {
          this.setState({
            detailDisplay: "none",
            oldTitleDisplay: "none"
          });
        });

        Animated.parallel([
          Animated.timing(this.state.oldSpinValue, {
            duration: 150,
            toValue: 0
          }),
          Animated.timing(this.state.oldIconOpacity, {
            duration: 150,
            toValue: 1
          }),
          Animated.timing(this.state.newSpinValue, {
            duration: 150,
            toValue: 1
          }),
          Animated.timing(this.state.newIconOpacity, {
            duration: 150,
            toValue: 0
          })
        ]).start(() => {
          this.setState({
            oldIconDisplay: "flex"
          });
        });
      }
    );
    this.closeEvent && this.closeEvent();
  }

  showDetail_old(detail, titlePos, closeEvent) {
    const duration = 400;

    this.closeEvent = closeEvent;

    this.refs["_filtericon"].reset();

    this.refs["_filtericon"].play(15, 30);

    this.props.actions.readItAction({ id: detail.id });
    this.props.actions
      .getNewsDetailAction({ id: detail.id })
      .then(res => {
        if (res.status == "ok") {
          this.setState({
            detail: res.results
          });
        }
      })
      .catch(err => {});

    this.setState(
      {
        oldIconDisplay: "flex",
        detailDisplay: "flex",
        oldTitleDisplay: "none",
        detail: detail
      },
      () => {
        Animated.timing(this.state.detailTitleTop, {
          duration: 0,
          toValue: titlePos.titlePy
        }).start();
        Animated.parallel([
          Animated.timing(this.state.oldTitle, {
            duration: duration,
            toValue: 0
          }),
          Animated.timing(this.state.newTitle, {
            duration: duration,
            toValue: 1
          }),
          Animated.timing(this.state.backgroundOpacity, {
            duration: duration,
            toValue: 1
          }),
          Animated.timing(this.state.detailTitleTop, {
            duration: duration,
            toValue: 0
          })
        ]).start(() => {
          this.setState({
            oldTitleDisplay: "none",
            oldIconDisplay: "none"
          });
        });

        this.refs['webview'].reload();
      }
    );
  }

  reloadData(size = null, isUse = false) {
    let queryParams = this.props.positionId ? {
      size: size || this.state.per_page,
      page: 1,
      position_id: this.props.positionId,
    } : {
      size: size || this.state.per_page,
      page: 1,
      category: this.props.categoryId == 0 ? '' : this.props.categoryId,
    };
    if (this.state.isUse || isUse) {
      queryParams.use = "true";
    }
    //console.warn("reloadData==", queryParams, size, isUse)
    this.props.actions.getNewsAction(queryParams).then(res => {
      if (res.status == "ok") {
        this.setState({
          newsList: res.results,
          count: res.count,
          current_page: res.current_page,
          total_page: res.total_page,
          per_page: res.per_page,
          currState:
            res.count <= res.results.length
              ? RefreshState.NoMoreData
              : RefreshState.Idle
        });
      }
    });
  }

  componentWillMount() {
    this.props.actions
      .getNewsAction(this.props.positionId ? {
        size: this.state.per_page,
        page: 1,
        position_id: this.props.positionId,
      } : {
        size: this.state.per_page,
        page: 1,
        category: this.props.categoryId == 0 ? '' : this.props.categoryId,
        //category__title: "学霸分享"
      })
      .then(res => {
        if (res.status == "ok") {
          this.setState({
            newsList: res.results,
            count: res.count,
            current_page: res.current_page,
            total_page: res.total_page,
            per_page: res.per_page,
            currState:
              res.count <= res.results.length
                ? RefreshState.NoMoreData
                : RefreshState.Idle
          });
        }
      });
  }

  _renderItem({ item, index, separators }) {
    return <ListItem backgroundColor={"#f9f9f9"} key={index + ""} data={item} categoryId={this.props.categoryId} />;
  }

  refreshHeader() {
    this.setState({
      currState: RefreshState.HeaderRefreshing
    });
    this.props.actions
      .getNewsAction(this.props.positionId ? {
        size: this.state.per_page,
        page: 1,
        position_id: this.props.positionId,
      } : {
        size: this.state.per_page,
        page: 1,
        category: this.props.categoryId == 0 ? '' : this.props.categoryId,
      })
      .then(res => {
        if (res.status == "ok") {
          this.setState({
            newsList: res.results,
            count: res.count,
            current_page: res.current_page,
            total_page: res.total_page,
            per_page: res.per_page,
            currState:
              res.count <= res.results.length
                ? RefreshState.NoMoreData
                : RefreshState.Idle
          });
        }
      });
  }

  refreshFooter() {
    if (
      this.state.count <= this.state.newsList.length ||
      this.state.total_page <= this.state.current_page
    ) {
      return;
    } else {
      // 取下一页
      this.setState({
        currState: RefreshState.FooterRefreshing
      });
      let paramas = this.props.positionId ? {
        size: this.state.per_page,
        page: this.state.current_page + 1,
        position_id: this.props.positionId,
      } : {
        size: this.state.per_page,
        page: this.state.current_page + 1,
        category: this.props.categoryId == 0 ? '' : this.props.categoryId,
      };
      if (this.state.isUse) {
        paramas.use = "true";
      }
      this.props.actions.getNewsAction(paramas).then(res => {
        if (res.status == "ok") {
          let newListTemp = this.state.newsList.concat(res.results);
          this.setState({
            newsList: newListTemp,
            count: res.count,
            current_page: res.current_page,
            total_page: res.total_page,
            per_page: res.per_page,
            currState:
              res.count <= newListTemp.length
                ? RefreshState.NoMoreData
                : RefreshState.Idle
          });
        }
      });
    }
  }

  render() {
    const oldSpin = this.state.oldSpinValue.interpolate({
      inputRange: [0, 1], //输入值
      outputRange: ["0deg", "-360deg"] //输出值
    });
    const newSpin = this.state.newSpinValue.interpolate({
      inputRange: [0, 1], //输入值
      outputRange: ["0deg", "-360deg"] //输出值
    });
    return (
      <View
        style={{
          backgroundColor: "#f9f9f9",
          flex: 1,
          width: width,
          borderWidth: 0,
          borderColor: '#ff0',
        }}
      >
        <SDUpPullScrollView
          refreshState={this.state.currState}
          onFooterRefresh={this.refreshFooter.bind(this)}
          onHeaderRefresh={this.refreshHeader.bind(this)}
          renderItem={this._renderItem.bind(this)}
          data={this.state.newsList}
          keyExtractor={item => item.id + ""}
          style={{
              backgroundColor: '#fff',
              //marginTop: CSS.pixel(30, true),
              marginBottom: CSS.pixel(30, true),
              borderWidth: 0,
              width: CSS.width(),
              borderColor: '#f00',
          }}
        />

        <View
          style={{
            position: "absolute",
            top: -headerHeight,
            width: CSS.width(),
            height: CSS.height() + headerHeight,
            paddingTop: headerPadding,
            display: this.state.detailDisplay
          }}
        >
          {/* header */}
          <View
            style={{
              paddingHorizontal: CSS.pixel(30),
              height: headerHeight - headerPadding,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "#fff",
              top: isIphoneX()
                ? -8
                : Platform.OS == "ios"
                  ? ReactNative.PixelRatio.get() == 3
                    ? -5
                    : -2.5
                  : 0
            }}
          >
            <SDTouchOpacity
              onPress={this.hideDetail.bind(this)}
              style={{ width: 60, justifyContent: "center" }}
            >
              <Image source={require("@img/salary/home_Salary_back.png")} />
            </SDTouchOpacity>

            <Animated.View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                opacity: this.state.oldTitle,
              }}
            >
              <Text style={{ color: "#333", fontSize: CSS.pixel(36) }}>
                开门指路
              </Text>
            </Animated.View>
            <Animated.View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                opacity: this.state.newTitle
              }}
            >
              <Text style={{ color: "#333", fontSize: CSS.pixel(36) }}>
                文章详情
              </Text>
            </Animated.View>

            <View
              style={{
                width: 60,
                justifyContent: "center",
                alignItems: "flex-end"
              }}
            >
              <SDTouchOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-end"
                }}
                onPress={() => {
                  navLightBox("LightBoxScreen", {
                    passProps: {
                      screen: () => (
                        <ShareButton
                          onShareLog={()=>{
                            this.props.actions.logShareNewsAction({ id: this.state.detail.id })
                              .then(res => {})
                              .catch(err => {});
                          }}
                          sessionPress={() => {
                            dismissLightBox();
                            // 进行微信分享
                            WeChat.isWXAppInstalled()
                              .then(installed => {
                                if (installed) {
                                  WeChat.shareToSession({
                                    type: "news",
                                    title: this.state.detail.title,
                                    description: this.state.detail.content,
                                    webpageUrl: `${HOSTS.SHARE}/#/post?newsid=${
                                      this.state.detail.id
                                    }`
                                  });
                                } else {
                                  Alert.alert("微信未安装");
                                }
                              })
                              .catch(err => {
                                Alert.alert("err:" + err);
                              });
                          }}
                          timeLinePress={() => {
                            // 进行微信分享
                            dismissLightBox();
                            WeChat.isWXAppInstalled()
                              .then(installed => {
                                if (installed) {
                                  WeChat.shareToTimeline({
                                    type: "news",
                                    title: this.state.detail.title,
                                    description: this.state.detail.content,
                                    webpageUrl: `${HOSTS.SHARE}/#/post?newsid=${
                                      this.state.detail.id
                                    }`
                                  });
                                } else {
                                  Alert.alert("微信未安装");
                                }
                              })
                              .catch(err => {
                                Alert.alert("err:" + err);
                              });
                          }}
                          qqTimeLinePress={() => {
                            QQShare.isQQInstalled().then(installed => {
                              dismissLightBox();
                              if(installed) {
                                QQShare.shareToQZone({
                                  type: "news",
                                  title: this.state.detail.title,
                                  imageUrl: `${HOSTS.SHARE}/images/logo.png`,
                                  description: this.state.detail.content,
                                  url: `${HOSTS.SHARE}/?from=singlemessage#/post?newsid=${
                                    this.state.detail.id
                                  }`
                                })
                              } else {
                                Alert.alert("QQ未安装");
                              }
                            })
                          }}
                          qqSessionPress={() => {
                            QQShare.isQQInstalled().then(installed => {
                              dismissLightBox();
                              if(installed) {
                                QQShare.shareToQQ({
                                  type: "news",
                                  title: this.state.detail.title,
                                  imageUrl: `${HOSTS.SHARE}/images/logo.png`,
                                  description: this.state.detail.content,
                                  url: `${HOSTS.SHARE}/?from=singlemessage#/post?newsid=${
                                    this.state.detail.id
                                  }`
                                })
                              } else {
                                Alert.alert("QQ未安装");
                              }
                            })
                          }}
                        />
                      )
                    }
                  });
                }}
              >
                <View style={{
                  height:CSS.pixel(50),
                  width:CSS.pixel(50),
                  borderWidth: 0,
                  borderColor:'#00f',
                }}><LottieView
                  ref="_filtericon"
                  loop={false}
                  style={{
                    height:
                      Platform.OS == "ios" && ReactNative.PixelRatio.get() == 3
                        ? CSS.pixel(50)
                        : CSS.pixel(50),
                    width:
                      Platform.OS == "ios" && ReactNative.PixelRatio.get() == 3
                        ? CSS.pixel(50)
                        : CSS.pixel(50),
                    position: "absolute",
                    right: Platform.OS == "ios"? 0 : 0,
                    left: Platform.OS == "ios"? CSS.pixel(0) : 0,
                  }}
                  source={require("@img/animate/filter.json")}
                /></View>
              </SDTouchOpacity>
            </View>
          </View>

          <Animated.View
            style={{
              opacity: this.state.backgroundOpacity,
              backgroundColor: "#fff",
              flex: 1
            }}
          >
            {this.state.detail && JSON.stringify(this.state.detail) !== "{}" ? (
              <ScrollView
                style={{
                  flex: 1,
                  marginBottom: isIphoneX()
                    ? headerOffsetHeight + 60
                    : headerHeight + 60
                }}
                onLayout={e => {
                  this.setState({
                    webviewHeight: e.nativeEvent.layout.height
                  });
                }}
              >
                {/* <View
                  style={{
                    padding: CSS.pixel(30)
                  }}
                >
                  <View style={{ flexWrap: "wrap" }}>
                    <Animated.Text
                      style={{
                        fontSize: 18,
                        color: "#333",
                        top: this.state.detailTitleTop
                      }}
                    >
                      {this.state.detail.title}
                    </Animated.Text>
                  </View>
                  <View style={{ marginTop: CSS.pixel(30) }}>
                    <Animated.Text
                      style={{
                        fontSize: 12,
                        color: "#c5c5c5",
                        top: this.state.detailTitleTop
                      }}
                    >
                      {this.state.detail.created_time
                        ? ftime(this.state.detail.created_time)
                        : ""}
                    </Animated.Text>
                  </View>
                </View> */}

                {/* <View style={{ paddingHorizontal: CSS.pixel(30) }}>
                  {!this.state.detail.content_html ? (
                    <Animated.View
                      style={{
                        top: this.state.detailTitleTop
                      }}
                    >
                      <Text style={{ color: "#eee" }}>
                        {this.state.detail.content}
                      </Text>
                    </Animated.View>
                  ) : (
                    <HTMLView
                      stylesheet={htmlStyle}
                      value={`<p>${
                        this.state.detail.content_html
                          ? this.state.detail.content_html
                          : this.state.detail.content
                      }</p>`}
                    />
                  )}
                </View> */}
                {this.state.loading ? (
                    <SDLoading />
                  ) : null}
                <WebView ref={'webview'} automaticallyAdjustContentInsets={false} source={{uri:`${HOSTS.SHARE}/#/post2?newsid=${this.state.detail.id}`}} style={[{
                //flex: 1,
                width: '100%',
                height: this.state.webviewHeight,
                //flex: 1,
                borderWidth: 0,
                borderColor:'#f00',
              }, Platform.OS == 'android' ? {flex: 1}: {}]}
              onLoadStart={()=>{
                /* this.setState({
                  loading: true,
                }); */
              }}
              onLoadEnd={()=>{
                /* this.setState({
                  loading: false,
                }); */
              }}
              />

                {/* <View
                  style={{
                    paddingLeft: CSS.pixel(20),
                    flexDirection: "row",
                    marginBottom: CSS.pixel(30),
                    marginTop: CSS.pixel(20)
                  }}
                >
                  {this.state.detail && this.state.detail.tags
                    ? this.state.detail.tags.map((item, index) => {
                        return (
                          <View
                            key={index + ""}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              borderRadius: 16,
                              overflow: "hidden",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: CSS.pixel(30),
                              backgroundColor: "#f3f3f3"
                            }}
                          >
                            <Text style={{ fontSize: 12, color: "#999" }}>
                              {item.name}
                            </Text>
                          </View>
                        );
                      })
                    : null}
                </View> */}
              </ScrollView>
            ) : null}
            <TabsButton
              style={{
                position: "absolute",
                bottom: isIphoneX()
                  ? headerOffsetHeight + 5
                  : Platform.OS == "ios" && ReactNative.PixelRatio.get() == 3
                    ? headerHeight + 12
                    : headerHeight + 5,
                left: 0,
                right: 0,
                backgroundColor: "#fff",
                height: 50
              }}
              likeNum={
                this.state.detail.like_num ? this.state.detail.like_num : 0
              }
              useNum={this.state.detail.use_num ? this.state.detail.use_num : 0}
              hasFav={this.state.detail.is_liked}
              hasUse={this.state.detail.is_used}
              id={this.state.detail.id}

              categoryId={this.props.categoryId == 0 ? "0" : this.props.categoryId + ""}
            />
          </Animated.View>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //   user: getUserBaseInfo(state)
}))(StudentShareTab);
