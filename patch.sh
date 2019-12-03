# rm ./rmc-tabs/fix.patch
# rm ./search-bar/fix.patch
# rm ./themes/fix.patch
# rm ./tabs/fix.patch
# rm ./tabs/style/fix.patch

diff -u ./node_modules/rmc-tabs/lib/DefaultTabBar.native.js ./patch/rmc-tabs/DefaultTabBar.native.js > ./patch/rmc-tabs/fix.patch
diff -u ./node_modules/antd-mobile/lib/search-bar/index.native.js ./patch/search-bar/index.native.js > ./patch/search-bar/fix.patch
diff -u ./node_modules/antd-mobile/lib/style/themes/default.native.js ./patch/themes/default.native.js > ./patch/themes/fix.patch
diff -u ./node_modules/antd-mobile/lib/tabs/index.native.js ./patch/tabs/index.native.js > ./patch/tabs/fix.patch
diff -u ./node_modules/antd-mobile/lib/tabs/style/index.native.js ./patch/tabs/style/index.native.js > ./patch/tabs/style/fix.patch
diff -u ./node_modules/antd-mobile/lib/grid/index.native.js ./patch/ant-mobile-grid/index.native.js > ./patch/ant-mobile-grid/fix.patch
diff -u ./node_modules/antd-mobile/lib/accordion/style/index.native.js ./patch/accordion/style/index.native.js > ./patch/accordion/style/fix.patch
diff -u ./node_modules/antd-mobile/lib/input-item/index.js ./patch/ant-mobile-inputItem/index.native.js > ./patch/ant-mobile-inputItem/fix.patch
diff -u ./node_modules/antd-mobile/lib/date-picker-view/date-picker-view.js ./patch/date-picker-view/date-picker-view.js > ./patch/date-picker-view/fix.patch
#diff -u ./node_modules/react-native/Libraries/Text/Text.js ./patch/react-native-text/index.js > ./patch/react-native-text/fix.patch
diff -u ./node_modules/rmc-picker/lib/Popup.native.js ./patch/rmc-picker/Popup.native.js > ./patch/rmc-picker/fix.patch
diff -u ./node_modules/react-native-safe-area/lib/withSafeArea.js ./patch/react-native-safe-area-withSafeArea/withSafeArea.js > ./patch/react-native-safe-area-withSafeArea/fix.patch

diff -u ./node_modules/react-native-highlight-words/index.js ./patch/react-native-highlight-words/index.js > ./patch/react-native-highlight-words/fix.patch

# diff -u ./node_modules/react-native-snap-carousel/src/carousel/Carousel.js ./patch/react-native-snap-carousel/Carousel.js > ./patch/react-native-snap-carousel/fix.patch

patch -b ./node_modules/rmc-tabs/lib/DefaultTabBar.native.js ./patch/rmc-tabs/fix.patch
patch -b ./node_modules/antd-mobile/lib/search-bar/index.native.js ./patch/search-bar/fix.patch
patch -b ./node_modules/antd-mobile/lib/style/themes/default.native.js ./patch/themes/fix.patch
patch -b ./node_modules/antd-mobile/lib/tabs/index.native.js ./patch/tabs/fix.patch
patch -b ./node_modules/antd-mobile/lib/tabs/style/index.native.js ./patch/tabs/style/fix.patch
patch -b ./node_modules/antd-mobile/lib/grid/index.native.js ./patch/ant-mobile-grid/fix.patch
patch -b ./node_modules/antd-mobile/lib/accordion/style/index.native.js ./patch/accordion/style/fix.patch
patch -b ./node_modules/antd-mobile/lib/input-item/index.js ./patch/ant-mobile-inputItem/fix.patch
patch -b ./node_modules/antd-mobile/lib/date-picker-view/date-picker-view.js ./patch/date-picker-view/fix.patch
#patch -b ./node_modules/react-native/Libraries/Text/Text.js ./patch/react-native-text/fix.patch
patch -b ./node_modules/rmc-picker/lib/Popup.native.js ./patch/rmc-picker/fix.patch
patch -b ./node_modules/react-native-safe-area/lib/withSafeArea.js ./patch/react-native-safe-area-withSafeArea/fix.patch
patch -b ./node_modules/react-native-highlight-words/index.js ./patch/react-native-highlight-words/fix.patch

# patch -b ./node_modules/react-native-snap-carousel/src/carousel/Carousel.js ./patch/react-native-snap-carousel/fix.patch

#selectDate样式
diff -u ./node_modules/antd-mobile/lib/date-picker/index.native.js ./patch/date-picker/index.native.js > ./patch/date-picker/fix.patch

#carousel 滑动
rm -rf ./node_modules/react-native-snap-carousel/src/carousel/
mkdir -p ./node_modules/react-native-snap-carousel/src/carousel
cp -R ./patch/react-native-snap-carousel/* ./node_modules/react-native-snap-carousel/src/carousel

#wechat ios
rm -rf ./node_modules/react-native-wechat/ios/RCTWeChat.h
cp -R ./patch/react-native-wechat/_ios/RCTWeChat.h ./node_modules/react-native-wechat/ios
rm -rf ./node_modules/react-native-wechat/ios/RCTWeChat.m
cp -R ./patch/react-native-wechat/_ios/RCTWeChat.m ./node_modules/react-native-wechat/ios

#wechat android
rm -rf ./node_modules/react-native-wechat/android/src/main/java/com/theweflex/react/WeChatModule.java
cp -R ./patch/react-native-wechat/_android/WeChatModule.java ./node_modules/react-native-wechat/android/src/main/java/com/theweflex/react/WeChatModule.java

#wechat index.js
rm -rf ./node_modules/react-native-wechat/index.js
cp -R ./patch/react-native-wechat/index.js ./node_modules/react-native-wechat/index.js

# accordion assets
rm -rf ./node_modules/antd-mobile/lib/accordion/style/assets/*
cp -R ./patch/accordion/style/assets/* ./node_modules/antd-mobile/lib/accordion/style/assets

rm -rf ./node_modules/antd-mobile/lib/accordion/style/index.native.js
cp -R ./patch/accordion/style/index.native.js ./node_modules/antd-mobile/lib/accordion/style/index.native.js