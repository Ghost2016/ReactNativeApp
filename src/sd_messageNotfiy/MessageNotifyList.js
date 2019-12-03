import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { Toast } from "antd-mobile";
import connectWithActions from "../connectWithActions";
import SDUpPullScrollView, { RefreshState } from "../common/SDUpPullScrollView";
import { NotifyModel } from "../types";
import { SDTouchList } from "../common";
import { SwipeAction } from "antd-mobile";
import { CSS } from "../common/SDCSS";
import { navLightBox, navScreen } from "../styles";
import TrackRecordScreen from "../screens/pushScreen/trackRecord/TrackRecordScreen";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff"
  }
});

type Props = {
  notifyList: NotifyModel[]
};

// 消息通知 组件列表
class MessageNotifyList extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      hasRefresh: false,
      refreshState: RefreshState.Idle,
      per_size: 10
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  onHeaderRefresh() {
    this.setState({ refreshState: RefreshState.HeaderRefreshing }, () => {
      this.props.actions
        .getNotifyAction({
          page: 1,
          size: this.state.per_size
        })
        .then(res => {
          if (res && res.count == this.props.notifyList.length) {
            this.setState({
              refreshState: RefreshState.NoMoreData
            });
          } else {
            this.setState({
              refreshState: RefreshState.Idle
            });
          }
        });
    });
  }
  onFooterRefresh() {
    // this.props.actions.getNotifyAction();
    if (this.props.notifyInfo.count <= this.props.notifyList.length) {
      this.setState({
        refreshState: RefreshState.NoMoreData
      });
      return;
    } else {
      this.setState({ refreshState: RefreshState.FooterRefreshing }, () => {
        this.props.actions
          .getNotifyOffsetAction({
            page: this.props.notifyInfo.current_page + 1,
            size: this.state.per_size
          })
          .then(res => {
            this.setState({
              refreshState: RefreshState.Idle
            });
          });
      });
    }
  }

  render() {
    // console.warn(this.props.notifyList);
    return this.props.notifyList.length > 0 ? (
      <SDUpPullScrollView
        style={styles.container}
        refreshState={this.state.refreshState}
        onFooterRefresh={this.onFooterRefresh.bind(this)}
        onHeaderRefresh={this.onHeaderRefresh.bind(this)}
        data={this.props.notifyList}
        keyExtractor={item => item.id + ""}
        renderItem={({ item, index }) => {
          return (
            <MessageNotifyItem
              remove={() => {
                this.props.actions.removeNotifyAction({
                  id: item.id
                });
              }}
              data={item}
              key={item.id + ""}
              index={item.id + ""}
            />
          );
        }}
      />
    ) : (
      <MessageNotifyEmpty message="暂无任何消息" />
    );
  }
}

type ItemProps = {
  index: string,
  data: NotifyModel
};
class MessageNotifyItem extends React.PureComponent<ItemProps> {
  static contextTypes={
    navigator: () => null
  }
  render() {
    return (
      <SDTouchList
        key={this.props.index}
        itemHeight={90}
        actions={[
          {
            name: "删除",
            onTouch: () => {
              navLightBox("ConfirmLightBoxScreen", {
                passProps: {
                  title: "你确定要删除此条消息",
                  onOk: () => {
                    this.props.remove();
                  }
                }
              });
            },
            backgroundColor: "#fb7771"
          }
        ]}
        onPress={() => {
          if (this.props.data.type.title == "course_sync" && this.props.data.status == true) {
            // 在校成绩导入 跳转到履历
            this.context.navigator.push(
              navScreen("PushScreen", "我的履历", {
                passProps: {
                  screen: () => <TrackRecordScreen skip="course_sync" />,
                  fullScreen: true,
                  noScrollView: true,
                  header: {
                    title: "我的履历"
                  },
                  navigatorButtons: {
                    rightButtons: [
                      {
                        icon: () => (
                          <Image
                            source={require("@img/salary/home_ico_share02.png")}
                          />
                        ),
                        id: "track_share"
                      }
                    ]
                  }
                }
              })
            );
          } else if (this.props.data.type.title == "chsi_sync") {
            // 教育经历认证
          } else if (this.props.data.type.title == "tech_task_remind") {
            // 任务提醒 跳转到任务
          } else if (this.props.data.type.title == "audit_certificate") {
            // 审核证书 跳转到履历
            this.context.navigator.push(
              navScreen("PushScreen", "我的履历", {
                passProps: {
                  screen: () => <TrackRecordScreen skip="audit_certificate" />,
                  fullScreen: true,
                  noScrollView: true,
                  header: {
                    title: "我的履历"
                  },
                  navigatorButtons: {
                    rightButtons: [
                      {
                        icon: () => (
                          <Image
                            source={require("@img/salary/home_ico_share02.png")}
                          />
                        ),
                        id: "track_share"
                      }
                    ]
                  }
                }
              })
            );
          } else if (this.props.data.type.title == "audit_winning") {
            // 审核获奖 跳转到履历
            this.context.navigator.push(
              navScreen("PushScreen", "我的履历", {
                passProps: {
                  screen: () => <TrackRecordScreen skip="audit_winning" />,
                  fullScreen: true,
                  noScrollView: true,
                  header: {
                    title: "我的履历"
                  },
                  navigatorButtons: {
                    rightButtons: [
                      {
                        icon: () => (
                          <Image
                            source={require("@img/salary/home_ico_share02.png")}
                          />
                        ),
                        id: "track_share"
                      }
                    ]
                  }
                }
              })
            );
          }
        }}
        other={() => (
          <MessageNotifyItemContent
            key={this.props.index}
            data={this.props.data}
          />
        )}
      />
    );
  }
}
type ItemProps = {
  index: string,
  data: NotifyModel
};
class MessageNotifyItemContent extends React.PureComponent<ItemProps> {
  render() {
    return (
      <View style={{ flex: 1, height: '100%'}}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: 'space-between'
          }}
        >
          <View style={{
            justifyContent: 'center',
            marginTop: CSS.pixel(40)
          }}>
            <Text
              style={{
                color: "#666",
                fontSize: CSS.textSize(36),
                fontWeight: "600"
              }}
            >
              {/* {this.props.data.type.title} */}
              {this.props.data.title}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: CSS.pixel(60),
              justifyContent: 'flex-end'
            }}
          >
            <Text style={{ textAlign: 'right', color: "#ccc", fontSize: CSS.textSize(26) }}>
              {this.props.data.created_time.slice(0, 10).replace(/-/g, "/")}{" "}
              {this.props.data.created_time.slice(11, 16)}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: CSS.pixel(10)
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              color: "#999",
              fontSize: CSS.textSize(26),
              overflow: "hidden",
              lineHeight: CSS.pixel(34)
            }}
          >
            {/* 你的任务“Axure基础知识掌握”即将开始，请按时完成哦 */}
            {/* {this.props.data.content.length > 25
              ? this.props.data.content.slice(0, 25) + "..."
              : this.props.data.content} */}
              {this.props.data.content}
          </Text>
        </View>
      </View>
    );
  }
}

class MessageNotifyEmpty extends React.PureComponent {
  render() {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("@img/message-no.jpg")}
          style={{ width: 160, height: 200, marginTop: 80 }}
        />

        <Text style={{ color: "#999", marginTop: 30 }}>
          {this.props.message}
        </Text>
      </View>
    );
  }
}

export default connectWithActions((state, props) => ({
  notifyList: state.notifyInfo.results,
  notifyInfo: state.notifyInfo
}))(MessageNotifyList);
