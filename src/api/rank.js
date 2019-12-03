/* @flow */
import { apiFetch } from "./apiFetch";

/**
 * 获取统计数据
 * @param {*} params
 * :type(类型)
 * ('top’, ‘top榜’),
 * ('peer’, ‘同侪榜’),
 * ('watch’, ‘关注榜’),
 * ('progress’, ‘进步榜’)
 * :dimension(维度)
 * ('major’, ‘本专业’),
 * ('similar_major’, ‘同类专业’),
 * ('school’, ‘本校’),
 * ('similar_school’, ‘同类院校’),
 * ('city’, ‘同城’)
 * @param {*} callBack
 */
export const getRankStatistics = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/users/statistics/`, callBack, params, "GET");
};

/**
 * 获取排名图表数据
 */
export const getRankChartData = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/users/statistics/chart_data/`, callBack, params, "GET");
};

/**
 * 获取PK一下数据
 */
export const getPKData = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/users/${id}/compare/`, callBack, params, "GET");
};
