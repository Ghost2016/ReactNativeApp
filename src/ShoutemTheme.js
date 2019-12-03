import React, { Component } from "react";
import { Dimensions } from "react-native";
import { getTheme, defaultThemeVariables } from "@shoutem/ui";

const window = Dimensions.get("window");
const Colors = {
  BACKGROUND: "#efefef",
  BACKGROUNDGrey: "#cccccc",
  SHADOW: "#000000"
};

const MEDIUM_GUTTER = 15;

const myThemeVariables = {
  ...defaultThemeVariables
  //title: {  fontFamily: 'MyFont' },
};
const myTheme = getTheme(myThemeVariables);

const theme = {
  ...myTheme,
  "shoutem.ui.TextInput": {
    ".HtmlBg": {
      backgroundColor: "#ffffff", //Colors.BACKGROUND,
      width: 240
    }
  }
  /*'shoutem.ui.View': {
    '.h-center': {
      alignItems: 'center',
    },

    '.v-center': {
      justifyContent: 'center',
    },

    '.flexible': {
      flex: 1,
    },

    flexDirection: 'column',

    '.scrollview': {
      height: 800,
    },

    '.HtmlBg': {
      backgroundColor: Colors.BACKGROUND,
    },
  },

  'shoutem.ui.Card': {
    'shoutem.ui.View.content': {
      'shoutem.ui.Subtitle': {
        marginBottom: MEDIUM_GUTTER,
      },

      flex: 1,
      alignSelf: 'stretch',
      padding: 10,
    },

    width: (360 / 375) * window.width,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 2,
    shadowColor: Colors.SHADOW,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 1,
      height: 1
    },
    //marginTop: 56,
    marginTop: 6,
  },

  'shoutem.ui.Title': {
    marginBottom: 16,
  },

  'shoutem.ui.Button': {
    marginBottom: 56,
    '.dark': {
      backgroundColor: Colors.BACKGROUNDGrey,
    }
  },

  'shoutem.ui.Image': {
    '.medium-wide': {
      width: (360 / 375) * window.width,
      height: 85,
    },

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
    backgroundColor: Colors.BACKGROUND,
  },*/
};

export { theme as default, Colors };
