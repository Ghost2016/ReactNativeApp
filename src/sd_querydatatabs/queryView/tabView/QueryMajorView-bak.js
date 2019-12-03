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
import { dismissLightBox } from "../../../styles";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
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
    refs: PropTypes.object.isRequired
  };
  onChange(text) {
    // if (Platform.OS == "ios") {
    if (text !== "") {
      this.props.actions.getMajorSuggestAction(
        {
          prefix: text.replace(/\s/g, "")
        },
        res => {
          if (res.length > 0) {
            // console.log(res);
            // navLightBox(`${config.projName}.SearchSchoolDataScreen`, {

            // })
            // dismissLightBox();
            if (this.context.refs["g_searchMajor"]) {
              this.context.refs["g_searchMajor"].setState({
                data: res
              });
            } else {
              Navigation.showLightBox({
                screen: `${config.projName}.SearchMajorDataScreen`,
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
    this.props.actions.getMajorSearchAction(
      {
        major: this.refs["_searchInput"].state.textValue
      },
      res => {
        // this.setState({
        //   loading: false
        // });
        if (res.length > 0) {
          Navigation.showLightBox({
            screen: `${config.projName}.SearchMajorDataScreen`,
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

    // this.props.actions.biSuggestAction(
    //   {
    //     title: "major",
    //     keyword: this.state.searchText
    //   },
    //   res => {
    //     this.setState({
    //       loading: false
    //     });
    //     if (res.length > 0) {
    //       Navigation.showLightBox({
    //         screen: `${config.projName}.SearchMajorDataScreen`,
    //         passProps: {
    //           passSpecialProps: {
    //             data: res
    //           }
    //         },
    //         style: {
    //           backgroundBlur: "none",
    //           backgroundColor: "rgba(0, 0, 0, 0.1)",
    //           tapBackgroundToDismiss: true
    //         }
    //       });
    //     } else {
    //       Toast.info("查询暂无结果");
    //     }
    //   }
    // );
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchInput
          onSubmit={this.onSubmit.bind(this)}
          onKeyChange={this.onChange.bind(this)}
          ref="_searchInput"
          placeholder={"搜索你感兴趣专业名称，如" + this.props.major}
        />
        {/* {this.state.loading ? <SDLoading /> : null} */}
        <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
          <SearchHistoryWrap searchType="searcher_major" />
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  major: getMajor(state, props)
}))(QueryMajorView);
