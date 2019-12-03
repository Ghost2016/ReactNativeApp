/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
// import { Font, AppLoading } from "expo";

// import type { ChildrenArray } from '../types';
import connectWithActions from "../connectWithActions";
import { connectStyle, StyleProvider } from "@shoutem/theme";
import theme from "@styles/STTheme";

// import { getSettings } from "../directSelectors";
// import themeCreator from "../styles/theme";
// import themeDark from "../styles/themeDark";
// import themeLight from "../styles/themeLight";

// const themeNameToObject = {
//   default: themeLight,
//   light: themeLight,
//   night: themeDark
// };

// const Dummy = props => props.children;

// type Props = {
//   theme: string,
//   children?: ChildrenArray<*>,
// };

class StyleThemeProvider extends PureComponent {
  // state = {
  //   fontsAreLoaded: false
  // };
  // async componentWillMount() {
  //   await Font.loadAsync({
  //     "Rubik-Black": require("../../assets/fonts/Rubik-Black.ttf"),
  //     "Rubik-BlackItalic": require("../../assets/fonts/Rubik-BlackItalic.ttf"),
  //     "Rubik-Bold": require("../../assets/fonts/Rubik-Bold.ttf"),
  //     "Rubik-BoldItalic": require("../../assets/fonts/Rubik-BoldItalic.ttf"),
  //     "Rubik-Italic": require("../../assets/fonts/Rubik-Italic.ttf"),
  //     "Rubik-Light": require("../../assets/fonts/Rubik-Light.ttf"),
  //     "Rubik-LightItalic": require("../../assets/fonts/Rubik-LightItalic.ttf"),
  //     "Rubik-Medium": require("../../assets/fonts/Rubik-Medium.ttf"),
  //     "Rubik-MediumItalic": require("../../assets/fonts/Rubik-MediumItalic.ttf"),
  //     "Rubik-Regular": require("../../assets/fonts/Rubik-Regular.ttf"),
  //     "rubicon-icon-font": require("../../assets/fonts/rubicon-icon-font.ttf")
  //   });

  //   this.setState({ fontsAreLoaded: true });
  // }
  render() {
    // if (!this.state.fontsAreLoaded) {
    //   return <AppLoading />;
    // }
    return <StyleProvider style={theme}>{this.props.children}</StyleProvider>;
  }
}

// class StyleProvider extends PureComponent {
//   //   props: Props;

//   static childContextTypes = {
//     theme: () => {},
//     styles: () => {}
//   };

//   static defaultProps = {
//     theme: "default"
//   };

//   getChildContext() {
//     const { theme } = this.props;
//     const styles = StyleSheet.create(themeCreator(themeNameToObject[theme]));
//     return { theme, styles };
//   }

//   render() {
//     const { children, theme } = this.props;
//     return <Dummy key={theme}>{children}</Dummy>;
//   }
// }

//const theme = getTheme();

export default connectWithActions(state => ({
  // theme: getSettings(state).theme
}))(StyleThemeProvider);

// export default StyleProvider;
