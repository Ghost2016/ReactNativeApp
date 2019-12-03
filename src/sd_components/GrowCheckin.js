/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Platform,
  ScrollView,
  Alert,
  View,
  Text
  //Button,
} from "react-native";
import ConnectWithActions from "@src/connectWithActions";
//import { List } from "../common/index";
import { Toast } from "antd-mobile";
import store from "@boot/store";
import { morningPunchTypeAction, morningPunchListAction } from "@boot/actions";
import { getMorningTaskList } from "@src/selectors";
import * as navHelper from "@utils/navigationHelper";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import IntlText from "@sd_components/IntlText";
import SDRow from "@sd_components/SDRow";
import SDBox from "@sd_components/SDBox";
import GrowCheckinItems from "@sd_components/GrowCheckinItems";
import { getDateObj, _getTodayMorningPunchList } from "@utils/funcs";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

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

// 成长 - 每日打卡
class GrowCheckin extends React.PureComponent {
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }

  state = {
  };

  getPunchList() {
    _getTodayMorningPunchList(this);
  }

  getPunchTypeList() {
    this.props.actions.punchTypeListAction({}, res => {
      console.log("morning type res===", res);
      store.dispatch(morningPunchTypeAction(res.results));
    });
  }

  updateTaskData(){
    this.getPunchTypeList();
    this.getPunchList();
  }

  onNavigatorEvent(event) {
    console.log("event=======", event);
    /*if (event.id == "didAppear") {
      this.getPunchList();
    }*/
  }

  componentDidMount() {
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );

  }

  onPressDismiss() {
    this.context.navigator.dismissLightBox();
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
      this.context.refs["_homeScreen"].gotoCalendar();
    });
  }

  render() {
    const { style } = this.props;
    const { checkinData, fadeAnim } = this.state;
    return (
      <SDBox
        title="每日打卡"
        btnTitle="查看月汇总 >>"
        onPress={this.onPressCalendar.bind(this)}
        style={[{
          flexDirection: "column",
          alignItems: "center"
        }, style]}
        btnStyle={{
          backgroundColor: "transparent"
        }}
        buttonInnerStyle={{
          backgroundColor: "transparent"
        }}
        buttonInnerFontStyle={{
          color: sdStyles.SDMainColor
        }}
      >
        <GrowCheckinItems
          getMorningTaskList={this.props.getMorningTaskList}
          updateTaskData={this.updateTaskData.bind(this)}
          titleWidth={CSS.pixel(800)}
           />

      </SDBox>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //user: getUserBaseInfo(state),
  location: state.location,
  lightBox: state.lightBox,
  getMorningTaskList: getMorningTaskList(state)
}))(GrowCheckin);
