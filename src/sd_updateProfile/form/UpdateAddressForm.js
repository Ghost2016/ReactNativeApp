/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity
} from "react-native";
import ConnectWithActions from "@src/connectWithActions";
import { getUserBaseInfo } from "@src/users/usersSelector";
import { InputItem, Toast } from "antd-mobile";
import defaultStyle from "@styles/index";
import ConfirmButtonGroup from "./ConfirmButtonGroup";
import Picker from "../../common/SDPicker";
import cityCode from "./cityCode";
import cityCodeId from "./cityCodeId";
import { Navigation } from "react-native-navigation";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingLeft: 10,
    flex: 1
  }
});

// 修改地区表单
class UpdateAddressForm extends React.PureComponent {
  constructor(props) {
    super(props);

    const city = this.props.user.city || "北京市市辖区";
    const province = this.props.user.city && this.props.user.city.province ? this.props.user.city.province : "北京市";
    this.state = {
      data: [],
      value: [],
      pickerValue: [],
      city: typeof city === 'object' ? city.name : city,
      cityId: "",
      province: typeof province === 'object' ? province.name : province,
      provinceId: "",
      provinceIndex: 0
    };
  }

  setPicker(provinceId, cityId) {
    const { provinceIndex, cityIndex } = cityCode.cityId2index(
      provinceId,
      cityId,
      0
    );
    //const {provinceIndex} = cityCode.cityId2index(provinceId, 0, 0)
    //console.log("cityCodeId", this.refs, cityIndex, provinceIndex);

    this.refs._provincePicker.setDataSource(
      cityCode.CityZoneCode.China.Province,
      provinceIndex
    );
    this.refs._cityPicker.setDataSource(
      cityCode.CityZoneCode.China.Province[provinceIndex].City
    );
  }

  componentDidMount() {
    const city = this.props.user.city.name || "北京市市辖区";
    const province = this.props.user.city.province.name || "北京市";
    //console.log("province===", province, city);
    const cityId = cityCodeId[city];
    const provinceId = cityCodeId[province];
    this.setState({
      cityId: cityId,
      provinceId: provinceId
    });
    this.setPicker(provinceId, cityId);
  }

  render() {
    return (
      <ScrollView>
        <View style={[styles.container, { justifyContent: "space-between" }]}>
          <View style={[defaultStyle.center]}>
            <Text style={defaultStyle.fontSubColor}>更改地区</Text>
          </View>

          <View
            style={[defaultStyle.flex, defaultStyle.flexRow, { padding: 20 }]}
          >
            <View style={[defaultStyle.flex, defaultStyle.center]}>
              <Picker
                itemHeight={35}
                data={cityCode.CityZoneCode.China.Province}
                ref="_provincePicker"
                name="name"
                onRowChange={index => {
                  this.setState({
                    provinceIndex: index,
                    province: cityCode.CityZoneCode.China.Province[index].name,
                    city:
                      cityCode.CityZoneCode.China.Province[index].City[0].name,
                    cityIndex: 0
                  });

                  this.refs._cityPicker.setDataSource(
                    cityCode.CityZoneCode.China.Province[index].City
                  );
                }}
              />
            </View>
            <View style={[defaultStyle.flex, defaultStyle.center]}>
              <Picker
                itemHeight={35}
                data={cityCode.CityZoneCode.China.Province[0].City}
                ref="_cityPicker"
                name="name"
                onRowChange={index => {
                  console.log(
                    "city",
                    cityCode.CityZoneCode.China.Province[
                      this.state.provinceIndex
                    ].City[index].name,
                    index
                  );
                  this.setState({
                    city:
                      cityCode.CityZoneCode.China.Province[
                        this.state.provinceIndex
                      ].City[index].name,
                    cityIndex: index
                  });
                }}
              />
            </View>
          </View>
          <ConfirmButtonGroup
            onCancel={() => {
              Navigation.dismissLightBox();
            }}
            onOk={() => {
              this.props.actions.prepareUserInfoAction(
                {
                  city: this.state.city,
                  province: this.state.province
                },
                res => {
                  //console.log("res update nickname", res);
                  Navigation.dismissLightBox();
                }
              );
            }}
          />
        </View>
      </ScrollView>
    );
  }
}
export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state)
}))(UpdateAddressForm);
