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
import AwardList from "./AwardList";
import { awardExpModel } from "../types";
import { getUserId } from "../directSelectors";
import { CSS } from "../common/SDCSS";

const styles = StyleSheet.create({});

type Props = {
  userId: number,
  awardExpList: awardExpModel[]
};

// 我的履历 - 获奖经历
class AwardExp extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.actions.getUserAwardExpListAction({
      id: this.props.userId
    });
  }

  render() {
    return (
      <View style={{backgroundColor: '#fff', padding: CSS.pixel(30), paddingTop: this.props.awardExpList.length <= 0 ? CSS.pixel(0) : CSS.pixel(30)}}>
          <View style={{position: 'absolute', right: CSS.pixel(10), top: CSS.pixel(30), zIndex: 2}}>
            {this.props.edit ? this.props.edit() : null}
          </View>
        {this.props.awardExpList.map(item => {
          if(this.props.isSavePic && item.audit_status != 'audit_pass') {
            return null;
          }
          return (
            <AwardList
              images={!this.props.isSavePic ? item.images : []}
              key={item.id + ""}
              info={item.name}
              status={item.audit_status}
              time={item.acquire_date.slice(0, 7).replace(/-/, ".")}
            />
          );
        })}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  awardExpList: state.userAwardExpList,
  userId: getUserId(state)
}))(AwardExp);
