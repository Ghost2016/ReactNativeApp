import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../../../connectWithActions";
import LabelInput from "../../../common/SDLabelInput";

import SelectDate from "../../../sd_selectDate/SelectDate";
import { prefiexDate } from "../../../utils/prefixDate";
import { Toast, Modal } from "antd-mobile";
import { practiceExpModel } from "../../../types";
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
  practice: practiceExpModel
};

// 编辑实习经历
class EditPracticeScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      desc: this.props.practice.job_desc
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
      "edit_practiceExpBtn"
    );
  }

  onNavigatorEvent(event) {
    // this is the onPress handler for the two buttons together
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "edit_practiceExpBtn") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        if(this.isPosting) {
          return;
        }
        this.isPosting = true;
        if (
          this.refs["_companyInput"].state.value == "" ||
          this.refs["_jobInput"].state.value == "" ||
          this.state.desc == "" ||
          this.refs["_startInput"].state.value == "" ||
          this.refs["_endInput"].state.value == ""
        ) {
          Toast.fail("信息不能为空");
          this.isPosting = false;
          return;
        } else {
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
          this.props.actions.updateUserWorkItemAction(
            {
              id: this.props.practice.id,
              name: "实习",
              company_name: this.refs["_companyInput"].state.value,
              job_name: this.refs["_jobInput"].state.value,
              job_desc: this.state.desc,
              is_internship: true,
              start_date:
                this.refs["_startInput"].state.value.replace(".", "-") + "-01",
              end_date:
                this.refs["_endInput"].state.value.replace(".", "-") + "-01"
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
          <View style={{height: CSS.pixel(20), backgroundColor: '#f3f3f3'}}></View>
          <LabelInput
            ref="_companyInput"
            placeholder="公司名称"
            placeholderRight="请输入公司名称"
            defaultValue={this.props.practice.company_name}
          />
          <LabelInput
            ref="_jobInput"
            placeholder="职位名称"
            placeholderRight="请输入职位名称"
            defaultValue={this.props.practice.job_name}
          />
          <SelectorDate
            onOk={(y, m) => {
              this.refs["_startInput"].setState({ value: y + "." + m });
            }}
          >
            <LabelInput
              placeholder="开始时间"
              defaultValue={this.props.practice.start_date
                .slice(0, 7)
                .replace(/-/, ".")}
              editable={false}
              direction=">"
              placeholderRight="请选择开始时间"
              isSelector={true}
              disablePress={true}
              ref="_startInput"
            />
          </SelectorDate>
          <SelectorDate
            onOk={(y, m) => {
              this.refs["_endInput"].setState({ value: y + "." + m });
            }}
          >
            <LabelInput
              placeholder="结束时间"
              defaultValue={this.props.practice.end_date
                .slice(0, 7)
                .replace(/-/, ".")}
              editable={false}
              placeholderRight="请选择结束时间"
              isSelector={true}
              direction=">"
              disablePress={true}
              ref="_endInput"
            />
          </SelectorDate>
          <LabelInput
            placeholder="工作内容描述"
            editable={false}
            footterStyle={{ borderBottomColor: "#fff" }}
            footter={() => (
              <TextInput
                style={{ color: "#999", lineHeight: 18, marginBottom: 10 }}
                defaultValue={this.state.desc}
                multiline={true}
                returnKeyLabel="换行"
                returnKeyType="next"
                onChangeText={text => (this.state.desc = text)}
              />
            )}
          />
          <View
            style={{
              marginTop: CSS.pixel(400),
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
                      this.props.actions.delUserWorkItemAction(
                        {
                          id: this.props.practice.id
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
                删除该条经历
              </Text>
            </SDTouchOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(EditPracticeScreen);
