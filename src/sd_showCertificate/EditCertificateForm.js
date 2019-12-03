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
import LabelInput from "../common/SDLabelInput";
import { SDTakePhoto } from "@common";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  }
});

// 编辑证书表单
export default class EditCertificateForm extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <View style={styles.container}>
        <LabelInput
          placeholder="证书名称"
          defaultValue="计算机二级"
          direction=">"
        />
        <LabelInput placeholder="考取成绩" defaultValue="78" direction=">" />
        <LabelInput
          placeholder="通过时间"
          direction=">"
          defaultValue="2018年6月"
          editable={false}
          onPress={() => {}}
        />
        <LabelInput placeholder="上传凭证" footter={<SDTakePhoto />} />
      </View>
    );
  }
}
