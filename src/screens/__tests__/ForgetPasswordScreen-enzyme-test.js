import "react-native";
import React from "react";
import sinon from "sinon";
import {
  View,
  Text,
  Platform,
} from "react-native";

import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import {rendererWithStoreTestNoRender} from "@utils/tests"
import ForgetPasswordScreen from "../ForgetPasswordScreen";
//import * as sdStyles from "@src/styles";
//import { CSS } from "@common/SDCSS";
import { _apiAction } from '@src/utils/funcs';
import {
    findPassword,
  } from "@api";
import { setAppToken, setAppNewToken, cleanAppToken } from "@boot/actions";
import store from "@boot/store";
import { NULL_USERSTATE } from "@src/nullObjects";

const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {
    //userJobPlanList: [],
    user: NULL_USERSTATE,
};

//./node_modules/jest/bin/jest.js -u ./src/screens/__tests__/ForgetPasswordScreen-enzyme-test.js

describe('[enzyme]测试APP找回密码', () => {

  it("[enzyme]检查组件渲染", () => {
    const wrapper = shallow(rendererWithStoreTestNoRender(<ForgetPasswordScreen  />));
    expect(wrapper.dive()).toMatchSnapshot();
    console.log("props", wrapper.props().children)
    //wrapper.setProps({ hasGoal: true, goalName: "软件工程师" });
    //expect(wrapper.dive()).toMatchSnapshot();
  });

  test.skip('测试接口返回封装函数_apiAction', async () => {
    const testApi = sinon.spy(()=>{
      return new Promise((resolve, reject)=>{
        setTimeout(() => {
          return resolve(true)
        }, 1000);
      })
    });

    const q = await _apiAction(testApi, {
        phone: '111111111111',
        code: '1234',
        password: 'xxxx2222'
      }, null)
      console.log("q", q)
      expect(testApi.calledOnce).toBe(true);
      /* .then(res => {
        expect(testApi.calledOnce).toBe(true);
      }).catch(res => {
        console.log("catch err", res)
      }) */


  });

})
