import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  TextInput,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { InputItem } from "antd-mobile";
import { CSS } from "../../../common/SDCSS";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { navScreen, SDMainColor } from "../../../styles";
import ConnectWithActions from "../../../connectWithActions";
import SearchBox from "../../../sd_searchBox/SearchBox";
import SearchSchoolItem from "../../../sd_searchBox/SearchSchoolItem";
import { Toast } from "antd-mobile";

const no01 = require("@img/login/login_ico_PhD_normal.png");
const se01 = require("@img/login/login_ico_PhD_selected.png");

const no02 = require("@img/login/login_ico_master_normal.png");
const se02 = require("@img/login/login_ico_master_selected.png");

const no03 = require("@img/login/login_ico_Undergraduate_normal.png");
const se03 = require("@img/login/login_ico_Undergraduate_selected.png");

const styles = StyleSheet.create({
  btnGroupItem: {
    // borderColor: "#999",
    // borderRadius: 2,
    // borderWidth: 1,
    // paddingLeft: 20,
    // paddingRight: 20,
    // paddingTop: 4,
    // paddingBottom: 4,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 14,
    color: "#999",
    marginTop: 5
  }
});

// 学历
class CardLevel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      levelText: "",
      is_full_time: true,
      majorText: "",
    };
  }

  onPressLevel(text) {
    this.setState({
      levelText: text
    });
    this.context.refs["regis_Screen"].setState({
      levelText: text
    });
    if(this.context.refs["regis_Screen"].state.majorText) this.context.refs["regis_Screen"].setState({
      isDisabled: false,
      snapX: CSS.width() * 3,
    });
  }

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };

  onSearchText() {
    if (this.state.majorText !== "") {
      Toast.loading("查询中", 0);

      this.props.actions.getMajorSearchAction(
        {
          major: this.state.majorText
        },
        res => {
          // console.warn(res);
          if (res.length > 0) {
            this.context.refs["regis_Screen"].setState(
              {
                searchMajorData: res
              },
              () => {
                setTimeout(() => {
                  this.refs["inputMajor"] && UIManager.measure(
                    ReactNative.findNodeHandle(this.refs["inputMajor"]),
                    (x, y, w, h, px, py) => {
                      //代码
                      this.context.refs["regis_tipDocker"].show(
                        px + 20,
                        py + 25
                      );
                    }
                  );
                  Toast.hide();
                }, 1000);
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

    if(!this.context.refs["regis_Screen"].state.levelText) {
      Toast.fail("请先选择学历！");
      return
    }
    // text=>this.setState({majorText: text})
    // 进行模糊查询专业
    this.setState({
      majorText: text
    });
    this.context.refs["regis_Screen"].setState({
      majorText : text
    });

    if (text !== "" && this.context.refs["regis_Screen"].state.levelText) {
      if (this.context.refs["regis_Screen"].state.isDisabled !== false) {
        this.context.refs["regis_Screen"].setState({
          isDisabled: false,
          snapX: CSS.width() * 4
        });
      }
    } else {
      if (this.context.refs["regis_Screen"].state.isDisabled !== true) {
        this.context.refs["regis_Screen"].setState({
          isDisabled: true
        });
      }
    }
  }

  paraseCollege(level) {
    switch(level) {
      case "专科":
        return 1;
      case "本科":
        return 2;
      case "硕士":
        return 3;
      case "博士":
        return 4;
    }
  }

  useSearchMajorItem(text) {
    this.setState({
      majorText: text
    });

    this.context.refs["regis_Screen"].setState({
      isDisabled: (this.context.refs["regis_Screen"].state.levelText) ? false : true,
      majorText: text
    });

    this.context.navigator.pop({
      animated: true, // does the pop have transition animation or does it happen immediately (optional)
      animationType: "fade"
    });
  }

  pushSearch() {
    if(!this.context.refs["regis_Screen"].state.levelText) {
      Toast.fail("请先选择学历！");
      return
    }

    this.context.navigator.push(
      navScreen("PushScreen", "查询专业", {
        passProps: {
          fullScreen: true,
          noScrollView: true,
          screen: () => (
            <SearchBox
              noAutoNext
              autoFocus
              refreshAction={this.props.actions.majorSuggestAction}
              queryKey={"prefix"}
              extralKey={{
                degree: this.paraseCollege(this.context.refs["regis_Screen"].state.levelText)
              }}
              onSubmit={text => {
                if (this.context.refs["g_searchBox"].state.data.results.length > 0) {
                  this.props.actions
                    .majorSuggestAction({
                      prefix: text.replace(/\s/g, ""),
                      size: 10,
                      degree: this.paraseCollege(this.context.refs["regis_Screen"].state.levelText)
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
                    .getMajorSearchAction({
                      major: text
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
                    onPress={this.useSearchMajorItem.bind(this, item.major)}
                    key={index + ""}
                    searchText={word}
                    fullText={item.major}
                    subFullText={
                      item.level + " " + item.level1 + " " + item.level2
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
              学历
            </Text>
            <View
              style={{
                width: 30,
                borderBottomColor: "#333",
                borderBottomWidth: 3
              }}
            />
          </View>
          <View style={{
            //flex: 1,
            width: '90%',
            height: CSS.pixel(760, true),
            borderWidth: 0,
            borderColor: '#f00',
           }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                flex: 1,
                justifyContent: "space-around",
                alignContent: "space-around",
                borderWidth: 0,
                borderColor: '#00f',
                marginBottom: CSS.pixel(60, true),
              }}
            >
              <View
                style={{
                  width: CSS.pixel(220),
                  height: CSS.pixel(220, true),
                  alignItems: "center",
                  borderWidth: 0,
                  borderColor: '#f00',
                }}
              >
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                  }}
                  onPress={this.onPressLevel.bind(this, "博士")}
                >
                  <View style={styles.btnGroupItem}>
                    <Image
                      source={this.state.levelText === "博士" ? se01 : no01}
                      style={{ width: 60, height: 60 }}
                      resizeMode="stretch"
                    />
                    <Text style={styles.title}>博士真学霸</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: CSS.pixel(220),
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  style={{
                    marginTop: 10
                  }}
                  onPress={this.onPressLevel.bind(this, "硕士")}
                >
                  <View style={styles.btnGroupItem}>
                    <Image
                      source={this.state.levelText === "硕士" ? se02 : no02}
                      style={{ width: 60, height: 60 }}
                      resizeMode="stretch"
                    />
                    <Text style={styles.title}>硕士问学家</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: CSS.pixel(220),
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  style={{
                    marginTop: 10
                  }}
                  onPress={this.onPressLevel.bind(this, "本科")}
                >
                  <View style={styles.btnGroupItem}>
                    <Image
                      source={this.state.levelText === "本科" ? se03 : no03}
                      style={{ width: 60, height: 60 }}
                      resizeMode="stretch"
                    />
                    <Text style={styles.title}>本科大法好</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: CSS.pixel(220),
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  style={{
                    marginTop: 10
                  }}
                  onPress={this.onPressLevel.bind(this, "专科")}
                >
                  <View style={styles.btnGroupItem}>
                    <Image
                      source={this.state.levelText === "专科" ? se03 : no03}
                      style={{ width: 60, height: 60 }}
                      resizeMode="stretch"
                    />
                    <Text style={styles.title}>专科逆袭王</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
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
              就读专业
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
              marginTop: CSS.pixel(80, true),
              // height: CSS.pixel(40, true),
              left: CSS.pixel(10),
              height: CSS.pixel(80, true),
              borderBottomColor: "#efefef",
              borderBottomWidth: 1,
              justifyContent: "center"
            }}
            onPress={Platform.OS == "android" ? this.pushSearch.bind(this) : null}
          >
            <TextInput
              ref="inputMajor"
              style={{ padding: 0, color: '#333'}}
              value={this.state.majorText}
              onSubmitEditing={this.onSearchText.bind(this)}
              onChangeText={this.onChangeText.bind(this)}
              underlineColorAndroid="transparent"
              type="text"
              placeholder="你就读的专业名称"
              returnKeyType="done"
              returnKeyLabel="完成"
              editable={false}
              onTouchStart={
                Platform.OS == "ios" ? this.pushSearch.bind(this) : null
              }
            />
          </SDTouchOpacity>

            {/* 选择是否全日制 */}
            {/* <View
              style={{
                height: CSS.pixel(180),
                flexDirection: "row",
                alignItems: "center",
                justifyContent: 'space-around'
              }}
            >
              <SDTouchOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row"
                }}
                onPress={() => {
                  this.context.refs["regis_Screen"].state.is_full_time = true;
                  this.setState({
                    is_full_time: true
                  })
                }}
              >
                <View
                  style={{
                    width: CSS.pixel(28),
                    height: CSS.pixel(28),
                    borderRadius: CSS.pixel(14),
                    borderWidth: 2,
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
                      backgroundColor: this.state.is_full_time ? SDMainColor : '#fff'
                    }}
                  />
                </View>
                <View style={{marginLeft: CSS.pixel(14), alignItems: 'center'}}>
                  <Text style={{color: '#333', fontSize: CSS.textSize(30)}}>全日制</Text>
                </View>
              </SDTouchOpacity>
              <SDTouchOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row"
                }}
                onPress={() => {
                  this.context.refs["regis_Screen"].state.is_full_time = false;
                  this.setState({
                    is_full_time: false
                  })
                }}
              >
                <View
                  style={{
                    width: CSS.pixel(28),
                    height: CSS.pixel(28),
                    borderRadius: CSS.pixel(14),
                    borderWidth: 2,
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
                      backgroundColor: this.state.is_full_time ? '#fff' : SDMainColor
                    }}
                  />
                </View>
                <View style={{marginLeft: CSS.pixel(14), alignItems: 'center'}}>
                  <Text style={{color: '#333', fontSize: CSS.textSize(30)}}>非全日制</Text>
                </View>
              </SDTouchOpacity>
            </View> */}
          </View>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(CardLevel);
