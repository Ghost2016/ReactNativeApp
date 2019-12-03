import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput,
  Image
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import { getUserBaseInfo } from "@src/users/usersSelector";
import IdentifyManageItem from "./IdentifyManageItem";
import { navScreen } from "@styles";
import { Toast } from "antd-mobile";
import SDLoading from "@sd_components/SDLoading";
import AddIdentifyScreen from "../screens/pushScreen/identifyManage/AddIdentifyScreen";
import { navRightButton, SDMainColor } from "../styles";
import { educationModel } from "../types";
import { refreshJobPlanListAction } from "@utils/funcs";
import { CSS } from "../common/SDCSS";
import SDTouchOpacity from "../common/SDTouchOpacity";
//import { Touchable } from "@src/sd_components";

const selectedIcon = require("@img/grow/growing_btn_MoRen.png");
const selectNorIcon = require("@img/grow/growing_btn_FeiMoRen.png");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    paddingHorizontal: CSS.pixel(30)
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
  educationList: educationModel[]
};
// 身份管理List (身份信息就是教育经历，有点蛋疼)
class IdentifyManageList extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  state = {
    loading: true
  };
  onPressAddIdentify() {
    this.context.navigator.push(
      navScreen(
        "AddEducationScreen",
        "添加教育经历",
        navRightButton("save_addEducation", "保存")
      )
    );
  }

  onPressEditIt(eduData) {
    this.context.navigator.push(
      navScreen("EditEducationScreen", "编辑教育经历", {
        passProps: {
          education: eduData
        },
        ...navRightButton("save_editEducation", "保存")
      })
    );
  }

  onPressDefault(eduData) {
    // debugger;
    Toast.loading("设置中...")
    this.props.actions.updateUserEduInfoAction(
      {
        is_default: true,
        id: eduData.id,
        start_date: eduData.start_date,
        end_date: eduData.end_date
      },
      res => {
        if (res.status == "ok") {
          //store.dispatch(setUserState(postData));
          // Toast.info("设置默认身份成功！");
          Promise.all([
            this.props.actions.getEducationAction({
              id: this.props.user.id
            }),
            this.props.actions.getUserInfoAction(),

            //刷新职业规划
            refreshJobPlanListAction(this),

            // this.props.
            this.context.refs["homeCardGroup"].fetchData(),
            this.context.refs["_rankScreen"] &&
              this.context.refs["_rankScreen"].handleActionToUpdateAllData()
          ]).then(values => {
            Toast.loading("设置默认身份成功！正在设置数据...");
          }).catch(err => {});
        } else {
          Toast.fail("修改身份信息失败");
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

  componentDidMount() {
    Promise.all([
      this.props.actions.getSchoolAccountAction(),
      this.props.actions.getEducationAction({
        id: this.props.user.id
      })
    ]).then(() => {
      this.setState({
        loading: false
      });
    }).catch(err => {});
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? <SDLoading /> : null}
        {this.props.educationList.map((n, i) => {
          // console.warn(n);
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
              isFullTime={n.is_full_time}
              isChecked={isChecked && n.is_verify}
              schoolName={n.school.name}
              level={n.degree.name}
              major={n.major.name}
              college={n.college.name}
              start_date={n.start_date}
              end_date={n.end_date}
              onPressEdit={this.onPressEditIt.bind(this, n)}
              onPressDefault={this.onPressDefault.bind(this, n)}
            />
          );
        })}
        <View style={{height: CSS.pixel(20)}}></View>
      </View>
    );
  }
}

class EducationItem extends React.PureComponent {
  render() {
    const { isDefault, schoolName, major, level, time, isChecked, isFullTime, college} = this.props;
    return (
      <View style={{ height: CSS.pixel(290), marginTop: CSS.pixel(40) }}>
        {isDefault ? (
          <SDTouchOpacity
            style={{
              height: CSS.pixel(34),
              width: "100%",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <Image source={selectedIcon} />
            <Text
              style={{
                fontSize: CSS.textSize(24),
                color: SDMainColor,
                fontWeight: "600",
                marginLeft: CSS.pixel(10)
              }}
            >
              默认
            </Text>
          </SDTouchOpacity>
        ) : (
          <SDTouchOpacity
            style={{
              height: CSS.pixel(34),
              width: "100%",
              alignItems: "center",
              flexDirection: "row"
            }}
            onPress={this.props.onPressDefault}
          >
            <Image source={selectNorIcon} />
            <Text
              style={{
                fontSize: CSS.textSize(24),
                color: "#999",
                fontWeight: "600",
                marginLeft: CSS.pixel(10)
              }}
            >
              设为默认
            </Text>
          </SDTouchOpacity>
        )}
        <View
          style={{
            backgroundColor: "#fff",
            flexDirection: "row",
            marginTop: CSS.pixel(12),
            height: CSS.pixel(242),
            overflow: "hidden",
            borderRadius: CSS.pixel(10)
          }}
        >
          <View
            style={{
              width: CSS.pixel(10),
              height: "100%",
              backgroundColor: isDefault ? SDMainColor : "#e5e5e5"
            }}
          />
          <View style={{ padding: CSS.pixel(30), flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
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
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state),
  educationList: state.userEducationList,
  userAccount: state.schoolAccount
}))(IdentifyManageList);
