import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  Image,
  WebView,
  Keyboard
} from "react-native";
import PropTypes from "prop-types";
import { SDMainColor, navScreen, navLightBox } from "../../../styles/index";
import { CSS } from "../../../common/SDCSS";
import config from "../../../config";
import ShareButton from "../../../sd_shareButton/ShareButton";
import { isIphoneX } from "../../../utils/iphonex";
//import CalcSalaryScreen from "./CalcSalaryScreen";
import SDLoading from "@sd_components/SDLoading";
import ConnectWithActions from "../../../connectWithActions";
import * as HOSTS from "@src/host";

const wIs320 = Dimensions.get("window").width <= 320;

const sWidth = Dimensions.get("window").width;
const sHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    backgroundColor: "#fb7f49",
    position: "relative"
  }
});

//predictSalaryApp表示APP内算薪资，微信内用predictSalary
const suanxinziUrl = `${HOSTS.SHARE}/#/predictSalary`
const suanxinziUrlApp = `${HOSTS.SHARE}/#/predictSalaryApp`
//const suanxinziUrlApp = "http://192.168.2.100:1616/#/predictSalaryApp"

// 计算薪资首页
class CalcSalaryHomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      webviewHeight: 0,
      school:
        this.props.user.total && this.props.user.total.school_name
          ? this.props.user.total.school_name
          : "",
      major:
        this.props.user.total && this.props.user.total.major_name
          ? this.props.user.total.major_name
          : "",
      college:
        this.props.user.total && this.props.user.total.college_title
          ? this.props.user.total.college_title
          : ""
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentDidMount() {
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "newSuanxinziShareBtn"
    );
    /* setTimeout(() => {
      this.refs['suanxinzi_webview'].postMessage(JSON.stringify(this.props.user.total))
    }, 3000); */
  }

  componentWillUnmount() {
    this.refs['suanxinzi_webview'].reload();
  }

  shareIt(){
    navLightBox("LightBoxScreen", {
      passProps: {
        screen: () => {
          /*
          用户没有测试算薪资的时候分享h5出去，链接文案为“毕业薪资大揭秘，赶快来测一测！”
          若用户已经做了算薪资测试，分享出去的h5文案为“毕业后我能拿到月薪¥XXX，快来看看毕业月薪你能拿多少！”
          */
          return (
            <ShareButton
              timeLineOptions={{
                type: "news",
                title: `毕业薪资测算，你能拿多少月薪`,
                description: `未来身价大揭秘，看看你值多少钱`,
                webpageUrl: suanxinziUrl
              }}
              sessionOptions={{
                type: "news",
                title: `毕业薪资测算，你能拿多少月薪`,
                description: `未来身价大揭秘，看看你值多少钱`,
                webpageUrl: suanxinziUrl
              }}
              qqSessionOptions={{
                type: "news",
                title: `毕业薪资测算，你能拿多少月薪`,
                description: `未来身价大揭秘，看看你值多少钱`,
                url: suanxinziUrl,
                imageUrl: `${HOSTS.SHARE}/images/logo.png`,
              }}
              qqTimeLineOptions={{
                type: "news",
                title: `毕业薪资测算，你能拿多少月薪`,
                description: `未来身价大揭秘，看看你值多少钱`,
                url: suanxinziUrl,
                imageUrl: `${HOSTS.SHARE}/images/logo.png`,
              }}
            />
          );
        }
      }
    });
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      //算薪资分享
      if (event.id == "newSuanxinziShareBtn") {
        this.shareIt();
      }
    }
  }

  _onMessage(e){
    //console.warn( "On Message", e.nativeEvent.data );
    if (e.nativeEvent.data == "share from weixin") {
      this.shareIt();
      // if(this.refs['suanxinzi_webview']) this.refs['suanxinzi_webview'].getEngine().executeScript("window.scrollTo(0,0);")
    } else if (e.nativeEvent.data == "scroll to top") {
      // if(this.refs['suanxinzi_webview']) this.refs['suanxinzi_webview'].getEngine().executeScript("window.scrollTo(0,0);")
    } else if (e.nativeEvent.data == "keyboard dismiss") {
      Keyboard.dismiss();
    } else if (e.nativeEvent.data == "reload") {
      this.refs['suanxinzi_webview'].reload();
    } else if (e.nativeEvent.data == "get userdata") {
      //console.warn("get userdata", this.props.user.total);
      setTimeout(() => {
        this.refs['suanxinzi_webview'].postMessage(JSON.stringify(this.props.user.total))
      }, 1000);
    } else if (e.nativeEvent.data == "webview debug") {
      //console.warn( "webview debug", e.nativeEvent.data );
    }


  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
        onLayout={e => {
          this.setState({
            webviewHeight: e.nativeEvent.layout.height
          })
        }}
        style={{ backgroundColor: "#fff" }}>
          {this.state.loading ? <SDLoading /> : null}
            <View>
              <WebView ref={'suanxinzi_webview'} automaticallyAdjustContentInsets={false} source={{uri:suanxinziUrlApp}} style={{
                //flex: 1,
                width: '100%',
                height: this.state.webviewHeight,
                borderWidth: 0,
                borderColor:'#f00',
              }}
              onNavigationStateChange={()=>{
                //console.warn("msg post Change", this.refs['suanxinzi_webview'].postMessage)
                //this.refs['suanxinzi_webview'].postMessage(JSON.stringify(this.props.user.total))
              }}
                onLoadEnd={()=>{
                //console.warn("msg post onLoadEnd", this.props.user.total)
                //this.refs['suanxinzi_webview'].postMessage(JSON.stringify(this.props.user.total))
                  this.setState({
                    loading: false,
                  });
                }}
                //ref={( webView ) => this.suanxinzi_webview = webView}
                onMessage={this._onMessage.bind(this)}
              />
            </View>
        </ScrollView>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: state.user
}))(CalcSalaryHomeScreen);
