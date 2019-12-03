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
import PracticeExperience from "../../../sd_practiceExperience/PracticeExperience";
import ScreenFootter from "./ScreenFootter";
import { navScreen } from "@styles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

//
export default class ShowPracticeExperieneceScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <View style={styles.container}>
        <PracticeExperience />
        <ScreenFootter
          options={[
            {
              label: "+ 添加实习经历",
              onPress: () => {
                this.context.navigator.push(
                  navScreen("AddPracticeScreen", "添加实习经历")
                );
              }
            }
          ]}
        />
      </View>
    );
  }
}
