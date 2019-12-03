/* @flow */
import { createSelector } from "reselect";

import { getUserId, getRecommendUserArray } from "../../../directSelectors";
// import { getUserAllInfo } from "@src/users/usersSelector";

export const getRecommendUserArrayWithoutMe = createSelector(
  getRecommendUserArray,
  getUserId,
  (recommendUserArray, userId) => {
    let userArray = [].concat(recommendUserArray.filter(item => item.id !== userId).map((item) => {
      return {
        ...item,
        withExtraInfo: false,
        withRankNumber: false,
        withFollow: true,
        withCompare: false
      }
    }))
    return userArray;
  }
);
