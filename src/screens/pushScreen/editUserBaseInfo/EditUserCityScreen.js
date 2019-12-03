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
import { Toast } from "antd-mobile";
import { Icon } from "@shoutem/ui";
// import LabelInput from '../../../common/SDLabelInput';
import ConnectWithActions from "../../../connectWithActions";
import { UserState } from "../../../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1"
  }
});

type areaModel = {
  id: string,
  name: name
};

type cityModel = {
  id: string,
  name: name,
  Area: areaModel[]
};

type Props = {
  city: cityModel[],
  province: string,
  userInfo: UserState
};
let navContext = null;
// 编辑用户所在城市
class EditUserCityScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      selectCity:
        this.props.userInfo.city && this.props.userInfo.city.name
          ? this.props.userInfo.city.name
          : ""
    };
  }
  onPressCityItem(city) {
    this.setState({
      selectCity: city
    });
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };
  componentDidMount() {
    navContext = this.context.navigator;
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_userCity") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");

        if (this.state.city == "") {
          Toast.info("城市选择不能为空");
          return;
        } else {
          Toast.loading("保存中");
          this.props.actions.updateBaseInfoAction(
            {
              city_name: this.state.selectCity,
              province_name: this.props.province
            },
            res => {
              Toast.info("保存成功");

              // 返回到前三层
              navContext.pop({
                animated: false, // does the popToRoot have transition animation or does it happen immediately (optional)
                animationType: "fade" // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
              });
              navContext.pop({
                animated: false, // does the popToRoot have transition animation or does it happen immediately (optional)
                animationType: "fade" // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
              });
              navContext.pop({
                animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
                animationType: "fade" // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
              });
              // this.context.navigator.pop();
            }
          );
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.context.refs['_editUserAddressScreen']) {
      this.context.refs['_editUserAddressScreen'].state.city = this.state.selectCity;
    }
  }

  renderCityItem() {
    let arrHtml = this.props.city.map(item => {
      return (
        <TouchableOpacity
          key={item.id}
          onPress={this.onPressCityItem.bind(this, item.name)}
          activeOpacity={0.8}
          style={{
            height: 60,
            paddingHorizontal: 10,
            backgroundColor: "#fff",
            alignItems: "center",
            flexDirection: "row",
            borderBottomColor: "#f1f1f1",
            borderBottomWidth: 1
          }}
        >
          <View
            style={{
              justifyContent: "center",
              paddingHorizontal: 10,
              flex: 1
            }}
          >
            <Text style={{ color: "#333", fontSize: 16 }}>{item.name}</Text>
          </View>
          <View
            style={{
              width: 80,
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          >
            {this.state.selectCity == item.name ? (
              <Icon style={{ color: "#fed200" }} name="checkbox-on" />
            ) : null}
          </View>
        </TouchableOpacity>
      );
    });
    return arrHtml;
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View>
          <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
            <Text style={{ color: "#999", fontSize: 12 }}>全部</Text>
          </View>

          <View style={{ marginTop: 5 }}>{this.renderCityItem()}</View>
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user
}))(EditUserCityScreen);
