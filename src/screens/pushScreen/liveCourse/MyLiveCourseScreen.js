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
import { SDMainColor, navScreen, navLightBox } from "../../../styles";
import IMChatctcScreen from "../imchat/IMChatctcScreen";
import SDPullScrollView, {
  RefreshState
} from "../../../common/SDPullScrollView";
import LiveCourseDetailScreen from "./LiveCourseDetailScreen";
import FilterMyCourseMenu from "./FilterMyCourseMenu";
import CourseBuyLightBox from "./CourseBuyLightBox";
import MoreCommentScreen from "./MoreCommentScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

// 我的-我的课程界面
class MyLiveCourseScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      currState: RefreshState.Idle,
      courseList: [],

      peerSize: 10,
      currPage: 1,

      currFilterState: "",

      hasFetch: false
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null,
    refs: () => null
  };

  componentDidMount() {
    this.refreshHeader();
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "filter_my_course"
    );
  }

  componentWillUnmount() {
    // 获取新的带评论数
    this.context.refs && this.context.refs["personScreen"] && this.context.refs["personScreen"].refreshNoCommentCount && 
    this.context.refs["personScreen"].refreshNoCommentCount();
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "filter_my_course") {
        navLightBox(
          "LightBoxScreen",
          {
            passProps: {
              screen: () => (
                <FilterMyCourseMenu getListCourse={this.getListCourse.bind(this)} type={this.state.currFilterState} />
              ),
              tapBackgroundToDismiss: false
            }
          },
          {
            backgroundColor: "transparent"
          }
        );
      }
    }
  }

  getListCourse() {
    return this;
  }

  fetchLiveData(params = {}, reset = false) {
    this.props.actions
      .getStudentBoughtListAction({
        type: this.state.currFilterState,
        ...params
      })
      .then(res => {
        if(res && res.status == 'ok') {
          this.state.courseList = reset
            ? [].concat(res.results)
            : [].concat(this.state.courseList).concat(res.results);
          if (res.count <= this.state.courseList.length) {
            this.setState({
              currState: RefreshState.NoMoreData,
              peerSize: res.per_page,
              currPage: res.current_page,
              hasFetch: true
            });
          } else {
            this.setState({
              currState: RefreshState.Idle,
              peerSize: res.per_page,
              currPage: res.current_page,
              hasFetch: true
            });
          }
        } else {
          this.setState({
            currState: RefreshState.Idle,
            hasFetch: true
          });
        }
      })
      .catch(err => {});
  }

  refreshFooter() {
    if (this.state.currState == RefreshState.NoMoreData || this.state.currState == RefreshState.HeaderRefreshing || this.state.currState == RefreshState.FooterRefreshing) {
      return;
    }
    this.setState(
      {
        currState: RefreshState.FooterRefreshing
      },
      () => {
        this.fetchLiveData({
          page: this.state.currPage + 1,
          size: this.state.peerSize
        });
      }
    );
  }

  refreshHeader() {
    if (this.state.currState == RefreshState.HeaderRefreshing || this.state.currState == RefreshState.FooterRefreshing) {
      return;
    }
    this.setState(
      {
        currState: RefreshState.HeaderRefreshing
      },
      () => {
        this.fetchLiveData(
          {
            page: 1,
            size: this.state.peerSize,
          },
          true
        );
      }
    );
  }

  getDetailThis() {
    return this;
  }

  fetNewData() {
    this.refreshHeader();
  }

  _renderItem(item, index) {
    return <LiveCourseItem getDetailThis={this.getDetailThis.bind(this)} item={item} key={item && item.id ? item.id + "" : ""} />;
  }

  render() {
    return (
      <View
        style={{
          paddingHorizontal: this.state.courseList.length > 0 ? CSS.pixel(30) : 0,
          paddingTop: this.state.courseList.length > 0 ? CSS.pixel(30) : 0,
          backgroundColor: '#fff',
          flex: 1
        }}
      >
        {
          this.state.courseList.length == 0 && this.state.hasFetch ?
          (<View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#f3f3f3'}}>
              <View>
                <Image source={require("@img/imchat/course/mine_pic_Invalid.png")}/>
              </View>
              <View style={{marginTop: CSS.pixel(76), alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: '#333', fontSize: CSS.textSize(32)}}>暂无课程</Text>
              </View>
              {/* <View style={{marginTop: CSS.pixel(20), justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#999', fontSize: CSS.textSize(28)}}>由于课程某些言论不合规，已失效，请谅解。</Text>
              </View> */}
          </View>)
          :
          <SDPullScrollView
            showsVerticalScrollIndicator={false}
            refreshState={this.state.currState}
            onFooterRefresh={this.refreshFooter.bind(this)}
            onHeaderRefresh={this.refreshHeader.bind(this)}
            renderItem={this._renderItem.bind(this)}
            data={this.state.courseList}
            // keyExtractor={item => item.id + ""}
            style={{flex: 1, width: '100%', backgroundColor: '#fff'}}
          />
      }
      </View>
    )
  }
}

export default ConnectWithActions((state, props) => ({}))(MyLiveCourseScreen);

export class LiveCourseItem extends React.PureComponent {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  getContext() {
    return this.context;
  }
  renderBtn(item) {
    // 如果是失效的课程
    // 则不需要按钮
    // if(!item.is_valid) {
    //   return null;
    // }
    
    // 支付失败的
    // 需要重新支付
    if(!item) {
      return null;
    }
    
    if(item.is_income == false) {
      return (
        <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
          {item.is_valid && 
          <SDTouchOpacity onPress={() => {
            navLightBox("LightBoxScreen", {
              passProps: {
                screen: () => <CourseBuyLightBox getDetailThis={this.props.getDetailThis} getContext={this.getContext.bind(this)} liveData={item}/>
              }
            }, {
              backgroundColor: 'transparent'
            });
          }} style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: CSS.pixel(14), paddingVertical: CSS.pixel(6), borderRadius: CSS.pixel(22), borderWidth: 1, borderColor: '#FE8900'}}>
            <Text style={{color: '#FE8900', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>重新支付</Text>
          </SDTouchOpacity>
          }

          {
            item.price ? 
            <View>
              <Text style={{color: '#fe8900', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>需支付：¥{item.price}</Text>
            </View> : null
            }
        </View>
      )
    } else if(item.end_time || item.status == '已结束') {
      // 课程已经结束
      // 判断是否需要评论
      if (item.is_comment == true) {
        // 已经评论了
        // 查看评论
        // 判断是否免费的
        return (
          <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
            {/* <SDTouchOpacity onPress={() => {
              this.context.navigator.push(navScreen("PushScreen", "课程评价", {
                passProps: {
                  screen: () => <MoreCommentScreen isNeedComment={false} liveData={item}/>,
                    noScrollView: true,
                    fullScreen: true,
                    header: {
                      title: "课程评价"
                    }
                  }
              }))
            }} style={{marginTop: item.price ? CSS.pixel(26) : 0, justifyContent: 'center', alignItems: 'center', paddingHorizontal: CSS.pixel(14), paddingVertical: CSS.pixel(6), borderRadius: CSS.pixel(22), borderWidth: 1, borderColor: SDMainColor}}>
              <Text style={{color: SDMainColor, fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>查看评论</Text>
            </SDTouchOpacity> */}
            {
              item.price ? 
              <View style={{marginTop: CSS.pixel(32),}}>
                <Text style={{color: '#fe8900', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>已成功支付：¥{item.price}</Text>
              </View> : null
            }
          </View>
        )
      } else {
        // 立即评论
        // 判断是否免费的
        return (<View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
            {item.is_valid && 
            <SDTouchOpacity onPress={() => {
              this.context.navigator.push(navScreen("PushScreen", "课程评价", {
                passProps: {
                  screen: () => <MoreCommentScreen getDetailThis={this.props.getDetailThis} isNeedComment={true} liveData={item}/>,
                    noScrollView: true,
                    fullScreen: true,
                    header: {
                      title: "课程评价"
                    }
                  }
              }))
            }} style={{flexDirection: 'row', marginTop: item.price ? CSS.pixel(26) : 0, justifyContent: 'center', alignItems: 'center', paddingHorizontal: CSS.pixel(14), paddingVertical: CSS.pixel(6), borderRadius: CSS.pixel(22), borderWidth: 1, borderColor: SDMainColor}}>
              <Image source={require("@img/my/TrackRecord/mine_Resume_ico_edit.png")}/>
              <Text style={{color: SDMainColor, fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34), marginLeft: CSS.pixel(8)}}>评价</Text>
            </SDTouchOpacity>
            }
            {
              item.price ? 
              <View style={{marginTop: CSS.pixel(32)}}>
                <Text style={{color: '#fe8900', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>已成功支付：¥{item.price}</Text>
              </View> : null
            }
          </View>)
      }
    } else {
      return (<View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
          {
            item.price ? 
            <View>
              <Text style={{color: '#fe8900', fontSize: CSS.textSize(30), fontWeight: '600', lineHeight: CSS.pixel(34)}}>已成功支付：¥{item.price}</Text>
            </View> : <View>
              <Text style={{color: '#fe8900', fontSize: CSS.textSize(30), fontWeight: '600', lineHeight: CSS.pixel(34)}}>免费</Text>
            </View>
          }
        </View>)
    }
  }
  
  render() {
    const { item, style } = this.props;
    if(!item) {
      return null;
    }
    return (
      <SDTouchOpacity
        style={[{ marginBottom: CSS.pixel(40), flex: 1}, style]}
        onPress={() => {
          this.context.navigator.push(
            navScreen("PushScreen", "课程详情", {
              passProps: {
                screen: () => <LiveCourseDetailScreen liveData={item} />,
                fullScreen: true,
                noScrollView: true,
                saveBg: SDMainColor,
              }
            })
          );
        }}
      >
        <View
          style={{
            width: "100%",
            height: CSS.pixel(300, true),
            borderRadius: 5,
            overflow: "hidden"
          }}
        >
          <View>
            <Image
              style={{ width: "100%", height: CSS.pixel(300, true) }}
              resizeMode="cover"
              source={{ uri: item.image ? item.image.url + "?imageView2/2/h/690" : ""}}
            />
          </View>
          <View
            style={{
              paddingHorizontal: CSS.pixel(10),
              justifyContent: "center",
              alignItems: "center",
              height: CSS.pixel(40),
              position: "absolute",
              left: 0,
              top: CSS.pixel(20),
              backgroundColor: "#333",
              borderBottomRightRadius: 10,
              borderTopRightRadius: 10
            }}
          >
            <Text style={{ color: SDMainColor, fontSize: CSS.textSize(20) }}>
              {item.category_name}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <View style={{ marginTop: CSS.pixel(10), flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    lineHeight: CSS.pixel(42),
                    color: "#333",
                    fontSize: CSS.textSize(30),
                    fontWeight: "600"
                  }}
                >
                  {item.name || item.category_name}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    lineHeight: CSS.pixel(34),
                    color: "#999",
                    fontSize: CSS.textSize(24),
                    fontWeight: "600"
                  }}
                >
                  {item.teacher_name}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
            <View style={{flex: 1}}>
              {this.renderBtn(item)}
            </View>
          </View>
        </View>
      </SDTouchOpacity>
    );
  }
}