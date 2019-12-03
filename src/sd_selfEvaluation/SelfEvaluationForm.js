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
import PropTypes from "prop-types";
import LabelInput from "../common/SDLabelInput";
import { SDTakePhoto } from "@common";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  }
});

// 编辑自我评价表单
export default class SelfEvaluationForm extends React.Component {
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
          placeholder="自我评价"
          editable={false}
          footter={() => (
            <TextInput
              style={{ marginBottom: 10 }}
              placeholder="说点什么吧？"
              multiline={true}
            />
          )}
        />
      </View>
    );
  }
}
