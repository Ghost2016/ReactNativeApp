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
import defaultStyle from "@styles";
import { CSS } from "../common/SDCSS";
import { navScreen } from "../styles";
import ConnectWithActions from "../connectWithActions";
import { getUserTotal } from "../directSelectors";
import { getOtherUserInfo } from "../api";
import { userTotalModel, otherUserInfoModel, UserState } from "../types";
import FansScreeen from "../screens/pushScreen/fansScreen/FansScreeen";
import { getUserBaseInfo } from "../users/usersSelector";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: CSS.pixel(100),
    width: "100%"
  }
});

type Props = {
  user: UserState,
  userTotal: userTotalModel,
  otherUserInfo: otherUserInfoModel
};

// 我的主页我的关注和粉丝组件
class LikeAndFans extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    otherId:  PropTypes.number.isRequired
  };
  render() {
    let fans = 0,
      watches = 0;
    if (this.context.otherId === 0) {
      fans = this.props.userTotal.fans;
      watches = this.props.userTotal.watches;
    } else {
      fans = this.props.otherUserInfo.watch_info.fans;
      watches = this.props.otherUserInfo.watch_info.watches;
    }
    return (
      <View
        style={[styles.container, defaultStyle.flexRow, defaultStyle.center]}
      >
        <TouchableOpacity
          style={[defaultStyle.flex]}
          onPress={() => {
            this.context.navigator.push(
              navScreen("PushScreen", (this.context.otherId !== undefined && this.context.otherId !== 0)  ? "他的关注" : "我的关注", {
                passProps: {
                  screen: () => <FansScreeen screenType= "follow" userId={(this.context.otherId !== undefined && this.context.otherId !== 0) ? this.context.otherId : this.props.user.id} />
                }
              })
            );
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 18,
                color: "#333",
                marginBottom: CSS.pixel(10, true)
              }}
            >
              {watches}
            </Text>
            <Text style={{ fontSize: 12, color: "#ccc" }}>关注</Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: 1,
            height: CSS.pixel(42, true),
            backgroundColor: "#e1e1e1"
          }}
        />
        <TouchableOpacity
          style={[defaultStyle.flex]}
          onPress={() => {
            // this.context.navigator.push(
            //   navScreen("FansScreeen", "粉丝", {
            //     passProps: {
            //       screenType: "fans"
            //     }
            //   })
            // );
            this.context.navigator.push(
              navScreen("PushScreen", this.context.otherId !== undefined && this.context.otherId !== 0 ? "他的粉丝" : "我的粉丝", {
                passProps: {
                  screen: () => <FansScreeen screenType="fans" userId={this.context.otherId !== undefined && this.context.otherId !== 0 ? this.context.otherId : this.props.user.id} />
                }
              })
            );
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 18,
                color: "#333",
                marginBottom: CSS.pixel(10, true)
              }}
            >
              {fans}
            </Text>
            <Text style={{ fontSize: 12, color: "#ccc" }}>粉丝</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state),
  userTotal: getUserTotal(state, props),
  otherUserInfo: state.otherUserInfo
}))(LikeAndFans);
