import { apiFetch } from "./apiFetch";
/**
 * 获取搜索记录
 * @param {*} params 
 * {
    ?type=’statistics|grow|searcher_school| searcher_major| searcher_job| searcher_profession’
    }
 * @param {*} callBack 
 */
export const getRecord = (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/records/get_record/`, callBack, params, "GET");
};

/**
 * 创建搜索记录
 * @param {*} params 
 * {
    *type=’statistics|grow|searcher_school| searcher_major| searcher_job| searcher_profession’
    ?content: string,
    ?value: string
    }
 * @param {*} callBack 
 */
export const createRecord = (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/records/create_search_log/`, callBack, params, "POST");
};

/**
 * 删除搜索记录
 * @param {*} id
 * @param {*} callBack
 */
export const deleteRecord = (
  id: string,
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`/v1/records/${id}/clan_record/`, callBack, params, "DELETE");
};

/**
 * 删除所有搜索记录
 * ?type=’statistics|grow|searcher_school| searcher_major| searcher_job| searcher_profession’
 */
export const deleteAllRecord = (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/records/clan_records/`, callBack, params, "DELETE");
};

export const likeRecord = (id: string, params: object, callBack: () => {}) => {
  return apiFetch(`/v1/records/${id}/like/`, callBack, params, "POST");
};

export const getLikeRecord = (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/users/liked_records/`, callBack, {}, "GET");
};

// 获取薪资增长记录
export const getSalaryIncreaseRecordChart = (params: object, callBack: () => {}) => {
  // return apiFetch(`v1/records/salary/`, callBack, {}, "GET");
  return apiFetch(`/v1/records/salary/get_year_list/`, callBack, {}, "GET");
};
