/* @flow */
//import React, { PureComponent } from "react";
import { Platform } from "react-native";
import { getTheme, defaultThemeVariables } from "@shoutem/ui";
import * as sdStyles from "@styles";

//console.log("defaultThemeVariables", defaultThemeVariables);
const myThemeVariables = {
  ...defaultThemeVariables
  //title: {  fontFamily: 'MyFont' },
};
const defaultTheme = getTheme(myThemeVariables);
//console.log("defaultTheme", defaultTheme);

const styleAlignCenter = {
  textAlign: "center"
};

const theme = {
  ...defaultTheme,
  //sdMainHeadBg NavigationBar
  "shoutem.ui.NavigationBar.sdMainHeadBg": {
    backgroundColor: sdStyles.SDMainColor
  },
  "shoutem.ui.Heading.sd-center": styleAlignCenter,
  "shoutem.ui.Title.sd-center": styleAlignCenter,
  "shoutem.ui.Subtitle.sd-center": styleAlignCenter,
  "shoutem.ui.Text.sd-center": styleAlignCenter,
  "shoutem.ui.Text.sd-highlight": {
    color: sdStyles.SDFontColorMain
  },
  "shoutem.ui.Text.sd-grey": {
    color: sdStyles.SDFontColorSubtitle,
    marginRight: 30
  },
  "shoutem.ui.Text": {
    ".sd-grey": {
      color: sdStyles.SDFontColorSubtitle,
      marginRight: 30
    },
    ".sd-normal": {
      color: sdStyles.SDFontColorMain
    },
    color: "#666666",
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal"
  },
  "shoutem.ui.Title": {
    ".sd-title": {
      fontSize: 20,
      color: sdStyles.SDFontColorMain,
      margin: 10
    }
    /*
    color:"#222222",
    fontFamily:"Rubik-Regular",
    fontSize:20,
    fontStyle:"normal",
    fontWeight:"normal",
    lineHeight:25,*/
  },
  //
  //"shoutem.ui.View.sd-center": styleAlignCenter,
  "shoutem.ui.View": {
    ".sd-left-border": {
      borderLeftWidth: 2,
      borderLeftColor: sdStyles.SDFontColorMain,
      marginLeft: 10
    },
    ".sd-yellow-bg": {
      backgroundColor: "#ff0000" //sdStyles.sdMainHeadBg,
    },
    ".dev": {
      backgroundColor: "#efefef",
      margin: 1,
      paddingTop: 20,
      paddingBottom: 20
    },
    ".tabContent": {
      flex: 1,
      height: 160,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff"
    },
    ".inputWrap": {
      height: 70,
      paddingLeft: 25,
      paddingRight: 40
    }
  },
  "shoutem.ui.Row": {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    flexGrow: 1,
    flexShrink: 0,
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 15,
    ".sd-yellow-bg": {
      backgroundColor: sdStyles.SDMainColor
    }
  },
  "shoutem.ui.Text.dev": {
    backgroundColor: "#ff0000",
    margin: 1
  },
  "shoutem.ui.Row.dev": {
    backgroundColor: "#efefef",
    margin: 1
  },

  "shoutem.ui.Button.dev": {
    backgroundColor: "#ff0000",
    margin: 1
  }
  /*".sd-radio": {
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    marginRight: 15,
  },
  ".sd-title": {
    fontSize: 16,
    color: sdStyles.SDFontColorMain,
    borderLeftWidth: 3,
    borderLeftColor: sdStyles.SDFontColorMain,

  },*/
};

export default theme;
