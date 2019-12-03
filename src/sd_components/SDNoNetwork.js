/* @flow */
import React, { PureComponent } from "react";
import { NetInfo, View, Image, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import SDHeader, { ButtonsProps, HeaderProps } from "@src/common/SDHeader";
import SDTouchOpacity from "@src/common/SDTouchOpacity";
import { CSS } from "@src/common/SDCSS";
//import {Navigation} from 'react-native-navigation';
import {ScreenVisibilityListener as RNNScreenVisibilityListener} from 'react-native-navigation';
import { getAppVersion } from "@src/api/aMap";
import { Toast } from "antd-mobile";

type Props = {};

export default class SDNoNetwork extends PureComponent<Props> {
  props: Props;

  constructor(props, context) {
    super(props, context);
    this.navigator = props.navigator;
    this.state = {
      noLeft: true,
      isShow: true,
      noNetwork: false,
    };
    /* this.listener = new RNNScreenVisibilityListener({
      didDisappear: ({screen, startTime, endTime, commandType}) => {
        console.warn('didDisappear screenVisibility', `Screen ${screen} displayed in ${endTime - startTime} millis after [${commandType}]`);
      }
    }); */
  }

  checkNetStatus(){
    //console.warn('checkNetStatus', this.state.noNetwork)
    let currTime = Date.now();
    /* let isNoNetWork = false;
    let noNetworkTimer = setTimeout(() => {
      if(isNoNetWork) {
        this.setState({
          noNetwork: true
        })      }
    }, 5000); */
    getAppVersion({}).then(res => {
      //console.warn('getAppVersion ok', res)
      if(!res.hasOwnProperty('version') || res.version != packageConfig.appVersion || Date.now() - currTime >= 5000) {
        //isNoNetWork = true;
        this.setState({
          noNetwork: true
        });
        Toast.fail('请检查网络', 1, null, false);
      } else {
        this.setState({
          noNetwork: false
        });
      }
      /* this.setState({
        hasCalcTimer: true
      }) */
    }).catch(err => {
      //console.warn('getAppVersion err', err)
      //noNetworkTimer && clearTimeout(noNetworkTimer);
      this.setState({
        noNetwork: true
      });
      Toast.fail('请检查网络', 1, null, false);
    });
  }

  /* register() {
    this.listener.register();
  }

  unregister() {
    if (this.listener) {
      this.listener.unregister();
      this.listener = null;
    }
  } */

  onRefresh(){
    if(typeof this.props.refreshAction == "function"){
        this.props.refreshAction();
    }
  }

  componentDidMount = () => {
    /* Promise.resolve(Navigation.getCurrentlyVisibleScreenId())
    .then(containerId => {
        console.warn('CurrentlyVisibleScreenId:' + JSON.stringify(containerId));
        return containerId;
    }).catch((error) => {
        console.warn('Error getCurrentlyVisibleScreenId:' + error);
    }); */
  }


  render() {
    //const {  } = this.props;
    return this.state.isShow ? (<TouchableOpacity style={{
          flex: 1,
          position:'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 99,
          }}
          onPress={
            () => {
              //console.warn("press ")
              this.checkNetStatus();
            }
          }
          >
        <SDHeader title="职么开门" noLeft={this.state.noLeft}
          onPressBack={
            () => {
              //console.warn("press back", this.navigator.pop)
              this.navigator &&
              this.navigator.pop &&
              this.navigator.pop();
              this.setState({
                isShow: false,
              })
            }
          }
         />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f3f3f3'
          }}
        >
          <View>
            <Image style={{
              width: CSS.pixel(134),
              height: CSS.pixel(260, true),
              borderWidth: 0,
              borderColor: '#f00',
            }}
            source={require("../../img/default_page_no_network.png")}
            resizeMode='contain'
            />
          </View>

          <View style={{marginTop: CSS.pixel(40)}}>
            <Text style={{color: '#333', fontSize: CSS.textSize(32)}}>网络不给力</Text>
          </View>

           <View style={{marginTop: CSS.pixel(20)}}>
            {/* <Text style={{color: '#999', fontSize: CSS.textSize(28)}}>请检查网络设置或再试一次</Text> */}
            <Text style={{color: '#999', fontSize: CSS.textSize(28)}}>你已到达没有网络的外星球</Text>
          </View>

          {/* <View style={{marginTop: CSS.pixel(60)}}>
            <SDTouchOpacity onPress={this.onRefresh.bind(this)} style={{width: CSS.pixel(200), height: CSS.pixel(80), justifyContent: 'center', alignItems: 'center', borderRadius: CSS.pixel(40), borderWidth: 1, borderColor: '#FE8900'}}>
              <Text style={{color: '#FE8900', fontSize: CSS.textSize(32)}}>
                刷新试试
              </Text>
            </SDTouchOpacity>
          </View> */}
        </View>
        </TouchableOpacity>) : null;
  }
}
