import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import PropTypes from "prop-types";
import LabelInput from "../../../common/SDLabelInput";
import { SDTakePhoto } from "@common";
import { awardExpModel } from "../../../types";
import SelectDate from "../../../sd_selectDate/SelectDate";
import { prefiexDate } from "../../../utils/prefixDate";
import { Toast, Modal } from "antd-mobile";
import ConnectWithActions from "../../../connectWithActions";
import { navLightBox } from "@styles";
import SelectorDate from "../../../sd_selectDate/SelectDate";
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
  award: awardExpModel
};
// 编辑获奖经历
class EditAwardExpScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.isPosting = false;
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentDidMount() {
    if (this.props.award.audit_status != "audit_pass") {
      this.context.navigatorEvent.setOnNavigatorEvent(
        this.onNavigatorEvent.bind(this),
        "edit_awardExpBtn"
      );
    }
  }

  async onNavigatorEvent(event) {
    // this is the onPress handler for the two buttons together
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "edit_awardExpBtn") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        if(this.isPosting) {
          this.isPosting = false;
        }
        this.isPosting = true;
        if (
          this.refs["_awardInput"].state.value == "" ||
          this.refs["_startInput"].state.value == ""
        ) {
          Toast.fail("信息不能为空");
          this.isPosting = false;
          return;
        } else {
          Toast.loading("保存中", 0);
          let uploadIds = [];
          if (this.context.refs["_takePhoto"]) {
            uploadIds = await this.context.refs["_takePhoto"].uploadPic();
          }
          if (uploadIds.length <= 0) {
            Toast.info("凭证不能为空", 0.2);
            this.isPosting = false;
            return;
          }
          this.props.actions.updateAwardExpItemAction(
            {
              id: this.props.award.id,
              name: this.refs["_awardInput"].state.value,
              acquire_date:
                this.refs["_startInput"].state.value.replace(".", "-") + "-01",
              attachment_ids: uploadIds
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
            editable={this.props.award.audit_status == "audit_pass" ? false : true}
            ref="_awardInput"
            placeholder="奖项名称"
            placeholderRight="请输入奖项名称"
            defaultValue={this.props.award.name}
          />
          <SelectorDate
            max={new Date()}
            selectable={this.props.award.audit_status == "audit_pass" ? false : true}
            onOk={(y, m) => {
              this.refs["_startInput"].setState({ value: y + "." + m });
            }}
          >
            <LabelInput
              placeholder="获奖时间"
              direction=">"
              //   defaultValue="2018年6月"
              editable={false}
              defaultValue={this.props.award.acquire_date
                .slice(0, 7)
                .replace(/-/, ".")}
              ref="_startInput"
              placeholderRight="请选择获奖时间"
              isSelector={true}
              disablePress={true}
            />
          </SelectorDate>
          <LabelInput
            footterStyle={{ borderBottomColor: "#fff" }}
            placeholder="上传凭证"
            editable={false}
            footter={<SDTakePhoto editable={this.props.award.audit_status == "audit_pass" ? false : true} max={2} defaultImages={this.props.award.images}/>}
          />

          <View
            style={{
              marginTop: CSS.pixel(500),
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
                      this.props.actions.deleteAwardExpItemAction(
                        {
                          id: this.props.award.id
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

export default ConnectWithActions((state, props) => ({}))(EditAwardExpScreen);
