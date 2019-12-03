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
// import AddCertificateForm from "../../../sd_showCertificate/AddCertificateForm";
import ConnectWithActions from "../../../connectWithActions";
import SelectDate from "../../../sd_selectDate/SelectDate";
import Seletor from "../../../sd_selector/Selector";
import { prefiexDate } from "../../../utils/prefixDate";
import LabelInput from "../../../common/SDLabelInput";
import { Toast, Modal } from "antd-mobile";
import { SDTakePhoto } from "@common";
import { certificateModel } from "../../../types";
import { navLightBox } from "@styles";
import SelectorDate from "../../../sd_selectDate/SelectDate";
import SearchCertificateResults from "../addCertificate/SearchCertificateResults";
import { CSS } from "../../../common/SDCSS";
import SDTouchOpacity from "../../../common/SDTouchOpacity";

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

type Props = {
  certificate: certificateModel
};

// 删除证书界面
class EditCertificateScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };
  componentDidMount() {
    if (this.props.certificate.audit_status != 'audit_pass') {
      this.context.navigatorEvent.setOnNavigatorEvent(
        this.onNavigatorEvent.bind(this),
        "edit_CertificateBtn"
      );
    }
  }

  async onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "edit_CertificateBtn") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");

        if (
          this.refs["_certificateInput"].state.value == "" ||
          this.refs["_startInput"].state.value == ""
          // this.refs["_scoreInput"].state.value == ""
        ) {
          Toast.fail("信息填写不能为空");
          return;
        } else {
          Toast.loading("保存中", 0);
          let uploadIds = [];
          if (this.context.refs["_takePhoto"]) {
            uploadIds = await this.context.refs["_takePhoto"].uploadPic();
          }
          if (uploadIds.length <= 0) {
            Toast.info("凭证不能为空", 0.2);
            return;
          }
          this.props.actions.updateUserCertificateAction(
            {
              id: this.props.certificate.id,
              certificate_id: this.props.certificate.certificate.id,
              attachment_ids: uploadIds,
              // name: this.refs["_certificateInput"].state.value,
              score: parseInt(this.refs["_scoreInput"].state.value),
              acquire_date:
                this.refs["_startInput"].state.value.replace(".", "-") + "-01"
            },
            res => {
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
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={{height: CSS.pixel(20), backgroundColor: '#f3f3f3'}}></View>
          <LabelInput
            placeholder="证书名称"
            direction=">"
            defaultValue={this.props.certificate.certificate.name}
            placeholderRight="请输入证书名称"
            ref="_certificateInput"
            editable={false}
          />
          <SelectorDate
            onOk={(y, m) => {
              this.refs["_startInput"].setState({ value: y + "." + m });
            }}
            max={new Date()}
            selectable={this.props.certificate.audit_status == 'audit_pass' ? false: true}
          >
            <LabelInput
              placeholder="通过时间"
              direction=">"
              editable={false}
              placeholderRight="请选择通过时间"
              isSelector={true}
              defaultValue={this.props.certificate.acquire_date
                .slice(0, 7)
                .replace(/-/, ".")}
              disablePress={true}
              ref="_startInput"
            />
          </SelectorDate>
          <LabelInput
            footterStyle={{ borderBottomColor: "#fff" }}
            placeholder="上传凭证"
            editable={false}
            footter={<SDTakePhoto editable={this.props.certificate.audit_status == 'audit_pass' ? false: true} max={2} defaultImages={this.props.certificate.attachments || []}/>}
          />
        </ScrollView>
        <View style={{
          alignItems: 'center',
          height: CSS.pixel(200),
          backgroundColor: '#fff'
        }}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#fc8824", fontSize: 12 }}>
              请确保你的信息凭证真实有效
            </Text>
          </View>

          <View
            style={{
              marginTop: CSS.pixel(20),
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
                      this.props.actions.delUserCertificateAction(
                        {
                          id: this.props.certificate.id
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
              删除该证书
              </Text>
            </SDTouchOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(
  EditCertificateScreen
);
