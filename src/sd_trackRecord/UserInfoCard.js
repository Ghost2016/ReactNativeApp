/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  Image
} from "react-native";
import defaultStyle, { SDMainColor } from "@styles";
import { UserState } from "../types";
import ConnectWithActions from "../connectWithActions";
import { CSS } from "../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: CSS.pixel(10),
    paddingLeft: CSS.pixel(36)
  },
  infoBox: {
  }
});
type Props = {
  userInfo: UserState
};
// 我的履历 - 个人信息组件
class UserInfocard extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>

          <View style={{position: 'absolute', right: CSS.pixel(10), top: CSS.pixel(30), zIndex: 2}}>
            {this.props.edit ? this.props.edit(): null}
          </View>
        <View
          style={{
            height: 32,
            top: CSS.pixel(20),
            backgroundColor: '#fff',
            flexDirection: "row",
            alignItems: "center",
            borderRadius: CSS.pixel(10)
          }}
        >
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <View style={[defaultStyle.flexRow, { alignItems: "center" }]}>
              <Text style={{ color: "#333333", fontSize: CSS.textSize(24) }}>姓名:</Text>
              <Text numberOfLines={1} style={{ color: "#333333", fontSize: CSS.textSize(30), marginLeft: CSS.pixel(10)}}>
                 {/* {this.props.userInfo.nickname && this.props.userInfo.nickname.slice(0, 10)} */}
                 {this.props.userInfo.real_name ? this.props.userInfo.real_name.slice(0, 10) : ''}
              </Text>
            </View>
            {this.props.userInfo.is_verified ? (
              <View style={[defaultStyle.flexRow, { alignItems: "center" }]}>
                <Image source={require("@img/mine_Resume_Authentication1.png")} />
                <Text style={{ color: "#fff", fontSize: 12 }}>已认证</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View
          style={[
            styles.infoBox,
            { paddingTop: 15, paddingBottom: 5 }
          ]}
        >
          <UserInfoItem
            label="性别"
            value={this.props.userInfo.gender == "male" ? "男" : "女"}
          />
          <UserInfoItem
            label="所在地区"
            value={
              this.props.userInfo.city ? this.props.userInfo.city.name : ""
            }
          />
          <UserInfoItem
            label="联系方式"
            value={
              this.props.userInfo.contact && this.props.userInfo.contact !== ""
                ? this.props.userInfo.contact
                : this.props.userInfo.phone && this.props.userInfo.phone !== ""
                  ? this.props.userInfo.phone
                  : ""
            }
          />
          <UserInfoItem label="电子邮箱" value={this.props.userInfo.email} />
        </View>
      </View>
    );
  }
}

class UserInfoItem extends React.PureComponent {
  render() {
    return (
      <View
        style={[
          defaultStyle.flexRow,
          { alignItems: "flex-start", marginBottom: 10 }
        ]}
      >
        <View
          style={{
            backgroundColor: SDMainColor,
            height: 6,
            width: 6,
            borderRadius: 3,
            marginRight: 4,
            top: 4
          }}
        />
        <View>
          <Text style={{ color: "#ccc", fontSize: 12 }}>
            {this.props.label}:
          </Text>
        </View>
        <View style={{ marginLeft: 3, flex: 1 }}>
          <Text style={{ color: "#333", fontSize: 14, flexWrap: "wrap" }}>
            {this.props.value}
          </Text>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user
}))(UserInfocard);
