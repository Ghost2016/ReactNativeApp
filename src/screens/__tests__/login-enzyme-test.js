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
import LoginMainScreen from "../LoginMainScreen";
//import * as sdStyles from "@src/styles";
//import { CSS } from "@common/SDCSS";

import {
    login,
    logout,
    findPassword,
    tokenCheck,
    getUserInfo
  } from "@api";
  import { setAppToken, setAppNewToken, cleanAppToken } from "@boot/actions";
import * as HOSTS from "@src/host";

const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {
    //userJobPlanList: [],
};

//./node_modules/jest/bin/jest.js -u ./src/screens/__tests__/login-enzyme-test.js

describe('[enzyme]测试APP登录', () => {
    const store = mockStore(initialState);
    beforeEach(() => {
        store.clearActions();
    });

  it("[enzyme]检查组件渲染", () => {
    const wrapper = shallow(
        <LoginMainScreen  />,
        { context: { store: store } },
    );
    expect(wrapper).toMatchSnapshot();
    //wrapper.setProps({ hasGoal: true, goalName: "软件工程师" });
    //expect(wrapper.dive()).toMatchSnapshot();
  });

  it('attempt with correct password succeeds', async () => {

    const params = {
        bodyUsed:true,
        headers:{map: {}},
        ok:true,
        status:200,
        statusText:undefined,
        type:"default",
        url:`${HOSTS.BEAT}/api/sd/v1/notification/`,
        _bodyInit:"{\"count\":16,\"current_page\":1,\"per_page\":10,\"total_page\":2,\"results\":[],\"status_code\":200,\"status\":\"ok\",\"token\":\"123456\"}",
        _bodyText:"{\"count\":16,\"current_page\":1,\"per_page\":10,\"total_page\":2,\"results\":[],\"status_code\":200,\"status\":\"ok\",\"token\":\"123456\"}"
     };
    fetch.mockResponseSuccess(JSON.stringify(params));
    const res = await login({
        phone: 'test',
        password: '11',
        type: "phone"
      })
    const results = JSON.parse(res._bodyText)
    console.log("res", results.token)
    await store.dispatch(setAppToken(results.token));
    expect(store.getActions()).toMatchSnapshot();
  });

})
