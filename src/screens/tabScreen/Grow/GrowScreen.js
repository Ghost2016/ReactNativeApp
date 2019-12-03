import React from "react";
import {
  View,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
  ImageBackground,
  FlatList,
  //ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import { navScreen, navRightButton, navLightBox } from "@styles";
//import { DatePicker, List } from "antd-mobile";
//import SDTabs from "@sd_components/SDTabs";
import SDTabs2 from "@sd_components/SDTabs2";

import * as sdStyles from "@styles";
import SDRow from "@sd_components/SDRow";
import IntlText from "@sd_components/IntlText";
import UnderlineText from "@sd_components/UnderlineText";
import * as navHelper from "@utils/navigationHelper";
import { getUserAllInfo } from "@src/users/usersSelector";
import store from "../../../boot/store";
import { login as loginActions } from "../../../boot/actions";
import config from "../../../config";
import { actionBackToLogin } from "../../../devHelper";
//import ScroeChartWrap from "../../../sd_scroechartwrap/Scroechartwrap";
import TaskCount from "../../../sd_taskcount/TaskCount";
import PowerNSalary from "@sd_components/PowerNSalary";

import { CSS } from "@common/SDCSS";
import { Navigation } from "react-native-navigation";
//import FootSpace from "@sd_components/FootSpace";
//import ButtonSection from "@sd_components/ButtonSection";
import GrowingPath from "@sd_components/GrowingPath";
import GrowGoalList from "@sd_components/GrowGoalList";
import { getJobPlanList } from "@api/index";
import { Toast } from "antd-mobile";
import { JOB_PLAN_TYPES } from "@src/nullObjects";
import GrowLightenRoad from "@sd_components/GrowLightenRoad";
import GrowTargetSwitch2 from "@sd_components/GrowTargetSwitch2";
import TitleWrap from "@src/sd_employmentinfo/titlelistwarp/TitleWrap";
import StudentShare from "@src/screens/pushScreen/studentShare/StudentShare";
import StudentShareWithGoal from "@src/screens/pushScreen/studentShare/StudentShareWithGoal";
import { refreshJobPlanListAction, refreshPowerAction, prepareShareData, shareToWxTimeLine } from "@utils/funcs";
import SDPullDownRefresh from "@sd_components/SDPullDownRefresh";
import SDSubtitle from "@sd_components/SDSubtitle";
import SDButton from "@sd_components/SDButton";
import GrowCheckinCalendar from "@sd_components/GrowCheckinCalendar";
import SDIcon from "@sd_components/SDIcon";
import SDSection from "@sd_components/SDSection";
import { getPowerWeek } from "@utils/funcs"
import { currentJobPlan, getUserTaskCount, getUserPowerSalary } from "@src/selectors";

import GrowCheckin from "@sd_components/GrowCheckin";
import GrowCheckinCert from "@sd_components/GrowCheckinCert";
import GrowCheckinSkill from "@sd_components/GrowCheckinSkill";
import GrowingFuture from "@sd_components/GrowingFuture";
import { SDStatusBar } from '@common';
import SchoolDetail from "@src/screens/pushScreen/searchData/tabs/SchoolDetail";
import MajorDetail from "@src/screens/pushScreen/searchData/tabs/MajorDetail";
import JobDetail from "@src/screens/pushScreen/searchData/tabs/JobDetail";
import IndustryDetail from "@src/screens/pushScreen/searchData/tabs/IndustryDetail";
import SDTabBar from "../../../common/SDTabBar";
import MobStat from "../../../boot/MobStat";
import ListItem from "@src/sd_directinfo/infolist/ListItem";
import LiveCourseListScreen, { LiveCourseItem } from "@src/screens/pushScreen/liveCourse/LiveCourseListScreen";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  sdTabs: {
    borderWidth: 0,
    borderColor: '#f00',
    //backgroundColor: '#ccc',
  }
});

// 成长页面
class GrowScreen extends React.Component {
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    //this.onPressCheckin = this.onPressCheckin.bind(this)
  }

  initItemData(){
    return [
          {
            key: 0,
            title: "职场技能",
            caption: "职场必备技能，让你脱颖而出",
            icon: require("@img/grow/growing_ico_job.png"),
            desc_before: "已攻破技能",
            desc_days: this.props.getUserTaskCount.total.tech_count || 0,
            desc_after: "项"
          },
          {
            key: 1,
            title: "证书考取",
            caption: "技多不压身",
            icon: require("@img/grow/growing_ico_certificate.png"),
            desc_before: "已考取证书",
            desc_days: this.props.getUserTaskCount.total.certificate_count || 0,
            desc_after: "个"
          }
        ];
  }

  state = {
    hasGoal: false,
    goalName: '',
    startIndex: 0,
    checkinData: [],
    newsData: [],
    courseData: [],
    hasPositionArticle: false,
  };

  setHasGoal(v = false) {
    console.log("setHasGoal", 1);
    this.setState({
      hasGoal: v
    });
  }

  componentWillMount(nextProps) {
    //console.log("this.props.startWithIndex", this.props.startWithIndex)
    if (this.props.hasOwnProperty("startWithIndex")) {
      this.setState({
        startIndex: this.props.startWithIndex
      });
    }
  }

  componentWillReceiveProps(nextProps){
    console.log("nextProps.currentJobPlan===", nextProps.currentJobPlan)
    /* if (nextProps.skillState != this.props.skillState) {
      this.setState({
        desc_days: Object.keys(nextProps.skillState).map(k=>{
          return nextProps.skillState[k].done || 0;
        }).reduce((n,c)=>(n+c),0),
      })
    }
    if (nextProps.certState != this.props.certState) {
      this.setState({
        desc_days: Object.keys(nextProps.certState).map(k=>{
          return nextProps.certState[k].done || 0;
        }).reduce((n,c)=>(n+c),0),
      })
    } */
    if (nextProps.currentJobPlan.position.title != this.props.currentJobPlan.position.title) {
      this.setState({
        hasGoal: nextProps.currentJobPlan.position.title ? true : false,
        goalName: nextProps.currentJobPlan.position.title,
      });
    }
  }

  onPressShare = data => {
    //console.log("onPressShare data===", data)
    shareToWxTimeLine(prepareShareData({
      content: "测试分享"
    }, this.props.userInfo, "测试目标"))
  };
  componentWillUnmount() {
    MobStat.onPageEnd("成长")
  }

  getArticles(){
    return new Promise((resolve)=>{
      this.props.actions.getNewsAction({
        size: 2,
        page: 1,
      })
      .then(res => {
        console.log("getNewsAction==", res)
        if (res.status == "ok") {
          this.setState({
            newsData: res.results,
          });
        }
      });

      this.props.actions.getLiveListAction({
          size: 2,
          page: 1,
        })
        .then(res => {
          if (res.status == "ok") {
            this.setState({
              courseData: res.results,
            });
          }
        });

      this.props.actions
      .getNewsAction({
        size: 10,
        page: 1,
        position_id: this.props.currentJobPlan.position.id,
      })
      .then(res => {
        if (res.status == "ok" && res.count) {
          this.setState({
            hasPositionArticle: true,
          });
        }
      });
      resolve(true)
    })

  }

  async componentDidMount() {
    MobStat.onPageStart("成长");
    console.log("this.props.userInfo===", this.props.userInfo)
    /*
    console.log("prepareShareData===", prepareShareData({
      content: "测试分享"
    }, this.props.userInfo, "测试目标")) */

    console.log("currentJobPlan=====", this.props.currentJobPlan)
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );

    this.props.actions.stateSkillListAction({}, res => {}).then(res => {
      this.props.actions.setSkillStateState(res.results)
    })
    this.props.actions.stateCertListAction({}, res => {}).then(res => {
      this.props.actions.setCertStateState(res.results)
    })

    await this.getArticles()

    //通过ref访问 growScreen
    this.context.refs["_growScreen"] = this;

    //跳转到tab职业规划
    /* if (this.props.hasOwnProperty("startWithIndex")) {
      this.setHasGoal(false);
    } */
    /*this.context.refs["_currentTabs"].setState({
      currentTab: 1,
    })*/

  }

  refreshNewsData() {
    this.props.actions.getNewsAction({
      size: this.state.newsData.length,
      page: 1,
    })
    .then(res => {
      if (res.status == "ok") {
        this.setState({
          newsData: res.results,
        });
      }
    }).catch(err =>{

    });
  }

  async onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      //if (config.isDev) actionBackToLogin(store, loginActions, event, "login");
    } else if (event.id == "didAppear") {

      //检查是否有职业规划
      refreshJobPlanListAction(this);
    }
  }

  handleTabChange(index) {
    console.log("onChange tab", index);
    this.setState({
      startIndex: index,
    })
  }

  onPressImprove() {
    console.log("onPressImprove");
    navHelper.navOpen(this.context.navigator, "push", {
      name: "GrowGoalScreen",
      title: "我的目标"
      //tabBarHidden: true
    });
  }

  //点亮路径
  onPressLighten(index, title) {
    console.log("onPressLighten", index, title);
    let trgName = "求职";
    if (index == 0) {
      Toast.fail("请点击选择规划路线，再进行下一步");
      return;
    }
    if (index <= JOB_PLAN_TYPES.length && index >= 1) {
      trgName = JOB_PLAN_TYPES[index - 1];
    } else {
      Toast.fail("请点击选择规划路线，再进行下一步");
      return;
    }
    this.context.navigator.push(
      navScreen("PushScreen", "定制目标", {
        passProps: {
          screen: () => <GrowLightenRoad target={trgName} />,
          header: {
            title: "定制目标"
          }
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存"),
      })
    );
  }

  // 切换目标
  onPressChangeGoal() {
    console.log("onPressChangeGoal");
    navHelper.navOpen(this.context.navigator, "push", {
      name: "GrowGoalScreen",
      title: "我的目标"
      //tabBarHidden: true
    });
  }

  onPressAddPath(results = null, index = 1) {
    if (results) {
      this.props.actions.getJobPlanListAction(results);
    }

    /* this.setState({
      startIndex: index
    }); */

    this.context.navigator.push(
      navScreen("PushScreen", "生涯规划", {
        passProps: {
          screen: () => <GrowingFuture />,
          fullScreen: true,
          header: {
            title: "生涯规划",
            //取消默认header，定制黄色header
            fixed: true,
          }
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存"),
      })
    );

  }

  /* changeTopTab(index){
    console.log("this.props.changeTopTab", index, this)
    this.setState({
      startIndex: index
    });
  } */

  //打卡详情
  onPressCheckinDetail() {
    navHelper.navOpen(this.context.navigator, "push", {
      name: "GrowCheckinCalendarScreen",
      title: "每日打卡"
      //tabBarHidden: true
    });
    /*Navigation.push({
    screen: "example.GrowCheckinCalendarScreen",
    style: {
      backgroundBlur: "none",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      tapBackgroundToDismiss: true
    }
  });*/
  }

  //每日打卡
  onPressCheckin(type) {
    console.log("onPressCheckin" + type);
    //navHelper.snackBar(this.context.navigator, "onPressCheckin: " + type);
    /*this.context.navigator.showSnackbar({
      text: 'onPressCheckin: ' + type
    });*/
    if (type === "每日打卡") {
      navLightBox("LightBoxScreen", {
        passProps: {
          screen: () => <GrowCheckin style={{
            position: 'absolute',
            top: '7%',
            left: 0,
            width: '98%',
            height: '90%',
          }} />
        }
      });
    } else if (type === "证书考取") {
      this.context.navigator.push(
        navScreen("PushScreen", "证书考取", {
          passProps: {
            screen: () => <GrowCheckinCert />,
            fullScreen: true,
            header: {
              title: "证书考取",
              //fixed: true,
            }
          },
          //...navRightButton("save_addLearnedCourseBtn", "保存"),
        })
      );
      /* navHelper.navOpen(this.context.navigator, "push", {
        name: "GrowCheckinCertScreen",
        title: "证书考取",
        //tabBarHidden: true
        navBarHidden: true,
        tabBarHidden: true // 隐藏tab
      }); */
    } else if (type === "职场技能") {
      this.context.navigator.push(
        navScreen("PushScreen", "职场技能", {
          passProps: {
            screen: () => <GrowCheckinSkill />,
            fullScreen: true,
            header: {
              title: "职场技能",
              //fixed: true,
            }
          },
          //...navRightButton("save_addLearnedCourseBtn", "保存"),
        })
      );
      /* navHelper.navOpen(this.context.navigator, "push", {
        name: "GrowCheckinSkillScreen",
        title: "职场技能",
        //tabBarHidden: true
        navBarHidden: true,
        tabBarHidden: true // 隐藏tab
      }); */
    }
  }

  gotoDetail(name, type = "searcher_school", title = "数据解析", id = null){
    //return
    Toast.loading("加载中");
    this.props.actions
      .createRecordAction({
        type: type,
        content: name,
        // 从查询更多直接点击的 不需要出现在搜索历史记录里，但是为tree方便进行收藏
        value: 'tree' + id ? `-${id}` : ''
      })
      .then(res => {
        Toast.hide();
        this.context.navigator.push(
          navScreen("PushScreen", title, {
            passProps: {
              screen: () => {
                if(type.match(/_school/i)) return (
                  <SchoolDetail
                    is_liked={res.results.is_liked}
                    id={res.results.id}
                    type={res.results.type}
                    schoolText={name}
                  />
                )
                if(type.match(/_job/i)) return (
                  <JobDetail
                    is_liked={res.results.is_liked}
                    id={res.results.id}
                    type={res.results.type}
                    jobText={name}
                  />
                )
                if(type.match(/_major/i)) return (
                  <MajorDetail
                    is_liked={res.results.is_liked}
                    id={res.results.id}
                    type={res.results.type}
                    majorText={name}
                  />
                )
                if(type.match(/_profession/i)) return (
                  <IndustryDetail
                    is_liked={res.results.is_liked}
                    id={res.results.id}
                    type={res.results.type}
                    industryText={name}
                    industryId={id}
                  />
                )
                return (<View />)
              },
              fullScreen: true,
              noScrollView: true
            }
          })
        );
      })
      .catch(err => {});

  }

  onPressDetail(positionName){
    this.gotoDetail(item.name, "searcher_job", "职位详情");
    return
    this.context.navigator.push(
      navScreen("PushScreen", "职位详情", {
        passProps: {
          screen: () => (
            <JobDetail
              is_liked={false}
              id={0}
              type={""}
              jobText={positionName}
              // title={"职位详情"}
            />
          ),
          /* header: {
            title: positionName || "数据查询",
            fixed: true,
          }, */
          fullScreen: true,
          noScrollView: true
        }
      })
    );

  }

  renderRow(_row) {
    //console.log("row", _row);
    const row = _row.item;
    return (
      <SDRow
        key={row.key}
        title={row.title}
        titleWidth={430}
        caption={row.caption}
        icon={row.icon}
        subtitle=""
        onPress={this.onPressCheckin.bind(this)}
        style={{
          marginTop: CSS.pixel(1, true),
          marginBottom: CSS.pixel(1, true),
          paddingLeft: CSS.pixel(10),
        }}
        emptyIconStyle={{
          borderWidth: 0,
          borderColor: "#f00",
          width: CSS.pixel(30),
          height: CSS.pixel(30, true),
        }}
        imgStyle={{
          borderRadius: 0,
          position: 'relative',
          top: CSS.pixel(6, true),
        }}
        captionStyle={{
          marginTop: Platform.OS=="android"? CSS.pixel(0, true) :CSS.pixel(2, true),
          borderWidth: 0,
          borderColor: "#f00",
        }}
      >
        <SDSubtitle
          style={{
            marginTop: CSS.pixel(4, true),
            fontSize: CSS.textSize(24),
            color: sdStyles.SDFontColorMain,
            borderWidth: 0,
            borderColor: "#f00",
          }}
        >
          {row.desc_before}
          <Text style={{
            color: sdStyles.SDMainColor,
            fontSize: CSS.textSize(30),
            //fontWeight: 'bold',
             }}>{row.desc_days}</Text>
          {row.desc_after}
        </SDSubtitle>
      </SDRow>
    );
  }

  onRefreshPage() {
    return new Promise((resolve, reject)=>{
      Promise.all([
        //刷新职么力
        refreshPowerAction(this),
        //刷新用户基本信息/一周职么力
        this.props.actions.getUserInfoAction(),
        //刷新目标职位
        refreshJobPlanListAction(this),

        getPowerWeek(),
        this.getArticles(),
      ]).then(values => {
        setTimeout(() => {
          resolve()
        }, 1000);
      });
    }).catch(err => {});
  }

  onRefreshPagePath() {
    //console.log("onRefreshPagePath start==", 1)
    return new Promise((resolve, reject)=>{
      Promise.all([
        //刷新目标职位
        refreshJobPlanListAction(this),
      ]).then(res => {
        //console.log("onRefreshPagePath done==", res)
        resolve(true)
      }).catch(err => {});
    });
  }

  onPressGoto(){
    //this.context.navigator.push(navScreen("ExpDetailScreen", "职么力"));
  }

  onPressChooseGoal() {
    //制定新的规划
    new Promise((resolve, reject)=>{
      this.context.navigator.toggleTabs({
        to: 'shown',
        animated: false
      });
      setTimeout(() => {
        resolve(true)
      }, 200);
    }).then(data => {
      this.context.navigator.push(
        navScreen("PushScreen", "生涯规划", {
          passProps: {
            screen: () => <ScrollView><GrowingFuture onPress={this.onPressLighten.bind(this)} /></ScrollView>,
            fullScreen: true,
            header: {
              title: "生涯规划",
              //fixed: true,
            },
            //statusBarColor: "dark"
          },
          //...navRightButton("save_addLearnedCourseBtn", "保存"),
        })
      );
    })

  }

  //查看打卡详情
  onPressCalendar() {
    /* this.context.navigator.push(
      navScreen("PushScreen", "每日打卡", {
        passProps: {
          screen: () => <GrowCheckinCalendar />
        }
        //...navRightButton("save_editCourseItem", "保存")
      })
    ); */
  }

  _renderItem({ item, index, separators }) {
    return <ListItem key={index + ""} data={item} categoryId={item.categoryId}
      style={{
        paddingHorizontal: CSS.pixel(5),
        paddingVertical: 0,
        marginBottom: index != 1 ? CSS.pixel(10) : 0,
        // paddingBottom: CSS.pixel(10, true),
        // alignSelf: 'center',
        borderWidth: 0,
        borderColor: '#f00',
      }}
      // paddingFix={10}
    />;
  }

  //LiveCourseItem
  _renderCourseItem({ item, index }) {
    return <LiveCourseItem item={item} key={item.id + ""}
      style={{
        width: CSS.pixel(690),
        alignSelf: 'center',
      }}
    />;
  }

  onPressGoalNews(){
    const title = `${this.props.currentJobPlan.position.title}开门指路`
    this.context.navigator.push(
      navScreen("PushScreen", title, {
        passProps: {
          screen: () => <StudentShareWithGoal />, // 自定义传递props
          fullScreen: true,
          noScrollView: true,
          header: {
            title: title,
            //fixed: true,
          }
        },
        ...navRightButton(
          "filter_studentNewsBtn",
          () => {
            return <Image style={{
              width: CSS.pixel(45),
              height: CSS.pixel(32),
              borderWidth: 0,
              borderColor: '#f00',
            }} source={require("@img/home/growing_ico_screen.png")} />
          }
        )
      })
    );
  }

  render() {
    const { checkinData, startIndex, goalName } = this.state;
    return (

      <View
        style={{
          flex: 1,
          backgroundColor: "#fff", //sdStyles.SDBGColorMain,
          //paddingTop: CSS.pixel(118, true),
          position: "relative",
          //top: CSS.pixel(-68, true),
          paddingTop: Platform.OS == "android" ? CSS.pixel(50, true) : CSS.pixel(50, true),
          borderWidth: 0,
          borderColor: '#f00',
        }}
      >
        <SDStatusBar/>

        {/* <SDTabs2
          tabTitles={["我要成长", "职业规划"]}
          page={startIndex}
          underLineWidth={CSS.pixel(110)}
          onChangeTab={this.handleTabChange.bind(this)}
          activeColor={sdStyles.SDMainColor}
          inActiveColor={sdStyles.SDFontColorMinor}
          style={{
            flex: 1,
          }}
          tabContentStyle={{
            height: '100%',
          }}
        > */}
          <SDPullDownRefresh
            //styleName="tabContent inputWrap flexibless"
            style={styles.sdTabs}
            onRefresh={this.onRefreshPage.bind(this)}
          >

          <SDSection
            header={()=>{
              return (<View
                style={{
                  width: width,
                  minHeight: CSS.pixel(144, true),
                  //paddingVertical: CSS.pixel(20),
                  backgroundColor: '#fff',
                  marginBottom: 1,
                  borderWidth: 0,
                  borderColor: '#f00',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GrowTargetSwitch2
                  hasGoal={this.props.currentJobPlan.position.title? true : false}
                  goalName={this.props.currentJobPlan.position.title}
                  titleStyle={{
                    position: 'relative',
                    left: this.props.currentJobPlan.position.title?CSS.pixel(0) : CSS.pixel(-20),
                  }}
                  twoLinkStyle={{
                    position: 'relative',
                    left: this.props.currentJobPlan.position.title?CSS.pixel(20) : CSS.pixel(0),
                    top: Platform.OS=="android"? CSS.pixel(0, true) :CSS.pixel(16, true),
                    borderWidth: 0,
                    borderColor: '#f00',
                  }}
                  iconStyle={{
                    paddingRight: CSS.pixel(0),
                  }}
                  smallMode={true}
                  />

                {this.props.currentJobPlan.position.title && this.state.hasPositionArticle ? <SDButton
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
                  onPress={this.onPressGoalNews.bind(this)}
                  title="目标职位开门指路 >> "
                /> : null}
            </View>)
            }}
          >
            {/* <TouchableOpacity
                onPress={this.onPressGoto.bind(this)}
                activeOpacity={1.0}
                style={{
                  backgroundColor: '#fff',
                  borderWidth: 0,
                  borderColor: '#f00',
                }}
              >
              <View style={{
                  backgroundColor: '#fff',
                  borderWidth: 0,
                  borderColor: '#f00',
                  height: CSS.pixel(100),
                }}>
              <PowerNSalary
                power={this.props.getUserPowerSalary.power}
                salary={this.props.getUserPowerSalary.salary}
                height={CSS.pixel(30, true)}
                onPress={() => {}}
              />
            </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1.0}
              onPress={this.onPressCalendar.bind(this)}
              style={{
                backgroundColor: '#fff',
                borderWidth: 0,
                borderColor: '#f00',
              }}
            >
              <TaskCount style={{
                  position: 'relative',
                  top: 0,
              }} />
            </TouchableOpacity> */}
          </SDSection>

            <SDSection
              title="职么课堂"
              onPressMore={()=>{
                this.context.navigator.push(
                  navScreen("PushScreen", "职么课堂", {
                    passProps: {
                      screen: () => <LiveCourseListScreen />,
                      noScrollView: true,
                      fullScreen: true,
                      header: {
                        title: "职么课堂"
                      }
                    },
                  })
                );
              }}
               >
              <View style={{
                paddingHorizontal: CSS.pixel(20),
                paddingBottom: CSS.pixel(20),
                backgroundColor:'#fff',
                marginBottom: 1,
              }}>
                <FlatList
                keyExtractor={item => item.id + ""}
                data={this.state.courseData}
                renderItem={this._renderCourseItem.bind(this)}
                ></FlatList>
              </View>
            </SDSection>

            <SDSection
              title="开门指路"
              onPressMore={()=>{
                this.context.navigator.push(
                  navScreen("PushScreen", "开门指路", {
                    passProps: {
                      screen: () => <StudentShare />, // 自定义传递props
                      fullScreen: true,
                      noScrollView: true,
                      header: {
                        title: "开门指路",
                        //fixed: true,
                      }
                    },
                    ...navRightButton(
                      "filter_studentNewsBtn",
                      () => {
                        return <Image style={{
                          width: CSS.pixel(45),
                          height: CSS.pixel(32),
                          borderWidth: 0,
                          borderColor: '#f00',
                        }} source={require("@img/home/growing_ico_screen.png")} />
                      }
                    )
                  })
                );
              }}
               >
              <View style={{
                paddingHorizontal: CSS.pixel(20),
                paddingBottom: CSS.pixel(20),
                backgroundColor:'#fff',
                marginBottom: 1,
              }}>
                <FlatList
                keyExtractor={item => item.id + ""}
                data={this.state.newsData}
                renderItem={this._renderItem.bind(this)}
                ></FlatList>
              </View>
            </SDSection>

            <SDSection
              title="技能提升"
              style={{
                //paddingBottom: CSS.pixel(200, true)
              }}>
              <FlatList
                keyExtractor={item => item.key + ""}
                data={this.initItemData()}
                renderItem={this.renderRow.bind(this)}
                >
                </FlatList>
            </SDSection>


          </SDPullDownRefresh>

          {/* <SDPullDownRefresh
            //styleName="tabContent inputWrap flexibless"
            style={styles.sdTabs}
            onRefresh={this.onRefreshPagePath.bind(this)}
          >
            {this.state.hasGoal ? (
              <GrowGoalList selectMode={false} changeTopTab={this.changeTopTab.bind(this)} />
            ) : (
              <GrowingPath onPress={this.onPressLighten.bind(this)} />
            )}

          </SDPullDownRefresh> */}
        {/* </SDTabs2> */}

        {(this.state.startIndex == 1 && this.props.currentJobPlan.position.title) ? <View style={{
            borderWidth: 0,
            borderColor: '#f00',
            width: '100%',
            height: CSS.pixel(120, true),
            position: 'absolute',
            bottom: CSS.pixel(0, true),
            backgroundColor: '#fff',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
              <SDButton
                style={{
                  backgroundColor: sdStyles.SDMainColor,
                  borderRadius: 20,
                  width: CSS.pixel(550),
                }}
                btnStyle={{ fontSize: CSS.textSize(30), color: "#fff" }}
                onPress={this.onPressChooseGoal.bind(this)}
                title="制定新的规划"
              />
          </View> : null}

          <SDTabBar selectIndex={2} />
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //user: getUserAllInfo(state, props),
  getUserPowerSalary: getUserPowerSalary(state, props),
  getUserTaskCount: getUserTaskCount(state, props),
  //skillState: state.skillState,
  //certState: state.certState,
  currentJobPlan: currentJobPlan(state, props),
  userInfo: state.user,
}))(GrowScreen);
