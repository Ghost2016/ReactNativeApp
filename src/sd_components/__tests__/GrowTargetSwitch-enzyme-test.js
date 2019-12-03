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
import GrowTargetSwitch from "@sd_components/GrowTargetSwitch";
//import * as sdStyles from "@src/styles";
//import { CSS } from "@common/SDCSS";


const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {
    userJobPlanList: [],
};

//./node_modules/jest/bin/jest.js -u ./src/sd_components/__tests__/GrowTargetSwitch-enzyme-test.js

describe('[enzyme]测试目标职位切换组件', () => {
  it("[enzyme]没有职位目标的时候", () => {
    const wrapper = shallow(rendererWithStoreTestNoRender(
        <GrowTargetSwitch hasGoal={false}
            goalName={""} />),
        { context: { store: mockStore(initialState) } },
    );
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ hasGoal: true, goalName: "软件工程师" });
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it("[enzyme]有职位目标的时候", () => {
    const wrapper = shallow(rendererWithStoreTestNoRender(<GrowTargetSwitch hasGoal={true}
    goalName={"软件工程师"} />),
        { context: { store: mockStore(initialState) } },
    );
    expect(wrapper.dive()).toMatchSnapshot();
    wrapper.setProps({ hasGoal: false, goalName: "" });
    expect(wrapper.dive()).toMatchSnapshot();

    //测试reducer?
    /* wrapper.setContext({
        userJobPlanList: [
            {id: 41, path: null, position: {
                created_time:"2018-07-31T00:03:43.873394",
                description:"会计师",
                id:5,
                industry:10,
                industry_title:"金融",
                is_valid:true,
                order:1,
                title:"会计师",
            }, is_default: false, created_time: "2018-08-02T20:25:57.389969"},
            {id: 39, path: null, position: {
                created_time:"2018-07-30T11:35:37.079481",
                description:"软件工程师",
                id:1,
                industry:2,
                industry_title:"互联网",
                is_valid:true,
                order:1,
                title:"软件工程师",
            }, is_default: false, created_time: "2018-08-02T17:12:01.367731"},
            {id: 37, path: false, position: {
                created_time:"2018-07-31T00:02:04.799085",
                description:"前端工程师",
                id:2,
                industry:2,
                industry_title:"互联网",
                is_valid:true,
                order:0,
                title:"前端工程师",
            }, is_default: true, created_time: "2018-08-01T15:13:18.874765"}
        ]
    }); */
    //const render = wrapper.dive();
    //expect(render).toMatchSnapshot();
  });


});
