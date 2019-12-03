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
import AwardList from "./AwardList";
import { getUserId } from "../directSelectors";
import ConnectWithActions from "../connectWithActions";
import { certificateModel } from "../types";
import { CSS } from "../common/SDCSS";

const styles = StyleSheet.create({});
type Props = {
  userId: number,
  certificateList: certificateModel[]
};
// 我的履历 - 所获证书
class OwnCertificate extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.actions.getUserCertificateAction({
      id: this.props.userId
    });
  }

  render() {
    return (
      <View style={{backgroundColor: '#fff', padding: CSS.pixel(30), paddingTop: this.props.certificateList.length <= 0 ? 0 : CSS.pixel(30)}}>
       <View style={{position: 'absolute', right: CSS.pixel(10), top: CSS.pixel(30), zIndex: 2}}>
        {this.props.edit ? this.props.edit() : null}
        </View>
        {this.props.certificateList.map(item => {
          if(this.props.isSavePic && item.audit_status != 'audit_pass') {
            return null;
          }
          return (
            <AwardList
              key={item.id + ""}
              info={item.audit_status == 'audit_pass' && item.score ? `${item.certificate.name}/成绩：${item.score}` : `${item.certificate.name}`}
              time={item.acquire_date.slice(0, 7).replace(/-/, ".")}
              // subInfo="已考取"
              status={item.audit_status}
              images={item.attachments && !this.props.isSavePic ? item.attachments : []}
            />
          );
        })}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  certificateList: state.certificateList,
  userId: getUserId(state)
}))(OwnCertificate);
