/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  Image,
  NativeModules
} from "react-native";
import SDTouchOpacity from "@common/SDTouchOpacity";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { CSS } from "@common/SDCSS";
import { Toast } from "antd-mobile";
import connectWithActions from "../connectWithActions";
import Geolocation from "../boot/Geolocation";
import SDPullScrollView from "../common/SDPullScrollView";

class CitySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderWidth: Dimensions.get("window").width,
      itemWidth: Dimensions.get("window").width,
      entries: ["province", "city", "area"],

      provinceData: [],
      cityData: [],
      areaData: [],

      selectIndex: 0,
      selectCity: null,
      selectProvince: null,
      selectArea: null
    };
  }
  static contextTypes = {
    navigator: () => null
  };
  onSnapToItem() {}

  onPressProvince(item) {
    // 判断是否是直辖区
    if (
      item.name == "北京市" ||
      item.name == "重庆市" ||
      item.name == "天津市" ||
      item.name == "上海市"
    ) {
      if (!this.props.isNeedNext) {
        this.props.onGetPosition &&
          this.props.onGetPosition(item, item, null);
        this.context.navigator.pop();
      }
    }

    Toast.loading("获取数据中");
    this.props.actions
      .getCityAreaAction({
        parent_id: item.id,
        common_level__name: "市",
        size: 99
      })
      .then(res2 => {
        Toast.hide();
        if(res2 && res2.status == 'ok') {
          this.setState(
            {
              selectIndex: 1,
              cityData: res2.results,
              selectProvince: item
            },
            () => {
              this._carousel.snapToItem(1);
            }
          );
        }
      })
      .catch(err2 => {});
  }

  onPressCity(item) {
    if (this.props.isAreaEnd) {
      // 如果是需要点击区县街道
      // 获取城市区县
      Toast.loading("获取数据中");
      this.props.actions
        .getCityAreaAction({
          parent_id: item.id,
          common_level__name: "区/县",
          size: 99
        })
        .then(res => {
          Toast.hide();
          if(res && res.status == 'ok') {
            this.setState(
              {
                areaData: res.results,
                selectIndex: 2,
                selectCity: item
              },
              () => {
                this._carousel.snapToItem(2);
              }
            );
          }
        })
        .catch(err => {});
    } else {
      // 判断是否是北京和重庆
      if (
        this.state.selectProvince.name == "北京市" ||
        this.state.selectProvince.name == "重庆市" ||
        this.state.selectProvince.name == "天津市" ||
        this.state.selectProvince.name == "上海市"
      ) {
        this.props.onGetPosition &&
          this.props.onGetPosition(
            this.state.selectProvince,
            {
              name: this.props.isNeedNext ? item.name : this.state.selectProvince.name,
              id: item.id
            },
            null
          );
        this.state.selectArea = item;
      } else {
        this.props.onGetPosition &&
          this.props.onGetPosition(this.state.selectProvince, item, null);
        this.state.selectArea = item;
      }

      this.context.navigator.pop();
    }
  }

  onPressArea(item) {
    this.props.onGetPosition &&
      this.props.onGetPosition(
        this.state.selectProvince,
        this.state.selectCity,
        item
      );
    this.state.selectArea = item;

    this.context.navigator.pop();
  }

  _renderItem({ item, index }) {
    switch (item) {
      case "province":
        return (
          <ProvinceSelectList
            data={this.state.provinceData}
            onPressProvince={this.onPressProvince.bind(this)}
          />
        );
      case "city":
        return (
          <CitySelectList
            data={this.state.cityData}
            onPressCity={this.onPressCity.bind(this)}
          />
        );
      case "area":
        return (
          <AreaSelectList
            data={this.state.areaData}
            onPressArea={this.onPressArea.bind(this)}
          />
        );
      default:
        break;
    }
  }

  componentWillMount() {
    // 获取所有省份
    this.getInitProvinceData();

    // 检查android权限
    Platform.OS == "android" &&
    NativeModules.BackHome &&
    NativeModules.BackHome.getPermissions &&
    NativeModules.BackHome.getPermissions();
    Geolocation.getLastLocation();
  }

  getInitProvinceData() {
    // 获取城市区县
    Toast.loading("获取数据中");
    this.props.actions
      .getCityAreaAction({
        common_level__name: "省",
        size: 99
      })
      .then(res => {
        this.setState(
          {
            provinceData: res.results
          },
          () => {
            Toast.hide();
          }
        );
      })
      .catch(err => {});
  }

  render() {
    return (
      <View style={{ backgroundColor: "#f3f3f3", flex: 1 }}>
        <View
          style={{
            backgroundColor: "#fff",
            height: CSS.pixel(110),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <View>
            <Image
              style={{ top: 2 }}
              source={require("@img/home/login_position.png")}
            />
          </View>

          <SDTouchOpacity
            style={{
              marginHorizontal: CSS.pixel(20),
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => {
              if (this.props.location && this.props.location.city) {
                this.props.onGetPosition(
                  {
                    name: this.props.location.province
                  },
                  {
                    name: this.props.location.city
                  },
                  null
                );
                this.context.navigator.pop();
              }
            }}
          >
            <Text style={{ fontSize: CSS.pixel(30), color: "#333" }}>
              {this.props.location && this.props.location.city && this.props.location.city != ""
          ? this.props.location.city
          : "定位失败"}
            </Text>
          </SDTouchOpacity>

          <SDTouchOpacity
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => {
              // 检查android权限
              Platform.OS == "android" &&
                NativeModules.BackHome &&
                NativeModules.BackHome.getPermissions &&
                NativeModules.BackHome.getPermissions();
              Geolocation.getLastLocation();
            }}
          >
            <Image source={require("@img/home/mine_Resume_ico_Refresh.png")} />
          </SDTouchOpacity>
        </View>
        <View
          style={{
            marginTop: CSS.pixel(60),
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: CSS.pixel(10)
          }}
        >
          <View>
            <Text
              style={{
                fontSize: CSS.pixel(24),
                color: "#999",
                paddingLeft: CSS.pixel(30)
              }}
            >
              全部
            </Text>
          </View>
          {this.state.selectIndex == 0 ? null : (
            <SDTouchOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingRight: CSS.pixel(30)
              }}
              onPress={() => {
                this._carousel.snapToItem(this.state.selectIndex - 1);
                this.setState({
                  selectIndex: this.state.selectIndex - 1
                });
              }}
            >
              <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                返回
              </Text>
            </SDTouchOpacity>
          )}
        </View>

        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          data={this.state.entries}
          renderItem={this._renderItem.bind(this)}
          sliderWidth={this.state.sliderWidth}
          itemWidth={this.state.itemWidth}
          scrollEnabled={false}
          onSnapToItem={this.onSnapToItem.bind(this)}
        />
        {/* {this.state.selectIndex == 0 ? null : (
          <SDTouchOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: CSS.pixel(30)
            }}
            onPress={() => {
              this._carousel.snapToItem(this.state.selectIndex - 1)
              this.setState({
                selectIndex: this.state.selectIndex - 1
              });
            }}
          >
            <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
              返回
            </Text>
          </SDTouchOpacity>
        )} */}
      </View>
    );
  }
}

class ProvinceSelectList extends React.PureComponent {
  render() {
    return (
      <SDPullScrollView
        style={{ flex: 1 }}
        // onFooterRefresh={() => {}}
        renderItem={item => {
          return (
            <SDTouchOpacity
              noDelay
              key={item.id + ""}
              style={{
                height: CSS.pixel(110),
                backgroundColor: "#fff",
                borderBottomWidth: 1,
                borderBottomColor: "#f3f3f3",
                justifyContent: "center",
                paddingLeft: CSS.pixel(30)
              }}
              onPress={() => {
                this.props.onPressProvince && this.props.onPressProvince(item);
              }}
            >
              <Text>{item.name}</Text>
            </SDTouchOpacity>
          );
        }}
        empty
        data={this.props.data}
      />
    );
  }
}

class CitySelectList extends React.PureComponent {
  render() {
    return (
      <SDPullScrollView
        style={{ flex: 1 }}
        // onFooterRefresh={() => {}}
        renderItem={item => {
          return (
            <SDTouchOpacity
              noDelay
              key={item.id + ""}
              style={{
                height: CSS.pixel(110),
                backgroundColor: "#fff",
                borderBottomWidth: 1,
                borderBottomColor: "#f3f3f3",
                justifyContent: "center",
                paddingLeft: CSS.pixel(30)
              }}
              onPress={() => {
                this.props.onPressCity && this.props.onPressCity(item);
              }}
            >
              <Text>{item.name}</Text>
            </SDTouchOpacity>
          );
        }}
        empty
        data={this.props.data}
      />
    );
  }
}

class AreaSelectList extends React.PureComponent {
  render() {
    return (
      <SDPullScrollView
        // onFooterRefresh={() => {}}
        renderItem={item => {
          return (
            <SDTouchOpacity
              noDelay
              key={item.id + ""}
              style={{
                height: CSS.pixel(110),
                backgroundColor: "#fff",
                borderBottomWidth: 1,
                borderBottomColor: "#f3f3f3",
                justifyContent: "center",
                paddingLeft: CSS.pixel(30)
              }}
              onPress={() => {
                this.props.onPressArea && this.props.onPressArea(item);
              }}
            >
              <Text>{item.name}</Text>
            </SDTouchOpacity>
          );
        }}
        empty
        data={this.props.data}
      />
    );
  }
}

export default connectWithActions((state, props) => ({
  location: state.location
}))(CitySelect);
