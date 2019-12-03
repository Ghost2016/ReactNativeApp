


import {
  UPDATE_NEWS_OF_WATCHES,
  ADD_NEWS_OF_WATCHES
} from '../../../actionConstants';
import { parseNewsOfWatches } from "@utils/user";

function _updata_news_of_watches(state, action) {
  return parseNewsOfWatches(action.news)
}

function _add_news_of_watches(state, action) {
  return state
}
// 动态个数
export const newsOfWatches = (
  state = [],
  action = {}
) => {
  switch (action.type) {
    case UPDATE_NEWS_OF_WATCHES:
      return _updata_news_of_watches(state, action)
    case ADD_NEWS_OF_WATCHES:
      return _add_news_of_watches(state, action)
    default:
      return state;
  }
};