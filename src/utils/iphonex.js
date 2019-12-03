import { Dimensions, Platform } from "react-native";

export function isIphoneX() {
  let dimen = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    // iphonex / iphonexR / iphonex S / iphonex SMax
    // 
    (
      (dimen.height === 812 || dimen.width === 812) || 
      (dimen.height === 896 || dimen.width === 896)
    )
  );
}

export function isAndroidX() {
  let dimen = Dimensions.get("window");
  //console.warn("isAndroidX", dimen.height)
  return (
    Platform.OS === "android" &&
    (dimen.height === 812 || dimen.width === 812)
  );
}

export function ifIphoneX(iphoneXStyle, regularStyle) {
  if (isIphoneX()) {
    return iphoneXStyle;
  } else {
    return regularStyle;
  }
}
