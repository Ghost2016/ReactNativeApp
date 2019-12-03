/* @flow */
//路由相关帮助函数
import config from "../config";
import * as sdStyles from "@styles";
import { CSS } from "../common/SDCSS";
import { Platform, Alert } from "react-native";

export const screenName = name => {
  return `${config.projName}.${name}`;
};

export const navStyle = ({
  navBarTitleTextCentered = true,
  navBarSubTitleTextCentered = true,
  navBarBackgroundColor = "#f7f7f7",
  navBarHidden = false,
  topBarElevationShadowEnabled = false,
  // android
  statusBarColor = "#000000",
  navBarTopPadding = 0,
  // ios
  statusBarTextColorScheme = "light",
  topBarShadowColor = "#fff",
  topBarShadowOpacity = 0,
  topBarShadowOffset = 0,
  topBarShadowRadius = 0,
  navBarTextColor = "#fff",
  navBarButtonColor = "#fff",
  tabBarHidden = false, // 隐藏tab
  orientation = "portrait", //auto landscape portrait
  disabledButtonColor = "#ff0000",
  navBarHeight = 50,
  topTabsHeight = 50
}) => {
  return {
    // Common
    navBarTextColor: navBarTextColor, //'#000000', // change the text color of the title (remembered across pushes)
    navBarTextFontSize: CSS.textSize(36), // change the font size of the title
    //navBarTextFontFamily: 'font-name', // Changes the title font
    navBarBackgroundColor: navBarBackgroundColor, // change the background color of the nav bar (remembered across pushes)
    //navBarCustomView: 'example.CustomTopBar', // registered component name
    //navBarComponentAlignment: 'center', // center/fill
    //navBarCustomViewInitialProps: {}, // navBar custom component props
    navBarButtonColor: navBarButtonColor, //'#007aff', // Change color of nav bar buttons (eg. the back button) (remembered across pushes)
    topBarElevationShadowEnabled: topBarElevationShadowEnabled, // (Android - default: true, iOS - default: false). Disables TopBar elevation shadow on Lolipop and above
    navBarHidden: navBarHidden, // make the nav bar hidden
    navBarHideOnScroll: false, // make the nav bar hidden only after the user starts to scroll
    //navBarTranslucent: false, // make the nav bar semi-translucent, works best with drawUnderNavBar:true
    //navBarTransparent: false, // make the nav bar transparent, works best with drawUnderNavBar:true,
    navBarNoBorder: true, // hide the navigation bar bottom border (hair line). Default false
    //drawUnderNavBar: false, // draw the screen content under the nav bar, works best with navBarTranslucent:true
    drawUnderTabBar: false, // draw the screen content under the tab bar (the tab bar is always translucent)
    //navBarBlur: false, // blur the entire nav bar, works best with drawUnderNavBar:true
    tabBarHidden: tabBarHidden, // make the screen content hide the tab bar (remembered across pushes)
    //statusBarHidden: false, // make the status bar hidden regardless of nav bar state
    statusBarTextColorScheme: statusBarTextColorScheme, // text color of status bar, 'dark' / 'light' (remembered across pushes)
    //navBarSubtitleColor: '#ccc', // subtitle color
    //navBarSubtitleFontFamily: 'font-name', // subtitle font, 'sans-serif-thin' for example
    //navBarSubtitleFontSize: 13, // subtitle font size
    //screenBackgroundColor: 'white', // Default screen color, visible before the actual react view is rendered
    orientation: orientation, // Sets a specific orientation to a modal and all screens pushed to it. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
    disabledButtonColor: disabledButtonColor, // chnaged the navigation bar button text color when disabled.
    //rootBackgroundImageName: 'iOS: <name of image in Images.xcassets>. Android: <name of drawable>', // Static while you transition between screens. Works best with screenBackgroundColor: 'transparent'

    // iOS only
    //statusBarTextColorSchemeSingleScreen: 'light', // same as statusBarTextColorScheme but does NOT remember across pushes
    //statusBarHideWithNavBar: false, // hide the status bar if the nav bar is also hidden, useful for navBarHidden:true
    //statusBarBlur: false, // blur the area under the status bar, works best with navBarHidden:true

    //disabledBackGesture: false, // default: false. Disable the back gesture (swipe gesture) in order to pop the top screen.
    //disabledSimultaneousGesture: true, // default: true. Disable simultaneous gesture recognition.
    //screenBackgroundImageName: '<name of image in Images.xcassets>', // Optional. default screen background image.

    //navBarButtonFontSize: 20, // Change font size nav bar buttons (eg. the back button) (remembered across pushes)
    //navBarButtonFontWeight: '500', // Change font weight nav bar buttons (eg. the back button) (remembered across pushes)

    //navBarLeftButtonFontSize: 17, // Change font size of left nav bar button
    //navBarLeftButtonColor: '#f7f7f7', // Change color of left nav bar button
    //navBarLeftButtonFontWeight: '400', // Change font weight of left nav bar button

    //navBarRightButtonFontSize: 17, // Change font size of right nav bar button
    //navBarRightButtonColor: '#f7f7f7', // Change color of right nav bar button
    //navBarRightButtonFontWeight: '600', // Change font weight of right nav bar button

    topBarShadowColor: topBarShadowColor, // Sets shadow of the navbar, Works only when topBarElevationShadowEnabled: true
    topBarShadowOpacity: topBarShadowOpacity, // Sets shadow opacity on the navbar, Works only when topBarElevationShadowEnabled: true
    topBarShadowOffset: topBarShadowOffset, //12, // Sets shadow offset on the navbar, Works only when topBarElevationShadowEnabled: true
    topBarShadowRadius: topBarShadowRadius, //3, // Sets shadow radius on the navbar, Works only when topBarElevationShadowEnabled: true // Sets the preferred size for the view controller’s view. //modalPresentationStyle: 'formSheet', // Sets the presentation style for modally presented view controllers. Supported styles are: 'formSheet', 'pageSheet', 'overFullScreen', 'overCurrentContext' and 'fullScreen'. //largeTitle: false, // Sets the nav bar title to be in the larger iOS 11 style // Android only //navigationBarColor: '#000000', // change the background color of the bottom native navigation bar.

    /*preferredContentSize: {
      width: 500,
      height: 500
    },*/ navBarTitleTextCentered: navBarTitleTextCentered, // default: false. centers the title.
    navBarSubTitleTextCentered: navBarSubTitleTextCentered, // (Android - default: false, iOS - default: depending on navBarTitleTextCentered). centers the subTitle.
    //navBarButtonFontFamily: 'sans-serif-thin', // Change the font family of textual buttons
    statusBarColor: statusBarColor, // change the color of the status bar.
    //drawUnderStatusBar: false, // default: false, will draw the screen underneath the statusbar. Useful togheter with statusBarColor: transparent
    //collapsingToolBarImage: "http://lorempixel.com/400/200/", // Collapsing Toolbar image.
    //collapsingToolBarImage: require('../../img/topbar.jpg'), // Collapsing Toolbar image. Either use a url or require a local image.
    //collapsingToolBarCollapsedColor: '#0f2362', // Collapsing Toolbar scrim color.
    //navBarTextFontBold: false, // Optional. Set the title to bold.
    navBarHeight: navBarHeight, // Optional, set the navBar height in pixels.
    navBarTopPadding: navBarTopPadding, //24, // Optional, set navBar top padding in dp. Useful when StatusBar.translucent=true on Android Lollipop and above.
    topTabsHeight: topTabsHeight, // Optional, set topTabs height in pixels.
    topBarBorderColor: sdStyles.SDMainColor // Optional, set a flat border under the TopBar.
    //topBarBorderWidth: 5.5, // Optional, set the width of the border.
  };
};

export const navOpen = (
  navigator,
  method = "",
  {
    name = "",
    title = "",
    tabBarHidden = false,
    subtitle = null, //如果为空也会占一行
    titleImage = null,
    passProps = {},
    animated = true,
    animationType = "fade", //slide-horizontal slide-up
    navigatorButtons = {},
    previewRef = null,
    previewHeight = null,
    previewCommit = true,
    previewActions = [],
    orientation = "portrait",
    disabledButtonColor = "",
    rootBackgroundImageName = "",
    navBarTopPadding = 0 //android only
  }
) => {
  const navStyleData = navStyle({
    navBarTitleTextCentered: true,
    navBarSubTitleTextCentered: true,
    navBarBackgroundColor: sdStyles.SDMainColor,
    navBarHidden: false,
    topBarElevationShadowEnabled: false,
    // android
    statusBarColor: sdStyles.SDMainColor,
    navBarTopPadding: navBarTopPadding,
    // ios
    statusBarTextColorScheme: "light",
    topBarShadowColor: "#fff",
    topBarShadowOpacity: 0,
    topBarShadowOffset: 0,
    topBarShadowRadius: 0,
    navBarTextColor: "#fff",
    navBarButtonColor: "#fff",
    tabBarHidden: tabBarHidden, // 隐藏tab
    orientation: orientation, //auto landscape portrait
    disabledButtonColor: disabledButtonColor,
    rootBackgroundImageName: rootBackgroundImageName
  });
  const opts = {
    screen: screenName(name),
    title: title,
    subtitle: subtitle,
    titleImage: titleImage,
    passProps: passProps,
    animated: animated,
    backButtonHidden: false,
    backButtonTitle: "", //不能为null，否则会报错
    navigatorStyle: navStyleData,
    navigatorButtons: navigatorButtons,
    previewView: previewRef,
    previewHeight: previewHeight,
    previewCommit: previewCommit,
    previewActions: previewActions
  };

  let cbFunc = null;
  if (name) {
    switch (method) {
      case "LightBox":
        navigator.showLightBox(opts);
        /*cbFunc = (navigator) => {
          navigator.dismissLightBox()
        }*/
        break;
      case "Modal":
        navigator.showModal(opts);
        /*cbFunc = (navigator) => {
          navigator.dismissModal({
            animated: true,
            animationType: 'slide-down',
          })
        }*/
        break;
      //popToRoot
      case "pop":
        navigator.pop({
          animated: true,
          animationType: "fade"
        });
        break;
      case "popToRoot":
        navigator.popToRoot({
          animated: true,
          animationType: "fade"
        });
        break;
      default:
        navigator.push(opts);
    }
  }
  /*cbFunc = (navigator) => {
    navigator.pop({
      animated: true,
      animationType: 'fade',
    })
  }*/
  return cbFunc;
};

export const snackBar = (navigator, info) => {
  if (Platform.OS === "android") {
    /*navigator.showSnackbar({
      text: info
    });*/
  } else {
    //Alert.alert(info);
  }
};
