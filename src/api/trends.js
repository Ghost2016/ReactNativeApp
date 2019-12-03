import { apiFetch } from "./apiFetch";

export const getDynamicList = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/users/${id}/dynamic/`, callBack, params, "GET");
};

export const createDynamic = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/dynamic/`, callBack, params, "POST");
};
