import { NativeModules, Platform } from "react-native";
const { MobStat } = NativeModules;

export default {
    setAppKey: key => MobStat && MobStat.setAppKey(Platform.select(key)),
    setDebugOn: on => MobStat && MobStat.setDebugOn(on),
    onPageStart: name => MobStat && MobStat.onPageStart(name),
    onPageEnd: name => MobStat && MobStat.onPageEnd(name)
};
