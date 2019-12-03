/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
//import { BoxShadow } from "react-native-shadow";
import CountGroup from "./countgroup/coutgroup";
import CountText from "./countgroup/counttext";
import CountBtn from "./countgroup/countbtn";
import { punchState } from "@api/index";
import { getDateObj, daysInMonth, weekDay, getCurrentWeek } from "@utils/funcs";
import { getPowerWeek } from "@utils/funcs"
import { taskWeekList } from "@src/selectors"

const styles = StyleSheet.create({
  container: {
    //height: 100,
    backgroundColor: "#fff",
    //shadowOffset: { width: 0, height: 10 },
    //shadowOpacity: 0.3,
    //shadowRadius: 5,
    shadowColor: "#ccc",
    paddingBottom: CSS.pixel(0, true),
    marginBottom: CSS.pixel(0, true),
    borderWidth: 0,
    borderColor: '#f00',
    //注意：这一句是可以让安卓拥有灰色阴影
    // elevation: -20,
    flexDirection: 'column',
    alignItems: 'center',
  },
});

// 任务完成数统计
class TaskCount extends React.Component {
  static contextTypes = {
    //refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    //intl: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    const today = getDateObj();
    const d = props.todayObj ? props.todayObj : today;
    const [start, end] = getCurrentWeek(today.y, today.m, today.d);
    console.log("TaskCount===", start, end, today);
    this.state = {
      start_time: start,
      end_time: end,
      //currentWeekDay: weekDay(d.y, d.m, d.d),
    }
  }

  componentDidMount() {

    getPowerWeek().then(results => {
      console.log("taskWeekList===", this.props.taskWeekList)
      this.setState({
        loading: false,
      })
    })

  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <CountText
          weekTask={this.props.taskWeekList.weekTask}
          weekPowerUp={this.props.taskWeekList.weekPowerUp}
        />
        <CountGroup days={this.props.taskWeekList.weekDays} />
        {/*<CountBtn />*/}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //user: getUserBaseInfo(state),
  taskWeekList: taskWeekList(state),
}))(TaskCount);
