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
  KeyboardAvoidingView
} from "react-native";
import { Toast } from "antd-mobile";
import { CSS } from "../../../common/SDCSS";
import PropTypes from "prop-types";

import ConnectWithActions from "../../../connectWithActions";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { navScreen, navRightButton } from "../../../styles";
import { LocalModel, userBaseInfoModel } from "../../../types";
import { getUserBaseInfo } from "../../../users/usersSelector";
const heightScreen = Dimensions.get("window").height;
const styles = StyleSheet.create({
  btnGroup: {
    height: CSS.pixel(160, true),
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: CSS.pixel(60, true)
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
    borderBottomColor: "#efefef",
    borderBottomWidth: 1,
    justifyContent: "center"
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
      city:
        this.props.location && this.props.location.city
          ? this.props.location.city
          : "",
      province:
        this.props.location && this.props.location.province
          ? this.props.location.province
          : "",
      keyboardHeight: 0,
      schoolOptions: [],
      timer: null
      // schoolOptions: ["四川大学", "电子科技大学", "成都理工大学", "成都大学"]
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
    this.context.refs["_school"] = this;
  }
  onSearchText() {
    if (this.state.schoolText !== "") {
      Toast.loading("查询中", 0);
      this.props.actions.getSchoolSearchAction(
        {
          school_name: this.state.schoolText
        },
        res => {
          if (res.length > 0) {
            this.context.refs["regis_Screen"].setState({
              searchSchoolData: res
            });

            setTimeout(() => {
              UIManager.measure(
                ReactNative.findNodeHandle(this.refs["inputSchool"]),
                (x, y, w, h, px, py) => {
                  // 代码
                  // Todo
                  // 查询联想结果
                  this.context.refs["regis_tipDocker"].show(px + 20, py + 25);
                }
              );
              Toast.hide();
            }, 1500);

            // 改变学校封面
            this.props.actions.getSchoolPoiInfoAction(
              {
                city: "",
                keywords: this.state.schoolText
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
          } else {
            Toast.info("查询暂无结果");
          }
        }
      );
    }
  }
  onChangeText(text) {
    // text=>this.setState({schoolText: text})
    // 进行模糊查询学校
    this.setState({
      schoolText: text
    });
    this.changeBtnStatus(text);

    // 联想学校专业
    if (this.state.timer) {
      clearTimeout(this.state.timer);
    }
    this.props.actions.getSchoolMajorRankAction(
      {
        school_name: text,
        page_size: 5,
        sort: "-person_num"
      },
      res => {
        if (res.length <= 0) {
          if (Platform.OS === "ios") {
            this.state.timer = setTimeout(() => {
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
  changeBtnStatus(text) {
    Toast.loading("查询中");
    if (text !== "") {
      if (this.context.refs["regis_Screen"].state.isDisabled !== false) {
        this.context.refs["regis_Screen"].setState({
          isDisabled: false
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
  }
  onPressOptionSchool(text) {
    this.setState({
      schoolText: text
    });

    this.changeBtnStatus(text);
  }

  _renderSuggestSchool(res) {
    if (res.info == "OK") {
      this.setState({
        schoolOptions: res.pois
      });
    }
  }

  componentWillMount() {
    if (this.props.location.city && this.props.location.province && this.props.location.city !== '' && this.props.location.province !== '') {
      this.props.actions.updateBaseInfoAction(
        {
          city_name: this.props.location.city,
          province_name: this.props.location.province
        }
      )
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
              轻松几步
            </Text>
            <Text
              style={{
                color: "#333",
                fontSize: 18,
                marginBottom: 10,
                fontWeight: "bold"
              }}
            >
              测测你的职么力
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
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              left: -5,
              marginTop: 40
            }}
            onPress={() => {
              // navLightBox("UpdateAddressLightBoxScreen");
              this.context.navigator.push(
                navScreen(
                  "EditUserAddressScreen",
                  "地区",
                  navRightButton("save_userAddress", "保存")
                )
              );
            }}
          >
            <Image
              source={require("@img/login/login_position.png")}
              style={{ width: 36, height: 36, top: 2 }}
              resizeMode="stretch"
            />
            <Text style={{ marginRight: CSS.pixel(30) }}>
              {this.state.address && this.state.address !== ""
                ? this.state.address
                : this.props.user.city &&
                  this.props.user.city.province &&
                  this.props.user.city.name !== "" &&
                  this.props.user.city.province.name !== ""
                  ? this.props.user.city.province.name +
                    " " +
                    this.props.user.city.name
                  : "定位失败，请手动修改位置"}
            </Text>
          </SDTouchOpacity>
          <View
            style={{
              alignItems: "flex-start",
              marginTop: 20,
              paddingLeft: 5
            }}
          >
            <Text
              style={{
                color: "#ccc",
                textAlign: "left",
                fontSize: 12
              }}
            >
              英雄要问出处，你在哪里高就？
            </Text>
          </View>

          <View style={styles.inputSchool}>
            <TextInput
              ref="inputSchool"
              value={this.state.schoolText}
              onSubmitEditing={this.onSearchText.bind(this)}
              onChangeText={this.onChangeText.bind(this)}
              underlineColorAndroid="transparent"
              type="text"
              placeholder="你就读的大学名称"
              returnKeyType="search"
            />
          </View>

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
          </View>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  location: state.location,
  user: getUserBaseInfo(state)
}))(CardSchool);
