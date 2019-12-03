import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import PropTypes from "prop-types";
import LabelInput from "../../../common/SDLabelInput";
import defaultStyle from "@styles";
import { educationModel } from "../../../types";
import ConnectWithActions from "../../../connectWithActions";
import { getUserId } from "../../../directSelectors";
import SelectDate from "../../../sd_selectDate/SelectDate";
import Seletor from "../../../sd_selector/Selector";
import { prefiexDate } from "../../../utils/prefixDate";
import { Toast } from "antd-mobile";
import Selector from "../../../sd_selector/Selector";
import SelectorDate from "../../../sd_selectDate/SelectDate";

// const sWidth = Dimensions.get("window").width;
// const sHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

type Props = {
  education: educationModel,
  userId: number
};

// 我的-编辑身份
class EditIdentifyScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
  }

  onNavigatorEvent(event) {
    // this is the onPress handler for the two buttons together
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_editIdentify") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        if (
          this.refs["_schoolInput"].state.value == "" ||
          this.refs["_majorInput"].state.value == "" ||
          this.refs["_degreeInput"].state.value == "" ||
          this.refs["_startInput"].state.value == "" ||
          this.refs["_endInput"].state.value == ""
        ) {
          Toast.fail("请先完善所有信息");
          return;
        } else {
          Toast.loading("保存中", 0);
          this.props.actions.updateEducationAction(
            {
              id: this.props.education.id,
              start_date:
                this.refs["_startInput"].state.value.replace(".", "-") + "-01",
              end_date:
                this.refs["_endInput"].state.value.replace(".", "-") + "-01",
              school_title: this.refs["_schoolInput"].state.value,
              major_name: this.refs["_majorInput"].state.value,
              degree_name: this.refs["_degreeInput"].state.value,
              is_default: this.props.education.is_default
            },
            () => {
              Toast.hide();
              Toast.info("修改成功");
              this.context.navigator.pop();
            }
          );
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <LabelInput
          placeholder="学校名称"
          placeholderRight="请输入学校名称"
          defaultValue={this.props.education.school.name}
          ref="_schoolInput"
        />
        <LabelInput
          placeholder="专业名称"
          placeholderRight="请输入专业名称"
          defaultValue={this.props.education.major.name}
          ref="_majorInput"
        />
        <Selector
          options={[
            {
              label: "博士",
              value: "博士"
            },
            {
              label: "研究生",
              value: "研究生"
            },
            {
              label: "本科",
              value: "本科"
            },
            {
              label: "专科",
              value: "专科"
            }
          ]}
          onOk={value => {
            this.refs["_degreeInput"].setState({ value: value[0] });
          }}
          onChange={value => {
            this.refs["_degreeInput"].setState({ value: value[0] });
          }}
        >
          <LabelInput
            ref="_degreeInput"
            placeholder="学历"
            defaultValue={this.props.education.degree.name}
            editable={false}
            direction=">"
            disablePress={true}
          />
        </Selector>
        <SelectorDate
          onOk={(y, m) => {
            this.refs["_startInput"].setState({ value: y + "." + m });
          }}
        >
          <LabelInput
            ref="_startInput"
            placeholder="入学时间"
            defaultValue={this.props.education.start_date
              .slice(0, 7)
              .replace(/-/, ".")}
            direction=">"
            editable={false}
            disablePress={true}
          />
        </SelectorDate>
        <SelectorDate
          onOk={(y, m) => {
            this.refs["_startInput"].setState({ value: y + "." + m });
          }}
        >
          <LabelInput
            ref="_endInput"
            placeholder="毕业时间"
            defaultValue={this.props.education.end_date
              .slice(0, 7)
              .replace(/-/, ".")}
            direction=">"
            editable={false}
            disablePress={true}
          />
        </SelectorDate>
        <View style={[defaultStyle.center, { padding: 10, height: 60 }]}>
          <Text style={{ color: "#fc860e", fontSize: 12, textAlign: "center" }}>
            温馨提示：信息提交后即不可修改，请保证你的信息真实有效
          </Text>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userId: getUserId(state)
}))(EditIdentifyScreen);
