// /* @flow */
// import type { GetState, Dispatch, Narrow, Topic, InitTopicsAction } from '../types';
import { calcSalary } from "../../../api";

import { calcSalaryModel } from "../../../types";
// import { INIT_TOPICS } from '../actionConstants';

const getDataSuccess = (type, result, callBack) => {
  return {
    type: type,
    result,
    callBack: callBack
  };
};

export const calcSalaryAction = (
  params: calcSalaryModel,
  callBack: () => void
) => async (dispatch, getState) => {
  calcSalary(params, res => {
    dispatch(getDataSuccess("GET_CALCSALARY", res, callBack));
  });
};
