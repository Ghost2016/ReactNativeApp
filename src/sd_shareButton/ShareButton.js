/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  CameraRoll
} from "react-native";
import * as sdStyles from "@styles";
import { CSS } from "../common/SDCSS";
import PropTypes from "prop-types";
import { Toast } from "antd-mobile";
import * as WeChat from "react-native-wechat";
import { SDMainColor, dismissLightBox, navScreen, navLightBox } from "../styles";
import connectWithActions from "../connectWithActions";
import { getUserBaseInfo } from "../users/usersSelector";
import SDTouchOpacity from "../common/SDTouchOpacity";
import QQShare from "../boot/QQShare";
import config from "../config";
import * as HOSTS from "@src/host";
import SendToEmailLightBox from "../screens/lightBoxScreen/SendToEmailLightBox";
// import { StyleSheet } from 'react-native';

let wHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    display: "none",
    height: wHeight - 60,
    // height: "100%",
    width: Dimensions.get("window").width,
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 9998
  },
  message: {
    color: sdStyles.SDFontColorMain,
    fontSize: CSS.textSize(30)
  },
  shareItem: {
    height: CSS.pixel(180),
    justifyContent: "center",
    alignItems: "center"
  }
});

type Props = {
  // scoreNum: number // 得分
  needSavePic: boolean,
  timeLineOptions: ?object,
  sessionOptions: ?object
};

class ShareButton extends PureComponent<Props> {
  props: Props;
  constructor(props) {
    super(props);
    // this.fullWidth = Dimensions.get("window").width - 2 * 60;
    // this.state = {
    //   display: "none",
    //   maskTopOffset: new Animated.Value(Dimensions.get("window").height), // 宽度初始值设为0
    //   bottomGroupOffset: new Animated.Value(-160)
    // };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  show() {}
  hide() {
    if (this.props.onClose) {
      this.props.onClose();
    } else {
      dismissLightBox();
    }
  }
  componentWillMount() {
    if (this.props.needSavePic == true || this.props.sessionPress || this.props.timeLinePress) {
      this.props.actions.getUploadTokenAction({
        isPrivate: false
      });
    }
  }
  componentDidMount() {
    this.context.refs['_shareButton'] = this;
  }
  onPressShareTimeLine(options) {
    // Alert.alert("22");
    if (this.props.trackTimeline) {
      // 隐藏不显示项
      if (this.context.refs["_trackRecord"]) {
        this.context.refs["_trackRecord"].setState(
          {
            isSavePic: true
          },
          () => {
            // uri
            dismissLightBox();
            Toast.loading("正在生成图片", 0);
            setTimeout(() => {
              if (this.context.refs["g_viewShot"]) {
                this.context.refs["g_viewShot"]
                  .capture()
                  .then(async uri => {
                    const uploadSaveImg = await this.uploadPic([
                      {
                        filename: null,
                        path: uri
                      }
                    ]);
                    // 打开微信分享
                    Toast.success("生成成功");
                    this.context.refs["_trackRecord"].setState({
                      isSavePic: false
                    });
                    let _this = this;
                    // 进行微信分享
                    WeChat.isWXAppInstalled()
                    .then(installed => {
                      if (installed) {
                        WeChat.shareToTimeline({
                          type: "imageUrl",
                          description:
                            "来自职么开门的" +
                            _this.props.user.name +
                            "履历分享",
                          imageUrl: uploadSaveImg
                            ? uploadSaveImg[0].url
                            : ""
                        });
                      } else {
                        Alert.alert("微信未安装");
                      }
                    })
                    .catch(err => {
                      Alert.alert("err:" + err);
                    });
                  }).catch(err => {
                    Toast.hide()
                  })
              }
            }, 1500);
          }
        );
      }
      return;
    }
    WeChat.isWXAppInstalled()
      .then(installed => {
        if (installed) {
          //分享记录
          if (typeof this.props.onShareLog == "function") {
            this.props.onShareLog();
          }
          if (this.props.onClose) {
            this.props.onClose();
          } else {
            dismissLightBox();
          }
          WeChat.shareToTimeline({
            type: "text",
            description: "share word file to chat session",
            ...options
          });
        } else {
          dismissLightBox();
          Alert.alert("微信未安装");
        }
      })
      .catch(err => {
        Alert.alert("err:" + err);
      });
  }

  onPressShareSession(options) {
    // Alert.alert("11");

    if (this.props.trackSession) {
      // 隐藏不显示项
      if (this.context.refs["_trackRecord"]) {
        this.context.refs["_trackRecord"].setState(
          {
            isSavePic: true
          },
          () => {
            // uri
            dismissLightBox();
            Toast.loading("正在生成图片", 0);
            setTimeout(() => {
              if (this.context.refs["g_viewShot"]) {
                this.context.refs["g_viewShot"]
                  .capture()
                  .then(async uri => {
                    const uploadSaveImg = await this.uploadPic([
                      {
                        filename: null,
                        path: uri
                      }
                    ]);
                    // 打开微信分享
                    Toast.success("生成成功");
                    this.context.refs["_trackRecord"].setState({
                      isSavePic: false
                    });
                    let _this = this;
                    // 进行微信分享
                    WeChat.isWXAppInstalled()
                    .then(installed => {
                      if (installed) {
                        WeChat.shareToSession({
                          type: "imageUrl",
                          title: "来自职么开门的" +
                          _this.props.user.name +
                          "履历分享",
                          description:
                            "来自职么开门的" +
                            _this.props.user.name +
                            "履历分享",
                          imageUrl: uploadSaveImg
                            ? uploadSaveImg[0].url
                            : ""
                        });
                      } else {
                        Alert.alert("微信未安装");
                      }
                    })
                    .catch(err => {
                      Alert.alert("err:" + err);
                    });
                  }).catch(err => {
                    Toast.hide()
                  })
              }
            }, 1500);
          }
        );
      }
      return;
    }
    WeChat.isWXAppInstalled()
      .then(installed => {
        if (installed) {
          //分享记录
          if (typeof this.props.onShareLog == "function") {
            this.props.onShareLog();
          }
          if (this.props.onClose) {
            this.props.onClose();
          } else {
            dismissLightBox();
          }
          WeChat.shareToSession({
            type: "text",
            description: "share word file to chat session",
            ...options
          });
        } else {
          Alert.alert("微信未安装");
        }
      })
      .catch(err => {
        Alert.alert("err:" + err);
      });
  }

  onPressQQSessionLine(options) {
    //debugger

    options = options || {};
    if (this.props.trackSession) {
      // 隐藏不显示项
      if (this.context.refs["_trackRecord"]) {
        this.context.refs["_trackRecord"].setState(
          {
            isSavePic: true
          },
          () => {
            // uri
            dismissLightBox();
            Toast.loading("正在生成图片", 0);
            setTimeout(() => {
              if (this.context.refs["g_viewShot"]) {
                this.context.refs["g_viewShot"]
                  .capture()
                  .then(async uri => {
                    const uploadSaveImg = await this.uploadPic([
                      {
                        filename: null,
                        path: uri
                      }
                    ]);
                    // 打开微信分享
                    Toast.success("生成成功");
                    this.context.refs["_trackRecord"].setState({
                      isSavePic: false
                    });
                    let _this = this;
                    // 进行qq分享
                    QQShare.isQQInstalled().then(installed => {
                      if(installed) {
                        let matchId = uploadSaveImg[0].url.match(/\.com\/([\s\S]+)\.JPG/);
                        QQShare.shareToQQ({
                          type: "news",
                          title: "来自职么开门的" +
                          _this.props.user.name +
                          "履历分享",
                          description:
                            "来自职么开门的" +
                            _this.props.user.name +
                            "履历分享",
                          url: `${HOSTS.SHARE}/?from=singlemessage#/imgprev?id=${
                            matchId[1]
                          }`,
                          imageUrl: `${HOSTS.SHARE}/images/logo.png`,
                        })
                      } else {
                        Alert.alert("QQ未安装");
                      }
                    }).catch(err => {
                      //console.warn(err);
                    })
                    // WeChat.isWXAppInstalled()
                    // .then(installed => {
                    //   if (installed) {
                    //     WeChat.shareToSession({
                    //       type: "imageUrl",
                    //       title: "来自职么开门的" +
                    //       _this.props.user.name +
                    //       "履历分享",
                    //       description:
                    //         "来自职么开门的" +
                    //         _this.props.user.name +
                    //         "履历分享",
                    //       imageUrl: uploadSaveImg
                    //         ? uploadSaveImg[0].url
                    //         : ""
                    //     });
                    //   } else {
                    //     Alert.alert("微信未安装");
                    //   }
                    // })
                    // .catch(err => {
                    //   Alert.alert("err:" + err);
                    // });
                  }).catch(err => {
                    Toast.hide()
                  })
              }
            }, 1500);
          }
        );
      }
      return;
    }

    QQShare.isQQInstalled().then((installed) => {

      // console.warn(installed)
      if(installed) {
        dismissLightBox();
        //分享记录
        if (typeof this.props.onShareLog == "function") {
          this.props.onShareLog();
        }
        QQShare.shareToQQ({
          type: "news",
          title: "qq分享测试",
          url: `${HOSTS.SHARE}/?from=singlemessage#/`,
          description: "测试",
          imageUrl: `${HOSTS.SHARE}/images/logo.png`,
          ...options,
          url: encodeURI(options.url || "")
        })
      } else {
        Alert.alert("QQ未安装");
      }
    }).catch(error => {

    });

    return;
  }

  onPressQQShareTimeLine(options) {
    options = options || {};
    QQShare.isQQInstalled().then((installed) => {
      // console.warn(installed)
      if(installed) {
        dismissLightBox();
        //分享记录
        if (typeof this.props.onShareLog == "function") {
          this.props.onShareLog();
        }
        QQShare.shareToQZone({
          type: "news",
          title: "qq分享测试",
          url: `${HOSTS.SHARE}/?from=singlemessage#/`,
          description: "测试",
          imageUrl: `${HOSTS.SHARE}/images/logo.png`,
          ...options,
          url: encodeURI(options.url || "")
        });
      } else {
        Alert.alert("QQ未安装");
      }
    }).catch(error => {

    });
    return;
  }

  // 上传图片
  async uploadPic(images) {
    let resultUpload = [];
    for (let i = 0; i < images.length; i++) {
      const element = images[i];
      let data = new FormData();
      // let picName = element.name
      //   ? element.name.slice(0, element.name.lastIndexOf(".")) +
      //     new Date().getTime() +
      //     ".JPG"
      //   : new Date().getTime() + ".JPG";
      let picName = element.filename
        ? element.filename.slice(0, element.filename.lastIndexOf(".")) +
          new Date().getTime() +
          ".JPG"
        : new Date().getTime() + ".JPG";

      data.append("token", this.props.uploadToken);
      data.append("file", {
        uri: element.path,
        name: picName,
        type: "image/jpeg"
      });
      data.append("key", picName);

      data.append("x:userid", this.props.user.id);
      data.append("x:usage", "post");
      const result = await this.uploadItem(data);
      // console.log(result);
      if (!result.error) {
        if (result.status == "ok") {
          resultUpload.push(result);
        }
      }
    }
    return resultUpload;
  }

  uploadItem(data) {
    return new Promise((reso, rej) => {
      this.props.actions.uploadFileAction(data, res => {
        reso(res);
      });
    });
  }

  render() {
    return (
      <View
        style={
          !this.props.modal
            ? {
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#fff",
                height: Dimensions.get("window").height / 2 - 120,
                borderRadius: 8,
              }
            : Platform.OS == "ios"
              ? {
                  height: Dimensions.get("window").height / 2 - 120,
                  backgroundColor: "#fff",
                  borderRadius: 8,
                }
              : {
                  height: Dimensions.get("window").height / 2 - 120,
                  backgroundColor: "#fff",
                  borderRadius: 8,
                }
        }
      >
        <View
          style={{
            height: CSS.pixel(88, true),
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderBottomColor: sdStyles.SDBGColorGrey,
            borderBottomWidth: 1
          }}
        >
          <Text style={styles.message}>分享至</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "center",
            padding: CSS.pixel(30),
            paddingTop: 0,
            alignItems: "center"
          }}
        >
          {this.props.needSavePic ? (
            <SDTouchOpacity
              style={[styles.shareItem, { marginRight: CSS.pixel(94) }]}
              onPress={() => {
                // 隐藏不显示项
                if (this.context.refs["_trackRecord"]) {
                  this.context.refs["_trackRecord"].setState(
                    {
                      isSavePic: true
                    },
                    () => {
                      // uri
                      dismissLightBox();
                      Toast.loading("正在生成图片", 0);
                      setTimeout(() => {
                        if (this.context.refs["g_viewShot"]) {
                          this.context.refs["g_viewShot"]
                            .capture()
                            .then(async uri => {
                              const uploadSaveImg = await this.uploadPic([
                                {
                                  filename: null,
                                  path: uri
                                }
                              ]);
                              // 打开微信分享
                              Toast.success("生成成功");
                              this.context.refs["_trackRecord"].setState({
                                isSavePic: false
                              });
                              let _this = this;
                              // 保存图片到本地
                              if (uploadSaveImg && uploadSaveImg[0].url) {
                                let promise = CameraRoll.saveToCameraRoll(
                                  Platform.OS == "android"
                                    ? uri
                                    : uploadSaveImg[0].url
                                , "photo");
                                promise
                                  .then(function(result) {
                                    Toast.success("保存成功");
                                    // alert('保存成功！地址如下：\n' + result);

                                    Alert.alert(
                                      "",
                                      "是否使用微信分享此图片？",
                                      [
                                        {
                                          text: "取消",
                                          onPress: () =>
                                            console.log("Cancel Pressed"),
                                          style: "cancel"
                                        },
                                        {
                                          text: "分享",
                                          onPress: async () => {
                                            // 进行微信分享
                                            WeChat.isWXAppInstalled()
                                              .then(installed => {
                                                if (installed) {
                                                  WeChat.shareToTimeline({
                                                    type: "imageUrl",
                                                    description:
                                                      "来自职么开门的" +
                                                      _this.props.user.name +
                                                      "履历分享",
                                                    imageUrl: uploadSaveImg
                                                      ? uploadSaveImg[0].url
                                                      : ""
                                                  });
                                                } else {
                                                  Alert.alert("微信未安装");
                                                }
                                              })
                                              .catch(err => {
                                                Alert.alert("err:" + err);
                                              });
                                          }
                                        }
                                      ],
                                      { cancelable: false }
                                    );
                                  })
                                  .catch(function(error) {
                                    Toast.fail("保存失败");
                                    // alert('保存失败！\n' + error);
                                  });
                              }
                            }).catch(err => {
                              Toast.hide()
                            })
                        }
                      }, 1500);
                    }
                  );
                }
              }}
            >
              <Image
                source={require("@img/my/TrackRecord/mine_Resume_ico_picture.png")}
                resizeMode="stretch"
              />
              <Text style={{ marginTop: CSS.pixel(15), fontSize: CSS.textSize(24), color: sdStyles.SDFontColorSubtitle, }}>
                保存图片
              </Text>
            </SDTouchOpacity>
          ) : null}
          <SDTouchOpacity
            style={[styles.shareItem]}
            onPress={this.props.sessionPress ? this.props.sessionPress: this.onPressShareSession.bind(
              this,
              this.props.sessionOptions || {}
            )}
          >
            <Image
              source={require("@img/home/home_ico_WeChat01.png")}
              resizeMode="stretch"
            />
            <Text style={{ marginTop: CSS.pixel(15), fontSize: CSS.textSize(24), color: sdStyles.SDFontColorSubtitle }}>
              微信好友
            </Text>
          </SDTouchOpacity>
          {this.props.notNeedTimeLine ? null : (
          <SDTouchOpacity
            style={[styles.shareItem, { marginLeft: CSS.pixel(94) }]}
            onPress={this.props.timeLinePress ? this.props.timeLinePress: this.onPressShareTimeLine.bind(
              this,
              this.props.timeLineOptions || {}
            )}
          >
            <Image
              source={require("@img/home/home_ico_PengYouQuan01.png")}
              resizeMode="stretch"
            />
            <Text style={{ marginTop: CSS.pixel(15), fontSize: CSS.textSize(24), color: sdStyles.SDFontColorSubtitle }}>
              朋友圈
            </Text>
          </SDTouchOpacity>)}
          <SDTouchOpacity
            style={[styles.shareItem, { marginLeft: CSS.pixel(94) }]}
            onPress={this.props.qqSessionPress ? this.props.qqSessionPress: this.onPressQQSessionLine.bind(
              this,
              this.props.qqSessionOptions || {}
            )}
          >
            <Image
              source={require("@img/home_ico_qq.png")}
              resizeMode="stretch"
            />
            <Text style={{top: 3, marginTop: CSS.pixel(15), fontSize: CSS.textSize(24), color: sdStyles.SDFontColorSubtitle }}>
              QQ
            </Text>
          </SDTouchOpacity>

          {this.props.notNeedQQTimeLine ? null : <SDTouchOpacity
            style={[styles.shareItem, { marginLeft: CSS.pixel(94) }]}
            onPress={this.props.qqTimeLinePress ? this.props.qqTimeLinePress: this.onPressQQShareTimeLine.bind(
              this,
              this.props.qqTimeLineOptions || {}
            )}
          >
            <Image
              source={require("@img/home_ico_qzone.png")}
              resizeMode="stretch"
            />
            <Text style={{top: 3, marginTop: CSS.pixel(15), fontSize: CSS.textSize(24), color: sdStyles.SDFontColorSubtitle }}>
              QQ空间
            </Text>
          </SDTouchOpacity>}

          {this.props.needSendToEmail ? (
            <SDTouchOpacity
              style={[styles.shareItem, { marginLeft: CSS.pixel(94) }]}
              onPress={() => {
                dismissLightBox();

                // 隐藏不显示项
                if (this.context.refs["_trackRecord"]) {
                  this.context.refs["_trackRecord"].setState(
                    {
                      isSavePic: true
                    },
                    () => {
                      // uri
                      // dismissLightBox();
                      Toast.loading("正在生成图片", 0);
                      setTimeout(() => {
                        if (this.context.refs["g_viewShot"]) {
                          this.context.refs["g_viewShot"]
                            .capture()
                            .then(async uri => {
                              const uploadSaveImg = await this.uploadPic([
                                {
                                  filename: null,
                                  path: uri
                                }
                              ]);
                              // 打开微信分享
                              Toast.success("生成成功");
                              this.context.refs["_trackRecord"].setState({
                                isSavePic: false
                              });
                              let _this = this;
                              // 保存图片到本地
                              // 获取到上传到七牛云的图片url
                              // uploadSaveImg[0].url

                              navLightBox("LightBoxScreen", {
                                passProps: {
                                  screen: () => <SendToEmailLightBox imgUrl={uploadSaveImg[0].url} />
                                }
                              });
                            }).catch(err => {
                              Toast.hide()
                            })
                        }
                      }, 1500);
                    }
                  );
                }
              }}
            >
              <Image
                source={require("@img/my/TrackRecord/share_ico_email.png")}
                resizeMode="stretch"
              />
              <Text style={{top: 7, marginTop: CSS.pixel(15), fontSize: CSS.textSize(24), color: sdStyles.SDFontColorSubtitle, }}>
                转发至邮箱
              </Text>
            </SDTouchOpacity>
          ) : null}

        </View>
        <View
          style={{
            height: CSS.pixel(80, true),
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderTopColor: sdStyles.SDBGColorGrey,
            borderTopWidth: 1,
          }}
        ></View>
        <SDTouchOpacity
          style={{
            width: '100%',
            height: CSS.pixel(80, true),
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderTopColor: sdStyles.SDBGColorGrey,
            borderTopWidth: 1,
            borderWidth: 0,
            borderColor: '#f00',
            zIndex: 10,
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#fff',
          }}
          onPress={this.hide.bind(this)}
        >
          <View
            style={{
              justifyContent: "center"
            }}
          >
            <Text style={{ color: sdStyles.SDFontColorMain, fontSize: CSS.textSize(32) }}>
              取消
            </Text>
          </View>
        </SDTouchOpacity>
      </View>
    );
  }
}

export default connectWithActions((state, props) => ({
  user: getUserBaseInfo(state),
  uploadToken: state.uploadToken
}))(ShareButton);
