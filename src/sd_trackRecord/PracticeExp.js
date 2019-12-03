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
import ConnectWithActions from "../connectWithActions";
import TimeLine from "../sd_timeLine/TimeLine";
import { getUserId } from "../directSelectors";
import { practiceExpModel } from "../types";
import { CSS } from "../common/SDCSS";

const styles = StyleSheet.create({});
type Props = {
  userId: number,
  practiceExpList: practiceExpModel[]
};
// 我的履历 - 实习经验
class PracticeExp extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.actions.getUserWorkListAction({
      id: this.props.userId
    });
  }
  renderExpTimeLine() {
    let arrHtml = [];
    for (let i = 0; i < this.props.practiceExpList.length; i++) {
      const element = this.props.practiceExpList[i];
      arrHtml.push(
        <TimeLine
          key={element.id + ""}
          isLast={i == this.props.practiceExpList.length - 1}
          startTime={element.start_date.slice(0, 7).replace(/-/, ".")}
          endTime={element.end_date.slice(0, 7).replace(/-/, ".")}
          subInfo={element.company_name + "/" + element.job_name}
          footer={element.job_desc}
        />
      );
    }
    return arrHtml;
  }
  render() {
    return <View style={{backgroundColor: '#fff', padding: CSS.pixel(30), paddingTop: this.props.practiceExpList.length <= 0 ? 0 : CSS.pixel(30)}}>
       <View style={{position: 'absolute', right: CSS.pixel(10), top: CSS.pixel(30), zIndex: 2}}>
        {this.props.edit ? this.props.edit() : null}
      </View>
    {this.renderExpTimeLine()}</View>;
  }
}

export default ConnectWithActions((state, props) => ({
  practiceExpList: state.userPracticeExpList,
  userId: getUserId(state)
}))(PracticeExp);
