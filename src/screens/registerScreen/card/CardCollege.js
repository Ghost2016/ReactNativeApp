import React from "react";
import ReactNative, {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  TextInput,
  UIManager,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView
} from "react-native";
import PropTypes from "prop-types";
import { Toast } from "antd-mobile";
import { CSS } from "../../../common/SDCSS";
import ConnectWithActions from "../../../connectWithActions";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import SearchBox from "../../../sd_searchBox/SearchBox";
import { navScreen, SDMainColor } from "../../../styles";
import SearchBoxItem from "../../../sd_searchBox/SearchBoxItem";

// 选择专业
class CardCollege extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeText: ""
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    this.context.refs["_college"] = this;
  }
  onChangeText(text) {
    if (text != "") {
      this.context.refs["regis_Screen"].setState({
        isDisabled: false,
        collegeText: text
      });
    } else {
      this.context.refs["regis_Screen"].setState({
        isDisabled: true,
        collegeText: text
      });
    }
    this.setState({
      collegeText: text
    });
  }

  useSearchCollegeItem(text) {
    this.context.refs["_college"].setState({
      majorText: text
    });

    this.context.refs["regis_Screen"].setState({
      isDisabled: false,
      snapX: CSS.width() * 2,
      collegeText: text
    });

    this.context.navigator.pop({
      animated: true, // does the pop have transition animation or does it happen immediately (optional)
      animationType: "fade"
    });
  }

  pushSearch() {
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
                        data:  {
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
                    onPress={this.useSearchCollegeItem.bind(this, item.name)}
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
      // <KeyboardAvoidingView
      //   position='relative'
      // >
      <View
        style={{
          height: "100%",
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
            你所在的学院是什么？
          </Text>
          <View
            style={{
              width: CSS.pixel(60),
              borderBottomColor: "#333",
              borderBottomWidth: 3
            }}
          />
        </View>

        <SDTouchOpacity
          style={{
            marginTop: CSS.pixel(80, true),
            // height: CSS.pixel(40, true),
            height: CSS.pixel(80, true),
            left: CSS.pixel(10),
            borderBottomColor: "#efefef",
            borderBottomWidth: 1,
            justifyContent: "center"
          }}
          onPress={Platform.OS == "android" ? this.pushSearch.bind(this) : null}
        >
          <TextInput
            ref="inputCollege"
            style={{ padding: 0, color: '#333'}}
            value={this.state.majorText}
            underlineColorAndroid="transparent"
            type="text"
            // onChangeText={this.onChangeText.bind(this)}
            placeholder="你的学院名称"
            returnKeyType="done"
            returnKeyLabel="完成"
            editable={false}
            onTouchStart={
              Platform.OS == "ios" ? this.pushSearch.bind(this) : null
            }
          />
        </SDTouchOpacity>
      </View>
      // </KeyboardAvoidingView>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(CardCollege);
