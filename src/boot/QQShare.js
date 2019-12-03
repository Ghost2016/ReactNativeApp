import { NativeModules, Platform } from "react-native";
const { QQModule } = NativeModules;

export default {
    init: appId => QQModule.init(appId),
    login: () => QQModule.login(),
    isQQInstalled: () => QQModule.isQQInstalled(),
    shareToQQ: params => QQModule.shareToQQ(params),
    shareToQZone: params => QQModule.shareToQZone(params)
};
