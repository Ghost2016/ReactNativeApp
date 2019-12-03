// 数据查询页面
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import QueryDataTabs from "../../sd_querydatatabs/QueryDataTabs";
import SDSearchBar from "../../common/SDSearchBar";
import SDHeader from "../../common/SDHeader";
import SDTabs2 from "../../sd_components/SDTabs2";
import QuerySchoolView from "../../sd_querydatatabs/queryView/tabView/QuerySchoolView";
import QueryMajorView from "../../sd_querydatatabs/queryView/tabView/QueryMajorView";
import QueryIndustryView from "../../sd_querydatatabs/queryView/tabView/QueryIndustryView";
import QueryJobView from "../../sd_querydatatabs/queryView/tabView/QueryJobView";
import { CSS } from "../../common/SDCSS";
import { Context } from "../../types";
import SDSchoolResult from "../../common/SDSchoolResult";
import SDMajorResult from "../../common/SDMajorResult";
import SDIndustryResult from "../../common/SDIndustryResult";
import SDJobResult from "../../common/SDJobResult";
import connectWithActions from "../../connectWithActions";
import { Toast } from "antd-mobile";
import { navScreen } from "../../styles";
import SchoolDetail from "./searchData/tabs/SchoolDetail";
import MajorDetail from "./searchData/tabs/MajorDetail";
import IndustryDetail from "./searchData/tabs/IndustryDetail";
import JobDetail from "./searchData/tabs/JobDetail";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

// 数据查询屏幕
class DataQueryScreen extends React.Component {
  context: Context;
  static contextTypes = {
    navigator: () => null,
    refs: () => null
  };

  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      collectData: [],
      searchText: "",

      schoolData: {
        results: []
      },
      majorData: {
        results: []
      },
      industryData: {
        results: []
      },
      jobData: {
        results: []
      }
    };
  }
  onTabChange(index) {
    this.setState(
      {
        tabIndex: index
      },
      () => {
        this.onChange(this.state.searchText);
      }
    );
  }

  onChangeSchool(text) {
    this.props.actions.schoolSuggestAction({
      prefix: text,
      size: 10
    }).then(res => {
      this.setState({
        schoolData: res
      })
    }).catch(err => {

    })
  }

  onSubmitSchool(text) {
    if (this.state.schoolData.results.length > 0) {
      this.props.actions
        .schoolSuggestAction({
          prefix: text,
          size: 10
        })
        .then(res => {
          this.setState({
            schoolData: res
          });
        })
        .catch();
    } else {
      this.props.actions
        .getSchoolSearchAction({
          school_name: text
        })
        .then(res => {
          this.setState({
            schoolData: res.results
          });
        })
        .catch();
    }
  }

  onChangeMajor(text) {
    this.props.actions
      .majorSuggestAction({
        prefix: text,
        size: 10
      })
      .then(res => {
        this.setState({
          majorData: res
        });
      })
      .catch(err => {});
  }

  onSubmitMajor(text) {
    if (this.state.majorData.results.length > 0) {
      this.props.actions
        .majorSuggestAction({
          prefix: text,
          size: 10
        })
        .then(res => {
          this.setState({
            majorData: res
          });
        })
        .catch(err => {});
    } else {
      this.props.actions
        .getMajorSearchAction({
          major: text
        })
        .then(res => {
          this.setState({
            majorData: res.results
          });
        })
        .catch(err => {});
    }
  }

  onChangeJob(text) {
    this.props.actions
      .positionSuggestAction({
        prefix: text,
        size: 10
      })
      .then(res => {
        this.setState({
          jobData: res
        });
      })
      .catch(err => {});
  }

  onSubmitJob(text) {
    if (this.state.jobData.results.length > 0) {
      this.props.actions
        .positionSuggestAction({
          prefix: text,
          size: 10
        })
        .then(res => {
          this.setState({
            jobData: res
          });
        })
        .catch(err => {});
    } else {
      this.props.actions
        .getPositionSearchAction({
          position_name: text
        })
        .then(res => {
          this.setState({
            jobData: res.results
          });
        })
        .catch(err => {});
    }
  }

  onChangeIndustry(text) {
    this.props.actions
      .industrySuggestAction({
        prefix: text,
        size: 10
      })
      .then(res => {
        this.setState({
          industryData: res
        });
      })
      .catch();
  }

  onSubmitIndustry(text) {
    if (this.state.industryData.results.length > 0) {
      this.props.actions
        .industrySuggestAction({
          prefix: text,
          size: 10
        })
        .then(res => {
          this.setState({
            industryData: res
          });
        })
        .catch();
    } else {
      this.props.actions
        .getIndustrySearchAction({
          industry: text
        })
        .then(res => {
          this.setState({
            industryData: res.results
          });
        })
        .catch();
    }
  }

  onChange(text) {
    if(!text) {
      return;
    } else {
      text = text.trim();
    }
    this.state.searchText = text;
    switch (this.state.tabIndex) {
      case 0:
        this.onChangeSchool(text);
        break;
      case 1:
        this.onChangeMajor(text);
        break;
      case 2:
        this.onChangeJob(text);
        break;
      case 3:
        this.onChangeIndustry(text);
        break;
    }
  }

  onSubmit(text) {
    this.state.searchText = text;
    switch (this.state.tabIndex) {
      case 0:
        this.onSubmitSchool(text);
        break;
      case 1:
        this.onSubmitMajor(text);
        break;
      case 4:
        this.onSubmitJob(text);
        break;
      case 3:
        this.onSubmitIndustry(text);
        break;
    }
  }

  onPressSchoolResult(text) {
    Toast.loading("加载中");
    this.props.actions
      .createRecordAction({
        type: "searcher_school",
        content: text,
        value: text
      })
      .then(res => {
        Toast.hide();
        this.context.navigator.push(
          navScreen("PushScreen", "数据解析", {
            passProps: {
              screen: () => (
                <SchoolDetail
                  is_liked={res.results.is_liked}
                  id={res.results.id}
                  type={res.results.type}
                  schoolText={text}
                />
              ),
              fullScreen: true,
              noScrollView: true
            }
          })
        );
      })
      .catch(err => {});
  }

  onPressMajorResult(text, level) {
    Toast.loading("加载中");
    this.props.actions
      .createRecordAction({
        type: "searcher_major",
        content: text,
        value: text
      })
      .then(res => {
        Toast.hide();
        this.context.navigator.push(
          navScreen("PushScreen", "数据解析", {
            passProps: {
              screen: () => (
                <MajorDetail
                  is_liked={res.results.is_liked}
                  id={res.results.id}
                  type={res.results.type}
                  degreeName={level}
                  majorText={text}
                />
              ),
              fullScreen: true,
              noScrollView: true
            }
          })
        );
      })
      .catch(err => {});
  }

  onPressIndustryResult(text, id) {
    Toast.loading("加载中");
    this.props.actions
      .createRecordAction({
        type: "searcher_profession",
        content: text,
        value: id // 记录行业的id
      })
      .then(res => {
        Toast.hide();
        this.context.navigator.push(
          navScreen("PushScreen", "数据解析", {
            passProps: {
              screen: () => (
                <IndustryDetail
                  is_liked={res.results.is_liked}
                  id={res.results.id}
                  type={res.results.type}
                  industryText={text}
                  industryId={id}
                />
              ),
              fullScreen: true,
              noScrollView: true
            }
          })
        );
      })
      .catch(err => {});
  }

  onPressJobResult(text) {
    Toast.loading("加载中");
    this.props.actions
      .createRecordAction({
        type: "searcher_job",
        content: text,
        value: text
      })
      .then(res => {
        Toast.loading("加载中", 0.1);
        this.context.navigator.push(
          navScreen("PushScreen", "数据查询", {
            passProps: {
              screen: () => (
                <JobDetail
                  is_liked={res.results.is_liked}
                  id={res.results.id}
                  type={res.results.type}
                  jobText={text}
                />
              ),
              fullScreen: true,
              noScrollView: true
            }
          })
        );
      })
      .catch(err => {});
  }

  componentWillMount() {
    this.fetchCollectRecord();
  }

  componentDidMount() {
    this.context.refs["g_queryDataTabs"] = this;
  }

  componentWillUnmount() {
    if (this.context.refs["g_queryDataTabs"]) {
      delete this.context.refs["g_queryDataTabs"];
    }
  }

  fetchCollectRecord() {
    this.props.actions
      .getLikeRecordAction()
      .then(res => {
        if (res.status == "ok") {
          this.state.collectData = res.results;
        }
      })
      .catch(err => {});
  }

  render() {
    return (
      <View style={styles.container}>
        <SDHeader
          backgroundColor="#fff"
          custom={() => {
            return (
              <SDSearchBar
                autoFocus
                placeholder={
                  this.state.tabIndex == 0
                    ? "搜索你感兴趣的学校名称"
                    : this.state.tabIndex == 1
                      ? "搜索你感兴趣的专业名称"
                      : this.state.tabIndex == 2
                        ? "搜索你感兴趣的职位名称"
                        : "搜索你感兴趣的行业名称"
                }
                onChange={this.onChange.bind(this)}
                onSubmit={this.onSubmit.bind(this)}
                onCancel={() => {
                  this.context.navigator && this.context.navigator.pop();
                }}
              />
            );
          }}
        />
        {/* <QueryDataTabs /> */}

        <SDTabs2
          tabTitles={["学校", "专业", "职位", "行业"]}
          page={this.state.tabIndex}
          underLineWidth={30}
          onChangeTab={this.onTabChange.bind(this)}
          activeColor={"#333"}
          inActiveColor={"#999"}
          style={{
            paddingTop: CSS.pixel(30),
            backgroundColor: "#fff",
            flex: 1
          }}
          tabContentStyle={{
            width: "100%",
            // height: "100%",
            flex: 1
          }}
        >
          {this.state.searchText && this.state.tabIndex == 0 ? (
            <SDSchoolResult
              style={{
                width: "100%"
              }}
              queryAction={this.props.actions.schoolSuggestAction}
              enableRefresh
              onPressResult={this.onPressSchoolResult.bind(this)}
              data={this.state.schoolData}
              searchWord={this.state.searchText}
            />
          ) : (
            <QuerySchoolView />
          )}
          {this.state.searchText && this.state.tabIndex == 1 ? (
            <SDMajorResult
              queryAction={this.props.actions.majorSuggestAction}
              enableRefresh
              data={this.state.majorData}
              searchWord={this.state.searchText}
              onPressResult={this.onPressMajorResult.bind(this)}
            />
          ) : (
            <QueryMajorView />
          )}
          {this.state.searchText && this.state.tabIndex == 2 ? (
            <SDJobResult
              data={this.state.jobData}
              queryAction={this.props.actions.positionSuggestAction}
              enableRefresh
              searchWord={this.state.searchText}
              onPressResult={this.onPressJobResult.bind(this)}
            />
          ) : (
            <QueryJobView />
          )}
          {this.state.searchText && this.state.tabIndex == 3 ? (
            <SDIndustryResult
              data={this.state.industryData}
              queryAction={this.props.actions.industrySuggestAction}
              enableRefresh
              searchWord={this.state.searchText}
              onPressResult={this.onPressIndustryResult.bind(this)}
            />
          ) : (
            <QueryIndustryView />
          )}
        </SDTabs2>
      </View>
    );
  }
}

export default connectWithActions((state, props) => ({}))(DataQueryScreen);
