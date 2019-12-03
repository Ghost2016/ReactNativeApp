// 数据查询页面
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  Image,
  Alert
} from "react-native";
import PropTypes from "prop-types";
import { Modal } from "antd-mobile";
import { DomainParseScreen, schoolPersonNum } from "../../DataParseScreen";
import defaultStyle from "@styles";
import { Toast } from "antd-mobile";
import * as WeChat from "react-native-wechat";
import SDSafeArea from "../../../../common/SDSafeArea";
import ConnectWithActions from "../../../../connectWithActions";
import { navLightBox, dismissLightBox } from "../../../../styles";
import ShareButton from "../../../../sd_shareButton/ShareButton";
import * as HOSTS from "@src/host";
import QQShare from "../../../../boot/QQShare";

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
const saveIconNor = require("@img/home/home_ico_Collection_nor.png");
const saveIconSel = require("@img/home/home_ico_Collection_sel.png");
// 数据查询专业
class MajorDetail extends React.Component {
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      majorText: this.props.majorText,
      is_liked: this.props.is_liked,
      id: this.props.id,
      type: this.props.type,
      modal: false
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  onClose = key => () => {
    this.setState({
      [key]: false
    });
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <DomainParseScreen ref="_majorref" degreeName={this.props.degreeName} majorName={this.state.majorText} />
        <View
          style={{
            borderTopWidth: 1,
            borderColor: "#e1e1e1",
            height: 49,
            backgroundColor: "#fff",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
            onPress={() => {
              if (this.state.is_liked === true) {
                // Toast.info("你已经收藏过啦！");
                // return;
                // 进行取消收藏
                this.props.actions.toggleLikeRecordAction(
                  this.state.id,
                  {
                    type: this.state.type
                  },
                  () => {
                    this.setState({
                      is_liked: !this.state.is_liked
                    });
                    if (this.context.refs["g_queryDataTabs"]) {
                      // 移除收藏数据
                      this.context.refs[
                        "g_queryDataTabs"
                      ].state.collectData.splice(
                        this.context.refs[
                          "g_queryDataTabs"
                        ].state.collectData.findIndex(
                          c => c.id == this.state.id
                        ),
                        1
                      );
                    }
                    // 如果是在收藏页面
                    if (this.context.refs["g_collectTab"]) {
                      this.context.refs["g_collectTab"]._onRefreshTab2();
                    }

                    Toast.success("取消成功", 0.2);
                  }
                );
              } else {
                this.props.actions.toggleLikeRecordAction(
                  this.state.id,
                  {
                    type: this.state.type
                  },
                  () => {
                    this.setState({
                      is_liked: !this.state.is_liked
                    });
                    if (this.context.refs["g_queryDataTabs"]) {
                      this.context.refs[
                        "g_queryDataTabs"
                      ].state.collectData.push({
                        id: this.state.id,
                        type: this.state.type
                      });
                    }

                    // 如果是在收藏页面
                    if (this.context.refs["g_collectTab"]) {
                      this.context.refs["g_collectTab"]._onRefreshTab2();
                    }

                    Toast.success("收藏成功", 0.2);
                  }
                );
              }
            }}
          >
            {this.state.is_liked ? (
              <Image source={saveIconSel} />
            ) : (
              <Image source={saveIconNor} />
            )}
          </TouchableOpacity>
          <View style={defaultStyle.singleLine} />
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
            onPress={() => {
              const _this = this;
              navLightBox("LightBoxScreen", {
                passProps: {
                  screen: () => (
                    <ShareButton
                      sessionPress={() => {
                        // 进行微信分享
                        dismissLightBox();
                        WeChat.isWXAppInstalled()
                          .then(installed => {
                            if (installed) {
                              this.context.refs['majorDetailDataParse'].setState({
                                isCapture: true
                              }, () => {
                                setTimeout(() => {
                                  _this.context.refs["_majorShot"]
                                    .capture()
                                    .then(async uri => {
                                      // debugger;
                                      this.context.refs['majorDetailDataParse'].setState({
                                        isCapture: false
                                      });
                                      Toast.loading("正在请求微信", 0);
                                      const uploadSaveImg = await _this.context.refs[
                                        "_shareButton"
                                      ].uploadPic([
                                        {
                                          filename: null,
                                          path: uri
                                        }
                                      ]);
                                      Toast.hide();
                                      WeChat.shareToSession({
                                        type: "news",
                                        title: this.state.majorText + "就业数据报告",
                                        thumbImage: `${HOSTS.SHARE}/images/logo.png`,
                                        description: `本报告收集了${schoolPersonNum}个全国范围毕业5年内${this.state.majorText}专业:${this.props.degreeName}学历学生的就业案例，为你全面解析该专业就业情况`,
                                        webpageUrl: `${HOSTS.SHARE}/#/data?pic=${
                                          uploadSaveImg[0].file_name
                                        }`
                                      });
                                    })
                                    .catch(err => {
                                      Toast.hide();
                                      this.context.refs['majorDetailDataParse'].setState({
                                        isCapture: false
                                      });
                                  });
                                }, 100);
                              })
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
                              this.context.refs['majorDetailDataParse'].setState({
                                isCapture: true
                              }, () => {
                                setTimeout(() => {
                                _this.context.refs["_majorShot"]
                                  .capture()
                                  .then(async uri => {
                                    this.context.refs['majorDetailDataParse'].setState({
                                      isCapture: false
                                    });
                                    Toast.loading("正在请求微信", 0);
                                    // debugger;
                                    const uploadSaveImg = await _this.context.refs[
                                      "_shareButton"
                                    ].uploadPic([
                                      {
                                        filename: null,
                                        path: uri
                                      }
                                    ]);
                                    Toast.hide();
                                    WeChat.shareToTimeline({
                                      type: "news",
                                      title: this.state.majorText + "就业数据报告",
                                      thumbImage: `${HOSTS.SHARE}/images/logo.png`,
                                      description: `本报告收集了${schoolPersonNum}个全国范围毕业5年内${this.state.majorText}专业:${this.props.degreeName}学历学生的就业案例，为你全面解析该专业就业情况`,
                                      webpageUrl: `${HOSTS.SHARE}/#/data?pic=${
                                        uploadSaveImg[0].file_name
                                      }`
                                    });
                                  })
                                  .catch(err => {
                                    Toast.hide();
                                    this.context.refs['majorDetailDataParse'].setState({
                                      isCapture: false
                                    });
                                  });
                                }, 100);
                              })
                            } else {
                              Alert.alert("微信未安装");
                            }
                          })
                          .catch(err => {
                            Alert.alert("err:" + err);
                          });
                      }}

                      qqSessionPress={() => {
                        dismissLightBox();
                        QQShare.isQQInstalled()
                          .then(installed => {
                            if (installed) {
                              this.context.refs['majorDetailDataParse'].setState({
                                isCapture: true
                              }, () => {
                                setTimeout(() => {
                                _this.context.refs["_majorShot"]
                                  .capture()
                                  .then(async uri => {
                                    this.context.refs['majorDetailDataParse'].setState({
                                      isCapture: false
                                    });
                                    Toast.loading("正在请求QQ", 0);
                                    const uploadSaveImg = await _this.context.refs[
                                      "_shareButton"
                                    ].uploadPic([
                                      {
                                        filename: null,
                                        path: uri
                                      }
                                    ]);
                                    Toast.hide();
                                    QQShare.shareToQQ({
                                      type: "news",
                                      title: this.state.majorText + "就业数据报告",
                                      description: `本报告收集了${schoolPersonNum}个全国范围毕业5年内${this.state.majorText}专业:${this.props.degreeName}学历学生的就业案例，为你全面解析该专业就业情况`,
                                      url: `${HOSTS.SHARE}/#/data?pic=${
                                        uploadSaveImg[0].file_name
                                      }`,
                                      imageUrl: `${HOSTS.SHARE}/images/logo.png`,
                                    });
                                  })
                                  .catch(err => {
                                    Toast.hide();
                                    this.context.refs['majorDetailDataParse'].setState({
                                      isCapture: false
                                    });
                                  });
                                }, 100);
                              })
                            } else {
                              Alert.alert("QQ未安装");
                            }
                          })
                          .catch(err => {
                            Alert.alert("err:" + err);
                          });
                      }}

                      qqTimeLinePress={() => {
                        dismissLightBox();
                        QQShare.isQQInstalled()
                        .then(installed => {
                          if (installed) {
                            this.context.refs['majorDetailDataParse'].setState({
                              isCapture: true
                            }, () => {
                              setTimeout(() => {
                              _this.context.refs["_majorShot"]
                                .capture()
                                .then(async uri => {
                                  this.context.refs['majorDetailDataParse'].setState({
                                    isCapture: false
                                  });
                                  Toast.loading("正在请求QQ", 0);
                                  const uploadSaveImg = await _this.context.refs[
                                    "_shareButton"
                                  ].uploadPic([
                                    {
                                      filename: null,
                                      path: uri
                                    }
                                  ]);
                                  Toast.hide();
                                  QQShare.shareToQZone({
                                    type: "news",
                                    title: this.state.majorText + "专业数据报告",
                                    description: `本报告收集了${schoolPersonNum}个全国范围毕业5年内${this.state.majorText}专业:${this.props.degreeName}学历学生的就业案例，为你全面解析该专业就业情况`,
                                    url: `${HOSTS.SHARE}/#/data?pic=${
                                      uploadSaveImg[0].file_name
                                    }`,
                                    imageUrl: `${HOSTS.SHARE}/images/logo.png`,
                                  });
                                })
                                .catch(err => {
                                  Toast.hide();
                                  this.context.refs['majorDetailDataParse'].setState({
                                    isCapture: false
                                  });
                                });
                              }, 100);
                            })
                          } else {
                            Alert.alert("QQ未安装");
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
            }}
          >
            <Image source={require("@img/home/home_ico_share02.png")} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(MajorDetail);
