import ReactNative, {
  Dimensions,
  PixelRatio,
  Platform,
  StatusBar
} from "react-native";

const screenW = Dimensions.get("window").width;
const screenH = Dimensions.get("window").height;

const fontScale = ReactNative.PixelRatio.getFontScale();
const pixelRatio = ReactNative.PixelRatio.get();
const r2 = 2;
const w2 = 750 / r2;
const h2 = 1334 / r2;
const scale = Math.min(screenH / h2, screenW / w2); //获取缩放比例

const height30 = (30 / 1334) * screenH;
const width30 = (30 / 750) * screenW;

var PlatformInfo = {
  sizeObj: Dimensions.get("window"),
  pixels: 2,
  getSize: () => Dimensions.get("window"),
  width: () => {
    return PlatformInfo.sizeObj.width;
  },
  heightWithStatusBar: () => {
    return PlatformInfo.sizeObj.height;
  },
  height: () => {
    return (
      PlatformInfo.sizeObj.height -
      (Platform.OS === "android" ? StatusBar.currentHeight : 0)
    );
  },
  text: size => {
    size = Math.round(((size * scale + 0.5) * pixelRatio) / fontScale);
    return size / r2;
  },
  // pixel: (px, ui = 750) => {
  pixel: (size, other) => {
    // other = false;
    // if (!PlatformInfo.pixels) {
    //   PlatformInfo.pixels = PixelRatio.get();
    // }
    // if (other) {
    //   size = size / (750 / (screenW * pixelRatio));
    // }
    if (other) {
      if (size == 30) {
        return height30;
      }
      return (size / 1334) * screenH;
    }
    if (size == 30) {
      return width30;
    }
    return (size / 750) * screenW;
  },
  // 适配字体大小
  textSize: size => {
    return (size / 750) * screenW;
  }
};

var CSS = {
  pixel: PlatformInfo.pixel,
  width: PlatformInfo.width,
  height: PlatformInfo.height,
  text: PlatformInfo.text,
  textSize: PlatformInfo.textSize,
  heightWithStatusBar: PlatformInfo.heightWithStatusBar
};

export { CSS, PlatformInfo, pixelRatio };
