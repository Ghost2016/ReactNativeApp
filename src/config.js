/* @flow */
import { NativeModules } from "react-native";
import DeviceInfo from "react-native-device-info";
import * as HOSTS from "@src/host";

// import type { Narrow, Notification } from './types';

const isDevelopment = process.env.NODE_ENV === "development";
const isEmulator = NativeModules.RNDeviceInfo ? DeviceInfo.isEmulator() : false;

//正式发布APP需要修改成true
const isRelease = false;

type Config = {
  projName: string,
  //   startup: {
  //     narrow: ?Narrow,
  //     anchor: number,
  //     notification: ?Notification,
  //   },
  compatibilityUrl: string,
  //   messagesPerRequest: number,
  //   scrollCallbackThrottle: number,
  //   messageListThreshold: number,
  enableReduxLogging: boolean,
  enableReduxSlowReducerWarnings: boolean,
  enableSentry: boolean,
  //   enableWebViewErrorDisplay: boolean,
  //   enableNotifications: boolean,
  slowReducersThreshold: number,
  sentryKey: string,
  enableErrorConsoleLogging: boolean,
  socketServer: string,
  //   trackServerEvents: string[],
  //   serverDataOnStartup: string[],
  storeKeys: string[],
  cacheKeys: string[],
  aMapIosKey: string,
  aMapAndroidKey: string,
  aMapWebKey: string,
  tencentId: string,
  wxAppId: string,
  wxScope: string,
  wxState: string,
  wxSecret: string,
  appVersion: string,
  isEmulator: boolean,
  isDev: boolean,
  mobStatIosKey: string,
  mobStatAndroidKey: string,
  imAppId: number,
  imAccountType: string,
  isLocalTest: boolean
};

const config: Config = {

  // 排名搜索的类型
  RANK_SEARCH_TYPE: {
    // // 用户名
    // USERNAME: "username",
    // // 大学
    // COLLEGE: "college",
    // // 专业
    // MAJOR: "major"
    // 用户名
    USERNAME: "same_type",
    // 大学
    COLLEGE: "same_type",
    // 专业
    MAJOR: "same_type",
    ALL: "same_type"
  },
  // 排名共用页面类型的名字
  SCREEN_TYPE: {
    // 粉丝页面
    FANS: "fans",
    // 关注页面
    FOLLOW: "follow"
  },
  aMapIosKey: "9ac8416ff17d6e8eb1b0278016f1bd1b", // 5d415357707916e372bbd840e516302d
  aMapAndroidKey: "6c83ff10dbf0e8c83491cb2577c4ee78", // ea4160a33ee871b4c11e7ea3ee2bb771
  aMapWebKey: "893539ae7bae9d63af2ef3de204bb71c",
  tencentId: "101510820",
  wxAppId: "wxcd38501602fe9a31",
  wxScope: "snsapi_userinfo", //"snsapi_base",
  wxState: "elephantapp",
  wxSecret: "3218c487a30001b02bc948a8e6e8484c",
  projName: "example",
  appVersion: "20181204.1.0",
  version: "1.0.2",
  socketServer: isRelease ? "http://127.0.0.1:30009" : "",
  isDev: isRelease ? false : true, //false, //isDevelopment,
  imAppId: isRelease ? 1400138709 : 1400141327,
  imAccountType: isRelease ? "38017" : "38729", //"38017", //"38729", //"38017",
  mobStatIosKey: "8f0d9cc340", // "3c69e5bd5f",
  mobStatAndroidKey:  "7dedbf066a", // "66e71bb78a",
  devTabIndex: 2, // 0首页 1排名 2成长 3我的
  //   startup: {
  //     narrow: undefined,
  //     anchor: 0,
  //     notification: undefined,
  //   },
  compatibilityUrl: null, //'http://222.211.90.70/', //"https://zulipchat.com/compatibility",
  //   messagesPerRequest: 50,
  //   scrollCallbackThrottle: 250,
  //   messageListThreshold: 250,
  enableReduxLogging: !isRelease && !!global.btoa,
  enableReduxSlowReducerWarnings: !isRelease && !!global.btoa,
  //enableSentry: !isDevelopment && !isEmulator, // 需要 react-native link react-native-sentry  参考配置https://blog.csdn.net/u013718120/article/details/78712487
  enableSentry: isRelease ? true : false,

  //   enableWebViewErrorDisplay: true,
  //   enableNotifications: !isEmulator,
  slowReducersThreshold: 5,
  isEmulator: isEmulator,
  isLocalTest: false,
  sentryKey: "https://be210c79f6ee46be9efd264ea13e36b8@sentry.shandudata.com/5", // HOSTS.SENTRYKEY,
  //old
  //"http://84377d7f9c754926a94cbc016e304ef6:dc865d209e6f486abb21a665b189ee3d@sentry.pinbot.me/32", // 此处需要配置sentrykey
  enableErrorConsoleLogging: isRelease ? true : false,
  //  trackServerEvents: [
  //     // 'custom_profile_fields', // ???
  //     'delete_message',
  //     // 'hotspots', // ???
  //     'message',
  //     'muted_topics',
  //     // 'pointer', // we are not interested
  //     'presence',
  //     'reaction',
  //     // 'realm_bot', // ???
  //     // 'realm_domains', // ???
  //     'realm_emoji',
  //     'realm_filters',
  //     'realm_user',
  //     'stream',
  //     'subscription',
  //     'typing',
  //     'update_message',
  //     'update_message_flags',
  //     'update_display_settings',
  //     'update_global_notifications',
  //     'user_group',
  //   ],
  //   serverDataOnStartup: [
  //     'alert_words',
  //     'message',
  //     'muted_topics',
  //     'presence',
  //     'realm',
  //     'realm_emoji',
  //     'realm_filters',
  //     'realm_user',
  //     'realm_user_groups',
  //     'subscription',
  //     'update_display_settings',
  //     'update_global_notifications',
  //     'update_message_flags',
  //   ],
  //, "homeLiveCourseList", "homeNewsList"
  storeKeys: ["user", "loginType", "isFirstStart", "homeLiveCourseList", "homeNewsList"],
  // storeKeys: ["user", "loginType", "isFirstStart"],
  cacheKeys: []
  // storeKeys: ['accounts', 'drafts', 'outbox', 'settings'],
  // cacheKeys: ['messages', 'mute', 'realm', 'subscriptions', 'unread'],
};
export default config;
