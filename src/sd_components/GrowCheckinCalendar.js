/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity
} from "react-native";
import ConnectWithActions from "@src/connectWithActions";
import { getUserBaseInfo } from "@src/users/usersSelector";
//import { List } from "../common/index";
import * as navHelper from "@utils/navigationHelper";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import store from "@boot/store";
import { morningPunchTypeAction, morningPunchListAction } from "@boot/actions";
//import { InputItem } from "antd-mobile";
import IntlText from "@sd_components/IntlText";
import ButtonSection from "@sd_components/ButtonSection";
import FootSpace from "@sd_components/FootSpace";
import SDTag from "@sd_components/SDTag";
import SDRow from "@sd_components/SDRow";
import DotArrow from "@sd_components/DotArrow";
import SDCalendar from "@sd_components/SDCalendar";
import SDLoading from "@sd_components/SDLoading";
import FlowTitle from "@sd_components/FlowTitle";
import {
  getDateObj,
  daysInMonth,
  weekDay,
  chineseDateNum,
  paddingZero,
  getDayByMonthForSearch,
} from "@utils/funcs";
import GrowCheckinItems from "@sd_components/GrowCheckinItems";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  sdTabs: {
    borderTopWidth: 1,
    borderTopColor: sdStyles.SDHelperColorline,
    //marginTop: 15,
    backgroundColor: sdStyles.SDBGColorMain
  }
});

const iconLeft = require('@img/grow/growing_btn_time_left_dis.png');
const iconLeftActive = require('@img/grow/growing_btn_time_left_nor.png');
const iconRight = require('@img/grow/growing_btn_time_right_dis.png');
const iconRightActive = require('@img/grow/growing_btn_time_right_nor.png');

// 成长 - 每日打卡详情
class GrowCheckinCalendar extends React.PureComponent {
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }

  state = {
    loading: true,
    d: getDateObj(),
    today: getDateObj(),
    isShowToday: true,
    puchDaysNum: 0,
    scheduledPunchLength: 0,
    checkinData: [],
    objMonthly: {},
    todayTaskList: [],
    todayTaskShowList: [],
    punchMorningTypeList: [],
    showFutureAlert: false,
  };

  chkSameMonth() {
    setTimeout(() => {
      const { d, today } = this.state;
      const isToday = d.y == today.y && d.m == today.m ? true : false;
      this.setState({
        isShowToday: isToday ? true : false
      });
    }, 500);
  }

  componentDidMount() {
    this.getPunchTypeList().then(res => {
      this.onPressCurrentMonth();
    })
    //通过ref访问 homeScreen
    this.context.refs["_GrowCheckinCalendar"] = this;
  }

  isThisMonth(y, m, day = null) {
    let { today } = this.state;
    if (day) today = day;
    return (today.y == y && today.m == m) ? true : false;
  }

  isToday(y, m, d, day = null) {
    let { today } = this.state;
    if (day) today = day;
    //console.log("isToday===", today, y, m, d, (today.y == y && today.m == m && today.d == d))
    return (today.y == y && today.m == m && today.d == d) ? true : false;
  }

  isTomorrow(y, m, d, day = null) {
    let { today } = this.state;
    if (day) today = day;
    const tomorrow = new Date(`${today.y}-${paddingZero(today.m)}-${paddingZero(today.d + 1)}`).getTime();
    const temp = new Date(`${y}-${paddingZero(m)}-${paddingZero(d)}`).getTime();
    //console.log("isTomorrow[][]==", tomorrow, temp)
    return temp >= tomorrow ? true : false;
  }

  getPunchListMonthly = (state) => {
    /* this.setState({
      puchDaysNum: 0
    }); */
    return new Promise((resolve, reject) => {
      this.props.actions
        .punchListAction(
          {
            target: "morning",
            start_date: state.start_time,
            end_date: state.end_time,
            size: 32,
            page: 1
          },
          res => {}
        )
        .then(res => {
          console.log(
            "getPunchListMonthly===",
            state.start_time,
            state.end_time,
            res
          );
          let arr = [];
          let listArr = [];
          this.state.objMonthly = {};
          let y, m, d;
          res.results.map((n, i) => {
            if (n.children && n.children.length) {
              if (
                  n.created_time.match(/^([0-9]{4})\-([0-9]{2})\-([0-9]{2})/i)
                ) {
                y = parseInt(RegExp.$1, 10);
                m = parseInt(RegExp.$2, 10);
                d = parseInt(RegExp.$3, 10);

                if (this.isToday(y, m, d)) {
                  listArr.push(n)
                }

                n.children.map((n2, i2) => {
                    //console.log("this.isToday", this.isToday(y, m, d), y, m, d)
                    if (this.isToday(y, m, d)) {
                      arr.push({
                        title: n2.title,
                        caption: n2.start_time
                          ? `${n2.start_time} - ${n2.end_time}`
                          : "",
                        created_time: n2.created_time
                      });
                    }
                    this.state.objMonthly[d] = {
                      isCheckin: true,
                      isFuture: this.isTomorrow(y, m, d) ? true : false
                    };
                });
              }

            }
          });
          console.log("checkinData==== arr", arr);
          //console.log("objMonthly====", this.state.objMonthly);
          this.setState({
            loading: false,
            puchDaysNum: Object.keys(this.state.objMonthly).length, //res.results.length,
            checkinData: arr,
            todayTaskList: listArr,
          });
          //store.dispatch(morningPunchListAction(res.results));

          resolve(this.state.objMonthly);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  onPressConfirm = () => {
    /*this.context.navigator.showInAppNotification({
      screen: 'example.Types.Notification',
    });*/
    navHelper.navOpen(this.context.navigator, "push", {
      name: "GrowMakeGoal2Screen",
      title: "制定目标"
      //tabBarHidden: true
    });
  };

  setNewDate(newDate) {
    let d = getDateObj(newDate)
    if(this.isThisMonth(d.y, d.m, getDateObj())){
      d = getDateObj()
    }
    return new Promise(resolve => {
      this.setState({
        d: d,
        isShowToday: false
      });
      setTimeout(() => {
        resolve(true);
      }, 10);
    });
  }

  setToday(newDate) {
    const d = getDateObj(`${this.state.d.y}-${paddingZero(this.state.d.m)}-${paddingZero(newDate.title)}`)
    //console.log("setToday ===", d)
    const showFutureAlert = this.isTomorrow(d.y, d.m, d.d, getDateObj()) ? true : false;
    //console.log("showFutureAlert ===", showFutureAlert, d, getDateObj())
    return new Promise(resolve => {
      this.setState({
        showFutureAlert: showFutureAlert,
        loading: true,
        today: d,
        d: d,
        //isShowToday: this.isToday(d.y, d.m, d.d, getDateObj()) ? true : false
      });
      setTimeout(() => {
        let newDate = `${d.y}-${paddingZero(d.m)}-01`;
        /* let newEndDate = `${d.y}-${paddingZero(d.m)}-${paddingZero(
          daysInMonth(d.y, d.m)
        )}`; */
        let newEndDate = `${d.y}-${paddingZero(d.m+1)}-01`;
        if(d.m+1 > 12) newEndDate = `${d.y+1}-01-01`;
        //let [newDate, newEndDate] = getDayByMonthForSearch(d, true)
        this.getPunchListMonthly({
            start_time: newDate,
            end_time: newEndDate
        }).then(data => {
          //console.log("updateTaskData === ", data)
          this.getTodayTaskList();
        })
        resolve(true);
      }, 10);
    });
  }

  onPressBackMonth() {
    //navHelper.snackBar(this.context.navigator, "onPressBackMonth: ");
    const d = this.state.d;
    let newDate = "";
    let newEndDate = "";
    if (d.m == 1) {
      newDate = `${d.y - 1}-12-01`;
      /* newEndDate = `${d.y - 1}-12-${paddingZero(
        daysInMonth(d.y - 1, 12)
      )}`; */
      newEndDate = `${d.y}-01-01`;
    } else {
      newDate = `${d.y}-${paddingZero(d.m - 1)}-01`;
      /* newEndDate = `${d.y}-${paddingZero(d.m - 1)}-${paddingZero(
        daysInMonth(d.y, d.m - 1)
      )}`; */
      newEndDate = `${d.y}-${paddingZero(d.m)}-01`;
    }

    //let [newDate, newEndDate] = getDayByMonthForSearch(d, false)
    console.log("back[][][][]", getDateObj(newDate), newDate)
    return this.setNewDate(newDate).then(data => {
      this.chkSameMonth();
      return this.getPunchListMonthly({
        start_time: newDate,
        end_time: newEndDate
      });
    }).then(data => {
        //console.log("updateTaskData === ", data)
        this.getTodayTaskList();
      })
  }

  onPressNextMonth() {
    //navHelper.snackBar(this.context.navigator, "onPressNextMonth: ");
    const d = this.state.d;
    let newDate = "";
    let newEndDate = "";
    if (d.m == 12) {
      newDate = `${d.y + 1}-01-01`;
      //newEndDate = `${d.y + 1}-01-${paddingZero(daysInMonth(d.y + 1, 1))}`;
      newEndDate = `${d.y + 1}-02-01`;
    } else {
      newDate = `${d.y}-${paddingZero(d.m + 1)}-01`;
      /* newEndDate = `${d.y}-${paddingZero(d.m + 1)}-${paddingZero(
        daysInMonth(d.y, d.m + 1)
      )}`; */
      newEndDate = `${d.y}-${paddingZero(d.m + 2)}-01`;
      if(d.m + 2 > 12) newEndDate = `${d.y+1}-01-01`;
    }
    //console.log("next[][][][]", getDateObj(newDate), newDate)
    //let [newDate, newEndDate] = getDayByMonthForSearch(d, true)
    //console.log("next[][][][]", getDateObj(newDate), newDate)
    return this.setNewDate(newDate).then(data => {
      this.chkSameMonth();
      return this.getPunchListMonthly({
        start_time: newDate,
        end_time: newEndDate
      });
    }).then(data => {
        //console.log("updateTaskData === ", data)
        this.getTodayTaskList();
      })
  }

  onPressCurrentMonth() {
    const d = this.state.today;
    //console.log("onPressCurrentMonth==today", this.state.today)
    let newDate = `${d.y}-${paddingZero(d.m)}-01`;
    /* let newEndDate = `${d.y}-${paddingZero(d.m)}-${paddingZero(
      daysInMonth(d.y, d.m)
    )}`; */
    let newEndDate = `${d.y}-${paddingZero(d.m+1)}-01`;
    if(d.m+1 > 12) newEndDate = `${d.y+1}-01-01`;

    //let [newDate, newEndDate] = getDayByMonthForSearch(d, true)
    console.log("onPressCurrentMonth==", newDate, newEndDate)
    return this.setNewDate(newDate).then(data => {
      this.chkSameMonth();
      return this.getPunchListMonthly({
        start_time: newDate,
        end_time: newEndDate
      });
    }).then(data => {
        //console.log("updateTaskData === ", data)
        this.getTodayTaskList();
      })
  }

  getPunchTypeList() {
    return this.props.actions.punchTypeListAction({}, res => {
      //console.log("morning type res[][]===", res);
      this.setState({
        punchMorningTypeList: res.results,
        scheduledPunchLength: res.results.length,
      })
      //store.dispatch(morningPunchTypeAction(res.results));
    });
  }

  mergeData(typeList, list) {
    const showFutureAlert = this.isTomorrow(this.state.d.y, this.state.d.m, this.state.d.d, getDateObj()) ? true : false;
    this.setState({
      showFutureAlert: showFutureAlert,
    })
    if (!Array.isArray(typeList) || !Array.isArray(list) || showFutureAlert) return [];
    return typeList.map((n, i) => {
      let is_check = false;
      list.map((n2, i2) => {
        list[i2].children.map((n3, i3) => {
          if (!is_check) {
            is_check = (n3 && n3.id === n.id) ? true : false;
          }
        });
      });
      return Object.assign(n, {
        is_check: is_check,
        is_today: this.isToday(this.state.d.y, this.state.d.m, this.state.d.d, getDateObj()),
      });
    });
  }

  getTodayTaskList(){
    let data = []
    //console.log("this.state.punchMorningTypeList====", this.state.punchMorningTypeList)
    //console.log("this.state.todayTaskList====", this.state.todayTaskList)
    data = this.mergeData(
        this.state.punchMorningTypeList,
        this.state.todayTaskList);
    //console.log("mergeData====", data)
    this.setState({
      todayTaskShowList: data
    })
  }

  updateTaskData(){
    this.getPunchTypeList().then(res => {
      this.onPressCurrentMonth()

    });
  }

  render() {
    const { checkinData, d, scheduledPunchLength } = this.state;
    const calendarWidth = width * 0.91;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: sdStyles.SDBGColorMain
        }}
      >
        <ScrollView>
          <View
            style={{
              width: width,
              backgroundColor: "#fff",
              borderBottomWidth: 1,
              borderBottomColor: "#ccc"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
                width: width * 0.91,
                paddingVertical: 0
              }}
            >
              <TouchableOpacity style={{
                borderWidth: 0,
                borderColor: '#f00',
                padding: CSS.pixel(20),
              }} onPress={this.onPressBackMonth.bind(this)}>
                <Image source={iconLeftActive} />
              </TouchableOpacity>
              <View style={{ flexGrow: 1 }}>
                <TouchableOpacity style={{
                  borderWidth: 0,
                  borderColor: '#f00',
                  padding: CSS.pixel(20),
                }} onPress={this.onPressCurrentMonth.bind(this)}>
                  <Text
                    style={{ textAlign: "center", color: sdStyles.SDMainColor }}
                  >
                    {d.y}年{chineseDateNum(d.m)}月
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{
                borderWidth: 0,
                borderColor: '#f00',
                padding: CSS.pixel(20),
              }} onPress={this.onPressNextMonth.bind(this)}>
                <Image source={(!this.state.isShowToday && !this.state.showFutureAlert) ? iconRightActive : iconRight} />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor: "#fff",
              paddingVertical: 10,
              width: width
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 5,
                alignItems: "center"
              }}
            >
              <Text style={{ fontSize: CSS.textSize(28), color: "#ccc" }}>本月打卡天数</Text>
              <Text style={{ fontSize: CSS.textSize(28), color: "#333" }}>
                {this.state.puchDaysNum ? this.state.puchDaysNum : "0"}
              </Text>
              <Text style={{ fontSize: CSS.textSize(28), color: "#ccc" }}>天</Text>
            </View>
            {/*<View
                          style={{
                            flexDirection: "row",
                            marginHorizontal: 5,
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ fontSize: CSS.textSize(28), color: "#ccc" }}>职么力增长</Text>
                          <Text style={{ fontSize: CSS.textSize(28), color: "#333" }}>0.0</Text>
                          <Text style={{ fontSize: CSS.textSize(28), color: "#333" }}>分</Text>
                        </View>*/}
          </View>

          <View style={{ width: width, backgroundColor: "#fff" }}>
            <SDCalendar
              todayObj={this.state.d}
              isShowToday={this.state.isShowToday}
              data={this.state.objMonthly}
            />
          </View>

          <View
            style={{
              width: width,
              backgroundColor: "#fff",
              borderBottomWidth: 0,
              borderBottomColor: "#ccc",
              marginTop: CSS.pixel(30, true),
            }}
          >
            {this.state.showFutureAlert ? null : <View
                          style={{
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignSelf: "center",
                            backgroundColor: "#fff",
                            paddingTop: 10,
                            width: width * 0.91
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              marginHorizontal: 5,
                              alignItems: "center"
                            }}
                          >
                            <Text style={{ fontSize: CSS.textSize(28), color: sdStyles.SDFontColorMain }}>
                              {d.y}-{paddingZero(d.m)}-{paddingZero(d.d)} 星期{chineseDateNum(
                                weekDay(d.y, d.m, d.d), true
                              )}
                            </Text>
                          </View>
                          <View>
                            <View
                              style={{
                                flexDirection: "row",
                                marginHorizontal: 5,
                                marginVertical: CSS.pixel(20, true),
                                alignItems: "center"
                              }}
                            >
                              <Text style={{ fontSize: CSS.textSize(28), color: "#ccc" }}>
                                {this.state.showFutureAlert ? "打卡达成" : "今日打卡达成"}
                              </Text>
                              <Text style={{ fontSize: CSS.textSize(28), color: "#333" }}>
                                {checkinData.length}
                              </Text>
                              <Text style={{ fontSize: CSS.textSize(28), color: "#333",marginRight: CSS.pixel(30), }}>项</Text>

                              <Text style={{ fontSize: CSS.textSize(28), color: "#ccc" }}>未达成</Text>
                              <Text style={{ fontSize: CSS.textSize(28), color: "#333" }}>
                                {scheduledPunchLength - checkinData.length}
                              </Text>
                              <Text style={{ fontSize: CSS.textSize(28), color: "#333" }}>项</Text>
                            </View>
                          </View>
                        </View>}
          </View>

          <ScrollView
            //styleName="tabContent inputWrap flexibless"
            style={styles.sdTabs}
          >

            {this.state.showFutureAlert ? <View style={{
              width: '100%',
              minHeight: CSS.pixel(400, true),
              justifyContent:'center',
            }}><Text style={{
              textAlign:'center',
              fontSize: CSS.textSize(24),
              color: sdStyles.SDFontColorSubtitle,
            }}>无法对未来日期打卡</Text></View> : <GrowCheckinItems
                          getMorningTaskList={this.state.todayTaskShowList}
                          updateTaskData={this.updateTaskData.bind(this)}
                          titleWidth={CSS.pixel(900)}
                           />}

            <FootSpace />
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state),
}))(GrowCheckinCalendar);