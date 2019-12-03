/* @flow */
import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ViewPropTypes,
  Platform,
  ScrollView,
  RefreshControl
} from "react-native";

export const RefreshState = {
  Idle: 0,
  HeaderRefreshing: 1,
  FooterRefreshing: 2,
  NoMoreData: 3,
  Failure: 4,
  EmptyData: 5
};
  
type Props = {
  refreshState: number,
  onHeaderRefresh: Function,
  onFooterRefresh?: Function,

  footerContainerStyle?: ViewPropTypes.style,
  footerTextStyle?: ViewPropTypes.style,
  footerRefreshingText?: string,
  footerFailureText?: string,
  footerNoMoreDataText?: string,
  footerEmptyDataText?: string,

  renderItem: Function,
  data: Array<any>,
  listRef?: any
};

type State = {};

let lastTime = new Date().getTime();
let isFetchFooter = false;

class SDScrollView extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      // 是否已经依据动量对EndReached事件进行响应
      onEndReachedCalledDuringMomentum: true,
      // 刷新状态
      refreshState: RefreshState.Idle,
      isHeaderRefreshing: false
    }
  }
  static defaultProps = {
    footerRefreshingText: "数据加载中…",
    footerFailureText: "点击重新加载",
    footerNoMoreDataText: "已加载全部数据",
    footerEmptyDataText: "暂时没有相关数据"
  };
  setRefreshState = (state) => {
    this.setState({
      refreshState: state
    })
  }
  init = ({noMoreData, count}) => {
    this.setState({
      refreshState: count === 0 ? RefreshState.EmptyData : noMoreData ? RefreshState.NoMoreData : RefreshState.Idle
    })
  }

  shouldStartHeaderRefreshing = () => {
    if (
    this.state.refreshState == RefreshState.HeaderRefreshing ||
      this.state.refreshState == RefreshState.FooterRefreshing
    ) {
      return false;
    }
    return true;
  };

  shouldStartFooterRefreshing = () => {
    const { refreshState } = this.state;
    // let { data } = this.props;
    // if (data.length == 0) {
    //   return false;
    // }
    if(this.state.onEndReachedCalledDuringMomentum) {
      return false
    }

    return refreshState == RefreshState.Idle || refreshState == RefreshState.Failure || refreshState == RefreshState.EmptyData;
  };
  
  /**
   * 监听滚动事件
   */
  _onScroll = (event) => {
    if(this.state.refreshState !== RefreshState.Idle || this.state.onEndReachedCalledDuringMomentum){
      return;
    }
    let y = event.nativeEvent.contentOffset.y;
    let height = event.nativeEvent.layoutMeasurement.height;
    let contentHeight = event.nativeEvent.contentSize.height;
    console.log('ly88', '_onScroll', y )
    // 优化android没有添加bounce时，不会刷新
    if(y + height >= contentHeight + (Platform.OS === 'android' ? (-30) : 5)){
      this._onFooterRefresh()
    }
  }
  // 加载更多
  _onFooterRefresh = () => {
    if(!this.shouldStartFooterRefreshing()) {
      return
    }
    console.log('ly88', '_onFooterRefresh')
    this.setState({
      refreshState: RefreshState.FooterRefreshing
    })
    this.props.onFooterRefresh && this.props.onFooterRefresh().then(
      ({noMoreData=false, count=9999}) => {
        this.setState({
          onEndReachedCalledDuringMomentum: true,
          refreshState: count ===0 ? RefreshState.EmptyData : noMoreData ? RefreshState.NoMoreData : RefreshState.Idle
        })
      }
    ).catch(
      e => {
        this.setState({
          onEndReachedCalledDuringMomentum: false,
          refreshState: RefreshState.Failure
        })
      }
    )
  }
  _onHeaderRefresh = (e) => {
    if(!this.shouldStartHeaderRefreshing()) {
      return
    }
    console.log('ly88', 'onHeaderRefresh')
    this.setState({
      refreshState: RefreshState.HeaderRefreshing
    })
    this.props.onHeaderRefresh && this.props.onHeaderRefresh().then(
      ({noMoreData=false, count=9999}) => {
        this.setState({
          onEndReachedCalledDuringMomentum: true,
          refreshState: count === 0 ? RefreshState.EmptyData : noMoreData ? RefreshState.NoMoreData : RefreshState.Idle
        })
      }
    ).catch(
      e => {
        this.setState({
          onEndReachedCalledDuringMomentum: true,
          refreshState: RefreshState.Idle
        })
      }
    )
  }
  render() {
    let { children, styles, ...rest } = this.props;
    return (
      <ScrollView
      refreshControl={
        this.props.onHeaderRefresh &&<RefreshControl
          refreshing={this.state.refreshState == RefreshState.HeaderRefreshing}
          onRefresh={this._onHeaderRefresh}
          tintColor="#666"
          title={'加载中'}
          titleColor="#666"
          colors={['red', 'green', 'blue']}
          progressBackgroundColor="#ffffff"
        />}
        onScroll={this.props.onFooterRefresh && this._onScroll}
        scrollEventThrottle={0.1}
        style={[{}, styles]}
        onScrollBeginDrag={(e) => {
          this.state.onEndReachedCalledDuringMomentum = false; 
        }}
        {...rest}
      >
      {children}
      {this.renderFooter()}
      </ScrollView>
    );
  }

  renderFooter = () => {
    const { refreshState } = this.state;
    let footer = null;
    if (!this.props.onFooterRefresh) {
      return footer;
    }

    let footerContainerStyle = [
      styles.footerContainer,
      this.props.footerContainerStyle
    ];
    let footerTextStyle = [styles.footerText, this.props.footerTextStyle];
    let {
      footerRefreshingText,
      footerFailureText,
      footerNoMoreDataText,
      footerEmptyDataText
    } = this.props;
    console.log("footer:", refreshState);
    switch (refreshState) {
      case RefreshState.Idle:
        footer = <View style={footerContainerStyle} />;
        break;
      case RefreshState.Failure: {
        footer = (
          <TouchableOpacity
            style={footerContainerStyle}
            onPress={this._onFooterRefresh}
          >
            <Text style={footerTextStyle}>{footerFailureText}</Text>
          </TouchableOpacity>
        );
        break;
      }
      case RefreshState.EmptyData: {
        footer = (
          <TouchableOpacity
            style={footerContainerStyle}
            onPress={this._onFooterRefresh}
          >
            <Text style={footerTextStyle}>{footerEmptyDataText}</Text>
          </TouchableOpacity>
        );
        break;
      }
      case RefreshState.FooterRefreshing: {
        footer = (
          <View style={footerContainerStyle}>
            <ActivityIndicator size="small" color="#888888" />
            <Text style={[footerTextStyle, { marginLeft: 7 }]}>
              {footerRefreshingText}
            </Text>
          </View>
        );
        break;
      }
      case RefreshState.NoMoreData: {
        footer = (
          <View style={footerContainerStyle}>
            <Text style={footerTextStyle}>{footerNoMoreDataText}</Text>
          </View>
        );
        break;
      }
    }

    return footer;
  };
}

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    height: 44
  },
  footerText: {
    fontSize: 14,
    color: "#555555"
  }
});

export default SDScrollView;
