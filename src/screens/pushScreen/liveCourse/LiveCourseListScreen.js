import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import connectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";
import SDPullScrollView, {
  RefreshState
} from "../../../common/SDPullScrollView";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor, navScreen } from "../../../styles";
import LiveCourseDetailScreen from "./LiveCourseDetailScreen";

// 我的-职么课堂
class LiveCourseListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currState: RefreshState.Idle,
      liveCourseList: [],

      peerSize: 10,
      currPage: 1
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.refreshHeader();
  }

  fetchLiveData(params = {}, reset = false) {
    this.props.actions
      .getLiveListAction(params)
      .then(res => {
        this.state.liveCourseList = reset
          ? [].concat(res.results)
          : [].concat(this.state.liveCourseList).concat(res.results);
        if (res.count <= this.state.liveCourseList.length) {
          this.setState({
            currState: RefreshState.NoMoreData,
            peerSize: res.per_page,
            currPage: res.current_page
          });
        } else {
          this.setState({
            currState: RefreshState.Idle,
            peerSize: res.per_page,
            currPage: res.current_page
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
            size: this.state.peerSize
          },
          true
        );
      }
    );
  }

  _renderItem(item, index) {
    return <LiveCourseItem item={item} key={item ? item.id + "" : index + ""} />;
  }

  render() {
    return (
      <View
        style={{
          paddingHorizontal: CSS.pixel(30),
          paddingTop: CSS.pixel(30),
          backgroundColor: '#fff',
          flex: 1
        }}
      >
        <SDPullScrollView
          showsVerticalScrollIndicator={false}
          refreshState={this.state.currState}
          onFooterRefresh={this.refreshFooter.bind(this)}
          onHeaderRefresh={this.refreshHeader.bind(this)}
          renderItem={this._renderItem.bind(this)}
          data={this.state.liveCourseList}
          // keyExtractor={item => item.id + ""}
          style={{flex: 1, width: '100%', backgroundColor: '#fff'}}
        />
      </View>
    );
  }
}

export class LiveCourseItem extends React.PureComponent {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
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
            {item && item.image && item.image.url ? <Image
              style={{ width: "100%", height: CSS.pixel(300, true) }}
              resizeMode="cover"
              source={{ uri: item.image ? item.image.url + "?imageView2/2/h/300" : ""}}
            /> : null}
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
                  {item.name}
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
            <View>
              {item.price && (item.is_income == true) ? (
                <View style={{ flexDirection: "row" }}>
                {item.price ? <Text
                    style={{ color: "#FE8800", fontSize: CSS.textSize(40) }}
                  >
                    ¥
                  </Text> : null}
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: "DINCondensedC",
                      lineHeight: CSS.pixel(52),
                      color: "#FE8800",
                      fontSize: CSS.textSize(44),
                      fontWeight: "600"
                    }}
                  >
                    {item.price ? item.price : "免费"}
                  </Text>
                </View>
              ) : item.price && (item.is_income != true) ? (
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{ color: "#FE8800", fontSize: CSS.textSize(40) }}
                  >
                    ¥
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: "DINCondensedC",
                      lineHeight: CSS.pixel(52),
                      color: "#FE8800",
                      fontSize: CSS.textSize(44),
                      fontWeight: "600"
                    }}
                  >
                    {item.price}
                  </Text>
                </View>
              ) : (
                <Text
                  numberOfLines={1}
                  style={{
                    lineHeight: CSS.pixel(40),
                    color: "#FE8800",
                    fontSize: CSS.textSize(28),
                    fontWeight: "600"
                  }}
                >
                  免费
                </Text>
              )}
            </View>
            {item.is_income ? (
              <View>
                <Text
                  numberOfLines={1}
                  style={{
                    lineHeight: CSS.pixel(34),
                    color: "#FE8800",
                    fontSize: CSS.textSize(24)
                  }}
                >
                  {item.is_income ? "已参与" : ""}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </SDTouchOpacity>
    );
  }
}

export default connectWithActions((state, props) => ({}))(LiveCourseListScreen);
