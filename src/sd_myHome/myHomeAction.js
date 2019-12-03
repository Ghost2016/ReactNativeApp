// /* @flow */
// import type { GetState, Dispatch, Narrow, Topic, InitTopicsAction } from '../types';
import { getTaskReadList, getOtherUserReadList } from "../api";

export const getTaskReadListAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getTaskReadList(params, res => {
    if (res.status === "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getOtherUserReadListAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getOtherUserReadList(params, res => {
    if (res.status === "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};
