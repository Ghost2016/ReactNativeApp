/* @flow */
import {
  Platform,
} from "react-native";
import { createSelector } from "reselect";
import { getSalaryTableData } from "../directSelectors";
import _ from 'lodash';

export const getSelectorSalaryTableData = createSelector(
  [getSalaryTableData],
  tableData => {
    return [];
    // return _.orderBy(tableData, ['avg_salary'], ['desc']).map((item, index) => {
    return tableData.map((item, index) => {
      return Object.assign(
        {},
        {
          id: index,
          rank: index + 1,
          //salary: "¥" + item.avg_salary,
          salary: item.median_salary ? "¥" + item.median_salary : "¥" + item.avg_salary,
          major: item.major
        }
      );
    })
    // const data = _.sortBy(tableData, item => {
    //   return parseInt(item.avg_salary);
    // }).
    // return ;
  }
);
