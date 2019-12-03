/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  Image
} from "react-native";
import { Toast } from "antd-mobile";
import { navScreen } from "@styles";
import CardItem from "./CardItem";
import { CSS } from "../../common/SDCSS";
import FurtherStudyScreen from "../../screens/pushScreen/dataParse/FurtherStudyScreen";
import CompanyScreen from "../../screens/pushScreen/dataParse/CompanyScreen";
import DomainScreen from "../../screens/pushScreen/dataParse/DomainScreen";
import SalaryScreen from "../../screens/pushScreen/dataParse/SalaryScreen";
import connectWithActions from "../../connectWithActions";
import { getSchoolName, getMajor, getSchoolLevel } from "../../directSelectors";
import SearchSMIP from "../../sd_components/SearchSMIP";
import { navRightButton } from "../../styles";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    marginTop: CSS.pixel(30, true),

    justifyContent: "space-around",
    alignContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap"
  }
});

class CardGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schoolCount: 0,
      majorCount: 0,
      res1: null,
      res2: null,
      res3: null,
      res4: null,

      count1: 0,
      count2: 0,
      count3: 0,
      count4: 0,

      beforeSchool: this.props.schoolName,
      beforeMajor: this.props.majorName
    };
  }

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.fetchData();
  }

  componentDidMount() {
    this.context.refs["homeCardGroup"] = this;
  }

  fetchData() {
    return new Promise.all([
      // 本校样本数
      this.props.actions.getSchoolWorkYearAction({
        school_name: this.props.schoolName,
        degree: '不限',//this.props.degreeName,
        work_year: 5
      }), //v1
      // 全国所有专业
      this.props.actions.getMajorWorkYearAction({
        major: this.props.majorName,
        degree: this.props.degreeName,
        work_year: 5
      }), // v2
      // 本校本专业样本数
      this.props.actions.getSchoolMajorWorkYearAction({
        school_name: this.props.schoolName,
        major: this.props.majorName,
        degree: this.props.degreeName,
        work_year: 5
      }), // v3
      // 本专业公司就业样本数
      this.props.actions.getMajorCompanyAction({
        major: this.props.majorName,
        sort: "-person_num",
        degree: this.props.degreeName
      }) // v4
    ])
      .then(values => {
        // console.warn(values);
        if (
          Array.isArray(values) &&
          values.length && values[0] && values[1] && values[2] && values[3] &&
          values[0].status == "ok" &&
          values[1].status == "ok" &&
          values[2].status == "ok" &&
          values[3].status == "ok"
        ) {
          let count01 = 0;
          let count02 = 0;
          let count03 = 0;
          let count04 = 0;
          values[0].results.map(c => {
            count01 = count01 + (c.person_num ? c.person_num : 0);
          });
          values[1].results.map(c => {
            count02 = count02 + (c.person_num ? c.person_num : 0);
          });
          values[2].results.map(c => {
            count03 = count03 + (c.person_num ? c.person_num : 0);
          });
          values[3].results.map((c, index) => {
            if (index >= 10) {
              return;
            }
            count04 = count04 + (c.person_num ? c.person_num : 0);
          });

          this.setState({
            count1: count01,
            count2: count02,
            count3: count03,
            count4: count04
          });
          // this.setState({
          //   schoolCount: 0,
          //   majorCount: 0
          // })
        }
      })
      .catch(err => {
        Toast.fail(err);
      });
  }

  onPressSalaryItem() {
    // this.goToScreen("example.SalaryParseScreen");
    this.context.navigator.push(
      navScreen("PushScreen", "薪资增长趋势", {
        passProps: {
          screen: () => (
            <SalaryScreen
            currSchoolNum={this.state.count1}
            allSchoolMajorNum={this.state.count2}
            currSchoolMajorNum={this.state.count3}
          />),
          fullScreen: true,
          header: {
            fixed: true,
            title: "薪资增长趋势"
          }
        }
      })
    );
  }

  onPressDomainItem() {
    // this.goToScreen("example.DomainScreen");
    this.context.navigator.push(
      navScreen("PushScreen", "就业领域分布", {
        passProps: {
          screen: () => <DomainScreen
            allMajorNum={this.state.count2}
          />,
          fullScreen: true,
          header: {
            fixed: true,
            title: "就业领域分布"
          }
        }
      })
    );
  }

  onPressCompanyItem() {
    // this.goToScreen("example.CompanyScreen");
    this.context.navigator.push(
      navScreen("PushScreen", "就业公司分布", {
        passProps: {
          screen: () => <CompanyScreen
            allMajorNum={this.state.count4}
          />,
          fullScreen: true,
          header: {
            fixed: true,
            title: "就业公司分布"
          }
        }
      })
    );
  }

  onPressFurtherStudyItem() {
    // this.goToScreen("example.FurtherStudyScreen");
    // FurtherStudyScreen
    // this.context.navigator.push(
    //   navScreen("PushScreen", "数据解析", {
    //     passProps: {
    //       screen: () => <FurtherStudyScreen person_num={this.state.res3 ? this.state.res3[0].person_num : 0}/>,
    //       fullScreen: true,
    //       header: {
    //         fixed: true,
    //         title: "数据解析"
    //       }
    //     }
    //   })
    // );

    this.context.navigator.push(
      navScreen("PushScreen", "数据查询", {
        passProps: {
          screen: () => <SearchSMIP />,
          fullScreen: true,
          noScrollView: true,
          header: {
            title: "数据查询"
            //fixed: true,
          }
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存"),
        ...navRightButton("dataQueryScreenBtn", () => (
          <Image source={require("@img/home/home_ico_search.png")} />
        ))
      })
    );
  }

  componentDidUpdate(next) {
    // this.fetchData();
    if (
      this.props.majorName !== this.state.beforeMajor ||
      this.props.schoolName !== this.state.beforeSchool
    ) {
      this.state.beforeSchool = this.props.schoolName;
      this.state.beforeMajor = this.props.majorName;
      this.fetchData();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <CardItem
          onPress={this.onPressSalaryItem.bind(this)}
          img="icon01"
          title="薪资增长趋势"
          style={{
            marginRight: CSS.pixel(20),
            marginBottom: CSS.pixel(20, true)
          }}
          count={this.state.count1 + this.state.count2}
        />
        <CardItem
          onPress={this.onPressDomainItem.bind(this)}
          img="icon02"
          title="就业领域分布"
          count={this.state.count2}
        />
        <CardItem
          onPress={this.onPressCompanyItem.bind(this)}
          img="icon03"
          title="就业公司分布"
          style={{
            marginRight: CSS.pixel(20),
            marginBottom: CSS.pixel(20, true)
          }}
          count={this.state.count4}
        />
        <CardItem
          onPress={this.onPressFurtherStudyItem.bind(this)}
          img="icon04"
          title="查询更多"
          // count={this.state.res3 ? this.state.res3[0].person_num : 0}
        />
      </View>
    );
  }
}

export default connectWithActions((state, props) => ({
  schoolName: getSchoolName(state, props),
  majorName: getMajor(state, props),
  degreeName: getSchoolLevel(state, props)
}))(CardGroup);
