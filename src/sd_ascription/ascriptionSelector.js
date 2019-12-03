/* @flow */
import { createSelector } from "reselect";
import { getSchoolName, getSchoolLevel, getMajor } from "../directSelectors";

// 获取主页所属学校归属信息
export const getAscription = createSelector(
  [getSchoolName, getSchoolLevel, getMajor],
  (schoolName, schoolLevel, major) => {
    return schoolName + "  " + schoolLevel + "·" + major;
  }
);
