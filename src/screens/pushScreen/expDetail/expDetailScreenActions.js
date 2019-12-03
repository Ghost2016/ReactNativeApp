import {
  punchState,
  getTaskChart,
  getPowerTrendChart,
  getSalaryIncreaseRecordChart
} from "@api/index";
import {
  UPDATE_TASK_TOTAL_TREND_CHART_DATA,
  UPDATE_TASK_TOTAL_CHART_DATA,
  UPDATE_POWER_TREND_CHART_DATA,
  UPDATE_SALARY_INCREASE_RECORD_CHART_DATA
} from '../../../actionConstants';


// 获取任务统计趋势图表数据
export const getTaskTotalTrendChartData = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  console.log('ly88', 'getTaskTotalTrendChartData')
  return punchState(params, res => {
    if (res.status == "ok") {
      dispatch({
        type: UPDATE_TASK_TOTAL_TREND_CHART_DATA,
        data: res.results.task_info.data
      })
    }
  });
};

// 获取任务统计图表数据
export const getTaskTotalChartData = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  console.log('ly88', 'getTaskTotalChartData')
  return getTaskChart(params, res => {
    if (res.status == "ok") {
      dispatch({
        type: UPDATE_TASK_TOTAL_CHART_DATA,
        data: res.results
      })
    }
  });
};

// 获取职么力成长趋势图表数据
export const getPowerTrendChartData = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  console.log('ly88', 'getPowerTrendChartData')
  return getPowerTrendChart(params, res => {
    if (res.status == "ok") {
      dispatch({
        type: UPDATE_POWER_TREND_CHART_DATA,
        data: res.results.real
      })
    }
  });
};

// 获取职么力成长趋势图表数据
export const getSalaryIncreaseRecordChartData = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  console.log('ly88', 'getSalaryIncreaseRecordChartData')
  return getSalaryIncreaseRecordChart(params, res => {
    if (res.status == "ok") {
      dispatch({
        type: UPDATE_SALARY_INCREASE_RECORD_CHART_DATA,
        data: res.results
      })
    }
  });
};