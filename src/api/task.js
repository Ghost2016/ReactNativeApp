import { apiFetch } from "./apiFetch";

// 获取考证列表
export const getTaskCertificateList = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`/v1/tasks/certificate_list/`, callBack, params, "GET");
};

export const getTaskPunchList = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/tasks/punch_list/`, callBack, params, "GET");
};

export const getTaskReadList = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/tasks/read_list/`, callBack, params, "GET");
};

export const getTaskTechList = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/tasks/tech_list/`, callBack, params, "GET");
};

export const getOtherUserReadList = async (
  params: object,
  callBack: () => {}
) => {
  const { id } = params;
  return apiFetch(`/v1/users/${id}/books/`, callBack, params, "GET");
};


export const getTaskChart = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/users/task_chart/`, callBack, params, "GET");
};

export const getPowerTrendChart = async (params: object, callBack: () => {}) => {
  // return apiFetch(`/v1/records/power/`, callBack, params, "GET");
  return apiFetch(`/v1/records/power/get_month_list/`, callBack, params, "GET");
};
