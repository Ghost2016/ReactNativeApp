import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import React from "react";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import { Toast, DatePicker, List } from "antd-mobile";
import store from "@boot/store";
import LabelInput from "../../../common/SDLabelInput";
import defaultStyle from "@styles";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDLoading from "@sd_components/SDLoading";
import ActionSheet from "react-native-actionsheet";
import { getDateObj } from "@utils/funcs";
//import { Touchable } from "@sd_components"
import { copyToObj } from "@utils/funcs";
import { prepareUserInfo } from "@boot/actions";

import DatePickerStyle from "antd-mobile/es/picker/style/index.native";
//定制样式
//console.log("DatePickerStyle[][]", DatePickerStyle);
const newDatePickerStyle = {};
for (const key in DatePickerStyle) {
  if (Object.prototype.hasOwnProperty.call(DatePickerStyle, key)) {
    newDatePickerStyle[key] = { ...StyleSheet.flatten(DatePickerStyle[key]) };
  }
}
newDatePickerStyle.actionText = {
  color: sdStyles.SDFontColorMinor,
  fontSize: CSS.pixel(28),
  textAlign: "center"
};
newDatePickerStyle.title = {
  color: sdStyles.SDFontColorMinor,
  fontSize: CSS.pixel(28),
  textAlign: "center"
};
console.log("newDatePickerStyle====", newDatePickerStyle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

const degreeList = ["本科", "硕士", "博士", "大专", "取消"];
const defaultList = ["是", "否", "取消"];

class CustomTimeChildren extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableOpacity onPress={this.props.onClick}>
        <View
          style={{
            height: 36,
            paddingLeft: 0,
            flexDirection: "row",
            alignItems: "center"
            //backgroundColor:'#f00'
          }}
        >
          <Text style={{ flex: 1 }}>{this.props.children}</Text>
          <Text
            style={{
              textAlign: "right",
              color: "#888",
              marginRight: 0
              //backgroundColor:'#f0f'
            }}
          >
            {this.props.extra}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

// 我的-添加身份
class AddIdentifyScreen extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  state = {
    loading: this.props.eduInfo ? true : false,
    schoolName: "",
    majorName: "",
    degree: "",
    default: "否",
    startTime: "",
    endTime: "",
    degreeBtns: degreeList,
    degreeBtnsCancelIndex: degreeList.length - 1,
    degreeBtnsFocusIndex: 0,
    degreeBtnsdefaultIndex: 0,
    degreeBtnsTitle: "请选择学历",

    defaultBtns: defaultList,
    defaultBtnsCancelIndex: defaultList.length - 1,
    defaultBtnsFocusIndex: 0,
    defaultBtnsdefaultIndex: 0,
    defaultBtnsTitle: "是否是默认身份"
  };

  componentDidMount() {
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
    if (this.props.eduInfo) {
      const [startTime, endTime] = this.props.eduInfo.time.split("~");
      this.setState({
        schoolName: this.props.eduInfo.schoolName || "",
        majorName: this.props.eduInfo.major || "",
        degree: this.props.eduInfo.level || "",
        default: this.props.eduInfo.isDefault ? "是" : "否",
        startTime: startTime || "",
        endTime: endTime || "",
        loading: false,
        degreeBtnsFocusIndex: degreeList.findIndex((n, i) => {
          return n == this.props.eduInfo.level;
        })
      });
    }
  }

  onNavigatorEvent(event) {
    let postData = {};
    const prepareToupdate = store.getState().prepareToupdate;
    if (event.type == "NavBarButtonPress") {
      if (event.id == "identify_edit_save") {
        //console.log("this.props.prepareToupdate", store.getState().prepareToupdate)
        //return
        //统一保存
        copyToObj(postData, prepareToupdate, "is_default", "boolean");
        copyToObj(postData, prepareToupdate, "start_date", "string");
        copyToObj(postData, prepareToupdate, "end_date", "string");
        copyToObj(postData, prepareToupdate, "school_title", "string");
        copyToObj(postData, prepareToupdate, "major_name", "string");
        copyToObj(postData, prepareToupdate, "degree_name", "string");
        postData["id"] = this.props.eduInfo.id;

        this.props.actions.updateUserEduInfoAction(postData, res => {
          if (res.status == "ok") {
            //store.dispatch(setUserState(postData));
            store.dispatch(
              prepareUserInfo({
                is_default: null,
                start_date: "",
                end_date: "",
                school_title: "",
                major_name: "",
                degree_name: ""
              })
            );
            //store.dispatch(setAppToken(res.results));
            this.context.navigator.pop();
          } else {
            Toast.fail("修改身份信息失败");
          }
        });
      } else if (event.id == "identify_add_save") {
        //console.log("this.props.prepareToupdate", store.getState().prepareToupdate)
        //return
        //统一保存
        copyToObj(postData, prepareToupdate, "is_default", "boolean");
        copyToObj(postData, prepareToupdate, "start_date", "string");
        copyToObj(postData, prepareToupdate, "end_date", "string");
        copyToObj(postData, prepareToupdate, "school_title", "string");
        copyToObj(postData, prepareToupdate, "major_name", "string");
        copyToObj(postData, prepareToupdate, "degree_name", "string");
        if (!postData.hasOwnProperty("is_default")) {
          postData["is_default"] = false;
        }

        if (!postData.school_title) {
          Toast.fail("请输入学校名称");
          return false;
        }
        if (!postData.major_name) {
          Toast.fail("请输入专业名称");
          return false;
        }
        if (!postData.degree_name) {
          Toast.fail("请输入学历名称");
          return false;
        }

        this.props.actions.addUserEduInfoAction(postData, res => {
          if (res.status == "ok") {
            console.log("addUserEduInfoAction", res);
            //store.dispatch(setUserState(postData));
            store.dispatch(
              prepareUserInfo({
                is_default: null,
                start_date: "",
                end_date: "",
                school_title: "",
                major_name: "",
                degree_name: ""
              })
            );
            //store.dispatch(setAppToken(res.results));
            this.context.navigator.pop();
          } else {
            Toast.fail("添加身份信息失败");
          }
        });
      }
    }
  }

  defaultAction = index => {
    //console.log("default==", index, this.state.defaultBtns[index]);
    if (
      this.state.defaultBtns[index] != "取消" &&
      this.state.defaultBtns[index] != this.state.default
    ) {
      //Toast.info(this.state.defaultBtns[index]);
      this.setState({
        default: this.state.defaultBtns[index],
        defaultBtnsFocusIndex: defaultList.findIndex((n, i) => {
          return n == this.state.defaultBtns[index];
        })
      });
      this.props.actions.prepareUserInfoAction(
        {
          is_default: this.state.defaultBtns[index] == "是" ? true : false
        },
        res => {}
      );
    }
  };

  degreeAction = index => {
    //console.log("degree==", index, this.state.degreeBtns[index]);
    if (
      this.state.degreeBtns[index] != "取消" &&
      this.state.degreeBtns[index] != this.state.degree
    ) {
      //Toast.info(this.state.degreeBtns[index]);
      this.setState({
        degree: this.state.degreeBtns[index],
        degreeBtnsFocusIndex: degreeList.findIndex((n, i) => {
          return n == this.state.degreeBtns[index];
        })
      });
      this.props.actions.prepareUserInfoAction(
        {
          degree_name: this.state.degreeBtns[index]
        },
        res => {}
      );
    }
  };

  changeSchoolName(value) {
    this.setState({
      schoolName: value
    });
    this.props.actions.prepareUserInfoAction(
      {
        school_title: value
      },
      res => {}
    );
  }

  changeMajorName(value) {
    this.setState({
      majorName: value
    });
    this.props.actions.prepareUserInfoAction(
      {
        major_name: value
      },
      res => {}
    );
  }

  startTimeChange(dt) {
    const t = getDateObj(dt.toString(), true);
    this.setState({
      startTime: t
    });
    this.props.actions.prepareUserInfoAction(
      {
        start_date: t
      },
      res => {}
    );
  }

  endTimeChange(dt) {
    const t = getDateObj(dt.toString(), true);
    this.setState({
      endTime: t
    });
    this.props.actions.prepareUserInfoAction(
      {
        end_date: t
      },
      res => {}
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? <SDLoading /> : null}
        <LabelInput
          ref="_schoolInput"
          placeholder="学校名称"
          defaultValue={this.state.schoolName}
          placeholderRight="请输入学校名称"
          onChange={value => this.changeSchoolName(value)}
        />
        <LabelInput
          ref="_majorInput"
          placeholder="专业名称"
          defaultValue={this.state.majorName}
          placeholderRight="请输入专业名称"
          onChange={value => this.changeMajorName(value)}
        />
        <LabelInput
          ref="_degreeInput"
          placeholder="学历"
          defaultValue={this.state.degree}
          editable={false}
          direction=">"
          onPress={() => {
            this.actionSheet.show();
          }}
        />

        <LabelInput
          defaultValue={this.state.startTime}
          placeholder="入学时间"
          direction=">"
          editable={false}
          other={() => {
            return (
              <DatePicker
                styles={newDatePickerStyle}
                onOk={this.startTimeChange.bind(this)}
                value={
                  this.state.startTime
                    ? new Date(this.state.startTime)
                    : new Date()
                }
                title="请选择日期"
                mode="date"
              >
                <CustomTimeChildren />
              </DatePicker>
            );
          }}
          onPress={() => {
            //this.actionSheet.show();
          }}
        />
        <LabelInput
          defaultValue={this.state.endTime}
          placeholder="毕业时间"
          direction=">"
          editable={false}
          other={() => {
            return (
              <DatePicker
                styles={newDatePickerStyle}
                onOk={this.endTimeChange.bind(this)}
                value={
                  this.state.endTime ? new Date(this.state.endTime) : new Date()
                }
                title="请选择日期"
                mode="date"
              >
                <CustomTimeChildren />
              </DatePicker>
            );
          }}
        />

        <LabelInput
          placeholder="是否默认"
          defaultValue={this.state.default}
          editable={false}
          direction=">"
          onPress={() => {
            this.actionSheetDefault.show();
          }}
        />

        <View style={[defaultStyle.center, { padding: 10, height: 60 }]}>
          <Text style={{ color: "#fc860e", fontSize: 12, textAlign: "center" }}>
            温馨提示：信息提交后即不可修改，请保证你的信息真实有效
          </Text>
        </View>
        <ActionSheet
          ref={o => (this.actionSheet = o)}
          title={this.state.degreeBtnsTitle}
          options={this.state.degreeBtns}
          cancelButtonIndex={this.state.degreeBtnsCancelIndex}
          destructiveButtonIndex={this.state.degreeBtnsFocusIndex}
          onPress={this.degreeAction.bind(this)}
        />
        <ActionSheet
          ref={o => (this.actionSheetDefault = o)}
          title={this.state.defaultBtnsTitle}
          options={this.state.defaultBtns}
          cancelButtonIndex={this.state.defaultBtnsCancelIndex}
          destructiveButtonIndex={this.state.defaultBtnsFocusIndex}
          onPress={this.defaultAction.bind(this)}
        />
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //user: getUserBaseInfo(state)
}))(AddIdentifyScreen);
