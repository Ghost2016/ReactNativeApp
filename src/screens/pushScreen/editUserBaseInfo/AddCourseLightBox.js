// 数据查询页面
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  TextInput
} from "react-native";
// import ConfirmButtonGroup from "./ConfirmButtonGroup";
import defaultStyle from "@styles";
import { Navigation } from "react-native-navigation";
// import { CSS } from "../../common/SDCSS";
import ConfirmButtonGroup from "../../lightBoxScreen/ConfirmButtonGroup";
import { CSS } from "../../../common/SDCSS";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor } from "../../../styles";

type Props = {
  title: string,
  onCancel: Function,
  onOk: Function
};

export class AddCourseLightBox extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      selectIndex: 4,  // 1-公共基础课 2-必修课 3-选修课 4-专业课
      name: "",
      score: "",
    };
  }
  render() {
    return (
      <View
        style={{
          width: Dimensions.get("window").width - 2 * 40,
          height: Dimensions.get("window").height - 2 * 200,
          backgroundColor: "#ffffff",
          borderRadius: 5,
          paddingTop: 10,
          overflow: "hidden",
          position: "absolute",
          left: 40,
          top: 200
        }}
      >
        <View style={{ justifyContent: "space-between", flex: 1 }}>
          <View style={{ flex: 1, paddingHorizontal: CSS.pixel(60) }}>
            <View
              style={{
                borderBottomColor: "#f3f3f3",
                borderBottomWidth: 1,
                height: CSS.pixel(80),
                justifyContent: "center",
                marginTop: CSS.pixel(30)
              }}
            >
              <TextInput
                onChangeText={t => this.state.name = t}
                placeholder="课程名称"
                style={{ padding: 0, flex: 1 }}
                underlineColorAndroid="transparent"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                borderBottomColor: "#f3f3f3",
                borderBottomWidth: 1,
                height: CSS.pixel(80),
                alignItems: "center",
                marginTop: CSS.pixel(30)
              }}
            >
              <TextInput
                onChangeText={t => this.state.score = t}
                placeholder="考试成绩"
                style={{ padding: 0, flex: 1 }}
                underlineColorAndroid="transparent"
              />
              <View style={{ position: "absolute", right: 0, top: 10 }}>
                <Text style={{ color: "#999", fontSize: CSS.textSize(30) }}>
                  分
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                // backgroundColor: "red",
                marginTop: CSS.pixel(60),
                justifyContent: "space-between"
              }}
            >
              <SDTouchOpacity
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "row",
                  flex: 1
                }}
                onPress={() => {
                  this.setState({
                    selectIndex: 4
                  });
                }}
              >
                <View
                  style={{
                    width: CSS.pixel(28),
                    height: CSS.pixel(28),
                    borderRadius: CSS.pixel(14),
                    borderWidth: 1,
                    borderColor: SDMainColor,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff"
                  }}
                >
                  <View
                    style={{
                      width: CSS.pixel(10),
                      height: CSS.pixel(10),
                      borderRadius: CSS.pixel(6),
                      backgroundColor:
                        this.state.selectIndex == 4 ? SDMainColor : "#fff"
                    }}
                  />
                </View>
                <View
                  style={{ marginLeft: CSS.pixel(14), alignItems: "center" }}
                >
                  <Text style={{ color: "#333", fontSize: CSS.textSize(30) }}>
                    专业课
                  </Text>
                </View>
              </SDTouchOpacity>
              <SDTouchOpacity
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "row",
                  flex: 1
                }}
                onPress={() => {
                  this.setState({
                    selectIndex: 1
                  });
                }}
              >
                <View
                  style={{
                    width: CSS.pixel(28),
                    height: CSS.pixel(28),
                    borderRadius: CSS.pixel(14),
                    borderWidth: 1,
                    borderColor: SDMainColor,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff"
                  }}
                >
                  <View
                    style={{
                      width: CSS.pixel(10),
                      height: CSS.pixel(10),
                      borderRadius: CSS.pixel(6),
                      backgroundColor:
                        this.state.selectIndex == 1 ? SDMainColor : "#fff"
                    }}
                  />
                </View>
                <View
                  style={{ marginLeft: CSS.pixel(14), alignItems: "center" }}
                >
                  <Text style={{ color: "#333", fontSize: CSS.textSize(30) }}>
                    公共基础课
                  </Text>
                </View>
              </SDTouchOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                // backgroundColor: "red",
                marginTop: CSS.pixel(60),
                justifyContent: "space-between"
              }}
            >
              <SDTouchOpacity
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "row",
                  flex: 1
                }}
                onPress={() => {
                  this.setState({
                    selectIndex: 2
                  });
                }}
              >
                <View
                  style={{
                    width: CSS.pixel(28),
                    height: CSS.pixel(28),
                    borderRadius: CSS.pixel(14),
                    borderWidth: 1,
                    borderColor: SDMainColor,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff"
                  }}
                >
                  <View
                    style={{
                      width: CSS.pixel(10),
                      height: CSS.pixel(10),
                      borderRadius: CSS.pixel(6),
                      backgroundColor:
                        this.state.selectIndex == 2 ? SDMainColor : '#fff'
                    }}
                  />
                </View>
                <View
                  style={{ marginLeft: CSS.pixel(14), alignItems: "center" }}
                >
                  <Text style={{ color: "#333", fontSize: CSS.textSize(30) }}>
                    必修课
                  </Text>
                </View>
              </SDTouchOpacity>
              <SDTouchOpacity
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "row",
                  flex: 1
                }}
                onPress={() => {
                  this.setState({
                    selectIndex: 3
                  });
                }}
              >
                <View
                  style={{
                    width: CSS.pixel(28),
                    height: CSS.pixel(28),
                    borderRadius: CSS.pixel(14),
                    borderWidth: 1,
                    borderColor: SDMainColor,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff"
                  }}
                >
                  <View
                    style={{
                      width: CSS.pixel(10),
                      height: CSS.pixel(10),
                      borderRadius: CSS.pixel(6),
                      backgroundColor:
                        this.state.selectIndex == 3 ? SDMainColor : "#fff"
                    }}
                  />
                </View>
                <View
                  style={{ marginLeft: CSS.pixel(14), alignItems: "center" }}
                >
                  <Text style={{ color: "#333", fontSize: CSS.textSize(30) }}>
                    选修课
                  </Text>
                </View>
              </SDTouchOpacity>
            </View>
          </View>
          <ConfirmButtonGroup
            onCancel={() => {
              this.props.onCancel &&
                this.props.onCancel instanceof Function &&
                this.props.onCancel();
              Navigation.dismissLightBox();
            }}
            onOk={() => {
              this.props.onOk &&
                this.props.onOk instanceof Function &&
                this.props.onOk(this.state.name, this.state.score, this.state.selectIndex);
              Navigation.dismissLightBox();
            }}
          />
        </View>
      </View>
    );
  }
}
