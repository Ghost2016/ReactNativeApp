import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  TextInput
} from "react-native";
import { Toast } from "antd-mobile";
import { SDMainColor, dismissLightBox, navScreen } from "../../../styles/index";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import config from ".././../../config";
import { CSS } from "../../../common/SDCSS";
import connectWithActions from "../../../connectWithActions";
import { getUserBaseInfo } from "../../../users/usersSelector";
import { Navigation } from "react-native-navigation";
import { isIphoneX } from "../../../utils/iphonex";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import SearchBox from "../../../sd_searchBox/SearchBox";
import SearchSchoolItem from "../../../sd_searchBox/SearchSchoolItem";
import SearchBoxItem from "../../../sd_searchBox/SearchBoxItem";

const wIs320 = Dimensions.get("window").width <= 320;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  }
});

// 学校
class Salary10 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      jobText: "",
      pageIndex: 11,
      school_name: "",
      major_name: "",
      college_title: ""
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <KeyboardAwareScrollView
        style={[
          styles.container,
          {
            paddingHorizontal: CSS.pixel(30),
            paddingVertical: CSS.pixel(50, true)
          }
        ]}
      >
        <View>
          <Text
            style={{
              fontSize: CSS.pixel(32),
              color: "#333",
              fontWeight: "bold"
            }}
          >
            教育经历信息
          </Text>
        </View>
        <View
          style={{
            marginTop: CSS.pixel(40, true),
            marginBottom: CSS.pixel(70, true),
            width: CSS.pixel(60),
            borderBottomColor: "#333",
            borderBottomWidth: CSS.pixel(6)
          }}
        />

        <TitleInput
          title={"学校"}
          ref="_schoolInput"
          defaultValue={this.props.user.total.school_name}
          onPress={() => {
            this.context.navigator.push(
              navScreen("PushScreen", "学校查询", {
                passProps: {
                  fullScreen: true,
                  noScrollView: true,
                  screen: () => (
                    <SearchBox
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
                            onPress={() => {
                              this.context.refs[
                                "calcSalaryScreen"
                              ].state.p.data.school =
                                item.school_name;
                              this.refs["_schoolInput"].setState({
                                textValue: item.school_name
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

        <TitleInput
          ref="_collegeInput"
          title={"学院"}
          defaultValue={this.props.user.total.college_name}
          onPress={() => {
            this.context.navigator.push(
              navScreen("PushScreen", "查询学院", {
                passProps: {
                  fullScreen: true,
                  noScrollView: true,
                  screen: () => (
                    <SearchBox
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
                              this.context.refs[
                                "calcSalaryScreen"
                              ].state.p.data.college =
                                item.name;
                              this.refs["_collegeInput"].setState({
                                textValue: item.name
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

        <TitleInput
          ref="_majorInput"
          title={"专业"}
          defaultValue={this.props.user.total.major_name}
          onPress={() => {
            this.context.navigator.push(
              navScreen("PushScreen", "查询专业", {
                passProps: {
                  fullScreen: true,
                  noScrollView: true,
                  screen: () => (
                    <SearchBox
                      autoFocus
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
                              this.context.refs[
                                "calcSalaryScreen"
                              ].state.p.data.major =
                                item.major;
                              this.refs["_majorInput"].setState({
                                textValue: item.major
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
          }}
        />
      </KeyboardAwareScrollView>
    );
  }
}

type TitleProps = {
  placeholder: string,
  defaultValue: string,
  title: string,
  onKeyChange: ?Function,
  onSubmit: ?Function
};
class TitleInput extends React.PureComponent<TitleProps> {
  constructor(props) {
    super(props);
    this.state = {
      textValue: this.props.defaultValue || ""
    };
  }
  onChangeText(text) {
    this.setState(
      {
        textValue: text
      },
      () => {
        this.handleOnChange();
      }
    );
  }
  onKeyPress(e) {
    // Backspace
    // " "
    let str = "";
    switch (e.nativeEvent.key) {
      case "Backspace":
        if (this.state.textValue !== "") {
          str = this.state.textValue.slice(0, -1);
        }
        break;
      default:
        str = this.state.textValue + e.nativeEvent.key;
        break;
    }
    this.setState(
      {
        textValue: str
      },
      () => {
        this.handleOnChange();
      }
    );
  }
  handleOnChange() {
    if (this.props.onKeyChange && this.props.onKeyChange instanceof Function) {
      this.props.onKeyChange(this.state.textValue);
    }
  }
  onSubmitEditing() {
    if (this.props.onSubmit && this.props.onSubmit instanceof Function) {
      this.props.onSubmit(this.state.textValue);
    }
  }
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          borderBottomColor: "#efefef",
          borderBottomWidth: 1,
          height: CSS.pixel(100, true),
          marginBottom: CSS.pixel(60, true)
        }}
      >
        <View
          style={{ width: 60, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: CSS.textSize(34), color: "#999" }}>
            {this.props.title}
          </Text>
        </View>
        <SDTouchOpacity
          style={{ flex: 1, justifyContent: "center" }}
          onPress={this.props.onPress ? this.props.onPress : null}
        >
          <TextInput
            style={{ fontSize: CSS.textSize(34), color: "#333" }}
            placeholder={
              this.props.placeholder || "请输入" + (this.props.title || "")
            }
            returnKeyLabel="完成"
            returnKeyType="done"
            underlineColorAndroid={"transparent"}
            onKeyPress={this.onKeyPress.bind(this)}
            autoCapitalize="none"
            // autoCorrect={false}
            // spellCheck={false}
            value={this.state.textValue}
            // onChangeText={this.onChangeText.bind(this)}
            // onSubmitEditing={this.onSubmitEditing.bind(this)}
            editable={false}
            onTouchStart={this.props.onPress ? this.props.onPress : null}
          />
        </SDTouchOpacity>
      </View>
    );
  }
}

export default connectWithActions((state, props) => ({
  user: getUserBaseInfo(state, props)
}))(Salary10);
