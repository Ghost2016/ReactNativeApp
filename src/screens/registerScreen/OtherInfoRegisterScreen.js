import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
  KeyboardAvoidingView
} from "react-native";
import { Toast } from "antd-mobile";
import PropTypes from "prop-types";
import { InputItem } from "antd-mobile";
import ConnectWithActions from "../../connectWithActions";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { CSS } from "../../common/SDCSS";
import CardSchool from "./card/CardSchool";
import CardMajor from "./card/CardMajor";
import CardLevel from "./card/CardLevel";
import CardSex from "./card/CardSex";
import CardGraduateDate from "./card/CardGraduateDate";
import SelectDate from "../../sd_selectDate/SelectDate";
import SDTipDocker from "../../common/SDTipDocker";
import Highlighter from "react-native-highlight-words";
import { prefiexDate } from "../../utils/prefixDate";
import CardCollege from "./card/CardCollege";
import { isValidRangeDate } from "../../utils/funcs";
import store from "../../boot/store";
import { getUserBaseInfo } from "../../users/usersSelector";
import { userBaseInfoModel } from "../../types";

const sWidth = Dimensions.get("window").width;
const sHeight = Dimensions.get("window").height;

type Props = {
  user: userBaseInfoModel
};

class OtherInfoRegisterScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      schoolBgImg: "",
      // entries: ["school", "college", "major", "level", "sex", "graduate"],
      //entries: ["school", "college", "level", "major", "sex", "graduate"],
      entries: ["school", "level", "sex"],
      sliderWidth: Dimensions.get("window").width,
      itemWidth: Dimensions.get("window").width - 2 * 30,
      currIndex: 0,
      isDisabled: true,
      isHiddenStepBtn: false,
      discoverBtnDisabled: true,
      discoverBtnHidden: true,

      schoolText: "",
      majorText: "",
      levelText: "",
      sexText: "",
      collegeText: "",
      is_full_time: true,
      //20181219新增昵称头像
      nickText: "",
      avatorText: "",

      startTimeText: "",
      endTimeText: "",

      startTime: "",
      endTime: "",

      searchSchoolData: [],
      searchMajorData: [],

      snapX: 0
    };
  }

  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
  };

  getCarousel() {
    return this._carousel;
  }

  _renderItem({ item, index }) {
    switch (item) {
      case "school":
        return <CardSchool />;
      /* case "college":
        return <CardCollege />; */
      case "level":
        return <CardLevel />;
      /* case "major":
        return <CardMajor />; */
      case "sex":
        return <CardSex />;
      /* case "graduate":
        return <CardGraduateDate />; */
      default:
        break;
    }
  }

  onPressDiscoverHome() {
    // 进行保存信息交互
    if (!isValidRangeDate(this.state.startTimeText, this.state.endTimeText, true)) {
      Toast.fail("入学时间不能大于毕业时间, 并且间隔不能小于一年");
      return;
    }
    Toast.loading("更新数据中");
    this.props.actions.updateBaseInfoAction(
      {
        settings: JSON.stringify({
          tasks: true,
          dynamic: true,
          location: true,
        }),
        gender: this.state.sexText,
        nickname: this.state.nickText,
        avatar_id: this.state.avatorText,
      },
      res => {
        //console.log("updateBaseInfoAction res", res)
        if (res.status == "ok") {
          this.props.actions.addEducationAction(
            {
              start_date: this.state.startTimeText,
              end_date: this.state.endTimeText,
              school_name: this.state.schoolText,
              major_name: this.state.majorText,
              degree_name: this.state.levelText,
              college_name: this.state.collegeText,
              is_full_time: this.state.is_full_time
            },
            res2 => {
              //console.log("addEducationAction res", res)
              // 如果是主页进来需要走完善的信息的流程
              if (store.getState().launchScreen.root == "after-login") {
                //console.log("^^=再次获取用户信息进行UI更新")
                // 再次获取用户信息进行UI更新
                this.props.actions.getUserInfoAction().then((res) => {
                  //console.log("^^=getUserInfoAction then", res, this.context.navigator.pop)
                  this.context.navigator.pop({
                    animated: true, // does the pop have transition animation or does it happen immediately (optional)
                    animationType: "fade"
                  });
                }).catch( res => {
                  //console.log("^^=getUserInfoAction catch", res)
                  this.context.navigator.pop({
                    animated: true, // does the pop have transition animation or does it happen immediately (optional)
                    animationType: "fade"
                  });
                })
              } else {
                //console.log("^^=after-login")
                this.props.actions.changeAppRoot("after-login");
              }
            }
          );
        }
      }
    );
  }

  setStartTime(data) {
    this.context.refs["_graduateDate"].setStartDate(
      data.year.name + data.month.name
    );
    this.setState({
      startTime: data.year.name + data.month.name,
      startTimeText: data.year.id + "-" + prefiexDate(data.month.id) + "-01"
    });
    if (this.state.endTime !== "") {
      this.setState({
        discoverBtnDisabled: false
      });
    } else {
      this.setState({
        discoverBtnDisabled: true
      });
    }
  }

  setEndTime(data) {
    this.context.refs["_graduateDate"].setEndDate(
      data.year.name + data.month.name
    );
    this.setState({
      endTime: data.year.name + data.month.name,
      endTimeText: data.year.id + "-" + prefiexDate(data.month.id) + "-01"
    });
    if (this.state.startTime !== "") {
      this.setState({
        discoverBtnDisabled: false
      });
    } else {
      this.setState({
        discoverBtnDisabled: true
      });
    }
  }

  componentDidMount() {
    this.context.refs["regis_Screen"] = this;
    this.context.refs["regis_startDate"] = this.refs["regis_startDate"];
    this.context.refs["regis_endDate"] = this.refs["regis_endDate"];
    this.context.refs["regis_tipDocker"] = this.refs["regis_tipDocker"];
  }

  onSnapToItem(index) {

    // 判断当前index
    this.setState({
      currIndex: index
    });
    switch (index) {
      case 0:
        // 学校
        if (this.state.schoolText == "" || this.state.startTimeText == "" || this.state.endTimeText == "") {
          this.setState({
            isDisabled: true,
            snapX: this._carousel._currentContentOffset ? this._carousel._currentContentOffset : 0
          });
        } else {
          this.setState({
            isDisabled: false
          });
        }
        break;
      case 1:
        // 判断学校是否为空就到这里来了
        if (this.state.schoolText == "") {
          this._carousel.snapToItem(0);
        } else {
          // 判断是否有值了
          if (this.state.collegeText == "") {
            this.setState({
              isDisabled: true,
              snapX: this._carousel._currentContentOffset ? this._carousel._currentContentOffset : 0
            });
          } else {
            this.setState({
              isDisabled: false
            });
          }
        }
        break;
      case 2:
        // 判断学院是否为空就到这里来了
        if (this.state.collegeText == "") {
          //this._carousel.snapToItem(1);
        } else {
          // 判断是否有值了
          // if (this.state.majorText == "") {
          //   this.setState({
          //     isDisabled: true,
          //     snapX: this._carousel._currentContentOffset ? this._carousel._currentContentOffset : 0
          //   });
          // } else {
          //   this.setState({
          //     isDisabled: false
          //   });
          // }
          if (this.state.levelText == "") {
            this.setState({
              isDisabled: true,
              snapX: this._carousel._currentContentOffset ? this._carousel._currentContentOffset : 0
            });
          } else {
            this.setState({
              isDisabled: false
            });
          }
        }
        break;
      case 3:
        // 判断专业是否为空就到这里来了
        // if (this.state.majorText == "") {
        if (this.state.levelText == "") {
          this._carousel.snapToItem(2);
        } else {
          // 判断是否有值了
          // if (this.state.levelText == "") {
          //   this.setState({
          //     isDisabled: true,
          //     snapX: this._carousel._currentContentOffset ? this._carousel._currentContentOffset : 0
          //   });
          // } else {
          //   this.setState({
          //     isDisabled: false
          //   });
          // }
          if (this.state.majorText == "") {
            this.setState({
              isDisabled: true,
              snapX: this._carousel._currentContentOffset ? this._carousel._currentContentOffset : 0
            });
          } else {
            this.setState({
              isDisabled: false
            });
          }
        }
        break;
      case 4:
        // 判断本科是否为空就到这里来了
        // if (this.state.levelText == "") {
        if (this.state.majorText == "") {
          this._carousel.snapToItem(3);
        } else {
          // 判断是否有值了
          if (this.state.sexText == "") {
            this.setState({
              isDisabled: true,
              snapX: this._carousel._currentContentOffset ? this._carousel._currentContentOffset : 0
            });
          } else {
            this.setState({
              isDisabled: false
            });
          }
        }
        break;
      case 5:
        // 判断性别是否为空就到这里来了
        if (this.state.sexText == "") {
          this._carousel.snapToItem(4);
        } else {
          // 判断是否有值了
          if (this.state.startTimeText == "" || this.state.endTimeText == "") {
            this.setState({
              isDisabled: true,
              snapX: this._carousel._currentContentOffset ? this._carousel._currentContentOffset : 0
            });
          } else {
            this.setState({
              isDisabled: false
            });
          }
        }
        break;
    }
  }

  onPressStepBtn() {
    if (this.state.currIndex == this.state.entries.length - 1) {
      this.onPressDiscoverHome();
    } else {
      this.setState({
        isDisabled: true
      })
      this._carousel.snapToNext();
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f3f3f3"
        }}
      >
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: sWidth,
            height: sHeight
          }}
        >
          {/* <Image
            source={
              this.state.schoolBgImg === ""
                ? require("@img/login/login_information_bg.png")
                : {
                    uri: this.state.schoolBgImg
                  }
            }
            style={{ width: sWidth, height: CSS.pixel(440, true) }}
            resizeMode="stretch"
          /> */}
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: sWidth,
              height: CSS.pixel(440, true),
              backgroundColor: "rgba(0,0,0,0.4)"
            }}
          />
        </View>
        {/* this.state.schoolBgImg === "" ? null : (
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: sWidth,
              height: CSS.pixel(440, true),
              backgroundColor: "rgba(0,0,0,0.4)"
            }}
          />
        ) */}
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: sWidth,
            height: sHeight,
            zIndex: 1
          }}
        >
          <View
            style={{
              height: CSS.pixel(440, true),
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <View style={{ marginTop: CSS.pixel(80, true) }}>
              <Text style={{ fontSize: CSS.pixel(38), color: "#fff" }}>
              职么开门
              </Text>
            </View>

            <Pagination
              dotsLength={this.state.entries.length}
              activeDotIndex={this.state.currIndex}
              containerStyle={{
                // paddingVertical: 8
                position: "absolute",
                left: CSS.pixel(30),
                top: CSS.pixel(90, true)
              }}
              dotColor={"#fed200"}
              dotStyle={{
                width: 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 2
              }}
              inactiveDotColor={"#efefef"}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
          </View>
          <View
            style={{
              height: CSS.pixel(960, true),
              top: -CSS.pixel(240, true),
            }}
          >
            {Platform.OS == "ios" ? (
              <KeyboardAvoidingView behavior="position">
                <Carousel
                  ref={c => {
                    this._carousel = c;
                  }}

                  data={this.state.entries}
                  renderItem={this._renderItem.bind(this)}
                  sliderWidth={this.state.sliderWidth}
                  itemWidth={this.state.itemWidth}
                  inactiveSlideOpacity={1}
                  enableMomentum={true}
                  validSnapOffsetX={this.state.snapX}
                  // scrollEnabled={this.state.snapX ? true : false}
                  // scrollEnabled={false}
                  lockScrollTimeoutDuration={0}
                  onScroll={(e) => {
                    // this._carousel
                    if(e.nativeEvent.contentOffset.x > this.state.snapX) {
                      this._carousel._lockScroll();
                      // console.warn(1);
                    }
                  }}
                  isIosScroll={true}
                  onScrollEndDrag={() => {
                    this._carousel._nextDragTime = Date.now() + 1000;
                  }}
                  onScrollBeginDrag={() => {
                    this._carousel._nextDragTime = Date.now() + 1000;
                  }}
                  onSnapToItem={this.onSnapToItem.bind(this)}
                />
              </KeyboardAvoidingView>
            ) : (
              <Carousel
                ref={c => {
                  this._carousel = c;
                }}
                data={this.state.entries}
                renderItem={this._renderItem.bind(this)}
                sliderWidth={this.state.sliderWidth}
                itemWidth={this.state.itemWidth}
                inactiveSlideOpacity={1}

                onSnapToItem={this.onSnapToItem.bind(this)}
                // onSnapToItem={(index) => this.setState({currIndex: index})}
              />
            )}
          </View>

          <View
            style={{
              display: this.state.isHiddenStepBtn ? "none" : "flex",
              justifyContent: "center",
              alignItems: "center",
              height: CSS.pixel(180, true),
              top:
                Platform.OS == "ios"
                  ? -CSS.pixel(240, true)
                  : -CSS.pixel(240, true)
            }}
          >
            <TouchableOpacity
              onPress={this.onPressStepBtn.bind(this)}
              activeOpacity={0.8}
              disabled={this.state.isDisabled}
              style={{
                backgroundColor: this.state.isDisabled ? "#d2d2d2" : "#fed200",
                borderRadius: 20,
                width: CSS.pixel(350),
                height: CSS.pixel(80),
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ color: "#333", fontSize: CSS.textSize(32), fontWeight: "600" }}>
                {this.state.currIndex == this.state.entries.length - 1
                  ? "发现我的职么力"
                  : "下一步"}
              </Text>
            </TouchableOpacity>
          </View>

          <SelectDate
            onEnter={this.setStartTime.bind(this)}
            height={sHeight}
            ref="regis_startDate"
          />
          <SelectDate
            onEnter={this.setEndTime.bind(this)}
            height={sHeight}
            ref="regis_endDate"
          />
        </View>
      </View>
    );
  }
}

class SearchItem extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress ? this.props.onPress : null}
        style={{
          height: 50,
          paddingHorizontal: 10,
          justifyContent: "space-around",
          borderBottomColor: "#efefef",
          borderBottomWidth: this.props.bodered === false ? 0 : 1
        }}
      >
        <Highlighter
          highlightStyle={{ color: "#fed200" }}
          searchWords={[this.props.searchText]}
          textToHighlight={this.props.fullText}
        />
        <Highlighter
          highlightStyle={{ color: "#fed200" }}
          searchWords={[this.props.searchText]}
          textToHighlight={this.props.subFullText}
        />
      </TouchableOpacity>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state)
}))(OtherInfoRegisterScreen);
