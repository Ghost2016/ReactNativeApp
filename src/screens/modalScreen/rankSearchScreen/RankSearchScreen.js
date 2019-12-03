import React from "react";
import { View, StyleSheet, ScrollView, Text, TextInput } from "react-native";
import { Tabs, SearchBar } from "antd-mobile";
import { RankSearchBar } from "../../../sd_rank";
import * as sdStyles from "@src/styles";
// import SearchInput from "@src/sd_querydatatabs/queryView/SearchInput";
import PropTypes from "prop-types";
import UserList from "../../../sd_userList/UserList";
import config from "../../../config";
import { dismissModal, dismissAllModals } from "@styles";
import ConnectWithActions from "../../../connectWithActions";
import { parseUserList } from "@utils/user";
import { debounce } from "lodash";
import {
  RefreshState
} from "../../../common/SDUpPullScrollView";
import { SDHeader } from "../../../common";
import { CSS } from "../../../common/SDCSS";

const tabs = [{ title: "用户名" }, { title: "专业" }, { title: "学校" }];

const tabsProps = {
  tabBarBackgroundColor: sdStyles.SDBGColorMinor,
  tabBarInactiveTextColor: "#dfdfdf",
  tabBarActiveTextColor: sdStyles.SDMainColor,
  tabBarUnderlineStyle: {
    left: 40,
    backgroundColor: "red",
    height: 0,
    width: "20%"
  }
};

const styles = StyleSheet.create({});
// tab对应的请求参数的名称
const tab_names = ["name", "major", "school", 'all'];
type Props = {};
type State = {};

/**
 *  排名页面
 */

class RankSearchScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      searchWords: "",
      // searchWords: ["", "", ""],
      // 选中的tab
      selected_tab: 3,
      // userData:users,
      // 加载状态
      loading_name: false,
      loading_major: false,
      loading_school: false,
      loading_all: false,
      // 刷新状态
      refresh_state_name: RefreshState.Idle,
      refresh_state_major: RefreshState.Idle,
      refresh_state_school: RefreshState.Idle,
      refresh_state_all: RefreshState.Idle,
      // 数据
      user_data_name: [],
      user_data_major: [],
      user_data_school: [],
      user_data_all: [],
      // 当前页
      cur_page_name:1,
      cur_page_major:1,
      cur_page_school:1,
      cur_page_all:1,
      // 数据总数
      count_name:999,
      count_major:999,
      count_school:999,
      count_all:999,
      // 每页20条数据
      pageSize: 10
    };
  }
  // 上一次搜索的文本
  lastSearchText = '';
  props: Props;
  state: State;
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  init = () => {
    return new Promise((resolve) => {
      const { selected_tab } = this.state;
      const selected_tab_name = tab_names[selected_tab];
      const cur_page = `cur_page_${selected_tab_name}`;
      let tempState = {}
      tempState[cur_page] = 1
      this.setState(tempState, resolve)
    })
  }
  // 搜索添加debounce,延时400ms
  debounceDoFetch = debounce.call(this,(text) => {
    this.doFetch(text)
  }, 600, {leading:false, trailing:true});

  onChangeSearchText = text => {
    const { selected_tab } = this.state;
    const selected_tab_name = tab_names[selected_tab]
    let tempState = {
      searchWords: text
    }
    if(text === '') {
      this.lastSearchText = "";
      tempState[`user_data_${selected_tab_name}`] = [];
      tempState[`refresh_state_${selected_tab_name}`] = RefreshState.Idle;
      this.debounceDoFetch.cancel()
    }
    this.setState(tempState, () => {
      text && this.debounceDoFetch(text)
    })
  };
  handleCancel = () => {
    dismissAllModals();
  };
  componentDidMount() {}
  // 请求
  doFetch = (text) => {
    if(text === this.lastSearchText)return
    this.init().then(
      () => {
        const { selected_tab } = this.state;
        const selected_tab_name = tab_names[selected_tab]
        const loading = `loading_${selected_tab_name}`;
        const refresh_state = `refresh_state_${selected_tab_name}`;
        let tempState = {};
        tempState[loading] = true;
        // 设置loding
        this.setState(tempState, () => {
          this.onOk(text).then(
            ({noMoreData, count}) => {
              this.lastSearchText = text;
              tempState[loading] = false;
              console.log('ly88', 'count', count)
              tempState[refresh_state] = count === 0 ? RefreshState.EmptyData : noMoreData ? RefreshState.NoMoreData : RefreshState.Idle;
              // tempState[refresh_state] = noMoreData ? RefreshState.NoMoreData : RefreshState.Idle;
              this.setState(tempState)
            }
          ).catch(
            e => {
              tempState[loading] = false;
              this.setState(tempState)
            }
          )
        });
      }
    )
  }
  // 进行搜索
  onOk = text => {
    // console.warn(1234)
    const {selected_tab} = this.state;
    const selected_tab_name = tab_names[selected_tab]
    // if(this.state[`user_data_${selected_tab_name}`].length === )
    // 传递参数
    let params = {
      size: this.state.pageSize
    };
    params[selected_tab_name === 'all' ? 'q' : selected_tab_name] = text;
    params['page'] = this.state[`cur_page_${selected_tab_name}`]
    
    return new Promise((resolve, reject) => {
      this.props.actions.searchUserAction(params, res => {
        if (res.status == "ok") {
          let usersInfo = parseUserList(res.results, {
            searchWords: text
          });
          let tempState = {}
          // 如果不是第1页
          if(params.page !== 1) {
            usersInfo = [...this.state[`user_data_${selected_tab_name}`], ...usersInfo]
          }
          tempState[`user_data_${selected_tab_name}`] = usersInfo;
          tempState[`count_${selected_tab_name}`] = res.count;
          // 返回是否已加载所有的数据与数据总量
          this.setState(tempState, () => resolve({noMoreData:usersInfo.length === res.count, count:usersInfo.length}));
        } else {
          reject(res.msg)
        }
      });
    })
  };
  onFooterRefresh = () => {
    const { selected_tab } = this.state;
    const selected_tab_name = tab_names[selected_tab]
    const refresh_state = `refresh_state_${selected_tab_name}`;
    const cur_page = `cur_page_${selected_tab_name}`;
    let tempState = {};
    // 当前页面加1,在空闲时
    if(this.state[refresh_state] === RefreshState.Idle) {
      tempState[cur_page] = this.state[cur_page] + 1;
    }
    tempState[refresh_state] = RefreshState.FooterRefreshing;
    
    this.setState(tempState, () => {
      this.onOk(this.state.searchWords).then(
        ({noMoreData, count}) => {
          let tempThenState = {}
          tempThenState[refresh_state] = count === 0 ? RefreshState.EmptyData : noMoreData ? RefreshState.NoMoreData : RefreshState.Idle;
          this.setState(tempThenState)
        }
      ).catch(
        e => {
          console.log(e)
          let tempCatchState = {}
          tempCatchState[refresh_state] = RefreshState.Idle;
          this.setState(tempCatchState)
        }
      )
    });
  }
  render() {
    const { searchWords } = this.state;
    const _SearchBar = (
      <RankSearchBar
        autoFocus={true}
        wrapperPaddingBottom={20}
        value={this.state.searchWords}
        onChange={this.onChangeSearchText}
        onSubmit={(text) => {
          // 点击搜索，则取消debounce
          this.debounceDoFetch.cancel()
          this.doFetch(text)}}
        showCancelButton={true}
        onCancel={this.handleCancel}
        // placeholder={`搜索你感兴趣的用户、专业、学校`}
        placeholder={"通过昵称、专业、学校搜索你感兴趣的用户"}
      />
    )
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:sdStyles.SDBGColorMain,
          // backgroundColor:'red'
          width: '100%'
        }}
      >
        <SDHeader custom={_SearchBar} backgroundColor={sdStyles.SDMainColor}/>
        <UserList
          searchWords={searchWords}
          searchType={config.RANK_SEARCH_TYPE.ALL}
          users={this.state.user_data_all}
          loading={this.state.loading_all}
          onFooterRefresh={this.onFooterRefresh}
          refreshState={this.state.refresh_state_all}
          style={{flex:1}}
          inModalScreen={true}
        />
        {/* <UserList
          searchWords={searchWords}
          searchType={config.RANK_SEARCH_TYPE.USERNAME}
          users={this.state.user_data_name}
          loading={this.state.loading_name}
          onFooterRefresh={this.onFooterRefresh}
          refreshState={this.state.refresh_state_name}
          style={{flex:1}}
        /> */}
        {/* <Tabs
          tabs={tabs}
          {...tabsProps}
          initialPage={0}
          swipeable={false}
          onTabClick={(tab, index) => {
            this.setState({ selected_tab: index });
          }}
        >
          <View style={{flex:1}}>
            <UserList
              searchWords={searchWords}
              searchType={config.RANK_SEARCH_TYPE.USERNAME}
              users={this.state.user_data_name}
              loading={this.state.loading_name}
              onFooterRefresh={this.onFooterRefresh}
              refreshState={this.state.refresh_state_name}
              style={{flex:1}}
            />
          </View>
          <View style={{flex:1}}>
            <UserList
              searchWords={searchWords}
              searchType={config.RANK_SEARCH_TYPE.MAJOR}
              users={this.state.user_data_major}
              loading={this.state.loading_major}
              onFooterRefresh={this.onFooterRefresh}
              refreshState={this.state.refresh_state_major}
              style={{flex:1}}
            />
          </View>
          <View style={{flex:1}}>
            <UserList
              searchWords={searchWords}
              searchType={config.RANK_SEARCH_TYPE.COLLEGE}
              users={this.state.user_data_school}
              loading={this.state.loading_school}
              onFooterRefresh={this.onFooterRefresh}
              refreshState={this.state.refresh_state_school}
              style={{flex:1}}
            />
          </View>
        </Tabs> */}
      </View>
    );
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({}))(
  RankSearchScreen
));
