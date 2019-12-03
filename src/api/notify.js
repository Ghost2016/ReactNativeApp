import { apiFetch } from "./apiFetch";

export const addDevice = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/notification/device/add/`, callBack, params, "POST");
};

export const getNotify = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/notification/`, callBack, params, "GET");
};

export const readAllNotify = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/notification/read_all/`, callBack, params, "POST");
};

export const removeAllNotify = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/notification/remove_all/`, callBack, params, "POST");
};

export const removeNotify = async (params: object, callBack: () => {}) => {
  const {id} = params;
  return apiFetch(`/v1/notification/${id}/`, callBack, {}, "DELETE");
};

export const readNotify = async (params: object, callBack: () => {}) => {
  const {id} = params;
  return apiFetch(`/v1/notification/${id}/read/`, callBack, params, "GET");
};

export const getUnreadCount = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/notification/unread_count/`, callBack, params, "GET");
};

export const getNotifyType = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/notification/notice_info/`, callBack, params, "GET");
};

export const getNotifyDetail = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/notification/notice_detail/`, callBack, params, "GET");
};
