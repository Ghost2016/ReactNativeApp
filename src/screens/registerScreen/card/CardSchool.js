import React from "react";
import ReactNative, {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
  UIManager,
  TextInput,
  ScrollView,
  Keyboard,
  NativeModules,
  KeyboardAvoidingView
} from "react-native";
import { Toast } from "antd-mobile";
import { CSS } from "../../../common/SDCSS";
import PropTypes from "prop-types";

import ConnectWithActions from "../../../connectWithActions";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { navScreen, navRightButton, SDMainColor } from "../../../styles";
import { LocalModel, userBaseInfoModel } from "../../../types";
import { getUserBaseInfo } from "../../../users/usersSelector";
import SearchBox from "../../../sd_searchBox/SearchBox";
import SearchSchoolItem from "../../../sd_searchBox/SearchSchoolItem";
import CitySelect from "../../../sd_citySelect/CitySelect";
import Geolocation from "../../../boot/Geolocation";
import LabelInput from "@src/common/SDLabelInput";
import SelectRangeDate from "@src/screens/lightBoxScreen/SelectRangeDate";
import * as sdStyles from "@styles";
import { navLightBox } from "@styles";
import { getDateObj, isValidStartEndTime } from "@utils/funcs";

const heightScreen = Dimensions.get("window").height;
const styles = StyleSheet.create({
  btnGroup: {
    height: Platform.OS=="android" ? CSS.pixel(222, true) : CSS.pixel(160, true),
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: CSS.pixel(20, true),
    borderWidth: 0,
    borderColor: '#f00',
  },
  btnGroupItem: {
    borderColor: "#ccc",
    borderRadius: 2,
    borderWidth: 1,
    paddingLeft: CSS.pixel(20),
    paddingRight: CSS.pixel(20),
    paddingTop: CSS.pixel(8, true),
    paddingBottom: CSS.pixel(8, true),
    justifyContent: "center",
    alignItems: "center",
    marginRight: CSS.pixel(20),
    marginBottom: CSS.pixel(20),
    height: CSS.pixel(60, true)
  },
  inputSchool: {
    marginTop: CSS.pixel(40, true),
    left: CSS.pixel(10),
    height: CSS.pixel(80, true),
    marginRight: CSS.pixel(20),
    borderBottomColor: "#efefef",
    borderBottomWidth: 1,
    justifyContent: "center",
    borderWidth: 0,
    borderColor: '#f00',
  }
});

type Props = {
  location: LocalModel,
  user: userBaseInfoModel
};

// 选择学校
class CardSchool extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      schoolText: "",
      address: this.props.location.address || "",
      // city:
      //   this.props.location && this.props.location.city
      //     ? this.props.location.city
      //     : this.props.user.city && this.props.user.city.name
      //       ? this.props.user.city.name
      //       : "成都市",
      // province:
      //   this.props.location && this.props.location.province
      //     ? this.props.location.province
      //     : "",
      keyboardHeight: 0,
      schoolOptions: [],
      timer: null,
      chooseProvince: "",
      chooseCity: "",
      hasFetchSuggest: false,
      // schoolOptions: ["四川大学", "电子科技大学", "成都理工大学", "成都大学"]
      startTime: '',
      endTime: '',
    };
  }
  onPress() {
    this.props.setCardStatus(1, true);
    this.props.getCarousel().snapToNext();
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    this.context.refs["_schoolCard"] = this;

    // 检查android权限
    Platform.OS == "android" &&
    NativeModules.BackHome &&
    NativeModules.BackHome.getPermissions &&
    NativeModules.BackHome.getPermissions();
    Geolocation.getLastLocation();

    setTimeout(() => {
      // 修改用户地址
      if (
        this.props.location.city &&
        this.props.location.province &&
        this.props.location.city !== "" &&
        this.props.location.province !== ""
      ) {
        this.props.actions.updateBaseInfoAction({
          city_name: this.props.location.city,
          province_name: this.props.location.province
        });
      } else {
        this.props.actions.updateBaseInfoAction({
          city_name: '成都市',
          province_name: '四川省'
        });
      }

      this.fetchSuggestSchool(
        this.props.location && this.props.location.city
        ? this.props.location.city
        : this.props.user.city && this.props.user.city.name
          ? this.props.user.city.name
          : "成都市"
      );

    }, 1200);
  }

  fetchSuggestSchool(text) {
    // 判断获取当前城市的学校
    if (text && text !== "") {
      this.props.actions.getSchoolSearchAction(
        {
          address: text,
          page_size: 5
        },
        res => {
          this.setState({
            schoolOptions: res.map(item => {
              return {
                name: item.school_name,
                id: item.id
              };
            }),
            hasFetchSuggest: true
          });
        }
      );
    }
  }

  changeBtnStatus(text) {
    Toast.loading("查询中");
    if (text !== "") {
      if (this.context.refs["regis_Screen"].state.isDisabled !== false) {
        this.context.refs["regis_Screen"].setState({
          isDisabled: this.context.refs["regis_Screen"].state.endTime !== "" ? false : true,
          // isNeedScroll: true
          snapX: CSS.width()
        });
      }
    } else {
      if (this.context.refs["regis_Screen"].state.isDisabled !== true) {
        this.context.refs["regis_Screen"].setState({
          isDisabled: true
        });
      }
    }
    this.context.refs["regis_Screen"].setState({
      schoolText: text
    });

    // 改变学校封面
    this.props.actions.getSchoolPoiInfoAction(
      {
        city: "",
        keywords: text
      },
      res => {
        if (res.info == "OK" && res.count > 0) {
          if (res.pois[0].photos.length > 0) {
            this.context.refs["regis_Screen"].setState({
              schoolBgImg: res.pois[0].photos[0].url
            });
          } else {
            this.context.refs["regis_Screen"].setState({
              schoolBgImg: ""
            });
          }
        } else {
          this.context.refs["regis_Screen"].setState({
            schoolBgImg: ""
          });
        }
        Toast.hide();
      }
    );

    // 查询学校专业
    this.props.actions.getSchoolMajorRankAction(
      {
        school_name: text,
        page_size: 5,
        sort: "-person_num"
      },
      res => {
        if (res.length <= 0) {
          if (Platform.OS === "ios") {
            this.timer = setTimeout(() => {
              Toast.info(
                "此学校没查询到专业信息,请您检查是否输入正确学校!",
                0.5
              );
            }, 250);
          } else {
            this.context.navigator.showSnackbar({
              text: "此学校没查询到专业信息,请您检查是否输入正确学校!"
            });
          }
          return;
        }
        if (this.context.refs["_major"]) {
          this.context.refs["_major"].setState({
            majorOptions: res
              ? res.map(item => {
                  return item.major;
                })
              : []
          });
        }
      }
    );



  }

  onPressOptionSchool(text) {
    this.setState({
      schoolText: text
    });

    this.changeBtnStatus(text);
  }

  useSearchSchoolItem(text) {
    this.context.refs["_schoolCard"].setState({
      schoolText: text
    });

    // 搜索学校封面
    this.props.actions.getSchoolPoiInfoAction(
      {
        city: "",
        keywords: text
      },
      res => {
        if (res.info == "OK" && res.count > 0) {
          if (res.pois[0].photos.length > 0) {
            this.context.refs["regis_Screen"].setState({
              schoolBgImg: res.pois[0].photos[0].url
            });
          } else {
            this.context.refs["regis_Screen"].setState({
              schoolBgImg: ""
            });
          }
        } else {
          this.context.refs["regis_Screen"].setState({
            schoolBgImg: ""
          });
        }
      }
    );

    this.context.refs["regis_Screen"].setState({
      isDisabled: this.context.refs["regis_Screen"].state.endTime !== "" ? false : true,
      schoolText: text
    });

    this.context.navigator.pop({
      animated: true, // does the pop have transition animation or does it happen immediately (optional)
      animationType: "fade"
    });

    // 联想搜索学校专业
    this.props.actions.getSchoolMajorRankAction(
      {
        school_name: text,
        page_size: 5,
        sort: "-person_num"
      },
      res => {
        if (res.length <= 0) {
          if (Platform.OS === "ios") {
            setTimeout(() => {
              Toast.info(
                "此学校没查询到专业信息,请您检查是否输入正确学校!",
                0.5
              );
            }, 250);
          } else {
            this.context.navigator.showSnackbar({
              text: "此学校没查询到专业信息,请您检查是否输入正确学校!"
            });
          }
          return;
        }
        if (this.context.refs["_major"]) {
          this.context.refs["_major"].setState({
            majorOptions: res
              ? res.map(item => {
                  return item.major;
                })
              : []
          });
        }
      }
    );
  }

  pushSearch() {
    this.context.navigator.push(
      navScreen("PushScreen", "查询学校", {
        passProps: {
          fullScreen: true,
          noScrollView: true,
          screen: () => (
            <SearchBox
              noAutoNext
              autoFocus
              refreshAction={this.props.actions.schoolSuggestAction}
              queryKey={"prefix"}
              onSubmit={text => {
                if (
                  this.context.refs["g_searchBox"].state.data.results.length > 0
                ) {
                  this.props.actions
                    .schoolSuggestAction({
                      prefix: text.replace(/\s/g, ""),
                      size: 10
                    })
                    .then(res => {
                      if (this.context.refs["g_searchBox"]) {
                        this.context.refs["g_searchBox"].setState({
                          data: res
                        });
                      }
                    })
                    .catch(err => {});
                } else {
                  this.props.actions
                    .getSchoolSearchAction({
                      school_name: text
                    })
                    .then(res => {
                      if (this.context.refs["g_searchBox"]) {
                        this.context.refs["g_searchBox"].setState({
                          data: res
                        });
                      }
                    })
                    .catch(err => {});
                }
              }}
              renderItem={(item, index, word) => {
                return (
                  <SearchSchoolItem
                    onPress={this.useSearchSchoolItem.bind(
                      this,
                      item.school_name
                    )}
                    key={index + ""}
                    searchText={word}
                    fullText={item.school_name}
                    subFullText={
                      item.address
                        ? item.address + " "
                        : "" +
                          (item.is_985 ? "985 " : "") +
                          (item.is_211 ? "211 " : "") +
                          item.type
                    }
                  />
                );
              }}
            />
          )
        }
      })
    );
  }

  setDate(startDate, endDate){
    //console.log("setDate", startDate, endDate)
    if(!isValidStartEndTime(startDate, endDate)){
      Toast.fail("毕业时间不能晚于开学时间！", 5)
      return
    }

    let startCn = getDateObj(startDate.toString(), false, true, true, "-", true);
    let endCn = getDateObj(endDate.toString(), false, true, true, "-", true);
    let start = getDateObj(startDate.toString(), false, true, true, "-", true) + "-01";
    let end = getDateObj(endDate.toString(), false, true, true, "-", true) + "-01";
    this.setState({
      startTime: startCn,
      endTime: endCn,
    })

    this.context.refs["regis_Screen"].setState({
      startTime: startCn,
      startTimeText: start,
      endTime: endCn,
      endTimeText: end
    });
    if (endCn !== "" && this.context.refs["regis_Screen"].state.schoolText !== "") {
      this.context.refs["regis_Screen"].setState({
        isDisabled: false
      });
    } else {
      this.context.refs["regis_Screen"].setState({
        isDisabled: true
      });
    }
  }

  render() {
    return (
      <View
        style={{
          height: "100%",
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
            padding: CSS.pixel(40)
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
                marginBottom: CSS.pixel(20, true),
                fontWeight: "bold"
              }}
            >
              毕业院校
            </Text>
            <View
              style={{
                width: 30,
                borderBottomColor: "#333",
                borderBottomWidth: 3
              }}
            />
          </View>
          <SDTouchOpacity
            testID={"locate_CardSchool"}
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              left: -5,
              marginTop: 10,
              borderWidth: 0,
              borderColor: '#f00',
            }}
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "选择地区", {
                  passProps: {
                    screen: () => (
                      <CitySelect
                        isNeedNext
                        onGetPosition={(province, city, area) => {
                          // 修改用户地区信息
                          this.props.actions.updateBaseInfoAction({
                            city_name: city.name,
                            province_name: province.name
                          });

                          this.setState({
                            chooseProvince: province.name,
                            chooseCity: city.name,
                          });

                          // 获取城市联想结果
                          if (
                            province.name == "北京市" ||
                            province.name == "重庆市" ||
                            province.name == "天津市" ||
                            province.name == "上海市"
                          ) {
                            this.fetchSuggestSchool(province.name);
                          } else {
                            this.fetchSuggestSchool(city.name);
                          }
                        }}
                      />
                    ),
                    fullScreen: true,
                    noScrollView: true,
                    header: {
                      title: "选择地区"
                    }
                  }
                })
              );
            }}
          >
            <Image
              source={require("@img/login/login_position.png")}
              style={{ width: 36, height: 36, top: 2 }}
              resizeMode="stretch"
            />
            <Text style={{ marginRight: CSS.pixel(30) }}>
              {/* {this.props.user.city &&
              this.props.user.city.parent &&
              this.props.user.city.name !== "" &&
              this.props.user.city.parent.name !== ""
                ? this.props.user.city.parent.name +
                  " " +
                  this.props.user.city.name
                : "定位失败，请手动修改位置"} */}
                {/* {this.props.user.city &&
                this.props.user.city.parent &&
                this.props.user.city.name !== "" &&
                this.props.user.city.parent.name !== ""
                  ? this.props.user.city.parent.name +
                    " " +
                    this.props.user.city.name
                  : "四川省 成都市"} */}
                {this.state.chooseProvince && this.state.chooseCity ? (this.state.chooseProvince + " " + this.state.chooseCity) : ""}
                {((!this.state.chooseProvince || !this.state.chooseCity) && this.props.location.province) ? this.props.location.province : (!this.state.chooseProvince || !this.state.chooseCity) ? "四川省 ": ""}
                {((!this.state.chooseProvince || !this.state.chooseCity) && this.props.location.city) ? this.props.location.city : ((!this.state.chooseProvince || !this.state.chooseCity) && !this.props.location.province) ? "成都市 " : ""}
            </Text>
          </SDTouchOpacity>
          {/* <View
            style={{
              alignItems: "flex-start",
              marginTop: 20,
              paddingLeft: 5
            }}
          >
            <Text
              style={{
                color: "#666",
                textAlign: "left",
                fontSize: 12
              }}
            >
              英雄要问出处，你在哪里高就？
            </Text>
          </View> */}

          <ScrollView style={{
            borderWidth: 0,
            borderColor: '#f00',
          }}>
            {this.state.hasFetchSuggest ?
            <View style={styles.btnGroup}>
              {this.state.schoolOptions.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index + ""}
                    onPress={this.onPressOptionSchool.bind(this, item.name)}
                    style={styles.btnGroupItem}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View> : <View style={{justifyContent: 'center', alignItems: 'center', top: 20}}>
              <Text style={{color: '#999', fontSize: CSS.textSize(28)}}>正在加载周边学校...</Text>
            </View>
            }
          </ScrollView>
          <SDTouchOpacity
            style={[styles.inputSchool, {
              backgroundColor: "#fff",
              marginBottom: CSS.pixel(60, true)
             }]}
            onPress={
              Platform.OS === "android" ? this.pushSearch.bind(this) : null
            }
          >
            <TextInput
              ref="inputSchool"
              value={this.state.schoolText}
              underlineColorAndroid="transparent"
              type="text"
              editable={false}
              style={{ padding: 0, color: "#333" }}
              placeholder="以上都不是？填写我的大学名称"
              returnKeyType="done"
              returnKeyLabel="完成"
              onTouchStart={
                Platform.OS == "ios" ? this.pushSearch.bind(this) : null
              }
            />
          </SDTouchOpacity>

          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              marginBottom: CSS.pixel(20, true),
            }}
          >
            <Text
              style={{
                color: "#333",
                fontSize: 18,
                marginBottom: CSS.pixel(20, true),
                fontWeight: "bold"
              }}
            >
              入学毕业时间
            </Text>
            <View
              style={{
                width: 30,
                borderBottomColor: "#333",
                borderBottomWidth: 3
              }}
            />
          </View>

          <LabelInput
              ref="_timeInput"
              placeholder="选择入学毕业时间"
              placeholderColor={sdStyles.SDFontColorSubtitle}
              direction={this.state.startTime ? `${this.state.startTime} 到 ${this.state.endTime}` : '>'}
              editable={false}
              onPress={() => {
                navLightBox("LightBoxScreen", {
                  passProps: {
                    screen: () => <SelectRangeDate
                    mode="month"
                    onOk={this.setDate.bind(this)}
                    startTitle="入学时间"
                    endTitle="毕业时间"
                    />
                  }
                })
              }}
              titleFontStyle={{
                color: sdStyles.SDFontColorSubtitle,
                fontSize: CSS.textSize(26),
              }}
              style={{
                borderBottomWidth: 0,
                borderColor: "#efefef",
              }}
              titleStyle={{
                width: 120,
              }}
            />

        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  location: state.location,
  user: getUserBaseInfo(state)
}))(CardSchool);
