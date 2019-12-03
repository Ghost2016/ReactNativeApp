
import "react-native";
import React from "react";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";
//import store from "../../boot/store";
//import { changeAppRoot } from "../boot/actions";
import { _onPressGetCode } from '../../utils/funcs';
//import { ProviderCreator } from "../index"
import { rendererWithStore } from "../../utils/tests"
//import LoginMainScreen from "../LoginMainScreen"
import Dot from "../../sd_components/Dot"
//import GrowReadOk from "../../sd_components/GrowReadOk"

//./node_modules/jest/bin/jest.js -u ./src/screens/__tests__/login-test.js

describe('测试登录逻辑', () => {
  it("登录界面OK", () => {
    const tree = rendererWithStore(<Dot />).toJSON();
    expect(tree).toMatchSnapshot();
    //renderer.create(ProviderCreator(LoginMainScreen));
  });

  /* test('测试验证码倒计时正确', () => {
    expect(typeof _onPressGetCode).toEqual("function");
  }); */



});
