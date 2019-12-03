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
import { navScreen, navRightButton } from "@styles";
import cityCode from "../../../sd_updateProfile/form/cityCode";
import cityCodeId from "../../../sd_updateProfile/form/cityCodeId";
// import LabelInput from '../../../common/SDLabelInput';
import SDList from "../../../common/SDList";
import { SDMainColor } from "../../../styles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1"
  }
});

// 编辑用户所在地区
export default class EditUserProvinceScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };
  render() {
    return (
      <ScrollView style={styles.container}>
        <View>
          <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
            <Text style={{ color: "#999", fontSize: 12 }}>全部</Text>
          </View>

          <View style={{ marginTop: 5 }}>
            <SDList
              listOptions={cityCode.CityZoneCode.China.Province.map(item => {
                return {
                  name: item.name,
                  direction: ">",
                  onPress: () => {
                    this.context.navigator.push(
                      navScreen("EditUserCityScreen", "地区", {
                        passProps: {
                          city: item.City,
                          province: item.name
                        },
                        navigatorStyle: this.context.refs["regis_Screen"] ? {
                          //android 透明statusbar
                          // navBarHidden: true,
                          statusBarColor: "transparent",
                          statusBarHidden: true,

                          navBarTextColor: "#fff",
                          navBarButtonColor: "#fff",
                          navBarBackgroundColor: SDMainColor,
                          navBarTitleTextCentered: true,
                          navBarSubTitleTextCentered: true,
                          topBarElevationShadowEnabled: false,
                          statusBarTextColorScheme: "light"
                        } : {
                          navBarTextColor: "#fff",
                          navBarButtonColor: "#fff",
                          navBarBackgroundColor: SDMainColor,
                          navBarTitleTextCentered: true,
                          navBarSubTitleTextCentered: true,
                          topBarElevationShadowEnabled: false,
                          statusBarTextColorScheme: "light"
                        },
                        ...navRightButton("save_userCity", "保存")
                      })
                    );
                  }
                };
              })}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
