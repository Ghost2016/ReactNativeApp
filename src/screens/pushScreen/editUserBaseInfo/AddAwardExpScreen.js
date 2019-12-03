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
import SelectDate from "../../../sd_selectDate/SelectDate";
import { prefiexDate } from "../../../utils/prefixDate";
import ConnectWithActions from "../../../connectWithActions";
import { Toast } from "antd-mobile";
import SelectorDate from "../../../sd_selectDate/SelectDate";
import { CSS } from "../../../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

// 添加获奖经历
class AddAwardExpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadIds: []
    }
    this.isPosting = false;
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentDidMount() {
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "save_addAwardExpBtn"
    );
  }

  async onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_addAwardExpBtn") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        if(this.isPosting) {
          return;
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
          this.props.actions.addAwardExpItemAction(
            {
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
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <View style={{height: CSS.pixel(20), backgroundColor: '#f3f3f3'}}></View>
          <LabelInput
            ref="_awardInput"
            placeholder="奖项名称"
            placeholderRight="请输入奖项名称"
          />
          <SelectorDate max={new Date()} onOk={(y, m) => {
            this.refs['_startInput'].setState({value: y + '.' + m})
          }}>
            <LabelInput
              ref="_startInput"
              placeholder="获奖时间"
              isSelector={true}
              placeholderRight="请选择时间"
              direction=">"
              editable={false}
              disablePress={true}
            />
          </SelectorDate>
          <LabelInput
            footterStyle={{ borderBottomColor: "#fff" }}
            placeholder="上传凭证"
            editable={false}
            footter={<SDTakePhoto editable={true} max={2}/>}
          />
        </ScrollView>
        <View style={{height: CSS.pixel(104), alignItems: 'center'}}>
          <Text style={{color: '#FE8900', fontSize: CSS.textSize(24)}}>提交信息后我们将予以审核，请确保你的信息凭证真实有效</Text>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(AddAwardExpScreen);
