

/* @flow */
// import type { Auth, Topic } from '../types';
import { apiFetch } from "./apiFetch";

// 记录分享
export const logShareLive = async (params: object, callBack: () => {}) => {
  const {id} = params;
  return apiFetch(`/v1/live/course/${id}/share/`, callBack, params, "POST");
};

// 获取live课程列表
export const getLiveList = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/live/course/`, callBack, params, "GET");
};

// 获取学生已购的live课程列表
export const getStudentBoughtList = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/live/course/student/`, callBack, params, "GET");
};

export const getLiveCourseDetail = async (params: object, callBack: () => {}) => {
  const {id} = params;
  return apiFetch(`/v1/live/course/${id}/`, callBack, params, "GET");
};

export const getLiveCourseComment = async (params: object, callBack: () => {}) => {
  const {id} = params;
  return apiFetch(`/v1/live/course/${id}/comments/`, callBack, params, "GET");
};

export const addLiveCourseStudent = async (params: object, callBack: () => {}) => {
  const {id} = params;
  return apiFetch(`/v1/live/course/${id}/add/`, callBack, params, "POST");
};

export const addCourseComment = async (params: object, callBack: () => {}) => {
  const {id} = params;
  delete params.id;
  return apiFetch(`/v1/live/course/${id}/comment/`, callBack, params, "POST");
};

export const getCourseComment = async (params: object, callBack: () => {}) => {
  const {id} = params;
  return apiFetch(`/v1/live/comment/${id}/comment/`, callBack, null, "GET");
};

export const getAlipayUrl = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/pay/alipay/get_alipay_url/`, callBack, params, "GET");
};

export const getWxpayUrl = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/pay/wxpay/get_wxpay_url/`, callBack, params, "GET");
};

export const getServerTime = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/live/course/time/`, callBack, params, "GET");
};

export const getNoCommentNum = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/live/comment/no_comment_num/`, callBack, null, "GET");
};

export const getEndMessages = async (params: object, callBack: () => {}) => {
  const {id} = params;
  return apiFetch(`/v1/live/course/${id}/messages/`, callBack, params, "GET");
};

export const getPopComment = async (params: object, callBack: () => {}) => {
  const {id} = params;
  return apiFetch(`/v1/live/course/${id}/pop_comment/`, callBack, params, "POST");
};


export const getHomeCourse = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/live/course/home/`, callBack, params, "GET");
};

export const getStartMsg = async (params: object, callBack: () => {}) => {
  const {id} = params;
  return apiFetch(`/v1/live/course/${id}/between_start_msg/`, callBack, params, "GET");
};

