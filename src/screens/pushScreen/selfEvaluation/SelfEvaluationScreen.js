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
import { UserState } from "../../../types";
import ConnectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

type Props = {
  userInfo: UserState
};
// 自我评价页面
class SelfEvaluationScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      contentText: this.props.userInfo.content ? this.props.userInfo.content : "",
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentDidMount() {
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "save_evaluationBtn"
    );
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_evaluationBtn") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        //console.warn(this.state.contentText)
        if (this.state.contentText == "") {
          Toast.fail("自我介绍不能为空", 1);
          return;
        } else {
          Toast.loading("保存中");
          this.props.actions.updateBaseInfoAction(
            {
              content: this.state.contentText
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
        <View style={{height: CSS.pixel(20), width: '100%',backgroundColor: '#f3f3f3'}}></View>
        <View style={{ padding: CSS.pixel(30) }}>
          <TextInput
            multiline={true}
            placeholder="150字简要描述自己"
            underlineColorAndroid="transparent"
            ref="_remarkInput"
            value={this.state.contentText}
            defaultValue={this.props.userInfo.content ? this.props.userInfo.content.slice(0, 150) : ""}
            onChangeText={text => {
              this.setState({
                contentText: text ? text.slice(0, 150) : ""
              })
              if(text.length > 150) {
                Toast.info("超出字数限制", 0.3)
              }
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user
}))(SelfEvaluationScreen);
