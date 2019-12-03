import React from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image
} from "react-native";
import PropTypes from "prop-types";
import TitleWrap from "../../../sd_titleWrap/TitleWrap";
import {
  LineChart,
  ThreeCircleChart,
  SlicedPieChart,
  AreaChart,
  NormalizeChart,
  BarChart,
  BigDataChart
} from "../../../sd_charts/index";
import * as sdStyles from "@src/styles";
import { CSS } from "../../../common/SDCSS";
import chartConfig from "@src/sd_charts/chartConfig";
import { navLightBox } from "../../../styles";
import SelectRangeDate from "../../lightBoxScreen/SelectRangeDate";
import ConnectWithActions from "../../../connectWithActions";
import { getUserAllInfo } from "../../../users/usersSelector";
import GrowTargetSwitch from "@sd_components/GrowTargetSwitch";
import SDButton from "@sd_components/SDButton";
import { refreshJobPlanListAction } from "@utils/funcs";
import { getJobPlanList, getTaskChart } from "@api/index";
import {
  getPowerTrendChartDataSelector,
  getSalaryIncreaseRecordChartDataSelector
 } from "./ExpDetailScreenSelectors";
import moment from "moment";
import { formatPower } from "../../../utils/user";
import { SDSafeAreaScrollView, SectionView, SectionViewSeparator } from '../../../common'
import { currentJobPlan, getTaskTotalTrendChartData, getUserRegisterTime } from "@src/selectors";
import TopYellowItem from "./TopYellowItem"
import TrackRecordScreen from "@src/screens/pushScreen/trackRecord/TrackRecordScreen";
import { navScreen, navRightButton } from "@styles";

// 取假数据
const defaultData = chartConfig.chartOption.datasets;// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f3f3"
  }
});
let expDetailScreenContext = null
const now = new Date();
const now_add_7_day = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7);
const now_add_5_month = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30 * 5);
// 模拟用户注册时间 2018-08-01
// const userRegisterTime = new Date(2018, 0, 1);
// 职么力页面
class ExpDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    const userRegisterTime = new Date(props.userRegisterTime.slice(0,4),props.userRegisterTime.slice(5,7)-1,props.userRegisterTime.slice(8,10));
    this.state={
      // 任务统计趋势图表
      loadingTaskTotalTrendChart: false,
      endTimeTaskTotalTrendChart: now,
      // +7天
      startTimeTaskTotalTrendChart: now_add_7_day < userRegisterTime ? userRegisterTime : now_add_7_day,
      // 任务统计图表
      loadingTaskTotalChart: true,
      totalCount: 0,
      weekCount: 0,
      dayCount: 0,
      // 职么力成长趋势
      loadingPowerTrendChart: true,
      endTimePowerTrendChart: now,
      // +5个月
      startTimePowerTrendChart: now_add_5_month < userRegisterTime ? userRegisterTime : now_add_5_month,
      // 薪资增长趋势
      loadingSalaryIncreaseRecordChart: true,
      // 用户注册时间
      registerTime: userRegisterTime
    }
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };

  componentDidMount() {
    // return
    expDetailScreenContext = this
    const {taskTotalTrendChartData} = this.props
    //检查是否有职业规划
    refreshJobPlanListAction(this);
    // if(taskTotalTrendChartData.length === 0) {
    //   this.handleUpdateTaskTotalTrendChart()
    // }
    this.handleUpdateTaskTotalTrendChart()
    this.fetchTaskTotal()
    this.fetchPowerTrend()
    this.fetchSalaryIncreaseRecord()
  }

  componentWillReceiveProps(nextProps) {

    // if(nextProps.powerTrendChartData.length !== 0) {
    //   this.setState({
    //     loadingPowerTrendChart: false
    //   })
    // }
    // 请求到薪资增长的数据
    // if(nextProps.salaryIncreaseRecordChartData.length !== 0) {
    //   this.setState({
    //     loadingSalaryIncreaseRecordChart: false
    //   })
    // }
  }

  // 获取薪资增长趋势
  fetchSalaryIncreaseRecord = () => {
    this.setState({
      loadingSalaryIncreaseRecordChart: true
    })
    this.props.actions.getSalaryIncreaseRecordChartData({}).then(
      res => {
        this.setState({
          loadingSalaryIncreaseRecordChart: false
        })
      }
    ).catch(
      e => {
        this.setState({
          loadingSalaryIncreaseRecordChart: false
        })
      }
    )
  }
  // 获取职么力成长趋势
  fetchPowerTrend = () => {
    const { startTimePowerTrendChart, endTimePowerTrendChart } = this.state
    this.setState({
      loadingPowerTrendChart: true
    })
    const params = {
      start_date: moment(startTimePowerTrendChart).format('YYYY-MM-01'),
      // 加一月来进行显示
      end_date: moment(endTimePowerTrendChart).add(1, 'month').format('YYYY-MM-01')
      // end_date: moment(endTimePowerTrendChart).add(1,'month').format('YYYY-MM-DD')
    }
    this.props.actions.getPowerTrendChartData(params).then(
      res => {
        this.setState({
          loadingPowerTrendChart: false
        })
      }
    ).catch(
      e => {
        this.setState({
          loadingPowerTrendChart: false
        })
      }
    )
  }
  // 获取任务统计
  fetchTaskTotal = () => {
    this.setState({
      loadingTaskTotalChart: true
    })
    getTaskChart({}).then(
      res => {
        console.log('ly88','getTaskChart', res )
        if(res.status === 'ok') {
          this.setState({
            loadingTaskTotalChart: false,
            totalCount: res.results.total_count,
            weekCount: res.results.week_count,
            dayCount: res.results.day_count,
          })
        } else {
          this.setState({
            loadingTaskTotalChart: false
          })
        }
      }
    ).catch(
      e => {
        this.setState({
          loadingTaskTotalChart: false
        })
      }
    )
  }
  // 请求任务统计趋势图表
  fetchTaskTotalTrendChart = () => {
    const { startTimeTaskTotalTrendChart, endTimeTaskTotalTrendChart } = this.state
    const params = {
      start_date: moment(startTimeTaskTotalTrendChart).format('YYYY-MM-DD'),
      // end_date: moment(endTimeTaskTotalTrendChart).format('YYYY-MM-DD')
      end_date: moment(endTimeTaskTotalTrendChart).add(1,'day').format('YYYY-MM-DD')
    }
    return new Promise((resolve, reject) => {
      this.props.actions.getTaskTotalTrendChartData(params).then(
        res => {
          console.log('ly88', 'getTaskTotalTrendChartData', res)
          if(res.status === 'ok') {
            resolve()
          } else {
            reject()
          }
        }
      ).catch(
        e => {
          reject(e)
        }
      )
    })
  }
  // 更新职么力成长趋势图表
  handleUpdatePowerTrendChart = (start_time, end_time) => {
    this.setState({
      startTimePowerTrendChart: start_time || this.state.startTimePowerTrendChart,
      endTimePowerTrendChart: end_time || this.state.endTimePowerTrendChart,
      loadingPowerTrendChart: true
    }, () => {
      this.fetchPowerTrend()
      // .then(
      //   () => {
      //     this.setState({
      //       loadingPowerTrendChart: false
      //     })
      //   }
      // ).catch(
      //   e => {
      //     console.log(e)
      //     this.setState({
      //       loadingPowerTrendChart: false
      //     })
      //   }
      // )
    })
  }

  handleUpdateTaskTotalTrendChart = (start_time, end_time) => {
    this.setState({
      startTimeTaskTotalTrendChart: start_time || this.state.startTimeTaskTotalTrendChart,
      endTimeTaskTotalTrendChart: end_time || this.state.endTimeTaskTotalTrendChart,
      loadingTaskTotalTrendChart: true
    }, () => {
      this.fetchTaskTotalTrendChart().then(
        () => {
          this.setState({
            loadingTaskTotalTrendChart: false
          })
        }
      ).catch(
        e => {
          console.log(e)
          this.setState({
            loadingTaskTotalTrendChart: false
          })
        }
      )
    })
  }
  // 格式化任务统计趋势图表数据
  formatTaskTotalTrendChart = () => {
    const { taskTotalTrendChartData } = this.props;
    const { startTimeTaskTotalTrendChart } =this.state
    // 需要去掉一条多余的数据
    return taskTotalTrendChartData.slice(0,-1).map((item, index) => {
      return {
        // x: moment(startTimeTaskTotalTrendChart).add(index, 'day').format('M月D号'),
        x: moment(startTimeTaskTotalTrendChart).add(index, 'day').format('M.D'),
        y: item
      }
    })
  }
  // 格式化职么力成长趋势图表数据
  formatPowerTrendChart = () => {
    const { powerTrendChartData } = this.props;
    if(powerTrendChartData.length === 0){
      return []
    }
    return powerTrendChartData.map((item, index) => {
      return {
        x: moment(item.month).format('YYYY.M'),
        y: Math.round(item.number)
      }
    })
  }
  // 格式化薪资增长趋势图表数据
  formatSalaryIncreaseRecordChart = () => {
    return;
    const { salaryIncreaseRecordChartData } = this.props;
    const data_real_list = salaryIncreaseRecordChartData.real_list.map((item, index) => {
      return {
        // x: moment(item.created_time).format('YYYY.M'),
        // y: Math.round(item.number),
        x: '2010' + index,
        y: item.number
        // y: Math.round(item.number)
      }
    })
    const virtual_list = salaryIncreaseRecordChartData.virtual_list.map((item, index) => {
      return {
        // x: moment(item.created_time).format('YYYY.M'),
        // y: Math.round(item.number),
        x: '2010' + index,
        y: item.number
        // y: Math.round(item.number)
      }
    })
    return [data_real_list, virtual_list]
  }
  // 控制加载时间
  render () {
    // return (
    //   <SlicedPieChart
    //     data={chartConfig.chartOption.datasets.pie[0]}
    //     pieColors={chartConfig.chartOption.props.pie.pieColorScalePurple}
    //     onItemPress={item => {
    //       console.warn(item);
    //     }}
    //   />
    // )
    // return (<BigDataChart maxPoints={120} />)
    return this._render()
  }

  onPressMakeResume(){
    this.context.navigator.push(
      navScreen("PushScreen", "我的履历", {
        passProps: {
          screen: () => <TrackRecordScreen />,
          fullScreen: true,
          noScrollView: true,
          header: {
            title: "我的履历",
          },
          navigatorButtons: {
            rightButtons: [
              {
                icon: () => <Image source={require("@img/salary/home_ico_share02.png")}/>,
                id: "track_share"
              }
            ]
          }
        }
      }),
    );
  }

  _render() {
    const { user, taskTotalTrendChartData, powerTrendChartData, salaryIncreaseRecordChartData } = this.props;
    const {
      loadingTaskTotalTrendChart,
      startTimeTaskTotalTrendChart,
      endTimeTaskTotalTrendChart,
      loadingTaskTotalChart,
      loadingPowerTrendChart,
      startTimePowerTrendChart,
      endTimePowerTrendChart,
      loadingSalaryIncreaseRecordChart,
      registerTime
     } = this.state;
    const formattedTaskTotalTrendChartData = this.formatTaskTotalTrendChart()
    const formattedPowerTrendChartData = loadingPowerTrendChart ? [] : powerTrendChartData;
    const formattedSalaryIncreaseRecordChartData = loadingSalaryIncreaseRecordChart ? [] : salaryIncreaseRecordChartData
    console.log('ly88', 'formattedPowerTrendChartData', formattedPowerTrendChartData)
    console.log('ly88', 'formattedTaskTotalTrendChartData', formattedTaskTotalTrendChartData)
    console.log('ly88', 'formattedSalaryIncreaseRecordChartData', formattedSalaryIncreaseRecordChartData)
    return (
      <SDSafeAreaScrollView style={styles.container}>
        <View style={{
          backgroundColor: '#fff',
          marginBottom: CSS.pixel(30, true),
          }}>
          <TopYellowItem style={{
            marginHorizontal:CSS.pixel(30),
            marginTop:CSS.pixel(10),
            marginBottom:CSS.pixel(0),
          }}/>

          <SDButton
                style={{
                  width: CSS.pixel(690),
                  marginTop: Platform.OS == "android" ? CSS.pixel(0, true) : CSS.pixel(0, true),
                  //backgroundColor: '#fff',
                  borderWidth: 0,
                  borderColor: sdStyles.SDMainColor,
                }}
                btnStyle={{
                    fontSize: CSS.textSize(24),
                    color: sdStyles.SDMainColor,
                    fontWeight: sdStyles.SDFontMedium,
                    textAlign: 'center',
                 }}
                onPress={this.onPressMakeResume.bind(this)}
                title="完善履历 提升职么力 >>"
              />

        </View>
        {/* <BigDataChart maxPoints={120} /> */}
        {/* 职么力成长趋势 */}
        <SectionView
        title={'职么力成长趋势'}
        right={<TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end"
          }}
          onPress={() => {
            navLightBox("LightBoxScreen", {
              passProps: {
                screen: () => <SelectRangeDate
                distance={9}
                defaultMinTime={registerTime}
                defaultMaxTime={new Date()}
                startTime={startTimePowerTrendChart}
                endTime={endTimePowerTrendChart}
                mode="month"
                onOk={this.handleUpdatePowerTrendChart}
                />
              }
            })
          }}
        >
          <Text style={{fontSize: CSS.textSize(22),paddingRight: CSS.pixel(16)}}>
            {/* 2017年5月-2017年9月 */}
            {moment(startTimePowerTrendChart).format('YYYY年M月')}-{moment(endTimePowerTrendChart).format('YYYY年M月')}
          </Text>
          <Image source={require("@img/home/home_ico_date.png")}/>
        </TouchableOpacity>}>
        {/* 图表 */}
          <View style={{ paddingTop: CSS.pixel(20) }}>
            <LineChart
              height={CSS.pixel(425)}
              loading={loadingPowerTrendChart}
              copyNode={this.props.powerTrendChartData.length === 1}
              data={[formattedPowerTrendChartData.map((item, index) => {
                return item
              })]}
              categary={formattedPowerTrendChartData.map(item=>item.x+'')}
              yLabel="单位：分"
              // data={[defaultData.line[0]]}
              // categary={defaultData.line[0].map(item=>item.x+'')}
              lineColors={["#00adfe"]}
              withZoom={formattedPowerTrendChartData.length >= 5}
              // withZoom={true}
              toolTipFormat={(d) => {
                if((d.key) && (d.key.indexOf('copy') > -1)) return null
                // 职么力
                return `${formatPower(d.y)}`
              }}
            />
            {/* test */}
            {/* 本学校，本专业数据 */}
            {/* <LineChart
            data={[defaultData.line[1], defaultData.line[1].map((d) => {return{x:d.x,y:d.x===4?0:d.y+2000}}).filter(item=>item.x!==4)]}
            yLabel="薪资单位：分"
            xLabel="毕业年份"
            lineColors={['#fed200', '#fe8900']}
            legend={['本科生','研究生']}
            categary={[0,1,2,3,4,5,6,7,8,9,10]}
             /> */}
            {/* <LineChart
            data={[defaultData.line[1].map((d) => {return{x:d.x,y:d.y+5000}}),defaultData.line[1], defaultData.line[1].map((d) => {return{x:d.x,y:d.y+2000}})]}
            yLabel="薪资单位：分"
            xLabel="毕业年份"
            lineColors={['#fed200', '#cf4cff', '#834cff']}
            legend={['本科生','研究生','留学生']}
            showLegend={true}
             /> */}
          </View>
        </SectionView>
        <SectionViewSeparator/>
        {/* 预估薪资增长趋势 */}
        <SectionView
        title={'预估薪资增长趋势'}
        >
        {/* <GrowTargetSwitch/> */}
          {/* 有目标才会显示 */}
          {(this.props.currentJobPlan.position.title?true:false) && <GrowTargetSwitch
            twoLinkStyle={{paddingHorizontal:CSS.pixel(30)}}
            hasGoal={this.props.currentJobPlan.position.title ? true : false}
            goalName={this.props.currentJobPlan.position.title}
            onSetTarget={() => {
              // this.context.refs["_growScreen"].onPressAddPath()
            }}
            twoLinkStyle={{
              paddingLeft: CSS.pixel(26),
            }}
          />}
          {/* 图表 */}
          {<View style={{ paddingTop: CSS.pixel(this.props.currentJobPlan.position.title?0:30) }}>
            <LineChart
              loading={loadingSalaryIncreaseRecordChart}
              // data={[
              //   defaultData.line[1].slice(0, 5),
              //   defaultData.line[1]
              //     .map(d => {
              //       let d_copy = Object.assign({}, d);
              //       d_copy.key = d.key + 2000;
              //       return d_copy;
              //     })
              //     .slice(0, 4)
              // ]}
              // categary={[
              //   "2011年\n大一",
              //   "2012年\n大二",
              //   "2013年\n大三",
              //   "2014年\n大四",
              //   "就业"
              // ]}
              height={CSS.pixel(410)}
              data={loadingSalaryIncreaseRecordChart ? [[],[]] : this.props.currentJobPlan.position.title ?
                [ formattedSalaryIncreaseRecordChartData.concat({x:'就业', y: 10000, key: '就业_10000'}), formattedSalaryIncreaseRecordChartData] :
                [ [], formattedSalaryIncreaseRecordChartData] }
              categary={(this.props.currentJobPlan.position.title ?
                formattedSalaryIncreaseRecordChartData.map(item => item.x).concat("就业") : formattedSalaryIncreaseRecordChartData.map(item => item.x)).concat('')
              }
              yLabel="单位：元"
              lineColors={[ "#d0d0d0", "#00eea2"]}
              type="trend"
              toolTipFormat={d =>{
                // console.log('ly88', 'toolTipFormat', d)
                if(d.key.indexOf('copy') > -1) {
                  return null
                }
                if(d.x === '就业') {
                  return `  ${this.props.currentJobPlan.position.title}  \n￥${d.y}`
                }
                return `￥${d.y}`}
              }
              maxValuePixel={2}
            />
          </View>}
        </SectionView>
        <SectionViewSeparator/>
        {/* 任务统计 */}
        <SectionView
          style={{
            borderBottomColor: "#efefef",
            borderBottomWidth: 1,
            paddingBottom: 0
          }}
          title={'任务统计'}>
            <View
            style={{
              flexDirection: "row",
              borderBottomColor: "#e1e1e1",
              borderBottomWidth: 1,
              paddingVertical: CSS.pixel(24)
            }}
          >
            <ThreeCircleChart
            data={[
              {
                key: `ThreeCircleChart_100`,
                text: `${this.state.totalCount}`,
                label: "完成总数",
              },
              {
                key: `ThreeCircleChart_101`,
                text: `${this.state.weekCount}`,
                label: "本周完成数"
              },
              {
                key: `ThreeCircleChart_102`,
                value: 100,
                text: `${parseInt(this.state.dayCount*100,10)/100}`,
                label: "日平均数"
              }
            ].map(item => {return {...item, height: CSS.pixel(140)}})}
            loading={loadingTaskTotalChart}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: CSS.pixel(20, true)
            }}
          >
            <View
              style={{
                height: CSS.pixel(20, true),
                borderLeftColor: "#fff",
                borderLeftWidth: 2,
                width: 1
              }}
            />
            <View style={{ width: CSS.pixel(240, true), marginLeft: CSS.pixel(28) }}>
              <Text style={{ fontSize: CSS.textSize(24), color: "#999" }}>常用任务</Text>
            </View>
          </View>
          <View
            style={{
              // borderBottomColor: "#efefef",
              // borderBottomWidth: 1,
              flex:1
            }}
          >
            {/* 图表 */}
            <SlicedPieChart
              // loading={true}
              data={[
                { x: "职场技能", y: user.total.tech_count },
                { x: "证书考取", y: user.total.certificate_count },
                // { x: "职场技能", y: 20 },
                // { x: "证书考取", y: 40 },
                // { x: "每日打卡", y: user.total.punch_count}
              ]}
              height={CSS.pixel(240)}
              pieColors={chartConfig.chartOption.props.pie.pieColorScaleBlue}
              type="small"
              onItemPress={item => {
                console.log(item);
              }}
            />
            {/* <SlicedPieChart
              data={chartConfig.chartOption.datasets.pie[0]}
              pieColors={chartConfig.chartOption.props.pie.pieColorScalePurple}
              height={CSS.pixel(500)}
              onItemPress={item => {
                //console.warn(item);
              }}
            />  */}
          </View>
        </SectionView>
        {/* <SectionViewSeparator/> */}
        <SectionView
        title={"任务统计趋势图"}
        withTitleLeftIcon={false}
        right={(
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end"
            }}
            onPress={() => {
              navLightBox("LightBoxScreen", {
                passProps: {
                  screen: () => <SelectRangeDate
                  distance={9}
                  unit={'day'}
                  defaultMinTime={registerTime}
                  defaultMaxTime={new Date}
                  startTime={startTimeTaskTotalTrendChart}
                  endTime={endTimeTaskTotalTrendChart}
                  mode="date"
                  onOk={this.handleUpdateTaskTotalTrendChart}/>
                }
              })
            }}
          >
            <Text style={{ color: "#333", fontSize: CSS.textSize(22), paddingRight: CSS.pixel(10) }}>
            {moment(startTimeTaskTotalTrendChart).format('YYYY年MM月DD号')}-{moment(endTimeTaskTotalTrendChart).format('YYYY年MM月DD号')}
              {/* 2017年5月1号-2017年9月1号 */}
            </Text>
            <Image source={require("@img/home/home_ico_date.png")}/>
          </TouchableOpacity>)}>
          {<View style={{
              width: CSS.pixel(240),
              marginLeft: CSS.pixel(40),
              marginTop: CSS.pixel(15)
            }}
          >
            <Text style={{fontSize: CSS.textSize(24), color: "#999" }}>任务数</Text>
          </View>}
          <View>
            {/* 面积图 */}
            <AreaChart
              height={CSS.pixel(400)}
              loading={loadingTaskTotalTrendChart}
              data={formattedTaskTotalTrendChartData || []}
              categary={formattedTaskTotalTrendChartData.map(item => item.x)}
              withZoom={formattedTaskTotalTrendChartData.length>6}
            />
          </View>
        </SectionView>
      </SDSafeAreaScrollView>
    );
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({
  user: getUserAllInfo(state, props),
  currentJobPlan: currentJobPlan(state, props),
  taskTotalTrendChartData: getTaskTotalTrendChartData(state, props),
  //taskTotalTrendChartData: state.taskTotalTrendChartData,
  powerTrendChartData: getPowerTrendChartDataSelector(state),
  salaryIncreaseRecordChartData: getSalaryIncreaseRecordChartDataSelector(state),
  userRegisterTime: getUserRegisterTime(state, props)
}))(
  ExpDetailScreen
));

