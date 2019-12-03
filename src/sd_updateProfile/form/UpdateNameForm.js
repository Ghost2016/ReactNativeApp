/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView
} from "react-native";
import { Toast, InputItem } from "antd-mobile";
import defaultStyle from "@styles/index";
import ConfirmButtonGroup from "./ConfirmButtonGroup";
import { Navigation } from "react-native-navigation";
import ConnectWithActions from "@src/connectWithActions";
import { getUserBaseInfo } from "@src/users/usersSelector";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingLeft: 10,
    flex: 1
  }
});

// 修改昵称表单
class UpdateNameForm extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    nickname: this.props.user.nickname
  };
  componentDidMount() {}

  render() {
    return (
      <View style={[styles.container, { justifyContent: "space-between" }]}>
        <View style={[defaultStyle.center]}>
          <Text style={defaultStyle.fontSubColor}>更改昵称</Text>
        </View>
        <View style={[defaultStyle.center, { paddingRight: 20 }]}>
          <InputItem
            type="text"
            value={this.state.nickname}
            onChange={(value: any) => {
              this.setState({
                nickname: value
              });
            }}
            placeholder="请输入昵称"
          />
        </View>
        <ConfirmButtonGroup
          onCancel={() => {
            Navigation.dismissLightBox();
          }}
          onOk={() => {
            console.log("ok", this.state.nickname);
            //暂存后统一保存
            if (
              this.state.nickname.match(/[ ]/i) ||
              this.state.nickname.length < 2
            ) {
              Toast.fail("请输入昵称");
              return;
            }
            this.props.actions.prepareUserInfoAction(
              {
                nickname: this.state.nickname
              },
              res => {
                //console.log("res update nickname", res);
                Navigation.dismissLightBox();
              }
            );

            //直接更新接口
            /*this.props.actions.updateNicknameAction(
              {
                nickname: this.state.nickname
              },
              res => {
                console.log("res update nickname", res);
                Navigation.dismissLightBox();
              }
            );*/
          }}
        />
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state)
}))(UpdateNameForm);
