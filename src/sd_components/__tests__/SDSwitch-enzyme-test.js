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
import SDSwitch from "@sd_components/SDSwitch";
//import * as sdStyles from "@src/styles";
//import { CSS } from "@common/SDCSS";


const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {
    //userJobPlanList: [],
};

//./node_modules/jest/bin/jest.js -u ./src/sd_components/__tests__/SDSwitch-enzyme-test.js


const toggleSwitchActionSpy = sinon.spy();

describe('[enzyme]SDSwitch组件', () => {
  it("[enzyme]切换的时候", () => {
    const wrapper = shallow(
        <SDSwitch toggleSwitch={toggleSwitchActionSpy}
        switchValue={true} />,
        { context: { store: mockStore(initialState) } },
    );
    //expect(wrapper).toMatchSnapshot();
    const render = wrapper.dive();
    render.find('Switch').forEach(child => {
        child.simulate('valueChange');
    });
    expect(render).toMatchSnapshot();
    expect(toggleSwitchActionSpy.calledOnce).toBe(true);
  });
});

