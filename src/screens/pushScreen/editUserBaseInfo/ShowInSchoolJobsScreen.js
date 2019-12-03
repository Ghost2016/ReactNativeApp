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
import { Modal, Toast } from "antd-mobile";
import { schoolJobModel, UserState } from "../../../types";
import ConnectWithActions from "../../../connectWithActions";
import { navLightBox } from "@styles";
import { CSS } from "../../../common/SDCSS";
import { SDMainColor } from "../../../styles";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import AddInSchoolJobsScreen from "./AddInSchoolJobsScreen";
import EditInSchoolJobsScreen from "./EditInSchoolJobsScreen";

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
  jobList: schoolJobModel[],
  userInfo: UserState
};

// 显示在校职务经历
class ShowInSchoolJobsScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };
  onPressDeleteItem(id) {
    navLightBox("ConfirmLightBoxScreen", {
      passProps: {
        title: "你确定要删除?",
        onOk: () => {
          Toast.loading("删除中");
          this.props.actions.delJobItemAction(
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
  

  componentDidMount() {

    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "show_add_schoolJob_btn"
    );
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "show_add_schoolJob_btn") {
        this.context.navigator.push(
          navScreen(
            "PushScreen",
            "添加在校职务",
            {
              passProps: {
                screen: () => <AddInSchoolJobsScreen />,
                fullScreen: true,
                noScrollView: true,
                header: {
                  title: "添加在校职务"
                }
              },
              ...navRightButton("save_addSchoolJobsBtn", "保存")
            }
            
          )
        );
      }
    }
  }

  componentWillUnmount() {
    // 刷新我的数据
    this.props.actions.getUserInfoAction();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {this.props.jobList.map(item => {
            return (
              <InSchoolJobItem
                key={item.id + ""}
                job={item}
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
                "添加在校职务",
                {
                  passProps: {
                    screen: () => <AddInSchoolJobsScreen />,
                    fullScreen: true,
                    noScrollView: true,
                    header: {
                      title: "添加在校职务"
                    }
                  },
                  ...navRightButton("save_addSchoolJobsBtn", "保存")
                }
                
              )
            );
          }}
        >
          <Text style={{ color: "#333", fontSize: CSS.textSize(32) }}>
            + 添加在校职务
          </Text>
        </SDTouchOpacity> */}
      </View>
    );
  }
}

type PropsJob = {
  job: schoolJobModel,
  onPressDeleteItem: ?Function
};
class InSchoolJobItem extends React.PureComponent<PropsJob> {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <View style={{ marginTop: 10, padding: 10, backgroundColor: "#fff" }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ color: "#333", fontSize: 14 }}>
              {this.props.job.start_date.slice(0, 7).replace(/-/, ".") +
                "-" +
                this.props.job.end_date.slice(0, 7).replace(/-/, ".")}
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
                  navScreen("PushScreen", "编辑在校职务", {
                    passProps: {
                      screen: () => <EditInSchoolJobsScreen job={this.props.job} />,
                      header: {
                        title: "编辑在校职务"
                      },
                      fullScreen: true,
                      noScrollView: true
                    },
                    ...navRightButton("edit_editInSchoolJob", "保存")
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
            {this.props.job.name}
          </Text>
        </View>

        <View style={{ marginTop: 5 }}>
          <Text style={{ color: "#999", fontSize: 12, lineHeight: 18 }}>
            {this.props.job.description}
          </Text>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user,
  jobList: state.userSchoolJobList
}))(ShowInSchoolJobsScreen);
