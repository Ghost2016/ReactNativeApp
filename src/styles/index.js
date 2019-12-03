/*export const CONTROL_SIZE = 44;
export const NAVBAR_SIZE = 58;
export const SPACING = 16;
export const HALF_SPACING = 8;

export const BRAND_COLOR = "rgba(82, 194, 175, 1)";
export const BORDER_COLOR = BRAND_COLOR;
export const HIGHLIGHT_COLOR = "rgba(86, 164, 174, 0.5)";
export const HALF_COLOR = "rgba(127, 127, 127, 0.5)";
export const QUARTER_COLOR = "rgba(127, 127, 127, 0.25)";*/
import config from "../config";

import { Navigation } from "react-native-navigation";
import { StyleSheet, View, Platform } from "react-native";

//主色调 - 用于顶导航栏、状态栏及重要信息
export const SDMainColor = "#fed200";
//辅助色
//用于背景色
export const SDBGColorBlue = "#00adfe";
//用于icon 图表
export const SDBGColorGreen = "#00fead";
//用于icon 图表
export const SDBGColorOrange = "#fe8900";
//用于icon 图表
export const SDBGColorPurple = "#cf4cff";
//用于icon
export const SDBGColorRed = "#ff766f";
//用于背景色
export const SDBGColorMain = "#f3f3f3";
//用于列表、表单、板块背景色
export const SDBGColorMinor = "#ffffff";
//用于白色列表点击时背景色
export const SDBGColorClick = "#f7f7f7";
//用于灰色背景色
export const SDBGColorGrey = "#eeeeee";
//用于按钮灰色背景色
export const SDBGColorGreyBtn = "#d2d2d2";

//辅助色
//用于边框、分割线
export const SDHelperColorline = "#e1e1e1";
export const SDHelperColorline2 = "#e0e0e0";
export const SDHelperColorline3 = "#bfbfbf";
//用于表格线条用色
export const SDHelperColortable = "#d0d0d0";

//文字标准色
//重要文字
export const SDFontColorMain = "#333333";
//次要文字
export const SDFontColorMinor = "#666666";
//辅助文字
export const SDFontColorSubtitle = "#999999";
//文字标准色
//重要文字
// export const SDFontColorMain = "red";
// //次要文字
// export const SDFontColorMinor = "green";
// //辅助文字
// export const SDFontColorSubtitle = "blue";
//图表相关文字
export const SDFontColorChart = "#c5c5c5";

//字体粗细
export const SDFontNormal = "300";
export const SDFontMedium = "400";
export const SDFontBold = "500";

//按钮用色
//用于可点击按钮背景色
export const SDBtnColorClick = "#fed200";
//用于可点击按钮点击时背景色
export const SDBtnColorActive = "#efc600";
//用于不可点击按钮背景色
export const SDBtnColorDisable = "#d2d2d2";

//shadow style
export const shadowStyle = {
  shadowColor: "#000000",
  shadowOffset: {
    width: 0,
    height: 1
  },
  shadowRadius: 5,
  shadowOpacity: 0.0
};

//antd tabs的样式设置
export const antdTabsConfig = {
  tabBarUnderlineStyle: {
    //tabBar 下划线样式
    backgroundColor: "#333"
  },
  tabBarBackgroundColor: "#fff", //tabBar背景色
  tabBarActiveTextColor: "#333", // tabBar激活Tab文字颜色
  tabBarInactiveTextColor: "#666", // tabBar非激活Tab文字颜色
  tabBarTextStyle: {} //tabBar文字样式
};

// 生成默认的push screen
export function navScreen(screen, title, options = {}) {
  const override = options.override || {};
  return {
    screen: `${config.projName}.${screen}`,
    title: title,
    backButtonHidden: false,
    backButtonTitle: "",
    navigatorStyle: {
      statusBarColor: "transparent",
      statusBarTextColorScheme: options.passProps && options.passProps.statusBarColor ? options.passProps.statusBarColor : "dark", //light
      drawUnderStatusBar: true,
      navBarNoBorder: true,
      navBarHidden: true,
      tabBarHidden: true // 隐藏tab
    },
    navigatorButtons: null,
    //重写passProps
    passProps: {
      passSpecialProps: Object.assign(
        {},
        { title: title },
        options.passProps || {},
        options.navigatorButtons
          ? { navigatorButtons: options.navigatorButtons }
          : {}
      )
    },
    ...override
  };
}

// 导航右侧按钮
export function navRightButton(id, title, testID) {
  if (typeof title === "string") {
    return {
      navigatorButtons: {
        rightButtons: [
          {
            title: title, // for a textual button, provide the button title (label)
            id: id, // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            testID: testID || "testid", // optional, used to locate this view in end-to-end tests
            disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
            disableIconTint: false, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
            showAsAction: "ifRoom", // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
            buttonColor: "#fff", // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
            buttonFontSize: Platform.OS == "ios" ? 14 : 17, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
            buttonFontWeight: "600" // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
          }
          //   {
          //     icon: require('../../img/navicon_add.png'), // for icon button, provide the local image asset name
          //     id: 'add' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          //   }
        ]
      }
    };
  } else {
    return {
      navigatorButtons: {
        rightButtons: [
          {
            icon: title, // require('../../img/navicon_add.png'), // for icon button, provide the local image asset name
            id: id // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          }
        ]
      }
    };
  }
}

// 弹出lightbox
export function navLightBox(screen, options = {}, styles = {}) {
  return Navigation.showLightBox({
    screen: `${config.projName}.${screen}`,
    style: {
      ...lightBoxStyle,
      ...styles
    },
    ...options,
    //重写passProps
    passProps: {
      passSpecialProps: options.passProps || {}
    }
  });
}
// 使lightbox消失
export function dismissLightBox() {
  return Navigation.dismissLightBox();
}

//navigator push screen style
export const navPushStyle = {
  // navBarTextColor: "#fff",
  // navBarButtonColor: "#fff",
  // navBarBackgroundColor: SDMainColor,
  // navBarTitleTextCentered: true,
  // navBarSubTitleTextCentered: true,
  // topBarElevationShadowEnabled: false,
  // statusBarTextColorScheme: "light",
  // // screenBackgroundColor: SDMainColor,
  // // statusBarHidden: true,
  // navBarNoBorder: true,
  // navBarHidden: true,
  // tabBarHidden: true // 隐藏tab
  statusBarColor: "transparent",
  statusBarTextColorScheme: "dark", //light
  drawUnderStatusBar: true,
  navBarNoBorder: true,
  navBarHidden: true,
  tabBarHidden: true // 隐藏tab
};

//navigator light box style
export const lightBoxStyle = {
  backgroundBlur: "none",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  tapBackgroundToDismiss: true
};

// 弹出modal
export function navModal(screen, title = "", options = {}) {
  return {
    screen: `${config.projName}.${screen}`,
    title: title,
    navigatorStyle: modalStyle,
    animationType: "slide-up", // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    ...options,
    //重写passProps
    passProps: {
      passSpecialProps: options.passProps || {}
    }
  };
}

// 使modal消失
export function dismissModal() {
  return Navigation.dismissModal({
    animationType: "slide-down" // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
  });
}

// 使所有modal消失
export function dismissAllModals() {
  return Navigation.dismissAllModals({
    animationType: "slide-down" // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
  });
}

const modalStyle = {
  navBarTextColor: "#fff",
  navBarButtonColor: "#fff",
  navBarBackgroundColor: SDMainColor,
  navBarTitleTextCentered: true,
  navBarSubTitleTextCentered: true,
  topBarElevationShadowEnabled: false,
  statusBarTextColorScheme: "light",
  // screenBackgroundColor: SDMainColor,
  navBarHidden: true,
  navBarNoBorder: true,
  tabBarHidden: true // 隐藏tab
};

// 超大间距
export const SD_DOUBLE_SPACING = 32;
// 大间距
export const SD_SPACING = 16;
// 中间距
// 用于：
// 界面两边间距
export const SD_HALF_SPACING = 8;
// 小间距
// 比如paddingTop, paddingBottom
// 另外用于设置圆角
export const SD_QUARTER_SPACING = 4;

// 迷你字体
export const SD_FONTSIZE_MINI = 8;
// 小字体
export const SD_FONTSIZE_SMALL = 12;
// 中字体
export const SD_FONTSIZE_MIDDLE = 16;
// 大字体
export const SD_FONTSIZE_BIG = 24;
// 超大字体
export const SD_FONTSIZE_SUPER = 36;

export default StyleSheet.create({
  flex: {
    flex: 1
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  flexRow: {
    flexDirection: "row"
  },
  fontMainColor: {
    color: SDFontColorMain
  },
  fontSubColor: {
    color: SDFontColorSubtitle
  },
  singleLine: {
    width: 1,
    height: 10,
    borderLeftWidth: 1,
    borderColor: "#eee"
  },
  // 分割线
  separator: {
    borderBottomColor: SDHelperColorline,
    borderBottomWidth: 1 //StyleSheet.hairlineWidth
  }
});
