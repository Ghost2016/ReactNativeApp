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
import { dismissLightBox } from "../../../styles";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
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
    refs: PropTypes.object.isRequired
  };
  onChange(text) {
    // if (Platform.OS == "ios") {
      if (text !== "") {
        this.props.actions.getPositionSuggestAction(
          {
            prefix: text.replace(/\s/g, "")
          },
          res => {
            if (res.length > 0) {
              // console.log(res);
              // navLightBox(`${config.projName}.SearchSchoolDataScreen`, {

              // })
              // dismissLightBox();
              if (this.context.refs["g_searchJob"]) {
                this.context.refs["g_searchJob"].setState({
                  data: res
                });
              } else {
                Navigation.showLightBox({
                  screen: `${config.projName}.SearchJobDataScreen`,
                  passProps: {
                    passSpecialProps: {
                      data: res
                    }
                  },
                  style: {
                    backgroundBlur: "none",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    tapBackgroundToDismiss: true
                  }
                });
              }
            } else {
              dismissLightBox();
              Toast.info("查询暂无结果", 0.1);
            }
          }
        );
      } else {
        dismissLightBox();
      }
    // }
  }
  onSubmit() {
    // this.setState({
    //   loading: true
    // });

    this.props.actions.getPositionSearchAction(
      {
        position_name: this.refs["_searchInput"].state.textValue
      },
      res => {
        // this.setState({
        //   loading: false
        // });
        if (res.length > 0) {
          Navigation.showLightBox({
            screen: `${config.projName}.SearchJobDataScreen`,
            passProps: {
              passSpecialProps: {
                data: res
              }
            },
            style: {
              backgroundBlur: "none",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              tapBackgroundToDismiss: true
            }
          });
        } else {
          dismissLightBox();
          Toast.info("查询暂无结果", 0.1);
        }
      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchInput
          onSubmit={this.onSubmit.bind(this)}
          onKeyChange={this.onChange.bind(this)}
          ref="_searchInput"
          placeholder={"搜索你感兴趣职位名称，如" + this.props.job || ""}
        />
        {/* {this.state.loading ? <SDLoading /> : null} */}
        <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
          <SearchHistoryWrap searchType="searcher_job" />
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  job: getJob(state, props)
}))(QueryJobView);
