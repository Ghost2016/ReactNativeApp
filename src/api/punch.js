/* @flow */
// import type { Auth, Topic } from '../types';
import { apiFetch } from "./apiFetch";

export const patchPunchCert = async (params: object, callBack: () => void) => {
  //const id = params.id || 0;
  return apiFetch(`/v1/tasks/certificate_punch/`, callBack, params, "PATCH");
};

export const patchPunchSkill = async (params: object, callBack: () => void) => {
  const id = params.id || 0;
  return apiFetch(`/v1/tasks/${id}/tech_punch/`, callBack, params, "PATCH");
};

export const patchPunchSkillCourse = async (params: object, callBack: () => void) => {
  return apiFetch(`/v1/tasks/tech_punch/`, callBack, params, "POST");
};

export const punchState = async (params: object, callBack: () => void) => {
  return apiFetch(`/v1/users/tasks/`, callBack, params, "GET");
};

export const punch = async (params: object, callBack: () => void) => {
  return apiFetch(`/v1/tasks/punch/`, callBack, params, "POST");
};

export const punchMorningTypesList = async (
  params: object,
  callBack: () => void
) => {
  return apiFetch(`/v1/tasks/punch_type/`, callBack, params, "GET");
};

export const punchMorningList = async (
  params: object,
  callBack: () => void
) => {
  return apiFetch(`/v1/tasks/punch_list/`, callBack, params, "GET");
};

export const punchReadingList = async (
  params: object,
  callBack: () => void
) => {
  return apiFetch(`/v1/tasks/read_list/`, callBack, params, "GET");
};

export const punchCertList = async (params: object, callBack: () => void) => {
  return apiFetch(`/v1/tasks/certificate_list/`, callBack, params, "GET");
};

export const punchSkillList = async (params: object, callBack: () => void) => {
  return apiFetch(`/v1/tasks/tech_list/`, callBack, params, "GET");
};

//技能任务统计 (?type=common|goal|custom|other)
export const stateSkillList = async (params: object, callBack: () => void) => {
  return apiFetch(`/v1/tasks/tech_task_statistic/`, callBack, params, "GET");
};

//证书任务统计 (?type=common|goal|custom|other)
export const stateCertList = async (params: object, callBack: () => void) => {
  return apiFetch(`/v1/tasks/certificate_task_statistic/`, callBack, params, "GET");
};

//查询目标职位是否已经添加 /api/sd/v1/profession/?position_id=1
export const hasTargetPosition = async (params: object, callBack: () => void) => {
  const positionId = params.positionId || 0
  return apiFetch(`/v1/profession/?position_id=${positionId}`, callBack, {}, "GET");
};
