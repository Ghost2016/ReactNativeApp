/* @flow */
/* eslint-disable */
import Reactotron, { asyncStorage, networking, openInEditor } from 'reactotron-react-native';
import { NativeModules } from 'react-native';

import { reactotronRedux } from 'reactotron-redux';
import { isTesting, testAccount, testPassword } from 'react-native-dotenv'
import config from './config';
// uncomment the following lines to test on a device
// let scriptHostname;
// if (__DEV__) {
//   const scriptURL = NativeModules.SourceCode.scriptURL;
//   scriptHostname = scriptURL.split('://')[1].split(':')[0];
// }
//console.log("isTesting==[][]", typeof isTesting, isTesting)

// Reactotron.configure(/*{ host: scriptHostname }*/) // controls connection & communication settings
const reactotron = config.isDev ? Reactotron.configure({
  name: "React Native"
})
  .useReactNative() // add all built-in react native plugins
  .use(reactotronRedux())
  .use(asyncStorage())
  .use(networking())
  .use(openInEditor())
  .connect() : null;

export default reactotron
