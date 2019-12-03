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
import RegisterScreenAndroid from "../RegisterScreen-android";
//import * as sdStyles from "@src/styles";
//import { CSS } from "@common/SDCSS";

import {
    login,
    logout,
    findPassword,
    tokenCheck,
    getUserInfo,
    signup
  } from "@api";
import { setAppToken, setAppNewToken, cleanAppToken } from "@boot/actions";
import store from "@boot/store";
import { NULL_USERSTATE } from "@src/nullObjects";
import * as HOSTS from "@src/host";

const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {
    //userJobPlanList: [],
    user: NULL_USERSTATE,
};

//./node_modules/jest/bin/jest.js -u ./src/screens/registerScreen/__tests__/register-android-enzyme-test.js

describe('[enzyme]测试APP注册', () => {
    /* let store = mockStore(initialState);
    beforeEach(() => {
        store.clearActions();
    }); */

  it("[enzyme]检查组件渲染", () => {
    const wrapper = shallow(rendererWithStoreTestNoRender(<RegisterScreenAndroid  />));
    /* const wrapper = shallow(
        <RegisterScreen  />,
        { context: { store: store } },
    ); */
    expect(wrapper.dive()).toMatchSnapshot();
    //wrapper.setProps({ hasGoal: true, goalName: "软件工程师" });
    //expect(wrapper.dive()).toMatchSnapshot();
  });

  it('测试reducer dispatch', async () => {
    //const _setAppToken = sinon.spy(setAppToken);
    const wrapper = shallow(rendererWithStoreTestNoRender(<RegisterScreenAndroid  />));
    const trg = wrapper.instance()
    //console.log("trg==", trg)
    //console.log("store==", store)
    //const errText = "{\"count\":16,\"current_page\":1,\"per_page\":10,\"total_page\":2,\"results\":[],\"status_code\":500,\"status\":\"kok\",\"token\":\"123456\"}";
    const errText = "{\"count\":16,\"current_page\":1,\"per_page\":10,\"total_page\":2,\"results\":[],\"status_code\":500,\"status\":\"kok\",\"token\":\"123456\"}";
    const params = {
        bodyUsed:true,
        headers:{map: {}},
        ok:true,
        status:200,
        statusText:undefined,
        type:"default",
        url:`${HOSTS.BEAT}/api/sd/v1/auth/signup/`,
        _bodyInit:errText,
        _bodyText:errText,
     };
    fetch.mockResponseSuccess(JSON.stringify(params));
    const res = await signup({
        phone: "18800001111",
        password: "cccccc",
        code: "3125",
        nickname: "TestName",
        type: "phone"
      })
    const results = JSON.parse(res._bodyText)
    console.log("res", results.token)
    await store.dispatch(setAppToken(results.token));

    //expect(_setAppToken.calledOnce).toBe(true)
    setTimeout(() => {
        //store没有getActions这个函数
        //console.log("state getActions", store.getActions())
        //expect(store.getActions()[0].type).toBe("SETAPPTOKEN")
        //expect(store.getActions()[0].json).toBe("123456")
        //expect(store.getActions()).toMatchSnapshot();
        expect(store.getState()).toMatchSnapshot();
        console.log("state token", store.getState().user.token)
        expect(store.getState().user.token).toBe("123456");
    }, 500);
    //wrapper.find('#startDate').simulate('focus');
  });

})
