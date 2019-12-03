import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  AlertIOS,
  Keyboard,
  Image,
  Clipboard
} from "react-native";
import { Toast } from 'antd-mobile';
import PropTypes from "prop-types";
import FeedBackForm from "../../../sd_feedBack/FeedBackForm";
import connectWithActions from "../../../connectWithActions";
import { getUserAllInfo } from "../../../users/usersSelector";
import { CSS } from "../../../common/SDCSS";
import SDTouchOpacity from "../../../common/SDTouchOpacity";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  },
  footter: {
    height: 60
  }
});

// 意见反馈页面
class FeedBackScreen extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <FeedBackForm phone={this.props.user.phone || ""}/>
        {/* <View
          style={[
            styles.footter,
            { justifyContent: "space-around", alignItems: "center" }
          ]}
        >
          <Text style={{ color: "#666" }}>职么开门用户QQ群：887278291</Text>
          <Text style={{ color: "#666" }}>客服电话：028-689200</Text>
        </View> */}
        <SDTouchOpacity onPress={() => {
          Clipboard.setString("877052128");
          Toast.info("复制成功", 0.3);
        }} activeOpacity={0.9} style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', marginBottom: CSS.pixel(80)}}>
          <View style={{borderRadius: 4, overflow: 'hidden'}}>
            <Image style={{width: CSS.pixel(690)}} resizeMode="cover" source={require("@img/my/mine_pic_QQ.png")}/>
          </View>
        </SDTouchOpacity>
      </View>
    );
  }
}
export default connectWithActions((state, props) => ({
  user: getUserAllInfo(state, props)
}))(FeedBackScreen);