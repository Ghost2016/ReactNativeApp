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
import { Toast } from "antd-mobile";
import LabelInput from "../../../common/SDLabelInput";
import SelectDate from "../../../sd_selectDate/SelectDate";
import { prefiexDate } from "../../../utils/prefixDate";
import { educationModel } from "../../../types";
import ConnectWithActions from "../../../connectWithActions";
import SelectorDate from "../../../sd_selectDate/SelectDate";
import { isValidRangeDate } from "../../../utils/funcs";
import { CSS } from "../../../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

type Props = {
  educationList: educationModel[]
};

// 添加在校担任职务
class AddInSchoolJobsScreen extends React.PureComponent<Props> {
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
      "save_addSchoolJobsBtn"
    );
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_addSchoolJobsBtn") {
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
          Toast.fail("信息填写不能为空");
          this.isPosting = false;
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
          this.props.actions.addJobItemAction(
            {
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
              Toast.info("添加成功");
              this.context.navigator.pop();
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
            ref="_jobInput"
            placeholder="职务名称"
            // direction=">"
            placeholderRight="请输入职务名称"
          />

          <SelectorDate
            onOk={(y, m) => {
              this.refs["_startInput"].setState({ value: y + "." + m });
            }}
          >
            <LabelInput
              ref="_startInput"
              editable={false}
              placeholder="开始时间"
              direction=">"
              isSelector={true}
              placeholderRight="请选择开始时间"
              disablePress={true}
            />
          </SelectorDate>
          <SelectorDate
            onOk={(y, m) => {
              this.refs["_endInput"].setState({ value: y + "." + m });
            }}
          >
            <LabelInput
              ref="_endInput"
              editable={false}
              placeholder="结束时间"
              isSelector={true}
              placeholderRight="请选择结束时间"
              direction=">"
              disablePress={true}
            />
          </SelectorDate>
          <LabelInput
            footterStyle={{ borderBottomWidth: 0, borderColor: "#fff" }}
            placeholder="工作内容描述"
            editable={false}
            footter={() => {
              return (
                <TextInput
                  style={{ top: -10, fontSize: 12 }}
                  multiline={true}
                  placeholder="输入工作内容"
                  onChangeText={text => {
                    this.state.desc = text;
                  }}
                />
              );
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  educationList: state.userEducationList
}))(AddInSchoolJobsScreen);
