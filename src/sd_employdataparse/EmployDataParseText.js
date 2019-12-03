/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../connectWithActions";
import { getMajor, getSchoolName } from "../directSelectors";
import {
  getSalaryParseText,
  getDomainParseText,
  getCompanyParseText,
  getFurtherStudyParseText
} from "../selectors";
import GestureRecognizer from "react-native-swipe-gestures";
import { dismissLightBox } from "../styles";

const wIs320 = Dimensions.get("window").width <= 320;

const styles = StyleSheet.create({
  container: {
    height: 120,
    backgroundColor: "#fff"
  },
  titleBox: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center"
  },
  title: {
    color: "#333",
    fontSize: 18
  },
  subInfo: {
    color: "#aaa",
    fontSize: wIs320 ? 12 : 14,
    textAlign: "center",
    lineHeight: 22,
    marginTop: wIs320 ? 10 : 0
  }
});
class SalaryDataParseText extends React.Component {
  render() {
    return (
      <GestureRecognizer
        onSwipeRight={state => {
          dismissLightBox();
        }}
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80
        }}
        style={styles.container}
      >
        <View style={styles.titleBox}>
          <Text style={styles.title}>
            {this.props.schoolName}就业薪资数据报告
          </Text>
          <Text style={styles.subInfo}>{`本报告收集了${this.props.countNum}个${
            this.props.schoolName
          }真实就业案例，为你全面解析本学校就业情况`}</Text>
        </View>
      </GestureRecognizer>
    );
  }
}
export const SalaryDataParseTextC = ConnectWithActions((state, props) => ({
  schoolName: getSchoolName(state, props)
}))(SalaryDataParseText);

// 领域数据解析
class DomainDataParseText extends React.Component {
  render() {
    return (
      <GestureRecognizer
        onSwipeRight={state => {
          dismissLightBox();
        }}
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80
        }}
        style={styles.container}
      >
        <View style={styles.titleBox}>
          <Text style={styles.title}>{this.props.majorName}专业数据报告</Text>
          {/* 本数据收集了${this.props.countNum}个 */}
          <Text style={styles.subInfo}>{`本报告收集了${this.props.countNum}个${
            this.props.majorName
          }真实就业案例，为你全面解析该专业就业情况`}</Text>
        </View>
      </GestureRecognizer>
    );
  }
}
export const DomainDataParseTextC = ConnectWithActions((state, props) => ({}))(
  DomainDataParseText
);

// 公司分布
class CompanyDataParseText extends React.Component {
  render() {
    return (
      <GestureRecognizer
        onSwipeRight={state => {
          dismissLightBox();
        }}
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80
        }}
        style={styles.container}
      >
        <View style={styles.titleBox}>
          <Text style={styles.title}>{this.props.jobName}职位就业数据报告</Text>
          <Text style={styles.subInfo}>{`本报告收集了${this.props.countNum}个${
            this.props.jobName
          }真实就业案例，为你全面解析该职位就业情况`}</Text>
        </View>
      </GestureRecognizer>
    );
  }
}
export const CompanyDataParseTextC = ConnectWithActions((state, props) => ({}))(
  CompanyDataParseText
);

// 深造情况解析
class FurtherStudyParseText extends React.Component {
  render() {
    return (
      <GestureRecognizer
        onSwipeRight={state => {
          dismissLightBox();
        }}
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80
        }}
        style={styles.container}
      >
        <View style={styles.titleBox}>
          <Text style={styles.title}>
            {this.props.industryName}行业深造情况分布
          </Text>
          <Text style={styles.subInfo}>{`本数据收集了${this.props.countNum}个${
            this.props.industryName
          }真实就业案例，为你全面解析该行业就业情况`}</Text>
        </View>
      </GestureRecognizer>
    );
  }
}
export const FurtherStudyParseTextC = ConnectWithActions(
  (state, props) => ({})
)(FurtherStudyParseText);
