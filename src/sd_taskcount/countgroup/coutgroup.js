/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ImageBackground,
} from "react-native";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDTile from "@sd_components/SDTile"
import { getTodayIndexOfWeek, getDateObj } from "@utils/funcs"

const styles = StyleSheet.create({
  container: {
    height: Platform.OS=="android"? CSS.pixel(110) : CSS.pixel(110),
    borderWidth: 0,
    borderColor: "#f00",
    marginLeft: Platform.OS=="android"? CSS.pixel(0) : CSS.pixel(0),
    marginBottom: CSS.pixel(20, true),
    //alignSelf: "center",
    flexDirection: 'row',
    alignItems: 'center',
  },
  group: {
    //flex: 1,
    height: Platform.OS=="android"? CSS.pixel(110) : CSS.pixel(110),
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: 'center',
    marginHorizontal: CSS.pixel(16),
    overflow: "visible",
  },
  circle: {
    borderRadius: CSS.pixel(36),
    width: CSS.pixel(70),
    height: CSS.pixel(70),
    borderWidth: 0, //StyleSheet.hairlineWidth,
    borderColor: sdStyles.SDFontColorSubtitle,
    justifyContent: "center",
    alignItems: "center"
  },
  circle_zore: {
    borderColor: sdStyles.SDFontColorSubtitle
  },
  dateText: {
    color: sdStyles.SDFontColorSubtitle,
    fontSize: CSS.textSize(30),
  },
  dateText_num: {
    color: sdStyles.SDFontColorMain,
    fontSize: CSS.textSize(30),
  },
  dateTextSmall: {
    color: sdStyles.SDFontColorSubtitle,
    fontSize: CSS.textSize(20),
    marginTop: CSS.pixel(10, true),
  },
  dateTextSmall_num: {
    color: sdStyles.SDFontColorMain,
    fontSize: CSS.textSize(20),
    marginTop: CSS.pixel(10, true),
  },
  dateText_zore: {
    color: sdStyles.SDFontColorSubtitle
  },
  circle_num: {
    borderRadius: CSS.pixel(36),
    width: CSS.pixel(70),
    height: CSS.pixel(70),
    borderWidth: 0, //StyleSheet.hairlineWidth,
    borderColor: sdStyles.SDMainColor,
    justifyContent: "center",
    alignItems: "center"
  },
});

const iconCircle = require('@img/grow/growing_ico_date_black.png')
const iconCircleYellow = require('@img/grow/growing_ico_date_yellow.png')

// 任务完成数统计
export default class CountGroup extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  ball = (day, index, isFuture) => {
    const names = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    return (
      <View style={styles.group} key={index}>
        {!isFuture ? <View
          resizeMode="center"
          borderRadius={CSS.pixel(36)}
          style={{
            width: Platform.OS=="android"? CSS.pixel(70) :CSS.pixel(70),
            height: Platform.OS=="android"? CSS.pixel(70) :CSS.pixel(70),
            borderWidth: 0,
            borderColor: "#f00",
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: "center",
            backgroundColor: day ? sdStyles.SDMainColor : sdStyles.SDBGColorGrey
          }}
        >
          <Text style={day ? styles.dateText_num : styles.dateText}>
              {day || 0}
          </Text>
        </View> : <SDTile
          width={70}
          bgImg={iconCircle}
          title={"一"}
        />}
        <Text style={day ? styles.dateTextSmall_num : styles.dateTextSmall}>
          {names[index]}
        </Text>
      </View>


    );
  };

  render() {
    const { days } = this.props
    const _days = days ? days : Array.from({length: 7}).map((n,i)=>{return 0})
    const d = getDateObj();
    const todayIndexOfWeek = getTodayIndexOfWeek(d.y, d.m, d.d);
    return (
      <View
        style={[
          styles.container,
          {
            //justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }
        ]}
      >
        {_days.map((n,i)=>{
          const isFuture = todayIndexOfWeek == 0 ? false : (i + 1 <= todayIndexOfWeek) ? false : true;
          console.log("todayIndexOfWeek", todayIndexOfWeek, i, isFuture, n)
          return this.ball(n, i, isFuture)
        })}

      </View>
    );
  }
}
