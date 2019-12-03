import { Platform } from "react-native";
import { trendsModel } from "../types";
type PageResult = {
  count: number,
  current_page: number,
  per_page: number,
  total_page: number,
  results: trendsModel[]
};
export const trendsList = (
  state: PageResult = {
    count: 0,
    current_page: 0,
    per_page: 0,
    total_page: 0,
    results: []
  },
  action = {}
) => {
  switch (action.type) {
    case "GET_TRENDSLIST":
      return action.json;
    case "CREATE_TRENDSLIST":
      return Object.assign({}, state, {
        results: [action.json].concat(state.results),
        count: state.count + 1
      });
    case "GET_TRENDSLIST_OFFSET":
      return Object.assign({}, state, {
        ...action.json,
        results: state.results.concat(action.json.results)
          // Platform.OS == "android"
          //   ? state.results.concat(action.json.results.slice(0, 4))
          //   : state.results.concat(action.json.results.slice(0, 2))
      });
    default:
      return state;
  }
};

export const otherUserTrendsList = (
  state: PageResult = {
    count: 0,
    current_page: 0,
    per_page: 0,
    total_page: 0,
    results: []
  },
  action = {}
) => {
  switch (action.type) {
    case "GET_OTHERUSERTRENDSLIST":
      return action.json;
    case "GET_OTHERUSERTRENDSLIST_OFFSET":
      return Object.assign({}, state, {
        ...action.json,
        results: state.results.concat(action.json.results)
          // Platform.OS == "android"
          //   ? state.results.concat(action.json.results.slice(0, 4))
          //   : state.results.concat(action.json.results.slice(0, 2))
      });
    default:
      return state;
  }
};
