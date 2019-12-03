/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  Fragment,
  Image,
  View,
  Text
} from "react-native";
import ConnectWithActions from "@src/connectWithActions";
import { getUserAllInfo } from "@src/users/usersSelector";
import { Toast } from "antd-mobile";
import store from "@boot/store";
import * as navHelper from "@utils/navigationHelper";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import IntlText from "@sd_components/IntlText";
import SDTabs2 from "@sd_components/SDTabs2";
import { navScreen, navRightButton } from "@styles";
import FootSpace from "@sd_components/FootSpace";
import SDButton from "@sd_components/SDButton";
import { HorizontalBarChart } from "@src/sd_charts";
import { JOB_PLAN_TYPES } from "@src/nullObjects";
import SDBox2 from "@sd_components/SDBox2";
import SDLoading from "@sd_components/SDLoading";
import JobPlanChart from "@sd_components/JobPlanChart";
import GrowMakeGoal from "@sd_components/GrowMakeGoal"

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");
//console.log("width", width);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  sdTabs: {
    borderWidth: 0,
    borderColor: '#f00',
    minHeight: CSS.pixel(600, true),
    paddingHorizontal: CSS.pixel(10),
  }
});
// 成长 - 点亮路径
class GrowLightenRoad extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }
  state = {
    loading0: true,
    loading1: false,
    loading2: false,
    loading3: false,
    startIndex: 0,
    target: "",
    valueIndex: 0,
    selectValue: "",
    selectIndex: 0,
    tabTitles: ["专业对口", "同门经验", "同类去向", "高薪职位"],
    choosedTitle: '专业对口',
  };

  componentDidMount() {
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
  }

  onNavigatorEvent(event) {
    console.log("lighten event.id====", event.id, event)
    if (event.id == "didAppear") {
      this.queryData(this.state.startIndex);
    }
  }

  componentWillMount() {
    const { target } = this.props;
    //console.log("target", target)
    if (JOB_PLAN_TYPES.includes(target))
      this.setState({
        target: target
      });
  }

  onPressGotoMake() {
    console.log("onPressGotoMake");
    /*navHelper.navOpen(this.context.navigator, "push", {
      name: "GrowMakeGoalScreen",
      title: "制定目标"
      //tabBarHidden: true
    });*/
    this.context.navigator.push(
      navScreen("PushScreen", "定制目标", {
        passProps: {
          screen: () => <GrowMakeGoal road={this.state.target} positionArea={this.state.choosedTitle} />
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存"),
      })
    );
  }

  onPressChangeTab(index) {
    this.setState({
      startIndex: index
    });
  }

  requestData(action, params, type, index){
    let temp = {};
    console.log("action=====", action)
    action(
        params,
        res => {}
      ).then(res => {
        console.log("queryData===", res, type);
        store.dispatch({
          type: type,
          json: res
        })
        if (Array.isArray(res.results) && res.results.length) {
          temp = {};
          temp["loading" + index] = false;
          this.setState(temp);
        } else {
          Toast.info("暂无数据");
        }
      })
  }

  queryData(index) {
    if (index == 0) {
      this.requestData(this.props.actions.getMajorIdPositions, {
          major: this.props.user.total.major_name, //this.props.user.major_name,
          degree: this.props.user.total.degree_name, //this.props.user.degree_name
          page_size: 6,
        }, "GETMAJORPOSITIONS", index);
    } else if(index == 1){
      this.requestData(this.props.actions.getSchoolMajorPositionsAction, {
          school_name: this.props.user.total.school_name, //this.props.user.major_name,
          major: this.props.user.total.major_name, //this.props.user.major_name,
          degree: this.props.user.total.degree_name, //this.props.user.degree_name
          page_size: 6,
        }, "GETSCHOOLMAJORPOSITIONS", index);
    } else if(index == 2){
      this.requestData(this.props.actions.getSchoolMajorSimilarityPositionsAction, {
          school_name: this.props.user.total.school_name, //this.props.user.major_name,
          major: this.props.user.total.major_name, //this.props.user.major_name,
          degree: this.props.user.total.degree_name, //this.props.user.degree_name
          page_size: 6,
        }, "GETSCHOOLMAJORSIMILARITYPOSITIONS", index);
    } else if(index == 3){
      this.requestData(this.props.actions.getPositionsByRankAction, {
          page_size: 6,
        }, "GETPOSITIONSBYRANK", index);
    }
  }

  handleTabChange = (tab, index) => {
    console.log("handleTabChange", tab, index);
    this.setState({choosedTitle:this.state.tabTitles[index]})
    let temp = {};
    Array.from({ length: 4 }).map((n, i) => {
      temp["loading" + i] = false;
    });
    temp["loading" + index] = true;
    temp["startIndex"] = index;
    this.setState(temp);
    this.queryData(index)
  };

  renderChart = () => {
    const { jobPlanPositionList } = this.props
    //console.log("jobPlanPositionList====", jobPlanPositionList)
    const index = this.state.startIndex;
    if (this.state["loading" + index]) {
      return <SDLoading />;
    } else {
      if (index == 0) {
        return (
          <JobPlanChart
            style={{ justifyContent: "center", alignSelf: "center" }}
            special={""}
            data={jobPlanPositionList.majorPosition}
            left={CSS.pixel(220)}
            right={CSS.pixel(140)}
          />
        );
      } else if(index == 1){
        return (
          <JobPlanChart
            style={{ justifyContent: "center", alignSelf: "center" }}
            special={""}
            data={jobPlanPositionList.schoolPosition}
            xLabel={'选择率\n（%）'}
            yLabel={'职位名称'}
            barLabelTail="%"
            left={CSS.pixel(220)}
            right={CSS.pixel(140)}
          />
        );
      } else if(index == 2){
        return (
          <JobPlanChart
            style={{ justifyContent: "center", alignSelf: "center" }}
            special={"special"}
            data={jobPlanPositionList.similarityPosition}
            xLabel={'选择率\n（%）'}
            yLabel={'专业名称'}
            barLabelTail=""
            left={CSS.pixel(220)}
            right={CSS.pixel(140)}
          />
        );
      } else if(index == 3){
        return (
          <JobPlanChart
            style={{ justifyContent: "center", alignSelf: "center" }}
            special={""}
            data={jobPlanPositionList.rankPosition}
            barLabelFormatter={(d) => (d && d.y) ? '￥' + d.y : ""}
            xLabel={'薪资\n（元）'}
            yLabel={'职位名称'}
            barLabelTail="%"
            left={CSS.pixel(220)}
            right={CSS.pixel(140)}
          />
        );
      }
      return null;
    }
  };

  render() {
    const { startIndex } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: sdStyles.SDBGColorMain,
          flexDirection:'column',
          //alignItems: 'center',
          //justifyContent: 'space',
        }}
      >
        <SDTabs2
          tabTitles={this.state.tabTitles}
          page={startIndex}
          underLineWidth={CSS.pixel(110)}
          onChangeTab={this.handleTabChange.bind(this)}
          activeColor={sdStyles.SDMainColor}
          inActiveColor={sdStyles.SDFontColorMinor}
          style={{
            flex: 1,
          }}
          tabContentStyle={{
            height: '100%',
          }}
        >
          <ScrollView style={styles.sdTabs}>
            <SDBox2
              header={() => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: CSS.pixel(80, true),
                    }}
                  >
                    <Text
                      style={{ fontSize: CSS.textSize(24), color: sdStyles.SDFontColorMinor }}
                    >
                      所学所得最大化，与“
                    </Text>
                    <Text
                      style={{ fontSize: CSS.textSize(24), color: sdStyles.SDFontColorMain }}
                    >
                      {this.props.user.total.major_name}
                    </Text>
                    <Text
                      style={{ fontSize: CSS.textSize(24), color: sdStyles.SDFontColorMinor }}
                    >
                      ”对口的有以下职位：
                    </Text>
                  </View>
                );
              }}
              body={this.renderChart.bind(this)}
              footer={() => {
                return (
                  <Text
                    style={{ fontSize: CSS.textSize(24), color: sdStyles.SDBGColorOrange }}
                  >

                  </Text>
                );
              }}
              btnTitle="制定目标"
              height={CSS.pixel(760)}
              onPress={this.onPressGotoMake.bind(this)}
            />

            <FootSpace style={{ backgroundColor: "#fff" }} />
          </ScrollView>

          <ScrollView
            styleName="tabContent inputWrap flexibless"
            style={styles.sdTabs}
          >
            <SDBox2
              header={() => {
                return (
                  <View><View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: CSS.pixel(0, true),
                    }}
                  >
                    <Text
                      style={{ fontSize: CSS.textSize(24), color: sdStyles.SDFontColorMinor }}
                    >
                      前辈经验借鉴，“
                    </Text>
                    <Text
                      style={{ fontSize: CSS.textSize(24), color: sdStyles.SDFontColorMain }}
                    >
                      {this.props.user.total.major_name}
                    </Text>
                    <Text
                      style={{ fontSize: CSS.textSize(24), color: sdStyles.SDFontColorMinor }}
                    >
                      ”专业的师哥师姐
                    </Text>
                  </View>
                  <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: CSS.pixel(80, true),
                      }}
                    >
                    <Text
                      style={{ fontSize: CSS.textSize(24), color: sdStyles.SDFontColorMinor }}
                    >
                      偏向于选择以下职位：
                    </Text>
                  </View></View>
                );
              }}
              body={this.renderChart.bind(this)}
              footer={() => {
                return (
                  <Text
                    style={{ fontSize: CSS.textSize(24), color: sdStyles.SDBGColorOrange }}
                  >

                  </Text>
                );
              }}
              btnTitle="制定目标"
              height={CSS.pixel(760)}
              onPress={this.onPressGotoMake.bind(this)}
            />

            <FootSpace style={{ backgroundColor: "#fff" }} />
          </ScrollView>

          <ScrollView
            styleName="tabContent inputWrap flexibless"
            style={styles.sdTabs}
          >
            <SDBox2
              header={() => {
                return (
                  <View><View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: CSS.pixel(10, true),
                    }}
                  >
                    <Text
                      style={{ fontSize: CSS.textSize(24), color: sdStyles.SDFontColorMinor }}
                    >
                      兼听则明，综合评估，“
                    </Text>
                    <Text
                      style={{ fontSize: CSS.textSize(24), color: sdStyles.SDFontColorMain }}
                    >
                      {this.props.user.total.major_name}
                    </Text>
                    <Text
                      style={{ fontSize: CSS.textSize(24), color: sdStyles.SDFontColorMinor }}
                    >
                      ”专业的师哥师姐
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: CSS.pixel(80, true),
                    }}
                  >
                    <Text
                      style={{ fontSize: CSS.textSize(24), color: sdStyles.SDFontColorMinor }}
                    >
                      偏向于选择以下职位：
                    </Text>
                  </View></View>
                );
              }}
              body={this.renderChart.bind(this)}
              footer={() => {
                return (
                  <Text
                    style={{ fontSize: CSS.textSize(24), color: sdStyles.SDBGColorOrange }}
                  >

                  </Text>
                );
              }}
              btnTitle="制定目标"
              height={CSS.pixel(760)}
              onPress={this.onPressGotoMake.bind(this)}
            />

            <FootSpace style={{ backgroundColor: "#fff" }} />
          </ScrollView>

          <ScrollView
            styleName="tabContent inputWrap flexibless"
            style={styles.sdTabs}
          >
            <SDBox2
              header={() => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: CSS.pixel(80, true),
                    }}
                  >
                    <Text
                      style={{ fontSize: CSS.textSize(24), color: sdStyles.SDFontColorMinor }}
                    >
                      好“钱”途，近年高薪职位一览
                    </Text>
                  </View>
                );
              }}
              body={this.renderChart.bind(this)}
              footer={() => {
                return (
                  <Text
                    style={{
                      fontSize: CSS.textSize(20),
                      color: sdStyles.SDBGColorOrange,
                   }}
                  >
                    注：该薪资为工作三年毕业生平均薪资
                  </Text>
                );
              }}
              btnTitle="制定目标"
              height={Platform.OS == "android"? CSS.pixel(760) : CSS.pixel(720)}
              onPress={this.onPressGotoMake.bind(this)}
            />

            <FootSpace style={{ backgroundColor: "#fff" }} />
          </ScrollView>
        </SDTabs2>

        <SDButton
            style={{
              flexDirection: "column",
              alignSelf: "center",
              marginVertical: 20,
              backgroundColor: sdStyles.SDMainColor,
              borderRadius: 20,
              width: CSS.pixel(550),
              zIndex: 6,
              position: "relative",
              top: 0, //CSS.pixel(200, true),
              left: 0,
            }}
            btnStyle={{
              fontSize: CSS.pixel(30),
              color: "#fff",
              position: "relative",
              top: 0 //-4
            }}
            onPress={this.onPressGotoMake.bind(this)}
            title="制定目标"
          />
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserAllInfo(state, props),
  jobPlanPositionList: state.jobPlanPositionList,
}))(GrowLightenRoad);
