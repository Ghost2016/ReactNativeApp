import { apiFetch } from "./apiFetch";

// 在校课程
export const getCourseList = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/users/${id}/courses/`, callBack, params, "GET");
};

export const addCourseItem = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/school/course/`, callBack, params, "POST");
};

export const updateCourseItem = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/school/course/${id}/`, callBack, params, "PUT");
};

export const delCourseItem = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/school/course/${id}/`, callBack, {}, "DELETE");
};

export const checkSyncCourse = async (params: object, callBack: () => {}) => {
  //?education_id=1
  return apiFetch(`/v1/school/course/check_sync_course/`, callBack, params, "GET");
};

export const addSyncCourse = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/school/course/sync_course/`, callBack, params, "POST");
};



// 在校职务
export const createJobItem = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/school/post/`, callBack, params, "POST");
};

export const updateJobItem = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/school/post/${id}/`, callBack, params, "PUT");
};

export const delJobItem = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/school/post/${id}/`, callBack, {}, "DELETE");
};

export const getJobList = async (params: object, callBack: () => {}) => {
  const { id } = params;
  return apiFetch(`/v1/users/${id}/posts/`, callBack, {}, "GET");
};

export const addSchoolAccount = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/school/student/`, callBack, params, "POST");
};

export const updateSchoolAccount = async (params: object, callBack: () => {}) => {
  const {id} = params;
  return apiFetch(`/v1/school/student/${id}/`, callBack, params, "PUT");
};

export const getSchoolAccount = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/school/student/`, callBack, params, "GET");
};

export const updateAuthAccount = async (params: object, callBack: () => {}) => {
  const {id} = params;
  return apiFetch(`/v1/school/student/${id}/auth_education/`, callBack, params, "PUT");
};

