import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  Image,
} from "react-native";

import { ActivityIndicator, Toast } from "antd-mobile";
import PropTypes from "prop-types";
import * as sdStyles from "@src/styles";
import {
  NormalizeChart
  // HorizontalBarChart
} from "@src/sd_charts";
import UserList from "@src/sd_userList/UserList";

import { Touchable, SDButton } from "@src/sd_components";
const styles = StyleSheet.create({});
import { navScreen } from "@styles";
import { SectionView, SectionViewSeparator } from "@src/common";
import ConnectWithActions from "../../../connectWithActions";
import { getUserPower, getRankDynamic, getRankWatchUserArray } from "../../../selectors";
import { CSS } from "../../../common/SDCSS";
import SDLoading from "@sd_components/SDLoading";
import SDScrollView, { RefreshState } from "../../../sd_components/SDScrollView";
import chartConfig from "../../../sd_charts/chartConfig.js";
import {isIphoneX} from "../../../utils/iphonex";
import RankNewsWithinFollower from "../../pushScreen/rankNewsWithinFollower/RankNewsWithinFollower"
import { formatPower } from "@utils/user";

type Props = {
  error: string
};
type State = {
  // error: string
};

/**
 * 排名首页第二个Tab
 * 关注榜
 */
class RankTabTwo extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      // 是否需要重新请求数据
      shouldUserArrayUpdate: true,
      userArray: [],
      isFetching: false,
      isFetchingDynamic: false,
      curPage: 1,
      pageSize: 10,
      shouldChartDataUpdate: true,
      chartLoading: false,
      currentRank: 0,
      samePowerPersonCount: 0,
      // chartData: []
      chartData: chartConfig.chartOption.props.normalize.get_empty_data()
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
  handleItemClick = i => {
  };
  // 导航到动态界面
  navToNews = () => {
    // this.context.navigator.push(
    //   navScreen("RankNewsWithinFollower", "关注动态")
    // );
    this.context.navigator.push(
      navScreen("PushScreen", "关注动态", {
        passProps: {
          screen: () => <RankNewsWithinFollower/>,
          header: {
            title: "关注动态"
          }
        }
      })
    );
  };

  fetchUserArrayData = () => {
    const {pageSize, curPage} = this.state;
    let params = {
      type: "watch",
      page: curPage,
      size: pageSize
    };
    console.log('ly88', 'noMoreData', (this.props.data))
    // 不能通过是否长度为0来进行判断
    return new Promise((resolve ,reject) => {
      this.props.actions.getRankWatchStatisticsAction(params).then(
        res => {
          if(res.status === 'ok') {
            this.setState({
              pageSize: 10
            })
            if(params.page === 1) {
              resolve({
                noMoreData: res.results.length === res.count,
                count: res.count
              });
            } else {
              resolve({
                noMoreData: (this.props.data.length) === res.count,
                count: res.count
              });
            }
          } else {
            reject(res.msg)
          }
        }
      ).catch(
        e => {
          reject(e)
        }
      )
    })
  };
  fetchDynamic = (shouldShowLoading) => {
    shouldShowLoading && this.setState({
      isFetchingDynamic: true
    })
    return new Promise((resolve, reject) => {
      this.props.actions.getRankDynamicCount({}).then(
        res => {
          if(res.status === 'ok') {
            shouldShowLoading && this.setState({
              isFetchingDynamic: false
            })
            resolve()
          } else {
            reject()
          }
        }
      ).catch(
        e => {
          shouldShowLoading && this.setState({
            isFetchingDynamic: false
          })
          reject()
        }
      )
    })
  }
  onNavigatorEvent(event) {
    switch (event.id) {
      case "didAppear":
        // this.fetchDynamic()
        this.doFetch()
        break;
      default:
        break;
    }
  }

  handleActionToUpdateAllData = () => {
    // 不每次关注状态改变就刷新,进入这个页面的时候再加载
    this.setState({
      shouldChartDataUpdate: true,
      shouldUserArrayUpdate: true,
      pageSize: 10,
      curPage: 1
    });
    return
    this.setState({
      curPage: 1
    }, () => {
      this.doFetch()
    })
    return;
    this.fetchDynamic()
    this.fetchChartData()
    this.setState({
      curPage: 1
    }, () => {
      this.fetchUserArrayData().then(
        ({noMoreData, count}) => {
          this.refs['sd_scrollview'] && this.refs['sd_scrollview'].init({noMoreData, count})
        }).catch(
          e => {
            console.log(e)
          }
        )
    })
  }
  componentDidMount() {
    this.context.refs['rank_tab_two'] = this;
    this.setState({
      isFetching: true
    })
    this.doFetch().then(
      res => {
        this.setState({
          isFetching: false
        })
      }
    ).catch(
      e => {
        this.setState({
          isFetching: false
        })
      }
    )
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
    return
    // 在进入之前可能已经进行了关注操作
    this.setState({
      isFetching: true
    })

    this.fetchUserArrayData().then(
      ({noMoreData, count}) => {
        this.setState({
          isFetching: false
        }, () => {
          this.refs['sd_scrollview'] && this.refs['sd_scrollview'].init({noMoreData, count})
          this.fetchDynamic()
          this.fetchChartData()
        })
      }
    ).catch(
      e => {
        this.setState({
          isFetching: false
        })
      }
    )
  }
  getFormattedChartData = (chart) => {
    // 只储存一个包含0的值
    let withZeroData = false
    const _chartData =  chart.filter(item => {
      if(withZeroData) {
        return item.power_number !== 0 && item.power_number !== null && item.power_number !== undefined
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
    return chartData;
  }
  // 获取图表数据
  fetchChartData = () => {
    let params = {
      type: 'watch'
    };
    return new Promise((resolve, reject) => {
      this.props.actions.getRankChartDataAction(params).then(
        res => {
          console.log('ly88', 'getRankChartDataAction', res);
          if(res.status === 'ok') {
            const chartData = this.getFormattedChartData(res.results.chart)
            this.setState({
              shouldChartDataUpdate: false,
              currentRank: res.results.rank,
              samePowerPersonCount: res.results.power_count || 1,
              chartData: chartData,
            }, resolve);
          } else {
            reject(res.msg)
          }
        }
      ).catch(
        e => reject
      );
    })
  };

  doFetch(shouldShowLoading) {
    return Promise.all([
      new Promise((resolve, reject) => {
        if(this.state.shouldChartDataUpdate) {
          shouldShowLoading && this.setState({
            chartLoading: true
          })
          this.fetchChartData().then(
            () => {
              shouldShowLoading && this.setState({
                chartLoading: false
              })
              resolve()
            }
          ).catch(
            () => {
              shouldShowLoading && this.setState({
                chartLoading: false
              })
              reject()
            }
          )
        } else resolve()
      }),
      new Promise((resolve, reject) => {
        if(this.state.shouldUserArrayUpdate) {
          this.fetchUserArrayData().then(
            ({noMoreData, count}) => {
              this.setState({
                shouldUserArrayUpdate: false,
                isFetching: false
              }, () => {
                this.refs['sd_scrollview'] && this.refs['sd_scrollview'].init({noMoreData, count})
              })
              resolve()
            }
          ).catch(
            e => {
              this.setState({
                isFetching: false
              })
              reject()
            }
          )
        } else resolve()
      }),
      this.fetchDynamic(shouldShowLoading)
    ])
  }
  // 刷新
  onRefresh = (page) => {
    return new Promise((resolve, reject) => {
      this.setState({
        shouldChartDataUpdate: true,
        shouldUserArrayUpdate: true,
        curPage: page ? page : this.state.curPage + 1,
      }, () => {
        this.doFetch().then(
          () => {
            page && Toast.info('刷新成功',1,null, false);
          }
        ).catch(
          () => {
          //  page && Toast.info('刷新失败',1,null, false);
          // 失败的时候回退一页
            this.setState({
              curPage: this.state.curPage - 1
            })
            reject()
          }
        )
        return;
        this.fetchDynamic()
        this.fetchChartData()
        this.fetchUserArrayData().then(
          ({noMoreData, count}) => {
            resolve({noMoreData, count})
          }).catch(
            e => {
              reject(e)
            }
          )
      });
    })
  }
  render() {
    const { userPower } = this.props;
    const { isFetchingDynamic, isFetching, currentRank } = this.state;
    const userArray = this.props.data;
    // const userArray = formatData(watches)
    if (isFetching) {
      return <View style={{flex:1,backgroundColor:sdStyles.SDBGColorMain,height:CSS.height()}}><SDLoading /></View>
    }
    const Dynamic = () => (<View
      style={{
        alignItems: "center",
        paddingTop: CSS.pixel(40, true),
        paddingBottom: CSS.pixel(30, true),
        height: CSS.pixel(150, true),
        backgroundColor: "#fff",
        position: 'relative'
      }}
    >
    {isFetchingDynamic &&<View style={{alignItems: "center",justifyContent:'center', width:'100%',position:'absolute', zIndex:1, height: CSS.pixel(150, true)}}><ActivityIndicator animating={isFetchingDynamic}/></View>}
      <SDButton
        style={{
          height: CSS.pixel(50, true),
          zIndex: 7,
          backgroundColor: sdStyles.SDMainColor,
          borderRadius: CSS.pixel(50, true),
          width: CSS.pixel(204),
          position: "relative",
          marginBottom: CSS.pixel(10, true)
        }}
        btnStyle={{
          fontWeight: sdStyles.SDFontMedium,
          fontSize: CSS.textSize(28),
        }}
        onPress={this.navToNews}
        title={"发现动态"}
      />
      <Text
        style={{
          fontSize: CSS.textSize(20),
          color: sdStyles.SDFontColorSubtitle
        }}
      >
        {`有${this.props.dynamic.count}条新的动态`}
      </Text>
    </View>);
  
    // const Dynamic = () => {
    //   if(!this.props.dynamic.count) {
    //     return null
    //   } else {
    //     return (<View
    //       style={{
    //         alignItems: "center",
    //         paddingTop: CSS.pixel(40, true),
    //         paddingBottom: CSS.pixel(30, true),
    //         height: CSS.pixel(150, true),
    //         backgroundColor: "#fff",
    //         position: 'relative'
    //       }}
    //     >
    //     {isFetchingDynamic &&<View style={{alignItems: "center",justifyContent:'center', width:'100%',position:'absolute', zIndex:1, height: CSS.pixel(150, true)}}><ActivityIndicator animating={isFetchingDynamic}/></View>}
    //       <SDButton
    //         style={{
    //           height: CSS.pixel(50, true),
    //           zIndex: 7,
    //           backgroundColor: sdStyles.SDMainColor,
    //           borderRadius: CSS.pixel(50, true),
    //           width: CSS.pixel(204),
    //           position: "relative",
    //           marginBottom: CSS.pixel(10, true)
    //         }}
    //         btnStyle={{
    //           fontWeight: sdStyles.SDFontMedium,
    //           fontSize: CSS.textSize(28),
    //         }}
    //         onPress={this.navToNews}
    //         title={"发现动态"}
    //       />
    //       <Text
    //         style={{
    //           fontSize: CSS.textSize(20),
    //           color: sdStyles.SDFontColorSubtitle
    //         }}
    //       >
    //         {`有${this.props.dynamic.count}条新的动态`}
    //       </Text>
    //     </View>)
    //   }
    // }
    const NoData = (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: CSS.height() - CSS.pixel(500, true)
        }}
      >
        <Image
          source={require("@img/rank/rank_pic_No_concern.png")}
          style={{ marginBottom: 30 }}
        />
        <Text style={{ color: "#aaa", fontSize: CSS.textSize(34) }}>
          当前暂未关注任何人
        </Text>
      </View>
    )
    // 长度为1时，只有我自己的信息
    if (userArray.length === 1 && (this.state.isFetching === false)) {
      // this.refs['sd_scrollview'] &&this.refs['sd_scrollview'].setRefreshState(RefreshState.Idle)
      return (
        <View>{NoData}</View>
      )
    }
    const Header = (
      <View style={{marginBottom: CSS.pixel(30, true), backgroundColor: "#fff",}}>
        {/* <Touchable> */}
        <Dynamic />
        {/* </Touchable> */}
        {/* </SectionView> */}
        {/* {(this.props.dynamic.count > 0) && <SectionViewSeparator style={{ height: CSS.pixel(10, true), backgroundColor: sdStyles.SDBGColorMain }} />} */}
        {<SectionViewSeparator style={{ height: CSS.pixel(10, true), backgroundColor: sdStyles.SDBGColorMain }} />}
        <View
          style={{
            alignItems: "center",
            backgroundColor: "#fff",
            paddingTop: CSS.pixel(30, true)
          }}
        >
          <Text style={{ color: sdStyles.SDFontColorSubtitle, fontSize: CSS.textSize(24) }}>
            {`当前职么力`}
            <Text style={{fontWeight: sdStyles.SDFontBold, color: '#333'}}>{formatPower(userPower)}{'分'}</Text>
            {`，在我关注的人中排名`}
            <Text style={{fontWeight: sdStyles.SDFontBold, color: '#333'}}>第{currentRank}{`位`}</Text>
          </Text>
        </View>
        {<NormalizeChart
          loading={this.state.chartLoading}
          nodata={this.state.chartData.length===0}
          data={this.state.chartData || []}
          selectedValue={userPower}
          style={{ backgroundColor: "#fff" }} />}
        <SectionViewSeparator />
      </View>
    );
    const ScrollCompWithHeader = (
      <View>
        <View
          style={[
            sdStyles.default.center,
            sdStyles.default.separator,
            {
              height: CSS.pixel(80),
              backgroundColor: "#fff"
            }
          ]}
        >
          <Text
            style={{
              fontSize: CSS.textSize(24),
              fontWeight: sdStyles.SDFontMedium,
              color: sdStyles.SDFontColorSubtitle
            }}
          >
            -关注列表排名-
          </Text>
        </View>
          <UserList
            users={userArray}
            onFollowPress={this.handleItemFollowClick}
          />
      </View>
    );
    return (
      <SDScrollView
        ref={'sd_scrollview'}
        styles={{
          backgroundColor: sdStyles.SDBGColorMain
        }}
        onHeaderRefresh={() => { return this.onRefresh(1)}}
        onFooterRefresh={this.onRefresh}
        >
        {(userArray.length > 1) && (
          <ScrollView>{Header}{ScrollCompWithHeader}</ScrollView>
        )}
        {(userArray.length === 1 && (this.state.isFetching === false)) &&(<View>{NoData}</View>)}
      </SDScrollView>
    )
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({
  userPower: getUserPower(state, props),
  // data: getWatchesAndMyOwnInfo(state, props),
  data: getRankWatchUserArray(state, props),
  dynamic: getRankDynamic(state, props)
}))(RankTabTwo));
