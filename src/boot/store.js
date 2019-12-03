/* @flow */
import { AsyncStorage, Platform } from "react-native";
import { applyMiddleware, compose, createStore } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import * as appActions from "../boot/actions";
import SplashScreen from "react-native-splash-screen";
import config from "../config";
import rootReducer from "./reducers";
import middleware from "./middleware";
import Reactotron from "../ReactotronConfig";
import { isTesting, testAccount, testPassword } from 'react-native-dotenv'

// + const store = Reactotron.createStore(rootReducer, compose(middleware))

// AsyncStorage.clear(); // use to reset storage during development

// uncomment the following lines to integrate reactotron with redux
// const store = Reactotron.createStore(
//   rootReducer,
//   compose(autoRehydrate(), applyMiddleware(...middleware)),
// );

const enhancer = compose(
  autoRehydrate(),
  applyMiddleware(...middleware)
);

const store = (isTesting == "true") ? createStore(rootReducer, {}, enhancer) : config.isEmulator
  ? (Reactotron ? Reactotron.createStore(rootReducer, {}, enhancer) : createStore(rootReducer, {}, enhancer)) // (createStore)(rootReducer);
  : createStore(rootReducer, {}, enhancer); // (createStore)(rootReducer);

persistStore(
  store,
  {
    whitelist: [...config.storeKeys, ...config.cacheKeys],
    blacklist: [],
    storage: AsyncStorage
  },
  () => {
    // 获取所有本地数据后
    SplashScreen && SplashScreen.hide();
    store.dispatch(appActions.appInitialized());
  }
);

export default store;
