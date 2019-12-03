/* @flow */
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
import store from "@boot/store";
import * as sdStyles from "@styles";
import RowSplitLine from "@src/common/RowSplitLine";
import ConnectWithActions from "@src/connectWithActions";
import SkillList from "@src/screens/tabScreen/Grow/SkillList";
import SkillSimpleList from "@src/screens/tabScreen/Grow/SkillSimpleList";
import { getUserBaseInfo } from "@src/users/usersSelector";
import { CSS } from "@src/common/SDCSS";
import SDLoading from "@sd_components/SDLoading";
import SDRefreshSkillList from "@sd_components/SDRefreshSkillList";
import { skillPunchListAction, certPunchListAction } from "@src/boot/actions";
import { getTabType } from "@utils/funcs";
import { currentJobPlan } from "@src/selectors";

// 成长 - 职场技能\证书tab页
class GrowCheckinSkillTab extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      target: 'skill',
      targetName: '技能',
      page: 1,
      size: 100,
      params: {},
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  componentWillMount(){
    this.setState({
      page: (typeof this.props.page === 'number') ? this.props.page : 1,
      size: (typeof this.props.size === 'number') ? this.props.size : 999,
      target: this.props.target ? this.props.target : 'skill',
      targetName: this.props.targetName ? this.props.targetName : '技能',
    })
  }

  componentDidMount() {
    let params = {
      target: this.state.target,
      size: this.state.size,
      page: this.state.page,
      //start_date: start_time,
      //end_date: end_time
    };
    params.type = getTabType(this.props.type);
    if(params.type === "goal" && this.props.currentJobPlan.title){
      params.profession_id = this.props.currentJobPlan.id;
    }
    this.setState({
      params: params,
    })

    setTimeout(() => {
      this.props.actions.punchListAction(
        this.state.params,
        res => {}
      ).then(res => {
        console.log("componentDidMount tab res===", res, this.state.params);
        if(res){
          if (this.state.target === "cert") {
            store.dispatch(certPunchListAction(res.results));
          } else if(this.state.target === "skill") {
            store.dispatch(skillPunchListAction(res.results));
          }
        }
      }).catch(err => {
        console.log("componentDidMount tab err ==", err)
      })
    }, 400);

  }

  render() {
    const { style, header, isSimple } = this.props;
    const _isSimple = typeof isSimple === 'boolean' ? isSimple : false;
    return (
      <SDRefreshSkillList
        target={this.state.target}
        targetName={this.state.targetName}
        style={[{
          backgroundColor: sdStyles.SDBGColorClick
        },style]}
        type={this.props.type || `通用${this.state.targetName}`}
        header={typeof header === 'function' ? header : null}
        listItem={item => {
          if(_isSimple){
            return <SkillSimpleList
              target={this.state.target}
              targetName={this.state.targetName}
              keyExtractor={item => item.id + ""}
              key={item.id}
              item={Object.assign({}, item, {type: this.props.type})}
             />;
          } else {
            return <SkillList
              target={this.state.target}
              targetName={this.state.targetName}
              type={this.props.type || `通用${this.state.targetName}`}
              keyExtractor={item => item.id + ""}
              key={item.id}
              item={Object.assign({}, item, {type: this.props.type})}
            />;
          }
        }}
      />
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userBaseInfo: getUserBaseInfo(state),
  currentJobPlan: currentJobPlan(state, props),
}))(GrowCheckinSkillTab);
