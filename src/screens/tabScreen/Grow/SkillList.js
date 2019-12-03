/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  PixelRatio,
  Modal,
  Linking,
} from "react-native";
import PropTypes from "prop-types";
import store from "@boot/store";
import ConnectWithActions from "@src/connectWithActions";
import { Toast } from "antd-mobile";
import defaultStyle, { navLightBox } from "@styles";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";
//import { getSuitableSize } from "@utils/qiniupic";
import DotSelect from "@sd_components/DotSelect";
//import SDButton from "@sd_components/SDButton";
import SDCollapse from "@sd_components/SDCollapse";
import SelectButton from "@sd_components/SelectButton";
import SDLoading from "@sd_components/SDLoading";
import PunchSkill from "@sd_components/PunchSkill";
import { getUserBaseInfo } from "@src/users/usersSelector";
import { getSkillCourseTaskList, getSkillCourseProTaskList } from "@src/screens/tabScreen/Grow/GrowScreenSelecters";
import { navScreen, navRightButton } from "@styles";
import ImageViewer from '@src/sd_imageViewer/ImageViewer';
import GrowReadOk from "@sd_components/GrowReadOk";
import { skillPunchListAction, certPunchListAction } from "@src/boot/actions";
import { getTabType, getPowerWeek } from "@utils/funcs";
import { currentJobPlan } from "@src/selectors";
import SDSection from "@sd_components/SDSection";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  }
});

type Props = {};

const iconFinished = require("@img/grow/growing_ico__finishY.png");
const screenWidth = Dimensions.get("window").width;

// 动态信息List
class SkillList extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };
  state={
    target: 'skill',
    targetName: '技能',
    selectIndex: [],
    selectIndexData: {},
    courses: {},
    collapse: true,
    loading: false,
    currentSkilllId: 0,
    currentSkilllName: '',
    isFetching: false,
    // 是否正在查看图片详细
    isViewingImages: false,
    // 正在进行查看的图片组合
    images: [],
    // 图片默认位置
    index: 0,
    hasCommon: false,
    hasGoalTrg: false,
  }

  onPressFinish() {
    this.context.navigator.pop();
  }

  onPressPunchSkill(data, professionId, index, content) {
    console.log("onPressPunchSkill====", data, professionId, index, content)
    //return
    let temp = [...this.state.selectIndex];
    temp[index] = true;
    let selectIndexData = this.state.selectIndexData
    selectIndexData[index] = {
      id: 0,
      task: { name: '技能任务', description: '' },
      status: 'done',
      is_system: true,
      is_remind: false,
      name: data.course.name,
      description: content,
      profession_id: professionId,
      created_time: '',
      skill_course_id: data.course.id,
      start_time: null,
      end_time: null,
      type: 'common',
      finish_time: '',
      up_power: 0
    };
    this.setState({
      selectIndex: temp,
      selectIndexData: selectIndexData,
    });
    //console.log("punchSkillCourseAction", selectIndexData)
    this.props.actions.punchSkillCourseAction({
      status: "new",
      is_remind: false,
      name: data.course.name,
      description: content,
      profession_id: professionId,
      skill_course_id: data.course.id,
      tech_task_id: data.task.id,
    }, res => {}).then(res => {
      console.log("punchCourse====", res)
      //刷新tech_list列表，更新打卡状态

      setTimeout(() => {
        this.context.navigator.pop();
      }, 1000);

      let params = {
        target: "skill",
        type: getTabType(this.props.targetName),
        size: 50,
        page: 1,
      };
      if(params.type === "goal" && professionId){
        params.profession_id = professionId;
      }
      this.props.actions.punchListAction(
        params,
        res => {}
      ).then(res => {
        //console.log("PunchListAction res===22", res, params);
        store.dispatch(certPunchListAction(res.results));

        this.props.actions.getUserInfoAction();

        this.props.actions.stateSkillListAction({}, res => {}).then(res => {
          this.props.actions.setSkillStateState(res.results)
        })
        this.props.actions.stateCertListAction({}, res => {}).then(res => {
          this.props.actions.setCertStateState(res.results)
        })

        getPowerWeek().then(data => {
          //刷新排名
          this.context.refs['_rankScreen'] && this.context.refs['_rankScreen'].handleActionToUpdateAllData();
          //this.context.refs['__scoreChartWrap'].getPower();

          this.props.actions.stateCertListAction({}, res => {}).then(res => {
            this.props.actions.setCertStateState(res.results)
          })
        })

      })

      //弹窗提示
      navLightBox("LightBoxScreen", {
        style: {
          backgroundColor: "rgba(0,0,0,0.5)"
        },
        passProps: {
          screen: () => (
            <GrowReadOk style={{
              position: 'absolute',
              top: '7%',
              left: 0,
              width: '98%',
              height: '90%',
            }}
            data={data}
            res={res}
            content={content}
            />
          )
        }
      });
    }).catch(err=>{
      console.log("puch skill err", err)
    })
  }

  onPressPunch(isPunched, data, index) {
    console.log("onPressPunch====", isPunched, data, index);
    const professionId = (data.type == "目标职位技能" && this.props.currentJobPlan.position.title) ? this.props.currentJobPlan.position.id : 0;
    this.context.navigator.push(
      navScreen("PushScreen", "职场技能", {
        passProps: {
          screen: () => <ScrollView><PunchSkill index={index} professionId={professionId} data={data} onPress={this.onPressPunchSkill.bind(this)} /></ScrollView>,
          fullScreen: true,
          header: {
            title: "职场技能",
            //fixed: true,
          }
        },
        //...navRightButton("save_addMySkillBtn", "保存"),
      })
    );

  }

  componentWillMount(){
    const { item } = this.props
    let arr = [];
    this.setState({
      selectIndex: arr,
      target : this.props.target ? this.props.target : 'skill',
      targetName : this.props.targetName ? this.props.targetName : '技能',
    })
  }

  componentWillReceiveProps(nextProps){
    let arr = [];
    if(nextProps.getSkillCourseTaskList !== this.props.getSkillCourseTaskList){
      //console.log("getSkillCourseTaskList==", nextProps.getSkillCourseTaskList)
      if(nextProps.getSkillCourseTaskList[this.props.item.name]) nextProps.getSkillCourseTaskList[this.props.item.name].results.map((n,i) => {
        //arr.push(n.is_check ? true : false);
        let data = this.state.selectIndexData;
        console.log("getSkillCourseTaskList==n", n)
        arr.push(this.state.selectIndex[i] ? true : n.is_check);
        data[i] = n;
        this.setState({
          selectIndexData: data,
        })
      })
      this.setState({
        selectIndex: arr,
        hasCommon: (nextProps.getSkillCourseTaskList[this.props.item.name] && nextProps.getSkillCourseTaskList[this.props.item.name].results.length) ? true : false,
      })
      console.log("hasCommon=====", arr)
    }
    //目标职位
    if(nextProps.getSkillCourseProTaskList !== this.props.getSkillCourseProTaskList){
      //console.log("getSkillCourseProTaskList==", nextProps.getSkillCourseProTaskList)
      if(nextProps.getSkillCourseProTaskList[this.props.item.name]) nextProps.getSkillCourseProTaskList[this.props.item.name].results.map((n,i) => {
        //arr.push(n.is_check ? true : false);
        let data = this.state.selectIndexData;
        arr.push(this.state.selectIndex[i] ? true : n.is_check);
        data[i] = n;
        this.setState({
          selectIndexData: data,
        })
      })
      this.setState({
        selectIndex: arr,
        hasGoalTrg: (nextProps.getSkillCourseProTaskList[this.props.item.name] && nextProps.getSkillCourseProTaskList[this.props.item.name].results.length) ? true : false,
      })
      console.log("hasGoalTrg=====", arr)
    }
  }

  getCourses(isTrue, data) {
    this.setState({
      collapse: isTrue,
      loading: true,
      currentSkilllId: data.id || 0,
      currentSkilllName: data.title || data.name || '',
    })
    console.log("getCourses===[][]", isTrue, data)
    this.props.actions.getSkillCourseListAction(
      {
        page: 1, //this.props.userBaseInfo.id,
        size: 50, //this.props.skillList.results.length
        skill_id: data.id || 0,
      },
      res => {
        console.log("this.props.skillCourseList res==", res)
        let params = {
          target: "skill",
          page: 1,
          size: 100,
          type: getTabType(data.type),
        }
        store.dispatch({
          type: "SKILLCOURSELIST",
          name: data.title || data.name, //data.type,
          json: res
        });
        this.setState({
          loading: false,
        });
        if(params.type === "goal" && this.props.currentJobPlan.position.name){
          params.profession_id = this.props.currentJobPlan.position.id;
        }
        this.props.actions.punchListAction(params, res => {}).then(res => {
            console.log("punchListAction skill update ===", res)
            store.dispatch(skillPunchListAction(res.results));
        })
      }
    );
  }

  onClickImages(index, data) {
    console.log("onClickImages===", index, data)
    if(data.url && typeof data.url === "string" && data.url.match(/^https?:\/\/[0-9a-z\.\-]+/i)) Linking.openURL(data.url).catch(err =>
                    console.error("An error occurred", err)
                  );
    /*this.setState({
      images: [data],
      isViewingImages: true,
      index: index,
    })*/
  }

  render() {
    const { item, userBaseInfo } = this.props;
    let skillCourseList = [];
    //console.log("this.props.skillCourseList.results[][]==", this.props.skillCourseList)
    if(this.props.skillCourseList && this.props.skillCourseList.results) skillCourseList = this.props.skillCourseList.results;

    //console.log("item====", item, skillCourseList)
    return (
      <SDSection><SDCollapse
        containerStyle={{
          flexDirection: "column",
          alignItems: "flex-start"
        }}
        style={{
          borderWidth: 0,
          borderColor: "#f00"
        }}
        title={item.name}
        collapse={this.state.collapse}
        data={item}
        onPress={this.getCourses.bind(this)}
      >

        {this.state.loading ? <SDLoading /> : null}
        {this.state.collapse? skillCourseList.map((n,i)=>{
          console.log("skillCourseList n====", n, this.state.selectIndex[i], this.state.selectIndexData[i])
          return (<View
                key={i}
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  width: "100%",
                  paddingTop: CSS.pixel(32, true),
                  paddingBottom: CSS.pixel(28, true),
                  borderBottomWidth: 1,
                  borderBottomColor: sdStyles.SDHelperColorline,
                  borderWidth: 0,
                  borderColor: "#f0f",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    borderWidth: 0,
                    borderColor: "#f00",
                    paddingVertical: CSS.pixel(0),
                    paddingLeft: Platform.OS=="android"? CSS.pixel(26) : CSS.pixel(36),
                    paddingRight: CSS.pixel(20),
                  }}
                >
                  <DotSelect
                    title={n.name}
                    reverseTitle={n.name}
                    useIcon={true}
                    isSelect={this.state.selectIndex[i] || n.is_punch}
                    data={{
                      task: item,
                      course: n,
                    }}
                    index={0}
                    circleBorder={0}
                    onPress={() => {}}
                    selectColor={
                      (this.state.selectIndex[i] || n.is_punch) ? sdStyles.SDMainColor : sdStyles.SDHelperColorline
                    }
                    txtStyle={{
                      fontSize: CSS.pixel(24),
                      position: "relative",
                      left: 0,//CSS.pixel(-6),
                      color: sdStyles.SDFontColorMain,
                      width: Platform.OS=="android"? CSS.pixel(504) : CSS.pixel(534),
                      borderWidth: 0,
                      borderColor: "#00f",
                    }}
                    isSmall={true}
                    style={{
                      alignSelf: "center",
                      //flexGrow: 1,
                      paddingLeft: Platform.OS=="android"? CSS.pixel(0) : CSS.pixel(14),
                      borderWidth: 0,
                      borderColor: "#00f",
                     }}
                    iconStyle={{
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                      position: 'relative',
                      left: 0,//CSS.pixel(-16),
                    }}
                  />
                  {(typeof this.state.selectIndex[i] == "boolean" || !this.state.hasCommon || !this.state.hasGoalTrg) ? <SelectButton
                    selectTitle="已完成"
                    unSelectTitle="完成"
                    icon={iconFinished}
                    isSelected={this.state.selectIndex[i] || n.is_punch}
                    data={{
                      task: item,
                      course: n,
                      type: item.type,
                    }}
                    index={i}
                    onPress={(this.state.selectIndex[i] || n.is_punch)? ()=>{} : this.onPressPunch.bind(this)}
                    style={{
                      borderWidth: (this.state.selectIndex[i] || n.is_punch) ? 0 : 1,
                      borderColor: sdStyles.SDMainColor,
                      width: Platform.OS == "android" ? CSS.pixel(101) : CSS.pixel(101),
                      position: 'relative',
                      left: Platform.OS == "android" ? CSS.pixel(0) : CSS.pixel(-30),
                      borderRadius: CSS.pixel(22),
                      backgroundColor: '#fff',
                    }}
                    textStyle={{
                      color: sdStyles.SDMainColor,
                    }}
                    textSelectStyle={{
                      position: 'relative',
                      left: Platform.OS == "android" ? CSS.pixel(12) : CSS.pixel(12),
                      color: sdStyles.SDFontColorSubtitle,
                    }}
                  /> : null}
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  {(n.image && n.image.url) ? <TouchableOpacity
                        key={i + ""}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          borderWidth: 0,
                          borderColor: '#f00',
                          borderRadius: 10,
                         }}
                        activeOpacity={1.0}
                        onPress={this.onClickImages.bind(this, i, n)}
                      >
                  <Image source={{uri:`${n.image.url}?imageView2/2/w/1000`}}
                      style={{
                        height: CSS.pixel(196, true),
                        width: CSS.pixel(650),
                        marginTop: Platform.OS == "android" ? CSS.pixel(31) : CSS.pixel(41, true),
                        borderRadius: 10,
                        overflow: 'hidden',
                        }}
                    />
                  </TouchableOpacity> : null}
                  {(this.state.selectIndexData[i] && this.state.selectIndexData[i].data && this.state.selectIndexData[i].data.description) ? <View>
                    <View
                      style={{
                        /* shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.4,
                        shadowRadius: 5,
                        shadowColor: "#999",
                        //注意：这一句是可以让安卓拥有灰色阴影
                        elevation: 1, */
                        width: CSS.pixel(16),
                        height: CSS.pixel(16, true),
                        position: 'absolute',
                        top: Platform.OS == "android" ? CSS.pixel(20) : CSS.pixel(24, true),
                        left: CSS.pixel(25),
                        backgroundColor: sdStyles.SDBGColorGrey,
                        transform: [
                          {
                            rotateZ: "45deg"
                          }
                        ],
                        borderWidth: 0,
                        borderColor: '#f00',
                        zIndex: 5,
                      }}
                    />
                    <View style={{
                    width: CSS.pixel(650),
                    //minHeight: CSS.pixel(169, true),
                    backgroundColor: sdStyles.SDBGColorGrey,
                    borderRadius: 10,
                    marginTop: CSS.pixel(30, true),
                    padding: CSS.pixel(26),
                    borderWidth: 0,
                    borderColor: '#f00',
                  }}>

                    <Text
                      style={{
                        //marginTop: CSS.pixel(46, true),
                        fontSize: CSS.pixel(24),
                        color: sdStyles.SDFontColorMinor,
                      }}
                    >{(this.state.selectIndexData[i] && this.state.selectIndexData[i].data) ? this.state.selectIndexData[i].data.description : null}</Text>
                  </View>
                  </View> : null}
                </View>
              </View>)
        }) : null}
      </SDCollapse></SDSection>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userBaseInfo: getUserBaseInfo(state),
  skillCourseList: state.skillCourseList[props.item.name],
  currentJobPlan: currentJobPlan(state, props),
  punchSkillList: state.punchSkillList,
  getSkillCourseTaskList: getSkillCourseTaskList(state),
  getSkillCourseProTaskList: getSkillCourseProTaskList(state),
}))(SkillList);
