// 数据查询页面
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions
} from "react-native";
import UpdateNameForm from "../../../sd_updateProfile/form/UpdateNameForm";

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width - 20,
    height: Dimensions.get("window").height * 0.4,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    paddingTop: 10,

    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowColor: "#999",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4
  }
});

// 更新地区lightbox
export default class UpdateNameLightBoxScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <UpdateNameForm />
      </View>
    );
  }
}
