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
} from "react-native";
import PropTypes from "prop-types";
import store from "@boot/store";
import defaultStyle from "@styles";
import * as sdStyles from "@styles";
import { navScreen, navRightButton } from "@styles";
import { CSS } from "@common/SDCSS";
import { Toast } from "antd-mobile";
import RowSplitLine from "@src/common/RowSplitLine";
import ConnectWithActions from "@src/connectWithActions";
import TitleWrap from "@src/sd_employmentinfo/titlelistwarp/TitleWrap";
//import SkillList from "@src/screens/tabScreen/Grow/SkillList";
import { getUserAllInfo } from "@src/users/usersSelector";
import SDUpPullScrollView, {
  RefreshState
} from "@src/common/SDUpPullScrollView";
import { isIphoneX } from "@src/utils/iphonex";
import { ucfirst } from "@src/utils/funcs";
import SDLoading from "@sd_components/SDLoading";
import SDButton from "@sd_components/SDButton";
import { currentJobPlan } from "@src/selectors";
import { getUserTotal } from "../directSelectors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: CSS.pixel(30, true)
  }
});

type Props = {
  user: object,
};

//没页展示数量太少<6(未超出列表框范围)会导致列表底部刷新失败
const eachPage = 10
//"专业对口", "同门经验", "同类去向", "高薪职位"
const targetName = ["majorPosition", "schoolPosition", "similarityPosition", "rankPosition"]

const boxHeader = (title = "", msgs = [], notice = "") => {
  return (<View style={{

    flexDirection: 'column',
    alignItems: 'center',
    width: CSS.pixel(608),
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 0,
    borderColor: '#f00',
    //flex: 1,
  }}>
    <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: CSS.pixel(40, true),
  }}>
      <Text style={{
        fontSize: CSS.textSize(34),
        color: sdStyles.SDFontColorMain,
      }}>{title}</Text>
  </View>
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: CSS.pixel(17, true),
    marginBottom: notice ? CSS.pixel(0, true) : CSS.pixel(3, true),
  }}>
      {msgs.map((n,i)=>{
        return (<Text key={i+""} style={{
          fontSize: CSS.textSize(24),
          color: i%2==0 ? sdStyles.SDFontColorSubtitle : sdStyles.SDFontColorMain,
        }}>{n}</Text>)
      })}
    </View>
    {notice ? <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: CSS.pixel(3, true),
  }}>
      <Text style={{
          fontSize: CSS.textSize(24),
          color: sdStyles.SDBGColorOrange,
        }}>{notice}</Text>
    </View>: null}
  </View>)
}

class SDRefreshFutureList extends React.PureComponent<Props> {
  props: Props;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      hasRefresh: false,
      refreshState: RefreshState.Idle,
      page: 1,
      size: eachPage,
      target: 0,
      isStartScrollingList: false,
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };

  componentWillMount(){
    //目前判断如果已经有数据，不会展示loading
    //应该还有个定期刷新刷新最新数据
    this.setState({
      loading: this.props.jobPlanPositionList[targetName[0]].results.length ? false : true,
      page: (typeof this.props.page === 'number') ? this.props.page : 1,
      size: (typeof this.props.size === 'number') ? this.props.size : eachPage,
      target : this.props.target ? this.props.target : 0,
    })
  }

  componentDidMount() {
    //console.log("this.props.type====[][]", this.props.type)
    setTimeout(() => {
      this.onHeaderRefresh(true);
    }, 200);
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.userTotal.major_name !== this.props.userTotal.major_name) {
      //切换了我的目标
      this.onHeaderRefresh(true);
      /* setTimeout(() => {
        this.onHeaderRefresh(false);
      }, 1000); */
    }
  }

  onScrollStart(){
    if(!this.state.isStartScrollingList){
      this.setState({
        isStartScrollingList: true
      })

      setTimeout(() => {
        this.setState({
          isStartScrollingList: false
        })
      }, 3000);

    }

  }

  onHeaderRefresh(isRefreshing = true) {
    this.queryData(this.state.target, this.state.page, {
        refreshState: RefreshState.HeaderRefreshing,
        hasRefresh: true
      }, {
        refreshState: RefreshState.Idle
      }, isRefreshing);
  }

  onFooterRefresh() {
    const list = this.props.jobPlanPositionList[targetName[this.props.target]];
    const total_page = list.per_page ? parseInt(list.count, 10) / parseInt(list.per_page, 10) : 0;
    this.setState({ refreshState: RefreshState.FooterRefreshing });

    if(total_page == 0 || (total_page && this.state.page + 1 > total_page)) {
      this.setState({
        refreshState: RefreshState.NoMoreData,
        hasRefresh: true
      });
      return true;
    }

    if(total_page && this.state.page + 1 <= total_page) this.queryData(this.state.target, this.state.page + 1, () => {

        if (list && list.results && list.results.length > parseInt(list.current_page, 10) * parseInt(list.per_page, 10)) {
            this.setState({
                refreshState: RefreshState.NoMoreData,
                hasRefresh: true
            });
            return true;
        }
        return false
    }, {
        refreshState: RefreshState.Idle
      });

  }

  requestData(action, params, type, index, beforeState = null, moreState = {}, isRefreshing = false){
    //if(isRefreshing) console.warn("[refresh]requestData future action=====", params, type, index)
    let stop = false
    if(typeof beforeState == "function") {
        stop = beforeState();
    }
    if(stop) return;
    if(typeof beforeState == "object") this.setState(beforeState);
    if(isRefreshing) params.page = 1;
    action(
        params,
        res => {}
      ).then(res => {
        //console.log("queryData===", res, type);
        //计算总长度防止重复append到list
        let sum = 0;
        if(res && res.current_page) sum = parseInt(res.current_page, 10) * parseInt(res.per_page, 10);
        console.log("length==", this.props.jobPlanPositionList[targetName[index]].results.length, targetName[index], index, this.props.jobPlanPositionList)
        console.log("sum==", sum, type, res, params)
        if(this.props.jobPlanPositionList[targetName[index]].results.length > sum) {
          //Toast.info("已经是最后一页啦！", 0.1);
          this.setState({
              refreshState: RefreshState.NoMoreData,
              hasRefresh: true
          });
          return;
        } else {
          store.dispatch({
            type: type,
            json: res,
            params: params,
            isRefreshing: isRefreshing,
          })
        }

        if (Array.isArray(res.results) && res.results.length) {
          this.setState(Object.assign({
              loading: false,
              page: params.page,
          }, moreState));
        } else {
          this.setState({
            loading: false,
            refreshState: RefreshState.Idle
          });
          //Toast.info("暂无数据", 0.3);
        }
        //可以左右滑动
        if(this.context.refs['_carouselTargeJob']){
          this.context.refs['_carouselTargeJob'].setState({
            //CarouselScrollEnabled: true,
            isStartScrollingList: false,
          })
        }
      }).catch(err => {
        this.setState({
          loading: false,
          refreshState: RefreshState.Idle
        });
        //可以左右滑动
        if(this.context.refs['_carouselTargeJob']){
          this.context.refs['_carouselTargeJob'].setState({
            //CarouselScrollEnabled: true,
            isStartScrollingList: false,
          })
        }
      });
  }

  queryData(index, page, beforeState = {}, moreState = {}, isRefreshing = false) {
    if (index == 0) {
      this.requestData(this.props.actions.getMajorIdPositions, {
          major: this.props.user.total.major_name, //this.props.user.major_name,
          degree: '不限', //this.props.user.total.degree_name, //this.props.user.degree_name
          page_size: eachPage,
          page: page,
        }, "GETMAJORPOSITIONS", index, beforeState, moreState, isRefreshing);
    } else if(index == 1){
      this.requestData(this.props.actions.getSchoolMajorPositionsAction, {
          school_name: this.props.user.total.school_name, //this.props.user.major_name,
          major: this.props.user.total.major_name, //this.props.user.major_name,
          degree: '不限', //this.props.user.total.degree_name, //this.props.user.degree_name
          page_size: eachPage,
          page: page,
        }, "GETSCHOOLMAJORPOSITIONS", index, beforeState, moreState, isRefreshing);
    } else if(index == 2){
      this.requestData(this.props.actions.getSchoolMajorSimilarityPositionsAction, {
          school_name: '不限', //this.props.user.total.school_name, //this.props.user.major_name,
          major: this.props.user.total.major_name, //this.props.user.major_name,
          degree: this.props.user.total.degree_name, //this.props.user.degree_name
          page_size: eachPage,
          page: page,
        }, "GETSCHOOLMAJORSIMILARITYPOSITIONS", index, beforeState, moreState, isRefreshing);
    } else if(index == 3){
      this.requestData(this.props.actions.getPositionsByRankAction, {
          page_size: eachPage,
          page: page,
        }, "GETPOSITIONSBYRANK", index, beforeState, moreState, isRefreshing);
    }
  }

  render() {
    const { listItem, style, target } = this.props;
    let _List = [];
    _List = (typeof target == "number" && targetName[target] && this.props.jobPlanPositionList && this.props.jobPlanPositionList[targetName[target]]) ? this.props.jobPlanPositionList[targetName[target]].results : [];

    return (<View
        style={[
          styles.container,
          {
            paddingBottom: isIphoneX() ? 44 : 0,
            flex: 1,
          },
          style
        ]}
      >

      {target == 0 ? boxHeader("专业对口", [
                '根据',
                this.props.jobPlanPositionList[targetName[target]].total_num || 0,
                '个样本，我们发现，历史数据选择“',
                this.props.user.total.major_name,
                '”对口职位的概率为：',
              ]) : null}

      {target == 1 ? boxHeader("同门经验", [
                '根据',
                this.props.jobPlanPositionList[targetName[target]].total_num || 0,
                '个样本，我们发现，“',
                this.props.user.total.major_name,
                '”专业的师哥师姐偏向于选择以下职位：',
              ]) : null}

      {target == 2 ? boxHeader("同类去向", [
                '根据',
                this.props.jobPlanPositionList[targetName[target]].total_num || 0,
                '个样本，我们发现，与“',
                //this.props.user.total.major_name,
                this.props.jobPlanPositionList[targetName[target]].major_level2 || '',
                '”专业相关的学长学姐偏向于选择以下职位：',
              ]) : null}

      {target == 3 ? boxHeader("高薪职位", [
                `根据${this.props.jobPlanPositionList[targetName[target]].total_num || 0}个样本，我们发现了以下高薪职位。`,
              ], '注：薪资为毕业五年内的中位数 ') : null}

        {this.state.loading ? <SDLoading /> : null}
        {_List.length > 0 ? (
          <SDUpPullScrollView
            keyExtractor={(item, index) => index.toString()}
            refreshState={this.state.refreshState}
            onFooterRefresh={this.onFooterRefresh.bind(this)}
            onHeaderRefresh={this.onHeaderRefresh.bind(this)}
            onScrollStart={this.onScrollStart.bind(this)}
            //scrollThrottle={16}
            data={_List}
            renderItem={({ item }) => {
              if (typeof listItem === "function") {
                return listItem(item);
              } else {
                return null;
              }
            }}
            controlCarousel={this.context.refs['_carouselTargeJob']}
          />
        ) : this.state.loading ? null : (
          <RowSplitLine content="暂无内容" />
        )}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => {
  return {
    user: getUserAllInfo(state, props),
    jobPlanPositionList: state.jobPlanPositionList,
    currentJobPlan: currentJobPlan(state, props),
    userTotal: getUserTotal(state, props),
  };
})(SDRefreshFutureList);
