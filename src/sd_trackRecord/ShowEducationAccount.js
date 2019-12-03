/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import { educationModel, UserAccoutnModel } from "../types";
import connectWithActions from "../connectWithActions";
import { getUserId } from "../directSelectors";
import { CSS } from "../common/SDCSS";
import Reactotron from "reactotron-react-native";
import SDTouchOpacity from "../common/SDTouchOpacity";
import { navScreen } from "../styles";
import ImportSchoolCourse from "./ImportSchoolCourse";
import AddSchoolAccount from "../screens/pushScreen/addChisAccount/AddSchoolAccount";

const styles = StyleSheet.create({});

type Props = {
  educationList: educationModel[],
  userAccount: UserAccoutnModel[]
};

// 我的履历 - 提示可以导入学校成绩的弹窗
class ShowEducationAccount extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  componentWillMount() {
    // 获取自己的学校账号
    this.props.actions.getSchoolAccountAction().then(accountRes => {
      this.props.actions
        .getEducationAction({
          id: this.props.userId
        })
        .then(res => {
          // Reactotron.log(res);
        });
    });
  }
  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
        <View
          style={{
            backgroundColor: "#fff",
            height: CSS.pixel(90),
            justifyContent: "center",
            alignItems: "center",
            marginBottom: CSS.pixel(20)
          }}
        >
          <Text style={{ fontSize: CSS.textSize(28), color: "#999" }}>
            绑定教务系统账号可导入该学校课程成绩
          </Text>
        </View>

        <View>
          {this.props.educationList.map(e => {
            // 判断是否此教育经历已经绑定过教务系统
            const isChecked = this.props.userAccount.some(
              a => a.type == "education" && a.education_id == e.id
            );
            return (
              <SDTouchOpacity
                key={e.id + ""}
                style={{
                  justifyContent: "space-between",
                  paddingHorizontal: CSS.pixel(30),
                  backgroundColor: "#fff",
                  flexDirection: "row",
                  alignItems: "center",
                  height: CSS.pixel(110),
                  marginBottom: CSS.pixel(20)
                }}
                // onPress={!e.isCheck ? () => {
                onPress={
                  !isChecked
                    ? () => {
                        this.context.navigator.push(
                          navScreen("PushScreen", "添加教务系统账号", {
                            passProps: {
                              screen: () => <AddSchoolAccount education={e} />,
                              fullScreen: true,
                              noScrollView: true,
                              header: {
                                title: "添加教务系统账号"
                              }
                            }
                          })
                        );
                      }
                    : null
                }
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <Text style={{ color: "#333", fontSize: CSS.textSize(30) }}>
                    {e.school.name + " " + e.degree.name + " · " + e.major.name}
                  </Text>
                </View>
                {/* 判断是否有绑定账号 */}
                {/* {!e.isCheck ? ( */}
                {!isChecked ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        color: "#999",
                        fontSize: CSS.pixel(30),
                        marginRight: CSS.pixel(20)
                      }}
                    >
                      未绑定
                    </Text>
                    <Image
                      source={require("@img/my/mine_btn_list_black.png")}
                    />
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: "#333", fontSize: CSS.pixel(30) }}>
                      已绑定
                    </Text>
                  </View>
                )}
              </SDTouchOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}
export default connectWithActions((state, props) => ({
  educationList: state.userEducationList,
  userAccount: state.schoolAccount,
  userId: getUserId(state)
}))(ShowEducationAccount);
