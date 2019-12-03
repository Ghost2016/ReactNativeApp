/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image
  //ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
import { CSS } from "../../common/SDCSS";
import SearchHistoryItem from "./SearchHistoryItem";
import ConnectWithActions from "../../connectWithActions";
import SDLoading from "@sd_components/SDLoading";
import {
  getSchoolSearchData,
  getMajorSearchData,
  getJobSearchData,
  getIndustrySearchData
} from "../queryDataTabsSelector";
import SDTouchOpacity from "../../common/SDTouchOpacity";
type Props = {
  placeholder: string
};
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleWrap: {
    paddingTop: CSS.pixel(20, true),
    paddingBottom: CSS.pixel(20, true),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: CSS.pixel(40),
    paddingRight: CSS.pixel(40),
    backgroundColor: "#fff"
  },
  titleText: {
    justifyContent: "center"
  },
  titleClear: {
    // justifyContent: "center",
    flexDirection: 'row',
    alignItems: 'center'
  },
  textColor: {
    color: "#999",
    fontSize: CSS.textSize(24)
  }
});
class SearchHistoryWrap extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.props.actions.getRecordAction(
      {
        type: this.props.searchType,
        size: 999
      },
      () => {
        this.setState({
          loading: false
        });
      }
    );
  }

  renderHistory() {
    let arrHtml = [];
    if (this.props.searchType === "searcher_school") {
      for (let i = this.props.searchSchoolData.length - 1; i >= 0; i--) {
        const element = this.props.searchSchoolData[i];
        if (element.type == this.props.searchType && element.value && element.value.indexOf('tree') < 0) {
          arrHtml.push(
            <SearchHistoryItem
              screen="SearchSchoolDataScreen"
              searchType="school"
              key={element.id + ""}
              id={element.id}
              value={element.value}
              content={element.content}
            />
          );
        }
      }
    } else if (this.props.searchType === "searcher_major") {
      // console.warn(this.props.searchMajorData.length);
      for (let i = 0; i < this.props.searchMajorData.length; i++) {
        const element = this.props.searchMajorData[i];
        if (element.type == this.props.searchType && element.value && element.value.indexOf('tree') < 0) {
          arrHtml.push(
            <SearchHistoryItem
              screen="SearchMajorDataScreen"
              searchType="major"
              key={element.id + ""}
              id={element.id}
              value={element.value}
              content={element.content}
            />
          );
        }
      }
    } else if (this.props.searchType === "searcher_job") {
      for (let i = 0; i < this.props.searchJobData.length; i++) {
        const element = this.props.searchJobData[i];
        if (element.type == this.props.searchType && element.value && element.value.indexOf('tree') < 0) {
          arrHtml.push(
            <SearchHistoryItem
              screen="SearchJobDataScreen"
              searchType="position"
              key={element.id + ""}
              id={element.id}
              value={element.value}
              content={element.content}
            />
          );
        }
      }
    } else if (this.props.searchType === "searcher_profession") {
      for (let i = 0; i < this.props.searchIndustryData.length; i++) {
        const element = this.props.searchIndustryData[i];
        if (element.type == this.props.searchType && element.value && element.value.indexOf('tree') < 0) {
          arrHtml.push(
            <SearchHistoryItem
              screen="SearchIndustryDataScreen"
              searchType="industry"
              key={element.id + ""}
              id={element.id}
              value={element.value}
              content={element.content}
            />
          );
        }
      }
    }

    // 只要前十条历史数据
    return arrHtml.slice(0, 10);
  }

  onPressDelAllRecord() {
    this.props.actions.deleteAllRecordAction({
      type: this.props.searchType
    });
  }

  render() {
    return (
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        style={{
          display:
            this.props.searchType === "searcher_school"
              ? this.props.searchSchoolData.length == 0
                ? "none"
                : "flex"
              : this.props.searchType === "searcher_major"
                ? this.props.searchMajorData.length == 0
                  ? "none"
                  : "flex"
                : this.props.searchType === "searcher_job"
                  ? this.props.searchJobData.length == 0
                    ? "none"
                    : "flex"
                  : this.props.searchType === "searcher_profession"
                    ? this.props.searchIndustryData.length == 0
                      ? "none"
                      : "flex"
                    : "none"
        }}
      >
        {this.state.loading ? <SDLoading /> : null}
        <View style={styles.titleWrap}>
          <View style={styles.titleText}>
            <Text style={styles.textColor}>历史记录</Text>
          </View>
          <SDTouchOpacity
            style={styles.titleClear}
            onPress={this.onPressDelAllRecord.bind(this)}
          >
            <Image source={require("@img/home/home_ico_search_delate.png")} style={{marginRight: CSS.pixel(10)}}/>
            <Text style={styles.textColor}>全部清除</Text>
          </SDTouchOpacity>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: CSS.pixel(30)}}>{this.renderHistory()}</View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  searchSchoolData: getSchoolSearchData(state),
  searchMajorData: getMajorSearchData(state),
  searchJobData: getJobSearchData(state),
  searchIndustryData: getIndustrySearchData(state)
}))(SearchHistoryWrap);
