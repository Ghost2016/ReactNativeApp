// 数据查询页面
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  WebView
  //ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
import * as WeChat from "react-native-wechat";
import ConnectWithActions from "@src/connectWithActions";
import TabsButton from "../../../sd_directInfoDetail/tabs/TabsButton";
import ShareButton from "../../../sd_shareButton/ShareButton";
import SDLoading from "@sd_components/SDLoading";
import { CSS } from "../../../common/SDCSS";
//import HTMLView from 'react-native-htmlview';
import { navLightBox, dismissLightBox } from "../../../styles";
import { ftime } from "../../../utils/funcs";
import * as HOSTS from "@src/host";
import QQShare from "../../../boot/QQShare";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  titleBox: {
    padding: 10
  },
  title: {
    fontSize: 18,
    color: "#333"
  },
  subTitle: {
    fontSize: 12,
    color: "#c5c5c5"
  }
});

const htmlStyle = StyleSheet.create({
  p: {
    color: '#666',
    lineHeight: CSS.pixel(40)
  }
});

// 资讯直击详情屏幕
class DirectInfoDetailScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      webviewHeight: 0
    };
  }

  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentDidMount() {
    this.props.actions.readItAction({ id: this.props.id });
    this.props.actions.getNewsDetailAction({ id: this.props.id }).then(res => {
      if (res.status == "ok") {
        this.setState({
          //loading: false,
          data: res.results
        });
      }
    }).catch(err => {});

    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "shareNewsBtn"
    );
  }

  componentWillUnmount() {
    // Todo
    // 更新是否点赞或者收藏数据
    if (this.context.refs["_studentShare_"+this.props.categoryId]) {
      this.context.refs["_studentShare_"+this.props.categoryId].reloadData(
        this.context.refs["_studentShare_"+this.props.categoryId].state.newsList.length
      );
    } else {
      if (this.context.refs["g_collectTab"]) {
        this.context.refs["g_collectTab"]._onRefreshTab1();
      }
    }
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "shareNewsBtn") {
        navLightBox("LightBoxScreen", {
          passProps: {
            screen: () => (
              <ShareButton
                onShareLog={()=>{
                  this.props.actions.logShareNewsAction({ id: this.props.id })
                    .then(res => {})
                    .catch(err => {});
                }}
                qqTimeLinePress={() => {
                  dismissLightBox();
                  QQShare.isQQInstalled().then(installed => {
                    if(installed) {
                      QQShare.shareToQZone({
                        type: "news",
                        title: this.state.data.title,
                        description: this.state.data.content,
                        imageUrl: this.state.data && this.state.data.image ? this.state.data.image.url : `${HOSTS.SHARE}/images/logo.png`,
                        url: `${HOSTS.SHARE}/?from=singlemessage#/post?newsid=${
                          this.props.id
                        }`,
                      })
                    } else {
                      Alert.alert("QQ未安装");
                    }
                  })
                }}
                qqSessionPress={() => {
                  dismissLightBox();
                  QQShare.isQQInstalled().then(installed => {
                    if(installed) {
                      QQShare.shareToQQ({
                        type: "news",
                        title: this.state.data.title,
                        description: this.state.data.content,
                        imageUrl: this.state.data && this.state.data.image ? this.state.data.image.url : `${HOSTS.SHARE}/images/logo.png`,
                        url: `${HOSTS.SHARE}/?from=singlemessage#/post?newsid=${
                          this.props.id
                        }`
                      })
                    } else {
                      Alert.alert("QQ未安装");
                    }
                  })
                }}
                sessionPress={() => {
                  dismissLightBox();
                  // 进行微信分享
                  WeChat.isWXAppInstalled()
                    .then(installed => {
                      if (installed) {
                        WeChat.shareToSession({
                          type: "news",
                          title: this.state.data.title,
                          description: this.state.data.content,
                          thumbImage: this.state.data && this.state.data.image ? this.state.data.image.url : `${HOSTS.SHARE}/images/logo.png`,
                          webpageUrl: `${HOSTS.SHARE}/#/post?newsid=${
                            this.props.id
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
                          title: this.state.data.title,
                          description: this.state.data.content,
                          thumbImage: this.state.data && this.state.data.image ? this.state.data.image.url : `${HOSTS.SHARE}/images/logo.png`,
                          webpageUrl: `${HOSTS.SHARE}/#/post?newsid=${
                            this.props.id
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
              />
            )
          }
        });
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
        onLayout={e => {
          this.setState({
            webviewHeight: e.nativeEvent.layout.height
          })
        }}
        style={{ backgroundColor: "#fff" }}>
          {this.state.loading ? <SDLoading /> : null}
            <View>
              {/* <View style={[styles.titleBox]}>
                <View style={{ flexWrap: "wrap" }}>
                  <Text style={styles.title}>{this.state.data.title}</Text>
                </View>
                <View style={{ marginTop: CSS.pixel(30) }}>
                  <Text style={styles.subTitle}>
                    {this.state.data.created_time
                      ? ftime(this.state.data.created_time)
                      : ""}
                  </Text>
                </View>
              </View> */}
              <WebView ref={'webview'} automaticallyAdjustContentInsets={false} source={{uri:`${HOSTS.SHARE}/#/post2?newsid=${this.props.id}`}} style={{
                //flex: 1,
                width: '100%',
                height: this.state.webviewHeight,
                borderWidth: 0,
                borderColor:'#f00',
              }}
                onLoadEnd={()=>{
                  this.setState({
                    loading: false,
                  });
                }}
              />
              {/* <Html
                body={this.state.data.content_html.replace(/[\n]/gi, "")}
              /> */}
              {/* <View style={{paddingHorizontal: CSS.pixel(20)}}>
                <HTMLView stylesheet={htmlStyle} value={`<p>${this.state.data.content_html}</p>`}>
                </HTMLView>
              </View> */}

              {/* <View
                style={{
                  paddingLeft: CSS.pixel(20),
                  flexDirection: "row",
                  marginBottom: CSS.pixel(30),
                  marginTop: CSS.pixel(20)
                }}
              >
                {this.state.data && this.state.data.tags
                  ? this.state.data.tags.map((item, index) => {
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
            </View>

        </ScrollView>
        <TabsButton
          categoryId={this.props.categoryId}
          likeNum={this.state.data.like_num ? this.state.data.like_num : 0}
          useNum={this.state.data.use_num ? this.state.data.use_num : 0}
          hasFav={this.state.data.is_liked}
          hasUse={this.state.data.is_used}
          id={this.props.id}
        />
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(
  DirectInfoDetailScreen
);
