import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  Keyboard
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../../../connectWithActions";
import { Toast } from "antd-mobile";
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
// 编辑用户手机号码
class EditUserPhoneScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      phoneText: this.props.userInfo.contact || this.props.userInfo.phone || ""
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
      if (event.id == "save_userPhone") {
        Keyboard.dismiss();
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        if (this.state.phoneText == "") {
          Toast.fail("联系方式不能为空");
          return;
        } else {
          if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.state.phoneText)) {
            Toast.fail("请输入正确手机号格式", 0.5);
            return;
          }
          Toast.loading("保存中");
          this.props.actions.updateBaseInfoAction(
            {
              contact: this.state.phoneText
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
            placeholder="请输入联系方式"
            style={{ borderWidth: 0, fontSize: 14 }}
            underlineColorAndroid="transparent"
            value={this.state.phoneText}
            keyboardType="numeric"
            returnKeyLabel="完成"
            returnKeyType="done"
            onChangeText={text => this.setState({ phoneText: text })}
          />
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user
}))(EditUserPhoneScreen);
