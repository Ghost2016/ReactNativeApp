import React from "react";
import {
  StyleSheet
} from "react-native";
import SDScreen from "../../../common/SDScreen";
import _FansScreen from "./FansScreeen.1";
import ConnectWithActions from "../../../connectWithActions";

const styles = StyleSheet.create({});

type Props = {};
type State = {};

/**
 *  排名测试页面
 */
class FansScreen extends React.Component<Props, State> {
  props: Props;
  state: State;
  componentDidMount() {
    setTimeout(() => {
      this.props.actions.setStatusBarBackgroundColor({
        statusBarBackgroundColor: 'blue'
      })
    }, 5000)
  }
  render() {
    return (
      <SDScreen title="粉丝">
        <_FansScreen {...this.props}/>
      </SDScreen>
    )
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({
}))(FansScreen));