import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  SectionList,
  Text,
  Platform
} from "react-native";
import { SDHeader } from "../../../common";
import RankTabs from "./RankTabs";
import * as sdStyles from "@src/styles";
import { RankSearchBar } from "../../../sd_rank";
import { SearchBar } from "antd-mobile";
import SearchInput from "@src/sd_querydatatabs/queryView/SearchInput";
import PropTypes from "prop-types";
import RankTabOne from "./RankTabOne";
import RankTabTwo from "./RankTabTwo";
import RankTabThree from "./RankTabThree";
//import { Touchable } from "@src/sd_components";
import { antdTabsConfig } from "@styles";
import FootSpace from "@sd_components/FootSpace";
import TabItemStyle from "antd-mobile/es/tabs/style/index.native";
import { CSS } from "../../../common/SDCSS";
import { dismissModal, dismissAllModals, dismissLightBox, navLightBox, navScreen, navModal } from "@styles";
import MyHomeScreen from "../../pushScreen/myHome/MyHomeScreen";
import ImageViewerScreen from "../../modalScreen/imageViewerScreen/ImageViewerScreen";
import { Navigation } from "react-native-navigation";
import * as HOSTS from "@src/host";

//定制tabs下划线颜色样式
const newTabsStyle = {};
for (const key in TabItemStyle) {
  if (Object.prototype.hasOwnProperty.call(TabItemStyle, key)) {
    newTabsStyle[key] = { ...StyleSheet.flatten(TabItemStyle[key]) };
  }
}
newTabsStyle.Tabs.container = {
  // height: 300
};
newTabsStyle.TabBar.underline = {
  // height: 300
};
newTabsStyle.TabBar.tabs = {
  ...newTabsStyle.TabBar.tabs
  // zIndex:10
  // height: 300
};

console.log("newTabsStyle", newTabsStyle);

const tabs = [
  {
    title: "登峰榜"
  },
  {
    title: "关注榜"
  },
  {
    title: "进步榜"
  }
];

const tabsProps = {
  tabBarBackgroundColor: sdStyles.SDMainColor,
  tabBarInactiveTextColor: "#fff",
  tabBarActiveTextColor: "#fff",
  tabBarUnderlineStyle: {
    height: 0
  }
};

const styles = StyleSheet.create({});

type Props = {};
type State = {};

/**
 *  排名页面
 */
export default class RankScreen extends React.Component<Props, State> {
  props: Props;
  state: State = {
    imageUrls: [],
    index: 0,
    show: false
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };

  onChangeSearchText = () => {};
  onSeachBarFocus = () => {
    this.context.refs["_rankIndexSearchBar"].blur();
  };
  onSeachBarBlur = () => {
    this.context.navigator.showModal(navModal("RankSearchScreen", "排名", {}));
  };
  handleViewImageDone = () => {
    // this.context.navigator.dismissAllModals({animationType: 'none'})
    dismissLightBox();
  }
  // 浏览图片
  handleViewImages = (image, index, navigator) => {
    // this.context.navigator.push()
    // navigator && navigator.showModal({
    //   passProps: {
    //     passSpecialProps: {
    //       imageUrls: image || [{url:`${HOSTS.CDN}/IMG_00041534304095920.JPG`}, {url:`${HOSTS.CDN}/IMG_00041534304095920.JPG`}],
    //       index: index || 0
    //     }
    //   },
    //   screen:'example.ImageViewerScreen'
    // })
    // return
    navigator && navigator.showModal(navModal("ImageViewerScreen", "", {
      animationType: 'none',
      passProps: {
        imageUrls: image || [{url:`${HOSTS.CDN}/IMG_00041534304095920.JPG`}, {url:`${HOSTS.CDN}/IMG_00041534304095920.JPG`}],
        index: index || 0
      }
    }));
  }
  handleActionToUpdateAllData = () => {
    this.context.refs['rank_tab_one'] && this.context.refs['rank_tab_one'].handleActionToUpdateAllData();
    this.context.refs['rank_tab_two'] && this.context.refs['rank_tab_two'].handleActionToUpdateAllData();
    this.context.refs['rank_tab_three'] && this.context.refs['rank_tab_three'].handleActionToUpdateAllData()
  }
  componentDidMount() {
    console.log('ly88', 'refs_rankScreen_register')
    this.context.refs["_rankScreen"] = this;
  }
  // 跳转到自己的个人主页
  navToPerson = () => {
    dismissAllModals();
    this.context.navigator.push(
      navScreen("PushScreen", "我的主页", {
        passProps: {
          screen: () => <MyHomeScreen showTabBar={false}/>,
          header: {
            title: '我的主页'
          }
        }
      })
    );
    return;
    // 跳转到第四个Tab
    this.context.navigator.switchToTab({
      tabIndex: 3
    });
  };
  // 跳转到个人主页
  navToOtherHomeTab = (id) => {
    dismissAllModals();
    this.context.navigator.push(
      navScreen("PushScreen", "个人主页", {
        passProps: {
          fullScreen: true,
          noScrollView: true,
          screen: () => <MyHomeScreen userId={id} />,
          header: {
            title: '个人主页'
          } // 自定义传递props
        }
      })
    );
    return
  };

  render() {
    const Header = (
      <View style={{width:'100%'}}>
        <RankSearchBar
        placeholder="通过昵称、专业、学校搜索你感兴趣的用户"/>
        {/* 设置高度为44，与搜索框的高度一致 */}
        <TouchableWithoutFeedback onPress={() => { this.onSeachBarBlur()}}>
          <View
            style={{
              zIndex: 9999,
              height: 44,
              width: "100%",
              backgroundColor: "transparent",
              position: "absolute"
            }}
          />
        </TouchableWithoutFeedback>
      </View>
    );
    const ScrollCompWithHeader = (
      <View style={{backgroundColor:sdStyles.SDBGColorMain,
      // height: Platform.OS ==='android' ? CSS.height()-CSS.pixel(260, true) : CSS.height()-CSS.pixel(360, true),
      flex:1,
      position:'relative'}}>
        <RankTabs
          prerenderingSiblingsNumber={0}
          usePaged={false}
          tabs={tabs}
          // styles={newTabsStyle}
          // {...tabsProps}
          initialPage={0}
          swipeable={false}
          onChangeTab={(index) => {
            if(index === 1) {
              this.context.refs['rank_tab_two'] && this.context.refs['rank_tab_two'].doFetch();
            }
          }}>
          <View style={{ backgroundColor: sdStyles.SDBGColorMain}}>
            <RankTabOne />
          </View>
          <View style={{ backgroundColor: sdStyles.SDBGColorMain}}>
            <RankTabTwo />
          </View>
          <View style={{ backgroundColor: sdStyles.SDBGColorMain}}>
            <RankTabThree />
          </View>
        </RankTabs>
      </View>
    );
    return (<View
        style={{
          backgroundColor: sdStyles.SDBGColorMain,
          flex:1
        }}>
        <SDHeader custom={Header} backgroundColor={sdStyles.SDMainColor}/>
        {ScrollCompWithHeader}
      </View>)
  }
}
