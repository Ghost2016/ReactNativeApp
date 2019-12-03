import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions
} from "react-native";
import LabelInput from "../common/SDLabelInput";
import ConnectWithActions from "../connectWithActions";
import { getSchoolName, getMajor, getSchoolLevel } from "../directSelectors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

// 用户基本信息
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <LabelInput placeholder="姓名" style={{ paddingLeft: 10 }} />
        <LabelInput placeholder="所在地区" style={{ paddingLeft: 10 }} />
        <LabelInput
          placeholder="性别"
          editable={false}
          direction=">"
          style={{ paddingLeft: 10 }}
        />
        <LabelInput
          placeholder="学校名称"
          defaultValue={this.props.schoolName}
          style={{ paddingLeft: 10 }}
        />
        <LabelInput
          placeholder="专业名称"
          defaultValue={this.props.major}
          style={{ paddingLeft: 10 }}
        />
        <LabelInput
          placeholder="学历"
          defaultValue={this.props.schoolLevel}
          style={{ paddingLeft: 10 }}
        />
        <LabelInput placeholder="入学年份" style={{ paddingLeft: 10 }} />
        <LabelInput placeholder="毕业年份" style={{ paddingLeft: 10 }} />
        <LabelInput placeholder="手机号码" style={{ paddingLeft: 10 }} />
        <LabelInput placeholder="电子邮箱" style={{ paddingLeft: 10 }} />
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  major: getMajor(state, props),
  schoolName: getSchoolName(state, props),
  schoolLevel: getSchoolLevel(state)
}))(UserProfile);
