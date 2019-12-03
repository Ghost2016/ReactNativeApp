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
import { Toast } from "antd-mobile";
import LabelInput from "../../../common/SDLabelInput";
import SelectDate from "../../../sd_selectDate/SelectDate";
import { prefiexDate } from "../../../utils/prefixDate";
import ConnectWithActions from "../../../connectWithActions";
import SelectorDate from "../../../sd_selectDate/SelectDate";
import { isValidRangeDate } from "../../../utils/funcs";
import { CSS } from "../../../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  saveBtnBox: {
    marginTop: 20,
    height: 46,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden"
  }
});

//
class AddPracticeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      desc: ""
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
      "save_practiceExpBtn"
    );
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_practiceExpBtn") {
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
          this.props.actions.addUserWorkItemAction(
            {
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
            placeholder="公司名称"
            placeholderRight="请输入公司名称"
            ref="_companyInput"
          />
          <LabelInput
            placeholder="职位名称"
            placeholderRight="请输入职位名称"
            ref="_jobInput"
          />
          <SelectorDate
            onOk={(y, m) => {
              this.refs["_startInput"].setState({ value: y + "." + m });
            }}
          >
            <LabelInput
              placeholder="开始时间"
              editable={false}
              direction=">"
              isSelector={true}
              placeholderRight="请选择开始时间"
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
              editable={false}
              placeholderRight="请选择结束时间"
              direction=">"
              isSelector={true}
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
                // defaultValue="负责公司App产品规划，版本迭代实施，产品原型设计，跟进研发需求沟通等"
                placeholder="请描述你的工作内容"
                multiline={true}
                onChangeText={text => (this.state.desc = text)}
                returnKeyLabel="换行"
                returnKeyType="next"
              />
            )}
          />
        </ScrollView>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(AddPracticeScreen);
