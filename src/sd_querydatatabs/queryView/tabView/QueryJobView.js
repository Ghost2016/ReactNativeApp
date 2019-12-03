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
import { getJob } from "../../../directSelectors";
import ConnectWithActions from "../../../connectWithActions";
import { Navigation } from "react-native-navigation";
import SDLoading from "@sd_components/SDLoading";
import config from "../../../config";
import { dismissLightBox, navScreen, SDMainColor } from "../../../styles";
import SearchBox from "../../../sd_searchBox/SearchBox";
import SearchJobItem from "../../../sd_searchBox/SearchJobItem";
import { getJobDetailAction } from "../../../boot/actions";
import JobDetail from "../../../screens/pushScreen/searchData/tabs/JobDetail";
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

class QueryJobView extends React.Component {
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
  onPressResult(jobText) {
    Toast.loading("加载中", 0);
    this.props.actions
      .createRecordAction(
        {
          type: "searcher_job",
          content: jobText,
          value: jobText
        },
        res => {
          Toast.hide();
        }
      )
      .then(res => {
        if(res && res.status == 'ok') {
          Toast.loading("加载中", 0.1);
          // 延迟0.1s是为了解决android bug
          this.context.navigator.push(
            navScreen("PushScreen", "数据查询", {
              passProps: {
                screen: () => (
                  <JobDetail
                    is_liked={res.results.is_liked}
                    id={res.results.id}
                    type={res.results.type}
                    jobText={jobText}
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
        animationType: "fade",
        passProps: {
          screen: () => (
            <SearchBox
              autoFocus
              noAutoNext
              refreshAction={this.props.actions.positionSuggestAction}
              queryKey={"prefix"}
              onSubmit={text => {
                if (this.context.refs["g_searchBox"].state.data.results.length > 0) {
                  this.props.actions.positionSuggestAction(
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
                  this.props.actions.getPositionSearchAction(
                    {
                      position_name: text
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
                  <SearchJobItem
                    onPress={this.onPressResult.bind(this, item.position_name)}
                    key={index + ""}
                    word={word}
                    fullText={item.position_name}
                    industry={item.industry}
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
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <SearchHistoryWrap searchType="searcher_job" />
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  job: getJob(state, props)
}))(QueryJobView);
