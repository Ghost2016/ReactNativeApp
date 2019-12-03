import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput
} from "react-native";
import { Toast } from "antd-mobile";
import PropTypes from "prop-types";
import { Icon } from "@shoutem/ui";
import ConnectWithActions from "../../../connectWithActions";
import { UserState } from "../../../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    paddingTop: 20
  }
});
type Props = {
  userInfo: UserState
};
// 编辑用户性别信息
class EditUserSexScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      sexSelectIndex: this.props.userInfo.gender == "female" ? 1 : 0
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  componentDidMount() {
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_userSex") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");

        if (this.state.sexSelectIndex < 0) {
          Toast.fail("请选择性别");
          return;
        }
        Toast.loading("保存中");
        this.props.actions.updateBaseInfoAction(
          {
            gender: this.state.sexSelectIndex == 1 ? "female" : "male"
          },
          res => {
            Toast.info("保存成功");
            this.context.navigator.pop();
          }
        );
      }
    }
  }
  onPressSexItem1(e) {
    this.setState({
      sexSelectIndex: 0
    });
  }
  onPressSexItem2(e) {
    this.setState({
      sexSelectIndex: 1
    });
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity
          onPress={this.onPressSexItem1.bind(this)}
          activeOpacity={0.8}
          style={{
            height: 60,
            paddingHorizontal: 10,
            backgroundColor: "#fff",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <TextInput
            placeholder="男"
            editable={false}
            style={{ flex: 1, borderWidth: 0, fontSize: 14 }}
            underlineColorAndroid="transparent"
          />
          <View
            style={{
              width: 80,
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          >
            {this.state.sexSelectIndex == 0 ? (
              <Icon style={{ color: "#fed200" }} name="checkbox-on" />
            ) : (
              <Icon style={{ color: "#fed200" }} name="checkbox-off" />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.onPressSexItem2.bind(this)}
          activeOpacity={0.8}
          style={{
            height: 60,
            paddingHorizontal: 10,
            backgroundColor: "#fff",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <TextInput
            placeholder="女"
            editable={false}
            style={{ flex: 1, borderWidth: 0, fontSize: 14 }}
            underlineColorAndroid="transparent"
          />
          <View
            style={{
              width: 80,
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          >
            {this.state.sexSelectIndex == 1 ? (
              <Icon style={{ color: "#fed200" }} name="checkbox-on" />
            ) : (
              <Icon style={{ color: "#fed200" }} name="checkbox-off" />
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user
}))(EditUserSexScreen);
