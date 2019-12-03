import React from "react";
import { StyleSheet, Text, View, Platform, PixelRatio, Image } from "react-native";
import PropTypes from "prop-types";
import { NewsOfWatches } from "../../../types";
import NewsItem from "@src/sd_newsItem/NewsItem";
import ConnectWithActions from "../../../connectWithActions";
import * as sdStyles from "@src/styles";
import SDUpPullScrollView, {
  RefreshState
} from "../../../common/SDUpPullScrollView";
import { ActivityIndicator, Toast } from 'antd-mobile';
import {CSS} from '../../../common/SDCSS';
import ImageViewer from '../../../sd_imageViewer/ImageViewer.js';
import { getUserId } from '../../../directSelectors';
import { navScreen } from "@styles";
import MyHomeScreen from "../myHome/MyHomeScreen";
import { parseNewsOfWatches } from "@utils/user";

const styles = StyleSheet.create({});

/**
 *  关注动态
 */

class RankNewsWithinFollower extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      refreshState: RefreshState.Idle,
      pageSize: 10,
      curPage: 1,
      isFetching: false,
      // 是否正在查看图片详细
      isViewingImages: false,
      // 正在进行查看的图片组合
      images: [],
      // 图片默认位置
      index: 0
    };
  }
  // 通过id来获取之后的数据
  id_lt = null

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };
  
  doFetch = (reset) => {
    if(this.state.isFetching) return Promise.resolve()
    const { pageSize, curPage } = this.state;
    let params = {
      page: curPage,
      size: pageSize
    };
    // 如果之前有过请求
    if(this.id_lt) params['id__lt'] = this.id_lt;
    return new Promise((resolve, reject) => {
      this.props.actions.getAllDynamicAction(params).then(
        res => {
          console.log('ly88', 'getAllDynamicAction' , res)
          this.setState({
            isFetching: false
          })
          if (res.status === 'ok') {
            if(reset){
              Toast.info('刷新成功',1,null, false);
            }
            let tempNews = parseNewsOfWatches(res.results)
            let news = reset ? tempNews : this.state.news.concat(tempNews)
            console.log('ly88', 'id_lt', res.results[res.results.length-1].id)
            // 记录列表最后一项的id
            this.id_lt = res.results[res.results.length-1].id
            
            // 设置数据
            this.setState({
              // 如果数据已经请求完，为 NoMoreData
              refreshState: res.results.length === res.count ? RefreshState.NoMoreData : RefreshState.Idle,
              // refreshState: RefreshState.Idle,
              news: news,
              count: res.count
            })
            resolve(news, res.count)
          } else {
            reject(res.msg)
          }
        }
      ).catch(
        e => {
          this.setState({
            isFetching: false
          })
          reject(e)
        }
      )
    })
  }
  handleAvatarPress = (id) => {
    // console.log('ly88', 'id', id)
    // return
    // 如果与当前用户的id一致
    if (id === this.props.userId) {
      // 弹出到根目录
      this.context.navigator.popToRoot({
        animated: true, // does the pop have transition animation or does it happen immediately (optional)
        animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
      });
      this.context.refs["_rankScreen"].navToPerson();
      return;
    }
    // 跳转到个人主页面
    this.context.navigator.push(
      navScreen("PushScreen", "个人主页", {
        passProps: {
          fullScreen: true,
          noScrollView: true,
          screen: () => <MyHomeScreen userId={id} />,
          header: {
            title: "个人主页"
          } // 自定义传递props
        }
      })
    );
  }
  componentDidMount() {
    this.context.refs['rank_news_within_follower'] = this;
    this.setState({
      isFetching: true
    })
    this.doFetch().then(
      (news) => {
        if(news===null)return
      }
    )
  }
  onFooterRefresh = () => {
    const { pageSize, curPage, count } = this.state;
    // if(this.state.curPage*this.this.state.count)
    // 设置为未请求时的状态
    
    this.setState({
      refreshState: RefreshState.FooterRefreshing,
      // curPage: this.state.curPage + 1
    }, () => {
      this.doFetch().then(
        (news) => {
          // ios会请求两次的问题
          if(news === null) return
        }
      ).catch(
        e => {
          this.setState({
            refreshState: RefreshState.Idle,
          })
          console.log(e)
        }
      )
    })
  }
  onHeaderRefresh = () => {
    this.id_lt = null
    this.setState({
      refreshState: RefreshState.HeaderRefreshing,
      // curPage: 1,
      // news:[]
    }, () => {
      this.doFetch(true).then(
        (news) => {
          console.log(news)
        }
      )
    })
  }
  // 查看图片
  viewImages = (imageArr, index=0) => {
    // 过滤空url的图片
    const images = imageArr.filter((item)=>item.url).map((item,index) => {
      return {
        // 以宽度显示完整为准，调整分辨率与设备分辨率相同
        url: item.url + `?imageView2/2/w/${parseInt(CSS.width()*(Platform.OS === 'android' ? 1: PixelRatio.get()*1.5))}`,
        // url: item.url
      }
    })
    // this.context.refs['_rankScreen'].handleViewImages(images, index, this.context.navigator);
    // return
    this.setState({
      images: images,
      index: index,
      isViewingImages: true
    })
  }
  
  render() {
    const { news } = this.state;
    // const { news } ={news:[]}
    const NoData = (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: CSS.height()-CSS.pixel(100)
        }}
      >
        <Image
          source={require("@img/rank/rank_pic_No_concern.png")}
          style={{ marginBottom: 30 }}
        />
        <Text style={{ color: sdStyles.SDFontColorSubtitle, fontSize: CSS.textSize(34) }}>
          暂无数据
        </Text>
      </View>
    )
    if((news.length === 0) && (this.state.isFetching === false)) {
      return (<View>{NoData}</View>)
    }
    const _ImageViewer = (
      <ImageViewer
        onClick={()=> {
          this.setState({
            isViewingImages: false
          })
        }}
        index={this.state.index}
        imageUrls={this.state.images}
        show={this.state.isViewingImages}
        enableSwipeDown={Platform.OS === 'android' ? false : true}
        onSwipeDown={(e) => {
          // console.log('ly88','e',e)
          this.setState({
            isViewingImages: false
          })
        }}
        // // Android, Platform.isTVOS返回
        onRequestClose={() => {
          this.setState({
            isViewingImages: false
          })
        }}
      />)
    return (
      <View 
        style={{
          flex:1
        }}>
        {_ImageViewer}
        {news.length > 0 ? (
          <SDUpPullScrollView
            refreshState={this.state.refreshState}
            onFooterRefresh={this.onFooterRefresh}
            onHeaderRefresh={this.onHeaderRefresh}
            // data={[...news,...news,...news,...news,...news,...news]}
            data={news}
            needSafeArea={true}
            renderItem={({ item, index }) => {
              return (<NewsItem
              {...item}
              onAvatarPress={this.handleAvatarPress}
              />);
            }}
          />
        ) : (
          <View
            style={{
              height:200,
              justifyContent:'center',
              alignItems:'center'
            }}
          >
            <ActivityIndicator
            toast
            text="Loading..."
            animating={this.state.isFetching}/>
          </View>
        )}
      </View>
    );
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({
  userId: getUserId(state)
}))(
  RankNewsWithinFollower
));
