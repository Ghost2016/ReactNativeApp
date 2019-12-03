/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../connectWithActions";
import { CSS } from "../common/SDCSS";
import { dismissLightBox, navScreen } from "../styles";
import { CourseItem } from "./LearnCourse";
import ImportSchoolCourse from "./ImportSchoolCourse";

const styles = StyleSheet.create({});

type Props = {
    checkCodeUrl: string
};

// 我的履历 - 提示输入验证码弹窗
export default class CheckCodeLightBox extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };
  render() {
    return (
      <View
        style={{
          position: "absolute",
          width: Dimensions.get("window").width - 2 * 30,
          left: 30,
          top: 200,
          backgroundColor: "#fff",
          borderRadius: 5,
          overflow: "hidden"
        }}
      >
        <View
          style={{
            position: "absolute",
            right: CSS.pixel(30),
            top: CSS.pixel(30)
          }}
        >
          <TouchableOpacity
            onPress={() => {
              dismissLightBox();
            }}
          >
            <Image source={require("@img/my/TrackRecord/mine_Resume_delete.png")} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: CSS.pixel(80, true), alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>验证码</Text>
        </View>
        <View
          style={{
            alignItems: "center",
            marginVertical: CSS.pixel(60, true),
            paddingHorizontal: CSS.pixel(30)
          }}
        >
            {/* <Image /> */}
            <View style={{height: 40, width: 200, justifyContent: 'center', alignItems: 'center'}}>
                <Text>efas</Text>
            </View>
            <View style={{padding: 10, width: 200, justifyContent: 'center', borderWidth: 1, borderColor: '#efefef', marginTop: CSS.pixel(30, true)}}>
                <TextInput returnKeyLabel="完成" returnKeyType="done" style={{borderWidth: 0}} placeholder="输入上方验证码" underlineColorAndroid="transparent" />
            </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            dismissLightBox();
          }}
          style={{
            marginTop: CSS.pixel(40),
            backgroundColor: "#fed200",
            height: CSS.pixel(80),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: CSS.textSize(30), color: "#333" }}>确定</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
