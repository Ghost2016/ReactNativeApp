/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import ConnectWithActions from "@src/connectWithActions";
//import { List } from "../common/index";
import * as navHelper from "@utils/navigationHelper";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { getUserBaseInfo, getUserAllInfo } from "@src/users/usersSelector";
import { Toast } from "antd-mobile";
import IntlText from "@sd_components/IntlText";
import ButtonSection from "@sd_components/ButtonSection";
import FootSpace from "@sd_components/FootSpace";
import SDTag from "@sd_components/SDTag";
import FlowTitle from "@sd_components/FlowTitle";
import SDBox from "@sd_components/SDBox";
import SDLoading from "@sd_components/SDLoading";
import { Navigation } from "react-native-navigation";
import config from "../config";
import { navLightBox } from "@styles";
import GrowBoxMsg from "@sd_components/BoxMsg";
import SDTagGroup from "@sd_components/SDTagGroup";
import SchoolDetail from "@src/screens/pushScreen/searchData/tabs/SchoolDetail";
import MajorDetail from "@src/screens/pushScreen/searchData/tabs/MajorDetail";
import JobDetail from "@src/screens/pushScreen/searchData/tabs/JobDetail";
import IndustryDetail from "@src/screens/pushScreen/searchData/tabs/IndustryDetail";
import { navScreen, navRightButton } from "@styles";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const bgHeader = require("@img/grow/growing_pic_plan_bg.png");

// 成长 - 制定目标职位
class GrowMakeGoal2 extends React.PureComponent {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    //intl: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const {industryId, road, positionArea} = props;
    this.state = {
      industryId: industryId,
      road: road,
      positionArea: positionArea,
      loading: true,
      tags: [],
      industryId: 0,
      road: '',
      positionArea: '',
      choosedPosition: '',
      isReset: false,
    }
  }

  componentWillMount(){
    const { industryId } = this.props;
    if(industryId){
      this.setState({
        industryId: industryId
      })
    }
  }

  componentDidMount() {
    /* this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    ); */
    // = {} ;//this.refs._SDTags_industry;
    //console.log("this.context.refs=====222", 1)

    this.loadPostion();

    /* setTimeout(()=>{
      //this.context.refs['_SDTags_xxx'].resetSelect()
    }, 5000) */
  }

  loadPostion() {
    this.props.actions.getPositionListAction({
      parent_id: this.state.industryId,
      page: 1,
      size: 30,
    }, res => {}).then(res => {
      //console.log("getIndustry2======", res)
      let all = [];
      if(Array.isArray(res.results)) res.results.map((n,i)=>{
        all.push(new Promise((resolve)=>{
          this.props.actions.getPositionListAction({
            parent_id: n.id,
            page: 1,
            size: 40,
          }, res2 => {}).then(res3 => {
            //console.log("getPositionListAction====", res3, n)
            resolve(Object.assign({}, n, {
              results: res3.results,
            }))
          }).catch(res4 => {
            resolve({})
          })
        }))
      })
      Promise.all(all).then((values) => {
        //console.log("tags all === ", values);
        this.setState({
          loading: false,
          tags: values,
        })
      });
    })
      /* this.props.actions.getIndustryListAction({
        parent_id: this.state.industryId,
      }, res => {}).then(res => {
        //console.log("getIndustry2======", res)
        let all = [];
        res.results.map((n,i)=>{
          all.push(new Promise((resolve)=>{
            this.props.actions.getPositionListAction({
              industry_id: n.id,
            }, res2 => {}).then(res3 => {
              //console.log("getPositionListAction====", res3, n)
              resolve(Object.assign({}, n, {
                results: res3.results,
              }))
            }).catch(res4 => {
              resolve({})
            })
          }))
        })
        Promise.all(all).then((values) => {
          //console.log("tags all === ", values);
          this.setState({
            loading: false,
            tags: values,
          })
        });
      }) */

  }

  onPressConfirm() {
    console.log("onPressConfirm", this.state.choosedPosition, this.props.industryId);
    return

    if(!this.state.choosedPosition){
      Toast.fail("请选择选择目标职位！", 0.3)
      return
    }
    this.props.actions.postMakeGoalAction({
      //默认写死，目前已经不需要路径规划
      path_id: 1,
      position_id: this.state.choosedPosition,
      salary: 0,
      power: 0,
      is_default: true,
      is_valid: true,
      //user: this.props.user.id,
    }, res => {}).then(res => {
      this.context.refs["_growScreen"].onPressAddPath(res.results, 0);
      //跳转到个人目标页
      this.context.navigator.popToRoot({
        animated: true,
        animationType: 'fade', // 'fade' (for both) / 'slide-horizontal'
      });
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
                    isAddTarget={true}
                    // title={"职位详情"}
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

  onPressChoosePosition(titles, data, index, title) {
    //console.warn("onPressChoosePosition", this.state.choosedPosition, this.props.industryId);
    //return

    this.setState({
      isReset: true,
    })
    setTimeout(() => {
      this.setState({
        isReset: false,
      })
    }, 2000);

    Toast.info("请稍后。。。", 0.5)
    console.log("onPressChoosePosition===", titles, data, index, title)
    if(!title) {
      this.setState({
        choosedPosition: ""
      })
      return new Promise((reject)=>{reject(null)})
    }

    return new Promise((resolve, reject)=>{
      this.props.actions.hasTargetPositionAction({
        positionId: data.id,
      }, res=>{}).then(res=>{
        //console.log("hasTargetPositionAction===", res)
        if(res.results.length){
          resolve(false)
          Toast.fail("你已制定该目标！", 0.1)
        } else {
          this.setState({
            choosedPosition: data.id
          })
          resolve(true)
          this.gotoDetail(title, "searcher_job", "数据解析");
          /* Navigation.showLightBox({
            screen: "example.GrowBoxMsg",
            style: {
              backgroundBlur: "dark", //'dark' / 'light' / 'xlight' / 'none'
              backgroundColor: "rgba(218, 218, 218, 0.1)",
              tapBackgroundToDismiss: true
            },
            passProps: {
              passSpecialProps: {
                data: data
              }
            },
          }); */

        }
      }).catch(err => {
        reject(true)
      })

    })

  }

  onPressChoosePosition2(titles) {
    navLightBox("LightBoxScreen", {
      passProps: {
        screen: () => <GrowBoxMsg />
      }
    });
  }

  render() {
    return (
      <View style={{
        backgroundColor: sdStyles.SDBGColorClick,
        flexDirection: 'column',
        alignItems: 'center',
        borderWidth: 0,
        borderColor: '#f00',
        width: "100%",
        height: height,
      }}>

        <ImageBackground
            style={{
                width: "100%",
                height: CSS.pixel(618, true),
                borderWidth: 0,
                borderColor: '#f00',
                flexDirection: "column",
                justifyContent: "flex-start",
                backgroundColor: "transparent",
                position: "absolute",
                top: 0,
                left: 0,
            }}
            resizeMode="cover"
            borderRadius={0}
            source={bgHeader}

        />
          <View
            style={{
              flex: 1,
              marginTop: CSS.pixel(150, true),
              //backgroundColor: sdStyles.SDBGColorMain,
              borderWidth: 0,
              borderColor: '#00f',
            }}
          >
            <FlowTitle step={2} />
            <View
              //styleName="tabContent inputWrap flexibless"
              style={{
                //flex: 1,
                borderTopWidth: 0,
                borderTopColor: sdStyles.SDHelperColorline,
                marginTop: CSS.pixel(0, true),
                //backgroundColor: sdStyles.SDBGColorMain,
                borderWidth: 0,
                borderColor: '#f0f',
                height: CSS.pixel(1206, true),
              }}
            >
              <ButtonSection
                //height={CSS.pixel(600, true)}
                title="确定"
                onPress={this.onPressConfirm.bind(this)}
                noButton={true}
                btnStyle={{
                  backgroundColor: this.state.choosedPosition ? sdStyles.SDMainColor : sdStyles.SDBGColorGreyBtn,
                }}

                style={{
                  height: CSS.pixel(1006, true),
                }}
                containerStyle={{
                  flex: 1,
                  height: height, //CSS.pixel(600, true),
                  borderWidth: 0,
                  borderColor: '#f00',
                }}
              >
                <View style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: CSS.pixel(60, true),
                }}>
                  {/* <Text
                    style={{
                      textAlign: "center",
                      fontSize: CSS.textSize(28),
                      color: sdStyles.SDFontColorMinor,
                      marginTop: CSS.pixel(50, true),
                      marginBottom: CSS.pixel(20, true),
                    }}
                  >
                    选择目标职位
                  </Text> */}
                  {this.state.loading ? <SDLoading /> : null}
                </View>

                {this.state.tags.map((n,i)=>{
                  const tags = n.results.map((n2,i2)=>{
                    return {
                      tag: n2.name,
                      title: n2.name,
                      description: n2.description,
                      id: n2.id,
                    }
                  })
                  return (<SDTagGroup key={i} tags={tags} name={`jp_position_${n.id}`} title={`${n.name}`} isMultiple={false}
                    onPress={this.onPressChoosePosition.bind(this)}
                    isReset={this.state.isReset}
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      paddingHorizontal: CSS.pixel(30),
                    }}
                    tagContainerStyle={{
                      marginTop: 0,
                      marginBottom: CSS.pixel(30, true),
                      padding: 0,
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "flex-start", //"space-between",
                      alignContent: "flex-start", //"space-between"
                      borderWidth: 0,
                      borderColor: '#f00',
                    }}
                    tagStyle={{
                      borderColor: sdStyles.SDHelperColorline3,
                      borderRadius: 0,
                      borderWidth: 1,
                      //flex: 1,
                      paddingLeft: 10,
                      paddingRight: 10,
                      //paddingTop: 4,
                      //paddingBottom: 4,
                      marginHorizontal: CSS.pixel(10),
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      marginVertical: CSS.pixel(15, true),
                      backgroundColor: "#fff",
                      borderWidth: 1,
                      //borderColor: '#f00',
                      height: CSS.pixel(50, true),
                    }}
                    tagSelectStyle={{
                      borderColor: sdStyles.SDMainColor,
                      borderRadius: 0,
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginHorizontal: CSS.pixel(10),
                      marginVertical: CSS.pixel(15, true),
                    }}
                    btnStyle={{
                      fontSize: CSS.textSize(24),
                      color: sdStyles.SDFontColorMain,
                    }}
                  />)
                })}


              </ButtonSection>
            </View>
          </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserAllInfo(state, props),
}))(GrowMakeGoal2);