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
import { schoolJobModel } from "../types";
import { getUserId } from "../directSelectors";
import { CSS } from "../common/SDCSS";

const styles = StyleSheet.create({});

type Props = {
  userId: number,
  jobList: schoolJobModel[]
};

// 我的履历 - 在校职位
class SchoolJobs extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.actions.getJobListAction({
      id: this.props.userId
    });
  }
  renderJobTimeLine() {
    let arrHtml = [];
    for (let i = 0; i < this.props.jobList.length; i++) {
      const element = this.props.jobList[i];
      arrHtml.push(
        <TimeLine
          key={element.id + ""}
          isLast={i == this.props.jobList.length - 1}
          startTime={element.start_date.slice(0, 7).replace(/-/, ".")}
          endTime={element.end_date.slice(0, 7).replace(/-/, ".")}
          subInfo={element.name}
          footer={element.description}
        />
      );
    }
    return arrHtml;
  }
  render() {
    return (
      <View style={{ backgroundColor: "#fff", padding: CSS.pixel(30), paddingTop: !this.props.jobList.length ? 0 : CSS.pixel(30)}}>
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
        {this.renderJobTimeLine()}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  jobList: state.userSchoolJobList,
  userId: getUserId(state)
}))(SchoolJobs);
