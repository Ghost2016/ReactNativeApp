import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput
} from "react-native";
import SDList from "../common/SDList";
import PropTypes from "prop-types";
import LabelInput from "../common/SDLabelInput";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  }
});

//
export default class EditPracticeForm extends React.Component {
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
          placeholder="公司名称"
          defaultValue="蓝光国际有限公司"
          direction=" "
        />
        <LabelInput
          placeholder="职位名称"
          defaultValue="产品经理"
          direction=" "
        />
        <LabelInput
          placeholder="开始时间"
          defaultValue="2017年9月"
          editable={false}
          direction=">"
        />
        <LabelInput
          placeholder="结束时间"
          defaultValue="2017年11月"
          editable={false}
          direction=">"
        />
        <LabelInput
          placeholder="工作内容描述"
          editable={false}
          footterStyle={{ borderBottomColor: "#fff" }}
          footter={() => (
            <TextInput
              style={{ color: "#999", lineHeight: 18, marginBottom: 10 }}
              defaultValue="负责公司App产品规划，版本迭代实施，产品原型设计，跟进研发需求沟通等"
              multiline={true}
            />
          )}
        />
      </View>
    );
  }
}
