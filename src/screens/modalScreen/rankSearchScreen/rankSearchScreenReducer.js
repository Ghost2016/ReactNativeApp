/* @flow */

import {
  RANK_SEARCH_USER_BY_NAME,
  RANK_SEARCH_USER_BY_MAJOR,
  RANK_SEARCH_USER_BY_COLLEGE
} from "@src/actionConstants";

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case RANK_SEARCH_USER_BY_NAME:
      return state;
    case RANK_SEARCH_USER_BY_MAJOR:
      return state;
    case RANK_SEARCH_USER_BY_COLLEGE:
      return state;
    default:
      return state;
  }
};
