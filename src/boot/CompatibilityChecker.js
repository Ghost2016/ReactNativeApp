/* @flow */
import React, { PureComponent } from "react";
import { Platform, NativeModules } from 'react-native'
// import type { ChildrenArray } from '../types';
import { checkCompatibility } from "../api";
import CompatibilityScreen from "../screens/CompatibilityScreen";
import SDNoNetwork from "@sd_components/SDNoNetwork";
import { getAppVersion } from "@src/api/aMap";
const packageConfig = require("../../package.json");
// type Props = {
//   children?: ChildrenArray<*>,
// };

// type State = {
//   compatibilityCheckFail: boolean,
// };
let checkNetStatusInterval = null;
export default class CompatibilityChecker extends PureComponent {
  //   props: Props;
  //   state: State;

  state = {
    compatibilityCheckFail: false,
    //deviceName: "iPad Air 2"
    isPad: false, //(NativeModules.RNDeviceInfo && NativeModules.RNDeviceInfo.deviceName) ? NativeModules.RNDeviceInfo.deviceName.match(/^iPad/i) : false,
    noNetwork: false,
  };

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
      //|| res.version != packageConfig.appVersion
      if(!res.hasOwnProperty('version')  || Date.now() - currTime >= 5000) {
        //isNoNetWork = true;
        this.setState({
          noNetwork: true
        });
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
    });
  }

  componentDidMount() {
    /*checkCompatibility().then(res => {
      if (res.status === 400) {
        this.setState({
          compatibilityCheckFail: true
        });
      }
    });*/
    // console.log(this.props)
    // console.warn("NativeModules.RNDeviceInfo", NativeModules.RNDeviceInfo.deviceName)
    // 目前这里没网后 会一直在重复提示请检查网络
    //return;
    // 防止产生多个定时器
    //checkNetStatusInterval && clearInterval(checkNetStatusInterval);
    checkNetStatusInterval = setInterval(()=>{
      this.checkNetStatus()
    }, 5000)
  }

  componentWillUnmount() {
    if(checkNetStatusInterval) clearInterval(checkNetStatusInterval)
  };

  render() {
    const { compatibilityCheckFail, isPad } = this.state;
    if(this.state.noNetwork) {
      //console.warn('this.state.noNetwork', this.state.noNetwork)
      return (<SDNoNetwork navigator={this.props.navigator} refreshAction={()=>{
        //console.warn('reload')
      }}></SDNoNetwork>)
    }
    return isPad ? <CompatibilityScreen line1={"抱歉，暂不支持 iPad 使用"} line2={"请使用 iPhone 下载并使用职么开门APP"} /> : compatibilityCheckFail ? (
      <CompatibilityScreen />
    ) : (
      this.props.children
    );
  }
}
