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
import { Touchable } from "../index";
import {rendererWithStoreTestNoRender} from "@utils/tests"
import SDButton from "../SDButton";
import * as sdStyles from "@src/styles";
import { CSS } from "@common/SDCSS";


const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {
    //userJobPlanList: [],
};

//./node_modules/jest/bin/jest.js -u ./src/sd_components/__tests__/SDButton-enzyme-test.js

describe('[enzyme]SDButton组件', () => {

  it("按钮点击测试", () => {
    const onPressRegister = sinon.spy();
    const wrapper = shallow(
        <SDButton
            style={{
                zIndex: 7,
                backgroundColor: sdStyles.SDMainColor,
                borderRadius: CSS.pixel(50),
                width: CSS.pixel(550),
                position: "relative",
                top: 0,
                marginTop: 0 //CSS.pixel(40)
            }}
            btnStyle={{
                fontSize: CSS.textSize(30),
                color: sdStyles.SDFontColorMain
            }}
            title="完成注册"
            onPress={onPressRegister}
            />,
        { context: { store: mockStore(initialState) } },
    );
    //expect(wrapper).toMatchSnapshot();
    const render = wrapper.dive();
    //console.log("find", render)
    render.simulate('press');
    expect(render).toMatchSnapshot();
    expect(onPressRegister.calledOnce).toBe(true);
    //console.log("find", onPressRegister.getCall(0).args)
    expect(onPressRegister.getCall(0).args[0]).toBe('完成注册');

  });

  it("disabled按钮点击测试", () => {
    const onPressRegister = sinon.spy();
    //const spy = sinon.spy(SDButton.prototype, 'componentDidMount');
    const wrapper = shallow(
        <SDButton
            disabled={true}
            title="完成注册"
            onPress={onPressRegister}
            />,
        { context: { store: mockStore(initialState) } },
    );
    const render = wrapper.dive();
    render.simulate('press');
    expect(render).toMatchSnapshot();
    expect(wrapper.prop('disabled')).toBe(true);
    expect(onPressRegister.calledOnce).toBe(false);
  });
});

