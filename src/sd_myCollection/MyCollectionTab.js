import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  FlatList,
  RefreshControl,
  Image
} from "react-native";
import PropTypes from "prop-types";
import LabelInput from "../common/SDLabelInput";
import { antdTabsConfig } from "@styles";
import SDSafeArea from "../common/SDSafeArea";
import { Tabs } from "antd-mobile";
import { Toast, Modal } from "antd-mobile";
import { CSS } from "../common/SDCSS";
import ConnectWithActions from "../connectWithActions";
import SDTouchList from "../common/SDTouchList";
import ListItem from "../sd_directinfo/infolist/ListItem";
import { Popup } from "../common/index";
import SchoolDetail from "../screens/pushScreen/searchData/tabs/SchoolDetail";
import JobDetail from "../screens/pushScreen/searchData/tabs/JobDetail";
import IndustryDetail from "../screens/pushScreen/searchData/tabs/IndustryDetail";
import MajorDetail from "../screens/pushScreen/searchData/tabs/MajorDetail";
import { navLightBox } from "@styles";
import SDTabs2 from "../sd_components/SDTabs2";
import { navScreen } from "../styles";
import SDPullScrollView, { RefreshState } from "../common/SDPullScrollView";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#efefef"
  },

  bottomTab: {
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 49,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc"
  },
  singleLine: {
    width: 1,
    height: 30,
    borderLeftWidth: 1,
    borderColor: "#eee"
  }
});

// const selectedIcon = require("@img/my/TrackRecord/mine_Resume_ico_Select.png");
// const selectNorIcon = require("@img/my/TrackRecord/mine_Resume_ico_Unselected.png");

const selectedIcon = require("@img/grow/growing_btn_MoRen.png");
const selectNorIcon = require("@img/grow/growing_btn_FeiMoRen.png");

// type State = {
//   collectInfoData: NewsSimpleModel[],
//   currPage: number,
//   isNeedCheckTab1: boolean,
//   isRefreshingTab1: boolean,
//   checkedArr1: NewsSimpleModel[],
//   isRefreshingTab2: boolean
// }
// 我的收藏Tab
class MyCollectionTab extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currPage: 0,

      isNeedCheckTab1: false,
      refreshState1: RefreshState.Idle,
      currPage1: 1,
      count1: 0,
      perPage1: 10,
      checkedArr1: [],

      isNeedCheckTab2: false,
      currPage2: 1,
      count2: 0,
      perPage2: 10,
      refreshState2: RefreshState.Idle,
      checkedArr2: [],

      collectInfoData: [],
      recordInfoData: []
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentWillMount() {
    this.props.actions
      .getLikeRecordAction({
        size: this.state.perPage2
      })
      .then(res => {
        if(res && res.status == 'ok') {
          this.setState({
            recordInfoData: res.results,
            count2: res.count,
            perPage2: res.per_page,
            currPage2: res.current_page,
            refreshState2: res.results.length >= res.count ? RefreshState.NoMoreData : RefreshState.Idle
          });
        } else {
          this.setState({
            refreshState2: RefreshState.Idle
          });
        }
      });
    this.props.actions.getLikeNewsAction(
      {
        size: this.state.perPage1
      }).then(res => {
        if(res && res.status == 'ok') {
          this.setState({
            collectInfoData: res.results,
            count1: res.count,
            perPage1: res.per_page,
            currPage1: res.current_page,
            refreshState1: res.results.length >= res.count ? RefreshState.NoMoreData : RefreshState.Idle
          });
        } else {
          this.setState({
            refreshState1: RefreshState.Idle
          });
        }
      }
    );
  }

  componentDidMount() {
    this.context.refs["g_collectTab"] = this;
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "collect_manage"
    );
  }

  componentWillUnmount() {
    if (this.context.refs["g_collectTab"]) {
      delete this.context.refs["g_collectTab"];
    }
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "collect_manage") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        if (this.state.currPage == 0) {
          if (this.state.collectInfoData.length <= 0) {
            return;
          }
          this.setState({
            isNeedCheckTab1: !this.state.isNeedCheckTab1
          });
        } else {
          if (this.state.recordInfoData.length <= 0) {
            return;
          }
          this.setState({
            isNeedCheckTab2: !this.state.isNeedCheckTab2
          });
        }
      }
    }
  }

  _renderItem(item, index) {
    return (
      <ListItem
        key={index + ""}
        data={item}
        onCheckItem={this._onTab1ItemChecked.bind(this, index)}
        isNeedCheck={this.state.isNeedCheckTab1}
        isCheck={
          this.state.checkedArr1.filter(c => c.id == item.id).length > 0
            ? true
            : false
        }
      />
    );
  }

  _onTab1ItemChecked(index, checked, data) {
    // console.log(index, data, checked)

    if (checked) {
      let newCheckedArr1 = [].concat(this.state.checkedArr1);
      newCheckedArr1.push(data);
      this.setState({
        checkedArr1: newCheckedArr1
      });
    } else {
      let newCheckedArr1 = this.state.checkedArr1.filter(c => c.id != data.id);
      this.setState({
        checkedArr1: newCheckedArr1
      });
    }
  }

  _onTab2ItemChecked(index, checked, data) {
    // console.log(index, data, checked)

    if (checked) {
      let newCheckedArr2 = [].concat(this.state.checkedArr2);
      newCheckedArr2.push(data);
      this.setState({
        checkedArr2: newCheckedArr2
      });
    } else {
      let newCheckedArr2 = this.state.checkedArr2.filter(c => c.id != data.id);
      this.setState({
        checkedArr2: newCheckedArr2
      });
    }
  }

  _onRefreshTab1() {
    this.setState({ refreshState1: RefreshState.HeaderRefreshing });

    this.props.actions
      .getLikeNewsAction({
        size: this.state.perPage1
      })
      .then(res => {
        if(res && res.status == 'ok') {
          this.setState({
            collectInfoData: res.results,
            refreshState1: res.results.length >= res.count ? RefreshState.NoMoreData : RefreshState.Idle,
            count1: res.count,
            perPage1: res.per_page,
            currPage1: res.current_page
          });
        } else {
          this.setState({
            refreshState1: RefreshState.Idle,
          });
        }
      }).catch(err => {});
  }

  _onRefreshTab1Footer() {
    if (this.state.collectInfoData.length < this.state.count1) {
      this.setState({
        refreshState1: RefreshState.FooterRefreshing
      });
      // 计算当前页码
      let pageIndex = parseInt(
        this.state.collectInfoData.length / this.state.perPage1
      );
      let offsetNum = this.state.collectInfoData.length % this.state.perPage1;
      this.props.actions
        .getLikeNewsAction({
          size: this.state.perPage1,
          page: pageIndex + 1
        })
        .then(res => {
          if(res && res.status == 'ok') {
            let newData = offsetNum
              ? this.state.collectInfoData.slice(0, -offsetNum).concat(res.results)
              : this.state.collectInfoData.concat(res.results);
            this.setState({
              collectInfoData: newData,
              count1: res.count,
              perPage1: res.per_page,
              currPage1: res.current_page,
              refreshState1:
                newData.length >= res.count
                  ? RefreshState.NoMoreData
                  : RefreshState.Idle
            });
          } else {
            this.setState({
              refreshState1: RefreshState.Idle
            });
          }
        })
        .catch(err => {});
    }
  }

  _onRefreshTab2() {
    this.setState({ refreshState2: RefreshState.HeaderRefreshing });

    this.props.actions
      .getLikeRecordAction(
        {
          size: this.state.perPage2
        },
        res => {}
      )
      .then(res => {
        if(res && res.status == 'ok') {
          this.setState({
            recordInfoData: res.results,
            refreshState2: res.results.length >= res.count ? RefreshState.NoMoreData : RefreshState.Idle,
            count2: res.count,
            perPage2: res.per_page,
            currPage2: res.current_page
          });
        } else {
          this.setState({
            refreshState2: RefreshState.Idle,
          })
        }
      })
      .catch(err => {});
  }

  _onRefreshTab2Footer() {
    if (this.state.recordInfoData.length < this.state.count2) {
      this.setState({
        refreshState2: RefreshState.FooterRefreshing
      });
      // 计算当前页码
      let pageIndex = parseInt(
        this.state.recordInfoData.length / this.state.perPage2
      );
      let offsetNum = this.state.recordInfoData.length % this.state.perPage2;
      this.props.actions
        .getLikeRecordAction({
          size: this.state.perPage2,
          page: pageIndex + 1
        })
        .then(res => {
          if(res && res.status == 'ok') {
            let newData = offsetNum
              ? this.state.recordInfoData.slice(0, -offsetNum).concat(res.results)
              : this.state.recordInfoData.concat(res.results);
            this.setState({
              recordInfoData: newData,
              count2: res.count,
              perPage2: res.per_page,
              currPage2: res.current_page,
              refreshState2:
                newData.length >= res.count
                  ? RefreshState.NoMoreData
                  : RefreshState.Idle
            });
          } else {
            this.setState({
              refreshState2: RefreshState.Idle
            });
          }
        })
        .catch(err => {});
    }
  }

  onPressRecordItem(item) {
    //searcher_school| searcher_major| searcher_job| searcher_profession
    Toast.loading("加载中");
    if (item.type == "searcher_school") {
      this.context.navigator.push(
        navScreen("PushScreen", "数据查询", {
          passProps: {
            screen: () => (
              <SchoolDetail
                is_liked={true}
                id={item.id}
                type={item.type}
                schoolText={item.content}
              />
            ),
            fullScreen: true,
            noScrollView: true
          }
        })
      );
    } else if (item.type == "searcher_major") {
      this.context.navigator.push(
        navScreen("PushScreen", "数据查询", {
          passProps: {
            screen: () => (
              <MajorDetail
                is_liked={true}
                id={item.id}
                type={item.type}
                majorText={item.content}
              />
            ),
            fullScreen: true,
            noScrollView: true
          }
        })
      );
    } else if (item.type == "searcher_job") {
      this.context.navigator.push(
        navScreen("PushScreen", "数据查询", {
          passProps: {
            screen: () => (
              <JobDetail
                is_liked={true}
                id={item.id}
                type={item.type}
                jobText={item.content}
              />
            ),
            fullScreen: true,
            noScrollView: true
          }
        })
      );
    } else if (item.type == "searcher_profession") {
      let id = null;
      try {
        if(item.value && (item.value + "").indexOf("tree") >= 0) {
          id = (item.value + "").split('-')[1];
        } else {
          id = item.value;
        }
      } catch (error) {
        
      }
      this.context.navigator.push(
        navScreen("PushScreen", "数据查询", {
          passProps: {
            screen: () => (
              <IndustryDetail
                is_liked={true}
                id={item.id}
                type={item.type}
                industryText={item.content}
                industryId={Math.abs(parseInt(id))}
                // industryId={parseInt(item.id)}
              />
            ),
            fullScreen: true,
            noScrollView: true
          }
        })
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
        <View style={{ flex: 1 }}>
          <SDTabs2
            noChange
            tabTitles={["内容", "数据报告"]}
            page={this.state.currPage}
            underLineWidth={CSS.pixel(60)}
            onChangeTab={index => {
              if (this.state.currPage == 0 && this.state.isNeedCheckTab1) {
                return;
              } else if (
                this.state.currPage == 1 &&
                this.state.isNeedCheckTab2
              ) {
                return;
              } else {
                this.setState({
                  currPage: index
                });
              }
            }}
            activeColor={"#333333"}
            inActiveColor={"#999"}
            style={{
              backgroundColor: "#fff",
              flex: 1,
              width: Dimensions.get("window").width
            }}
            tabContentStyle={{
              minHeight: 0,
              paddingTop: 0,
              flex: 1
            }}
          >
            {this.state.collectInfoData.length <= 0 ? (
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#f3f3f3",
                  justifyContent: "center",
                  alignItems: "center",
                  width: Dimensions.get("window").width
                }}
              >
                <Image
                  source={require("@img/my/default_page_no_collection.png")}
                />
                <View style={{ marginTop: 10 }}>
                  <Text style={{ color: "#999", fontSize: 14 }}>暂无收藏</Text>
                </View>
              </View>
            ) : (
              // <FlatList
              //   style={{
              //     backgroundColor: "#efefef"
              //   }}
              //   refreshControl={
              //     <RefreshControl
              //       refreshing={this.state.isRefreshingTab1}
              //       onRefresh={this._onRefreshTab1.bind(this)}
              //       tintColor="#999"
              //       title="加载中..."
              //       titleColor="#999"
              //       colors={["#999", "#00ff00", "#0000ff"]}
              //       progressBackgroundColor="#ffffff"
              //     />
              //   }
              //   ref={flatList => (this._flatList = flatList)}
              //   renderItem={this._renderItem.bind(this)}
              //   data={this.state.collectInfoData}
              //   keyExtractor={item => "" + item.id}
              // />
              <SDPullScrollView
                onFooterRefresh={this._onRefreshTab1Footer.bind(this)}
                onHeaderRefresh={this._onRefreshTab1.bind(this)}
                data={this.state.collectInfoData}
                style={{ flex: 1, backgroundColor: "#fff" }}
                refreshState={this.state.refreshState1}
                renderItem={this._renderItem.bind(this)}
              />
            )}
            {this.state.recordInfoData.length <= 0 ? (
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#f3f3f3",
                  justifyContent: "center",
                  alignItems: "center",
                  width: Dimensions.get("window").width
                }}
              >
                <Image
                  source={require("@img/my/default_page_no_collection.png")}
                />
                <View style={{ marginTop: 10 }}>
                  <Text style={{ color: "#999", fontSize: 14 }}>暂无收藏</Text>
                </View>
              </View>
            ) : (
              <SDPullScrollView
                style={{ flex: 1 }}
                refreshState={this.state.refreshState2}
                onFooterRefresh={this._onRefreshTab2Footer.bind(this)}
                onHeaderRefresh={this._onRefreshTab2.bind(this)}
                data={this.state.recordInfoData}
                header={
                  this.state.recordInfoData.length > 0
                    ? () => {
                        return (
                          <View
                            style={{
                              height: 1,
                              backgroundColor: "#efefef",
                              width: "100%"
                            }}
                          />
                        );
                      }
                    : () => null
                }
                renderItem={(item, index) => {
                  return (
                    <SDTouchList
                      isNeedCheck={this.state.isNeedCheckTab2}
                      checked={
                        this.state.checkedArr2.filter(c => c.id == item.id)
                          .length > 0
                          ? true
                          : false
                      }
                      title={
                        item.type === "searcher_school"
                          ? item.content + "就业薪资增长趋势"
                          : item.type === "searcher_major"
                            ? item.content + "就业领域分布"
                            : item.type === "searcher_job"
                              ? item.content + "职位就业公司分布"
                              : item.content + "行业深造情况分布"
                      }
                      key={index + ""}
                      data={item}
                      onPress={this.onPressRecordItem.bind(this, item)}
                      onPressCheckItem={this._onTab2ItemChecked.bind(
                        this,
                        index
                      )}
                    />
                  );
                }}
              />
            )}
          </SDTabs2>
        </View>

        {this.state.isNeedCheckTab1 ? (
          <View style={styles.bottomTab}>
            <View
              style={{
                flex: 1,
                paddingLeft: CSS.pixel(30)
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (
                    this.state.checkedArr1.length ==
                    this.state.collectInfoData.length
                  ) {
                    this.setState({
                      checkedArr1: []
                    });
                  } else {
                    this.setState({
                      checkedArr1: this.state.collectInfoData
                    });
                  }
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={{ width: CSS.pixel(36), height: CSS.pixel(36) }}
                    source={
                      this.state.checkedArr1.length ==
                      this.state.collectInfoData.length
                        ? selectedIcon
                        : selectNorIcon
                    }
                  />
                  <Text style={{ color: "#999", marginLeft: 4 }}>全选</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                paddingVertical: CSS.pixel(12, true),
                paddingHorizontal: CSS.pixel(30),
                borderColor: "#efefef",
                borderRadius: 3,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={() => {
                this.setState({
                  isNeedCheckTab1: false,
                  checkedArr1: []
                });
              }}
            >
              <Text style={{ color: "#999", fontSize: 16 }}>取消</Text>
            </TouchableOpacity>
            {/* {Platform.OS == "android" ? null : (
              <View style={styles.singleLine} />
            )} */}
            <TouchableOpacity
              style={{
                backgroundColor: "#fc8824",
                borderColor: "#fc8824",
                borderWidth: 1,
                borderRadius: 3,
                paddingVertical: CSS.pixel(12, true),
                paddingHorizontal: CSS.pixel(30),
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: CSS.pixel(30)
              }}
              onPress={() => {
                if (this.state.checkedArr1.length == 0) {
                  Toast.fail("请先选择要删除的收藏");
                  return;
                }
                navLightBox("ConfirmLightBoxScreen", {
                  passProps: {
                    title: "你确定要删除?",
                    onOk: () => {
                      Toast.loading("删除中");
                      let checked1 = [];
                      const q = this.state.checkedArr1.map(item => {
                        checked1.push(item.id);
                        return new Promise((ret, rej) => {
                          this.props.actions.addToFavAction(
                            {
                              id: item.id
                            },
                            res => {
                              ret();
                            }
                          );
                        });
                      });

                      this.state.collectInfoData = [].concat(
                        this.state.collectInfoData.filter(c => {
                          return checked1.indexOf(c.id) < 0 ? true : false;
                        })
                      );

                      Promise.all(q).then(values => {
                        Toast.hide();
                        this.setState({
                          checkedArr1: [],
                          isNeedCheckTab1: false
                        });

                        // 获取当前还有多少数据
                        this.props.actions
                          .getLikeNewsAction({ size: 1 }, () => null)
                          .then(res => {
                            if(res && res.status == 'ok') {
                              this.setState({
                                count1: res.count
                              });
                            } else {
                              this.setState({
                                count1: 0
                              });
                            }
                            
                          });
                      });
                    }
                  }
                });
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>删除</Text>
            </TouchableOpacity>
          </View>
        ) : this.state.isNeedCheckTab2 ? (
          <View style={styles.bottomTab}>
            <View
              style={{
                flex: 1,
                paddingLeft: CSS.pixel(30)
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (
                    this.state.checkedArr2.length ==
                    this.state.recordInfoData.length
                  ) {
                    this.setState({
                      checkedArr2: []
                    });
                  } else {
                    this.setState({
                      checkedArr2: this.state.recordInfoData
                    });
                  }
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={{ width: CSS.pixel(36), height: CSS.pixel(36) }}
                    source={
                      this.state.checkedArr2.length ==
                      this.state.recordInfoData.length
                        ? selectedIcon
                        : selectNorIcon
                    }
                  />
                  <Text style={{ color: "#999", marginLeft: 4 }}>全选</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                paddingVertical: CSS.pixel(12, true),
                paddingHorizontal: CSS.pixel(30),
                borderColor: "#efefef",
                borderWidth: 1,
                borderRadius: 3,
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={() => {
                this.setState({
                  isNeedCheckTab2: false,
                  checkedArr2: []
                });
              }}
            >
              <Text style={{ color: "#999", fontSize: 16 }}>取消</Text>
            </TouchableOpacity>
            {/* {Platform.OS == "android" ? null : (
              <View style={styles.singleLine} />
            )} */}
            <TouchableOpacity
              style={{
                backgroundColor: "#fc8824",
                borderColor: "#fc8824",
                borderWidth: 1,
                paddingVertical: CSS.pixel(12, true),
                paddingHorizontal: CSS.pixel(30),
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 3,
                marginHorizontal: CSS.pixel(30)
              }}
              onPress={() => {
                if (this.state.checkedArr2.length == 0) {
                  Toast.fail("请先选择要删除的收藏");
                  return;
                }

                navLightBox("ConfirmLightBoxScreen", {
                  passProps: {
                    title: "你确定要删除?",
                    onOk: () => {
                      Toast.loading("删除中");
                      let checked2 = [];
                      const q = this.state.checkedArr2.map(item => {
                        checked2.push(item.id);
                        return new Promise((ret, rej) => {
                          this.props.actions.toggleLikeRecordAction(
                            item.id,
                            {},
                            res => {
                              ret();
                            }
                          );
                        });
                      });

                      this.state.recordInfoData = [].concat(
                        this.state.recordInfoData.filter(c => {
                          return checked2.indexOf(c.id) < 0 ? true : false;
                        })
                      );

                      Promise.all(q).then(values => {
                        Toast.hide();
                        this.setState({
                          checkedArr2: [],
                          isNeedCheckTab2: false
                        });

                        // 获取当前还有多少数据
                        this.props.actions
                          .getLikeRecordAction({ size: 1 }, () => null)
                          .then(res => {
                            if(res && res.status == 'ok') {
                              this.setState({
                                count2: res.count
                              });
                            } else {
                              this.setState({
                                count2: 0
                              });
                            }
                          });
                      });
                    }
                  }
                });
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>删除</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(MyCollectionTab);
