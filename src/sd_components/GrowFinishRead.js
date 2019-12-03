import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import { DatePicker, Picker, List } from "antd-mobile";
import LabelInput from "../common/SDLabelInput";
import { SDTakePhoto } from "@common";
import { Navigation } from "react-native-navigation";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height:
      Platform.OS === "ios"
        ? Dimensions.get("window").height - 130
        : Dimensions.get("window").height - 150
  },
  saveBtnBox: {
    marginTop: 20,
    height: 46,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden"
  }
});

const CustomChildren = (props: any) => (
  <TouchableOpacity onPress={props.onClick}>
    <View
      style={{
        height: 36,
        paddingLeft: 15,
        flexDirection: "row",
        alignItems: "center"
      }}
    >
      <Text style={{ flex: 1 }}>{props.children}</Text>
      <Text style={{ textAlign: "right", color: "#888", marginRight: 15 }}>
        {props.extra}
      </Text>
    </View>
  </TouchableOpacity>
);

// 编辑自我评价表单
export default class GrowFinishRead extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  state = {
    date: "2小时"
  };

  onChangDate(value) {
    this,
      setState({
        date: value
      });
  }

  onPressFinish() {
    Navigation.showLightBox({
      screen: "example.GrowReadOkScreen",
      style: {
        backgroundBlur: "xlight", //'dark' / 'light' / 'xlight' / 'none'
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        tapBackgroundToDismiss: true
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <LabelInput
          placeholder="《产品经理手册》"
          editable={false}
          footter={() => (
            <View>
              {/*<DatePicker
                              value={this.state.date}
                              mode="date"
                              minDate={new Date(2018, 6, 1)}
                              maxDate={new Date(2018, 6, 30)}
                              onChange={this.onChangDate}
                              format="YYYY-MM-DD"
                            >
                              <List.item arrow="horizontal">2小时</List.item>
                            </DatePicker>*/}
              {/*<DatePicker
                                mode="date"
                                title="用时"
                                //   extra="Optional"
                                //   value={this.state.date}
                                //   onChange={date => this.setState({ date })}
                              >
                                <List.Item arrow="horizontal">两小时</List.Item>
                              </DatePicker>*/}
              <Picker
                title="用时"
                data={[
                  {
                    value: "2小时",
                    label: "2小时"
                  },
                  {
                    value: "3小时",
                    label: "3小时"
                  },
                  {
                    value: "4小时",
                    label: "4小时"
                  },
                  {
                    value: "5小时",
                    label: "5小时"
                  }
                ]}
                cols={2}
                value={this.state.pickerValue}
                onChange={(v: any) => this.setState({ pickerValue: v })}
                onOk={(v: any) => this.setState({ pickerValue: v })}
              >
                <CustomChildren>用时</CustomChildren>
              </Picker>
              {/*<TextInput
                              style={{ marginBottom: 10, height: 80 }}
                              placeholder="用时"
                              multiline={true}
                              underlineColorAndroid="transparent"
                            />*/}
              <TextInput
                style={{ marginBottom: 10, height: 80 }}
                placeholder="有什么收获，写点感受吧"
                multiline={true}
                underlineColorAndroid="transparent"
              />
            </View>
          )}
        />

        <View style={styles.saveBtnBox}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={0.8}
            onPress={this.onPressFinish.bind(this)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 26,
                // backgroundColor: "#fed200",
                backgroundColor: "#e1e1e1"
              }}
            >
              <Text style={{ color: "#fff" }}>完成打卡</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
