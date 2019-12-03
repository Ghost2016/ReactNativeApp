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
import { dismissLightBox } from "../../styles";

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "transparent",
    position: 'relative'
  }
});

// 全屏透明LightBox
export default class LightBoxScreen extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const resetStyle = this && this.props && this.props.style ? this.props.style : {};
    return (
      <View style={[styles.container, {...resetStyle}]}>
        <TouchableOpacity style={{width: '100%', height: '100%', zIndex: 0}} activeOpacity={1} onPress={() => {
          this.props.tapBackgroundToDismiss !== false ? dismissLightBox() : null;
        }}>
        </TouchableOpacity>
        {this && this.props && this.props.screen ? this.props.screen() : null}
      </View>
    );
  }
}