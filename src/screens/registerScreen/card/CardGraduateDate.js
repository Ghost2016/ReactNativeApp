import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import { DatePicker, List } from "antd-mobile";
// import ConnectWithActions from '../connectWithActions';

import store from "../../../boot/store";
// import * as reducers from "./reducers";
import { login } from "../../../boot/actions";
import SelectorDate from "../../../sd_selectDate/SelectDate";

const styles = StyleSheet.create({
  titleWrap: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40
  },
  titleBox: {
    width: "50%",
    height: 40,
    backgroundColor: "#626262",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center"
  },
  dateWrap: {
    paddingTop: 20,
    paddingBottom: 20
  }
});

// 入学年份
export default class CardGraduateDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: "",
      endTime: ""
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    this.context.refs["_graduateDate"] = this;
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: "#fff",
            borderWidth: 2,
            borderRadius: 4,
            borderColor: "#fff",
            padding: 20
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start"
            }}
          >
            <Text
              style={{
                color: "#333",
                fontSize: 18,
                marginBottom: 10,
                fontWeight: "bold"
              }}
            >
              入学时间
            </Text>
            <View
              style={{
                width: 30,
                borderBottomColor: "#333",
                borderBottomWidth: 3
              }}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <SelectorDate
              onOk={(y, m) => {
                this.setState({
                  startTime: y + "年" + m + "月"
                });
                this.context.refs["regis_Screen"].setState({
                  startTime: y + "年" + m + "月",
                  startTimeText:
                    y + "-" + m + "-01"
                });
                if (this.context.refs["regis_Screen"].state.endTime !== "") {
                  this.context.refs["regis_Screen"].setState({
                    isDisabled: false
                  });
                } else {
                  this.context.refs["regis_Screen"].setState({
                    isDisabled: true
                  });
                }
              }}
            >
              <View
                style={{
                  height: 40,
                  justifyContent: "center",
                  borderBottomColor: "#efefef",
                  borderBottomWidth: 1
                }}
              >
                <Text style={{ color: this.state.startTime !=="" ? "#333" : "#999", fontSize: 14 }}>
                  {this.state.startTime !== ""
                    ? this.state.startTime
                    : "选择入学时间"}
                </Text>
              </View>
            </SelectorDate>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              marginTop: 50
            }}
          >
            <Text
              style={{
                color: "#333",
                fontSize: 18,
                marginBottom: 10,
                fontWeight: "bold"
              }}
            >
              毕业时间
            </Text>
            <View
              style={{
                width: 30,
                borderBottomColor: "#333",
                borderBottomWidth: 3
              }}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <SelectorDate
              onOk={(y, m) => {
                this.setState({
                  endTime: y + "年" + m + "月"
                })
                this.context.refs["regis_Screen"].setState({
                  endTime: y + "年" + m + "月",
                  endTimeText: y + "-" + m + "-01"
                });
                if (this.context.refs["regis_Screen"].state.startTime !== "") {
                  this.context.refs["regis_Screen"].setState({
                    isDisabled: false
                  });
                } else {
                  this.context.refs["regis_Screen"].setState({
                    isDisabled: true
                  });
                }
              }}
            >
              <View
                style={{
                  height: 40,
                  justifyContent: "center",
                  borderBottomColor: "#efefef",
                  borderBottomWidth: 1
                }}
              >
                <Text style={{color: this.state.endTime !=="" ? "#333" : "#999", fontSize: 14 }}>
                  {this.state.endTime !== ""
                    ? this.state.endTime
                    : "选择毕业时间"}
                </Text>
              </View>
            </SelectorDate>
          </View>

          <View
            style={{
              position: "absolute",
              bottom: 10,
              left: 0,
              right: 0,
              alignItems: "center",
              paddingHorizontal: 20
            }}
          >
            <Text
              style={{ color: "#f98a24", fontSize: 12, textAlign: "center" }}
            >
              温馨提示：信息提交后即不可修改，请保证你的信息真实有效
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
