import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../../../connectWithActions";
import LabelInput from "../../../common/SDLabelInput";
import { schoolJobModel, UserState, educationModel } from "../../../types";

import SelectDate from "../../../sd_selectDate/SelectDate";
import { prefiexDate } from "../../../utils/prefixDate";
import { Toast, Modal } from "antd-mobile";
import { navLightBox } from "@styles";
import SelectorDate from "../../../sd_selectDate/SelectDate";
import { isValidRangeDate } from "../../../utils/funcs";
import { CSS } from "../../../common/SDCSS";
import SDTouchOpacity from "../../../common/SDTouchOpacity";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  saveBtnBox: {
    marginTop: 20,
    height: 36,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden"
  }
});

type Props = {
  job: schoolJobModel,
  userInfo: UserState,
  educationList: educationModel[]
};

// 编辑在校担任职务
class EditInSchoolJobsScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      desc: this.props.job.description
    };
    this.isPosting = false;
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentDidMount() {
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "edit_editInSchoolJob"
    );
  }

  onNavigatorEvent(event) {
    // this is the onPress handler for the two buttons together
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "edit_editInSchoolJob") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        if(this.isPosting) {
          return;
        }
        this.isPosting = true;
        if (
          this.refs["_jobInput"].state.value == "" ||
          this.refs["_startInput"].state.value == "" ||
          this.refs["_endInput"].state.value == "" ||
          this.state.desc == ""
        ) {
          this.isPosting = false;
          Toast.fail("信息不能为空");
          return;
        } else {
          if (this.props.educationList.length <= 0) {
            Toast.fail("缺少教育经历，无法添加学校职务");
            this.isPosting = false;
            return;
          }
          if (
            !isValidRangeDate(
              this.refs["_startInput"].state.value.replace(".", "-") + "-01",
              this.refs["_endInput"].state.value.replace(".", "-") + "-01",
              null,
              "eq"
            )
          ) {
            Toast.fail("开始时间不能大于结束时间");
            this.isPosting = false;
            return;
          }
          Toast.loading("保存中");
          this.props.actions.updateJobItemAction(
            {
              id: this.props.job.id,
              name: this.refs["_jobInput"].state.value,
              start_date:
                this.refs["_startInput"].state.value.replace(".", "-") + "-01",
              end_date:
                this.refs["_endInput"].state.value.replace(".", "-") + "-01",
              description: this.state.desc,
              // 默认保存在当前默认教育里
              education_id: this.props.educationList.filter(
                c => c.is_default == true
              )[0].id
            },
            res => {
              this.context.navigator.pop();
              Toast.info("保存成功");
            }
          );
        }
      }
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={{ height: CSS.pixel(20), backgroundColor: "#f3f3f3" }} />
          <LabelInput
            ref="_jobInput"
            placeholder="职务名称"
            placeholderRight="请输入职务名称"
            defaultValue={this.props.job.name}
          />
          <SelectorDate
            onOk={(y, m) => {
              this.refs["_startInput"].setState({ value: y + "." + m });
            }}
          >
            <LabelInput
              ref="_startInput"
              placeholder="开始时间"
              direction=">"
              defaultValue={this.props.job.start_date
                .slice(0, 7)
                .replace(/-/, ".")}
              disablePress={true}
              isSelector={true}
              placeholderRight="请选择开始时间"
              editable={false}
            />
          </SelectorDate>
          <SelectorDate
            onOk={(y, m) => {
              this.refs["_endInput"].setState({ value: y + "." + m });
            }}
          >
            <LabelInput
              ref="_endInput"
              placeholder="结束时间"
              direction=">"
              defaultValue={this.props.job.end_date
                .slice(0, 7)
                .replace(/-/, ".")}
              disablePress={true}
              isSelector={true}
              placeholderRight="请选择结束时间"
              editable={false}
            />
          </SelectorDate>
          <LabelInput
            footterStyle={{ borderBottomWidth: 0, borderColor: "#fff" }}
            placeholder="职务内容描述"
            editable={false}
            footter={() => {
              return (
                <TextInput
                  defaultValue={this.state.desc}
                  style={{ top: -10, fontSize: 12 }}
                  multiline={true}
                  placeholder="输入职务内容"
                  onChangeText={text => {
                    this.state.desc = text;
                  }}
                />
              );
            }}
          />

          <View
            style={{
              marginTop: CSS.pixel(550),
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <SDTouchOpacity
              onPress={() => {
                navLightBox("ConfirmLightBoxScreen", {
                  passProps: {
                    title: "你确定要删除?",
                    onOk: () => {
                      Toast.loading("删除中");
                      this.props.actions.delJobItemAction(
                        {
                          id: this.props.job.id
                        },
                        () => {
                          this.context.navigator.pop();
                          Toast.info("删除成功");
                        }
                      );
                    }
                  }
                });
              }}
              style={{
                width: CSS.pixel(550),
                height: CSS.pixel(80),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: CSS.pixel(40),
                borderColor: "#FE8900",
                borderWidth: 1,
              }}
            >
              <Text style={{ color: "#FE8900", fontSize: CSS.pixel(32) }}>
                删除该条职务
              </Text>
            </SDTouchOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user,
  educationList: state.userEducationList
}))(EditInSchoolJobsScreen);
