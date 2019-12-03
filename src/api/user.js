/* @flow */
// import type { Auth, Topic } from '../types';
import { apiFetch } from "./apiFetch";

//查询手机号是否注册
/* export const searchPhone = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/auth/search_phone/`, callBack, params, "POST");
}; */

export const resetPassword = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/auth/reset_password/`, callBack, params, "POST");
};

export const updatePhone = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/auth/update_phone/`, callBack, params, "POST");
};

export const getCredentialInfo = async (params: object, callBack: () => {}) => {
  const id = params.id || 0;
  return apiFetch(`/v1/users/${id}/certified/`, callBack, params, "GET");
};

export const addCredentialInfo = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/users/certified/`, callBack, params, "POST");
};

export const updateUserEmail = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/auth/update_email/`, callBack, params, "POST");
};

export const editCredentialInfo = async (
  params: object,
  callBack: () => {}
) => {
  const id = params.id || 0;
  return apiFetch(`/v1/users/certified/${id}/`, callBack, params, "PUT");
};

export const getUserEduInfo = async (params: object, callBack: () => {}) => {
  const id = params.id || 0;
  return apiFetch(`/v1/users/${id}/educations/`, callBack, {}, "GET");
};

export const addUserEduInfo = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/education/add_education/`, callBack, params, "POST");
};

export const editUserEduInfo = async (params: object, callBack: () => {}) => {
  const id = params.id || 0;
  return apiFetch(`/v1/education/${id}/`, callBack, params, "PUT");
};

export const delUserEduInfo = async (params: object, callBack: () => {}) => {
  const id = params.id || 0;
  return apiFetch(`/v1/education/${id}/`, callBack, params, "DELETE");
};

export const getUserInfo = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/users/info/`, callBack, params, "GET");
};

export const getOtherUserInfo = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/users/${id}/user_info/`, callBack, params, "GET");
};

export const getPower = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/users/find_power/`, callBack, params, "POST");
};

export const updateNickname = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/users/base_info/`, callBack, params, "PATCH");
};

export const updateBaseInfo = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/users/base_info/`, callBack, params, "PATCH");
};

// 搜索用户
export const searchUser = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/users/search/`, callBack, params, "GET");
};

export const addUserWorkItem = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/users/work/`, callBack, params, "POST");
};

export const updateUserWorkItem = async (
  params: object,
  callBack: () => {}
) => {
  const { id } = params;
  return apiFetch(`/v1/users/work/${id}/`, callBack, params, "PUT");
};

export const delUserWorkItem = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/users/work/${id}/`, callBack, {}, "DELETE");
};

export const getUserWorkList = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/users/${id}/works/`, callBack, {}, "GET");
};

export const addAwardExpItem = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/users/winning/`, callBack, params, "POST");
};

export const updateAwardExpItem = async (
  params: object,
  callBack: () => {}
) => {
  const { id } = params;
  return apiFetch(`/v1/users/winning/${id}/`, callBack, params, "PUT");
};

export const deleteAwardExpItem = async (
  params: object,
  callBack: () => {}
) => {
  const { id } = params;
  return apiFetch(`/v1/users/winning/${id}/`, callBack, {}, "DELETE");
};

export const getUserAwardExpList = async (
  params: object,
  callBack: () => {}
) => {
  const { id } = params;
  return apiFetch(`/v1/users/${id}/winning/`, callBack, {}, "GET");
};

// 获取用户证书
export const getUserCertificate = async (
  params: object,
  callBack: () => {}
) => {
  const { id } = params;
  return apiFetch(`/v1/users/${id}/certificate/`, callBack, params, "GET");
};

export const addUserCertificate = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`/v1/users/certificates/`, callBack, params, "POST");
};

export const delUserCertificate = async (
  params: object,
  callBack: () => {}
) => {
  const { id } = params;
  return apiFetch(`/v1/users/certificates/${id}/`, callBack, {}, "DELETE");
};

export const updateUserCertificate = async (
  params: object,
  callBack: () => {}
) => {
  const { id } = params;
  return apiFetch(`/v1/users/certificates/${id}/`, callBack, params, "PUT");
};

export const getUserCertificateList = async (
  params: object,
  callBack: () => {}
) => {
  const { id } = params;
  return apiFetch(`/v1/users/${id}/certificate/`, callBack, {}, "GET");
};

// 获取关注用户列表
export const getWatchedList = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/users/${id}/watches/`, callBack, params, "GET");
};

// 关注、取消关注
export const toggleWatch = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/users/${id}/watch_unwatch/`, callBack, params, "POST");
};

// 获取粉丝用户列表
export const getFans = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/users/${id}/fans/`, callBack, params, "GET");
};

// 添加意见反馈
export const addFeedback = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/feedback/`, callBack, params, "POST");
};