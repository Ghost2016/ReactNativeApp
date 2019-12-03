// /* @flow */
// import type { GetState, Dispatch, Narrow, Topic, InitTopicsAction } from '../types';
import {
  biSuggest,
  updateBaseInfo,
  addEducation,
  getVerifyCode,
  signup
} from "../../api";
// import { INIT_TOPICS } from '../actionConstants';

export const biSuggestAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  return biSuggest(params, res => {
    // callBack(res);
  });
};

export const updateBaseInfoAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return updateBaseInfo(params, res => {
    callBack && callBack instanceof Function && callBack(res);
    dispatch({
      type: "UPDATE_USER_INFO",
      json: res.results
    });
  });
};

export const getVerifyCodeAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getVerifyCode(params, res => {
    callBack(res);
  });
};

export const signupAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  return signup(params, res => {})
};
