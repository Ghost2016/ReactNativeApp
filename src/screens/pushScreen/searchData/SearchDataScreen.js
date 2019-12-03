/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Toast } from "antd-mobile";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import SchoolResult from "../../../sd_querydatatabs/queryView/searchResult/SchoolResult";
import JobResult from "../../../sd_querydatatabs/queryView/searchResult/JobResult";
import MajorResult from "../../../sd_querydatatabs/queryView/searchResult/MajorResult";
import IndustryResult from "../../../sd_querydatatabs/queryView/searchResult/IndustryResult";
import ConnectWithActions from "../../../connectWithActions";
import { Navigation } from "react-native-navigation";
import { navLightBox, dismissLightBox } from "../../../styles";
import SchoolDetail from "./tabs/SchoolDetail";
import { Popup } from "../../../common";
import JobDetail from "./tabs/JobDetail";
import MajorDetail from "./tabs/MajorDetail";
import IndustryDetail from "./tabs/IndustryDetail";

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width - 20,
    height: Dimensions.get("window").height * 0.5,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    paddingTop: 10,

    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowColor: "#999",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4
  }
});

class SearchSchoolDataScreenB extends PureComponent<{}> {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data || []
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  onPressResult(schoolText) {
    if (this.props.onPressResult) {
      this.props.onPressResult(schoolText);
      return;
    }
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
          dismissLightBox();
        }
      )
      .then(res => {
        setTimeout(() => {
          Toast.loading("加载中", 0.1);
          navLightBox(
            "LightBoxScreen",
            {
              passProps: {
                screen: () => (
                  <Popup>
                    <SchoolDetail
                      is_liked={res.results.is_liked}
                      id={res.results.id}
                      type={res.results.type}
                      schoolText={schoolText}
                    />
                  </Popup>
                )
              }
            },
            {
              backgroundColor: "rgba(0, 0, 0, 0)"
            }
          );
        }, 100);
      });
  }
  componentDidMount() {
    this.context.refs["g_searchSchool"] = this;
  }
  componentWillUnmount() {
    if (this.context.refs["g_searchSchool"]) {
      delete this.context.refs["g_searchSchool"];
    }
  }
  makeSchoolResult() {
    let arrHtml = [];
    for (let i = 0; i < this.state.data.length; i++) {
      const element = this.state.data[i];
      arrHtml.push(
        <SchoolResult
          key={i + ""}
          // name={element.name}
          name={element.school_name}
          type={element.type}
          level={element.level}
          address={element.address}
          is_985={element.is_985}
          is_211={element.is_211}
          onPressResult={this.onPressResult.bind(this, element.school_name)}
        />
      );
    }
    return arrHtml;
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.makeSchoolResult()}
          {/* <SchoolResult  onPressResult={this.onPressResult.bind(this)} /> */}
        </ScrollView>
      </View>
    );
  }
}

export const SearchSchoolDataScreen = ConnectWithActions(
  (state, props) => ({})
)(SearchSchoolDataScreenB);

class SearchJobDataScreenB extends PureComponent<{}> {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data || []
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    this.context.refs["g_searchJob"] = this;
  }
  componentWillUnmount() {
    if (this.context.refs["g_searchJob"]) {
      delete this.context.refs["g_searchJob"];
    }
  }
  onPressResult(jobText) {
    if (this.props.onPressResult) {
      this.props.onPressResult(jobText);
      return;
    }
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
          dismissLightBox();
        }
      )
      .then(res => {
        setTimeout(() => {
          Toast.loading("加载中", 0.1);
          // 延迟0.1s是为了解决android bug
          navLightBox(
            "LightBoxScreen",
            {
              passProps: {
                screen: () => (
                  <Popup>
                    <JobDetail
                      is_liked={res.results.is_liked}
                      id={res.results.id}
                      type={res.results.type}
                      jobText={jobText}
                    />
                  </Popup>
                )
              }
            },
            {
              backgroundColor: "rgba(0, 0, 0, 0.1)"
            }
          );
        });
      });
  }
  makeJobResult() {
    let arrHtml = [];
    for (let i = 0; i < this.state.data.length; i++) {
      const element = this.state.data[i];
      arrHtml.push(
        <JobResult
          key={i + ""}
          // name={element.name}
          name={element.position_name}
          industry={element.industry}
          onPressResult={this.onPressResult.bind(this, element.position_name)}
        />
      );
    }
    return arrHtml;
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.makeJobResult()}
          {/* <JobResult onPressResult={this.onPressResult.bind(this)} />
          <JobResult onPressResult={this.onPressResult.bind(this)} />
          <JobResult onPressResult={this.onPressResult.bind(this)} />
          <JobResult onPressResult={this.onPressResult.bind(this)} /> */}
        </ScrollView>
      </View>
    );
  }
}

export const SearchJobDataScreen = ConnectWithActions((state, props) => ({}))(
  SearchJobDataScreenB
);

class SearchMajorDataScreenB extends PureComponent<{}> {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data || []
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    this.context.refs["g_searchMajor"] = this;
  }
  componentWillUnmount() {
    if (this.context.refs["g_searchMajor"]) {
      delete this.context.refs["g_searchMajor"];
    }
  }
  onPressResult(majorText) {
    if (this.props.onPressResult) {
      this.props.onPressResult(majorText);
      return;
    }
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
          dismissLightBox();
        }
      )
      .then(res => {
        setTimeout(() => {
          Toast.loading("加载中", 0.1);
          navLightBox(
            "LightBoxScreen",
            {
              passProps: {
                screen: () => (
                  <Popup>
                    <MajorDetail
                      is_liked={res.results.is_liked}
                      id={res.results.id}
                      type={res.results.type}
                      majorText={majorText}
                    />
                  </Popup>
                )
              }
            },
            {
              backgroundColor: "rgba(0, 0, 0, 0)"
            }
          );
        });
      });
  }
  makeMajorResult() {
    let arrHtml = [];
    for (let i = 0; i < this.state.data.length; i++) {
      const element = this.state.data[i];
      arrHtml.push(
        <MajorResult
          key={i + ""}
          // name={element.name}
          name={element.major}
          level2={element.level2}
          onPressResult={this.onPressResult.bind(this, element.major)}
        />
      );
    }
    return arrHtml;
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.makeMajorResult()}
          {/* <MajorResult onPressResult={this.onPressResult.bind(this)} />
          <MajorResult onPressResult={this.onPressResult.bind(this)} />
          <MajorResult onPressResult={this.onPressResult.bind(this)} />
          <MajorResult onPressResult={this.onPressResult.bind(this)} /> */}
        </ScrollView>
      </View>
    );
  }
}
export const SearchMajorDataScreen = ConnectWithActions((state, props) => ({}))(
  SearchMajorDataScreenB
);

class SearchIndustryDataScreenB extends PureComponent<{}> {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data || []
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    this.context.refs["g_searchIndustry"] = this;
  }
  componentWillUnmount() {
    if (this.context.refs["g_searchIndustry"]) {
      delete this.context.refs["g_searchIndustry"];
    }
  }
  onPressResult(industryText, id) {
    if (this.props.onPressResult) {
      this.props.onPressResult(industryText, id);
      return;
    }
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
          dismissLightBox();
        }
      )
      .then(res => {
        setTimeout(() => {
          Toast.loading("加载中", 0.1);
          navLightBox(
            "LightBoxScreen",
            {
              passProps: {
                screen: () => (
                  <Popup>
                    <IndustryDetail
                      is_liked={res.results.is_liked}
                      id={res.results.id}
                      type={res.results.type}
                      industryText={industryText}
                      industryId={id}
                    />
                  </Popup>
                )
              }
            },
            {
              backgroundColor: "rgba(0, 0, 0, 0)"
            }
          );
        });
      });
  }
  makeIndustryResult() {
    let arrHtml = [];
    for (let i = 0; i < this.state.data.length; i++) {
      const element = this.state.data[i];
      arrHtml.push(
        <IndustryResult
          key={i + ""}
          name={element.industry}
          onPressResult={this.onPressResult.bind(
            this,
            element.industry,
            element.id
          )}
        />
      );
    }
    return arrHtml;
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.makeIndustryResult()}
          {/* <IndustryResult onPressResult={this.onPressResult.bind(this)} />
          <IndustryResult onPressResult={this.onPressResult.bind(this)} />
          <IndustryResult onPressResult={this.onPressResult.bind(this)} />
          <IndustryResult onPressResult={this.onPressResult.bind(this)} /> */}
        </ScrollView>
      </View>
    );
  }
}
export const SearchIndustryDataScreen = ConnectWithActions(
  (state, props) => ({})
)(SearchIndustryDataScreenB);
