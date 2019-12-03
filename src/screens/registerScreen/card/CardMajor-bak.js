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
const heightScreen = Dimensions.get("window").height;
const styles = StyleSheet.create({
  btnGroup: {
    height: CSS.pixel(160, true),
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: CSS.pixel(80, true)
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
  }
});

// 选择专业
class CardMajor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      majorText: "",
      majorOptions: [
        // "计算机原理",
        // "经济学",
        // "西方经济学",
        // "信息与通信工程",
        // "电子科学与技术"
      ]
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  componentWillMount() {
  }
  componentDidMount() {
    this.context.refs["_major"] = this;
  }
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
            this.context.refs["regis_Screen"].setState({
              searchMajorData: res
            }, () => {
              setTimeout(() => {
                UIManager.measure(
                  ReactNative.findNodeHandle(this.refs["inputMajor"]),
                  (x, y, w, h, px, py) => {
                    //代码
                    this.context.refs["regis_tipDocker"].show(px + 20, py + 25);
                  }
                );
                Toast.hide();
              }, 1000); 
            });
          } else {
            Toast.info("查询暂无结果");
          }
        }
      );

      // this.props.actions.biSuggestAction(
      //   {
      //     title: "major",
      //     keyword: this.state.majorText
      //   },
      //   res => {
      //     if (res.length > 0) {
      //       this.context.refs["regis_Screen"].setState({
      //         searchMajorData: res
      //       });
      //       this.context.refs["regis_tipDocker"].show(px + 20, py + 10);
      //     } else {
      //       Toast.info("查询暂无结果");
      //     }
      //   }
      // );
    }
  }
  onChangeText(text) {
    // text=>this.setState({majorText: text})
    // 进行模糊查询专业
    this.setState({
      majorText: text
    });
    this.changeBtnStatus(text);
  }
  changeBtnStatus(text) {
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
      majorText: text
    });
  }
  onPressOptionMajor(text) {
    this.setState({
      majorText: text
    });

    this.changeBtnStatus(text);
  }

  _onFocus(refName) {
    // if (Platform.OS == "ios") {
    //   if (this.state.keyboardHeight != 0) {
    //     UIManager.measure(
    //       ReactNative.findNodeHandle(this.refs[refName]),
    //       (x, y, w, h, px, py) => {
    //         var target = this.state.keyboardHeight + py + h - heightScreen;
    //         var a = heightScreen - this.state.keyboardHeight;
    //         if (target > 0) {
    //           this.refs["scrollview"].scrollTo(target);
    //         }
    //       }
    //     );
    //   }
    // }
  }

  componentWillUnmount() {
    // if (this.keyboardDidShowListener) {
    //   this.keyboardDidShowListener.remove();
    // }
  }

  componentWillMount() {
    // if (Platform.OS == "ios") {
    //   this.keyboardDidShowListener = Keyboard.addListener(
    //     "keyboardDidShow",
    //     this._keyboardDidShow.bind(this)
    //   );
    // }
  }
  _keyboardDidShow(e) {
    // if (Platform.OS == "ios") {
    //   let coord = e.startCoordinates || e.endCoordinates;
    //   this.setState(
    //     {
    //       keyboardHeight: coord.height + CSS.pixel(100, true)
    //     },
    //     () => {
    //       UIManager.measure(
    //         ReactNative.findNodeHandle(this.refs["inputMajor"]),
    //         (x, y, w, h, px, py) => {
    //           var target = this.state.keyboardHeight + py + h - heightScreen;
    //           var a = heightScreen - this.state.keyboardHeight;
    //           if (target > 0) {
    //             this.refs["scrollview"].scrollTo(target);
    //           }
    //         }
    //       );
    //       this.keyboardDidShowListener.remove();
    //     }
    //   );
    // }
  }

  render() {
    return (
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
            技术大法好
          </Text>
          <Text
            style={{
              color: "#333",
              fontSize: 18,
              marginBottom: CSS.pixel(20, true),
              fontWeight: "bold"
            }}
          >
            你在哪个领域深耕？
          </Text>
          <View
            style={{
              width: CSS.pixel(60),
              borderBottomColor: "#333",
              borderBottomWidth: 3
            }}
          />
        </View>

        <View
          style={{
            marginTop: CSS.pixel(80, true),
            // height: CSS.pixel(40, true),
            left: CSS.pixel(10),
            height: CSS.pixel(80, true),
            borderBottomColor: "#efefef",
            borderBottomWidth: 1,
            justifyContent: "center"
          }}
        >
          <TextInput
            ref="inputMajor"
            value={this.state.majorText}
            onFocus={this._onFocus.bind(this, "inputMajor")}
            onSubmitEditing={this.onSearchText.bind(this)}
            onChangeText={this.onChangeText.bind(this)}
            underlineColorAndroid="transparent"
            type="text"
            placeholder="你就读的专业名称"
            returnKeyType="search"
            returnKeyLabel="搜索"
          />
        </View>

        <View style={styles.btnGroup}>
          {this.state.majorOptions.map((item, index) => {
            return (
              <TouchableOpacity
                key={index + ""}
                onPress={this.onPressOptionMajor.bind(this, item)}
                style={styles.btnGroupItem}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(CardMajor);
