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
    width: CSS.pixel(670),
    height: CSS.pixel(320),
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingTop: 10,
    overflow: 'hidden'

    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.2,
    // shadowRadius: 5,
    // shadowColor: "#999",
    // //注意：这一句是可以让安卓拥有灰色阴影
    // elevation: 4
  }
});

type Props = {
  title: string,
  onCancel: Function,
  onOk: Function
};

// 退出系统lightbox
export class ConfirmLightBoxScreen extends React.PureComponent<Props> {
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
            {typeof this.props.title == "function" ? this.props.title() : <Text style={{
              color: '#333',
              fontSize: CSS.textSize(30)
            }}>{this.props.title}</Text>}
          </View>
          <ConfirmButtonGroup
            onCancel={() => {
              this.props.onCancel &&
                this.props.onCancel instanceof Function &&
                this.props.onCancel();
              Navigation.dismissLightBox();
            }}
            onOk={() => {
              this.props.onOk &&
                this.props.onOk instanceof Function &&
                this.props.onOk();
              Navigation.dismissLightBox();
            }}
          />
        </View>
      </View>
    );
  }
}
