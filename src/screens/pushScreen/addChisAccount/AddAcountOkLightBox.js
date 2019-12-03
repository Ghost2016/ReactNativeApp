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
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import { dismissLightBox, navScreen } from "../../../styles";
import { educationModel } from "../../../types";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { CSS } from "../../../common/SDCSS";

const styles = StyleSheet.create({});

type Props = {
  education: educationModel
};

// 提示绑定学校成绩
export default class AddAcountOkLightBox extends React.PureComponent<Props> {
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
            paddingHorizontal: CSS.pixel(50),
            paddingTop: CSS.pixel(70),
            flex: 1
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                fontSize: CSS.pixel(34),
                color: "#333",
                fontWeight: "700"
              }}
            >
              提示
            </Text>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: CSS.pixel(78)
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: CSS.pixel(28),
                color: "#333",
                lineHeight: CSS.pixel(40)
              }}
            >
              验证需要一定时间，验证成功后将自动同步。
            </Text>
          </View>

          <View style={{ height: CSS.pixel(120), width: "100%" }} />
        </View>

        <SDTouchOpacity
          onPress={() => {
            dismissLightBox();
            if (this.context.refs["_addSchoolAccount"]) {
              this.context.refs["_addSchoolAccount"].context.navigator.pop();
              return;
            }
            if(this.context.refs["_importSchoolCourse"]) {
              this.context.refs["_importSchoolCourse"].context.navigator.pop();
              return;
            }
          }}
          style={{
            backgroundColor: "#fed200",
            height: CSS.pixel(80),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: CSS.pixel(30), color: "#333" }}>
            我知道了
          </Text>
        </SDTouchOpacity>
      </View>
    );
  }
}
