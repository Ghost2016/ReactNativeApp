import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { CSS } from "../../../../common/SDCSS";
import { SDMainColor, navScreen } from "../../../../styles";
import SDTouchOpacity from "../../../../common/SDTouchOpacity";
import LiveCourseDetailScreen from "../../liveCourse/LiveCourseDetailScreen";

// 我的-导师资料简介
export default class MasterProfileInfo extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: () => null
  };

  render() {
    return (
        <View style={{alignItems: 'center', flex: 1, paddingHorizontal: CSS.pixel(40), paddingVertical: CSS.pixel(20)}}>
          <View style={{
            borderRadius: CSS.pixel(8),
            borderColor: SDMainColor,
            // borderWidth: 1,
            width: CSS.pixel(100),
            height: CSS.pixel(100),
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {this.props.group.teacher_avatar ? <Image resizeMode="cover" style={{width: CSS.pixel(100),height: CSS.pixel(100)}} source={{uri: this.props.group.teacher_avatar.url}}/> : 
            this.props.group.teacher_gender && this.props.group.teacher_gender == 'female' ? <Image resizeMode="cover" style={{width: CSS.pixel(100),height: CSS.pixel(100)}} source={require("@img/female_master.png")}/>:
            <Image resizeMode="cover" style={{width: CSS.pixel(100),height: CSS.pixel(100)}} source={require("@img/male_master.png")}/>}
          </View>
          <View style={{
            marginTop: CSS.pixel(10, true),
            alignItems: 'center'
          }}>
            <Text style={{fontSize: CSS.textSize(28), color: '#333', fontWeight:'600', fontFamily: "PingFang SC"}}>{this.props.group.teacher_name}</Text>
          </View>
          <View style={{
            marginTop: CSS.pixel(16, true),
            alignItems: 'center'
          }}>
            <Text numberOfLines={3} style={{textAlign: 'left', lineHeight: CSS.textSize(34), fontSize: CSS.textSize(24), color: '#333', fontFamily: "PingFang SC"}}>
              {this.props.group.introduction}
            </Text>
          </View>
          <View style={{width: '100%', marginTop: CSS.pixel(20, true), alignItems: 'center'}}>
            <SDTouchOpacity onPress={() => {
              this.context.navigator.push(navScreen("PushScreen", "课程详情", {
                passProps: {
                  screen: () => <LiveCourseDetailScreen liveData={this.props.group} noToolbar/>,
                  noScrollView: true,
                  fullScreen: true,
                }
              }))
            }}>
                <Text style={{fontSize: CSS.textSize(24), color: SDMainColor, fontFamily: 'PingFang SC'}}>查看课程详情 >></Text>
            </SDTouchOpacity>
          </View>
        </View>
    );
  }
}

