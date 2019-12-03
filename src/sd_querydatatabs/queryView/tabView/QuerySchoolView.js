/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform
  //ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
import { Toast, SearchBar } from "antd-mobile";
import SearchInput from "../SearchInput";
import SearchHistoryWrap from "../SearchHistoryWrap";
import { getSchoolName, getSearchRecord } from "../../../directSelectors";
import ConnectWithActions from "../../../connectWithActions";
import { Navigation } from "react-native-navigation";
import SDLoading from "@sd_components/SDLoading";
import config from "../../../config";
import SearchBox from "../../../sd_searchBox/SearchBox";
import SearchSchoolItem from "../../../sd_searchBox/SearchSchoolItem";
import {
  navLightBox,
  dismissLightBox,
  navScreen,
  SDMainColor
} from "../../../styles";
import { Popup } from "../../../common";
import SchoolDetail from "../../../screens/pushScreen/searchData/tabs/SchoolDetail";
import { CSS } from "../../../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    // flex: 1
    width: "100%",
    height: "100%",
    borderTopWidth: 1,
    borderTopColor: "rgba(225,225,225,1)",
    marginTop: CSS.pixel(30)
  }
});

class QuerySchoolView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      loading: false
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
  };
  onPressResult(schoolText) {
    Toast.loading("加载中");
    this.props.actions
      .createRecordAction(
        {
          type: "searcher_school",
          content: schoolText,
          value: schoolText
        },
        res => {
          // 进行判断是否有收藏
          Toast.hide();
        }
      )
      .then(res => {
        if(res && res.status == 'ok') {
          Toast.loading("加载中", 0.1);
          this.context.navigator.push(
            navScreen("PushScreen", "数据解析", {
              passProps: {
                screen: () => (
                  <SchoolDetail
                    is_liked={res.results.is_liked}
                    id={res.results.id}
                    type={res.results.type}
                    schoolText={schoolText}
                  />
                )
              }
            })
          );
        } else {
          
        }
      });
  }
  pushSearch() {
    this.context.navigator.push(
      navScreen("PushScreen", "查询学校", {
        animated: true,
        animationType: "fade",
        passProps: {
          screen: () => (
            <SearchBox
              noAutoNext
              autoFocus
              refreshAction={this.props.actions.schoolSuggestAction}
              queryKey={"prefix"}
              onSubmit={text => {
                if (
                  this.context.refs["g_searchBox"].state.data.results.length > 0
                ) {
                  this.props.actions.schoolSuggestAction(
                    {
                      prefix: text.replace(/\s/g, ""),
                      size: 10
                    },
                    res => {
                      if (this.context.refs["g_searchBox"]) {
                        this.context.refs["g_searchBox"].setState({
                          data: res
                        });
                      }
                    }
                  );
                } else {
                  this.props.actions.getSchoolSearchAction(
                    {
                      school_name: text
                    },
                    res => {
                      if (this.context.refs["g_searchBox"]) {
                        this.context.refs["g_searchBox"].setState({
                          data: res
                        });
                      }
                    }
                  );
                }
              }}
              renderItem={(item, index, word) => {
                return (
                  <SearchSchoolItem
                    onPress={this.onPressResult.bind(this, item.school_name)}
                    key={index + ""}
                    searchText={word}
                    fullText={item.school_name}
                    subFullText={
                      item.address
                        ? item.address + " "
                        : "" +
                          (item.is_985 ? "985 " : "") +
                          (item.is_211 ? "211 " : "") +
                          item.type
                    }
                  />
                );
              }}
            />
          )
        },
        navigatorStyle: {
          navBarHidden: true,
          navBarTextColor: "#fff",
          navBarButtonColor: "#fff",
          navBarBackgroundColor: SDMainColor,
          navBarTitleTextCentered: true,
          navBarSubTitleTextCentered: true,
          topBarElevationShadowEnabled: false,
          statusBarTextColorScheme: "light",
          // screenBackgroundColor: SDMainColor,
          navBarNoBorder: true,
          tabBarHidden: true // 隐藏tab
        }
      })
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {/* <SearchInput
          ref="_searchInput"
          placeholder={"搜索你感兴趣学校，如" + this.props.schoolName}
          onPress={this.pushSearch.bind(this)}
          onTouchStart={this.pushSearch.bind(this)}
        /> */}
        {/* {this.state.loading ? <SDLoading /> : null} */}
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <SearchHistoryWrap searchType="searcher_school" />
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  schoolName: getSchoolName(state, props)
}))(QuerySchoolView);
