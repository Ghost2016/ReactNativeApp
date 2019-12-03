import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import PropTypes from "prop-types";
import LabelInput from "../../../common/SDLabelInput";
import defaultStyle from "@styles";
import ConnectWithActions from "../../../connectWithActions";
import { getUserId } from "../../../directSelectors";
import SelectDate from "../../../sd_selectDate/SelectDate";
import Seletor from "../../../sd_selector/Selector";
import { prefiexDate } from "../../../utils/prefixDate";
import { Toast } from "antd-mobile";
import Selector from "../../../sd_selector/Selector";
import { Navigation } from "react-native-navigation";
import SelectorDate from "../../../sd_selectDate/SelectDate";
import { isValidRangeDate } from "../../../utils/funcs";
import { dismissLightBox, SDMainColor, navScreen } from "../../../styles";
import config from "../../../config";
import SearchSchoolItem from "../../../sd_searchBox/SearchSchoolItem";
import SearchBox from "../../../sd_searchBox/SearchBox";
import SearchBoxItem from "../../../sd_searchBox/SearchBoxItem";
import { CSS } from "../../../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  }
});

type Props = {};

// 我的-添加教育
class AddEducationScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {};
    this.isPosting = false;
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentDidMount() {
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "save_addEducation"
    );
  }

  onNavigatorEvent(event) {
    // this is the onPress handler for the two buttons together
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_addEducation") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        if(this.isPosting) {
          return;
        }
        this.isPosting = true;
        if (
          this.refs["_schoolInput"].state.value == "" ||
          this.refs["_collegeInput"].state.value == "" ||
          this.refs["_majorInput"].state.value == "" ||
          this.refs["_degreeInput"].state.value == "" ||
          this.refs["_startInput"].state.value == "" ||
          this.refs["_educationWayInput"].state.value == "" ||
          this.refs["_endInput"].state.value == ""
        ) {
          Toast.fail("请先完善所有信息");
          this.isPosting = false;
          return;
        } else {
          if (
            !isValidRangeDate(
              this.refs["_startInput"].state.value.replace(".", "-") + "-01",
              this.refs["_endInput"].state.value.replace(".", "-") + "-01",
              true
            )
          ) {
            Toast.fail("入学时间不能大于毕业时间, 并且间隔不能小于一年");
            this.isPosting = false;
            return;
          }
          Toast.loading("保存中", 0);
          this.props.actions.addEducationAction(
            {
              start_date:
                this.refs["_startInput"].state.value.replace(".", "-") + "-01",
              end_date:
                this.refs["_endInput"].state.value.replace(".", "-") + "-01",
              school_name: this.refs["_schoolInput"].state.value,
              major_name: this.refs["_majorInput"].state.value,
              degree_name: this.refs["_degreeInput"].state.value,
              college_name: this.refs["_collegeInput"].state.value,
              is_full_time:
                this.refs["_educationWayInput"].state.value == "非全日制"
                  ? false
                  : true,
              is_default: false
            },
            () => {
              Toast.info("添加成功");
              this.context.navigator.pop();

              Promise.all([
                this.props.actions.getEducationAction({
                  id: this.props.userId
                }),
                this.props.actions.getUserInfoAction(),
                // this.props.
                this.context.refs["homeCardGroup"].fetchData(),
                this.context.refs["_rankScreen"] &&
                  this.context.refs["_rankScreen"].handleActionToUpdateAllData()
              ]).then(values => {
                Toast.loading("设置默认身份成功！正在设置数据...");
              });
            }
          );
        }
      }
    }
  }
  onChangeSchool(text) {
    if (text !== "") {
      this.props.actions.getSchoolSuggestAction(
        {
          prefix: text
        },
        res => {
          if (res.length > 0) {
            if (this.context.refs["g_searchSchool"]) {
              this.context.refs["g_searchSchool"].setState({
                data: res
              });
            } else {
              Navigation.showLightBox({
                screen: `${config.projName}.SearchSchoolDataScreen`,
                passProps: {
                  passSpecialProps: {
                    data: res,
                    onPressResult: school_name => {
                      dismissLightBox();
                      this.refs["_schoolInput"].setState({
                        value: school_name
                      });
                    }
                  }
                },
                style: {
                  backgroundBlur: "none",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  tapBackgroundToDismiss: true
                }
              });
            }
          } else {
            dismissLightBox();
            Toast.info("查询暂无结果", 0.1);
          }
        }
      );
    } else {
      dismissLightBox();
    }
  }

  onChangeMajor(text) {
    if (text !== "") {
      this.props.actions.getMajorSuggestAction(
        {
          prefix: text
        },
        res => {
          if (res.length > 0) {
            if (this.context.refs["g_searchMajor"]) {
              this.context.refs["g_searchMajor"].setState({
                data: res
              });
            } else {
              Navigation.showLightBox({
                screen: `${config.projName}.SearchMajorDataScreen`,
                passProps: {
                  passSpecialProps: {
                    data: res,
                    onPressResult: major_name => {
                      dismissLightBox();
                      this.refs["_majorInput"].setState({
                        value: major_name
                      });
                    }
                  }
                },
                style: {
                  backgroundBlur: "none",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  tapBackgroundToDismiss: true
                }
              });
            }
          } else {
            dismissLightBox();
            Toast.info("查询暂无结果", 0.1);
          }
        }
      );
    } else {
      dismissLightBox();
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={{ marginTop: CSS.pixel(20) }} />
        <View style={{ backgroundColor: "#fff" }}>
          <LabelInput
            ref="_schoolInput"
            placeholder="学校名称"
            placeholderRight="请选择学校"
            direction=">"
            editable={false}
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "学校查询", {
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
                            this.context.refs["g_searchBox"].state.data.results
                              .length > 0
                          ) {
                            this.props.actions
                              .schoolSuggestAction({
                                prefix: text,
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
                              onPress={() => {
                                this.refs["_schoolInput"].setState({
                                  value: item.school_name
                                });
                                this.context.navigator.pop({
                                  animated: true, // does the pop have transition animation or does it happen immediately (optional)
                                  animationType: "fade"
                                });
                              }}
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
            }}
          />
          <LabelInput
            ref="_collegeInput"
            placeholder="学院名称"
            direction=">"
            editable={false}
            placeholderRight="请选择学院"
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "查询学院", {
                  passProps: {
                    fullScreen: true,
                    noScrollView: true,
                    screen: () => (
                      <SearchBox
                        autoFocus
                        noAutoNext
                        onChange={text => {
                          this.props.actions
                            .biSuggestAction({
                              keyword: text.replace(/[\s]/g, ""),
                              title: "college"
                            })
                            .then(res => {
                              if (this.context.refs["g_searchBox"]) {
                                this.context.refs["g_searchBox"].setState({
                                  data: {
                                    results: res
                                  }
                                });
                              }
                            })
                            .catch(err => {});
                        }}
                        onSubmit={text => {
                          this.props.actions
                            .biSuggestAction({
                              keyword: text.replace(/[\s]/g, ""),
                              title: "college"
                            })
                            .then(res => {
                              if (this.context.refs["g_searchBox"]) {
                                this.context.refs["g_searchBox"].setState({
                                  data: {
                                    results: res
                                  }
                                });
                              }
                            })
                            .catch(err => {});
                        }}
                        renderItem={(item, index, word) => {
                          return (
                            <SearchBoxItem
                              key={index + ""}
                              word={word}
                              textValue={item.name}
                              item={item}
                              onPress={() => {
                                this.refs["_collegeInput"].setState({
                                  value: item.name
                                });
                                this.context.navigator.pop({
                                  animated: true, // does the pop have transition animation or does it happen immediately (optional)
                                  animationType: "fade"
                                });
                              }}
                            />
                          );
                        }}
                      />
                    )
                  }
                })
              );
            }}
          />
          <LabelInput
            ref="_majorInput"
            placeholder="专业名称"
            direction=">"
            editable={false}
            placeholderRight="请选择专业"
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "查询专业", {
                  passProps: {
                    fullScreen: true,
                    noScrollView: true,
                    screen: () => (
                      <SearchBox
                        autoFocus
                        noAutoNext
                        refreshAction={this.props.actions.majorSuggestAction}
                        queryKey={"prefix"}
                        onSubmit={text => {
                          if (
                            this.context.refs["g_searchBox"].state.data.results
                              .length > 0
                          ) {
                            this.props.actions
                              .majorSuggestAction({
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
                              onPress={() => {
                                this.refs["_majorInput"].setState({
                                  value: item.major
                                });
                                this.context.navigator.pop({
                                  animated: true, // does the pop have transition animation or does it happen immediately (optional)
                                  animationType: "fade"
                                });
                              }}
                              key={index + ""}
                              searchText={word}
                              fullText={item.major}
                              subFullText={
                                item.level +
                                " " +
                                item.level1 +
                                " " +
                                item.level2
                              }
                            />
                          );
                        }}
                      />
                    )
                  }
                })
              );
            }}
          />
          <Selector
            options={[
              {
                label: "博士",
                value: "博士"
              },
              {
                label: "硕士",
                value: "硕士"
              },
              {
                label: "本科",
                value: "本科"
              },
              {
                label: "专科",
                value: "专科"
              }
            ]}
            onOk={value => {
              this.refs["_degreeInput"].setState({ value: value[0] });
            }}
            onChange={value => {
              this.refs["_degreeInput"].setState({ value: value[0] });
            }}
          >
            <LabelInput
              ref="_degreeInput"
              placeholder="学历"
              editable={false}
              direction=">"
              isSelector={true}
              placeholderRight="请选择学历"
              disablePress={true}
            />
          </Selector>

          <Selector
            options={[
              {
                label: "全日制",
                value: "全日制"
              },
              {
                label: "非全日制",
                value: "非全日制"
              }
            ]}
            onOk={value => {
              this.refs["_educationWayInput"].setState({ value: value[0] });
            }}
            onChange={value => {
              this.refs["_educationWayInput"].setState({ value: value[0] });
            }}
          >
            <LabelInput
              ref="_educationWayInput"
              placeholder="教育形式"
              editable={false}
              direction=">"
              isSelector={true}
              placeholderRight="请选择教育形式"
              disablePress={true}
            />
          </Selector>

          <SelectorDate
            onOk={(y, m) => {
              this.refs["_startInput"].setState({
                value: y + "." + m
              });
            }}
          >
            <LabelInput
              disablePress={true}
              ref="_startInput"
              placeholder="入学时间"
              direction=">"
              isSelector={true}
              placeholderRight="请选择入学时间"
              editable={false}
            />
          </SelectorDate>
          <SelectorDate
            onOk={(y, m) => {
              this.refs["_endInput"].setState({
                value: y + "." + m
              });
            }}
          >
            <LabelInput
              disablePress={true}
              ref="_endInput"
              placeholder="毕业时间"
              placeholderRight="请选择毕业时间"
              direction=">"
              isSelector={true}
              editable={false}
            />
          </SelectorDate>
        </View>

        <View style={[defaultStyle.center, { padding: 10, height: 60 }]}>
          <Text style={{ color: "#fc860e", fontSize: 12, textAlign: "center" }}>
            温馨提示：信息提交后即不可修改，请保证你的信息真实有效
          </Text>
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userId: getUserId(state)
}))(AddEducationScreen);
