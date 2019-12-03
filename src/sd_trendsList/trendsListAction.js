// /* @flow */

import { getDynamicList, createDynamic } from "../api";

// 获取动态列表
export const getDynamicListAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  getDynamicList(params, res => {
    if (res.status === "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
      dispatch({
        type: "GET_TRENDSLIST",
        json: res
      });
    }
  });
};

export const getOffsetDynamicListAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  getDynamicList(params, res => {
    if (res.status === "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
      dispatch({
        type: "GET_TRENDSLIST_OFFSET",
        json: res
      });
    }
  });
};

// 创建动态列表
export const createDynamicAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await createDynamic(params, res => {
    if (res.status === "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
      dispatch({
        type: "CREATE_TRENDSLIST",
        json: res.results
      });
    }
  });
};

export const getOtherUserDynamicListAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  getDynamicList(params, res => {
    if (res.status === "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
      dispatch({
        type: "GET_OTHERUSERTRENDSLIST",
        json: res
      });
    }
  });
};

export const getOtherUserOffsetDynamicListAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  getDynamicList(params, res => {
    if (res.status === "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
      dispatch({
        type: "GET_OTHERUSERTRENDSLIST_OFFSET",
        json: res
      });
    }
  });
};
