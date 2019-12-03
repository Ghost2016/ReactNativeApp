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
import config from "../../../config";
import { Toast } from "antd-mobile";
import ShareButton from "../../../sd_shareButton/ShareButton";
import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";

import { isIphoneX } from "../../../utils/iphonex";
import Carousel from "react-native-snap-carousel";
import ConnectWithActions from "../../../connectWithActions";

import { CSS } from "../../../common/SDCSS";
import Salary00 from "./Salary00";
import Salary01 from "./Salary01";
import Salary02 from "./Salary02";
import Salary03 from "./Salary03";
import Salary04 from "./Salary04";
import Salary05 from "./Salary05";
import Salary06 from "./Salary06";
import Salary07 from "./Salary07";
import Salary08 from "./Salary08";
import Salary09 from "./Salary09";
import Salary10 from "./Salary10";
import { getSchoolLevel, getUserGender } from "../../../directSelectors";
import CalcSalaryResultScreen from "./CalcSalaryResultScreen";
import { navScreen, navLightBox, SDMainColor } from "../../../styles";
import { UserState } from "../../../types";
import * as HOSTS from "@src/host";

const wIs320 = Dimensions.get("window").width <= 320;
const sWidth = Dimensions.get("window").width;
const sHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    backgroundColor: "#fb7f49",
    position: "relative"
  },
  resultContainer: {}
});

type Props = {
  user: UserState
};
// 计算薪资
class CalcSalaryScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      entries: [
        0,
        1,
        2,
        3,
        // 4, 5,
        6,
        7,
        8,
        9,
        10
      ],
      pageIndex: 0,

      otherText: "",
      workText: "",
      constellationText: "",
      jobText: "",
      areaText: "",
      domainText: "",

      choosed: {}, // 已选择的card

      p: {
        data: {
          degree: "博士",
          gender: this.props.userGender == "male" ? "男" : "女",
          jobType: "攻城狮",
          secondClass: ["Java", "项目经理"],
          city: "上海",
          workLength: "1-2",
          scale: "0-50",
          constellation: "金牛座",
          src: "img/rw/woman/gcs/5/gcs_5_jn.png",
          school:
            this.props.user.total && this.props.user.total.school_name
              ? this.props.user.total.school_name
              : "",
          major:
            this.props.user.total && this.props.user.total.major_name
              ? this.props.user.total.major_name
              : "",
          college:
            this.props.user.total && this.props.user.total.college_title
              ? this.props.user.total.college_title
              : ""
        },
        ext: {
          q1: {
            "1": "妈蛋，肯定又让我加班！"
          },
          q2: {
            "4": "善意地称赞"
          }
        }
      },

      nextDisabled: true
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.context.refs["calcSalaryScreen"] = this;
  }

  startCalcSalary() {
    Toast.loading("计算中", 0);
    this.props.actions.calcSalaryAction(this.state.p, res => {
      Toast.hide();

      this.context.navigator.push(
        navScreen("PushScreen", "算薪资结果", {
          // 禁止ios手势回退
          override: {
            navigatorStyle: {
              disabledBackGesture: true,
              navBarNoBorder: true,
              navBarHidden: true,
              tabBarHidden: true
            },
          },
          passProps: {
            screen: () => <CalcSalaryResultScreen />,
            fullScreen: true,
            header: false
          }
        })
      );
    }).then(res => {

    }).catch(err => {
      Toast.hide();
    });
  }

  _renderItem({ item, index }) {
    // console.log(item);
    switch (item) {
      case 0:
        return <Salary00 />;
      case 1:
        return <Salary01 />;
      case 2:
        return <Salary02 />;
      case 3:
        return <Salary03 />;
      case 4:
        return <Salary04 />;
      case 5:
        return <Salary05 />;
      case 6:
        return <Salary06 pageIndex={4} />;
      case 7:
        return <Salary07 pageIndex={5} />;
      case 8:
        return <Salary08 pageIndex={6} />;
      case 9:
        return <Salary09 pageIndex={7} />;
      case 10:
        return <Salary10 />;
      default:
        break;
    }
  }

  onSnapToItem(index) {
    // this.setState({
    //   pageIndex: index + 1
    // })
    if (index > 0) {
      if (!this.state.choosed[index - 1]) {
        this._carousel.snapToItem(index - 1);
      }
    }

    this.setState({
      pageIndex: index
    });
  }

  snapNext() {
    this._carousel.snapToItem(this.state.pageIndex + 1);
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: sWidth,
            height: sHeight
          }}
        >
          <Image
            source={
              isIphoneX()
                ? require("@img/salary/home_Salary_bg_iPhone_x.png")
                : require("@img/salary/home_Salary_bg.png")
            }
            style={{ width: sWidth, height: sHeight }}
            resizeMode="stretch"
          />
        </View>
        <View
          style={{
            position: "absolute",
            left: CSS.pixel(30),
            top: isIphoneX() ? CSS.pixel(125, true) : CSS.pixel(65, true),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              // 判断当前是第几页
              // if (this.state.pageIndex == 0) {
              this.context.navigator.pop();
              // } else {
              //   this._carousel.snapToItem(this.state.pageIndex - 1);
              // }
            }}
            style={{ width: CSS.pixel(100) }}
          >
            <Image source={require("@img/login/home_ico_back.png")} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: "absolute",
            right: CSS.pixel(30),
            top: isIphoneX() ? CSS.pixel(125, true) : CSS.pixel(65, true),
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              // this.refs["_shareButton"].show();
              navLightBox("LightBoxScreen", {
                passProps: {
                  screen: () => (
                    <ShareButton
                      timeLineOptions={{
                        type: "news",
                        title: `大家快来职么开门里算薪资试试👊`,
                        description: `大家快来职么开门里算薪资试试👊`,
                        webpageUrl: `${HOSTS.SHARE}/`
                      }}
                      sessionOptions={{
                        type: "news",
                        title: `大家快来职么开门里算薪资试试👊`,
                        description: `大家快来职么开门里算薪资试试👊`,
                        webpageUrl: `${HOSTS.SHARE}/`
                      }}
                    />
                  )
                }
              });
            }}
          >
            <Image source={require("@img/salary/home_ico_share.png")} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: isIphoneX() ? CSS.pixel(240, true) : CSS.pixel(170, true),
            height: CSS.pixel(100, true)
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: CSS.pixel(30),
                fontWeight: "bold",
                color: "#fff"
              }}
            >
              {this.state.pageIndex + 1}/ {this.state.entries.length}
            </Text>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            left: CSS.pixel(60),
            bottom: isIphoneX() ? CSS.pixel(255, true) : CSS.pixel(160, true),
            width: CSS.pixel(630),
            height: isIphoneX() ? CSS.pixel(702, true) : CSS.pixel(860, true),
            backgroundColor: "#fff",
            borderRadius: CSS.pixel(10),
            borderWidth: 1,
            borderColor: "#fff",
            overflow: "hidden"
          }}
        >
          <Carousel
            ref={c => {
              this._carousel = c;
            }}
            data={this.state.entries}
            renderItem={this._renderItem.bind(this)}
            sliderWidth={CSS.pixel(630)}
            itemWidth={CSS.pixel(630)}
            // scrollEnabled={false}
            onSnapToItem={this.onSnapToItem.bind(this)}
          />
        </View>
        {this.state.pageIndex == this.state.entries.length - 1 ? (
          <View
            style={{
              width: "100%",
              position: "absolute",
              bottom:
                Platform.OS === "ios"
                  ? isIphoneX()
                    ? CSS.pixel(100, true)
                    : CSS.pixel(30, true)
                  : CSS.pixel(56, true),
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                width: CSS.pixel(350),
                height: CSS.pixel(80, true),
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: SDMainColor,
                paddingHorizontal: CSS.pixel(8),
                paddingVertical: CSS.pixel(5),
                borderRadius: CSS.pixel(50)
              }}
              onPress={() => {
                this.startCalcSalary();
              }}
            >
              <Text style={{ color: "#333", fontSize: CSS.textSize(32) }}>
                生成我的薪资
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              width: "100%",
              position: "absolute",
              bottom:
                Platform.OS === "ios"
                  ? isIphoneX()
                    ? CSS.pixel(100, true)
                    : CSS.pixel(30, true)
                  : CSS.pixel(56, true),
              justifyContent: "center",
              alignItems: "center",
              display: "none"
              // display: this.state.pageIndex == 2 ? 'flex' : 'none'
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={this.state.nextDisabled}
              style={{
                width: CSS.pixel(350),
                height: CSS.pixel(80, true),
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: this.state.nextDisabled
                  ? "#d2d2d2"
                  : SDMainColor,
                paddingHorizontal: CSS.pixel(8),
                paddingVertical: CSS.pixel(5),
                borderRadius: CSS.pixel(50)
              }}
              onPress={() => {
                // this.startCalcSalary();
                this.snapNext();
              }}
            >
              <Text style={{ color: "#333", fontSize: CSS.textSize(32) }}>
                下一步
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  levelName: getSchoolLevel(state),
  userGender: getUserGender(state),
  user: state.user
}))(CalcSalaryScreen);
