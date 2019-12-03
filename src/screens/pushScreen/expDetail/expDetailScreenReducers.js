


import {
  UPDATE_TASK_TOTAL_TREND_CHART_DATA,
  UPDATE_TASK_TOTAL_CHART_DATA,
  UPDATE_POWER_TREND_CHART_DATA,
  UPDATE_SALARY_INCREASE_RECORD_CHART_DATA,
} from '../../../actionConstants';

// 任务统计趋势图表数据
export const taskTotalTrendChartData = (
  state = [],
  action = {}
) => {
  switch (action.type) {
    case UPDATE_TASK_TOTAL_TREND_CHART_DATA:
      return action.data
    default:
      return state;
  }
};

// 任务统计趋势图表数据
export const taskTotalChartData = (
  state = [],
  action = {}
) => {
  switch (action.type) {
    case UPDATE_TASK_TOTAL_CHART_DATA:
      return action.data
    default:
      return state;
  }
};

// 职么力成长趋势图表数据
export const powerTrendChartData = (
  state = [],
  action = {}
) => {
  switch (action.type) {
    case UPDATE_POWER_TREND_CHART_DATA:
      return action.data
    default:
      return state;
  }
};

// 获取薪资增长趋势图表数据
export const salaryIncreaseRecordChartData = (
  state = {real:[],virtual:[]},
  action = {}
) => {
  switch (action.type) {
    case UPDATE_SALARY_INCREASE_RECORD_CHART_DATA:
      return action.data
    default:
      return state;
  }
};

