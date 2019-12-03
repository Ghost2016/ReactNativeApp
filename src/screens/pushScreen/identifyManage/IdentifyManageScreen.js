import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import PropTypes from "prop-types";
import defaultStyle from "@styles";
import IdentifyManageList from "../../../sd_identifyManage/IdentifyManageList";
import { CSS } from "../../../common/SDCSS";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  }
});

// 我的-身份管理
export default class IdentifyManageScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View
          style={[
            defaultStyle.center,
            { padding: 10, backgroundColor: '#fff' }
          ]}
        >
          <Text style={{ color: "#fc860e", fontSize: 14, lineHeight: 24 }}>
          温馨提示：我们根据你的默认身份为你提供相应的未来规划指引，
且职么力分值以默认身份计算。
          </Text>
        </View>
        <IdentifyManageList />
      </ScrollView>
    );
  }
}
