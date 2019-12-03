/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  Fragment,
  Image,
  View,
  Text,
  Alert,
  FlatList,
} from "react-native";

import store from "@boot/store";
import ConnectWithActions from "@src/connectWithActions";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { navScreen, navRightButton } from "@styles";
import { getUserBaseInfo } from "@src/users/usersSelector";
import * as navHelper from "@utils/navigationHelper";
import IntlText from "@sd_components/IntlText";
import SDRow from "@sd_components/SDRow";
import SDButton from "@sd_components/SDButton";
import DotSelect from "@sd_components/DotSelect";
import Dot from "@sd_components/Dot";
import FootSpace from "@sd_components/FootSpace";
import SDLoading from "@sd_components/SDLoading";
//import SDRadioList, {SDRadioForm} from "@sd_components/SDRadioList";
//import RadioForm from "react-native-simple-radio-button";
import { getDateObj, refreshJobPlanListAction } from "@utils/funcs";
import { getJobPlanList } from "@api/index";
import { _getPower } from "@utils/funcs";
import { setUserState } from "@boot/actions";
import GrowingPath from "@sd_components/GrowingPath";
import TitleWrap from "@src/sd_titleWrap/TitleWrap";
import { currentJobPlan } from "@src/selectors";
import { Toast } from "antd-mobile";
import SchoolDetail from "@src/screens/pushScreen/searchData/tabs/SchoolDetail";
import MajorDetail from "@src/screens/pushScreen/searchData/tabs/MajorDetail";
import JobDetail from "@src/screens/pushScreen/searchData/tabs/JobDetail";
import IndustryDetail from "@src/screens/pushScreen/searchData/tabs/IndustryDetail";
import GrowingFuture from "@sd_components/GrowingFuture";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");
//console.log("width", width);

const iconDetail = require("@img/grow/growing_btn_details.png")
const iconUser = require("@img/grow/growing_ico_position.png")
const iconPlus = require("@img/grow/growing_ico_add.png")

type Props = {
  selectMode: boolean
};

// 成长 - 我的目标列表组件
class GrowGoalList extends PureComponent<Props> {
  props: Props;
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null,
    //intl: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }
  state = {
    loading: true,
    selectMode: false,
    valueIndex: 0,
    selectValue: "",
    selectIndex: 0,
    listData: [],
    choosedId: 0,
  };

  componentWillMount() {
    const { selectMode } = this.props;
    //console.log("selectMode==", selectMode, typeof selectMode);
    if (typeof selectMode === "boolean") {
      this.setState({
        selectMode: selectMode
      });
    }

    this.props.actions.getEducationAction({
      id: this.props.user.id
    })
  }

  prepareList(results){
    //console.log("user[][]===", this.props.userEducationList)
    const defaultEdu = this.props.userEducationList.filter((n,i)=>{
      return n.is_default === true;
    });
    if(this.props.currentJobPlan.position.title) this.setState({
      choosedId: this.props.currentJobPlan.id,
    })
    const year = defaultEdu[0] ? defaultEdu[0].end_date.split('-')[0] : '';
    //console.log("defaultEdu====", defaultEdu, year, defaultJob, results)
    console.log("results====", results, this.state.choosedId)
    return results.map((n, i) => {
      return {
        label: "选择"+(i+1),
        id: n.id,
        isSelect: n.is_default ? true : false,
        value: i,
        postionName: n.position.name,
        date: getDateObj(n.position.created_time, true).replace(/\-/gi,"."),
        list: [
          {
            title: `毕业工作`,
            steps: [
              {
                action: "进入",
                target: n.position.industry_name
              },
              {
                action: "担任",
                target: n.position.name
              }
            ]
          },
          {
            title: "上大学",
            steps: [
              {
                action: "学校",
                target: this.props.user.total.school_name
              },
              {
                action: "专业",
                target: this.props.user.total.major_name
              }
            ]
          }
        ]
      };
    })
  }

  componentWillReceiveProps(nextProps){
    if (this.props.userJobPlanList != nextProps.userJobPlanList) {
      this.setState({
        listData: this.prepareList(nextProps.userJobPlanList)
      });
    }
  }

  componentDidMount() {
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "_icon_add_position_goal"
    );

    if(this.props.userJobPlanList && this.props.userJobPlanList.length){
      this.setState({
        loading: false,
        listData: this.prepareList(this.props.userJobPlanList)
      });
    } else {
      this.props.actions.goalListAction({}, res => {
        //console.log("goalListAction[][]==", res)
        this.setState({
          loading: false
        });
        if (res.results.length === 0) {
          //ALert.alert("暂无数据")
        } else {
          this.setState({
            listData: this.prepareList(res.results)
          });
        }
      });
    }
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "_icon_add_position_goal") {
        this.onPressConfirmChoose()
      }
    }
  }

  //点亮路径
  onPressLighten(index, title) {
    this.context.refs["_growScreen"].onPressLighten(index, title);
  }

  onPressChooseGoal() {
    //navHelper.snackBar(this.context.navigator, "onPressChooseGoal");
    /* if(typeof this.props.changeTopTab === 'function'){
      this.props.changeTopTab(0);
    } */
    //console.log("onPressChooseGoal", this.context.refs["_growScreen"].state.startIndex)
    //
    //return
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
        navScreen("PushScreen", "定制目标", {
          passProps: {
            screen: () => <ScrollView><GrowingPath onPress={this.onPressLighten.bind(this)} /></ScrollView>
          },
          //...navRightButton("save_addLearnedCourseBtn", "保存"),
        })
      );
    })

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

  //职位详情
  onPressDetail(positionName){
    console.log("onPressDetail positionName====", positionName)
    //this.context.refs["_growScreen"].onPressDetail(positionName);

    this.gotoDetail(positionName, "searcher_job", "数据解析");
  }

  onPressSelect(title, isSelect, index, data) {
    //console.log("[][]select: " + title + ": " + isSelect + " = " + index);
    //console.log("[][]data", this.state.listData)
    //console.warn(data, this.props.currentJobPlan)

    if(this.state.choosedId == data.id){
      return
    }

    const temp = [...this.state.listData];
    this.setState({
      choosedId : data.id,
      listData: temp.map((n,i)=>{
        return Object.assign({}, n, {
          isSelect: n.id == data.id ? true : false
        })
      })
    })
    //console.log("[][]this.state.listData", this.state.listData)

    setTimeout(() => {
      //设置默认
      this.props.actions.postChangeGoalAction({
        id: data.id
      }, res => {}).then(res => {

        //检查是否有职业规划
        refreshJobPlanListAction(this, {}, false);

        //刷新用户信息和职么力、薪资
        this.props.actions.getUserInfoAction();
        this.getPower();

        navHelper.navOpen(this.context.navigator, "pop", {
          name: "GrowScreen",
          title: "成长"
          //tabBarHidden: true
        });
      })
    }, 200);
  }

  getPower = () => {
    return _getPower(this).then(({results, data}) => {
      store.dispatch(setUserState(results));
      return results;
    });
  };

  //确定新的目标
  onPressConfirmChoose() {

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

    return

    this.props.actions.postChangeGoalAction({
      id: this.state.choosedId
    }, res => {}).then(res => {

      //检查是否有职业规划
      refreshJobPlanListAction(this, {}, false);

      //刷新用户信息和职么力、薪资
      this.props.actions.getUserInfoAction();
      this.getPower();

      navHelper.navOpen(this.context.navigator, "pop", {
        name: "GrowScreen",
        title: "成长"
        //tabBarHidden: true
      });
    })
  }

  renderGoalItem(n, key) {
    return (
      <View
        key={key}
        style={{
          position: "relative",
          left: CSS.pixel(18),
          zIndex: 5,
          //top: CSS.pixel(16, true),
          //height: CSS.pixel(210, true),
          borderWidth: 0,
          borderColor: "#f00",
          marginTop: CSS.pixel(20, true),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            //paddingVertical: 10,
            zIndex: 6,
            borderWidth: 0,
            borderColor: "#f00",
          }}
        >
          <View style={{
            backgroundColor: sdStyles.SDBGColorGrey,
            borderRadius:CSS.pixel(20),
            //minWidth: CSS.pixel(160),
            position: 'relative',
            top: CSS.pixel(0, true),
            left: CSS.pixel(12),
            borderWidth: 0,
            borderColor: "#f00",
            //overflow: 'hidden',
             }}>
            <Text style={{
              marginVertical: CSS.pixel(2),
              marginHorizontal: CSS.pixel(20),
              color: sdStyles.SDFontColorMain,
              fontSize: CSS.textSize(28),
              textAlign: 'center',
            }}>{n.title}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            paddingLeft: CSS.pixel(36),
            paddingVertical: CSS.pixel(10,true),
            zIndex: 6,
            borderWidth: 0,
            borderColor: "#f00"
          }}
        >
          {Array.isArray(n.steps)
            ? n.steps.map((nn, key2) => (
                <View
                  key={key2}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    paddingVertical: CSS.pixel(5,true),
                    width: '100%',
                    borderWidth: 0,
                    borderColor: "#f0f",
                  }}
                >
                  <Dot
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 6,
                      position: "relative",
                      top: CSS.pixel(6, true),
                      left: 0,
                      marginRight: CSS.pixel(10),
                    }}
                    innerStyle={{
                      width: 6,
                      height: 6,
                      borderRadius: 4,
                    }}
                  />

                  <View
                    style={{
                      position: "relative",
                      left: 0
                    }}
                  >
                    <Text style={{
                      fontSize: CSS.textSize(24),
                      color: sdStyles.SDFontColorSubtitle,
                       }}>
                      {nn.action}
                    </Text>
                  </View>
                  <View
                    style={{
                      position: "relative",
                      left: CSS.pixel(10),
                    }}
                  >
                    <Text style={{
                      fontSize: CSS.textSize(24),
                      color: sdStyles.SDFontColorMain,
                       }}>
                      {nn.target}
                    </Text>
                  </View>
                </View>
              ))
            : null}
        </View>
      </View>
    );
  }

  renderGoal(_goal, s, index) {
    //console.log("goal=====", goal, s, index);
    const { selectIndex, selectValue, radioProps, selectMode } = this.state;
    const selectTitle = "默认";//goal.isSelect ? "已选择" : "选择";
    const unSelectTitle = "设为默认"; //goal.isSelect ? "选择" : "已选择";
    const goal = _goal.item;
    return (
      <View style={{
        borderWidth: 0,
        borderColor: '#0ff',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <View style={{
              position: 'absolute',
              top: CSS.pixel(130, true),
              right: Platform.OS == "android" ? CSS.pixel(10) : CSS.pixel(14),
              zIndex: 10,
              width: CSS.pixel(169),
              height: CSS.pixel(54, true),
        }}><SDButton
            style={{
              //backgroundColor: sdStyles.SDMainColor,
              //borderRadius: 20,
              width: CSS.pixel(169),
              height: CSS.pixel(54, true),
              borderWidth: 0,
              borderColor: '#0ff',
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center"
            }}
            outerStyle={{
              borderWidth: 0,
              borderColor: '#00f',
              width: CSS.pixel(169),
              height: CSS.pixel(54, true),
            }}
            onPress={this.onPressDetail.bind(this, goal.postionName)}
            title={()=>{
              return (<Image resizeMode="contain" source={iconDetail} style={{
                width: CSS.pixel(169),
                height: CSS.pixel(54, true),
                //position: 'relative',
                //top: CSS.pixel(8, true),
                //left: Platform.OS == "android" ? CSS.pixel(15) : CSS.pixel(15),
              }} />)
            }}
          /></View>
        <View style={{
        //backgroundColor: '#fff',
        borderWidth: 0,
        borderColor: '#f00',
      }}>
        {selectMode ? (
            <View style={{
              alignSelf: 'center',
              width: CSS.pixel(690),
              borderWidth: 0,
              borderColor: '#f00',
              marginVertical: CSS.pixel(23, true),
            }}><DotSelect
              title={goal.isSelect ? selectTitle : unSelectTitle}
              reverseTitle={!goal.isSelect ? unSelectTitle : selectTitle}
              useIcon={true}
              isSelect={goal.isSelect}
              index={goal.id}
              data={goal}
              onPress={this.onPressSelect.bind(this)}
              fontSize={()=>{
                return CSS.textSize(26)
              }}
              txtStyle={{
                fontSize: CSS.textSize(28),
                position: 'relative',
                left: Platform.OS === "android" ? -10 : -10,
                paddingLeft: Platform.OS == 'android' ? CSS.pixel(20) : CSS.pixel(20),
              }}
              iconStyle={{
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                marginBottom:CSS.pixel(22, true),
                //alignSelf: 'center',
              }}
            /></View>
          ) : null}

        <View
          key={goal.id}
          style={{
            flexDirection: "column",
            backgroundColor: "#fff",
            borderWidth: 0,
            borderColor: sdStyles.SDHelperColorline,
            borderTopWidth: 0,
            marginBottom: CSS.pixel(30, true),
            borderRadius: CSS.pixel(10),
            alignSelf: 'center',
            width: CSS.pixel(690),
            borderWidth: 0,
            borderColor: '#f00',
            zIndex: 2,
             }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              //justifyContent: "center",
              //backgroundColor: sdStyles.SDMainColor,
              width: CSS.pixel(710),
              height: CSS.pixel(99, true),
              paddingHorizontal: CSS.pixel(5),
              borderWidth: 0,
              borderColor: '#f00',
              marginTop: CSS.pixel(25, true),
              marginBottom: CSS.pixel(10, true),
            }}
          >

            <SDButton
                style={{
                  //backgroundColor: sdStyles.SDMainColor,
                  //borderRadius: 20,
                  width: CSS.pixel(99),
                  height: CSS.pixel(99, true),
                  borderWidth: 0,
                  borderColor: '#f00',
                }}
                onPress={()=>{
                  console.log('click icon')
                }}
                title={()=>{
                  return (<Image source={iconUser} resizeMode="contain" style={{
                    position: 'relative',
                    top: CSS.pixel(0, true),
                  }} />)
                }}
              />

            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-start',
              borderWidth: 0,
              borderColor: '#0ff',
              alignSelf: 'center',
            }}><View style={{
                    maxWidth: CSS.pixel(430),
                    borderWidth: 0,
                    borderColor: '#f0f',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                  }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: CSS.textSize(30),
                fontWeight: "bold",
                color: sdStyles.SDFontColorMain,
                //flexGrow: 1,
                //paddingTop: CSS.pixel(12, true),
                //paddingLeft: CSS.pixel(30),
                textAlign: 'left',
                borderWidth: 0,
                borderColor: '#0ff',
              }}
            >
              {goal.postionName}
            </Text></View></View>



          </View>

          <View style={{
            flexDirection: "row",
            alignItems: "flex-start",
            borderWidth: 0,
            borderColor: "#f00"
           }}>

            <View style={{ zIndex: 3, marginBottom: 20, flexGrow: 1 }}>
              {Array.isArray(goal.list)
                ? goal.list.map((n, i) => this.renderGoalItem(n, i))
                : null}
            </View>
          </View>
        </View>
      </View>
      </View>
    );
  }

  render() {
    const goals = this.state.listData;
    return (
      <View style={{
        flex: 1,
        borderWidth: 0,
        borderColor: '#f00',
      }}>

        <ScrollView style={{
        width: width,
        flex:1,
        //height: CSS.pixel(1180, true), //Platform.OS == "android" ? height - CSS.pixel(80) : height - CSS.pixel(80),
      }}><View style={{
        backgroundColor: sdStyles.SDBGColorClick,
        //paddingHorizontal: CSS.pixel(36),
      }}>

        <View style={{
          paddingTop: CSS.pixel(22, true),
          paddingBottom: CSS.pixel(10, true),
          //backgroundColor:'#fff',
          borderWidth: 0,
          borderColor: '#f00',
          width: CSS.pixel(690),
          alignSelf: 'center',
        }}>
          <TitleWrap title={`我的目标（${goals.length}个）`} textStyle={{
            color: sdStyles.SDFontColorMain,
          }} nomore={true} />
        </View>

        {this.state.loading ? <SDLoading style={{
          borderWidth: 0,
          borderColor: '#f00',
          width: '100%',
        }} /> : null}

        <View style={{
          borderWidth: 0,
          borderColor: '#f00',
          backgroundColor: sdStyles.SDBGColorClick,
          minHeight: CSS.pixel(1120, true),
        }}>
          <FlatList
              keyExtractor={item => item.id + ""}
              data={goals}
              renderItem={this.renderGoal.bind(this)}
              >
              </FlatList>
        </View>
        </View>
      </ScrollView>

      {/* <View style={{
          width: width,
          height: CSS.pixel(80, true),
        }}>
          {this.state.selectMode ? (
            <SDButton
              style={{
                backgroundColor: sdStyles.SDMainColor,
                //borderRadius: 20,
                width: width, //CSS.pixel(550)
              }}
              btnStyle={{ fontSize: CSS.textSize(30), color: sdStyles.SDFontColorMain }}
              onPress={this.onPressConfirmChoose.bind(this)}
              title={()=>{
                return (<View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Image source={iconPlus} style={{
                    marginRight: CSS.pixel(20),
                  }} />
                  <Text style={{
                    fontSize: CSS.textSize(32),
                    color: sdStyles.SDFontColorMain,
                    }}>制定新的目标</Text>
                </View>)
              }}
            />
          ) : null}
        </View> */}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state),
  userJobPlanList: state.userJobPlanList,
  currentJobPlan: currentJobPlan(state, props),
  userEducationList: state.userEducationList,
}))(GrowGoalList);
