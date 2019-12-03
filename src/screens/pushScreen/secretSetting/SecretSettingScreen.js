import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  AlertIOS,
  Image
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { Toast } from "antd-mobile";
import { getUserBaseInfo } from "@src/users/usersSelector";
//import defaultStyle from "@styles";
import SDList from "../../../common/SDList";
import { UserState } from "../../../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  }
});

type Props = {
  user: UserState
}

// 我的-隐私设置
class SecretSettingScreen extends React.PureComponent<Props> {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      //开放成长任务
      tasks: this.props.user.settings && this.props.user.settings !== "" ? (JSON.parse(this.props.user.settings)).tasks : true,
      //开放我的动态
      dynamic: this.props.user.settings && this.props.user.settings !== "" ? (JSON.parse(this.props.user.settings)).dynamic : true,
      //开放我的位置信息
      location: this.props.user.settings && this.props.user.settings !== "" ? (JSON.parse(this.props.user.settings)).location : true,
    };
  }

  onSwitch = (value, type = "tasks") => {
    this.state[type] = value;
    this.props.actions.updateBaseInfoAction({
      settings: JSON.stringify({
        ...JSON.parse(this.props.settings),
        tasks: this.state.tasks,
        dynamic: this.state.dynamic,
        location: this.state.location,
      })
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            justifyContent: "center",
            paddingLeft: CSS.pixel(30),
            paddingTop: CSS.pixel(40),
            paddingBottom: CSS.pixel(10)
          }}
        >
          <Text style={{ color: "#999", fontSize: CSS.pixel(24) }}>
            个人主页部分信息对他人可见
          </Text>
        </View>
        <SDList
          listOptions={[
            {
              name: "成长任务",
              direction: "switch",
              subRowTitle: "关闭后已完成的成长任务对他人不可见",
              onSwitch: value => {
                this.onSwitch(value, "tasks");
              },
              defaultChecked: this.state.tasks
            },
            {
              name: "我的动态",
              direction: "switch",
              subRowTitle: "关闭后所有动态对他人不可见",
              onSwitch: value => {
                this.onSwitch(value, "dynamic");
              },
              defaultChecked: this.state.dynamic
            },
            {
              name: "动态定位",
              direction: "switch",
              subRowTitle: "关闭后所有动态的定位对他人不可见",
              onSwitch: value => {
                this.onSwitch(value, "location");
              },
              defaultChecked: this.state.location
            }
          ]}
        />
      </View>
    );
  }
}
export default ConnectWithActions((state, props) => ({
  user: state.user,
  settings: (state.user && state.user.settings) || '{}'
}))(SecretSettingScreen);
