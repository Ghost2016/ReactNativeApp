// 数据查询页面
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  TextInput
} from "react-native";
import { Toast } from 'antd-mobile';
import ConfirmButtonGroup from "./ConfirmButtonGroup";
import defaultStyle from "@styles";
import { Navigation } from "react-native-navigation";
import ConnectWithActions from "@src/connectWithActions";
import { CSS } from "../../common/SDCSS";
import { isIphoneX } from "../../utils/iphonex";
import SDKeyboardSpacer from "../../common/SDKeyboardSpacer";
import { notValidField } from "../../utils/funcs";

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width - 40,
    height: 180,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: 'hidden',
    paddingTop: 10,

    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowColor: "#999",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4
  }
});

// 发送到邮件lightbox
class SendToEmailLightBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailText: this.props.user.email
    }
  }
  render() {
    return (
      <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.container}>
          <View style={{ justifyContent: "space-between", flex: 1 }}>
            <View style={[defaultStyle.center]}>
              <Text style={defaultStyle.fontSubColor} />
            </View>
            <View style={[defaultStyle.center]}>
              {/* <Text style={{color: '#333', fontSize: CSS.textSize(32)}}>确定要退出?</Text> */}
              <View style={{width: 300, paddingBottom: CSS.pixel(30), borderBottomColor: '#ddd', borderBottomWidth: 1}}>
                <TextInput onChangeText={(t) => {
                  this.state.emailText = t;
                }} defaultValue={this.props.user.email} style={{fontSize: CSS.textSize(30)}} placeholder="输入邮箱" underlineColorAndroid="transparent" />
              </View>
            </View>
            <ConfirmButtonGroup
              style={{borderTopWidth: 1}}
              onCancel={() => {
                Navigation.dismissLightBox();
              }}
              onOk={() => {
                // this.props.imgUrl;
                // this.props.actions.logoutAction({});
                // 判断邮箱格式

                if(notValidField(this.state.emailText, "email", "请输入合法邮箱")) {
                  return false;
                }

                // To 发送邮件

                Navigation.dismissLightBox();

                // 模拟发送成功
                Toast.success("发生成功");
              }}
            />
          </View>
        </View>
        <SDKeyboardSpacer
          topSpacing={isIphoneX() ? -34 : 0}
        />
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: state.user
}))(
  SendToEmailLightBox
);
