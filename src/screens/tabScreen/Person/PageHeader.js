import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import SDHeader from "../../../common/SDHeader";
import { CSS } from "../../../common/SDCSS";
import { navScreen } from "@styles";
import UserSettingScreen from '../../pushScreen/userSetting/UserSettingScreen';
import MessageNotifyScreen from '../../pushScreen/messageNotify/MessageNotifyScreen';
import connectWithActions from "../../../connectWithActions";
import { NotifyModel } from "../../../types";
import MessageTypeScreen from "../../pushScreen/messageNotify/MessageTypeScreen";

const styles = StyleSheet.create({
  rightGroup: {}
});
type Props = {
  notifyList: NotifyModel[]
}
// 我的页面头部
class PageHeader extends React.PureComponent<Props> {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return <SDHeader title="我的" right={<RightGroup num={this.props.notifyList.unReadCount} />}/>;
  }
}

export class RightGroup extends React.PureComponent {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  onPressMessage() {
    // this.context.navigator.push(navScreen("PushScreen", "消息通知", {
    //   passProps: {
    //     screen: () => <MessageNotifyScreen />,
    //     fullScreen: true,
    //     noScrollView: true,
    //     header: {
    //       title: "消息通知"
    //     }
    //   }
    // }));
    this.context.navigator.push(navScreen("PushScreen", "消息", {
      passProps: {
        screen: () => <MessageTypeScreen />,
        fullScreen: true,
        noScrollView: true,
        header: {
          title: "消息"
        }
      }
    }));
  }
  onPressSetting() {
    this.context.navigator.push(navScreen("PushScreen", "设置", {
      passProps: {
        screen: () => <UserSettingScreen />,
        fullScreen: true,
        noScrollView: true,
        header: {
          title: "设置"
        }
      }
    }));
  }
  render() {
    return (
      <View
        style={[
          styles.rightGroup,
          {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            overflow: "visible"
          }
        ]}
      >
        <TouchableOpacity
          onPress={this.onPressMessage.bind(this)}
          style={{
            height: CSS.pixel(98, true),
            width: CSS.pixel(100),
            alignItems: "flex-end",
            justifyContent: "center",
            paddingRight: CSS.pixel(20)
          }}
        >
          {
            this.props.num ?
            <SDBadge num={this.props.num}/>: null
          }
          <Image source={require("@img/my/PersonMainTop/mine_ico_news.png")} />
        </TouchableOpacity>
        <View style={{ marginRight: CSS.pixel(10) }} />
        <TouchableOpacity onPress={this.onPressSetting.bind(this)}>
          <Image
            source={require("@img/my/PersonMainTop/mine_ico_set_up.png")}
          />
        </TouchableOpacity>
        <View style={{ marginRight: CSS.pixel(30) }} />
      </View>
    );
  }
}

class SDBadge extends React.PureComponent {
  render() {
    return (
      <View
        style={{
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          right: CSS.pixel(12),
          top: CSS.pixel(20, true),
          height: CSS.pixel(20, true),
          width: CSS.pixel(20),
          borderRadius: CSS.pixel(10),
          borderColor: "#fa4037",
          backgroundColor: "#fa4037",
          flexWrap: "nowrap",
          zIndex: 10
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize:
              (this.props.num + "").length == 3 ? CSS.textSize(10) : CSS.textSize(14)
          }}
        >
          {this.props.num ? this.props.num : ''}
        </Text>
      </View>
    );
  }
}

export default connectWithActions((state, props) => ({
  notifyList: state.notifyInfo
}))(PageHeader)