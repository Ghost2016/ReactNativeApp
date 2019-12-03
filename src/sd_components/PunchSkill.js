import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  Dimensions,
  Keyboard
} from "react-native";
import PropTypes from "prop-types";
import LabelInput from "../common/SDLabelInput";
import { SDTakePhoto } from "@common";
import { isIphoneX } from "../utils/iphonex";
import connectWithActions from "../connectWithActions";
import { Toast } from "antd-mobile";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDButton from "@sd_components/SDButton";
// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height:
      Platform.OS === "ios"
        ? isIphoneX()
          ? Dimensions.get("window").height - 164
          : Dimensions.get("window").height - 130
        : Dimensions.get("window").height - 150,
    borderWidth: 0,
    borderColor: '#f00',
    marginTop: CSS.pixel(30, true),
  },
});

// 职业技能 - 完成打卡
class PunchSkill extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      isDisabled: true,
      isCanSubmit: false,
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  onPressFinish() {
    const { data, professionId, index } = this.props
    Keyboard.dismiss();
    //return
    if(typeof this.props.onPress === 'function') this.props.onPress(data, professionId, index, this.state.content)
  }

  render() {
    const { data, professionId } = this.props;
    const title = data.course? data.course.name : data.task.name;
    console.log("data punch skill", data, title)
    return (
      <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <LabelInput
          placeholder={title || "打卡标题"}
          placeholderWidth={'98%'}
          titleFontStyle={{
            marginBottom: Platform.OS=="android"? CSS.pixel(90, true) :CSS.pixel(90, true),
            borderWidth: 0,
            borderColor: '#f00',
          }}
          style={{
            borderWidth: 0,
            borderColor: '#f00',
            paddingTop: CSS.pixel(10, true),
          }}
          editable={false}
          footterStyle={{
            borderBottomWidth: 0,
            borderWidth: 0,
            borderColor: '#f00',
          }}
          footerTitleStyle={{
            fontSize: CSS.textSize(30),
            color: sdStyles.SDFontColorMain,
          }}
          footter={() => (
            <TextInput
              onChangeText={text => {
                //this.state.content = text;
                this.setState({
                  isDisabled: text.trim() ? false : true,
                  isCanSubmit: text.trim() ? true : false,
                  content: text.trim(),
                });
              }}
              style={{
                marginBottom: CSS.pixel(10, true),
                marginTop: Platform.OS=="android"? CSS.pixel(30, true) :CSS.pixel(30, true),
                height: CSS.pixel(500, true),
                borderWidth: 0,
                borderColor: '#f00',
                position: 'relative',
                top: 0,
                left: -8,
                fontSize: CSS.textSize(30),
                textAlignVertical: 'top',
               }}
              placeholder="有什么收获，写点感受吧"
              placeholderTextColor={sdStyles.SDFontColorSubtitle}
              multiline={true}
              underlineColorAndroid="transparent"
              returnKeyLabel="关闭"
              returnKeyType="done"
              onSubmitEditing={()=>{
                Keyboard.dismiss();
              }}
            />
          )}
        />

        <SDButton
            style={{
              flexDirection: "column",
              alignSelf: "center",
              marginVertical: 20,
              backgroundColor: this.state.isCanSubmit ? sdStyles.SDMainColor : sdStyles.SDBGColorGreyBtn,
              borderRadius: 20,
              width: CSS.pixel(550),
              height: CSS.pixel(90, true),
              zIndex: 6,
              position: "relative",
              top: 0, //CSS.pixel(200, true),
              left: 0,
              borderWidth: 0,
              borderColor: '#f00',
            }}
            btnStyle={{
              fontSize: CSS.pixel(30),
              color: sdStyles.SDFontColorMain,
              position: "relative",
              top: 0 //-4
            }}
            onPress={this.onPressFinish.bind(this)}
            title="完成打卡"
          />

      </View></ScrollView>
    );
  }
}

export default connectWithActions((state, props) => ({}))(PunchSkill);
