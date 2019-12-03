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
import { getIndustry } from "../../../directSelectors";
import ConnectWithActions from "../../../connectWithActions";
import { Navigation } from "react-native-navigation";
import SDLoading from "@sd_components/SDLoading";
import config from "../../../config";
import { dismissLightBox, navScreen, SDMainColor } from "../../../styles";
import SearchBox from "../../../sd_searchBox/SearchBox";
import SearchIndustryItem from "../../../sd_searchBox/SearchIndustryItem";
import IndustryDetail from "../../../screens/pushScreen/searchData/tabs/IndustryDetail";
import { CSS } from "../../../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    // flex: 1
    width: '100%',
    height: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(225,225,225,1)',
    marginTop: CSS.pixel(30)
  }
});

class QueryIndustryView extends React.Component {
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
  onPressResult(industryText, id) {
    Toast.loading("加载中", 0);
    this.props.actions
      .createRecordAction(
        {
          type: "searcher_profession",
          content: industryText,
          value: id // 记录行业的id
        },
        res => {
          // 进行判断是否有收藏
          Toast.hide();
        }
      )
      .then(res => {
        if(res && res.status) {
          Toast.loading("加载中", 0.1);
          this.context.navigator.push(
            navScreen("PushScreen", "数据解析", {
              passProps: {
                screen: () => (
                  <IndustryDetail
                    is_liked={res.results.is_liked}
                    id={res.results.id}
                    type={res.results.type}
                    industryText={industryText}
                    industryId={id}
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
      navScreen("PushScreen", "查询职位", {
        animated: true,
        animationType: 'fade',
        passProps: {
          screen: () => (
            <SearchBox
              autoFocus
              noAutoNext
              refreshAction={this.props.actions.industrySuggestAction}
              queryKey={"prefix"}
              onSubmit={text => {
                if (this.context.refs["g_searchBox"].state.data.results.length > 0) {
                  this.props.actions.industrySuggestAction(
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
                  this.props.actions.getIndustrySearchAction(
                    {
                      industry: text
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
                  <SearchIndustryItem
                    onPress={this.onPressResult.bind(
                      this,
                      item.industry,
                      item.id
                    )}
                    key={index + ""}
                    word={word}
                    fullText={item.industry}
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
          placeholder={"搜索你感兴趣行业名称，如" + this.props.industry || ""}
        /> */}
        {/* {this.state.loading ? <SDLoading /> : null} */}
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <SearchHistoryWrap searchType="searcher_profession" />
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  industry: getIndustry(state, props)
}))(QueryIndustryView);
