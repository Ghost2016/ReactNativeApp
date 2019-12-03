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
  Text,
  FlatList,
  //Button,
} from "react-native";
import ConnectWithActions from "@src/connectWithActions";
//import { List } from "../common/index";
import { Toast } from "antd-mobile";
import store from "@boot/store";
import { morningPunchTypeAction, morningPunchListAction } from "@boot/actions";
//import { getMorningTaskList } from "@src/selectors";
import * as navHelper from "@utils/navigationHelper";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import IntlText from "@sd_components/IntlText";
import SDRow from "@sd_components/SDRow";
import SDBox from "@sd_components/SDBox";
import SDButton from "@sd_components/SDButton";
import SDImage from "@sd_components/SDImage";
import SDLoading from "@sd_components/SDLoading";
import DotSelect from "@sd_components/DotSelect";
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

const iconPowerUp = require("@img/grow/growing_ico_score.png");

// 成长 - 每日打卡
class GrowCheckinItems extends React.PureComponent {
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    //intl: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }

  state = {
    loading: !this.hasTaskData() ? true : false,
    showPunchResult: false,
    punchResult: {
      sign: "+",
      number: 0.5
    }, //'',
    fadeAnim: new Animated.Value(0.1),
    checkinData: this.hasTaskData() ? this.loadTaskData(this.props) : []
  };

  hasTaskData(){
    return this.props.getMorningTaskList.length ? true : false
  }

  // onNavigatorEvent(event) {
  //   console.log("event[][]=======", event);
  //   if (event.id == "didAppear") {
  //     this.getPunchList();
  //   }
  // }

  updateTaskDataAction(){
    if(typeof this.props.updateTaskData === 'function') this.props.updateTaskData();
  }

  componentDidMount() {
    /*this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );*/
    if(!this.hasTaskData()){
      this.setState({
        loading: true
      });
      this.updateTaskDataAction();
      _getTodayMorningPunchList(this);
      //console.log("getMorningTaskList===",  this.props.getMorningTaskList)
    }
  }

  loadTaskData(props) {
    return props.getMorningTaskList.map((n, i) => {
      return {
        id: n.id,
        title: n.name, //n.title,
        caption: n.start_time ? `${n.start_time} - ${n.end_time}` : "", //"05:00 - 07:30",
        isCheck: n.is_check,
        isToday: n.is_today,
        startTime: n.start_time,
        endTime: n.end_time,
      };
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.getMorningTaskList != this.props.getMorningTaskList){
      this.setState({
        loading: false,
        checkinData: this.loadTaskData(nextProps)
      });
    }
  }

  //打卡
  onPressCheckin(title, isSelect, index, data) {
    let currentTime = 0
    let startTime = 0
    let endTime = 0
    let today = ""
    const loc = this.props.location && this.props.location.address
            ? this.props.location.address
            : "未知地点";
    console.log("onPressCheckin==xxx", data, data.title, isSelect, index, data.id, loc);

    currentTime = (new Date()).getTime();
    today = getDateObj(currentTime, true, false, false, "/");
    //startTime = (new Date(today + "T" + data.startTime)).getTime();
    startTime = (new Date(today + " " + data.startTime)).getTime();
    endTime = (new Date(today + " " + data.endTime)).getTime();
    //console.warn("currentTime===", currentTime)
    //console.warn("start===", (new Date("2018/08/03")).getTime())
    //console.warn("start time===", startTime, today + " " + data.startTime)
    //console.warn("end time===", endTime, today + " " + data.endTime)

    //return
    if (data.hasOwnProperty('isToday') && typeof data.isToday === 'boolean') {
      if (!data.isToday) {
        if (data.isCheck) {
          Toast.info("已经打过卡了哦～", 0.3);
          return false;
        } else {
          Toast.info("不能打卡咯～", 0.3);
          return false;
        }
        return;
      } else {
        if (data.isCheck) {
          Toast.info("已经打过卡了哦～", 0.3);
          return false;
        }
      }
    }

    if (data.isCheck) {
      Toast.info("已经打过卡了哦～", 0.3);
      return false;
    } else {
      //如果有打卡时间限制，需要检查
      if (data.startTime && data.endTime) {
        if(currentTime >= startTime && currentTime <= endTime){
        } else if(currentTime < startTime){
          Toast.info("打卡时间还未到！", 0.3);
          return false;
        } else if(currentTime > endTime){
          Toast.info("已经错过打卡时间！", 0.3);
          return false;
        } else {
          Toast.info("还没到打卡时间~", 0.3);
          return false;
        }
      }
      //return
    }

    if (!isSelect) this.props.actions.punchAction(
      {
        status: "new",
        location: loc,
        child_id: data.id,
        name: data.title
      },
      res => {
        console.log("punch res===", res)
        Toast.info("打卡成功！", 0.1)

        //职么力提升提示（暂不展示）
        /*this.setState({
          showPunchResult: true
        });*/
        /*Animated.timing(this.state.fadeAnim, {
          toValue: 1,
          easing: Easing.inOut(Easing.ease),
          duration: 800
        }).start();
        setTimeout(() => {
          Animated.timing(this.state.fadeAnim, {
            toValue: 0,
            easing: Easing.inOut(Easing.ease),
            duration: 3000
          }).start();
          setTimeout(() => {
            this.setState({
              showPunchResult: false
            });
            this.updateTaskDataAction();
          }, 4000);
        }, 3000);*/

        this.updateTaskDataAction();

      }
    );
    //description
    //Alert.alert("打卡成功");
    return true;
  }

  renderRow(_row, s, index) {
    const { titleWidth } = this.props;
    //console.log("row", row, s, index);
    const row = _row.item;
    return (
      <SDRow
        key={row.id}
        title={row.title}
        titleWidth={titleWidth}
        caption={row.caption}
        subtitle=""
        //styleName="dev sm-gutter"
        onPress={() => {}}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: sdStyles.SDHelperColorline,
          borderWidth: 0,
          borderColor: '#f00',

        }}
        rightIcon={
          row.isCheck ? (
            <SDButton
              style={{
                backgroundColor: "transparent",
                borderWidth: 0,
                borderColor: sdStyles.SDBGColorOrange,
                borderRadius: 0,
                width: CSS.pixel(250),
                zIndex: 3,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
              btnStyle={{
                fontSize: CSS.pixel(30),
                color: sdStyles.SDBGColorOrange
              }}
              outerStyle={{
                borderWidth: 0,
                borderColor: '#f00',
                position: "relative",
                top: CSS.pixel(Platform.OS === "android" ? 14 : 0, true),
              }}
              title={() => {
                return (
                  <DotSelect
                    title="已打卡"
                    reverseTitle="已打卡"
                    useIcon={true}
                    isSelect={true}
                    disable={false}
                    data={row}
                    index={0}
                    circleBorder={0}
                    onPress={this.onPressCheckin.bind(this)}
                    selectColor={sdStyles.SDBGColorOrange}
                    txtStyle={{
                      fontSize: CSS.pixel(30),
                      position: "relative",
                      left: CSS.pixel(0)
                    }}
                    isSmall={true}
                    style={{
                      alignSelf: "flex-start",
                      borderWidth: 0,
                      borderColor: sdStyles.SDBGColorOrange,
                      paddingLeft: Platform.OS == 'android' ? CSS.pixel(20) : 0,
                      alignSelf: 'center',
                    }}
                    iconStyle={{
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                      position: 'relative',
                      left: CSS.pixel(-16),
                    }}
                  />
                );
              }}
            />
          ) : (
            <SDButton
              style={{
                backgroundColor: "transparent",
                borderWidth: 0,
                borderColor: sdStyles.SDBGColorOrange,
                borderRadius: 0,
                width: CSS.pixel(250),
                zIndex: 3,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
              btnStyle={{
                fontSize: 18,
                color: sdStyles.SDBGColorOrange
              }}
              outerStyle={{
                //alignSelf: 'center',
                borderWidth: 0,
                borderColor: '#0ff',
                position: "relative",
                top: CSS.pixel(Platform.OS === "android" ? 14 : 0, true),
              }}
              onPress={() => {}}
              title={() => {
                return (
                  <DotSelect
                    title="未打卡"
                    reverseTitle="已打卡"
                    useIcon={true}
                    isSelect={false}
                    data={row}
                    index={0}
                    circleBorder={0}
                    onPress={this.onPressCheckin.bind(this)}
                    selectColor={sdStyles.SDBGColorOrange}
                    txtStyle={{
                      fontSize: CSS.pixel(30),
                      position: "relative",
                      left: CSS.pixel(0)
                    }}
                    isSmall={true}
                    style={{
                      alignSelf: "flex-start",
                      borderWidth: 0,
                      borderColor: sdStyles.SDBGColorOrange,
                      paddingLeft: Platform.OS == 'android' ? CSS.pixel(20) : 0,
                      alignSelf: 'center',
                    }}
                    iconStyle={{
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                      position: 'relative',
                      left: CSS.pixel(-16),
                    }}
                  />
                );
              }}
            />
          )
        }
      />
    );
  }

  render() {
    const { checkinData, fadeAnim } = this.state;
    return (
        <View
          style={{
            position: "relative",
            top: 0,
            left: 0,
            zIndex: 2
          }}
        >
          {this.state.loading ? <SDLoading style={{ width: "100%" }} /> : null}

          <FlatList
              keyExtractor={item => item.id + ""}
              data={checkinData}
              renderItem={this.renderRow.bind(this)}
              >
              </FlatList>

          {this.state.showPunchResult ? (
          <Animated.View
            style={{
              opacity: fadeAnim,
              width: CSS.pixel(300),
              height: CSS.pixel(262),
              justifyContent: "center",
              alignSelf: "center",
              position: "absolute",
              top: CSS.pixel(100, true),
              left: CSS.pixel(160),
              zIndex: 6
            }}
          >
            <SDImage
              source={iconPowerUp}
              style={{
                width: CSS.pixel(300),
                height: CSS.pixel(262),
                justifyContent: "center",
                alignSelf: "center"
                //position: 'absolute',
                //top: CSS.pixel(100, true),
                //left: CSS.pixel(160),
              }}
              imgStyle={{
                width: CSS.pixel(300),
                height: CSS.pixel(262)
              }}
              alt={() => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      position: "relative",
                      top: CSS.pixel(-140),
                      left: CSS.pixel(114)
                    }}
                  >
                    <Text
                      style={{
                        fontSize: CSS.pixel(40),
                        color: "#fff"
                      }}
                    >
                      +
                    </Text>
                    <Text
                      style={{
                        fontSize: CSS.pixel(40),
                        color: "#fff"
                      }}
                    >
                      0.5分
                    </Text>
                  </View>
                );
              }}
            />
          </Animated.View>
        ) : null}
        </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //user: getUserBaseInfo(state),
  location: state.location,
  //lightBox: state.lightBox,
}))(GrowCheckinItems);
