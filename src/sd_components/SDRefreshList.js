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
//import defaultStyle from "@styles";
import * as sdStyles from "@styles";
import { navScreen, navRightButton } from "@styles";
import { CSS } from "@common/SDCSS";
import { Toast } from "antd-mobile";
import RowSplitLine from "@src/common/RowSplitLine";
import ConnectWithActions from "@src/connectWithActions";
//import TitleWrap from "@src/sd_employmentinfo/titlelistwarp/TitleWrap";
//import { getUserAllInfo } from "@src/users/usersSelector";
import SDUpPullScrollView, {
  RefreshState
} from "@src/common/SDUpPullScrollView";
//import { isIphoneX } from "@src/utils/iphonex";
//import { ucfirst } from "@src/utils/funcs";
import SDLoading from "@sd_components/SDLoading";
//import SDButton from "@sd_components/SDButton";
import { NULL_PAGE_RESULTS } from "@src/nullObjects"

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: CSS.pixel(0, true)
  }
});

type Props = {
  user: object,
};

//没页展示数量太少<6(未超出列表框范围)会导致列表底部刷新失败
const eachPage = 15;

class SDRefreshList extends React.PureComponent<Props> {
  props: Props;
  constructor(props) {
    super(props);
    console.log("props.searchList==", props.searchList, props.keyName)
    let temp = {}
    console.log("props.searchList==111", 111)
    if(props.keyName && props.searchList && props.searchList[props.keyName]){
      temp = props.searchList[props.keyName]
    } else {
      temp = props.searchList
    }
    this.state = {
      loading: (temp && temp.results && temp.results.length) ? false : true,
      hasRefresh: false,
      refreshState: RefreshState.Idle,
      page: 1,
      size: props.params.size ? props.params.size : eachPage,
      _list: [],
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  componentWillMount(){
    //目前判断如果已经有数据，不会展示loading
    //应该还有个定期刷新刷新最新数据
    let temp = {}
    console.log("props.searchList==222", 222)
    if(this.props.keyName && this.props.searchList && this.props.searchList[this.props.keyName]){
      temp = this.props.searchList[this.props.keyName]
    } else {
      temp = this.props.searchList
    }
    console.log("props.searchList==2", this.props.searchList, this.props.keyName)
    const __list = (temp && temp.results && Array.isArray(temp.results)) ? temp.results : [];
    this.setState({
      //loading: (this.props.searchList && this.props.searchList.results.length) ? false : true,
      page: (typeof this.props.page === 'number') ? this.props.page : 1,
      size: (typeof this.props.params.size === 'number') ? this.props.params.size : eachPage,
      _list: __list,
    })
  }

  componentDidMount() {
    //console.log("this.props.type====[][]", this.props.type)
    setTimeout(() => {
      //if(this.state._list.length == 0)
      if(!this.props.noDefaultLoading) this.onHeaderRefresh();
    }, 200);
  }

  onHeaderRefresh(reload) {
    //顶部刷新会刷新reducer
    this.queryData(this.state.page, {
        refreshState: RefreshState.HeaderRefreshing,
        hasRefresh: true
      }, {
        refreshState: RefreshState.Idle
      }, true);
  }

  onFooterRefresh() {
    console.log("check sum====footer", this.props.searchList)
    const list = this.props.searchList;
    const total_page = list.per_page ? Math.ceil(parseInt(list.count, 10) / parseInt(list.per_page, 10)) : 0;
    this.setState({ refreshState: RefreshState.FooterRefreshing });
    //return
    if(total_page == 0 || (total_page && this.state.page + 1 > total_page)) {
      this.setState({
        refreshState: RefreshState.NoMoreData,
        hasRefresh: true
      });
      return true;
    }
    console.log("check page==", total_page, this.state.page, this.state.page + 1 <= total_page)
    if(total_page && this.state.page + 1 <= total_page) this.queryData(this.state.page + 1, () => {
        console.log("check sum====footer3 ", list)
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

  requestData(action, params, type, beforeState = null, moreState = {}, isRefresh = false){
    //console.warn("[isRefresh]requestData action=====", params, type)
    let stop = false
    if(typeof beforeState == "function") {
        stop = beforeState();
    }
    if(stop) return;
    if(typeof beforeState == "object") this.setState(beforeState);

    //header刷新会刷新整个reducer
    params.page = (isRefresh) ? 1 : params.page;
    console.log("isRefresh===", isRefresh, params, this.props.size);
    params.size = (typeof this.props.params.size === 'number') ? this.props.params.size : params.size;

    let temp = {}
    //console.log("props.searchList==444", 444)
    if(this.props.keyName && this.props.searchList && this.props.searchList[this.props.keyName]){
      temp = this.props.searchList[this.props.keyName]
    } else {
      temp = this.props.searchList
    }

    action(
        params,
        res => {}
      ).then(res => {
        console.log("requestData===", res, type, params, temp);
        //console.log("this.props.params", this.props.params, params);
        //计算总长度防止重复append到list
        let sum = 0;
        if(res && res.current_page) {
            sum = parseInt(res.current_page, 10) * parseInt(res.per_page, 10);
            console.log("requestData===sum", sum);
        } else {
            console.log("requestData===dispatch", 1);
            store.dispatch({
                type: type,
                json: res,
                params: params,
                isRefresh: isRefresh ? true : false,
                keyName: (type.match(/^SEARCHMAJORDATA(B|C|M|D)$/i) || type == "SEARCHSUBPOSITIONDATA" || type == "SEARCHPOSITIONDATA") ? this.props.keyName : "",
            })
            this.setState({
                refreshState: RefreshState.NoMoreData,
                hasRefresh: true
            });
            return
        }
        console.log("check sum====", temp && temp.results && temp.results.length, ">", sum, res)
        if(temp && temp.results && temp.results.length > sum && !isRefresh) {
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
            isRefresh: isRefresh ? true : false,
            keyName: (type.match(/^SEARCHMAJORDATA(B|C|M|D)$/i) || type == "SEARCHSUBPOSITIONDATA" || type == "SEARCHPOSITIONDATA") ? this.props.keyName : "",
          })
        }

        if (Array.isArray(res.results) && res.results.length) {
          this.setState(Object.assign({
              loading: false,
              page: params.page,
          }, moreState));
        } else {
          //Toast.info("暂无数据", 0.3);
          this.setState({
            loading: false,
            refreshState: RefreshState.Idle
          });
        }
        if(isRefresh){
          this.setState({
            page: 1,
          });
        }
      }).catch(err => {
        this.setState({
          loading: false,
          refreshState: RefreshState.Idle
        });
      });
  }

  queryData(page, beforeState = {}, moreState = {}, isRefresh = false) {
    console.log("queryData", page)
    const actionName = this.props.actionName

    const params = Object.assign({}, this.props.params, {
        page: page,
        size: (typeof this.props.params.size === 'number') ? this.props.params.size : eachPage,
    })
    this.requestData(this.props.actions[actionName], params, this.props.reducerType, beforeState, moreState, isRefresh);

  }

  componentWillReceiveProps(nextProps){
    let temp = [];
    console.log("props.searchList==3", this.props.keyName, nextProps.searchList, this.props.searchList)
    const orignList = !this.props.isCustomizedSearchListName ? NULL_PAGE_RESULTS : this.props.searchList[this.props.keyName]? this.props.searchList[this.props.keyName] : this.props.searchList;
    //console.log("555-1", nextProps.searchList && nextProps.searchList[this.props.keyName])
    //console.log("555-1-1")

    if(this.props.isCustomizedSearchListName && this.props.keyName && nextProps.searchList && orignList && this.props.searchList && nextProps.searchList[this.props.keyName] && nextProps.searchList[this.props.keyName].results && orignList.results && nextProps.searchList[this.props.keyName].results.length !== orignList.results.length){
      //如果是有下级list[keyName]
      //console.log("nextProps.props.searchList.results===", nextProps.searchList[this.props.keyName].results)
      temp = nextProps.searchList[this.props.keyName].results.map((n,i)=>{
        return {
          id: n.id,
          name: n.name,
          list: [],
        }
      });
      //console.log("nextProps.props.searchList.results===temp", temp)
      this.setState({
        _list: temp,
        loading: false,
      })
    }
    //console.log("555")

    if(this.props.isCustomizedSearchListName && this.props.keyName && nextProps.searchList && orignList && this.props.searchList && nextProps.searchList[this.props.keyName] && nextProps.searchList[this.props.keyName].results && temp.length == 0 && nextProps.searchList[this.props.keyName].results.length){
      //如果是有下级list[keyName]
      //console.log("nextProps.props.searchList.results===666", nextProps.searchList[this.props.keyName].results)
      temp = nextProps.searchList[this.props.keyName].results.map((n,i)=>{
        return {
          id: n.id,
          name: n.name,
          list: [],
        }
      });
      //console.log("nextProps.props.searchList.results===temp666", temp)
      this.setState({
        _list: temp,
        loading: false,
      })
    }
    //console.log("666")

    if((!this.props.searchList && nextProps.searchList) || (nextProps.searchList && nextProps.searchList.results && this.props.searchList.results && nextProps.searchList.results.length !== this.props.searchList.results.length)){
        //如果是专业，需要过滤专业级别
        //http://222.211.90.70:8845/major/profile?level=本科&level1=哲学&page=1&size=15
        if(this.props.params.level && this.props.params.level1){
          temp = nextProps.searchList.results.filter((n,i)=>{
            return n.level == this.props.params.level
          })
          temp.map((n,i)=>{
            if(n.list){
              return Object.assign({}, n, {
                list: n.list.filter((n2,i2)=>{
                  return n2.level == this.props.params.level
                })
              })
            } else {
              return n
            }
          })
          this.setState({
            _list: temp,
            loading: false,
          })
        } else {
          //console.warn("nextProps.props.searchList.results===", nextProps.searchList)
          this.setState({
              _list: nextProps.searchList.results,
              loading: false,
          })
        }
    }

    //刷新城市
    // && nextProps.params.city_id !== this.props.params.city_id
    if(nextProps.params && nextProps.params.city_id){
        //console.warn("city searchList.results===", nextProps.searchList)
        this.setState({
            _list: nextProps.searchList.results,
            loading: false,
        })
    }

    //console.log("nextProps.==", nextProps)
    if(nextProps.reload !== this.props.reload){
      //外边控制刷新列表
      console.log("nextProps.reducerType==", nextProps.reducerType, nextProps)
      setTimeout(() => {
        this.onHeaderRefresh(nextProps.reload);
      }, 400);
    }
  }

  render() {
    const { listItem, style, header } = this.props;

    return (<View
        style={[
          styles.container,
          {
            //paddingBottom: isIphoneX() ? 44 : 0,
            flex: 1,
          },
          style
        ]}
      >

        {typeof header === "function" ? header() : null}

        {this.state.loading ? <SDLoading style={{
          width: '100%',
          borderWidth: 0,
          borderColor: '#f00',
          alignSelf: 'center',
        }} /> : null}
        {(Array.isArray(this.state._list) && this.state._list.length > 0) ? (
          <SDUpPullScrollView
            listRef={this.props.listRef}
            keyExtractor={(item, index) => index.toString()}
            refreshState={this.state.refreshState}
            onFooterRefresh={this.onFooterRefresh.bind(this)}
            onHeaderRefresh={this.onHeaderRefresh.bind(this)}
            data={this.state._list}
            renderItem={({ item }) => {
              if (typeof listItem === "function") {
                return listItem(item);
              } else {
                return null;
              }
            }}
            NoMoreDataStyle={true}
            footerContainerStyle={{
              borderWidth: 0,
              borderColor: '#f00',
            }}
            style={{
              //height: 200,
              flex: 1,
              borderBottomWidth: 1,
              borderBottomColor: sdStyles.SDHelperColorline,
              borderWidth: 0,
              borderColor: '#f00',
            }}
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
    //user: getUserAllInfo(state, props),
  };
})(SDRefreshList);
