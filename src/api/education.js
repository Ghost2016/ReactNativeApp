/* @flow */
// import type { Auth, Topic } from '../types';
import { apiFetch } from "./apiFetch";

export const addEducation = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/education/add_education/`, callBack, params, "POST");
};

export const getEducation = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/users/${id}/educations/`, callBack, params, "GET");
};

export const delEducation = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/education/${id}/`, callBack, params, "DELETE");
};

export const updateEducation = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/education/${id}/`, callBack, params, "PUT");
};

export const getEducationOrgan = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/education/organ/`, callBack, params, "GET");
};