import {
  toggleWatch,
  getWatchedList,
  getRankStatistics
} from "@api/index";

import {
  ADD_WATCH,
  CANCEL_WATCH,
  UPDATE_WATCHES,
  ADD_WATCHES,
  UPDATE_RECOMMEND
} from '../../../actionConstants';

// 获取自己的关注人列表
export const getWatchedListAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getWatchedList(params, res => {
    if (res.status == "ok") {
      if (params.page === 1) {
        dispatch({
          type: UPDATE_WATCHES,
          watches: res.results
        })
      } else {
        dispatch({
          type: ADD_WATCHES,
          watches: res.results
        })
      }
    }
  });
};

// 获取其他人的关注列表
export const getOtherWatchedListAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getWatchedList(params, res => {
    callBack && callBack instanceof Function && callBack(res);
  });
};

// 关注与取消关注
export const toggleWatchAction = (
  params: object,
  callBack: () => void,
  extraInfo: object
) => async (dispatch, getState) => {
  return toggleWatch(params, res => {
    // console.warn(res)
    if (res.status === "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
      // 如果是取消关注
      if(res.results.indexOf('unwatch') > -1) {
        dispatch({
          type: CANCEL_WATCH,
          id: extraInfo.id
        })
        return
      }
      dispatch({
        type: ADD_WATCH,
        watch: extraInfo,
        id: extraInfo.id
      })
      return
    }
  });
};

// 获取推荐名单
export const getRecommentUserArrayAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  // console.warn(params)
  return getRankStatistics(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    if(res.status === 'ok') {
      dispatch({
        type: UPDATE_RECOMMEND,
        recommend: res.results
      })
    }
  });
};