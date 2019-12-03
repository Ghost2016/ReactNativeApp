/* @flow */
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import StylesProvider from '../boot/StylesProvider';
import store from '../boot/store';

import StoreProvider from "@src/boot/StoreProvider";
//import StylesProvider from "@src/boot/StylesProvider";
import NavProvider from "@src/nav/NavProvider";

let Refs = {};

export const rendererWithStoreTestNoRender = (WrappedComponent: React$Element<any>): React$Element<any> =>
  (<Provider store={store}>
                    <StoreProvider>
                        <StylesProvider>
                            <NavProvider refs={Refs} navigator={{}}>{WrappedComponent}</NavProvider>
                        </StylesProvider>
                </StoreProvider></Provider>);

export const rendererWithStoreTest = (WrappedComponent: React$Element<any>): ReactTestRenderer =>
  renderer.create(<Provider store={store}>
                    <StoreProvider>
                        <StylesProvider>
                            <NavProvider refs={Refs} navigator={{}}>{WrappedComponent}</NavProvider>
                        </StylesProvider>
                </StoreProvider></Provider>);

export const rendererWithStore = (WrappedComponent: React$Element<any>): ReactTestRenderer =>
  renderer.create(<Provider store={store}>{WrappedComponent}</Provider>);

export const rendererWithStyle = (WrappedComponent: React$Element<any>): ReactTestRenderer =>
  renderer.create(<StylesProvider>{WrappedComponent}</StylesProvider>);

export const rendererWithStoreAndStyle = (
  WrappedComponent: React$Element<any>,
): ReactTestRenderer =>
  renderer.create(
    <Provider store={store}>
      <StylesProvider>{WrappedComponent}</StylesProvider>
    </Provider>,
  );
