import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SectionList,
  ScrollView,
  RefreshControl,
  Platform,
  Image
} from "react-native";

import { DatePicker, List, Tabs, Toast } from "antd-mobile";
import PropTypes from "prop-types";
import * as sdStyles from "@src/styles";
import { ScoreText } from "@src/sd_rank";
import {
  NormalizeChart,
} from "@src/sd_charts";
import UserList from "@src/sd_userList/UserList";

import { Touchable, SDTabs2 } from "@src/sd_components";
import { navScreen, navLightBox, dismissLightBox, navRightButton } from "@styles";
import FootSpace from "@sd_components/FootSpace";
import ConnectWithActions from "../../../connectWithActions";
import { getUserPower, getUserId, getPeerUserArray, getTopUserArray, getUserCity, getRankedPeerUserArray } from "../../../selectors";
import { parseUserList, formatPower } from "@utils/user";
import { CSS } from "../../../common/SDCSS";
import PanResponderExample from "./PanResponderExample";
import chartConfig from "../../../sd_charts/chartConfig.js";
import {isIphoneX} from "../../../utils/iphonex";
import RankMiddleTabs from "./RankMiddleTabs";
import CitySelect from "../../../sd_citySelect/CitySelect";
import CitySelectToggle from "../../../sd_citySelectToggle/CitySelectToggle";

const styles = StyleSheet.create({});

type Props = {
  error: string
};
type State = {
  // error: string
};

// 维度，用于接口请求
const dimensions = [
  "major", //本专业
  "similar_major", // 同类专业
  "school", // 本校
  "similar_school", // 同类院校
  "city" // 同城
];
const PULL_TO_REFRESH = '下拉加载';
const REFRESHING = '加载中...';
// const REFRESH_DONE = '加载完成';

// 排名看一看模块
class RankTabOne extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      // popup当前被选中的条目
      // popupSelectedIndex: 0,
      // popupText: "本专业排名",
      // compareItem: "计算机软件工程",
      popupSelectedIndex: 4,
      popupText: "城市排名",
      compareItem: "--",
      // topUserArray: [],
      // peerUserArray: [],
      // 是否需要重新请求数据
      shouldTopUserArrayUpdate: true,
      shouldPeerUserArrayUpdate: true,
      // 请求图表数据
      shouldChartDataUpdate: true,
      // 是否在进行请求top榜
      isTopFetching: false,
      // 是否在进行请求同侪榜
      isPeerFetching: false,
      // tab
      tabIndex: 0,
      // 头部显示
      currentRank: 0,
      currentPercentage: 0,
      currentPersonCount: 0,
      isRefreshing: false,
      // 登峰榜单请求人的个数
      topPagesSize: 100,
      // 相同分数的人
      samePowerPersonCount: 0,
      // 图表加载
      chartLoading: false,
      chartData: chartConfig.chartOption.props.normalize.get_empty_data(),
      peerPageSize: 100,
      selectedCity: this.props.userCity
    };
  }
  props: Props;
  state: State;
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
  };
  get_empty_data = () => {
    return chartConfig.chartOption.props.normalize.get_empty_data()
  }

  TogglePopup = () => {
    navLightBox("RankPopupScreen", {
      style: {
        backgroundBlur: "none",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        tapBackgroundToDismiss: true
      },
      passProps: {
        popupSelectedIndex: this.state.popupSelectedIndex
      }
    });
  };
  onPopupItemPressed = ({ id, name, index }) => {
    // if(this.state.popupSelectedIndex === index) {
    //   dismissLightBox();
    //   return
    // }
    this.setState(
      {
        popupSelectedIndex: index,
        popupText: name || "",
      },
      () => {
        this._onRefresh(true);
      }
    );
    dismissLightBox();
  };
  // 获取图表数据
  fetchChartData = () => {
    const { popupSelectedIndex, selectedCity } = this.state;
    let params = {
      type: 'top',
      dimension: dimensions[this.state.popupSelectedIndex],
      city_name: (selectedCity && selectedCity.name) || '成都市'
    };
    console.log('ly88', 'params', params);
    return new Promise((resolve, reject) => {
      this.props.actions.getRankChartDataAction(params).then(
        res => {
          console.log('ly88', 'getRankChartDataAction', res);
          if(res.status === 'ok') {
            // 只储存一个包含0的值
            let withZeroData = false
            const _chartData =  res.results.chart.filter(item => {
              if(withZeroData) {
                return item.power_number !== 0
              }
              if (item.power_number === 0){
                withZeroData = true
              }
              return true
            }).map((item) => {
              return {
                x: item.power_number,
                y: item.power_count
              }
            })
            const chartData = this.get_empty_data().map((item,index) => {
              const _len = _chartData.length
              for(let _i = 0; _i < _len; _i++) {
                if(_chartData[_i].x === item.x) {
                  item.y = _chartData[_i].y
                  break;
                }
              }
              return item
            })
            this.setState({
              shouldChartDataUpdate: false,
              currentRank: res.results.rank,
              currentPercentage: res.results.percent || '0%',
              currentPersonCount: res.results.total_count || '0', 
              compareItem: res.results.query_info && res.results.query_info[params.dimension] || '--',
              samePowerPersonCount: res.results.power_count || 1,
              chartData: chartData,
            }, resolve);
          } else {
            reject()
          }
        }
      ).catch(
        e => {
          reject(e)
        }
      );
    })
  };
  // 获取top榜单数据
  fetchTop = () => {
    const { selectedCity, popupSelectedIndex, topPagesSize} = this.state;
    let params = {
      type: "top",
      dimension: dimensions[popupSelectedIndex],
      size: topPagesSize,
      page: 1,
      city_name: selectedCity && selectedCity.name || '成都市'
    };
    // 请求top榜单数据
    return new Promise((resolve, reject) => {
      this.props.actions.getRankStatisticsAction(params).then(
        res => {
          if(res.status === 'ok') {
            this.setState({
              shouldTopUserArrayUpdate: false,
            }, resolve);
          } else {
            reject(res.msg)
          }
        }
      ).catch(
        e => {
          reject(e)
        }
      );
    })
  };
  // 获取同侪榜单数据
  fetchPeer = () => {
    const { selectedCity, popupSelectedIndex, peerPageSize} = this.state;
    let params = {
      type: "peer",
      dimension: dimensions[popupSelectedIndex],
      size: peerPageSize,
      page: 1,
      city_name: selectedCity && selectedCity.name || '成都市'
    };
    return new Promise((resolve, reject) => {
      this.props.actions.getRankStatisticsAction(params).then(
        res => {
          console.log("同侪榜数据：", res);
          if(res.status === 'ok') {
            this.setState({
              shouldPeerUserArrayUpdate: false,
            }, resolve);
          } else {
            reject(res.msg)
          }
        }
      ).catch(
        e => {
          reject(e)
        }
      );
    })
  };
  // 请求
  doFetch(shouldShowLoading) {
    return Promise.all([
      new Promise((resolve, reject) => {
        if (this.state.shouldChartDataUpdate) {
          shouldShowLoading && this.setState({
            chartLoading: true
          })
          return this.fetchChartData().then(
            () => {
              shouldShowLoading && this.setState({
                chartLoading: false
              });
              resolve();
            }
          ).catch(
            e => {
              shouldShowLoading && this.setState({
                chartLoading: false
              });
              reject();
            }
          )
        } else resolve();
      }),
      new Promise((resolve, reject) => {
        if (this.state.tabIndex === 0) {
          if (this.state.shouldTopUserArrayUpdate) {
            shouldShowLoading && this.setState({
              isTopFetching: true
            })
            return this.fetchTop(shouldShowLoading).then(
              () => {
                shouldShowLoading && this.setState({
                  isTopFetching: false
                })
                resolve()
              }
            ).catch(
              e => {
                shouldShowLoading && this.setState({
                  isTopFetching: false
                });
                reject();
              }
            );
          } else resolve()
        } else {
          if (this.state.shouldPeerUserArrayUpdate) {
            shouldShowLoading && this.setState({
              isPeerFetching: true
            })
            return this.fetchPeer(shouldShowLoading).then(
              () => {
                shouldShowLoading && this.setState({
                  isPeerFetching: false
                });
                resolve();
              }
            ).catch(
              e => {
                shouldShowLoading && this.setState({
                  isPeerFetching: false
                })
                reject()
              }
            );
          } else resolve()
        }
      })
    ]).catch(err => {})
  }
  onNavigatorEvent(event) {
    switch (event.id) {
      case "willAppear":
        this.doFetch();
        break;
      case "didAppear":
        break;
      case "willDisappear":
        break;
      case "didDisappear":
        break;
      case "willCommitPreview":
        break;
    }
  }
  handleActionToUpdateAllData = () => {
    this.setState(
      {
        shouldTopUserArrayUpdate: true,
        shouldPeerUserArrayUpdate: true,
        shouldChartDataUpdate: true,
      },
      () => {
        this.doFetch();
      }
    );
  }
  componentDidMount() {
    // Toast.info('h')
    // this.context.navigator.push(
    //   navScreen("PlayerKillScreen", "PK一下", {
    //     passProps: {
    //       otherId: 3
    //     },
    //     navigatorStyle: {
    //       navBarTransparent: true,
    //       navBarTranslucent: Platform.OS === "ios",
    //       // screenBackgroundColor: 'yellow'
    //       navBarBackgroundColor: "yellow",
    //       navBarHidden: true,
    //       navBarNoBorder: true,
    //       tabBarHidden: true // 隐藏tab
    //     }
    //   })
    // );
    // return
    this.context.refs["rank_tab_one"] = this;
    this.context.refs["rank_tab_one_popup_toggle"] = this.refs[
      "rank_tab_one_popup_toggle"
    ];
    this.doFetch(true)
  }
  // 获取默认图表数据
  getDefaultChartData = () => {
    // 取假数据
    var defaultData = chartConfig.chartOption.datasets.normalize;
    // 抽样
    defaultData = defaultData.filter((d, i) => {
      return i % 5 === 0;
    });
    // 处理x轴,把数据映射到 0 - 100
    const min = defaultData[0].x;
    const max = defaultData[defaultData.length - 1].x;
    defaultData.map((item, index) => {
      item.x = parseInt((item.x - min) * ((max - min) / 100));
    });
    // 处理y轴,把数据映射到[ 0 - count ]
    // let max_y = 0
    // // 获取最大值与最小值
    // defaultData.forEach((d, i) => {
    //   if (i === 0) {
    //     max_y = d.y;
    //   } else {
    //     if (d.y > max_y) max_y = d.y;
    //   }
    // })
    // defaultData.map((item, index) => {
    //   item.y = parseInt((item.y) * ((this.state.currentPersonCount) / max_y*10));
    // });
    return defaultData
  }

  _onRefresh = (noToast) => {
    this.setState({
      isRefreshing: true,
      shouldTopUserArrayUpdate: true,
      shouldPeerUserArrayUpdate: true,
      shouldChartDataUpdate: true,
    }, () => {
      this.doFetch().then(
        () => {
          // ('noToast', noToast)
          !noToast && Toast.info('刷新成功',1,null, false);
          this.setState({
            isRefreshing: false
          });
        }
      ).catch(
        e => {
          this.setState({
            isRefreshing: false
          });
        }
      )
    });
  }
  toggleSelectCity = () => {
    this.context.navigator.push(
      navScreen("PushScreen", "选择地区", {
        passProps: {
          screen: () => (
            <CitySelect
              onGetPosition={(province, city, area) => {
                this.setState({
                  selectedCity: {
                    name: city.name,
                    parent: city.parent !== undefined ? city.parent : {
                      name: province.name
                    }
                  }
                }, () => this._onRefresh(true))
              }}
            />
          ),
          fullScreen: true,
          noScrollView: true,
          header: {
            title: "选择地区"
          }
        }
      })
    )
  }
  getCityText = () => {
    const { selectedCity } = this.state;
    let defaultCity = "四川省成都市";
    if (selectedCity && selectedCity.name) {
      defaultCity = ""
      if(selectedCity.parent) {
        defaultCity += selectedCity.parent.name;
      }
      defaultCity += selectedCity.name;
    }
    return defaultCity
  }
    
  render() {
    // return <PanResponderExample/>;
    const { userPower,userId, topUserArray, peerUserArray } = this.props;
    const {
      currentRank,
      currentPercentage,
      currentPersonCount,
      tabIndex,
      selectedCity,
      popupSelectedIndex
    } = this.state;
    // return null;
    const Header = (
      <View style={{paddingBottom: CSS.pixel(30, true), backgroundColor: '#fff'}}>
        <Touchable onPress={this.TogglePopup}>
          <View
            style={{
              backgroundColor: "#fff",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: CSS.pixel(50, true),
              paddingBottom: CSS.pixel(40, true)
            }}
            ref="rank_tab_one_popup_toggle"
          >
            <Text style={{fontSize: CSS.textSize(24), paddingRight: CSS.pixel(10), fontWeight: sdStyles.SDFontMedium}}>{this.state.popupText}</Text>
            <Image source={require('@img/rank/rank_ico_screen1.png')}/>
          </View>
        </Touchable>
        {popupSelectedIndex === 4 && (
          <CitySelectToggle 
          // id: number,
          // title: string,
          // province: {
          //   id: number,
          //   title: string,
          //   alias: string
          // }
            // city={selectedCity && selectedCity.name || '成都市'}
            city={this.getCityText()}
            onPress={this.toggleSelectCity}>
          </CitySelectToggle>)}
        <ScoreText
          style={{
            backgroundColor: "#fff",
            paddingBottom: CSS.pixel(14, true),
            paddingLeft: CSS.pixel(36),
            paddingRight: CSS.pixel(36)
          }}
          score={formatPower(userPower, true)}
          compareItem={this.state.compareItem}
          rank={currentRank}
          studentAccount={currentPersonCount}
          percentage={currentPercentage}
        />
        {<NormalizeChart
          loading={this.state.chartLoading}
          nodata={this.state.chartData.length===0}
          data={this.state.chartData || []}
          selectedValue={userPower}
          style={{ backgroundColor: "#fff" }} />}
      </View>
    );

    const ScrollCompWithHeader = (
      <View 
      style={{marginBottom:CSS.pixel(30, true)}}
      >
      <RankMiddleTabs
        style={{marginTop:CSS.pixel(30)}}
        tabWidthStyle={{alignItems: 'flex-end', justifyContent: 'flex-end'}}
        tabIndex={this.state.tabIndex}
        page={0}
        underLineWidth={CSS.pixel(0)}
        onChangeTab={(index) => {
          this.setState(
            {
              tabIndex: index
            },
            () => this.doFetch(true)
          );
        }}
        tabWidthStyle={{
          borderWidth: 0,
        }}
      >
      <View style={{width:CSS.width()}}>
        <Text style={{
            backgroundColor:'#fff',
            paddingVertical:CSS.pixel(30),
            fontSize:CSS.textSize(24),
            color: sdStyles.SDFontColorSubtitle,
            textAlign:'center'
          }}>
          努力造就实力，态度决定高度，登峰造极，向他们看齐吧！
        </Text>
          <UserList
            loading={this.state.isTopFetching}
            withSpecialItem={'top'}
            users={topUserArray}
            withNoMoreData={true}
            style={this.state.tabIndex === 0?{}:{height:CSS.pixel(800)}}
          />
        </View>
        <View style={{width:CSS.width()}}>
          <Text style={{
              backgroundColor:'#fff',
              paddingVertical:CSS.pixel(40),
              fontSize:CSS.textSize(24),
              color: sdStyles.SDFontColorSubtitle,
              textAlign:'center',
              paddingHorizontal:CSS.pixel(40),
              lineHeight: CSS.pixel(34)
            }}>
          登顶始于每一次微小的超越，所以我们截取了你所在位置的前十名和后十名，更直观地呈现你与他人的竞争关系。
          </Text>
          <UserList
            loading={this.state.isPeerFetching}
            users={peerUserArray}
            // 获取本人的信息
            withOwnerInfo={peerUserArray.length && peerUserArray.filter((item)=>item.id===userId)[0]}
            withNoMoreData={true}
            style={this.state.tabIndex === 1?{}:{height:CSS.pixel(800)}}
          />
        </View>
      </RankMiddleTabs>
      </View>
    );
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh}
            tintColor="#666"
            title={this.state.isRefreshing ? REFRESHING : PULL_TO_REFRESH}
            titleColor="#666"
            colors={['red', 'green', 'blue']}
            progressBackgroundColor="#ffffff"
          />}
        style={{
          flex: 1,
          backgroundColor: "#f3f3f3",
          // marginBottom: Platform.OS === 'android' ? CSS.pixel(74) :isIphoneX() ? CSS.pixel(94) :CSS.pixel(74)
        }}
      >
        {Header}
        {ScrollCompWithHeader}
      </ScrollView>
    );
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({
  userCity: getUserCity(state, props),
  userPower: getUserPower(state, props),
  userId: getUserId(state, props),
  topUserArray: getTopUserArray(state),
  // peerUserArray: getPeerUserArray(state),
  peerUserArray: getRankedPeerUserArray(state)
  
}))(RankTabOne));
