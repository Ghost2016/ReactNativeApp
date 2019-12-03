import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
  Text
} from "react-native";
import SDScreen from "../../../common/SDScreen";
import _RankScreen from "./RankScreen.2";
import SDTabBar from "../../../common/SDTabBar";
import MobStat from "../../../boot/MobStat";
import { SDGuidePage } from "@sd_components";
import { getIsFirstEnterRank } from "@src/selectors";
import ConnectWithActions from "@src/connectWithActions";

const styles = StyleSheet.create({});

type Props = {};
type State = {};

/**
 *  排名页面
 */
class RankScreen extends React.Component<Props, State> {
  props: Props;
  state: State;
  componentDidMount() {
    MobStat.onPageStart("排名");
  }
  componentWillUnmount() {
    MobStat.onPageEnd("排名");
  }
  render() {
    let isFirstEnter = false
    if(this.props.settings === null ) {
      isFirstEnter = true
    } else if(this.props.settings === ""){
      isFirstEnter = true
    } else {
      let notFirstEnterRank = JSON.parse(this.props.settings).notFirstEnterRank
      // 如果没有定义才会显示
      if(notFirstEnterRank === undefined) {
        isFirstEnter = true
      } else {
        isFirstEnter = false
      }
    }
    if(isFirstEnter) {
      return (
        <SDGuidePage type="rank"/>)
    }
    return (
      <SDScreen
      noHeader={true}
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent'
      }}>
        <_RankScreen/>
        <SDTabBar selectIndex={1} />
      </SDScreen>
    )
  }
}

export default ConnectWithActions((state, props) => ({
  settings: (state.user && state.user.settings),
}))(RankScreen);