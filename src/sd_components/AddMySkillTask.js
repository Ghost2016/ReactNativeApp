import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import PropTypes from "prop-types";
import LabelInput from "@src/common/SDLabelInput";
import defaultStyle from "@styles";
import { navLightBox } from "@styles";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";
import ConnectWithActions from "@src/connectWithActions";
import { getUserId } from "@src/directSelectors";
import SelectDate from "@src/sd_selectDate/SelectDate";
import Seletor from "@src/sd_selector/Selector";
import { prefiexDate } from "@src/utils/prefixDate";
import { Toast } from "antd-mobile";
import Selector from "@src/sd_selector/Selector";
import SelectorDate from "@src/sd_selectDate/SelectDate";
import SelectRangeDate from "@src/screens/lightBoxScreen/SelectRangeDate";
import DotSelect from "@sd_components/DotSelect";
import { getDateObj, isValidStartEndTime } from "@utils/funcs";
import store from "@boot/store";

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: "#fff"
  }
});

type Props = {};

// 我的技能-添加任务
class AddMySkillTask extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      type: '技能提升类',
      startTime: '',
      endTime: '',
      isRemind: true,
    }
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentDidMount() {
    if (this.context.navigatorEvent) {
      this.context.navigatorEvent.setOnNavigatorEvent(
        this.onNavigatorEvent.bind(this),
        "save_addMySkillBtn"
      )
    }

  }

  onNavigatorEvent(event) {
    console.log("onNavigatorEvent", event)
    if (event.type == "NavBarButtonPress") {
      if (event.id == "save_addMySkillBtn") {
        if (
          this.state.name == "" ||
          this.state.type == "" ||
          this.state.startTime == "" ||
          this.state.endTime == ""
        ) {
          Toast.fail("请先完善所有信息");
          return;
        } else {
          Toast.loading("保存中", 0);
          //自定义任务不需要skill_course_id, tech_task_id
          this.props.actions.addMySkillTaskAction(
            {
              status: "new",
              is_remind: this.state.isRemind,
              name: this.state.name,
              description: this.state.type || "技能提升类",
              //profession_id: 0,
              type: 'custom',//'我的技能',
              //skill_course_id: 0,
              //tech_task_id: 0,
              start_time: this.state.startTime,
              end_time: this.state.endTime,
            },
            res => {

            }
          ).then(res => {
            Toast.hide();
            Toast.info("添加成功");

            //刷新任务列表
            this.props.actions.getSkillListAction(
              {
                target: "skill",
                size: 999,
                page: 1,
                type: '我的技能', //'custom',
              },
              res => {}
            ).then(res => {
              store.dispatch({
                type: `SKILLLIST`,
                json: res
              });

              this.props.actions.stateSkillListAction({}, res => {}).then(res => {
                this.props.actions.setSkillStateState(res.results)
              })
              /* this.props.actions.stateCertListAction({}, res => {}).then(res => {
                this.props.actions.setCertStateState(res.results)
              }) */
              setTimeout(() => {
                this.context.navigator.pop();
              }, 400);

            }).catch(err => {

            })

          }).catch(res => {
            //Toast.hide();
            Toast.fail("添加失败");
            //this.context.navigator.pop();
          })
        }
      }
    }
  }

  setDate(startDate, endDate){
    if(!isValidStartEndTime(startDate, endDate)){
      Toast.fail("结束时间不能晚于开始时间！", 1)
      return
    }
    this.setState({
      startTime: getDateObj(startDate.toString(), false, true, true),
      endTime: getDateObj(endDate.toString(), false, true, true),
    })
  }

  onPressCheckRemind(){
    this.setState({
      isRemind: !this.state.isRemind,
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <LabelInput
            ref="_nameInput"
            placeholder="任务名称"
            placeholderColor={sdStyles.SDFontColorSubtitle}
            placeholderRight="请输入任务名称"
            onChange={value => {
              //this.refs["_nameInput"].setState({ value: value });
              this.setState({
                name: value
              })
            }}
          />
          <Selector
            options={[
              {
                label: "技能提升类",
                value: "技能提升类"
              },
            ]}
            onChange={value => {
              //this.refs["_typeInput"].setState({ value: value });
              this.setState({
                type: value[0]
              })
            }}
          >
            <LabelInput
              ref="_typeInput"
              placeholder="任务类型"
              placeholderColor={sdStyles.SDFontColorSubtitle}
              editable={false}
              direction="技能提升类"
              disablePress={true}
            />
          </Selector>

          <LabelInput
              ref="_timeInput"
              placeholder="任务时间"
              placeholderColor={sdStyles.SDFontColorSubtitle}
              direction={this.state.startTime ? `${this.state.startTime} 到 ${this.state.endTime}` : '>'}
              editable={false}
              onPress={() => {
                navLightBox("LightBoxScreen", {
                  passProps: {
                    screen: () => <SelectRangeDate mode="datetime" onOk={this.setDate.bind(this)} />
                  }
                })
              }}
            />


          <View style={[defaultStyle.center, {
            padding: 10,
            height: 60,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            paddingLeft: CSS.pixel(30),
           }]}>
            <DotSelect
                    title="到时提醒"
                    reverseTitle="到时提醒"
                    useIcon={true}
                    isSelect={this.state.isRemind}
                    data={null}
                    index={0}
                    isNotLimitSelect={true}
                    circleBorder={0}
                    onPress={this.onPressCheckRemind.bind(this)}
                    selectColor={sdStyles.SDBGColorOrange}
                    txtStyle={{
                      fontSize: CSS.pixel(30),
                      position: "relative",
                      left: CSS.pixel(0)
                    }}
                    isSmall={true}
                    style={{
                      alignSelf: "flex-start",
                      borderWidth: 0,
                      borderColor: sdStyles.SDBGColorOrange,
                      paddingLeft: Platform.OS == 'android' ? CSS.pixel(0) : CSS.pixel(0),
                    }}
                    iconStyle={{
                      backgroundColor: 'transparent',
                      borderColor: 'transparent',
                      position: 'relative',
                      left: CSS.pixel(-16),
                    }}
                  />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userId: getUserId(state)
}))(AddMySkillTask);

