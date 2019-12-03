import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { navScreen, navRightButton } from "@styles";
import { Toast, Modal } from "antd-mobile";
import ConnectWithActions from "../../../connectWithActions";
import { UserState, practiceExpModel } from "../../../types";
import { navLightBox } from "@styles";
import { SDMainColor } from "../../../styles";
import { CSS } from "../../../common/SDCSS";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import AddPracticeScreen from "../addPractice/AddPracticeScreen";
import EditPracticeScreen from '../editPractice/EditPracticeScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1"
  },
  saveBtnBox: {
    marginTop: 20,
    marginBottom: 20,
    height: 46,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden"
  }
});

type Props = {
  userInfo: UserState,
  practiceExpList: practiceExpModel[]
};

// 显示实习经历
class ShowPracticeExpScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };
  onPressDeleteItem(id) {
    // Modal.alert("删除", "你确定要删除???", [
    //   { text: "取消", onPress: () => console.log("cancel") },
    //   {
    //     text: "确定",
    //     onPress: () => {
    //       Toast.loading("删除中");
    //       this.props.actions.delUserWorkItemAction(
    //         {
    //           id: id
    //         },
    //         () => {
    //           Toast.info("删除成功");
    //         }
    //       );
    //     }
    //   }
    // ]);

    navLightBox("ConfirmLightBoxScreen", {
      passProps: {
        title: "你确定要删除?",
        onOk: () => {
          Toast.loading("删除中");
          this.props.actions.delUserWorkItemAction(
            {
              id: id
            },
            () => {
              Toast.info("删除成功");
            }
          );
        }
      }
    });
  }

  componentWillUnmount() {
    // 刷新我的数据
    this.props.actions.getUserInfoAction();
  }

  componentDidMount() {
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "show_add_practiceExp_btn"
    );
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "show_add_practiceExp_btn") {
        this.context.navigator.push(
          navScreen(
            "PushScreen",
            "添加实习经历",
            {
              passProps: {
                screen: () => <AddPracticeScreen />,
                fullScreen: true,
                noScrollView: true,
                header: {
                  title: "添加实习经历"
                }
              },
              ...navRightButton("save_practiceExpBtn", "保存")
            }
            
          )
        );
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {this.props.practiceExpList.map(item => {
            return (
              <PracticeExpItem
                key={item.id + ""}
                practice={item}
                onPressDeleteItem={this.onPressDeleteItem.bind(this, item.id)}
              />
            );
          })}
        </ScrollView>
        {/* <SDTouchOpacity
          style={{
            height: CSS.pixel(80),
            backgroundColor: SDMainColor,
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => {
            this.context.navigator.push(
              navScreen(
                "PushScreen",
                "添加实习经历",
                {
                  passProps: {
                    screen: () => <AddPracticeScreen />,
                    fullScreen: true,
                    noScrollView: true,
                    header: {
                      title: "添加实习经历"
                    }
                  },
                  ...navRightButton("save_practiceExpBtn", "保存")
                }
                
              )
            );
          }}
        >
          <Text style={{ color: "#333", fontSize: CSS.textSize(32) }}>
            + 添加实习经历
          </Text>
        </SDTouchOpacity> */}
      </View>
    );
  }
}
type PropsPractice = {
  practice: practiceExpModel,
  onPressDeleteItem: ?Function
};
class PracticeExpItem extends React.PureComponent<PropsPractice> {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <View style={{ marginTop: 10, padding: 10, backgroundColor: "#fff" }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ color: "#333", fontSize: 14 }}>
              {this.props.practice.start_date.slice(0, 7).replace(/-/, ".") +
                "-" +
                this.props.practice.end_date.slice(0, 7).replace(/-/, ".")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.context.navigator.push(
                  navScreen("PushScreen", "编辑实习经历", {
                    passProps: {
                      screen: ()=><EditPracticeScreen practice={this.props.practice}/>,
                      fullScreen: true,
                      noScrollView: true,
                      header: {
                        title: "编辑实习经历"
                      }
                    },
                    ...navRightButton("edit_practiceExpBtn", "保存")
                  })
                );
              }}
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <Image
                source={require("@img/my/TrackRecord/mine_Resume_btn_edit.png")}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={{ color: "#333", fontSize: 14 }}>
            {this.props.practice.company_name +
              " " +
              this.props.practice.job_name}
          </Text>
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={{ color: "#999", fontSize: 12, lineHeight: 18 }}>
            {this.props.practice.job_desc}
          </Text>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user,
  practiceExpList: state.userPracticeExpList
}))(ShowPracticeExpScreen);
