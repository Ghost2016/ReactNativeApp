// 数据查询页面
import React from "react";
import { View, StyleSheet, StatusBar, Platform, NetInfo, Image, Text, ActivityIndicator} from "react-native";
import SDSafeArea from "../../common/SDSafeArea";
import SDScreen from "../../common/SDScreen";
import { Toast } from 'antd-mobile';
import Color from "color";
import SDHeader, { ButtonsProps, HeaderProps } from "../../common/SDHeader";
import MobStat from "../../boot/MobStat";
import SDTouchOpacity from "../../common/SDTouchOpacity";
import { CSS } from "../../common/SDCSS";
import config from "../../config";
import { NetWorkStatus } from "../AppLaunchScreen";
import LottieView from "lottie-react-native";
import { getAppVersion } from "../../api/aMap";
import SDNoNetwork from "@sd_components/SDNoNetwork";

type Props = {
  screen: () => Element,
  header: HeaderProps,
  backgroundColor: string,
  fullScreen: ?boolean //是否全屏页面
};

export const PageNames = [];
let loadericon = require("@img/animate/loader.gif");
// 公用Push屏幕
export default class PushScreen extends React.PureComponent<Props> {
  static defaultProps = {
    header: null,
    barStyle: "dark-content",
    fullScreen: false,
    noScrollView: false,
    statusBarColor: "dark"
  };

  constructor(props) {
    super(props);

    this.state = {
      noNetwork: !NetWorkStatus.NetWorkConnected,
      hasEnter: false,
      hasCalcTimer: false
    };

    this.timer = null;
  }

  componentDidMount() {
    if (this.props.header && this.props.header.title) {
      MobStat.onPageStart(this.props.header.title);
      PageNames && PageNames.push(this.props.header.title);
    }
  }

  componentWillMount() {
    // 请求一个查询版本接口来模拟网络是否慢
    // 如果请求时间超过了5秒
    // 则视为网络状况不好
    let currTime = Date.now();
    let isNoNetWork = false;
    let noNetworkTimer = setTimeout(() => {
      if(isNoNetWork) {
        this.setState({
          noNetwork: true
        })
      }
    }, 5000);
    getAppVersion({}).then(res => {
      if(Date.now() - currTime >= 5000) {
        isNoNetWork = true;
        if(!this.state.noNetwork) {
          this.setState({
            noNetwork: true
          });
        }
      }
      this.setState({
        hasCalcTimer: true
      })
    }).catch(err => {
      noNetworkTimer && clearTimeout(noNetworkTimer);
    });
    NetInfo.isConnected.addEventListener("connectionChange", this.networkConnectionChange.bind(this)) ;
  }

  componentWillUnmount() {
    if (this.props.header && this.props.header.title) {
      MobStat.onPageEnd(this.props.header.title);

      PageNames && PageNames.pop();
    }

    NetInfo.isConnected.removeEventListener("connectionChange", this.networkConnectionChange.bind(this));
  }

  networkConnectionChange(isConnected) {
    if(this.timer) {
      clearTimeout(this.timer);
    }
    if(!isConnected) {
      // 网络发送异常 断网
      // 等待几秒后再到无网界面
      Toast.info("网络异常,请检查网络设置");
      this.timer = setTimeout(() => {
        this.setState({
          noNetwork: !isConnected
        })
      }, 3000);
    } else {
      this.setState({
        noNetwork: !isConnected
      })
    }
  }

  _onScrollView(e) {
    this.refs["_sdHeader"].onScrollHeaderBackground(
      e.nativeEvent.contentOffset.y
    );
  }

  returnNoNetwork(isShowHeader = true, title = "职么开门") {
    return (
      <View style={{flex: 1, position:'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 99}}>
      {isShowHeader && <SDHeader title={title}/>}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f3f3f3'
        }}
      >
        <View>
          <Image source={require("@img/default_page_no_network.png")}/>
        </View>

        <View style={{marginTop: CSS.pixel(40)}}>
          <Text style={{color: '#333', fontSize: CSS.textSize(32)}}>网络不给力</Text>
        </View>

         <View style={{marginTop: CSS.pixel(20)}}>
          {/* <Text style={{color: '#999', fontSize: CSS.textSize(28)}}>请检查网络设置或再试一次</Text> */}
          <Text style={{color: '#999', fontSize: CSS.textSize(28)}}>你已到达没有网络的外星球</Text>
        </View>

        <View style={{marginTop: CSS.pixel(60)}}>
          <SDTouchOpacity onPress={() => {
            NetInfo.isConnected.fetch().then(isConnected => {
              if (!isConnected) {
                this.setState({
                  noNetwork: true
                })
              } else {
                this.setState({
                  noNetwork: false
                })
              }
            }).catch(err => {
              this.setState({
                noNetwork: true
              })
            });
            // NetInfo.getConnectionInfo().then(res => {
            //   if(res && (res.type != 'none' && res.type != 'NONE' && res.effectiveType != '2g')) {
            //     this.setState({
            //       noNetwork: false
            //     })
            //   }
            // }).catch(err => {

            // });
          }} style={{width: CSS.pixel(200), height: CSS.pixel(80), justifyContent: 'center', alignItems: 'center', borderRadius: CSS.pixel(40), borderWidth: 1, borderColor: '#FE8900'}}>
            <Text style={{color: '#FE8900', fontSize: CSS.textSize(32)}}>
              刷新试试
            </Text>
          </SDTouchOpacity>
        </View>
      </View>
      </View>
    );
  }

  renderRealScreen() {

    let { header, screen, barStyle, fullScreen, navigatorButtons, statusBarColor, custom} = this.props;
    if (custom && screen) {
      return <View style={{flex: 1}} onLayout={() => {
        this.setState({
          hasEnter: true
        })
      }}>
        {this.state.noNetwork &&
          this.returnNoNetwork(header && header.title ? header.title : "职么开门")
        }
        {screen()}
      </View>
    }
    if (fullScreen != true) {
      return <View style={{flex: 1}} onLayout={() => {
        this.setState({
          hasEnter: true
        })
      }}><SDScreen
        header={() => {
          return <SDHeader navigatorButtons={navigatorButtons || {} } {...header}/>
        }}
      >
        {this.state.noNetwork &&
          this.returnNoNetwork(false)
        }
        {Platform.OS == 'ios' && <StatusBar barStyle={`${statusBarColor}-content`}/> }
        {this.props && this.props.screen ? this.props.screen() : null}
      </SDScreen></View>;
    }

    if (!header) {
      return (
        <View style={{flex: 1}} onLayout={() => {
          this.setState({
            hasEnter: true
          })
        }}><SDSafeArea
          backgroundColor={this.props.backgroundColor}
          noScrollView={this.props.noScrollView}
          saveBg={this.props.saveBg}
        >
          {this.state.noNetwork &&
            this.returnNoNetwork()
          }
          {Platform.OS == 'ios' && <StatusBar barStyle={`${statusBarColor}-content`}/> }
          {screen && screen()}
        </SDSafeArea></View>
      );
    }

    return (
      <View
        style={{
          flex: 1
        }}
        onLayout={() => {
          this.setState({
            hasEnter: true
          })
        }}
      >
        {this.state.noNetwork &&
          this.returnNoNetwork(true, header && header.title ? header.title : "职么开门")
        }
        {Platform.OS == 'ios' && <StatusBar barStyle={`${statusBarColor}-content`}/> }
        {header.fixed ? null : <SDHeader ref="_sdHeader" navigatorButtons={navigatorButtons || {}} {...header}/>}

        <SDSafeArea
          scrollEventThrottle={0.5}
          onScroll={header.fixed ? this._onScrollView.bind(this) : null}
          backgroundColor={this.props.backgroundColor}
          noScrollView={this.props.noScrollView}
          saveBg={this.props.saveBg}
        >
          {screen && screen()}
        </SDSafeArea>

        {header.fixed ? <SDHeader ref="_sdHeader" navigatorButtons={navigatorButtons || {}} {...header} animate/> : null}
      </View>
    );
  }

  render() {
    return(
      <View style={{flex: 1}}>
      {
        (!this.state.hasEnter || !this.state.hasCalcTimer) ?
        <View style={{backgroundColor: '#fff', zIndex: 98, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
          <SDHeader title={this.props.header && this.props.header.title ? this.props.header.title : "职么开门"}/>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image style={{width: 60, height: 160, top: -70}} resizeMode="stretch" source={loadericon}/>
            {/* <LottieView
              style={{ width: 200, height: 240}}
              loop
              autoPlay
              source={require("@img/animate/loader.json")}
            /> */}
          </View>

        </View> : null
      }
        {this.renderRealScreen()}
      </View>
    )
  }
}