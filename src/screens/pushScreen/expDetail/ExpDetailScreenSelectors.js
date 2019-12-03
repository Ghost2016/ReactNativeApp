/* @flow */
import { createSelector } from "reselect";
import moment from "moment";
import { 
  getPowerTrendChartData,
  getSalaryIncreaseRecordChartData,
  getTaskTotalTrendChartData
  } from "../../../directSelectors";

export const getPowerTrendChartDataSelector = createSelector(
  getPowerTrendChartData,
  (powerTrendChartData) => {
    return powerTrendChartData.sort((d1,d2) => (d1.month)>(d2.month)).map(item => {
      return {
        x: moment(item.month).format('YYYY.MM'),
        // y: Math.round(item.number),
        y: item.number,
        key: item.month
      }
    })
  }
);

export const getSalaryIncreaseRecordChartDataSelector = createSelector(
  getSalaryIncreaseRecordChartData,
  (salaryIncreaseRecordChartData) => {
    return salaryIncreaseRecordChartData && salaryIncreaseRecordChartData.real.map((item, index) => {
      return {
        x: moment(item.year).format('YYYY年'),
        y: Math.round(item.number),
        key: item.year
      }
    })
  }
);

export const getTaskTotalTrendChartDataSelector = createSelector(
  getTaskTotalTrendChartData,
  (taskTotalTrendChartData) => {
    return taskTotalTrendChartData && taskTotalTrendChartData.slice(0,-1).map((item, index) => {
      return {
        // x: moment(startTimeTaskTotalTrendChart).add(index, 'day').format('M月D号'),
        // x: moment(startTimeTaskTotalTrendChart).add(index, 'day').format('M.D'),
        y: item
      }
    })
  }
);