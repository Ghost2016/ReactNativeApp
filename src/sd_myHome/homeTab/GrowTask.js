import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image
} from "react-native";
import PropTypes from "prop-types";
import defaultStyle from "@styles";
import ConnectWithActions from "../../connectWithActions";
import TitleWrap from "../../sd_employmentinfo/titlelistwarp/TitleWrap";
import LineTitle from "../LineTitle";
import TaskNumItem from "../TaskNumItem";
import { CSS } from "../../common/SDCSS";
import { getUserBaseInfo } from "../../users/usersSelector";
import { userBaseInfoModel, otherUserInfoModel } from "../../types";
import SDTouchOpacity from "../../common/SDTouchOpacity";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: CSS.pixel(30),
    borderRadius: CSS.pixel(10)
  }
});

type Props = {
  userBaseInfo: userBaseInfoModel,
  otherUserInfo: otherUserInfoModel
};
let navigator = null;
class GrowTask extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      taskCount: {
        read_count: 0,
        punch_count: 0,
        tech_count: 0,
        certificate_count: 0
      }
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    otherId: PropTypes.number.isRequired
  };
  componentDidMount() {
    navigator = this.context.navigator;
  }
  render() {
    let cerCount = 0,
      punchCount = 0,
      readCount = 0,
      techCount = 0;
    if (this.context.otherId === 0) {
      cerCount = this.props.userBaseInfo.certificate_count;
      punchCount = this.props.userBaseInfo.punch_count;
      readCount = this.props.userBaseInfo.read_count;
      techCount = this.props.userBaseInfo.tech_count;
    } else {
      cerCount = this.props.otherUserInfo.task_info.certificate_count;
      punchCount = this.props.otherUserInfo.task_info.punch_count;
      readCount = this.props.otherUserInfo.task_info.read_count;
      techCount = this.props.otherUserInfo.task_info.tech_count;
    }
    // 判断隐私设置
    let settings = {
      tasks: true,
      dynamic: true
    };
    if (this.context.otherId !== 0) {
      // 判断他人隐私是否不可看
      if (
        this.props.otherUserInfo.settings &&
        this.props.otherUserInfo.settings !== ""
      ) {
        try {
          settings = JSON.parse(this.props.otherUserInfo.settings);
        } catch (error) {
          settings = {};
        }
        
      }
    }
    return (
      <View style={{
        paddingHorizontal: CSS.pixel(30)
      }}>
      <SDTouchOpacity activeOpacity={1} style={[styles.container]} onPress={() => {
        // navigator.popToRoot({
        //   animated: true, 
        //   animationType: 'fade',
        // });
        // navigator.switchToTab({
        //   tabIndex: 2
        // });
      }}>

        <TitleWrap
          leftIcon={() => (
            <Image source={require("@img/my/rank_ico_growing.png")} />
          )}
          title="成长任务"
          otherInfo={`总数量 ${cerCount + techCount}`}
        />

        {
          this.context.otherId !== 0 && settings.tasks !== true ?
          <View style={[
            defaultStyle.flexRow,
            {
              alignItems: "center",
              justifyContent: "space-around",
              flexWrap: "nowrap",
              paddingLeft: CSS.pixel(30),
              paddingRight: CSS.pixel(30),
              justifyContent: 'center',
              alignContent: 'center',
              paddingVertical: CSS.pixel(60)
            }
          ]}>
            <Text style={{color: '#999', fontSize: CSS.textSize(28)}}>对方设置成长任务暂不开放访问</Text>
          </View>
        :
        <View
          style={[
            defaultStyle.flexRow,
            {
              alignItems: "center",
              justifyContent: "space-around",
              flexWrap: "nowrap",
              paddingLeft: CSS.pixel(30),
              paddingRight: CSS.pixel(30)
            }
          ]}
        >
          {/* <TaskNumItem taskNum={punchCount} taskName="日常打卡" /> */}
          <TaskNumItem taskNum={cerCount ? cerCount : 0} taskName="证书考取" />
          {/* <TaskNumItem taskNum={readCount} taskName="阅读书单" /> */}
          <TaskNumItem taskNum={techCount ? techCount : 0} taskName="职场技能" />
        </View>
        }
      </SDTouchOpacity>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userBaseInfo: getUserBaseInfo(state),
  otherUserInfo: state.otherUserInfo
}))(GrowTask);
