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
import PropTypes from "prop-types";
import connectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";

import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { navScreen } from "../../../styles";
import MessageTypeListScreen from "./MessageTypeListScreen";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  }
});

// 我的-消息
class MessageTypeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifyType: {
        tech_course_remind: {
          unread: false
        },
        audit_notice: {
          unread: false
        },
        audit_certificate: {
          unread: false
        },
        chsi_sync: {
          unread: false
        },
        course_sync: {
          unread: false
        }
      }
    }
  }

  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.actions.getNotifyTypeAciton().then(res => {
      // console.warn(res);
    }).catch(err => {

    })
  }

  // 成绩导入
  renderTypeImportMessage() {
    return JSON.stringify(this.props.notifyList) !== '{}' && JSON.stringify(this.props.notifyList.typeNotify) !== '{}' && this.props.notifyList.typeNotify.course_sync && this.props.notifyList.typeNotify.course_sync.first_info ? (
      <SDTouchOpacity
        style={{
          paddingVertical: CSS.pixel(20),
          backgroundColor: "#fff",
          marginTop: CSS.pixel(20),
          flexDirection: "row"
        }}
        onPress={() => {
          this.context.navigator.push(navScreen("PushScreen", "消息详情", {
            passProps: {
              screen: () => <MessageTypeListScreen notifyType="course_sync"/>,
              noScrollView: true,
              fullScreen: true,
              header: {
                title: "消息详情"
              }
            }
          }))
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
               {this.props.notifyList.typeNotify.course_sync.unread && <View
                style={{
                  backgroundColor: "#F84038",
                  height: CSS.pixel(14),
                  width: CSS.pixel(14),
                  borderRadius: CSS.pixel(7)
                }}
              />}
            </View>
            <View style={{ marginRight: CSS.pixel(30) }}>
              <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                {this.props.notifyList.typeNotify.course_sync.first_info ? this.props.notifyList.typeNotify.course_sync.first_info.created_time.slice(0, 16).replace(/-/g, "/").replace("T", " ") : ""}
              </Text>
            </View>
          </View>
          <View
            style={{ marginTop: CSS.pixel(20), paddingRight: CSS.pixel(30) }}
          >
            <Text
              numberOfLines={1}
              style={{ color: "#999", fontSize: CSS.textSize(24) }}
            >
              {this.props.notifyList.typeNotify.course_sync.first_info ? this.props.notifyList.typeNotify.course_sync.first_info.notification__content : ""}
            </Text>
          </View>
        </View>
      </SDTouchOpacity>
    ) : null;
  }

  // 教育经历认证
  renderTypeEduMessage() {
    return JSON.stringify(this.props.notifyList) !== '{}' && JSON.stringify(this.props.notifyList.typeNotify) !== '{}' && this.props.notifyList.typeNotify.chsi_sync && this.props.notifyList.typeNotify.chsi_sync.first_info  ? (
      <SDTouchOpacity
        style={{
          paddingVertical: CSS.pixel(20),
          backgroundColor: "#fff",
          marginTop: CSS.pixel(20),
          flexDirection: "row"
        }}
        onPress={() => {
          this.context.navigator.push(navScreen("PushScreen", "消息详情", {
            passProps: {
              screen: () => <MessageTypeListScreen notifyType="chsi_sync"/>,
              noScrollView: true,
              fullScreen: true,
              header: {
                title: "消息详情"
              }
            }
          }))
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
              {this.props.notifyList.typeNotify.chsi_sync.unread && <View
                style={{
                  backgroundColor: "#F84038",
                  height: CSS.pixel(14),
                  width: CSS.pixel(14),
                  borderRadius: CSS.pixel(7)
                }}
              />}
            </View>
            <View style={{ marginRight: CSS.pixel(30) }}>
              <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                {this.props.notifyList.typeNotify.chsi_sync.first_info ? this.props.notifyList.typeNotify.chsi_sync.first_info.created_time.slice(0, 16).replace(/-/g, "/").replace("T", " ") : ""}
              </Text>
            </View>
          </View>
          <View
            style={{ marginTop: CSS.pixel(20), paddingRight: CSS.pixel(30) }}
          >
            <Text
              numberOfLines={1}
              style={{ color: "#999", fontSize: CSS.textSize(24) }}
            >
              {this.props.notifyList.typeNotify.chsi_sync.first_info ? this.props.notifyList.typeNotify.chsi_sync.first_info.notification__content : ""}
            </Text>
          </View>
        </View>
      </SDTouchOpacity>
    ) : null;
  }

  // 审核通知
  renderTypeCheckMessage() {
    return JSON.stringify(this.props.notifyList) !== '{}' && JSON.stringify(this.props.notifyList.typeNotify) !== '{}' && this.props.notifyList.typeNotify.audit_notice && this.props.notifyList.typeNotify.audit_notice.first_info  ? (
      <SDTouchOpacity
        style={{
          paddingVertical: CSS.pixel(20),
          backgroundColor: "#fff",
          marginTop: CSS.pixel(20),
          flexDirection: "row"
        }}
        onPress={() => {
          this.context.navigator.push(navScreen("PushScreen", "消息详情", {
            passProps: {
              screen: () => <MessageTypeListScreen notifyType="audit_notice"/>,
              noScrollView: true,
              fullScreen: true,
              header: {
                title: "消息详情"
              }
            }
          }))
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
              {this.props.notifyList.typeNotify.audit_notice.unread && <View
                style={{
                  backgroundColor: "#F84038",
                  height: CSS.pixel(14),
                  width: CSS.pixel(14),
                  borderRadius: CSS.pixel(7)
                }}
              />}
            </View>
            <View style={{ marginRight: CSS.pixel(30) }}>
              <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                {this.props.notifyList.typeNotify.audit_notice.first_info ? this.props.notifyList.typeNotify.audit_notice.first_info.created_time.slice(0, 16).replace(/-/g, "/").replace("T", " ") : ""}
              </Text>
            </View>
          </View>
          <View
            style={{ marginTop: CSS.pixel(20), paddingRight: CSS.pixel(30) }}
          >
            <Text
              numberOfLines={1}
              style={{ color: "#999", fontSize: CSS.textSize(24) }}
            >
              {this.props.notifyList.typeNotify.audit_notice.first_info ? this.props.notifyList.typeNotify.audit_notice.first_info.notification__content : ""}
            </Text>
          </View>
        </View>
      </SDTouchOpacity>
    ) : null;
  }

  // 开课提醒
  renderTypeCourseMessage() {
    // console.warn(this.props.notifyList.tech_course_remind)
    return JSON.stringify(this.props.notifyList) !== '{}' && JSON.stringify(this.props.notifyList.typeNotify) !== '{}' && this.props.notifyList.typeNotify.tech_course_remind && this.props.notifyList.typeNotify.tech_course_remind.first_info  ? (
      <SDTouchOpacity
        style={{
          paddingVertical: CSS.pixel(20),
          backgroundColor: "#fff",
          marginTop: CSS.pixel(20),
          flexDirection: "row"
        }}
        onPress={() => {
          this.context.navigator.push(navScreen("PushScreen", "消息详情", {
            passProps: {
              screen: () => <MessageTypeListScreen notifyType="tech_course_remind"/>,
              noScrollView: true,
              fullScreen: true,
              header: {
                title: "消息详情"
              }
            }
          }))
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
              {this.props.notifyList.typeNotify.tech_course_remind.unread && <View
                style={{
                  backgroundColor: "#F84038",
                  height: CSS.pixel(14),
                  width: CSS.pixel(14),
                  borderRadius: CSS.pixel(7)
                }}
              />}
            </View>
            <View style={{ marginRight: CSS.pixel(30) }}>
              <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                {this.props.notifyList.typeNotify.tech_course_remind.first_info ? this.props.notifyList.typeNotify.tech_course_remind.first_info.created_time.slice(0, 16).replace(/-/g, "/").replace("T", " ") : ""}
              </Text>
            </View>
          </View>
          <View
            style={{ marginTop: CSS.pixel(20), paddingRight: CSS.pixel(30) }}
          >
            <Text
              numberOfLines={1}
              style={{ color: "#999", fontSize: CSS.textSize(24) }}
            >
              {this.props.notifyList.typeNotify.tech_course_remind.first_info ? this.props.notifyList.typeNotify.tech_course_remind.first_info.notification__content : ""}
            </Text>
          </View>
        </View>
      </SDTouchOpacity>
    ) : null;
  }

  // 评价
  renderTypeCommentMessage() {
    return JSON.stringify(this.props.notifyList) !== '{}' && JSON.stringify(this.props.notifyList.typeNotify) !== '{}' && this.props.notifyList.typeNotify.reply_remind && this.props.notifyList.typeNotify.reply_remind.first_info  ? (
      <SDTouchOpacity
        style={{
          paddingVertical: CSS.pixel(20),
          backgroundColor: "#fff",
          marginTop: CSS.pixel(20),
          flexDirection: "row"
        }}
        onPress={() => {
          this.context.navigator.push(navScreen("PushScreen", "消息详情", {
            passProps: {
              screen: () => <MessageTypeListScreen notifyType="reply_remind"/>,
              noScrollView: true,
              fullScreen: true,
              header: {
                title: "消息详情"
              }
            }
          }))
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
              {this.props.notifyList.typeNotify.reply_remind.unread && <View
                style={{
                  backgroundColor: "#F84038",
                  height: CSS.pixel(14),
                  width: CSS.pixel(14),
                  borderRadius: CSS.pixel(7)
                }}
              />}
            </View>
            <View style={{ marginRight: CSS.pixel(30) }}>
              <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                {this.props.notifyList.typeNotify.reply_remind.first_info ? this.props.notifyList.typeNotify.reply_remind.first_info.created_time.slice(0, 16).replace(/-/g, "/").replace("T", " ") : ""}
              </Text>
            </View>
          </View>
          <View
            style={{ marginTop: CSS.pixel(20), paddingRight: CSS.pixel(30) }}
          >
            <Text
              numberOfLines={1}
              style={{ color: "#999", fontSize: CSS.textSize(24) }}
            >
              {this.props.notifyList.typeNotify.reply_remind.first_info ? this.props.notifyList.typeNotify.reply_remind.first_info.notification__content : ""}
            </Text>
          </View>
        </View>
      </SDTouchOpacity>
    ) : null;
  }

  render() {
    return this.props.notifyList && (JSON.stringify(this.props.notifyList.typeNotify) != '{}') && (
      Object.keys(this.props.notifyList.typeNotify).filter(c => this.props.notifyList.typeNotify[c].first_info != null).length > 0
    ) ? 
    (
      <ScrollView style={styles.container}>
        {this.renderTypeImportMessage()}
        {this.renderTypeEduMessage()}
        {this.renderTypeCheckMessage()}
        {this.renderTypeCourseMessage()}
        {this.renderTypeCommentMessage()}
      </ScrollView>
    ) : <MessageNotifyEmpty message={"暂无任何消息"}/>;
  }
}

export default connectWithActions((state, props) => ({
  notifyList: state.notifyInfo
}))(MessageTypeScreen);


class MessageNotifyEmpty extends React.PureComponent {
  render() {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: '#f3f3f3', flex: 1 }}>
        <Image
          source={require("@img/message-no.jpg")}
          style={{ width: 160, height: 200}}
        />

        <Text style={{ color: "#999", marginTop: 30 }}>
          {this.props.message}
        </Text>
      </View>
    );
  }
}