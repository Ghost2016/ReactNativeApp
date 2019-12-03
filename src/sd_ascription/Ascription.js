/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
// import { StyleSheet } from 'react-native';
// import {connectStyle} from '@shoutem/theme';
import { Row, Text, View } from "@shoutem/ui";
import ConnectWithActions from "../connectWithActions";
import { getAscription } from "../selectors";

const styles = {
  container: {
    height: 50,
    backgroundColor: "#fff",
    // borderBottomWidth: 1,
    // borderColor: "#eee",
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center"
  }
};

type Props = {
  schoolName: string, // 学校
  schoolLevel: string, // 级别
  major: string // 专业
};

class Ascription extends PureComponent<Props> {
  props: Props;
  render() {
    // const { schoolName, schoolLevel, major } = this.props.ascriptionData;
    return (
      <View style={styles.container}>
        <Text style={{color: "#333"}}>{this.props.ascription}</Text>
      </View>
    );
  }
}

// export default connectStyle('', styles)(AvatarItem);
export default ConnectWithActions((state, props) => ({
  ascription: getAscription(state, props)
}))(Ascription);
