import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { Toast } from 'antd-mobile';
import { isIphoneX } from "../../../utils/iphonex";
import { headerHeight } from "../../../common/SDHeader";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { dismissLightBox, SDMainColor } from "../../../styles";
import { CSS } from "../../../common/SDCSS";
import connectWithActions from "../../../connectWithActions";


const selectedIcon = require("@img/grow/growing_btn_MoRen.png");
const selectNorIcon = require("@img/grow/growing_btn_FeiMoRen.png");

class SwitchIdLightBox extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  componentWillMount() {
    Promise.all([
      this.props.actions.getSchoolAccountAction(),
      this.props.actions.getEducationAction({
        id: this.props.user.id
      })
    ])
      .then(() => {})
      .catch(err => {});
  }
  onPressDefault(eduData) {
    // debugger;
    Toast.loading("切换身份中...")
    this.props.actions.updateUserEduInfoAction(
      {
        is_default: true,
        id: eduData.id,
        start_date: eduData.start_date,
        end_date: eduData.end_date
      },
      res => {
        if (res.status == "ok") {
          Promise.all([
            this.props.actions.getEducationAction({
              id: this.props.user.id
            }),
            this.props.actions.getUserInfoAction(),

            //刷新职业规划
            refreshJobPlanListAction(this),

            this.context.refs["homeCardGroup"].fetchData(),
            this.context.refs["_rankScreen"] &&
              this.context.refs["_rankScreen"].handleActionToUpdateAllData()
          ]).then(values => {
            Toast.loading("设置默认身份成功！正在设置数据...");
          }).catch(err => {});
        } else {
          Toast.fail("切换身份信息失败");
        }
      }
    );
  }
  formatDate(d) {
    return d
      .split("-")
      .filter((n, i) => {
        return i < 2;
      })
      .map((n, i) => {
        return parseInt(n, 10);
      })
      .join(".");
  }
  render() {
    return (
      <SDTouchOpacity
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        }}
        noDelay
        onPress={() => {
          dismissLightBox();
          this.props.onDismiss && this.props.onDismiss();
        }}
      >
        <View
          style={{
            width: 0,
            height: 0,
            borderColor: "transparent",
            borderWidth: 10,
            borderBottomColor: "#fff",
            position: "absolute",
            left: CSS.pixel(80),
            top: Platform.OS == 'ios' ? (headerHeight - 18) : (headerHeight - 10),
            // elevation: 1,
            shadowOffset: {
              width: 0,
              height: 0
            },
            shadowColor: "#333",
            shadowRadius: 4,
            shadowOpacity: 0.2,
            transform: [
              {
                scaleX: 0.6
              }
            ],
            zIndex: 1
          }}
        />
        <View
          style={{
            zIndex: 2,
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0.5)",
            left: 0,
            top: headerHeight,
            right: 0,
            bottom: 0,
            paddingHorizontal: CSS.pixel(40),
            alignItems: "center"
          }}
        >
          <View style={{width: '100%'}}>
          <ScrollView
            style={{
              backgroundColor: "#fff",
              borderRadius: 4,
              minHeight: 100,
              maxHeight: 360,
              width: "100%",
              marginTop: Platform.OS == 'ios' ? 0 : 10
            }}
          >
            {this.props.educationList.map((n, i, self) => {
                const isChecked = this.props.userAccount.some(
                    a => a.type == "education" && a.education_id == n.id
                );
                return (
                    <EducationItem
                        key={i + ""}
                        isDefault={n.is_default}
                        time={`${this.formatDate(n.start_date)}~${this.formatDate(
                            n.end_date
                        )}`}
                        id={n.id}
                        bordered={i != self.length - 1}
                        isFullTime={n.is_full_time}
                        isChecked={n.is_verify}
                        schoolName={n.school.name}
                        level={n.degree.name}
                        major={n.major.name}
                        college={n.college.name}
                        start_date={n.start_date}
                        end_date={n.end_date}
                        onPressDefault={this.onPressDefault.bind(this, n)}
                    />
                );
            })}
          </ScrollView>
          </View>
        </View>
      </SDTouchOpacity>
    );
  }
}

class EducationItem extends React.PureComponent {
    render() {
      const { isDefault, schoolName, major, level, time, isChecked, isFullTime, college, bordered} = this.props;
      return (
        <SDTouchOpacity style={{height: CSS.pixel(244), borderBottomColor: '#eee', borderBottomWidth: bordered ? 1 : 0}} onPress={() => {
            if (!isDefault) {
                this.props.onPressDefault();
                dismissLightBox();
            } else {
              dismissLightBox();
            }
        }}>
          <View
            style={{
              backgroundColor: "#fff",
              flexDirection: "row",
              flex: 1,
              overflow: "hidden",
              borderRadius: CSS.pixel(10),
            }}
          >
            <View style={{ padding: CSS.pixel(30), flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  // justifyContent: "space-between"
                }}
              >
                <View>
                  <Text style={{ color: "#333", fontWeight: '500', fontSize: CSS.textSize(30) }}>
                    {schoolName}
                  </Text>
                </View>
                {isChecked && (
                  <View>
                    <Image
                      source={require("@img/mine_Resume_Authentication1.png")}
                    />
                  </View>
                )}
              </View>
              <View style={{marginTop: CSS.pixel(5)}}>
                <Text style={{ color: "#333", fontWeight: '500', fontSize: CSS.textSize(30) }}>
                  {level + "  ·  " + major}
                </Text>
              </View>
              <View style={{ marginTop: CSS.pixel(15) }}>
                <Text style={{ fontSize: CSS.textSize(28), color: "#666" }}>
                  {/* 全日制 计算机学院 */}
                  {isFullTime ? "全日制 ": "非全日制 "} {college}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  left: -5,
                  marginTop: CSS.pixel(10)
                }}
              >
                <View
                  style={{
                    borderRadius: CSS.pixel(22),
                    backgroundColor: "#eee",
                    paddingHorizontal: CSS.pixel(20),
                    paddingVertical: CSS.pixel(7)
                  }}
                >
                  <Text style={{ color: "#333", fontSize: CSS.textSize(24) }}>
                    {time}
                  </Text>
                </View>
              </View>
            </View>
        
            <View
              style={{
                width: CSS.pixel(70),
                height: "100%",
                justifyContent: 'center'
              }}
            > 
                {isDefault && 
                <Image source={selectedIcon} />}
            </View>
          </View>
        </SDTouchOpacity>
      );
    }
  }

export default connectWithActions((state, props) => ({
  user: state.user,
  educationList: state.userEducationList,
  userAccount: state.schoolAccount
}))(SwitchIdLightBox);
