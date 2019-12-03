// 数据查询页面
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions
} from "react-native";
import ConfirmButtonGroup from "./ConfirmButtonGroup";
import defaultStyle from "@styles";
import { Navigation } from "react-native-navigation";
import ConnectWithActions from "@src/connectWithActions";
import { CSS } from "../../common/SDCSS";

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

// 退出系统lightbox
class ExitAppLightBoxScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: "space-between", flex: 1 }}>
          <View style={[defaultStyle.center]}>
            <Text style={defaultStyle.fontSubColor} />
          </View>
          <View style={[defaultStyle.center]}>
            <Text style={{color: '#333', fontSize: CSS.textSize(32)}}>确定要退出?</Text>
          </View>
          <ConfirmButtonGroup
            style={{borderTopWidth: 0}}
            onCancel={() => {
              Navigation.dismissLightBox();
            }}
            onOk={() => {
              this.props.actions.logoutAction({});
            }}
          />
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(
  ExitAppLightBoxScreen
);
