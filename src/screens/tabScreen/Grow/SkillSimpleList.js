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
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import store from "@boot/store";
import defaultStyle, { navLightBox } from "@styles";
import { Toast } from "antd-mobile";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";
import { navScreen, navRightButton } from "@styles";
//import { getSuitableSize } from "@utils/qiniupic";
import DotSelect from "@sd_components/DotSelect";
//import SDButton from "@sd_components/SDButton";
import SDCollapse from "@sd_components/SDCollapse";
import SelectButton from "@sd_components/SelectButton";
import SDLine from "@sd_components/SDLine";
import { getDateObj, countHour, countHour2, getTabType, getPowerWeek } from "@utils/funcs";
import PunchSkill from "@sd_components/PunchSkill";
import PunchCert from "@sd_components/PunchCert";
import GrowReadOk from "@sd_components/GrowReadOk";
import { skillPunchListAction, certPunchListAction } from "@src/boot/actions";
import { currentJobPlan } from "@src/selectors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  }
});

type Props = {};

//const iconFinished = require("@img/grow/growing_ico__finish.png");
const iconFinished = require("@img/grow/growing_ico__finishY.png");
const width = Dimensions.get("window").width;

// 动态信息List
class SkillSimpleList extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };
  state={
    selectIndex: undefined,
    certificate: undefined,
    is_check: undefined,
    target: 'skill',
    targetName: '技能',
  }

  onPressPunchSkill(data, professionId, index, content) {
    console.log("PunchSkill====", professionId, data);
    Toast.info("打卡成功！")
    this.setState({
      selectIndex: true
    });

    //自定义任务不需要skill_course_id, tech_task_id
    this.props.actions.punchSkillCourseAction({
      //status: "new",
      //is_remind: false,
      //title: data.task.title,
      description: content,
      //profession_id: 0,
      tech_task_id: data.task.id,
    }, res => {}).then(res => {
      console.log("punchTask====", res)
      //刷新tech_list列表，更新打卡状态
      setTimeout(() => {
        this.context.navigator.pop();
      }, 1000);

      this.props.actions.getUserInfoAction();

      //技能证书统计数据
      this.props.actions.stateSkillListAction({}, res => {}).then(res => {
        this.props.actions.setSkillStateState(res.results)
      })
      this.props.actions.stateCertListAction({}, res => {}).then(res => {
        this.props.actions.setCertStateState(res.results)
      })

      getPowerWeek().then(data=>{
        //刷新排名
        this.context.refs['_rankScreen'] && this.context.refs['_rankScreen'].handleActionToUpdateAllData();
        //this.context.refs['__scoreChartWrap'].getPower();

        this.props.actions.stateCertListAction({}, res => {}).then(res => {
          this.props.actions.setCertStateState(res.results)
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
            targetName={data.type || "职场技能"}
            />
          )
        }
      });
    })
  }

  onPressPunch(isPunched, data, index) {
    console.log("onPressPunch====", isPunched, data, index);
    const professionId = (data.type == "目标职位证书" && this.props.currentJobPlan.position.title) ? this.props.currentJobPlan.position.id : 0;
    if (this.props.target === 'cert') {
      this.context.navigator.push(
        navScreen("PushScreen", "证书考取", {
          passProps: {
            screen: () => <ScrollView><PunchCert index={index} target="cert" professionId={professionId} data={data} /></ScrollView>,
            fullScreen: true,
            header: {
              title: "证书考取",
              //fixed: true,
            }
          },
          //...navRightButton("save_addMySkillBtn", "保存"),
        })
      );
    } else if(this.props.target === 'skill') {

      this.context.navigator.push(
        navScreen("PushScreen", "职场技能", {
          passProps: {
            screen: () => <ScrollView><PunchSkill index={index} target="skill" professionId={professionId} data={data} onPress={this.onPressPunchSkill.bind(this)} /></ScrollView>,
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

  }

  componentWillMount(){
    const { item } = this.props;
    //console.log("item will====", item)

    this.setState({
      //selectIndex: typeof item.selected === 'boolean' ? item.selected : false,
      //selectIndex: item.status === 'done' ? true : false,
      selectIndex: this.state.selectIndex ? true : (item.is_check || item.status === 'done') ? true : false,
      target : this.props.target ? this.props.target : 'skill',
      targetName : this.props.targetName ? this.props.targetName : '技能',
    })
    //console.log("punchSkillList=====", this.props.punchSkillList)
  }

  componentWillReceiveProps(nextProps){
    console.log("item willreceive====", nextProps.item)
    //if (this.props.item.is_check !== nextProps.item.is_check) {
      const { item } = nextProps;
      this.setState({
        //selectIndex: item.status === 'done' ? true : false,
        selectIndex: this.state.selectIndex ? true : (item.is_check || item.status === 'done') ? true : false,
      })
    //}
  }

  componentDidMount(){
    const { item, target } = this.props;
    //console.log("_CertListItem_===", item, target)
    if(target == "cert") this.context.refs["_CertListItem_" + target + "_" + item.id] = this;
  }

  //添加完证书后，还需要进行证书打卡
  punchCert(professionId, data) {
    console.log("punchCert cert====", professionId, data);
    const postData = professionId ? {
      certificate_id: data.task.id,
      name: data.task.name,
      profession_id: professionId,
    } : {
      certificate_id: data.task.id,
      name: data.task.name,
    };
    this.props.actions.punchCertAction(postData, res => {}).then(res => {
      this.setState({
        selectIndex: true,
        certificate: res.results.certificate,
        is_check: true,
      })
      Toast.hide();
      //Toast.info("考取证书打卡成功");

      let params = {
        target: "cert",
        type: getTabType(this.props.targetName),
        size: 50,
        page: 1,
      };
      if(params.type === "goal" && this.props.currentJobPlan.position.title){
        params.profession_id = this.props.currentJobPlan.position.id;
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
            content={""}
            targetName={data.type || "证书考取"}
            />
          )
        }
      });
    })
  }

  render() {
    let { item, target } = this.props;
    console.log("item simple====", item)
    if(this.state.certificate && !item.certificate && item.id == this.state.certificate.certificate.id){
      item.certificate = this.state.certificate;
      item.is_check = this.state.is_check;
    }
    const title = (target == "skill") ? item.name : item.name;
    let dfTitle = title.substr(0, 30);
    let newTitle = dfTitle;
    let date = '';
    if(target == "cert"){
      newTitle = this.state.selectIndex ? title.substr(0, 30) + "    " + ( (item.certificate && item.certificate.score) ? "成绩："+item.certificate.score : "") : title.substr(0, 30);
      date = item.certificate? item.certificate.acquire_date.split('-').filter((n,i)=>{return i<=1}).join('.') : ".";
    }
    return (
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#fff",
          width: "100%",
          paddingTop: CSS.pixel(40, true),
          borderBottomWidth: 1,
          borderBottomColor: sdStyles.SDBGColorMain,
          borderWidth: 0,
          borderColor: "#f00",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            width: width,
            borderWidth: 0,
            borderColor: "#f00",
            marginBottom: CSS.pixel(40, true),
            marginTop: CSS.pixel(0, true),
            paddingLeft: CSS.pixel(30),
            paddingRight: CSS.pixel(40),
          }}
        >
          <DotSelect
            title={newTitle}
            reverseTitle={dfTitle}
            useIcon={true}
            isSelect={this.state.selectIndex}
            data={{
              task: item,
            }}
            index={0}
            circleBorder={0}
            onPress={() => {}}
            selectColor={
              this.state.selectIndex ? sdStyles.SDMainColor : sdStyles.SDHelperColorline
            }
            txtStyle={{
              fontSize: CSS.pixel(28),
              position: "relative",
              left: CSS.pixel(0),
              color: sdStyles.SDFontColorMain,
              //width: CSS.pixel(540),
            }}
            isSmall={true}
            style={{
              alignSelf: "center",
              flexGrow: 1,
              paddingLeft: Platform.OS=="android"? CSS.pixel(20) : CSS.pixel(0),
              borderWidth: 0,
              borderColor: '#f00',
            }}
            iconStyle={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              position: 'relative',
              left: CSS.pixel(-16),
            }}
          />
          {(this.state.selectIndex && date) ? <Text style={{
            fontSize: CSS.textSize(24),
          }}>{item.certificate? date : ""}</Text> : typeof this.state.selectIndex == "boolean" ? <SelectButton
            selectTitle="已完成"
            unSelectTitle="完成"
            icon={iconFinished}
            isSelected={this.state.selectIndex}
            data={{
              task: item,
              type: item.type,
            }}
            index={item.id}
            onPress={this.state.selectIndex? ()=>{} : this.onPressPunch.bind(this)}
            style={{
              /* borderWidth: 0,
              borderColor: "#00f",
              width: Platform.OS == "android" ? CSS.pixel(101) : CSS.pixel(101),position: 'relative',
              left: Platform.OS == "android" ? CSS.pixel(0) : CSS.pixel(-10), */
              borderWidth: (this.state.selectIndex) ? 0 : 1,
              borderColor: sdStyles.SDMainColor,
              width: Platform.OS == "android" ? CSS.pixel(101) : CSS.pixel(101),
              position: 'relative',
              left: Platform.OS == "android" ? CSS.pixel(0) : CSS.pixel(0),
              borderRadius: CSS.pixel(22),
              backgroundColor: '#fff',
            }}
            textStyle={{
              color: sdStyles.SDMainColor,
            }}
          /> : null}
        </View>
        <View
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: CSS.pixel(611),
                    borderWidth: 0,
                    borderColor: '#f0f',
                  }}
                >
                  {(item.is_check && target == "cert" && item.certificate &&  item.certificate.attachments &&  item.certificate.attachments.length) ? <SDLine style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    borderWidth: 0,
                    borderColor: '#f00',
                    width: '100%',
                  }}>
                      <View style={{
                        borderWidth: 0,
                        borderColor: '#0ff',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                      }}>
                        {item.certificate.attachments[0] ? <Image source={{uri:`${item.certificate.attachments[0].url}?imageView2/2/w/600`}}
                          style={{ height: CSS.pixel(200, true), width: CSS.pixel(300), marginRight: CSS.pixel(11),  }}
                       /> : null}
                       {item.certificate.attachments[1] ? <Image source={{uri:`${item.certificate.attachments[1].url}?imageView2/2/w/600`}}
                          style={{ height: CSS.pixel(200, true), width: CSS.pixel(300) }}
                       /> : null}
                      </View>
                       <Text style={{
                         fontSize: CSS.textSize(20),
                         color: sdStyles.SDFontColorMinor,
                         marginTop: CSS.pixel(30, true),
                         //marginBottom: CSS.pixel(40, true),
                       }}>
                        已考取
                       </Text>
                                    </SDLine> : null}

                  {item.status === "new" ? <SDLine>
                                      <Text style={{
                                        color: sdStyles.SDMainColor,
                                        fontSize: CSS.textSize(28),
                                      }}>{getDateObj(item.start_time, false, true, true, '.')} - {getDateObj(item.end_time, false, true, true, '.')}</Text>
                                    </SDLine> : null}

                  {item.status == "done" ? <SDLine>
                                      <Text style={{
                                        color: sdStyles.SDMainColor,
                                        fontSize: CSS.textSize(28),
                                      }}>{getDateObj(item.finish_time, true, false, false, '.')} 用时{countHour2(item)}小时</Text>
                                    </SDLine> : null}

                  {item.status == "done" ? <SDLine>
                                      <Text style={{
                                        color: sdStyles.SDFontColorMinor,
                                        fontSize: CSS.textSize(28),
                                        lineHeight: 16,
                                      }}>
                                        {item.description}
                                      </Text>
                                    </SDLine> : null}
                </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //userBaseInfo: getUserBaseInfo(state),
  currentJobPlan: currentJobPlan(state, props),
  punchSkillList: state.punchSkillList,
}))(SkillSimpleList);
