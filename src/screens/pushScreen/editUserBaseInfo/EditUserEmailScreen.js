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
import PropTypes from 'prop-types';
import {Toast} from 'antd-mobile';
import connectWithActions from "../../../connectWithActions";
import { getUserBaseInfo } from "../../../users/usersSelector";
import { UserState } from "../../../types";
import { CSS } from "../../../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1"
  }
});

type Props = {
  user: UserState
}

// 编辑用户邮箱
class EditUserEmailScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.user.email || ""
    }
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null
  }
  componentDidMount() {
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "save_userEmail"
    );
  }

  onNavigatorEvent(event) {
    // this is the onPress handler for the two buttons together
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_userEmail") {
        Keyboard.dismiss();
        if (this.state.email === "") {
          Toast.fail("邮箱不能为空");
          return;
        } else {
          this.props.actions.updateUserEmailAction({
            email: this.state.email
          }, () => {
            this.props.actions.getUserInfoAction();
            Toast.success("保存成功");
            this.context.navigator.pop();
          })
        }
      }
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={{height: CSS.pixel(20), backgroundColor: '#f3f3f3'}}></View>
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
            placeholder="输入电子邮箱"
            keyboardType="email-address"
            onChangeText={txt => {
              this.state.email = txt;
            }}
            style={{ borderWidth: 0, fontSize: 14 }}
            underlineColorAndroid="transparent"
            defaultValue={this.props.user.email || ""}
          />
        </View>
      </ScrollView>
    );
  }
}

export default connectWithActions((state, props) => ({
  user: state.user
}))(EditUserEmailScreen)
