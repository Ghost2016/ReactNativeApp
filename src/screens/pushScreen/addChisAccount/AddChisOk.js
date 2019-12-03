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
import { CSS } from "../../../common/SDCSS";
import LabelInput from "../../../common/SDLabelInput";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor, navLightBox, navScreen } from "../../../styles";
import { educationModel } from "../../../types";

export default class AddChisOk extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: () => null,
    refs: () => null
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: CSS.pixel(120),
            paddingBottom: CSS.pixel(60)
          }}
        >
          <Image source={require("@img/my/ming_ico_Success.png")} />
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#333", fontSize: CSS.pixel(36) }}>
            学信网账号正在审核中
          </Text>
        </View>

        <SDTouchOpacity
          onPress={() => {
            this.context.navigator.pop({
              animated: false,
              animationType: "fade"
            });
            this.context.navigator.pop({
                animated: true,
                animationType: "fade"
            })
          }}
          style={{
            marginTop: CSS.pixel(120),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            style={{
              backgroundColor: SDMainColor,
              width: CSS.pixel(550),
              height: CSS.pixel(80),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: CSS.pixel(40)
            }}
          >
            <Text style={{ color: "#333", fontSize: CSS.pixel(32) }}>完成</Text>
          </View>
        </SDTouchOpacity>
      </View>
    );
  }
}
