/* @flow */
import React, { PureComponent } from "react";
import { Platform, Dimensions, View, Text } from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import { getUserBaseInfo } from "@src/users/usersSelector";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { Toast } from "antd-mobile";
import * as navHelper from "@utils/navigationHelper";
import DotArrow from "@sd_components/DotArrow";
import { getDateObj, daysInMonth, weekDay } from "@utils/funcs";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");
//console.log("width", width);

type Props = {};

const calendarWidth = width * 0.91;

class CGrid extends PureComponent<Props> {
  props: Props;
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };

  updateToday(title){
    const _data = this.context.refs["_calendarScreen"].state.data;
    let newData = {}
    Object.keys(_data).forEach((k)=>{
      newData[k] = Object.assign({}, _data[k], {
        isToday: parseInt(title, 10) == _data[k].index ? true : false,
      })
    })
    this.context.refs["_calendarScreen"].setState({
      data: newData
    })
  }

  onPressDay(data) {
    if(!data.title.match(/^[0-9]+$/i)) return
    console.log("===onPressDay: ", data, this.context.refs["_calendarScreen"].state.data);
    //this.updateToday(data.title);
    this.context.refs["_GrowCheckinCalendar"].setToday(data);
  }

  onPressDot(data) {
    if(!data.title.match(/^[0-9]+$/i)) return
    console.log("===onPressDot: ", data, this.context.refs["_calendarScreen"].state.data);
    //this.updateToday(data.title);
    this.context.refs["_GrowCheckinCalendar"].setToday(data);
  }

  render() {
    const { style, title, isToday, isCheckin, isFuture, isTitle } = this.props;
    return (
      <View
        style={[
          {
            width: calendarWidth / 7,
            height: isTitle ? calendarWidth / 7 - 20 : calendarWidth / 7,
            //fontSize: 12,
            //color: "#ccc",
            //textAlign: "center",
            flexDirection: "column",
            alignItems: "center",
            //color: sdStyles.SDFontColorSubtitle,
            borderWidth: 0,
            borderColor: '#f00',
          },
          style
        ]}
      >
        <View>
          {isToday ? (
            <DotArrow
              title={title}
              data={this.props}
              style={{
                backgroundColor: sdStyles.SDMainColor,
                borderColor: sdStyles.SDMainColor,
                width: 24,
                height: 24,
                top: Platform.OS == 'android' ? CSS.pixel(0, true) : CSS.pixel(-4, true),
              }}
              innerStyle={{
                backgroundColor: sdStyles.SDMainColor,
                width: 20,
                height: 20
              }}
              textStyle={{
                color: "#fff",
                fontSize: 14,
                position: "relative",
                top: CSS.pixel(4, true),
              }}
              onPress={this.onPressDay.bind(this)}
            />
          ) : (
            <DotArrow
              title={title}
              data={this.props}
              style={{
                backgroundColor: "#fff",
                borderColor: "#fff",
                width: 24,
                height: 24,
                top: Platform.OS == 'android' ? CSS.pixel(0, true) : CSS.pixel(-4, true),
              }}
              innerStyle={{ backgroundColor: "#fff", width: 20, height: 20 }}
              textStyle={{
                color: isFuture
                  ? sdStyles.SDFontColorSubtitle
                  : sdStyles.SDFontColorMain,
                fontSize: 14,
                position: "relative",
                top: CSS.pixel(4, true),
              }}
              onPress={this.onPressDay.bind(this)}
            />
          )}
        </View>
        {isTitle || !title ? null : isCheckin ? (
          <DotArrow
            title=""
            data={this.props}
            style={{
              backgroundColor: sdStyles.SDMainColor,
              borderColor: sdStyles.SDMainColor,
              width: 4,
              height: 4
            }}
            innerStyle={{
              backgroundColor: sdStyles.SDMainColor,
              width: 3,
              height: 3
            }}
            textStyle={{ color: sdStyles.SDMainColor }}
            onPress={this.onPressDot.bind(this)}
          />
        ) : isFuture ? null : (
          <DotArrow
            title=""
            data={this.props}
            style={{
              backgroundColor: sdStyles.SDBtnColorDisable,
              borderColor: sdStyles.SDBtnColorDisable,
              width: 4,
              height: 4
            }}
            innerStyle={{
              backgroundColor: sdStyles.SDBtnColorDisable,
              width: 3,
              height: 3
            }}
            textStyle={{ color: sdStyles.SDBtnColorDisable }}
            onPress={this.onPressDot.bind(this)}
          />
        )}
      </View>
    );
  }
}

class CRow extends PureComponent<Props> {
  props: Props;

  render() {
    const { style, children } = this.props;
    const calendarWidth = width * 0.91;
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginHorizontal: 0,
          borderWidth: 0,
          borderColor: "#f00"
        }}
      >
        {children}
      </View>
    );
  }
}

class SDCalendar extends PureComponent<Props> {
  props: Props;
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    //intl: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      isShowToday: props.isShowToday
    };
    this.prepareData(props, true);
  }

  initDays(firstWeekDay, lastDay) {
    let t = 1;
    let isFoundFirstDay = false;
    let _firstWeekDay = firstWeekDay == 0 ? 6 : firstWeekDay - 1;
    return Array.from({ length: 40 }).map((n, i) => {
      if (!isFoundFirstDay && i == _firstWeekDay) {
        isFoundFirstDay = true;
        return t + "";
      } else {
        if (isFoundFirstDay) {
          t++;
          return t > lastDay ? "" : t + "";
        } else {
          return "";
        }
      }
    });
  }

  initDaysData(firstWeekDay, lastDay, day) {
    let obj = {};
    let t = 1;
    let isFoundFirstDay = false;
    let _firstWeekDay = firstWeekDay == 0 ? 6 : firstWeekDay - 1;
    Array.from({ length: 40 }).map((n, i) => {
      if (!isFoundFirstDay && i == _firstWeekDay) {
        isFoundFirstDay = true;
        obj[i] = {
          index: t,
          isToday: t == day ? true : false,
          isCheckin: false,
          isFuture: false
        };
      } else {
        if (isFoundFirstDay) {
          t++;
          if (t > lastDay) {
            obj[i] = {};
          } else {
            obj[i] = {
              index: t,
              isToday: t == day ? true : false,
              isCheckin: false,
              isFuture: false
            };
          }
        } else {
          obj[i] = {};
        }
      }
    });
    return obj;
  }

  prepareData(props, isInit = false, _isShowToday = null) {
    return new Promise((reslove)=>{
      const today = getDateObj();
      const d = props.todayObj ? props.todayObj : today;
      const lastDay = daysInMonth(d.y, d.m);
      const start_time = `${d.y}-${d.m}-01`;
      const end_time = `${d.y}-${d.m}-${lastDay}`;
      const firstWeekDay = weekDay(d.y, d.m, 1);
      let isShowToday = false;
      //isShowToday = this.state.isShowToday ? today.d : null
      //点击日期背景变黄
      isShowToday = d.d;
      if(typeof _isShowToday === 'boolean'){
        isShowToday = _isShowToday ? today.d : null
        console.log("_isShowToday[][]===", isShowToday, _isShowToday, this.state.isShowToday)
      }
      const data = {
        today: today,
        //1-31
        lastDay: lastDay,
        start_time: start_time,
        end_time: end_time,
        //0-6
        firstWeekDay: firstWeekDay,
        days: this.initDays(firstWeekDay, lastDay),
        data: this.initDaysData(
          firstWeekDay,
          lastDay,
          isShowToday
        )
      };
      if(isInit){
        this.state = data
      } else {
        this.setState(data);
      }
      reslove(true)
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data != this.props.data){
      console.log("update data====", 1)
      this.prepareData(nextProps).then(data => {
        this.getData(nextProps);
      })
    }
    if(nextProps.isShowToday != this.props.isShowToday){
      console.log("update data====", 2, nextProps.isShowToday)
      this.setState({
        isShowToday: nextProps.isShowToday,
      });
      this.prepareData(nextProps, false, nextProps.isShowToday).then(data => {
        this.getData(nextProps);
      })
    }
  }

  componentDidMount() {
    //通过ref访问 calendarScreen
    this.context.refs["_calendarScreen"] = this;
    //this.prepareData(this.props);
    this.getData(this.props);
    this.setState({
      isShowToday: this.props.isShowToday,
    });
  }

  onNavigatorEvent(event) {
    //console.log("event=======", event);
    if (event.id == "didAppear") {
      //this.getPunchList();
    }
  }

  getData(props) {
    return new Promise((resolve)=>{
      let data = props.data;
      console.log("getData====", data)
      let newData = Object.assign({}, this.state.data);
      let newData2 = {};
      if (data) {
        Object.keys(newData).map(k => {
          const nn = newData[k];
          if (nn.hasOwnProperty('index')) {
            const kk = nn.index.toString();
            newData2[k]={
              index: nn.index,
              isToday: nn.isToday,
              isCheckin: (data[kk] && data[kk].isCheckin) ? true : false,
              isFuture: (data[kk] && data[kk].isFuture) ? true : false
            };
          } else {
            newData2[k]={};
          }
        });
        //console.log("newData2====", newData2)
        this.setState({
          data: newData2
        });
        resolve(true)
      }
      resolve(true)
    })
  }

  render() {
    const { style, todayObj } = this.props;
    const { days, data } = this.state;
    const calendarWidth = width * 0.91;
    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center",
          width: calendarWidth,
          backgroundColor: "#fff",
          marginVertical: 0,
          borderWidth: 0,
          borderColor: "#ff0"
        }}
      >
        <CRow>
          <CGrid title="一" isFuture={true} isTitle={true} />
          <CGrid title="二" isFuture={true} isTitle={true} />
          <CGrid title="三" isFuture={true} isTitle={true} />
          <CGrid title="四" isFuture={true} isTitle={true} />
          <CGrid title="五" isFuture={true} isTitle={true} />
          <CGrid title="六" isFuture={true} isTitle={true} />
          <CGrid title="日" isFuture={true} isTitle={true} />
        </CRow>

        <CRow>
          <CGrid
            title={days[0]}
            isToday={data[0].isToday}
            isCheckin={data[0].isCheckin}
            isFuture={data[0].isFuture}
          />
          <CGrid
            title={days[1]}
            isToday={data[1].isToday}
            isCheckin={data[1].isCheckin}
            isFuture={data[1].isFuture}
          />
          <CGrid
            title={days[2]}
            isToday={data[2].isToday}
            isCheckin={data[2].isCheckin}
            isFuture={data[2].isFuture}
          />
          <CGrid
            title={days[3]}
            isToday={data[3].isToday}
            isCheckin={data[3].isCheckin}
            isFuture={data[3].isFuture}
          />
          <CGrid
            title={days[4]}
            isToday={data[4].isToday}
            isCheckin={data[4].isCheckin}
            isFuture={data[4].isFuture}
          />
          <CGrid
            title={days[5]}
            isToday={data[5].isToday}
            isCheckin={data[5].isCheckin}
            isFuture={data[5].isFuture}
          />
          <CGrid
            title={days[6]}
            isToday={data[6].isToday}
            isCheckin={data[6].isCheckin}
            isFuture={data[6].isFuture}
          />
        </CRow>
        <CRow>
          <CGrid
            title={days[7]}
            isToday={data[7].isToday}
            isCheckin={data[7].isCheckin}
            isFuture={data[7].isFuture}
          />
          <CGrid
            title={days[8]}
            isToday={data[8].isToday}
            isCheckin={data[8].isCheckin}
            isFuture={data[8].isFuture}
          />
          <CGrid
            title={days[9]}
            isToday={data[9].isToday}
            isCheckin={data[9].isCheckin}
            isFuture={data[9].isFuture}
          />
          <CGrid
            title={days[10]}
            isToday={data[10].isToday}
            isCheckin={data[10].isCheckin}
            isFuture={data[10].isFuture}
          />
          <CGrid
            title={days[11]}
            isToday={data[11].isToday}
            isCheckin={data[11].isCheckin}
            isFuture={data[11].isFuture}
          />
          <CGrid
            title={days[12]}
            isToday={data[12].isToday}
            isCheckin={data[12].isCheckin}
            isFuture={data[12].isFuture}
          />
          <CGrid
            title={days[13]}
            isToday={data[13].isToday}
            isCheckin={data[13].isCheckin}
            isFuture={data[13].isFuture}
          />
        </CRow>
        <CRow>
          <CGrid
            title={days[14]}
            isToday={data[14].isToday}
            isCheckin={data[14].isCheckin}
            isFuture={data[14].isFuture}
          />
          <CGrid
            title={days[15]}
            isToday={data[15].isToday}
            isCheckin={data[15].isCheckin}
            isFuture={data[15].isFuture}
          />
          <CGrid
            title={days[16]}
            isToday={data[16].isToday}
            isCheckin={data[16].isCheckin}
            isFuture={data[16].isFuture}
          />
          <CGrid
            title={days[17]}
            isToday={data[17].isToday}
            isCheckin={data[17].isCheckin}
            isFuture={data[17].isFuture}
          />
          <CGrid
            title={days[18]}
            isToday={data[18].isToday}
            isCheckin={data[18].isCheckin}
            isFuture={data[18].isFuture}
          />
          <CGrid
            title={days[19]}
            isToday={data[19].isToday}
            isCheckin={data[19].isCheckin}
            isFuture={data[19].isFuture}
          />
          <CGrid
            title={days[20]}
            isToday={data[20].isToday}
            isCheckin={data[20].isCheckin}
            isFuture={data[20].isFuture}
          />
        </CRow>
        <CRow>
          <CGrid
            title={days[21]}
            isToday={data[21].isToday}
            isCheckin={data[21].isCheckin}
            isFuture={data[21].isCheckin}
          />
          <CGrid
            title={days[22]}
            isToday={data[22].isToday}
            isCheckin={data[22].isCheckin}
            isFuture={data[22].isFuture}
          />
          <CGrid
            title={days[23]}
            isToday={data[23].isToday}
            isCheckin={data[23].isCheckin}
            isFuture={data[23].isFuture}
          />
          <CGrid
            title={days[24]}
            isToday={data[24].isToday}
            isCheckin={data[24].isCheckin}
            isFuture={data[24].isFuture}
          />
          <CGrid
            title={days[25]}
            isToday={data[25].isToday}
            isCheckin={data[25].isCheckin}
            isFuture={data[25].isFuture}
          />
          <CGrid
            title={days[26]}
            isToday={data[26].isToday}
            isCheckin={data[26].isCheckin}
            isFuture={data[26].isFuture}
          />
          <CGrid
            title={days[27]}
            isToday={data[27].isToday}
            isCheckin={data[27].isCheckin}
            isFuture={data[27].isFuture}
          />
        </CRow>
        <CRow>
          <CGrid
            title={days[28]}
            isToday={data[28].isToday}
            isCheckin={data[28].isCheckin}
            isFuture={data[28].isFuture}
          />
          <CGrid
            title={days[29]}
            isToday={data[29].isToday}
            isCheckin={data[29].isCheckin}
            isFuture={data[29].isFuture}
          />
          <CGrid
            title={days[30]}
            isToday={data[30].isToday}
            isCheckin={data[30].isCheckin}
            isFuture={data[30].isFuture}
          />
          <CGrid
            title={days[31]}
            isToday={data[31].isToday}
            isCheckin={data[31].isCheckin}
            isFuture={data[31].isFuture}
          />
          <CGrid
            title={days[32]}
            isToday={data[32].isToday}
            isCheckin={data[32].isCheckin}
            isFuture={data[32].isFuture}
          />
          <CGrid
            title={days[33]}
            isToday={data[33].isToday}
            isCheckin={data[33].isCheckin}
            isFuture={data[33].isFuture}
          />
          <CGrid
            title={days[34]}
            isToday={data[34].isToday}
            isCheckin={data[34].isCheckin}
            isFuture={data[34].isFuture}
          />
        </CRow>
        <CRow>
          <CGrid
            title={days[35]}
            isToday={data[35].isToday}
            isCheckin={data[35].isCheckin}
            isFuture={data[35].isFuture}
          />
          <CGrid
            title={days[36]}
            isToday={data[36].isToday}
            isCheckin={data[36].isCheckin}
            isFuture={data[36].isFuture}
          />
          <CGrid
            title={days[37]}
            isToday={data[37].isToday}
            isCheckin={data[37].isCheckin}
            isFuture={data[37].isFuture}
          />
          <CGrid
            title={days[38]}
            isToday={data[38].isToday}
            isCheckin={data[38].isCheckin}
            isFuture={data[38].isFuture}
          />
          <CGrid
            title={days[39]}
            isToday={data[39].isToday}
            isCheckin={data[39].isCheckin}
            isFuture={data[39].isFuture}
          />
          <CGrid
            title={""}
            isToday={false}
            isCheckin={false}
            isFuture={false}
          />
          <CGrid
            title={""}
            isToday={false}
            isCheckin={false}
            isFuture={false}
          />
        </CRow>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state)
}))(SDCalendar);