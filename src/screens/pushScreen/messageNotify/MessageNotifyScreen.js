import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import PropTypes from "prop-types";
import { InputItem } from "antd-mobile";
import MessageNotifyList from "../../../sd_messageNotfiy/MessageNotifyList";
import connectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

// 我的-消息通知
class MessageNotifyScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  componentWillMount() {
    this.props.actions.getNotifyAction();
  }

  componentWillUnmount() {
    this.props.actions.readAllNotifyAction();
  }

  render() {
    return (
      <View style={[styles.container, {
        backgroundColor: this.props.notifyList.results.length > 0 ? '#f3f3f3' : '#f3f3f3',
        paddingTop: CSS.pixel(20)
      }]}>
        {/* <View style={{marginTop: CSS.pixel(20)}}></View> */}
        <MessageNotifyList />
      </View>
    );
  }
}

export default connectWithActions((state, props) => ({
  notifyList: state.notifyInfo
}))(MessageNotifyScreen)