import React from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { Toast } from "antd-mobile";
import PropsType from "prop-types";
import ConnectWithActions from "../../../connectWithActions";
import { UserState } from "../../../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1"
  }
});
type Props = {
  userInfo: UserState
};
// 编辑用户名称
class EditUserNameScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      nickname: this.props.userInfo.nickname
    };
  }
  static contextTypes = {
    navigator: PropsType.object.isRequired
  };
  componentDidMount() {
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_userName") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");

        if (this.state.nickname == "") {
          Toast.info("姓名不能为空");
          return;
        } else {
          Toast.loading("保存中");
          this.props.actions.updateBaseInfoAction(
            {
              nickname: this.state.nickname
            },
            res => {
              Toast.info("保存成功");
              this.context.navigator.pop();
            }
          );
        }
      }
    }
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View
          style={{
            height: 60,
            paddingHorizontal: 10,
            backgroundColor: "#fff",
            justifyContent: "center",
            marginTop: 20
          }}
        >
          <TextInput
            placeholder="输入你的姓名"
            style={{ borderWidth: 0, fontSize: 14 }}
            underlineColorAndroid="transparent"
            value={this.state.nickname}
            onChangeText={text => this.setState({ nickname: text })}
          />
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user
}))(EditUserNameScreen);
