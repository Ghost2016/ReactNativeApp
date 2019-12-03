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
import { Toast } from "antd-mobile";
import SearchInput from "../SearchInput";
import SearchHistoryWrap from "../SearchHistoryWrap";
import { getMajor } from "../../../directSelectors";
import ConnectWithActions from "../../../connectWithActions";
import { Navigation } from "react-native-navigation";
import SDLoading from "@sd_components/SDLoading";
import config from "../../../config";
import { dismissLightBox, navScreen, SDMainColor } from "../../../styles";
import SearchBox from "../../../sd_searchBox/SearchBox";
import SearchSchoolItem from "../../../sd_searchBox/SearchSchoolItem";
import MajorDetail from "../../../screens/pushScreen/searchData/tabs/MajorDetail";
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

class QueryMajorView extends React.Component {
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

  onPressResult(majorText) {
    Toast.loading("加载中", 0);
    this.props.actions
      .createRecordAction(
        {
          type: "searcher_major",
          content: majorText,
          value: majorText
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
                  <MajorDetail
                    is_liked={res.results.is_liked}
                    id={res.results.id}
                    type={res.results.type}
                    majorText={majorText}
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
      navScreen("PushScreen", "查询专业", {
        animated: true,
        animationType: "fade",
        passProps: {
          screen: () => (
            <SearchBox
              noAutoNext
              autoFocus
              refreshAction={this.props.actions.majorSuggestAction}
              queryKey={"prefix"}
              onSubmit={text => {
                if (this.context.refs["g_searchBox"].state.data.results.length > 0) {
                  this.props.actions.majorSuggestAction(
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
                  this.props.actions.getMajorSearchAction(
                    {
                      major: text
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
                    onPress={this.onPressResult.bind(this, item.major)}
                    key={index + ""}
                    searchText={word}
                    fullText={item.major}
                    subFullText={
                      item.level + " " + item.level1 + " " + item.level2
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
          onPress={this.pushSearch.bind(this)}
          onTouchStart={this.pushSearch.bind(this)}
          placeholder={"搜索你感兴趣专业名称，如" + this.props.major}
        /> */}
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <SearchHistoryWrap searchType="searcher_major" />
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  major: getMajor(state, props)
}))(QueryMajorView);
