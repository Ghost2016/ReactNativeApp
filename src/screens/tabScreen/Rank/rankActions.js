import {
  getRankStatistics,
  toggleWatch,
  getWatchedList,
  getRankChartData,
  getDynamicCount
} from "@api/index";
import {
  UPDATE_WATCHES,
  UPDATE_WATCHES_ALL,
  UPDATE_RANK_WATCHES,
  ADD_RANK_WATCHES,
  UPDATE_TOP,
  UPDATE_PEER,
  UPDATE_PROGRESS,
  UPDATE_DYNAMIC_COUNT,
  RESET_DYNAMIC_COUNT
} from '../../../actionConstants';

// 获取排名不同tab数据
export const getRankWatchStatisticsAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getRankStatistics(params, res => {
    // callBack && callBack instanceof Function && callBack(res);
    if (res.status == "ok") {
      // 如果是关注榜单
      if(params.type === 'watch') {
        // 如果是第1页
        if(params.page === 1) {
          dispatch({
            type: UPDATE_RANK_WATCHES,
            watches: res.results
          })
        } else {
          dispatch({
            type: ADD_RANK_WATCHES,
            watches: res.results
          })
        }
      }
    }
  });
};

// 获取排名不同tab数据
export const getRankStatisticsAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getRankStatistics(params, res => {
    callBack && callBack instanceof Function && callBack(res);
    if (res.status == "ok") {
      // 如果是关注榜单
      if(params.type === 'watch') {
        dispatch({
          type: UPDATE_WATCHES_ALL,
          watches: res.results
        })
      }
      // 如果是TOP榜单
      else if(params.type === 'top') {
        dispatch({
          type: UPDATE_TOP,
          tops: res.results
        })
      }
      // 如果是PEER榜单
      else if(params.type === 'peer') {
        dispatch({
          type: UPDATE_PEER,
          peers: res.results
        })
        // dispatch({
        //   type: UPDATE_PROGRESS,
        //   progress: res.results
        // })
      }
      // 如果是进步榜单
      else if(params.type === 'progress') {
        dispatch({
          type: UPDATE_PROGRESS,
          progress: res.results
        })
      }
    } else {
      return Promise.reject(res.msg)
    }
  });
};

// 获取排名chart数据
export const getRankChartDataAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getRankChartData(params, res => {
    callBack && callBack instanceof Function && callBack(res);
    if (res.status == "ok") {

    }
  });
};

// 获取动态个数
export const getRankDynamicCount = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getDynamicCount(params, res => {
    callBack && callBack instanceof Function && callBack(res);
    if (res.status == "ok") {
      dispatch({
        type: UPDATE_DYNAMIC_COUNT,
        dynamicCount: res.results
      })
    }
  });
};

export const resetRankDynamicCount = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  dispatch({
    type: RESET_DYNAMIC_COUNT
  })
};