import {
  getEducation,
  getCourseList,
  getJobList,
  getUserWorkList,
  getUserAwardExpList,
  getUserCertificateList,
  updateEducation,
  addEducation,
  updateCourseItem,
  delCourseItem,
  addCourseItem,
  createJobItem,
  updateJobItem,
  delJobItem,
  deleteAwardExpItem,
  updateAwardExpItem,
  addAwardExpItem,
  delUserWorkItem,
  updateUserWorkItem,
  addUserWorkItem,
  addUserCertificate,
  updateUserCertificate,
  delUserCertificate,
  checkSyncCourse,
  addSchoolAccount,
  updateSchoolAccount,
  getSchoolAccount,
  addSyncCourse,
  getEducationOrgan,
  delEducation,
  updateAuthAccount
} from "../api";

export const getEducationAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  params = params || {};
  params.size = 99;
  return getEducation(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "GET_EDUCATION",
      json: res.results
    });
  });
};

export const getEducationOrganAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getEducationOrgan(params, res => {});
};

export const updateEducationAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return updateEducation(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "UPDATE_EDUCATION",
      json: res.results
    });
  });
};

export const delEducationAction = (
  params: object
) => async (dispatch, getState) => {
  return delEducation(params, res => {
    dispatch({
      type: "DELETE_EDUCATION",
      json: params
    });
  });
};

export const addEducationAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await addEducation(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "ADD_EDUCATION",
      json: res.results
    });
  });
};

export const getCourseListAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getCourseList(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "GET_USERCOURSELIST",
      json: res.results
    });
  });
};

export const addCourseItemAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return addCourseItem(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "ADD_USERCOURSEITEM",
      json: res.results
    });
  });
};

export const updateCourseItemAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await updateCourseItem(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "UPDATE_USERCOURSEITEM",
      json: res.results
    });
  });
};

export const delCourseItemAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await delCourseItem(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "DEL_USERCOURSEITEM",
      json: params
    });
  });
};

export const checkSyncCourseAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return checkSyncCourse(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
  });
};

export const addSyncCourseAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return addSyncCourse(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
  });
};

export const getJobListAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getJobList(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "GET_USERJOBLIST",
      json: res.results
    });
  });
};

export const addSchoolAccountAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return addSchoolAccount(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "ADDSCHOOLACCOUNT",
      json: res.results
    });
  });
};

export const updateSchoolAccountAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return updateSchoolAccount(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
  });
};

export const updateAuthAccountAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return updateAuthAccount(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
  });
};

export const getSchoolAccountAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  params = params || {};
  params.size = 99;
  return getSchoolAccount(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "GETSCHOOLACCOUNT",
      json: res.results
    });
  });
};

export const addJobItemAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await createJobItem(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "ADD_USERJOBITEM",
      json: res.results
    });
  });
};

export const updateJobItemAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await updateJobItem(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "UPDATE_USERJOBITEM",
      json: res.results
    });
  });
};

export const delJobItemAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await delJobItem(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "DEL_USERJOBITEM",
      json: params
    });
  });
};

export const getUserWorkListAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getUserWorkList(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "GET_PRACTICEEXPLIST",
      json: res.results
    });
  });
};

export const addUserWorkItemAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await addUserWorkItem(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "ADD_PRACTICEEXPITEM",
      json: res.results
    });
  });
};

export const updateUserWorkItemAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await updateUserWorkItem(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "UPDATE_PRACTICEEXPITEM",
      json: res.results
    });
  });
};

export const delUserWorkItemAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await delUserWorkItem(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "DEL_PRACTICEEXPITEM",
      json: params
    });
  });
};

export const getUserAwardExpListAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getUserAwardExpList(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "GET_AWARDEXPLIST",
      json: res.results
    });
  });
};

export const addAwardExpItemAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await addAwardExpItem(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "ADD_AWARDEXPITEM",
      json: res.results
    });
  });
};

export const updateAwardExpItemAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await updateAwardExpItem(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "UPDATE_AWARDEXPITEM",
      json: res.results
    });
  });
};

export const deleteAwardExpItemAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await deleteAwardExpItem(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "DEL_AWARDEXPITEM",
      json: params
    });
  });
};

export const addUserCertificateAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return await addUserCertificate(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "ADD_CERTIFICATEITEM",
      json: res.results
    });
  });
};

export const updateUserCertificateAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await updateUserCertificate(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "UPDATE_CERTIFICATEITEM",
      json: res.results
    });
  });
};

export const delUserCertificateAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await delUserCertificate(params, res => {
    callBack && callBack instanceof Function && callBack(res.results);
    dispatch({
      type: "DEL_CERTIFICATEITEM",
      json: params
    });
  });
};
