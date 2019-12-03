/* @flow */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import PropTypes from "prop-types";
import store from "@boot/store";
import * as sdStyles from "@styles";
import RowSplitLine from "@src/common/RowSplitLine";
import ConnectWithActions from "@src/connectWithActions";
import { getUserBaseInfo } from "@src/users/usersSelector";
import { CSS } from "@src/common/SDCSS";
import SDTabs2 from "@sd_components/SDTabs2";
import SDLoading from "@sd_components/SDLoading";
import HeaderText from "@sd_components/HeaderText";
import GrowCheckinSkillTab from "@sd_components/GrowCheckinSkillTab";
import { certPunchListAction } from "../boot/actions";
import { currentJobPlan, certTaskState } from "@src/selectors";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: CSS.pixel(30, true)
  },
  sdTabs: {
    width: width,
    height: '100%',
    borderWidth: 0,
    borderColor:'#ff0',
  }
});

// 成长 - 证书
class GrowCheckinCert extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      startIndex: 0,
      page: 1,
      size: 100,
      params: {},
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };

  changeTotab(index){
    this.setState({
      startIndex: index
    });
  }

  handleTabChange(tab, index){
    console.log("handleTabChange===", tab, index)
    let params = {
      target: "cert",
      type: tab.title == "通用证书"? 'common' : 'goal',
      size: this.state.size,
      page: this.state.page,
    };
    if(params.type === "goal" && this.props.currentJobPlan.title){
      params.profession_id = this.props.currentJobPlan.id;
    }
    this.setState({
      params: params,
    })
    this.props.actions.punchListAction(
      params,
      res => {}
    ).then(res => {
      console.log("handleTabChange res===22", res, params);
      store.dispatch(certPunchListAction(res.results));
    }).catch(err => {
      console.log("handleTabChange err ==", err)
    })
  }

  componentDidMount(){
    console.log("certState===[][]", this.props.certState)
    this.props.actions.stateCertListAction({}, res => {}).then(res => {
      this.props.actions.setCertStateState(res.results)
    })
  }
  //, "目标职位证书"
  render() {
    const { startIndex } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',//sdStyles.SDBGColorMain,
        }}
      >
        <SDTabs2
          tabTitles={["通用证书"]}
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
          <ScrollView
            style={styles.sdTabs}
          >
            <GrowCheckinSkillTab
              type="通用证书"
              target="cert"
              targetName="证书"
              style={{
                minHeight: CSS.pixel(1200, true),
                borderWidth: 0,
                borderColor:'#f00',
              }}
              isSimple={true}
              header={() => {
              return (<View>
                <HeaderText titles={
                [
                '',
                '需考取通用证书',
                `${this.props.certState.common.total || 0}个，`,
                '已考取',
                `${this.props.certState.common.done || 0}个，`,
                '加油努力吧！'
                ]
              } />
                <View style={{
                  marginTop: CSS.pixel(30, true),
                  paddingTop: CSS.pixel(40, true),
                  paddingBottom: CSS.pixel(20, true),
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  width: width,
                  backgroundColor: '#fff',
                }}>
                <Text style={{
                  color: sdStyles.SDFontColorSubtitle,
                  fontSize: CSS.textSize(24),
                  borderWidth: 0,
                  borderColor: "#f00",
                  marginLeft: CSS.pixel(50),
                }}>需考取证书</Text>
              </View>
            </View>);
            }} />
          </ScrollView>

          <ScrollView
            style={styles.sdTabs}
          >
            <GrowCheckinSkillTab
              type="目标职位证书"
              target="cert"
              targetName="证书"
              style={{
                minHeight: CSS.pixel(1200, true),
                borderWidth: 0,
                borderColor:'#f00',
              }}
              isSimple={true}
              header={() => {
              return (<HeaderText titles={
                [
                `目标职位“${this.props.currentJobPlan.position.name}”`,
                '共需考取',
                `${this.props.certState.goal.total || 0}个证书，`,
                '已考取',
                `${this.props.certState.goal.done || 0}个证书，`,
                '加油努力吧！'
                ]
              } />);
            }} />
          </ScrollView>

        </SDTabs2>
      </View>

    );
  }
}

export default ConnectWithActions((state, props) => ({
  userBaseInfo: getUserBaseInfo(state),
  currentJobPlan: currentJobPlan(state, props),
  certState: certTaskState(state),
}))(GrowCheckinCert);
