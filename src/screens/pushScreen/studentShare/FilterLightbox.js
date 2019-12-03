import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { isIphoneX } from "../../../utils/iphonex";
import { CSS } from "../../../common/SDCSS";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { dismissLightBox } from "../../../styles";

export default class FilterLightbox extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  render() {
    return (
      <View
        style={{
          position: "absolute",
          width: 120,
          top:
            Platform.OS === "ios" ? (isIphoneX() ? 88 - 20 : 64 - 20) : 50 - 20,
          right: 10,
          paddingTop: 30,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View
          style={{
            width: 0,
            height: 0,
            borderColor: "transparent",
            borderWidth: 10,
            borderBottomColor: "#fff",
            position: "absolute",
            right: 7,
            top: 12
          }}
        />
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 5,
            overflow: "hidden",
            width: 120
          }}
        >
          <SDTouchOpacity
            style={{
              height: 40,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              borderBottomColor: "#efefef",
              borderBottomWidth: 1,
              flex: 1,
              paddingLeft: CSS.pixel(30)
            }}
            onPress={() => {
              if (this.context.refs["_studentShare_"+this.props.categoryId]) {
                this.context.refs["_studentShare_"+this.props.categoryId].reloadData();
              }
              dismissLightBox();
            }}
          >
            <Image source={require("@img/home/growing_ico_screen_new.png")} />
            <Text style={{ marginLeft: 10, fontSize: 16, color: "#333" }}>
              最新
            </Text>
          </SDTouchOpacity>
          <SDTouchOpacity
            style={{
              height: 40,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingLeft: CSS.pixel(30),
              flex: 1
            }}
            onPress={() => {
              if (this.context.refs["_studentShare_"+this.props.categoryId]) {
                this.context.refs["_studentShare_"+this.props.categoryId].state.isUse = true;
                this.context.refs["_studentShare_"+this.props.categoryId].reloadData(null, true);
              }
              dismissLightBox();
            }}
          >
            <Image source={require("@img/home/growing_ico_screen_good.png")} />
            <Text style={{ marginLeft: 10, fontSize: 16, color: "#333" }}>
              最有用
            </Text>
          </SDTouchOpacity>
        </View>
      </View>
    );
  }
}
