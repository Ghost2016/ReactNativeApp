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
import { CompanyParseScreen, schoolPersonNum } from "../../DataParseScreen";
import defaultStyle from "@styles";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDSafeArea from "../../../../common/SDSafeArea";
import { Toast } from "antd-mobile";
import * as WeChat from "react-native-wechat";
import ConnectWithActions from "../../../../connectWithActions";
import { navLightBox, dismissLightBox } from "../../../../styles";
import ShareButton from "../../../../sd_shareButton/ShareButton";
import GrowGoalList from "@sd_components/GrowGoalList";
import { refreshJobPlanListAction } from "@utils/funcs"
import { navScreen, navRightButton } from "@styles";
import ConfirmLightBoxScreen from "@src/screens/lightBoxScreen/ConfirmLightBoxScreen";
import * as HOSTS from "@src/host";
import QQShare from "../../../../boot/QQShare";

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
const saveIconNor = require("@img/home/home_ico_Collection_nor.png");
const saveIconSel = require("@img/home/home_ico_Collection_sel.png");

// 数据查询职位详情
class JobDetail extends React.Component {
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      jobText: this.props.jobText,
      is_liked: this.props.is_liked,
      id: this.props.id,
      type: this.props.type,
      modal: false
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  onClose = key => () => {
    this.setState({
      [key]: false
    });
  };

  addThisPosition(){
    const jobText = this.props.jobText;
    if(!jobText){
      Toast.fail("请选择选择目标职位！", 0.3)
      return
    }
    //return;

    this.context.refs["_growScreen"].props.actions.postMakeGoalAction({
      //默认写死，目前已经不需要路径规划
      path_id: 1,
      position_name: jobText,
      parent_id: '',
      salary: 0,
      power: 0,
      is_default: true,
      is_valid: true,
      //user: this.props.user.id,
    }, res => {}).then(res => {
      //this.context.refs["_growScreen"].onPressAddPath(res.results, 0);

      refreshJobPlanListAction(this);

      this.context.navigator.popToRoot();
      this.context.refs["_homeScreen"].context.navigator.switchToTab({
          tabIndex: 2
      });

      this.context.refs["_growScreen"].context.navigator.push(
        navScreen("PushScreen", "我的目标", {
          passProps: {
            screen: () => <GrowGoalList selectMode={true} />,
            fullScreen: true,
            header: {
              title: "我的目标",
              //取消默认header，定制黄色header
              //fixed: true,
            }
          },
          //...navRightButton("save_addLearnedCourseBtn", "保存"),
        })
      );
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <CompanyParseScreen ref="_jobref" jobName={this.state.jobText} title={this.props.title? this.props.title : ""} />

        {this.props.isAddTarget ? <View
            style={{
              borderTopWidth: 0,
              borderColor: "#e1e1e1",
              height: 49,
              backgroundColor: sdStyles.SDMainColor,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
              onPress={() => {
                const jobText = this.props.jobText;
                if(!jobText){
                  Toast.fail("请选择选择目标职位！", 0.3)
                  return
                }

                navLightBox("ConfirmLightBoxScreen", {
                  passProps: {
                    title: () => {
                      return (<View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        <Text style={{
                        color: sdStyles.SDFontColorMain,
                        fontSize: CSS.textSize(30)
                      }}>是否确认将“</Text>
                      <View style={{
                        maxWidth: CSS.pixel(220),
                      }}><Text
                       numberOfLines={1}
                       style={{
                        color: sdStyles.SDMainColor,
                        fontSize: CSS.textSize(30)
                      }}>{jobText}</Text></View>
                      <Text style={{
                        color: sdStyles.SDFontColorMain,
                        fontSize: CSS.textSize(30)
                      }}>”设为你的目标职位？</Text>
                      </View>)
                    },
                    onOk: () => {
                      this.addThisPosition()
                    }
                  }
                });

              }}
            >
              <Text style={{
                fontSize: CSS.textSize(32),
                color: sdStyles.SDFontColorMain,
              }}>设为我的目标职位</Text>
            </TouchableOpacity>
          </View> : null}

        {!this.props.isAddTarget ? <View
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
                              this.context.refs['jobDetailDataParse'].setState({
                                isCapture: true
                              }, () => {
                                setTimeout(() => {
                                _this.context.refs["_jobShot"]
                                  .capture()
                                  .then(async uri => {
                                    this.context.refs['jobDetailDataParse'].setState({
                                      isCapture: false
                                    });
                                    // debugger;
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
                                      title: this.props.title
                                      ? this.props.title
                                      : this.state.jobText + "职位就业数据报告",
                                      thumbImage: `${HOSTS.SHARE}/images/logo.png`,
                                      description: `本报告收集了${schoolPersonNum}个学生毕业5年内从事${this.state.jobText}的就业案例，为你全面解析该职位就业情况`,
                                      webpageUrl: `${HOSTS.SHARE}/#/data?pic=${
                                        uploadSaveImg[0].file_name
                                      }`
                                    });
                                  })
                                  .catch(err => {
                                    Toast.hide();
                                    this.context.refs['jobDetailDataParse'].setState({
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
                              this.context.refs['jobDetailDataParse'].setState({
                                isCapture: true
                              }, () => {
                                setTimeout(() => {
                                _this.context.refs["_jobShot"]
                                  .capture()
                                  .then(async uri => {
                                    this.context.refs['jobDetailDataParse'].setState({
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
                                    WeChat.shareToTimeline({
                                      type: "news",
                                      title: this.props.title
                                      ? this.props.title
                                      : this.state.jobText + "职位就业数据报告",
                                      thumbImage: `${HOSTS.SHARE}/images/logo.png`,
                                      description: `本报告收集了${schoolPersonNum}个学生毕业5年内从事${this.state.jobText}的就业案例，为你全面解析该职位就业情况`,
                                      webpageUrl: `${HOSTS.SHARE}/#/data?pic=${
                                        uploadSaveImg[0].file_name
                                      }`
                                    });
                                  })
                                  .catch(err => {
                                    Toast.hide();
                                    this.context.refs['jobDetailDataParse'].setState({
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
                              this.context.refs['jobDetailDataParse'].setState({
                                isCapture: true
                              }, () => {
                                setTimeout(() => {
                                _this.context.refs["_jobShot"]
                                  .capture()
                                  .then(async uri => {
                                    this.context.refs['jobDetailDataParse'].setState({
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
                                      title: this.props.title
                                      ? this.props.title
                                      : this.state.jobText + "职位就业数据报告",
                                      description: `本报告收集了${schoolPersonNum}个学生毕业5年内从事${this.state.jobText}的就业案例，为你全面解析该职位就业情况`,
                                      url: `${HOSTS.SHARE}/#/data?pic=${
                                        uploadSaveImg[0].file_name
                                      }`,
                                      imageUrl: `${HOSTS.SHARE}/images/logo.png`,
                                    });
                                  })
                                  .catch(err => {
                                    Toast.hide();
                                    this.context.refs['jobDetailDataParse'].setState({
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
                            this.context.refs['jobDetailDataParse'].setState({
                              isCapture: true
                            }, () => {
                              setTimeout(() => {
                              _this.context.refs["_jobShot"]
                                .capture()
                                .then(async uri => {
                                  this.context.refs['jobDetailDataParse'].setState({
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
                                    title: this.props.title
                                    ? this.props.title
                                    : this.state.jobText + "职位就业数据报告",
                                    description: `本报告收集了${schoolPersonNum}个学生毕业5年内从事${this.state.jobText}的就业案例，为你全面解析该职位就业情况`,
                                    url: `${HOSTS.SHARE}/#/data?pic=${
                                      uploadSaveImg[0].file_name
                                    }`,
                                    imageUrl: `${HOSTS.SHARE}/images/logo.png`,
                                  });
                                })
                                .catch(err => {
                                  Toast.hide();
                                  this.context.refs['jobDetailDataParse'].setState({
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
        </View> : null}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: state.user,
}))(JobDetail);
