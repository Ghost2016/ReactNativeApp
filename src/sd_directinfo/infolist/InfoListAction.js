import { getNews, getNewsDetail } from "@api/index";

export const getNewsAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  return getNews(params, res => {
    callBack && callBack(res);
  });
};

export const getNewsDetailAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getNewsDetail(params, res => {
    // callBack(res);
  });
};
