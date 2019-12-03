import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image
} from "react-native";
import {Toast} from 'antd-mobile';
import PropTypes from "prop-types";
import connectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";
import SDPullScrollView, {
  RefreshState
} from "../../../common/SDPullScrollView";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor, navScreen, navLightBox, dismissLightBox } from "../../../styles";
import TrackRecordScreen from "../trackRecord/TrackRecordScreen";
import LiveCourseDetailScreen from "../liveCourse/LiveCourseDetailScreen";
import MoreCommentScreen from "../liveCourse/MoreCommentScreen";
import MyCourseCommentScreen from "../liveCourse/MyCourseCommentScreen";
import { ConfirmLightBoxScreen } from "../../lightBoxScreen/ConfirmLightBoxScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  }
});

// 我的-消息详情
class MessageTypeListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],

      currState: RefreshState.Idle,

      peerSize: 10,
      currPage: 1,
      currReadList: [],

      removeList: [],
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.refreshHeader();
  }

  fetchData(params = {}, reset = false) {
    this.props.actions
      .getNotifyDetailAction(params)
      .then(res => {
        this.state.data = reset
          ? [].concat(res.results)
          : [].concat(this.state.data).concat(res.results);
        if ((res.count) <= this.state.data.length) {
          this.setState({
            currState: RefreshState.NoMoreData,
            peerSize: res.per_page,
            currPage: res.current_page
          });
        } else {
          this.setState({
            currState: RefreshState.Idle,
            peerSize: res.per_page,
            currPage: res.current_page
          });
        }
      })
      .catch(err => {});
  }

  refreshFooter() {
    if (this.state.currState == RefreshState.NoMoreData || this.state.currState == RefreshState.HeaderRefreshing || this.state.currState == RefreshState.FooterRefreshing) {
      return;
    }
    this.setState(
      {
        currState: RefreshState.FooterRefreshing
      },
      () => {
        this.fetchData({
          page: this.state.currPage + 1,
          size: this.state.peerSize,
          type_title: this.props.notifyType
        });
      }
    );
  }

  refreshHeader() {
    if (this.state.currState == RefreshState.HeaderRefreshing || this.state.currState == RefreshState.FooterRefreshing) {
      return;
    }
    this.setState(
      {
        currState: RefreshState.HeaderRefreshing
      },
      () => {
        this.fetchData(
          {
            page: 1,
            size: this.state.peerSize,
            type_title: this.props.notifyType
          },
          true
        );
      }
    );
  }

  componentWillUnmount() {

    // 移除所有待删除数据
    Promise.all([
      this.state.removeList.map((c) => {
        return this.props.actions.removeNotifyAction({
          id: c
        });
      }),
      this.props.actions.getNotifyUnreadCountAction(),
      this.props.actions.getNotifyTypeAciton()
    ]).then(value => {

    }).catch(err => {

    });
  }

  // 成绩导入
  renderTypeImportMessage(item) {
    // if (item.status != true) {
    //   this.props.actions.readNotifyAction({
    //     id: item.id
    //   }).then(res => {}).catch(err => {});
    // }
    return (
      <View style={{ paddingHorizontal: CSS.pixel(30) }} key={item.id}>
        <SDTouchOpacity
          onLongPress={() => {
            navLightBox("ConfirmLightBoxScreen", {
              passProps: {
                title: "你确定要删除此通知",
                onOk: () => {
                  Toast.success("删除成功", 1);
                  this.setState({
                    removeList: [].concat(this.state.removeList).concat([item.id])
                  })
                }
              }
            });
          }}

          onPress={() => {
            // 读
            this.props.actions.readNotifyAction({
              id: item.id
            }).then(res => {}).catch(err => {});
            // 进入我的履历
            // 并且进行定位
            this.setState({
              currReadList: [].concat(this.state.currReadList).concat([item.id])
            });
            this.context.navigator.push(navScreen("PushScreen", "我的履历", {
              passProps: {
                screen: () => <TrackRecordScreen skip={"course_sync"}/>,
                fullScreen: true,
                noScrollView: true,
                header: {
                  title: "我的履历"
                },
                navigatorButtons: {
                  rightButtons: [
                    {
                      icon: () => (
                        <Image source={require("@img/salary/home_ico_share02.png")} />
                      ),
                      id: "track_share"
                    }
                  ]
                }
              }
            }))
          }}
          
          style={{
            flex: 1,
            borderRadius: CSS.pixel(10),
            paddingVertical: CSS.pixel(20),
            backgroundColor: "#fff",
            marginTop: CSS.pixel(20),
            flexDirection: "row"
          }}
        >
          <View style={{ width: CSS.pixel(104), alignItems: "center" }}>
            <Image
              style={{
                width: CSS.pixel(54),
                height: CSS.pixel(54),
                left: CSS.pixel(10)
              }}
              resizeMode="stretch"
              source={require("@img/my/notifyType/mine_ico_achievement.png")}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                height: CSS.pixel(64),
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
                paddingTop: CSS.pixel(6)
              }}
            >
              <View style={{ marginRight: CSS.pixel(4) }}>
                <Text>在校成绩导入</Text>
              </View>
              <View style={{ flex: 1 }}>
              {item.is_read != true && this.state.currReadList.indexOf(item.id) < 0? 
              <View
                  style={{
                    backgroundColor: "#F84038",
                    height: CSS.pixel(14),
                    width: CSS.pixel(14),
                    borderRadius: CSS.pixel(7)
                  }}
                />: null
              }
              </View>
              <View style={{ marginRight: CSS.pixel(30) }}>
                <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                  {item.created_time.slice(0, 16).replace(/-/g, "/").replace("T", " ")}
                </Text>
              </View>
            </View>
            <View
              style={{ marginTop: CSS.pixel(20), paddingRight: CSS.pixel(30) }}
            >
              <Text
                numberOfLines={3}
                style={{ color: "#999", fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}
              >
                {item.content}
              </Text>
            </View>
            {
              item.status && 
              <View
                style={{
                  marginTop: CSS.pixel(20),
                  alignItems: "flex-end",
                  paddingRight: CSS.pixel(30)
                }}
              >
                <View>
                  <Text
                    style={{ color: SDMainColor, fontSize: CSS.textSize(24) }}
                  >
                    查看详情>>
                  </Text>
                </View>
              </View>
            }
          </View>
        </SDTouchOpacity>
      </View>
    );
  }

  // 教育经历认证
  renderTypeEduMessage(item) {
    this.props.actions.readNotifyAction({
      id: item.id
    }).then(res => {}).catch(err => {});
    return (
      <View style={{ paddingHorizontal: CSS.pixel(30) }} key={item.id}>
        <SDTouchOpacity
          onLongPress={() => {
            navLightBox("ConfirmLightBoxScreen", {
              passProps: {
                title: "你确定要删除此通知",
                onOk: () => {
                  Toast.success("删除成功", 1);
                  this.setState({
                    removeList: [].concat(this.state.removeList).concat([item.id])
                  })
                }
              }
            });
          }}
          style={{
            flex: 1,
            borderRadius: CSS.pixel(10),
            paddingVertical: CSS.pixel(20),
            backgroundColor: "#fff",
            marginTop: CSS.pixel(20),
            flexDirection: "row"
          }}
        >
          <View style={{ width: CSS.pixel(104), alignItems: "center" }}>
            <Image
              style={{
                width: CSS.pixel(54),
                height: CSS.pixel(54),
                left: CSS.pixel(10)
              }}
              resizeMode="stretch"
              source={require("@img/my/notifyType/ming_oico_education.png")}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                height: CSS.pixel(64),
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
                paddingTop: CSS.pixel(6)
              }}
            >
              <View style={{ marginRight: CSS.pixel(4) }}>
                <Text>教育经历认证</Text>
              </View>
              <View style={{ flex: 1 }}>
                {/* <View
                  style={{
                    backgroundColor: "#F84038",
                    height: CSS.pixel(14),
                    width: CSS.pixel(14),
                    borderRadius: CSS.pixel(7)
                  }}
                /> */}
              </View>
              <View style={{ marginRight: CSS.pixel(30) }}>
                <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                  {item.created_time.slice(0, 16).replace(/-/g, "/").replace("T", " ")}
                </Text>
              </View>
            </View>
            <View
              style={{ marginTop: CSS.pixel(20), paddingRight: CSS.pixel(30) }}
            >
              <Text
                numberOfLines={3}
                style={{ color: "#999", fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}
              >
                 {item.content}
              </Text>
            </View>
          </View>
        </SDTouchOpacity>
      </View>
    );
  }

  // 审核通知
  renderTypeCheckMessage(item) {
    return (
      <View style={{ paddingHorizontal: CSS.pixel(30) }} key={item.id}>
        <SDTouchOpacity
          onLongPress={() => {
            navLightBox("ConfirmLightBoxScreen", {
              passProps: {
                title: "你确定要删除此通知",
                onOk: () => {
                  Toast.success("删除成功", 1);
                  this.setState({
                    removeList: [].concat(this.state.removeList).concat([item.id])
                  })
                }
              }
            });
          }}
          onPress={() => {
            this.props.actions.readNotifyAction({
              id: item.id
            }).then(res => {

            }).catch(err => {

            })

            this.setState({
              currReadList: [].concat(this.state.currReadList).concat([item.id])
            });

            // 判断是证书还是获奖经历
            // 跳转到个人履历
            let skipType = '';
            if(item.type == 'winning') {
              skipType = 'audit_winning'
            } else if (item.type == 'usercertificate'){
              skipType = 'audit_certificate'
            }
            this.context.navigator.push(navScreen("PushScreen", "我的履历", {
              passProps: {
                screen: () => <TrackRecordScreen skip={skipType}/>,
                fullScreen: true,
                noScrollView: true,
                header: {
                  title: "我的履历"
                },
                navigatorButtons: {
                  rightButtons: [
                    {
                      icon: () => (
                        <Image source={require("@img/salary/home_ico_share02.png")} />
                      ),
                      id: "track_share"
                    }
                  ]
                }
              }
            }))
          }}

          style={{
            flex: 1,
            borderRadius: CSS.pixel(10),
            paddingVertical: CSS.pixel(20),
            backgroundColor: "#fff",
            marginTop: CSS.pixel(20),
            flexDirection: "row"
          }}
        >
          <View style={{ width: CSS.pixel(104), alignItems: "center" }}>
            <Image
              style={{
                width: CSS.pixel(54),
                height: CSS.pixel(54),
                left: CSS.pixel(10)
              }}
              resizeMode="stretch"
              source={require("@img/my/notifyType/mine_ico_examine.png")}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                height: CSS.pixel(64),
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
                paddingTop: CSS.pixel(6)
              }}
            >
              <View style={{ marginRight: CSS.pixel(4) }}>
                <Text>审核通知</Text>
              </View>
              <View style={{ flex: 1 }}>
              {item.is_read != true && this.state.currReadList.indexOf(item.id) < 0? 
                <View
                  style={{
                    backgroundColor: "#F84038",
                    height: CSS.pixel(14),
                    width: CSS.pixel(14),
                    borderRadius: CSS.pixel(7)
                  }}
                /> : null}
              </View>
              <View style={{ marginRight: CSS.pixel(30) }}>
                <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                  {item.created_time.slice(0, 16).replace(/-/g, "/").replace("T", " ")}
                </Text>
              </View>
            </View>
            <View
              style={{ marginTop: CSS.pixel(20), paddingRight: CSS.pixel(30) }}
            >
              <Text
                numberOfLines={3}
                style={{ color: "#999", fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}
              >
                {item.content}
              </Text>
            </View>
            <View
              style={{
                marginTop: CSS.pixel(20),
                alignItems: "flex-end",
                paddingRight: CSS.pixel(30)
              }}
            >
              <View>
                <Text
                  style={{ color: SDMainColor, fontSize: CSS.textSize(24) }}
                >
                  查看详情>>
                </Text>
              </View>
            </View>
          </View>
        </SDTouchOpacity>
      </View>
    );
  }

  // 开课提醒
  renderTypeCourseMessage(item) {
    return (
      <View style={{ paddingHorizontal: CSS.pixel(30) }} key={item.id}>
        <SDTouchOpacity
          onLongPress={() => {
            navLightBox("ConfirmLightBoxScreen", {
              passProps: {
                title: "你确定要删除此通知",
                onOk: () => {
                  Toast.success("删除成功", 1);
                  this.setState({
                    removeList: [].concat(this.state.removeList).concat([item.id])
                  })
                }
              }
            });
          }}
          onPress={() => {
            this.props.actions.readNotifyAction({
              id: item.id
            }).then(res => {}).catch(err => {});
            // 进入课程详情里
            // 并且进行定位
            this.setState({
              currReadList: [].concat(this.state.currReadList).concat([item.id])
            });
            this.context.navigator.push(navScreen("PushScreen", "我的履历", {
              passProps: {
                screen: () => <LiveCourseDetailScreen liveData={{id: item.related_obj}}/>,
                fullScreen: true,
                noScrollView: true,
                saveBg: SDMainColor,
              }
            }))
          }}
          style={{
            flex: 1,
            borderRadius: CSS.pixel(10),
            paddingVertical: CSS.pixel(20),
            backgroundColor: "#fff",
            marginTop: CSS.pixel(20),
            flexDirection: "row"
          }}
        >
          <View style={{ width: CSS.pixel(104), alignItems: "center" }}>
            <Image
              style={{
                width: CSS.pixel(54),
                height: CSS.pixel(54),
                left: CSS.pixel(10)
              }}
              resizeMode="stretch"
              source={require("@img/my/notifyType/Rectangle_3.png")}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                height: CSS.pixel(64),
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
                paddingTop: CSS.pixel(6)
              }}
            >
              <View style={{ marginRight: CSS.pixel(4) }}>
                <Text>开课提醒</Text>
              </View>
              <View style={{ flex: 1 }}>
                {item.is_read != true && this.state.currReadList.indexOf(item.id) < 0? 
                <View
                  style={{
                    backgroundColor: "#F84038",
                    height: CSS.pixel(14),
                    width: CSS.pixel(14),
                    borderRadius: CSS.pixel(7)
                  }}
                /> : null}
              </View>
              <View style={{ marginRight: CSS.pixel(30) }}>
                <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                  {item.created_time.slice(0, 16).replace(/-/g, "/").replace("T", " ")}
                </Text>
              </View>
            </View>
            <View
              style={{ marginTop: CSS.pixel(20), paddingRight: CSS.pixel(30) }}
            >
              <Text
                numberOfLines={3}
                style={{ color: "#999", fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}
              >
                {item.content}
              </Text>
            </View>

            <View
              style={{
                marginTop: CSS.pixel(20),
                alignItems: "flex-end",
                paddingRight: CSS.pixel(30)
              }}
            >
              <View>
                <Text
                  style={{ color: SDMainColor, fontSize: CSS.textSize(24) }}
                >
                  查看详情>>
                </Text>
              </View>
            </View>
          </View>
        </SDTouchOpacity>
      </View>
    );
  }

  // 评价
  renderTypeCommentMessage(item) {
    return (
      <View style={{ paddingHorizontal: CSS.pixel(30) }} key={item.id}>
        <SDTouchOpacity
          onLongPress={() => {
            navLightBox("ConfirmLightBoxScreen", {
              passProps: {
                title: "你确定要删除此通知",
                onOk: () => {
                  Toast.success("删除成功", 1);
                  this.setState({
                    removeList: [].concat(this.state.removeList).concat([item.id])
                  })
                }
              }
            });
          }}
           onPress={() => {
            this.props.actions.readNotifyAction({
              id: item.id
            }).then(res => {}).catch(err => {});
            // 跳转到课程评论详情
            this.setState({
              currReadList: [].concat(this.state.currReadList).concat([item.id])
            });
            this.context.navigator.push(navScreen("PushScreen", "课程回复详情", {
              passProps: {
                screen: () => <MyCourseCommentScreen courseId={item.related_obj}/>,
                noScrollView: true,
                fullScreen: true,
                header: {
                  title: "课程回复详情"
                }
              }
            }))
          }}

          style={{
            flex: 1,
            borderRadius: CSS.pixel(10),
            paddingVertical: CSS.pixel(20),
            backgroundColor: "#fff",
            marginTop: CSS.pixel(20),
            flexDirection: "row"
          }}
        >
          <View style={{ width: CSS.pixel(104), alignItems: "center" }}>
            <Image
              style={{
                width: CSS.pixel(54),
                height: CSS.pixel(54),
                left: CSS.pixel(10)
              }}
              resizeMode="stretch"
              source={require("@img/my/notifyType/Rectangle_31.png")}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                height: CSS.pixel(64),
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
                paddingTop: CSS.pixel(6)
              }}
            >
              <View style={{ marginRight: CSS.pixel(4) }}>
                <Text>评价</Text>
              </View>
              <View style={{ flex: 1 }}>
                {item.is_read != true && this.state.currReadList.indexOf(item.id) < 0? 
                <View
                  style={{
                    backgroundColor: "#F84038",
                    height: CSS.pixel(14),
                    width: CSS.pixel(14),
                    borderRadius: CSS.pixel(7)
                  }}
                /> : null}
              </View>
              <View style={{ marginRight: CSS.pixel(30) }}>
                <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                  {item.created_time.slice(0, 16).replace(/-/g, "/").replace("T", " ")}
                </Text>
              </View>
            </View>
            <View
              style={{ marginTop: CSS.pixel(20), paddingRight: CSS.pixel(30) }}
            >
              <Text
                // numberOfLines={3}
                style={{ color: "#999", fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}
              >
                {item.content}
              </Text>
            </View>
            <View
              style={{
                marginTop: CSS.pixel(20),
                alignItems: "flex-end",
                paddingRight: CSS.pixel(30)
              }}
            >
              <View>
                <Text
                  style={{ color: SDMainColor, fontSize: CSS.textSize(24) }}
                >
                  查看详情>>
                </Text>
              </View>
            </View>
          </View>
        </SDTouchOpacity>
      </View>
    );
  }

  _onFooterRefresh() {}

  render() {
    return (
      <SDPullScrollView
        refreshState={this.state.currState}
        style={{
          width: "100%",
          backgroundColor: "#f3f3f3"
        }}
        data={this.state.data}
        onFooterRefresh={this.refreshFooter.bind(this)}
        onHeaderRefresh={this.refreshHeader.bind(this)}
        renderItem={(item, index) => {
          if(this.state.removeList.indexOf(item.id) >= 0){
            return null;
          }
          switch (this.props.notifyType) {
            case "course_sync":
              return this.renderTypeImportMessage(item);
            case "chsi_sync":
              return this.renderTypeEduMessage(item);
            case "audit_notice":
              return this.renderTypeCheckMessage(item);
            case "tech_course_remind":
              return this.renderTypeCourseMessage(item);
            case "reply_remind":
              return this.renderTypeCommentMessage(item);
          }
        }}
      />
    );
  }
}

export default connectWithActions((state, props) => ({
  notifyList: state.notifyInfo
}))(MessageTypeListScreen);
