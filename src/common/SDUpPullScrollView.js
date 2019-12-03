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
  RefreshControl,
} from "react-native";
import { isIphoneX } from "../utils/iphonex";
import { SDSafeAreaFlatList } from "../common";

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
let setTimeoutHandler = null;
let isCheckingScrollVertical = false;

class RefreshListView extends PureComponent<Props, State> {
  state = {
    // 是否已经依据动量对EndReached事件进行响应
    onEndReachedCalledDuringMomentum: true
  };
  static defaultProps = {
    footerRefreshingText: "数据加载中…",
    footerFailureText: "点击重新加载",
    footerNoMoreDataText: "已加载全部数据",
    footerEmptyDataText: "暂时没有相关数据"
  };

  componentWillReceiveProps(nextProps: Props) {}

  componentDidUpdate(prevProps: Props, prevState: State) {}

  onHeaderRefresh = () => {
    if (this.shouldStartHeaderRefreshing()) {
      this.props.onHeaderRefresh &&
        this.props.onHeaderRefresh instanceof Function &&
        this.props.onHeaderRefresh(RefreshState.HeaderRefreshing);
    }
  };

  onEndReached(info: { distanceFromEnd: number }) {
    // debugger;
    // debugger;
    // let currTime = new Date().getTime();

    // if (currTime - lastTime <= 2000) {
    //   lastTime = currTime;
    //   return;
    // }
    // if (Platform.OS == 'ios' && isFetchFooter == false) {
    //   isFetchFooter = true;
    //   return;
    // }
    if (this.shouldStartFooterRefreshing()) {
      this.props.onFooterRefresh &&
        this.props.onFooterRefresh instanceof Function &&
        this.props.onFooterRefresh(RefreshState.FooterRefreshing);
      // isFetchFooter = false
      this.state.onEndReachedCalledDuringMomentum = true
    } else {
      return false;
    }
  }

  _onScrollBegin(e){
    //console.warn('_onScrollBegin')

    //检测是否开始滑动list
    /* if(typeof this.props.onScrollStart == "function"){
      console.warn('scroll list', 1)
      this.props.onScrollStart(true);
    } */
  }

  _onScroll(e) {
    //console.warn('_onScroll')

    //检测是否开始滑动list
    if(typeof this.props.onScrollStart == "function"){
      //console.warn('scroll list', e.nativeEvent.contentOffset.y)
      this.props.onScrollStart();
    }

    if (e.nativeEvent.contentOffset.y <= 0) {
      // 请求的下拉刷新
      return;
    }

    if (this.props.refreshState !== RefreshState.Idle) {
      return;
    }

    const contentHeight = e.nativeEvent.contentSize.height;
    const scrollY = e.nativeEvent.contentOffset.y;
    const layoutHeight = e.nativeEvent.layoutMeasurement.height;
    if (scrollY + layoutHeight >= contentHeight - 20) {
      this.props.onFooterRefresh(RefreshState.FooterRefreshing);
    }
  }

  shouldStartHeaderRefreshing = () => {
    if (
      this.props.refreshState == RefreshState.HeaderRefreshing ||
      this.props.refreshState == RefreshState.FooterRefreshing
    ) {
      return false;
    }
    return true;
  };

  shouldStartFooterRefreshing = () => {
    let { refreshState, data } = this.props;
    if (data.length == 0) {
      return false;
    }
    if(this.state.onEndReachedCalledDuringMomentum) {
      return false
    }

    return refreshState == RefreshState.Idle;
  };

  render() {
    let { renderItem, NoMoreDataStyle, needSafeArea, ...rest } = this.props;
    const Wrapper = needSafeArea ? SDSafeAreaFlatList : FlatList
    return (
      (Platform.OS == "android") ? <Wrapper
        ref={this.props.listRef ? this.props.listRef : null}
        refreshControl={
          (Platform.OS == "android") ? <RefreshControl
          onLayout={e => {
            //console.warn('onLayout', e.nativeEvent)
          }}
          // all properties must be transparent
          //tintColor="transparent"
          //colors={['transparent']}
          style={{
            //backgroundColor: 'transparent',
          }}
          enabled={true}
          //progressBackgroundColor="transparent"
          progressViewOffset={0}
          //size={RefreshControl.SIZE.LARGE}
          title=""
          titleColor="transparent"
          refreshing={this.props.refreshState == RefreshState.HeaderRefreshing}
          onRefresh={() => {
            this.props.onHeaderRefresh ? this.props.onHeaderRefresh : null
          }}
          /> : null
        }
        ListFooterComponent={this.renderFooter}
        // onEndReachedThreshold={0.1}
        scrollEventThrottle={this.props.scrollThrottle? this.props.scrollThrottle : this.props.refreshState == RefreshState.Idle ? 0.1 : 1000}
        renderItem={renderItem}
        onScroll={this._onScroll.bind(this)}
        onMomentumScrollBegin={this._onScrollBegin.bind(this)}
        onMoveShouldSetResponder={(e)=>{
          //if(isCheckingScrollVertical) return true
          //禁止左右滑动
          if(this.props.controlCarousel){
            //console.log('onMoveShouldSetResponder', e.target)
            //if(setTimeoutHandler) clearTimeout(setTimeoutHandler)
            this.props.controlCarousel.setState({
              CarouselScrollEnabled: false,
            })
            setTimeoutHandler = setTimeout(() => {
              this.props.controlCarousel.setState({
                CarouselScrollEnabled: true,
              })
              //isCheckingScrollVertical = false
            }, 3000);
          }
          //isCheckingScrollVertical = true
          //return true
        }}
        // bounces={false}
        // onMomentumScrollBegin={() => {
        //   console.log('ly88', 'onMomentumScrollBegin' )
        //   this.state.onEndReachedCalledDuringMomentum = false;
        // }}
        // 开始拖拽时，添加冲量
        onScrollBeginDrag={(e) => {
          //console.warn('_onScrollBeginDrag')
         //this.state.onEndReachedCalledDuringMomentum = false;
        }}
        {...rest}
      /> : <Wrapper
        ref={this.props.listRef ? this.props.listRef : null}
        // onEndReached={this.onEndReached.bind(this)}
        onRefresh={
          this.props.onHeaderRefresh ? this.props.onHeaderRefresh : null
        }
        // keyExtractor={(item,index)=>index.toString()}
        // onRefresh={this.onHeaderRefresh ? this.onHeaderRefresh : null}
        refreshing={this.props.refreshState == RefreshState.HeaderRefreshing}
        ListFooterComponent={this.renderFooter}
        // onEndReachedThreshold={0.1}
        scrollEventThrottle={this.props.scrollThrottle? this.props.scrollThrottle : this.props.refreshState == RefreshState.Idle ? 0.1 : 1000}
        renderItem={renderItem}
        onScroll={this._onScroll.bind(this)}
        onMomentumScrollBegin={this._onScrollBegin.bind(this)}
        // bounces={false}
        // onMomentumScrollBegin={() => {
        //   console.log('ly88', 'onMomentumScrollBegin' )
        //   this.state.onEndReachedCalledDuringMomentum = false;
        // }}
        // 开始拖拽时，添加冲量
        // onScrollBeginDrag={(e) => {
        //   this.state.onEndReachedCalledDuringMomentum = false;
        // }}
        {...rest}
      />
    );
  }

  renderFooter = () => {
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
    switch (this.props.refreshState) {
      case RefreshState.Idle:
        if(this.props.NoMoreDataStyle) footer = (null);
        if(!this.props.NoMoreDataStyle) footer = <View style={footerContainerStyle} />;
        break;
      case RefreshState.Failure: {
        footer = (
          <TouchableOpacity
            style={footerContainerStyle}
            onPress={() => {
              this.props.onFooterRefresh &&
                this.props.onFooterRefresh(RefreshState.FooterRefreshing);
            }}
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
            onPress={() => {
              this.props.onFooterRefresh &&
                this.props.onFooterRefresh(RefreshState.FooterRefreshing);
            }}
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
        //console.log("this.props.NoMoreDataStyle", this.props.NoMoreDataStyle, this.props.renderItem)
        if(this.props.NoMoreDataStyle) footer = (null);
        if(!this.props.NoMoreDataStyle) footer = (
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

export default RefreshListView;
