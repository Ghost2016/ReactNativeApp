import { getAllDynamic } from "../../../api";
import {
  UPDATE_NEWS_OF_WATCHES,
  ADD_NEWS_OF_WATCHES,
  RESET_DYNAMIC_COUNT
} from '../../../actionConstants';

export const getAllDynamicAction = (
  params: object,
  // callBack: () => void
) => (dispatch, getState) => {

  return getAllDynamic(params, res => {
    // 请求第一页数据
    if(!params.id__lt) {
      dispatch({
        type: UPDATE_NEWS_OF_WATCHES,
        news: res.results
      })
      dispatch({
        type: RESET_DYNAMIC_COUNT
      })
    } else {
      dispatch({
        type: ADD_NEWS_OF_WATCHES,
        news: res.results
      })
    }
  })
};
