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
import TimeLine from "../sd_timeLine/TimeLine";
import ConnectWithActions from "../connectWithActions";
import { getUserId } from "../directSelectors";
import { educationModel } from "../types";
import { navLightBox } from "../styles";
import ImportCourseLightBox from "./ImportCourseLightBox";
import { CSS } from "../common/SDCSS";

const styles = StyleSheet.create({});

type Props = {
  userId: number,
  educationList: educationModel[]
};

// 我的履历 - 教育经历
class EducationExperience extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    // 获取自己的学校账号
    this.props.actions.getSchoolAccountAction().then(accountRes => {
      // if (accountRes.results.length > 0) {
      this.props.actions
        .getEducationAction({
          id: this.props.userId
        })
        .then(res => {
          // 查询是否是已经有可以对接教务成绩系统的学校
          // 查询到有学校提示来
          if(res && res.status == 'ok') {
            let isHasChecked = false;
            res.results.filter(c => c.is_default === true).map(async item => {
              // res.results.map(async item => {
              // 目前只检查默认教育的
              if (isHasChecked == true) {
                return;
              }
              try {
                const res = await this.props.actions.checkSyncCourseAction({
                  education_id: item.id
                });
  
                if (res.status == "ok") {
                  isHasChecked = true;
                  // 只有没有对接过教务系统才提示
                  if (
                    accountRes.results.findIndex(c => c.education_id == item.id) <
                    0
                  ) {
                    // 弹窗提示窗口（2018-9-5取消）
                    /* navLightBox("LightBoxScreen", {
                      passProps: {
                        screen: () => <ImportCourseLightBox education={item} />
                      }
                    }); */
                  }
                }
              } catch (error) {}
            });
          }
        });
      // }
    });
  }
  renderTimeLine() {
    let arrHtml = [];
    for (let i = 0; i < this.props.educationList.length; i++) {
      const element = this.props.educationList[i];
      // console.warn(element)
      arrHtml.push(
        <TimeLine
          key={element.id + ""}
          isLast={i == this.props.educationList.length - 1}
          startTime={element.start_date.slice(0, 7).replace(/-/, ".")}
          endTime={element.end_date.slice(0, 7).replace(/-/, ".")}
          status={element.edu_status}
          subTitle={
            element.school.name +
            "   " + element.college.name}
          subInfo={
            element.degree.name +
            " · " +
            element.major.name + "(" + (element.is_full_time ? "全日制" : "非全日制") + ")"
          }
        />
      );
    }
    return arrHtml;
  }
  render() {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: CSS.pixel(10),
          padding: CSS.pixel(30)
        }}
      >
        <View
          style={{
            position: "absolute",
            right: CSS.pixel(10),
            top: CSS.pixel(30),
            zIndex: 2
          }}
        >
          {this.props.edit ? this.props.edit() : null}
        </View>
        {this.renderTimeLine()}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  educationList: state.userEducationList,
  userId: getUserId(state)
}))(EducationExperience);
