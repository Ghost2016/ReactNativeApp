/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  Alert,
  View,
  Text,
  ImageBackground,
  //Button,
} from "react-native";
import ConnectWithActions from "@src/connectWithActions";
import { getUserBaseInfo } from "@src/users/usersSelector";
//import { List } from "../common/index";
import * as navHelper from "@utils/navigationHelper";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";
import IntlText from "@sd_components/IntlText";
import SDRow from "@sd_components/SDRow";
import SDBox from "@sd_components/SDBox";
import SDButton from "@sd_components/SDButton";
import SDImage from "@sd_components/SDImage";
import { getDateObj, weekDay, chineseDateNum, paddingZero, shareToWxTimeLine, shareToWxFriends, countHour, prepareShareData } from "../utils/funcs";
import ShareButton from "@src/sd_shareButton/ShareButton";
import * as HOSTS from "@src/host";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const styles2 = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: width * 0.8,
    height: height * 0.8
  }
});

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width - 20,
    height: Dimensions.get("window").height * 0.5,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    paddingTop: 10,

    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowColor: "#999",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4
  }
});

class SDBoxTitle extends React.PureComponent<Props> {
  props: Props;
  render() {
    const { data, res, content } = this.props;
    //finish_time:"2018-07-26T17:14:17.811226"
    const d = (res && res.results && res.results.finish_time) ? getDateObj(res.results.finish_time, false, true) : getDateObj(undefined, false, true)
    const weekday = chineseDateNum(weekDay(d.y, d.m, d.d));
    const time = `${d.y}/${paddingZero(d.m)}/${paddingZero(d.d)} ${paddingZero(d.h)}:${paddingZero(d.i)}`;
    const _title = data.task.title || data.task.name;
    return (
      <ImageBackground
          resizeMode="cover"
          borderRadius={0}
          style={{
            width: "100%", //CSS.pixel(width),
            height: CSS.pixel(180, true),
            borderWidth: 0,
            borderColor: "#f00",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          source={require("@img/grow/growing_ico_Popup_head.png")}
        >
        <View
          style={{
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            width: '100%',
            //height: CSS.pixel(60, true),
            borderWidth: 0,
            borderColor: "#f00",
            position: 'relative',
            top: CSS.pixel(10, true),
          }}
        >
          <Text style={{ color: "#fff", fontSize: CSS.textSize(30),
            lineHeight: 22, }}>你已完成任务</Text>
          <Text style={{ color: "#fff", fontSize: CSS.textSize(34),
            lineHeight: 26 }}>
            《{data.course ? data.course.name : _title}》
          </Text>
          <Text style={{ color: "#fff", fontSize: CSS.textSize(24),
            lineHeight: 22 }}>
            星期{weekday} {time}
          </Text>
        </View>
      </ImageBackground>
    );
  }
}

const shareToWeixin = require("@img/share2.png");
const shareToFriend = require("@img/share3.png");

// 成长 - 阅读打卡完成
class GrowReadOk extends React.PureComponent<Props> {
  props: Props;
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }

  state = {
    upPower: 0,
  };

  prepareShareData_old(data, targetName = "职场技能"){
    const title = data.content ? data.content : (data.data.course ? data.data.course.name : data.data.task.name);
    const {nickname, gender, avatar, power, salary} = this.props.userInfo;
    const task = (this.props.userInfo.total.certificate_count ? this.props.userInfo.total.certificate_count : 0) + (this.props.userInfo.total.tech_count ? this.props.userInfo.total.tech_count : 0);
    //power, salary, skill, up, targetName
    const url = `${HOSTS.SHARE}/#/?skill=${targetName}&name=${nickname}&gender=${gender}&school=${this.props.userInfo.total.school_name}&major=${this.props.userInfo.total.major_name}&degree=${this.props.userInfo.total.degree_name}&power=${power.toString().slice(0, 4)}&salary=${salary}&up=${this.state.upPower}&task=${task}`+(avatar && avatar.file_name ? `&userpic=${avatar.file_name}` : '');
    console.log("url wx====", url, this.props.userInfo);
    return {
      type: "news",
      title: `${this.props.user.name}在职么开门里完成任务${
        title
      },大家也来试试👊`,
      description: `${
        this.props.user.name
      }在职么开门里完成任务${
        title
      },大家也来试试👊`,
      webpageUrl: url,
    };
  }

  onPressShareFriends = data => {
    //console.log("onPressShareFriends data===", data)
    /* shareToWxFriends(data.content ? data.content : (data.data.course ? data.data.course.title : data.data.task.name)) */
    shareToWxFriends(prepareShareData(data, this.props.userInfo, this.props.targetName))
  };

  onPressShare = data => {
    //console.log("onPressShare data===", data)
    shareToWxTimeLine(prepareShareData(data, this.props.userInfo, this.props.targetName))
  };

  componentDidMount() {
    //console.log("this.context.navigator", this.context.navigator);
  }

  onPressDismiss() {
    this.context.navigator.dismissLightBox();
  }

  //打卡
  onPressCheckin() {
    console.log("onPressCheckin", 1);
    Alert.alert("打卡成功");
  }

  //查看打卡详情(直接调用无法打开下一页，通过refs调用父页面跳转函数)
  onPressCalendar() {
    this.context.navigator.dismissLightBox();
    const q = new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 400);
    });
    q.then(data => {
      //this.context.refs["_growScreen"].onPressCheckinDetail();
    });
  }

  render() {
    const { style, data, res, content, targetName } = this.props;
    let timeExpense = false;
    let upPower = 0;
    let startTime = 0;
    let endTime = 0;
    let timeExpenseHour = 0;
    if(res && res.results && res.results.start_time && res.results.finish_time){
      timeExpense = true;
      upPower = res.results.up_power;
      this.setState({
        upPower: upPower,
      })
      timeExpenseHour = countHour(res.results.start_time, res.results.finish_time);
      console.log("res=====", res,timeExpenseHour)
    }

    return (
      <SDBox
        title={() => <SDBoxTitle data={data} />}
        btnTitle={null}
        onPress={this.onPressCalendar.bind(this)}
        btnStyle={{
          backgroundColor: "transparent"
        }}
        buttonInnerStyle={{
          backgroundColor: "transparent"
        }}
        buttonInnerFontStyle={{
          color: sdStyles.SDMainColor
        }}
        style={style}
      >
        <View style={{ flexDirection: "column", padding: 15 }}>
          <View style={{ flexDirection: "row", marginVertical: 10 }}>
            {parseFloat(upPower) > 0 ? <Text style={{ color: sdStyles.SDFontColorSubtitle, fontSize: CSS.textSize(26), }}>
              职么力增长
            </Text>:null}
            {parseFloat(upPower) > 0 ? <Text
              style={{
                color: sdStyles.SDFontColorMain,
                fontSize: CSS.textSize(36),
                position: "relative",
                top: -5,
                paddingHorizontal: 2
              }}
            >
              {upPower}分，
            </Text> : null}
            <Text style={{ color: sdStyles.SDFontColorSubtitle, fontSize: CSS.textSize(26) }}>
              职么开门陪你一起成长
            </Text>
          </View>

          {timeExpense ? <View style={{ flexDirection: "row", marginVertical: 10 }}>
            <Text style={{ color: sdStyles.SDFontColorSubtitle, fontSize: CSS.textSize(26) }}>
              任务用时：
            </Text>
            <Text style={{ color: sdStyles.SDFontColorMain, fontSize: CSS.textSize(26) }}>{timeExpenseHour}小时</Text>
          </View> : null}

          <View style={{
            flexDirection: "row",
            marginVertical: 10,
            overflow: 'hidden',
             }}>
            <Text style={{
              color: sdStyles.SDFontColorMain,
              lineHeight: 25,fontSize: CSS.textSize(26)
               }}>
              {data.course ? content : ""}
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              height: 1,
              borderTopWidth: 1,
              borderTopColor: sdStyles.SDHelperColorline,
              position: "relative",
              top: 0,
              zIndex: 2,
              marginTop: 20
            }}
          />
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              top: -10,
              zIndex: 3
            }}
          >
            <Text
              style={{
                textAlign: "center",
                backgroundColor: "#fff",
                width: 60,
                fontSize: CSS.textSize(24)
              }}
            >
              分享至
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <SDImage
              style={{ marginHorizontal: 10 }}
              data={{
                data: data,
                content: content,
              }}
              source={shareToWeixin}
              onPress={this.onPressShareFriends.bind(this)}
              alt="微信好友"
            />
            <SDImage
              style={{ marginHorizontal: 10 }}
              data={{
                data: data,
                content: content,
              }}
              source={shareToFriend}
              onPress={this.onPressShare.bind(this)}
              alt="朋友圈"
            />
          </View>
        </View>
      </SDBox>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state),
  userInfo: state.user,
}))(GrowReadOk);