import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
import TitleWrap from "../../sd_employmentinfo/titlelistwarp/TitleWrap";
import TrendsList from "../../sd_trendsList/TrendsList";
import { navScreen } from "../../styles";
import RowSplitLine from "../../common/RowSplitLine";
import { CSS } from "../../common/SDCSS";
import { getUserBaseInfo } from "../../users/usersSelector";
import ConnectWithActions from "../../connectWithActions";
import ImageViewer from "react-native-image-zoom-viewer";
import {
  userBaseInfoModel,
  otherUserInfoModel,
  trendsModel
} from "../../types";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: CSS.pixel(30),
    borderRadius: CSS.pixel(10),
    overflow: "hidden"
  }
});

type Props = {
  userBaseInfo: userBaseInfoModel,
  otherUserInfo: otherUserInfoModel,
  trendsList: trendsModel[],
  otherUserTrendsList: trendsModel[]
};

// 我的主页 最新动态
class NewestTrends extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isShowImageViewer: false,
      imagesUrls: [],
      imageViewerIndex: 0,
      hasLoaded: false
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    otherId: PropTypes.number.isRequired
  };
  getHistoryContext() {
    return this;
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        hasLoaded: true
      })
    }, 100)
  }
  render() {
    let data =
      this.context.otherId === 0
        ? this.props.trendsList.results
        : this.props.otherUserTrendsList.results;
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
        try {
          settings = JSON.parse(this.props.otherUserInfo.settings);
        } catch (error) {
          settings = {};
        }
        
      }
    }
    return (
      <View
        style={{
          paddingHorizontal: CSS.pixel(30)
        }}
      >
        <View style={[styles.container]}>
          <Modal
            onRequestClose={() => {
              this.setState({
                isShowImageViewer: false
              });
            }}
            visible={this.state.isShowImageViewer}
            transparent={true}
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
          <TitleWrap
            leftIcon={() => (
              <Image source={require("@img/my/rank_ico_dynamic.png")} />
            )}
            title="最新动态"
            otherInfo="更多"
            direction=">"
            onPress={() => {
              this.props.switchTab && this.props.switchTab();
            }}
          />
          {this.context.otherId !== 0 && settings.dynamic !== true ? (
            <RowSplitLine content="对方设置动态暂不开放访问" />
          ) : data.length > 0 && this.state.hasLoaded ? (
            <TrendsList
              isTab1={true}
              getHistoryContext={this.getHistoryContext.bind(this)}
              time={
                data[0].created_time.slice(0, 10).replace(/-/g, ".") +
                " " +
                data[0].created_time.slice(11, 16)
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
              gender={
                this.context.otherId === 0
                  ? this.props.userBaseInfo.gender
                  : this.props.otherUserInfo.gender
              }
              content={data[0].content}
              images={data[0].images}
              bordered={false}
              userName={
                this.context.otherId === 0
                  ? this.props.userBaseInfo.name
                  : this.props.otherUserInfo.nickname
              }
            />
          ) : (
            <RowSplitLine content="暂无动态" />
          )}
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userBaseInfo: getUserBaseInfo(state),
  otherUserInfo: state.otherUserInfo,
  trendsList: state.trendsList,
  otherUserTrendsList: state.otherUserTrendsList
}))(NewestTrends);
