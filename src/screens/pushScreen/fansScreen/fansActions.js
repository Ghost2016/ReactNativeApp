
import {
  getFans,
} from "@api/index";
import {
  ADD_FAN,
  DELETE_FAN,
  UPDATE_FANS,
  ADD_FANS
} from '../../../actionConstants';

// 获取粉丝列表----自己
export const getFansAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  return getFans(params, 
    res => {
      if (res.status == "ok") {
        if (params.page === 1) {
          dispatch({
            type: UPDATE_FANS,
            fans: res.results
          })
        } else {
          dispatch({
            type: ADD_FANS,
            fans: res.results
          })
        }
      }
    }
  )
};

// 获取粉丝列表
export const getOthersFansAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  return getFans(params, res => {
    // if (res.status == "ok") {
    callBack && callBack instanceof Function && callBack(res);
    // }
  });
};