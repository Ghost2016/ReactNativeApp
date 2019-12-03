import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions
} from "react-native";
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
import { SDTakePhoto } from "@common";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const degreeList = ["身份证", "学号", "取消"];

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

/*
{
  "type": "string",
  "code": "string",
  "real_name": "string",
  "school_title": "string",
  "major_name": "string",
  "attachment_ids": [
    "string"
  ]
}
身份证 identity
学号  school_code
*/

// 我的- 实名认证
class IdConfirmScreen extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  state = {
    loading: !this.props.addNew ? true : false,
    schoolName: "",
    majorName: "",
    credential: "身份证",
    credentialNumber: "",
    name: "",
    attachment: [],
    degreeBtns: degreeList,
    degreeBtnsCancelIndex: degreeList.length - 1,
    degreeBtnsFocusIndex: 0,
    degreeBtnsdefaultIndex: 0,
    degreeBtnsTitle: "请选择证件类型"
  };

  componentDidMount() {
    //console.log("addNew", this.props.addNew);
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
    if (!this.props.addNew) {
      this.props.actions.getCredentialInfoAction(
        {
          id: this.props.user.id
        },
        res => {
          if (res.status == "ok") {
            console.log("getCredentialInfoAction", res);
            /*this.setState({
              loading: false,
              listData: res.results.map((n, i) => {
                return {
                  id: n.id,
                  isDefault: n.is_default,
                  time: `${this.formatDate(n.start_date)}~${this.formatDate(
                    n.end_date
                  )}`,
                  schoolName: n.school.name,
                  degree: n.degree.title,
                  major: n.major.title
                };
              })
            });*/
          }
        }
      );
      const eduInfo = {};
      this.setState({
        schoolName: eduInfo.schoolName || "",
        majorName: eduInfo.major || "",
        credential: eduInfo.credential || "",
        credentialNumber: eduInfo.credentialNumber || "",
        name: eduInfo.name || "",
        attachment: eduInfo.attachment || [],
        loading: false,
        degreeBtnsFocusIndex: degreeList.findIndex((n, i) => {
          return n == eduInfo.level;
        })
      });
    }
  }

  onNavigatorEvent(event) {
    let postData = {};
    const prepareToupdate = store.getState().prepareToupdate;
    if (event.type == "NavBarButtonPress") {
      if (event.id == "id_confirm_edit") {
        //console.log("this.props.prepareToupdate", store.getState().prepareToupdate)
        //return
        //统一保存
        copyToObj(postData, prepareToupdate, "credential", "string");
        copyToObj(postData, prepareToupdate, "credentialNumber", "string");
        copyToObj(postData, prepareToupdate, "name", "string");
        copyToObj(postData, prepareToupdate, "school_title", "string");
        copyToObj(postData, prepareToupdate, "major_name", "string");
        copyToObj(postData, prepareToupdate, "attachment", "string");
        //postData['id'] = this.props.eduInfo.id;

        this.props.actions.editCredentialInfAction(postData, res => {
          if (res.status == "ok") {
            console.log("editCredentialInfAction", res);
            //store.dispatch(setUserState(postData));
            store.dispatch(
              prepareUserInfo({
                credential: null,
                credentialNumber: "",
                name: "",
                school_title: "",
                major_name: "",
                attachment: []
              })
            );
            //store.dispatch(setAppToken(res.results));
            this.context.navigator.pop();
          } else {
            Toast.fail("修改实名认证信息失败");
          }
        });
      } else if (event.id == "id_confirm_save") {
        //console.log("this.props.prepareToupdate", store.getState().prepareToupdate)
        //return

        //统一保存
        copyToObj(postData, prepareToupdate, "credential", "string", "type");
        copyToObj(
          postData,
          prepareToupdate,
          "credentialNumber",
          "string",
          "code"
        );
        copyToObj(postData, prepareToupdate, "name", "string", "real_name");
        copyToObj(postData, prepareToupdate, "school_title", "string");
        copyToObj(postData, prepareToupdate, "major_name", "string");
        copyToObj(
          postData,
          prepareToupdate,
          "attachment",
          "string",
          "attachment_ids"
        );

        if (!postData.school_title) {
          Toast.fail("请输入学校名称");
          return false;
        }
        if (!postData.major_name) {
          Toast.fail("请输入专业名称");
          return false;
        }
        if (!postData.type) {
          Toast.fail("请输入证件类型");
          return false;
        }

        if (!postData.code) {
          Toast.fail("请输入证件类型号码");
          return false;
        }

        if (!postData.real_name) {
          Toast.fail("请输入姓名");
          return false;
        }

        this.props.actions.addCredentialInfoAction(postData, res => {
          if (res.status == "ok") {
            console.log("addCredentialInfoAction", res);
            //store.dispatch(setUserState(postData));
            store.dispatch(
              prepareUserInfo({
                credential: null,
                credentialNumber: "",
                name: "",
                school_title: "",
                major_name: "",
                attachment: []
              })
            );
            //store.dispatch(setAppToken(res.results));
            this.context.navigator.pop();
          } else {
            Toast.fail("添加实名认证信息失败");
          }
        });
      }
    }
  }

  degreeAction = index => {
    //console.log("degree==", index, this.state.degreeBtns[index]);
    if (
      this.state.degreeBtns[index] != "取消" &&
      this.state.degreeBtns[index] != this.state.degree
    ) {
      //Toast.info(this.state.degreeBtns[index]);
      this.setState({
        credential: this.state.degreeBtns[index],
        degreeBtnsFocusIndex: degreeList.findIndex((n, i) => {
          return n == this.state.degreeBtns[index];
        })
      });
      this.props.actions.prepareUserInfoAction(
        {
          credential: this.state.degreeBtns[index]
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

  changeCredentialNumber(value) {
    this.setState({
      credentialNumber: value
    });
    this.props.actions.prepareUserInfoAction(
      {
        credentialNumber: value
      },
      res => {}
    );
  }

  changeName(value) {
    this.setState({
      name: value
    });
    this.props.actions.prepareUserInfoAction(
      {
        name: value
      },
      res => {}
    );
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          {this.state.loading ? <SDLoading /> : null}
          <LabelInput
            placeholder="请填写自己的真实姓名和证件信息"
            direction=""
            placeholderRight=""
            titleStyle={{
              width: width * 0.8
            }}
            titleFontStyle={{
              color: sdStyles.SDBGColorOrange
            }}
            other={() => {}}
            onChange={() => {}}
          />
          <LabelInput
            placeholder="学校"
            defaultValue={this.state.schoolName}
            direction=""
            placeholderRight="请输入学校名称"
            onChange={this.changeSchoolName.bind(this)}
          />
          <LabelInput
            placeholder="专业"
            defaultValue={this.state.majorName}
            direction=""
            placeholderRight="请输入专业名称"
            onChange={this.changeMajorName.bind(this)}
          />
          <LabelInput
            placeholder="证件类型"
            defaultValue={this.state.credential}
            editable={false}
            direction=">"
            onPress={() => {
              this.actionSheet.show();
            }}
          />
          <LabelInput
            placeholder="证件号"
            defaultValue={this.state.credentialNumber}
            direction=""
            placeholderRight="请输入证件号"
            onChange={this.changeCredentialNumber.bind(this)}
          />
          <LabelInput
            placeholder="姓名"
            defaultValue={this.state.name}
            direction=""
            placeholderRight="请输入姓名"
            onChange={this.changeName.bind(this)}
          />

          <LabelInput
            footterStyle={{ borderBottomColor: "#fff" }}
            placeholder="上传凭证"
            footter={<SDTakePhoto size={1} />}
          />

          <ActionSheet
            ref={o => (this.actionSheet = o)}
            title={this.state.degreeBtnsTitle}
            options={this.state.degreeBtns}
            cancelButtonIndex={this.state.degreeBtnsCancelIndex}
            destructiveButtonIndex={this.state.degreeBtnsFocusIndex}
            onPress={this.degreeAction.bind(this)}
          />
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //user: getUserBaseInfo(state)
}))(IdConfirmScreen);
