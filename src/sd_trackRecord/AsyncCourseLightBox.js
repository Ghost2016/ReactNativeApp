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
  Keyboard
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../connectWithActions";
import { CSS } from "../common/SDCSS";
import { dismissLightBox, navScreen, SDMainColor } from "../styles";
import { educationModel } from "../types";
import SDTouchOpacity from "../common/SDTouchOpacity";
import { getUserId } from "../directSelectors";

const styles = StyleSheet.create({});

type Props = {
  education: educationModel
};

let courseImportScreen = null;

// 我的履历 - 提示正在导入成绩
class AsyncCourseLightBox extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    if (this.context.refs['_importSchoolCourse']) {
      courseImportScreen = this.context.refs['_importSchoolCourse'];
    }
  }
  componentWillUnmount() {
    this.props.actions.getCourseListAction({
      id: this.props.userId,
      size: 999
    });
  }
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
        <View style={{flex: 1, paddingHorizontal: CSS.pixel(50), paddingVertical: CSS.pixel(70)}}>
          <View style={{alignItems: "center", justifyContent: 'center'}}>
            <Text style={{ fontSize: CSS.textSize(34), color: '#333', fontWeight: "600" }}>{this.props.education.school.name + " " + this.props.education.degree.name + "·" + this.props.education.major.name}</Text>
          </View>

          <View style={{marginTop: CSS.pixel(68), justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{lineHeight: CSS.pixel(44), textAlign:'center', color: '#333', fontSize: CSS.textSize(30), fontWeight: "600" }}>{this.props.isReFetch ? "系统将重新同步你的教育信息并导入在校课程" : "教务系统账号绑定成功！系统将同步认证你的教育信息并导入在校课程"}</Text>
          </View>

          <View style={{marginTop: CSS.pixel(40)}}>
            <Text style={{lineHeight: CSS.pixel(44), fontSize: CSS.pixel(28), color: '#666', lineHeight: 24}}>
              成绩获取需要一定时间，获取后系统会自动将你的在校成绩导入个人履历中
            </Text>
          </View>
        </View>
    
        <SDTouchOpacity
          onPress={() => {
            dismissLightBox();
            if (courseImportScreen && !this.props.isReFetch) {
              courseImportScreen.exit();
            }
          }}
          style={{
            backgroundColor: SDMainColor,
            height: CSS.pixel(80),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: CSS.textSize(30), color: "#333" }}>我知道了</Text>
        </SDTouchOpacity>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userId: getUserId(state)
}))(AsyncCourseLightBox)