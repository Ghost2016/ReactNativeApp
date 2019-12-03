import "react-native";
import React from "react";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";
import {
  View,
  Text,
  Platform,
} from "react-native";
import store from "@src/boot/store";
//import { ProviderCreator } from "../index"
import { rendererWithStoreTest } from "@utils/tests"

import SDTabs2 from "@sd_components/SDTabs2";
import * as sdStyles from "@src/styles";
import { CSS } from "@common/SDCSS";

//./node_modules/jest/bin/jest.js ./src/sd_components/__tests__/SDTabs2-test.js

describe('测试SDTabs组件', () => {
  it("tab标题展示没问题", () => {
    const tree = rendererWithStoreTest(<SDTabs2
            tabTitles={["账号密码登录", "手机号快速登录"]}
            page={0}
            underLineWidth={CSS.pixel(90)}
            onChangeTab={()=>console.log('-')}
            style={{
              marginTop:
                  Platform.OS == "ios"
                    ? CSS.pixel(80, true)
                    : CSS.pixel(50, true),

            }}
            tabWidthStyle={{
              width: CSS.pixel(1280),
              borderWidth: 0,
              borderColor: '#f00',
            }}
          >
            <View><Text>111</Text></View>
            <View><Text>222</Text></View>
          </SDTabs2>).toJSON();

    expect(tree).toMatchSnapshot();

  });


});
