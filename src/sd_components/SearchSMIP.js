/* @flow */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import PropTypes from "prop-types";
import store from "@boot/store";
import * as sdStyles from "@styles";
import RowSplitLine from "@src/common/RowSplitLine";
import ConnectWithActions from "@src/connectWithActions";
//import { getUserBaseInfo } from "@src/users/usersSelector";
import { CSS } from "@src/common/SDCSS";
import SDTabs2 from "@sd_components/SDTabs2";
import SDLoading from "@sd_components/SDLoading";
//import HeaderText from "@sd_components/HeaderText";
//import GrowCheckinSkillTab from "@sd_components/GrowCheckinSkillTab";
import { skillPunchListAction, certPunchListAction } from "@src/boot/actions";
import { getTabType, responseOk, sdDispatch } from "@utils/funcs";
import { userCity } from "@src/selectors";
//import SDSection from "@sd_components/SDSection";
//import SDRow from "@sd_components/SDRow";
import { searchSchoolDataList, searchCityDataState,
  searchLevelOneMajorDataBList,
  searchLevelOneMajorDataCList,
  searchLevelOneMajorDataMList,
  searchLevelOneMajorDataDList,
  searchPositionDataList,
  searchIndustryDataList,
} from '@src/selectors';
import SDRefreshList from "@sd_components/SDRefreshList";
import SearchSimpleList from "@src/screens/tabScreen/Grow/SearchSimpleList";
import { navScreen, navRightButton } from "@styles";
import { Toast } from "antd-mobile";
import SchoolDetail from "@src/screens/pushScreen/searchData/tabs/SchoolDetail";
import MajorDetail from "@src/screens/pushScreen/searchData/tabs/MajorDetail";
import JobDetail from "@src/screens/pushScreen/searchData/tabs/JobDetail";
import IndustryDetail from "@src/screens/pushScreen/searchData/tabs/IndustryDetail";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: CSS.pixel(30, true),
  },
  sdTabs: {
    width: width,
    height: '100%',
    borderWidth: 0,
    borderColor:'#f00',
    //flex: 1,
    marginTop: CSS.pixel(24, true)
  }
});

const iconLocation = require("@img/home/home_ico_Location.png")

const schoolHeader = (city, title="学校") => {
  return (<View style={{
        flexDirection: 'row',
        alignContent: 'flex-start',
        justifyContent: 'space-between',
        width: width, //'100%',
        height: CSS.pixel(70, true),
        borderTopWidth: 1,
        borderTopColor: sdStyles.SDHelperColorline,
        //backgroundColor: '#efefef',
        marginTop: CSS.pixel(15, true),
        borderWidth: 0,
        borderColor: '#f00',
    }}>
        <Text style={{
            fontSize: CSS.textSize(24),
            color: sdStyles.SDFontColorSubtitle,
            alignSelf: 'center',
            marginLeft: CSS.pixel(30),
        }}>{city ? city.title : ""}全部{title}</Text>
        {city ? <View style={{
            flexDirection: 'row',
            alignContent: 'flex-start',
            alignSelf: 'center',
            marginRight: CSS.pixel(30),
            display: 'none',
        }}>
            <Image source={iconLocation} style={{
                marginRight: CSS.pixel(10),
                position: 'relative',
                top: CSS.pixel(4, true),
            }} />
            <Text style={{
                fontSize: CSS.textSize(30),
                color: sdStyles.SDFontColorSubtitle,
            }}>{city.province.title}{city.title}</Text>
        </View> : null}
    </View>)
}

// 首页 - 数据查询（学校S、专业M、行业I、职位P）
class SearchSMIP extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      //初始tab index: 0
      startIndex: 0,
      page: 1,
      size: 15,
      //请求参数
      params: {},
      majorTypes: ['本科','专科','硕士','博士'],
      //默认专业tab:0
      defaultMajorType: 0,
      majorTabReducerTypes: [
        'SEARCHLEVELONEMAJORDATAB',
        'SEARCHLEVELONEMAJORDATAC',
        'SEARCHLEVELONEMAJORDATAM',
        'SEARCHLEVELONEMAJORDATAD',
      ],
      majorTabReducerSubTypes: [
        'SEARCHMAJORDATAB',
        'SEARCHMAJORDATAC',
        'SEARCHMAJORDATAM',
        'SEARCHMAJORDATAD',
      ],
      majorTabSearchList: [
        'searchLevelOneMajorDataBList',
        'searchLevelOneMajorDataCList',
        'searchLevelOneMajorDataMList',
        'searchLevelOneMajorDataDList',
      ],
      majorTabSubSearchList: [
        'searchMajorDataBList',
        'searchMajorDataCList',
        'searchMajorDataMList',
        'searchMajorDataDList',
      ],
      isReloadSchool: 0,
      isReloadMajor: 0,
      isReloadPosition: 0,
      isReloadIndustry: 0,
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  changeTotab(index){
    this.setState({
      startIndex: index
    });
  }

  handleTabChange(index){
    console.log("handleTabChange===", index)
    setTimeout(() => {
      if(index == 0){
        this.setState({
          isReloadSchool: this.state.isReloadSchool + 1
        })
      } else if(index == 1){
        this.setState({
          isReloadMajor: this.state.isReloadMajor + 1
        })
      } else if(index == 2){
        this.setState({
          isReloadPosition: this.state.isReloadPosition + 1
        })
      } else if(index == 3){
        this.setState({
          isReloadIndustry: this.state.isReloadIndustry + 1
        })
      }
    }, 0);
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "dataQueryScreenBtn") {
        //console.log("dataQueryScreenBtn click")
        this.context.navigator.push(navScreen("DataQueryScreen", "数据查询"));
      }
    }
  }

  fetchSchoolByCity(city, isSetStatus = false){
    if(!isSetStatus) sdDispatch("SEARCHSCHOOLDATA", null, {
      isRefresh: true,
    });
    this.props.actions.getJobPlanCityAction({
      city: city.title || "成都市",
    }).then(res => {
        responseOk(res, res && res.results && res.results.length).then(res => {
            sdDispatch("SEARCHCITYDATA", res, {
              isRefresh: true,
            });
            const cityId = res.results[0].id;
            this.props.actions.getJobPlanSchoolAction({
                city_id: cityId,
                page: this.state.page,
                size: this.state.size,
            }).then(res => {
                sdDispatch("SEARCHSCHOOLDATA", res, {
                  isRefresh: true,
                });
                /* this.setState({
                  isReloadSchool: this.state.isReloadSchool + 1
                }) */
            }).catch(err => {
              //console.warn("getJobPlanSchoolAction err===[][]", err)
            })
        }).catch(err => {})
        if(isSetStatus) this.setState({
          loading: false,
        })
    })
  }

  componentDidMount(){
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "dataQueryScreenBtn"
    );
    this.fetchSchoolByCity(this.props.city, true)
  }

  componentWillReceiveProps(nextProps){
    //console.warn('city.id', nextProps.city, this.props.city.id)
    //console.warn('searchCityDataState.id', nextProps.searchCityDataState, this.props.searchCityDataState.id)
    if(nextProps.city.id != this.props.city.id){
      //console.warn('city.id', nextProps.city, this.props.city.id)
      this.fetchSchoolByCity(nextProps.city)
    }
    if(nextProps.searchCityDataState.id != this.props.searchCityDataState.id){
      //console.warn('city.id', nextProps.city, this.props.city.id)
      this.fetchSchoolByCity(nextProps.searchCityDataState, true)
    }
  }

  onPressClickMajor(index){
    const n = this.state.isReloadMajor + 1;
    setTimeout(() => {
      this.setState({
        defaultMajorType: index,
        isReloadMajor: n,
      })
    }, 0);
    //console.log("onPressClickMajor===isReloadMajor", index, this.state.isReloadMajor)
  }

  onPressExpandMajor(title, item){
    console.log("onPressExpandMajor===", title, item, this.state.majorTabReducerTypes[this.state.defaultMajorType], this.state.defaultMajorType)
    //一级专业类别，需要置空reducer
    /* store.dispatch({
      type: this.state.majorTabReducerTypes[this.state.defaultMajorType],
      json: {},
      params: {},
      isRefresh: true,
    }) */
  }

  gotoDetail(name, type = "searcher_school", title = "数据解析", id = null){
    //return
    Toast.loading("加载中");
    this.props.actions
      .createRecordAction({
        type: type,
        content: name,
        //据详情无论是树状列表还是搜索出来的都需要收藏
        value: 'tree' + id ? `-${id}` : '', //name,
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

  onPressDetailSchool(title, item){
    console.log("onPressDetailSchool===", title, item)
    this.gotoDetail(item.name, "searcher_school", "数据解析");
  }

  onPressDetailPosition(title, item){
    console.log("onPressDetailPosition===xxx", title, item)
    //this.gotoDetail(item.name, "searcher_job", "数据解析");
    if(item.parent_name && item.level && item.level != 1){
      //如果是职位
      this.gotoDetail(item.name, "searcher_job", "数据解析");
    }
  }

  onPressDetailSubPosition(title, item){
    console.log("onPressDetailSubPosition===", title, item)
    this.gotoDetail(item.name, "searcher_job", "数据解析");
  }

  onPressDetailIndustry(title, item){
    console.log("onPressDetailIndustry===", title, item)
    this.gotoDetail(item.name, "searcher_profession", "数据解析", item.id);
  }

  onPressExpandPosition(title, item){
    console.log("onPressExpandPosition===", title, item)
  }

  render() {
    const { startIndex } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',//sdStyles.SDBGColorMain,
          borderWidth: 0,
          borderColor: '#f00',
          width: width,
          //height: height,
        }}
      >

        <SDTabs2
          tabTitles={["学校", "专业", "职位", "行业"]}
          page={startIndex}
          //lineGap={10}
          underLineWidth={CSS.pixel(54)}
          onChangeTab={this.handleTabChange.bind(this)}
          activeColor={sdStyles.SDFontColorMain}
          inActiveColor={sdStyles.SDFontColorSubtitle}
          style={{
            flex: 1,
            //position: 'absolute',
            //top: 0,
          }}
          tabContentStyle={{
            //height: '100%',
            //overflow: 'hidden',
            flex:1,
          }}
        >
            <SDRefreshList
              style={{
                borderWidth: 0,
                borderColor: '#f00',
                width: width,
                //height: CSS.pixel(1000, true),
              }}
              reload={this.state.isReloadSchool}
              header={() => {
                return schoolHeader(this.props.city, "学校")
              }}
              searchList={this.props.searchSchoolDataList}
              listItem={item => {
                  return <SearchSimpleList
                    keyExtractor={item => item.id + ""}
                    key={item.id}
                    item={item}
                    onPress={this.onPressDetailSchool.bind(this)}
                  />;
              }}
              actionName="getJobPlanSchoolAction"
              params={{
                city_id: this.props.city.id, //this.props.searchCityDataState.id,
                //page: this.state.page,
                //size: this.state.size,
              }}
              reducerType="SEARCHSCHOOLDATA"
              noDefaultLoading={true}
            />

          <View
            style={styles.sdTabs}
          >
            <View style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                flex: 1,
                //borderWidth: 0,
                //borderColor: '#f0f',
            }}>
                <View style={{
                    flexDirection: 'column',
                    alignContent: 'flex-start',
                    width: CSS.pixel(150),
                    borderWidth: 0,
                    borderColor: '#f00',
                    }}>
                    {this.state.majorTypes.map((n,i)=>{
                        return (<TouchableOpacity key={i}
                            onPress={this.onPressClickMajor.bind(this, i)}
                          ><View style={{
                            width: CSS.pixel(150),
                            height: CSS.pixel(86, true),
                            flexDirection: 'row',
                            alignContent: 'flex-start',
                            backgroundColor: this.state.defaultMajorType == i ? sdStyles.SDBGColorMain : '#fff',
                            borderWidth: 0,
                            borderColor: '#f00',
                        }}>
                            <View style={{
                                backgroundColor: this.state.defaultMajorType == i ?sdStyles.SDMainColor : '#fff',
                                width: CSS.pixel(6, true),
                                height: CSS.pixel(86, true),
                            }}></View>
                            <Text style={{
                                fontSize: CSS.textSize(28),
                                color: this.state.defaultMajorType == i ? sdStyles.SDMainColor : sdStyles.SDFontColorSubtitle,
                                alignSelf: 'center',
                                textAlign: 'center',
                                flexGrow: 1,
                            }}>{n}专业</Text>
                        </View></TouchableOpacity>)
                    })}

                </View>
                <View style={{
                    flexDirection: 'column',
                    alignContent: 'flex-start',
                    flexGrow: 1,
                    //borderWidth: 0,
                    //borderColor: '#f00',
                    borderTopWidth: 1,
                    borderTopColor: sdStyles.SDHelperColorline,
                    }}>
                    <SDRefreshList
                      style={{
                        borderLeftWidth: 1,
                        borderLeftColor: sdStyles.SDHelperColorline,
                        width: '100%',
                        height: CSS.pixel(1110, true),
                        marginTop: CSS.pixel(0, true),
                        position: 'relative',
                        top: -1,
                        //borderWidth: 0,
                        //borderColor: '#f00',
                      }}
                      reload={this.state.isReloadMajor}
                      searchList={this.props[this.state.majorTabSearchList[this.state.defaultMajorType]]}
                      listItem={(item) => {
                          return <SearchSimpleList
                            searchListName={this.state.majorTabSubSearchList[this.state.defaultMajorType]}
                            actionName="getJobPlanMajorAction"
                            levelName={this.state.majorTypes[this.state.defaultMajorType]}
                            reducerTypeName={this.state.majorTabReducerSubTypes[this.state.defaultMajorType]}
                            keyExtractor={item => item.id + ""}
                            key={item.id}
                            item={item}
                            isCollapse={true}
                            onPress={this.onPressExpandMajor.bind(this)}
                            titleStyle={{
                              fontWeight: sdStyles.SDFontMedium,
                            }}
                          />;
                      }}
                      actionName="getJobPlanLvelOneMajorAction"
                      params={{
                        level: this.state.majorTypes[this.state.defaultMajorType],
                        //page: this.state.page,
                        //size: this.state.size,
                      }}
                      reducerType={this.state.majorTabReducerTypes[this.state.defaultMajorType]}
                    />
                </View>
            </View>

          </View>

          <SDRefreshList
                      style={{
                        borderLeftWidth: 1,
                        borderLeftColor: sdStyles.SDHelperColorline,
                        width: '100%',
                        height: CSS.pixel(1110, true),
                        marginTop: CSS.pixel(0, true),
                        position: 'relative',
                        top: -1,
                        //borderWidth: 0,
                        //borderColor: '#f00',
                      }}
                      reload={this.state.isReloadPosition}
                      header={() => {
                        return schoolHeader(null, "职位")
                      }}
                      searchList={this.props.searchIndustryDataList}
                      listRef={"_position_scroll_view"}
                      listItem={(item) => {
                          return <SearchSimpleList
                            scrollViewName={"_position_scroll_view"}
                            searchListName={"searchPositionDataList"}
                            actionName="getPositionListAction"
                            levelName={""}
                            reducerTypeName={"SEARCHPOSITIONDATA"}
                            keyExtractor={item => item.id + ""}
                            key={item.id}
                            item={item}
                            isCollapse={true}
                            isCustomizedSearchListName={true}
                            customizedSearchListName={"searchPositionDataList"}
                            customizedActionName={"getPositionListAction"}
                            customizedParams={{
                              parent_id: item.id,
                              size: 500,
                            }}
                            customizedReducerTypeName={"SEARCHPOSITIONDATA"}
                            onPress={this.onPressExpandPosition.bind(this)}
                            titleStyle={{
                              fontWeight: sdStyles.SDFontMedium,
                            }}
                          />;
                      }}
                      actionName="getJobPlanIndustryAction"
                      params={{
                        //level: this.state.majorTypes[this.state.defaultMajorType],
                        //page: this.state.page,
                        size: 100, //this.state.size,
                      }}
                      reducerType={"SEARCHINDUSTRYDATA"}
                    />

          {/* <SDRefreshList
              style={{
                borderWidth: 0,
                borderColor: '#f00',
                width: width,
                height: CSS.pixel(1000, true),
              }}
              reload={this.state.isReloadPosition}
              header={() => {
                return schoolHeader(null, "职位")
              }}
              searchList={this.props.searchPositionDataList}
              listItem={item => {
                  return <SearchSimpleList
                    searchListName={"searchSubPositionDataList"}
                    actionName="getPositionListAction"
                    levelName=""
                    reducerTypeName={"SEARCHSUBPOSITIONDATA"}
                    keyExtractor={item => item.id + ""}
                    key={item.id}
                    item={item}
                    isCollapse={true}
                    params={{
                      parent_id: item.id,
                      page: 1,
                      size: 40,
                    }}
                    onPress={this.onPressDetailPosition.bind(this)}
                    subTitleStyle={{
                      fontSize: CSS.textSize(28),
                      color: sdStyles.SDFontColorSubtitle,
                    }}
                    titleStyle={{
                      fontWeight: sdStyles.SDFontMedium,
                    }}
                    rowStyle={{
                      marginLeft: CSS.pixel(72),
                    }}
                  />;
              }}
              //actionName="getJobPlanPositionAction"
              //职位查询默认需要行业ID，单独查询一级职位感觉有逻辑问题
              actionName="getPositionListAction"
              params={{
                //city_id: this.props.searchCityDataState.id,
                //page: this.state.page,
                //size: this.state.size,
              }}
              reducerType="SEARCHPOSITIONDATA"
            /> */}

            <SDRefreshList
              style={{
                borderWidth: 0,
                borderColor: '#f00',
                width: width,
                height: CSS.pixel(1000, true),
              }}
              reload={this.state.isReloadIndustry}
              header={() => {
                return schoolHeader(null, "行业")
              }}
              searchList={this.props.searchIndustryDataList}
              listItem={item => {
                  return <SearchSimpleList
                    keyExtractor={item => item.id + ""}
                    key={item.id}
                    item={item}
                    onPress={this.onPressDetailIndustry.bind(this)}
                  />;
              }}
              actionName="getJobPlanIndustryAction"
              params={{
                //city_id: this.props.searchCityDataState.id,
                //page: this.state.page,
                //size: this.state.size,
                size: 100,
              }}
              reducerType="SEARCHINDUSTRYDATA"
            />

        </SDTabs2>
      </View>

    );
  }
}

export default ConnectWithActions((state, props) => ({
  city: userCity(state),
  searchSchoolDataList: searchSchoolDataList(state),
  searchCityDataState: searchCityDataState(state),
  searchLevelOneMajorDataBList: searchLevelOneMajorDataBList(state),
  searchLevelOneMajorDataCList: searchLevelOneMajorDataCList(state),
  searchLevelOneMajorDataMList: searchLevelOneMajorDataMList(state),
  searchLevelOneMajorDataDList: searchLevelOneMajorDataDList(state),
  searchPositionDataList: searchPositionDataList(state),
  searchIndustryDataList: searchIndustryDataList(state),
}))(SearchSMIP);
