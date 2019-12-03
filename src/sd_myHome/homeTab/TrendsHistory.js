import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  NativeModules,
  Modal,
  ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
import defaultStyle from "@styles";
import RowSplitLine from "../../common/RowSplitLine";
import ConnectWithActions from "../../connectWithActions";
import TitleWrap from "../../sd_employmentinfo/titlelistwarp/TitleWrap";
import TrendsList from "@src/sd_trendsList/TrendsList";
import { getUserBaseInfo } from "../../users/usersSelector";
import { CSS } from "../../common/SDCSS";
import ImageViewer from "react-native-image-zoom-viewer";
import SDUpPullScrollView, {
  RefreshState
} from "../../common/SDUpPullScrollView";
import { isIphoneX } from "../../utils/iphonex";
import SDPullScrollView from "../../common/SDPullScrollView";

const styles = StyleSheet.create({
  container: {
    // marginTop: CSS.pixel(30, true),
    flex: 1
  }
});

// 我的主页 历史动态
class TrendsHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadScrollHeight: false,
      scrollHeight: "100%",
      trendsList: [],
      refreshState: RefreshState.Idle,
      perSize: 10,

      isShowImageViewer: false,
      imagesUrls: [],
      imageViewerIndex: 0
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    otherId: PropTypes.number.isRequired
  };

  componentWillMount() {
    if (this.context.otherId === 0) {
      this.props.actions.getDynamicListAction({
        id: this.props.userBaseInfo.id,
        size: this.state.perSize
      });
    } else {
      this.props.actions.getOtherUserDynamicListAction({
        id: this.context.otherId,
        size: this.state.perSize
      });
    }
  }

  componentWillReceiveProps(next) {
    if (
      this.state.refreshState == RefreshState.Idle &&
      next.refreshState == RefreshState.FooterRefreshing
    ) {
      this.onFooterRefresh();
    }
  }

  getHistoryContext() {
    return this;
  }

  onHeaderRefresh() {
    this.setState({ refreshState: RefreshState.HeaderRefreshing }, () => {
      if (this.context.otherId === 0) {
        this.props.actions.getDynamicListAction(
          {
            id: this.props.userBaseInfo.id,
            size: this.state.perSize
          },
          res => {
            this.setState({
              refreshState: RefreshState.Idle
            });
          }
        );
      } else {
        this.props.actions.getOtherUserDynamicListAction(
          {
            id: this.context.otherId,
            size: this.state.perSize
          },
          res => {
            this.setState({
              refreshState: RefreshState.Idle
            });
          }
        );
      }
    });
  }
  onFooterRefresh() {
    if (this.context.otherId === 0) {
      if (this.props.trendsList.count <= this.props.trendsList.results.length) {
        this.setState({
          refreshState: RefreshState.NoMoreData
        });
        this.props.onFooterCallBack && this.props.onFooterCallBack(RefreshState.NoMoreData)
        return;
      }
    } else {
      if (
        this.props.otherUserTrendsList.count <=
        this.props.otherUserTrendsList.results.length
      ) {
        this.setState({
          refreshState: RefreshState.NoMoreData
        });

        this.props.onFooterCallBack && this.props.onFooterCallBack(RefreshState.NoMoreData)
        return;
      }
    }
    this.setState({ refreshState: RefreshState.FooterRefreshing }, () => {
      
      if (this.context.otherId === 0) {
        if (
          this.props.trendsList.results.length >= this.props.trendsList.count
        ) {
          this.setState({
            refreshState: RefreshState.NoMoreData
          });
          this.props.onFooterCallBack && this.props.onFooterCallBack(RefreshState.NoMoreData)
          return;
        }
        this.props.actions.getOffsetDynamicListAction(
          {
            id: this.props.userBaseInfo.id,
            size: this.state.perSize,
            // page: 2
            page: this.props.trendsList.current_page + 1
          },
          res => {
            this.setState({
              refreshState: RefreshState.Idle
            });
            this.props.onFooterCallBack && this.props.onFooterCallBack(RefreshState.Idle)
          }
        );
      } else {
        if (
          this.props.otherUserTrendsList.results.length >=
          this.props.otherUserTrendsList.count
        ) {
          this.setState({
            refreshState: RefreshState.NoMoreData
          });
          this.props.onFooterCallBack && this.props.onFooterCallBack(RefreshState.NoMoreData)
          return;
        }
        this.props.actions.getOtherUserOffsetDynamicListAction(
          {
            id: this.context.otherId,
            size: this.state.perSize,
            page: this.props.otherUserTrendsList.current_page + 1
          },
          res => {
            this.setState({
              refreshState: RefreshState.Idle
            });
            this.props.onFooterCallBack && this.props.onFooterCallBack(RefreshState.Idle)
          }
        );
      }
    });
  }
  _onLayout(e) {
    if (this.state.isLoadScrollHeight) {
      return;
    }

    NativeModules.UIManager.measure(
      e.target,
      (x, y, width, height, pageX, pageY) => {
        this.setState({
          scrollHeight: height - 40,
          isLoadScrollHeight: true
          // refreshState: RefreshState.Idle
        });
      }
    );
  }

  render() {
    let trendsList = [];
    if (this.context.otherId === 0) {
      trendsList = this.props.trendsList.results;
    } else {
      trendsList = this.props.otherUserTrendsList.results;
    }
    // 判断隐私设置
    let settings = {
      tasks: true,
      dynamic: true
    };
    if (this.context.otherId !== 0) {
      // 判断他人隐私是否不可看
      if (
        this.props.otherUserInfo.settings &&
        this.props.otherUserInfo.settings !== ""
      ) {
        settings = JSON.parse(this.props.otherUserInfo.settings);
      }
    }
    return (
      <View style={styles.container}>
        <Modal
          onRequestClose={() => {
            this.setState({
              isShowImageViewer: false
            });
          }}
          visible={this.state.isShowImageViewer}
          // transparent={true}
          transparent={false}
        >
          <ImageViewer
            enableSwipeDown={Platform.OS === "android" ? false : false}
            imageUrls={this.state.imagesUrls}
            index={this.state.imageViewerIndex}
            onClick={() => {
              this.setState({
                isShowImageViewer: false
              });
            }}
            saveToLocalByLongPress={false}
            // // Android, Platform.isTVOS返回

            loadingRender={() => (
              <View
                style={{
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <ActivityIndicator animating={true} />
              </View>
            )}
          />
        </Modal>
        {/* <TitleWrap
          title={`${this.context.otherId === 0 ? "我" : "TA"}的成长动态（${
            trendsList.length
          }）`}
          style={{
            paddingLeft: CSS.pixel(30),
            paddingRight: CSS.pixel(30),
            marginBottom: CSS.pixel(30, true)
          }}
          nomore={true}
        /> */}
        {this.context.otherId !== 0 && settings.dynamic !== true ? (
          <RowSplitLine content="对方设置动态暂不开放访问" />
        ) : trendsList.length > 0 ? (
          <SDPullScrollView
            scrollEnabled={false}
            // onLayout={this._onLayout.bind(this)}
            refreshState={this.state.refreshState}
            // onFooterRefresh={this.onFooterRefresh.bind(this)}
            // onHeaderRefresh={this.onHeaderRefresh.bind(this)}
            data={trendsList}
            style={{ height: this.state.scrollHeight }}
            renderItem={item => {
              if (this.props.hide) {
                return null;
              }
              return (
                <TrendsList
                  getHistoryContext={this.getHistoryContext.bind(this)}
                  key={item.id + ""}
                  time={
                    item.created_time.slice(0, 10).replace(/-/g, ".") +
                    " " +
                    item.created_time.slice(11, 16)
                  }
                  gender={
                    this.context.otherId === 0
                      ? this.props.userBaseInfo.gender
                      : this.props.otherUserInfo.gender
                  }
                  avatar={
                    this.context.otherId === 0
                      ? this.props.userBaseInfo.avatar
                        ? this.props.userBaseInfo.avatar.url
                        : null
                      : this.props.otherUserInfo.avatar
                        ? this.props.otherUserInfo.avatar.url
                        : null
                  }
                  content={item.content}
                  images={item.images}
                  userName={
                    this.context.otherId === 0
                      ? this.props.userBaseInfo.name
                      : this.props.otherUserInfo.nickname
                  }
                /> 
              );
            }}
          />
        ) : (
          <RowSplitLine content="暂无动态" />
        )}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userBaseInfo: getUserBaseInfo(state),
  trendsList: state.trendsList,
  otherUserInfo: state.otherUserInfo,
  otherUserTrendsList: state.otherUserTrendsList
}))(TrendsHistory);
