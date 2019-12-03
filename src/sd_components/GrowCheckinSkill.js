/* @flow */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import PropTypes from "prop-types";
import store from "@boot/store";
import * as sdStyles from "@styles";
import RowSplitLine from "@src/common/RowSplitLine";
import ConnectWithActions from "@src/connectWithActions";
import { getUserBaseInfo } from "@src/users/usersSelector";
import { CSS } from "@src/common/SDCSS";
import SDTabs2 from "@sd_components/SDTabs2";
import SDLoading from "@sd_components/SDLoading";
import HeaderText from "@sd_components/HeaderText";
import GrowCheckinSkillTab from "@sd_components/GrowCheckinSkillTab";
import { skillPunchListAction, certPunchListAction } from "@src/boot/actions";
import { getTabType } from "@utils/funcs";
import { currentJobPlan, skillTaskState } from "@src/selectors";
import SDSection from "@sd_components/SDSection";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: CSS.pixel(30, true)
  },
  sdTabs: {
    width: width,
    height: '100%',
    borderWidth: 0,
    borderColor:'#f00',
  }
});

// 成长 - 职场技能
class GrowCheckinSkill extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      startIndex: 0,
      page: 1,
      size: 100,
      params: {},
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  changeTotab(index){
    this.setState({
      startIndex: index
    });
  }

  handleTabChange(tab, index){
    console.log("handleTabChange===", tab, index)
    let params = {
      target: "skill",
      size: this.state.size,
      page: this.state.page,
    };
    params.type = getTabType(index);
    if(params.type === "goal" && this.props.currentJobPlan.title){
      params.profession_id = this.props.currentJobPlan.id;
    }
    this.setState({
      params: params,
    })
    //获取任务列表
    this.props.actions.punchListAction(
      params,
      res => {}
    ).then(res => {
      console.log("handleTabChange res===22", res, params);
      store.dispatch(skillPunchListAction(res.results));
    }).catch(err => {
      console.log("handleTabChange err ==", err)
    })
  }

  componentDidMount(){
    //获取统计数据
    this.props.actions.stateSkillListAction({}, res => {}).then(res => {
      this.props.actions.setSkillStateState(res.results)
    })
  }

  //, "目标职位技能", "我的技能"
  render() {
    const { startIndex } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',//sdStyles.SDBGColorMain,
        }}
      >
        <SDTabs2
          tabTitles={["通用技能"]}
          page={startIndex}
          underLineWidth={CSS.pixel(110)}
          onChangeTab={this.handleTabChange.bind(this)}
          activeColor={sdStyles.SDFontColorMain}
          inActiveColor={sdStyles.SDFontColorSubtitle}
          style={{
            flex: 1,
          }}
          tabContentStyle={{
            height: '100%',
          }}
        >
          <ScrollView
            style={styles.sdTabs}
          >
            <GrowCheckinSkillTab
              type="通用技能"
              target="skill"
              targetName="技能"
              style={{
                minHeight: CSS.pixel(1200, true),
                borderWidth: 0,
                borderColor:'#f00',
              }}
              header={() => {
              return (<SDSection><HeaderText titles={
                [
                '技能掌握，玩转职场不在话下！',
                '需完成技能',
                `${this.props.skillState.common.total || 0}项，`,
                '已完成',
                `${this.props.skillState.common.done || 0}项，`,
                '加油努力吧！'
                ]
              } /></SDSection>);
            }} />
          </ScrollView>

          {/* <ScrollView
            style={styles.sdTabs}
          >
            <GrowCheckinSkillTab
              type="目标职位技能"
              target="skill"
              targetName="技能"
              style={{
                minHeight: CSS.pixel(1200, true),
                borderWidth: 0,
                borderColor:'#f00',
              }}
              header={() => {
              return (<HeaderText titles={
                [
                `专业技能提升很重要，你的目标职位“${this.props.currentJobPlan.position.name}”`,
                '需完成技能',
                `${this.props.skillState.goal.total || 0}项，`,
                '已完成',
                `${this.props.skillState.goal.done || 0}项，`,
                '加油努力吧！'
                ]
              } />);
            }} />
          </ScrollView> */}

          <ScrollView
            style={styles.sdTabs}
          >
            <GrowCheckinSkillTab
              type="我的技能"
              target="skill"
              targetName="技能"
              style={{
                minHeight: CSS.pixel(1200, true),
                borderWidth: 0,
                borderColor:'#f00',
              }}
              isSimple={true}
              header={() => {
              return (<HeaderText titles={
                [
                '你可以创建并管理自己的技能提升任务',
                '任务项',
                `${this.props.skillState.custom.total || 0}项，`,
                '已完成',
                `${this.props.skillState.custom.done || 0}项，`,
                '加油努力吧！'
                ]
              } />);
            }} />
          </ScrollView>
        </SDTabs2>
      </View>

    );
  }
}

export default ConnectWithActions((state, props) => ({
  userBaseInfo: getUserBaseInfo(state),
  currentJobPlan: currentJobPlan(state, props),
  skillState: skillTaskState(state),
}))(GrowCheckinSkill);
