import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Dimensions
} from "react-native";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor } from "../../../styles";
import { CSS } from "../../../common/SDCSS";

export default class EditButton extends React.PureComponent {
  render() {
    return (
      <SDTouchOpacity
        onPress={this.props.onPress ? this.props.onPress : null}
        style={{
          width: CSS.pixel(120),
          height: CSS.pixel(50),
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          marginRight: CSS.pixel(10)
        }}
      >
        <Image
          source={require("@img/my/TrackRecord/mine_Resume_btn_edit.png")}
        />
      </SDTouchOpacity>
    );
  }
}
