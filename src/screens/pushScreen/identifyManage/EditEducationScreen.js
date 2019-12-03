import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import LabelInput from "../../../common/SDLabelInput";
import defaultStyle from "@styles";
import { educationModel } from "../../../types";
import ConnectWithActions from "../../../connectWithActions";
import { getUserId } from "../../../directSelectors";
import { Navigation } from "react-native-navigation";
import { Toast } from "antd-mobile";
import { isValidRangeDate } from "../../../utils/funcs";
import {
  dismissLightBox,
  SDMainColor,
  navScreen,
  navLightBox
} from "../../../styles";
import config from "../../../config";
import SearchSchoolItem from "../../../sd_searchBox/SearchSchoolItem";
import SearchBox from "../../../sd_searchBox/SearchBox";
import SearchBoxItem from "../../../sd_searchBox/SearchBoxItem";
import { CSS } from "../../../common/SDCSS";
import SDTouchOpacity from "../../../common/SDTouchOpacity";

// const sWidth = Dimensions.get("window").width;
// const sHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  }
});

type Props = {
  education: educationModel,
  userId: number
};

// 我的-编辑教育
class EditEducationScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
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
      "save_editEducation"
    );
  }

  componentWillUnmount() {
    this.props.actions.getUserInfoAction();
  }

  onNavigatorEvent(event) {
    // this is the onPress handler for the two buttons together
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_editEducation") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        if (this.props.education.edu_status == 'ok') {
          this.context.navigator.pop();
        }
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
          this.props.actions.updateEducationAction(
            {
              id: this.props.education.id,
              start_date:
                this.refs["_startInput"].state.value.replace(".", "-") + "-01",
              end_date:
                this.refs["_endInput"].state.value.replace(".", "-") + "-01",
              school_name: this.refs["_schoolInput"].state.value,
              major_name: this.refs["_majorInput"].state.value,
              degree_name: this.refs["_degreeInput"].state.value,
              is_default: this.props.education.is_default,
              college_name: this.refs["_collegeInput"].state.value,
              is_full_time:
                this.refs["_educationWayInput"].state.value == "非全日制"
                  ? false
                  : true
            },
            () => {
              Toast.info("修改成功");
              this.context.navigator.pop();
            }
          );
        }
      }
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
      <ScrollView
        style={styles.container}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ backgroundColor: "#f3f3f3", height: CSS.pixel(20) }} />
        <View style={{ backgroundColor: "#fff" }}>
          <LabelInput
            placeholder="学校名称"
            editable={false}
            defaultValue={this.props.education.school.name}
            placeholderRight="请输入学校名称"
            ref="_schoolInput"
            onPress={() => {
              Toast.info("不能修改", 0.2);
            }}
          />
          {this.props.education.edu_status == "ok" ? (
            <LabelInput
              placeholder="学院名称"
              editable={false}
              defaultValue={
                this.props.education.college
                  ? this.props.education.college.name
                  : ""
              }
              placeholderRight="请输入学院名称"
              ref="_collegeInput"
              onPress={() => {
                Toast.info("不能修改", 0.2);
              }}
            />
          ) : (
            <LabelInput
              placeholder="学院名称"
              defaultValue={
                this.props.education.college
                  ? this.props.education.college.name
                  : ""
              }
              direction=">"
              editable={false}
              placeholderRight="请输入学院名称"
              ref="_collegeInput"
              onPress={() => {
                // Toast.info("不能修改", 0.2);
                this.context.navigator.push(
                  navScreen("PushScreen", "查询学院", {
                    passProps: {
                      fullScreen: true,
                      noScrollView: true,
                      screen: () => (
                        <SearchBox
                          noAutoNext
                          autoFocus
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
          )}
          {this.props.education.edu_status === "ok" ? (
            <LabelInput
              placeholder="专业名称"
              editable={false}
              defaultValue={this.props.education.major.name}
              placeholderRight="请输入专业名称"
              ref="_majorInput"
              onPress={() => {
                Toast.info("不能修改", 0.2);
              }}
            />
          ) : (
            <LabelInput
              placeholder="专业名称"
              defaultValue={this.props.education.major.name}
              placeholderRight="请输入专业名称"
              ref="_majorInput"
              // onChange={this.onChangeMajor.bind(this)}
              editable={false}
              direction=">"
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
                              this.context.refs["g_searchBox"].state.data
                                .results.length > 0
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
          )}
          <LabelInput
            ref="_degreeInput"
            placeholder="学历"
            defaultValue={this.props.education.degree.name}
            editable={false}
            onPress={() => {
              Toast.info("不能修改", 0.2);
            }}
          />
          <LabelInput
            ref="_educationWayInput"
            placeholder="教育形式"
            defaultValue={
              this.props.education.is_full_time ? "全日制" : "非全日制"
            }
            editable={false}
            onPress={() => {
              Toast.info("不能修改", 0.2);
            }}
          />
          <LabelInput
            ref="_startInput"
            placeholder="入学时间"
            defaultValue={this.props.education.start_date
              .slice(0, 7)
              .replace(/-/g, ".")}
            editable={false}
            onPress={() => {
              Toast.info("不能修改", 0.2);
            }}
          />
          <LabelInput
            ref="_endInput"
            placeholder="毕业时间"
            defaultValue={this.props.education.end_date
              .slice(0, 7)
              .replace(/-/g, ".")}
            editable={false}
            onPress={() => {
              Toast.info("不能修改", 0.2);
            }}
          />
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: CSS.pixel(246)
          }}
        >
          <SDTouchOpacity
            style={{
              width: CSS.pixel(550),
              height: CSS.pixel(80),
              borderRadius: CSS.pixel(40),
              borderColor: "#FE8900",
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => {
              if (this.props.education.is_default) {
                navLightBox("ConfirmLightBoxScreen", {
                  passProps: {
                    title: "该教育经历已被设置为默认身份，不可删除！"
                  }
                });
              } else {
                navLightBox("ConfirmLightBoxScreen", {
                  passProps: {
                    title: "确定删除该教育经历?",
                    onOk: () => {
                      this.props.actions
                        .delEducationAction({
                          id: this.props.education.id
                        })
                        .then(res => {
                          Toast.success("删除成功");
                          this.context.navigator.pop();
                        })
                        .catch(err => {});
                    }
                  }
                });
              }
            }}
          >
            <Text style={{ color: "#FE8900", fontSize: CSS.textSize(32) }}>
              删除该教育经历
            </Text>
          </SDTouchOpacity>
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userId: getUserId(state)
}))(EditEducationScreen);
