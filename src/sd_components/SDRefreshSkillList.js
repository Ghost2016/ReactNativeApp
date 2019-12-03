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
} from "react-native";
import PropTypes from "prop-types";
import store from "@boot/store";
import defaultStyle from "@styles";
import * as sdStyles from "@styles";
import { navScreen, navRightButton } from "@styles";
import { CSS } from "@common/SDCSS";
import { Toast } from "antd-mobile";
import RowSplitLine from "@src/common/RowSplitLine";
import ConnectWithActions from "@src/connectWithActions";
import TitleWrap from "@src/sd_employmentinfo/titlelistwarp/TitleWrap";
//import SkillList from "@src/screens/tabScreen/Grow/SkillList";
import { getUserBaseInfo } from "@src/users/usersSelector";
import SDUpPullScrollView, {
  RefreshState
} from "@src/common/SDUpPullScrollView";
import { isIphoneX } from "@src/utils/iphonex";
import { ucfirst } from "@src/utils/funcs";
import SDLoading from "@sd_components/SDLoading";
import SDButton from "@sd_components/SDButton";
import GrowingPath from "@sd_components/GrowingPath";
import GrowLightenRoad from "@sd_components/GrowLightenRoad";
import AddMySkillTask from "@sd_components/AddMySkillTask";
import SDEmptyPage from "@sd_components/SDEmptyPage";
import SDIconButton from "@sd_components/SDIconButton";
import { SkillListState, CertListState } from "@src/types"
import { JOB_PLAN_TYPES } from "@src/nullObjects";
import { getCertTaskList, getCertProTaskList } from "@src/screens/tabScreen/Grow/GrowScreenSelecters";
import { currentJobPlan } from "@src/selectors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: CSS.pixel(30, true)
  }
});

const iconEmptyGoal = require('@img/grow/growing_pic_No_goal.png')
const iconEmptyPic = require('@img/grow/growing_pic_empty.png')
const iconAddTask = require('@img/grow/growing_btn_ShuDan.png')

type Props = {
  userBaseInfo: object,
  skillList: ?SkillListState | ?CertListState,
};

class SDRefreshSkillList extends React.PureComponent<Props> {
  props: Props;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      hasRefresh: false,
      refreshState: RefreshState.Idle,
      showEmptyGoal: true,
      showEmptySelf: false,
      showEmptySelfLoading: false,
      target: 'skill',
      targetName: '技能',
      page: 1,
      size: 50,
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  componentWillMount(){
    this.setState({
      page: (typeof this.props.page === 'number') ? this.props.page : 1,
      size: (typeof this.props.size === 'number') ? this.props.size : 50,
      target : this.props.target ? this.props.target : 'skill',
      targetName : this.props.targetName ? this.props.targetName : '技能',
    })
  }

  componentDidMount() {
    console.log("this.props.type====[][]", this.props.type)
    if(this.props.type == `目标职位${this.state.targetName}`){
      if(this.props.currentJobPlan.position.title){
        this.setState({
          showEmptyGoal: false,
          showEmptySelf: false,
        })
      } else {
        this.setState({
          showEmptyGoal: true,
          showEmptySelf: false,
        })
      }
    } else if(this.props.type == `我的${this.state.targetName}`) {
      console.log("this.props.skillList===p[", this.props.skillList)
      if(this.props.skillList.count == 0){
        this.setState({
          showEmptySelfLoading: true,
          showEmptyGoal: false,
          showEmptySelf: false,
        })
        setTimeout(() => {
          this.setState({
            showEmptyGoal: false,
            showEmptySelfLoading: false,
            showEmptySelf: this.props.skillList.count ? false : true,
          })
        }, 3000);
      } else {
        this.setState({
          showEmptyGoal: false,
          showEmptySelf: this.props.skillList.count ? false : true,
        })
      }

    } else {
      this.setState({
        showEmptyGoal: false,
        showEmptySelf: false,
      })
    }

    setTimeout(() => {
      this.onHeaderRefresh();
    }, 200);

  }

  componentWillReceiveProps(nextProps){
    if(this.props.type == `我的${this.state.targetName}` &&
    nextProps.skillList.count !== this.props.skillList.count && nextProps.skillList.count){
      this.setState({
        showEmptyGoal: false,
        showEmptySelfLoading: false,
        showEmptySelf: nextProps.skillList.count ? false : true,
      })
    }
  }

  onHeaderRefresh() {
    const listAction = this.props.actions[`get${ucfirst(this.state.target)}ListAction`];
    let params = {
      page: this.state.page,
      size: this.state.size,
      type: this.props.type || `通用${this.state.targetName}`,
    };
    this.setState({
      refreshState: RefreshState.HeaderRefreshing,
      hasRefresh: true
    });
    if(params.type.match(/^目标/i) && this.props.currentJobPlan.position.title){
      params.position_id = this.props.currentJobPlan.position.id;
    }
    listAction(
      params,
      res => {
        console.log("ListAction res==", this.props.type, res)
        store.dispatch({
          type: `${this.state.target.toUpperCase()}LIST`,
          json: res
        });
        this.setState({
          loading: false,
          refreshState: RefreshState.Idle
        });
        if(this.props.type == `我的${this.state.targetName}` && res.results.length) {
          this.setState({
            showEmptySelf: false,
          })
        }
      }
    ).catch(err => {
      this.setState({
        loading: false,
        refreshState: RefreshState.Idle
      });
    });
  }

  //定制目标
  onPressGotoMake() {
    this.context.navigator.push(
      navScreen("PushScreen", "定制目标", {
        passProps: {
          screen: () => <ScrollView><GrowingPath onPress={this.onPressLighten.bind(this)} /></ScrollView>
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存"),
      })
    );
  }

  //点亮路径
  onPressLighten(index, title) {
    let trgName = "求职";
    if (index == 0) {
      Toast.fail("请点击选择规划路线，再进行下一步");
      return;
    }
    if (index <= JOB_PLAN_TYPES.length && index >= 1) {
      trgName = JOB_PLAN_TYPES[index - 1];
    } else {
      Toast.fail("请点击选择规划路线，再进行下一步");
      return;
    }
    this.context.navigator.push(
      navScreen("PushScreen", "定制目标", {
        passProps: {
          screen: () => <GrowLightenRoad target={trgName} />
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存"),
      })
    );
  }

  onPressAddTask(){
    this.context.navigator.push(
      navScreen("PushScreen", "添加任务", {
        passProps: {
          screen: () => <ScrollView><AddMySkillTask /></ScrollView>,
          fullScreen: true,
          header: {
            title: "添加任务",
            //fixed: true,
          }
        },
        ...navRightButton("save_addMySkillBtn", "保存"),
      })
    );
  }

  onFooterRefresh() {
    const listAction = this.props.actions[`get${ucfirst(this.state.target)}ListAction`];
    let params = {
      //id: this.props.userBaseInfo.id,
      size: this.state.size,
      page: this.state.page + 1,
      type: this.props.type || `通用${this.state.targetName}`,
    };

    if(params.type.match(/^目标/i) && this.props.currentJobPlan.position.title){
      params.position_id = this.props.currentJobPlan.position.id;
    }
    this.setState({ refreshState: RefreshState.FooterRefreshing });
    if (
      this.props.skillList && this.props.skillList.results && this.props.skillList.results.length >= this.props.skillList.count
    ) {
      this.setState({
        refreshState: RefreshState.NoMoreData,
        hasRefresh: true
      });
      return;
    }
    listAction(
      params,
      res => {
        console.log("ListAction res2==", res)
        this.setState({
          loading: false,
          refreshState: RefreshState.Idle
        });
      }
    );
  }

  render() {
    const { header, listItem, style, target, type } = this.props;
    let _skillList = [];
    console.log("skillList.results[][]==", target, this.props.skillList)
    console.log("getCertTaskList[][]==", type, this.props.getCertTaskList)
    console.log("getCertProTaskList[][]==", type, this.props.getCertProTaskList)
    _skillList = (this.props.skillList && this.props.skillList.results) ? this.props.skillList.results : [];
    if(target === "cert" && type == "通用证书" && this.props.getCertTaskList.common && this.props.getCertTaskList.common.results){
      _skillList = this.props.getCertTaskList.common.results || [];
    } else if(target === "cert" && type == "目标职位证书" && this.props.getCertProTaskList.goal && this.props.getCertProTaskList.goal.results ){
      _skillList = this.props.getCertProTaskList.goal.results || [];
    }

    if (this.state.showEmptyGoal) {
      return (<SDEmptyPage
          icon={iconEmptyGoal}
          msgArr={['还没定制目标']}
          btnTitle="制定目标"
          onPress={this.onPressGotoMake.bind(this)} />)
    }

    if (this.state.showEmptySelfLoading) {
      return (<SDLoading  />)
    }
    if (this.state.showEmptySelf) {
      return (<SDEmptyPage
          icon={iconEmptyPic}
          msgArr={['空空如也','你可以创建并管理自己的技能提升任务']}
          btnTitle="添加任务"
          onPress={this.onPressAddTask.bind(this)} />)
    }

    return (<View
        style={[
          styles.container,
          {
            paddingBottom: isIphoneX() ? 44 : 0
          },
          style
        ]}
      >
        {typeof header === "function" ? header(_skillList) : null}

        {this.props.type == `我的${this.state.targetName}` ? <SDIconButton
          icon={iconAddTask}
          btnTitle="添加任务"
          onPress={this.onPressAddTask.bind(this)}
          style={{
            marginTop: CSS.pixel(30, true),
          }}
          /> : null}

        {this.state.loading ? <SDLoading /> : null}
        {_skillList.length > 0 ? (
          <SDUpPullScrollView
            refreshState={this.state.refreshState}
            onFooterRefresh={this.onFooterRefresh.bind(this)}
            onHeaderRefresh={this.onHeaderRefresh.bind(this)}
            data={_skillList}
            keyExtractor={(item,index)=>index.toString()}
            renderItem={({ item }) => {
              if (typeof listItem === "function") {
                return listItem(item);
              } else {
                return null;
              }
            }}
          />
        ) : this.state.loading ? null : (
          <RowSplitLine content="暂无内容" />
        )}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => {
  let type = props.type;
  if(type == "我的技能") type = "custom"
  if(type == "通用技能" || type == "通用证书") type = "common"
  if(type == "目标职位技能" || type == "目标职位证书") type = "goal"
  return {
    userBaseInfo: getUserBaseInfo(state),
    skillList: state[`${props.target}List`][type],
    currentJobPlan: currentJobPlan(state, props),
    //punchSkillList: state.punchSkillList,
    getCertTaskList: getCertTaskList(state),
    getCertProTaskList: getCertProTaskList(state),
  };
})(SDRefreshSkillList);
