import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Image
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../../../connectWithActions";
import SDKeyboardSpacer from "../../../common/SDKeyboardSpacer";
import { CSS } from "../../../common/SDCSS";
import { isIphoneX } from "../../../utils/iphonex";
import IMChat from "../../../boot/IMChat";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor, navScreen } from "../../../styles";
import IMChatctcScreen from "./IMChatctcScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

// 我的-我的群组界面
class MyChatGroupScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      groupArr: []
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  componentWillMount() {
    // 获取我的群组
    IMChat.getOwnGroup()
      .then(res => {
        this.setState({
          groupArr: res
        });
      })
      .catch(err => {
        //console.warn(err);
      });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.state.groupArr.map(c => {
          return (
            <View
              key={c.groupId}
              style={{
                flexDirection: "row",
                padding: CSS.pixel(30),
                backgroundColor: "#f3f3f3",
                marginBottom: CSS.pixel(30, true)
              }}
            >
              <View style={{ flex: 1 }}>
                <View>
                  <Text>groupId: {c.groupId}</Text>
                </View>
                <View>
                  <Text>groupName: {c.groupNmae}</Text>
                </View>
                <View>
                  <Text>groupFaceUrl: {c.groupFaceUrl}</Text>
                </View>
                <View>
                  <Text>groupType: {c.groupType}</Text>
                </View>
                <View>
                  <Text>groupRole: {c.groupRole}</Text>
                </View>

                <View>
                  <Text>isSilenceAll: {c.isSilenceAll ? "true" : "false"}</Text>
                </View>
              </View>
              <View
                style={{
                  width: CSS.pixel(240),
                  justifyContent: "center",
                  alignItems: "flex-end"
                }}
              >
                <SDTouchOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: SDMainColor,
                    padding: 4
                  }}
                  onPress={() => {
                    this.context.navigator.push(
                      navScreen("ChatScreen", "聊天室", {
                        passProps: {
                          screen: () => <IMChatctcScreen getDetailThis={this.props.getDetailThis} group={this.props.liveData} />,
                          fullScreen: true,
                          noScrollView: true,
                          header: {
                            title: this.props.liveData.name
                          },
                          saveBg: '#f3f3f3',
                          navigatorButtons: {
                            rightButtons: [
                              {
                                icon: () => (
                                  <Image
                                    source={require("@img/imchat/growing_ico_more.png")}
                                  />
                                ),
                                id: "group_chat_menu_btn"
                              }
                            ]
                          }
                        }
                      })
                    );
                  }}
                >
                  <Text>进入聊天室</Text>
                </SDTouchOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(MyChatGroupScreen);
