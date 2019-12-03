//jest.mock("Dimensions")

import "react-native";
import React from "react";
// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";
import store from "../boot/store";
import { changeAppRoot } from "../boot/actions";

// it("登录界面OK", () => {
//   // const tree = renderer.create(<LoginMainScreen />).toTree();
//   // expect(tree).toMatchSnapshot();
//   renderer.create(<LoginMainScreen />);
// });

function isStore(_store) {
  if (typeof _store === "object" && _store.getState instanceof Function) {
    return true;
  } else {
    return false;
  }
}

describe("测试能够初始化redux，并且启动应用", () => {
  test("初始化store成功", () => {
    expect(isStore(store)).toEqual(true);
  });

  test("初始化App root为空等待初始化", () => {
    expect(
      store && store.getState && store.getState().launchScreen
        ? store.getState().launchScreen
        : ""
    ).toEqual({ root: "" });
  });

  test("初始化App 修改launchRoot 进入启动页成功", () => {
    setTimeout(() => {
      expect(
        store && store.getState && store.getState().launchScreen
          ? store.getState().launchScreen
          : ""
      ).not.toEqual({ root: "" });
    }, 200);
  });

  test("如果是非第一此打开App, 如果没登录，则进入登录界面", () => {
    setTimeout(() => {
      store.dispatch(changeAppRoot("loginReal"));
      expect(
        store && store.getState && store.getState().launchScreen
          ? store.getState().launchScreen
          : ""
      ).toEqual({ root: "loginReal" });
    }, 200);
  });
});
