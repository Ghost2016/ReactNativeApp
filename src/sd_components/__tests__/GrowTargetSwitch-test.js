import "react-native";
import React from "react";
// Note: test renderer must be required after react-native.
//import renderer from "react-test-renderer";

import {
  View,
  Text,
  Platform,
} from "react-native";
import store from "@src/boot/store";
//import { ProviderCreator } from "../index"
import { rendererWithStoreTest } from "@utils/tests"

import GrowTargetSwitch from "@sd_components/GrowTargetSwitch";
import * as sdStyles from "@src/styles";
import { CSS } from "@common/SDCSS";

//./node_modules/jest/bin/jest.js ./src/sd_components/__tests__/GrowTargetSwitch-test.js

describe('测试目标职位切换组件', () => {
  it("没有职位目标的时候", () => {
    const tree = rendererWithStoreTest(<GrowTargetSwitch
        hasGoal={false}
        goalName={""}
          />).toJSON();
    expect(tree).toMatchSnapshot();

  });

});
