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
import { getSchoolName, getSearchRecord } from "../../../directSelectors";
import ConnectWithActions from "../../../connectWithActions";
import { Navigation } from "react-native-navigation";
import SDLoading from "@sd_components/SDLoading";
import config from "../../../config";
import { navLightBox, dismissLightBox } from "../../../styles";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
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
    refs: PropTypes.object.isRequired
  };
  onChange(text) {
    // if (Platform.OS == "ios") {
    if (text !== "") {
      this.props.actions.getSchoolSuggestAction(
        {
          prefix: text.replace(/\s/g, "")
        },
        res => {
          if (res.length > 0) {
            if (this.context.refs["g_searchSchool"]) {
              this.context.refs["g_searchSchool"].setState({
                data: res
              });
            } else {
              Navigation.showLightBox({
                screen: `${config.projName}.SearchSchoolDataScreen`,
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
    this.props.actions.getSchoolSearchAction(
      {
        school_name: this.refs["_searchInput"].state.textValue
      },
      res => {
        // this.setState({
        //   loading: false
        // });
        if (res.length > 0) {
          if (this.context.refs["g_searchSchool"]) {
            this.context.refs["g_searchSchool"].setState({
              data: res
            });
          } else {
            Navigation.showLightBox({
              screen: `${config.projName}.SearchSchoolDataScreen`,
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
  }
  render() {
    return (
      <View style={styles.container}>
        <SearchInput
          ref="_searchInput"
          onSubmit={this.onSubmit.bind(this)}
          // value={this.state.searchText}
          onKeyChange={this.onChange.bind(this)}
          placeholder={"搜索你感兴趣学校，如" + this.props.schoolName}
        />
        {/* {this.state.loading ? <SDLoading /> : null} */}
        <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
          <SearchHistoryWrap searchType="searcher_school" />
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  schoolName: getSchoolName(state, props)
}))(QuerySchoolView);
