/* @flow */
// import type { Auth, Topic } from '../types';
import { apiFetch } from "./apiFetch";

// 记录分享
export const logShareNews = async (params: object, callBack: () => {}) => {
  const {id} = params;
  return apiFetch(`/v1/news/${id}/share/`, callBack, params, "POST");
};

export const getNews = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/news/`, callBack, params, "GET");
};

export const getNewsDetail = async (params: object, callBack: () => {}) => {
  const id = params.id.toString().match(/^[0-9]+$/i) ? params.id : 0;
  return apiFetch(`/v1/news/${id}/get_new/`, callBack, params, "GET");
};

export const addToFav = async (params: object, callBack: () => {}) => {
  const id = params.id || 0;
  return apiFetch(`/v1/news/${id}/like/`, callBack, params, "POST");
};

export const readIt = async (params: object, callBack: () => {}) => {
  const id = params.id || 0;
  return apiFetch(`/v1/news/${id}/read/`, callBack, params, "POST");
};

export const getLikeNews = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/users/liked_news/`, callBack, {}, "GET");
};

export const toggleNewsUse = async (params: object, callBack: () => {}) => {
  const id = params.id || 0;
  return apiFetch(`/v1/news/${id}/use/`, callBack, {}, "POST");
};