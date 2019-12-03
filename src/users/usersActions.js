/* @flow */
// import differenceInSeconds from 'date-fns/difference_in_seconds';

// import type { Dispatch, GetState, Narrow, User, InitUsersAction } from '../types';
// import { focusPing, getUsers, typing } from '../api';
// import { INIT_USERS, PRESENCE_RESPONSE } from '../actionConstants';
// import { getAuth } from '../selectors';
// import { isPrivateOrGroupNarrow } from '../utils/narrow';
import { NULL_USERSTATE } from "@src/nullObjects";
import {
  getOtherUserInfo,
  getUserInfo,
  getUploadToken,
  uploadFile,
  addFeedback,
  updatePhone,
  addDevice,
  readAllNotify,
  readNotify,
  removeNotify,
  removeAllNotify,
  getNotify,
  tokenCheck,
  updateUserEmail,
  getImSig,
  getLiveList,
  getLiveCourseDetail,
  getLiveCourseComment,
  addLiveCourseStudent,
  getV1ImSig,
  updateImUserProfile,
  getStudentBoughtList,
  addCourseComment,
  getNotifyType,
  getUnreadCount,
  getAlipayUrl,
  getWxpayUrl,
  getNotifyDetail,
  getServerTime,
  getCourseComment,
  getNoCommentNum,
  getEndMessages,
  getPopComment,
  getHomeCourse,
  getNews,
  getStartMsg
} from "../api";
import { getAddressInfo, getSchoolPoiInfo, getCenterPoiInfo, getAppVersion } from "../api/aMap";
import { getWeChatToken, getWeChatUserInfo, postWeChatCode, bindWeChat, unbindWeChat } from "../api/wechat";

export function setAppToken(result, opt = {}) {
  console.log("setAppToken==", result)
  return Object.assign({}, { type: "SETAPPTOKEN", json: result }, opt);
}

export function setAppNewToken(result, opt = {}) {
  return Object.assign({}, { type: "SETAPPNEWTOKEN", json: result }, opt);
}

export function cleanAppToken(result, opt = {}) {
  return Object.assign({}, { type: "CLEANAPPTOKEN", json: { token: "" } }, opt);
}

export function setUserState(result, opt = {}) {
  return Object.assign({}, { type: "SETUSERSTATE", json: result }, opt);
}

export const getOtherUserInfoAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getOtherUserInfo(params, res => {
    if (res.status === "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
      dispatch({
        type: "GETOTHERUSERINFO",
        json: res.results
      });
    }
  });
};

export const clearOtherUserInfoAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  dispatch({
    type: "CLEAROTHERUSERINFO"
  });
};

export const getAddressInfoAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getAddressInfo(params, res => {
    callBack && callBack instanceof Function && callBack(res);
  });
};

export const getSchoolPoiInfoAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getSchoolPoiInfo(params, res => {
    callBack && callBack instanceof Function && callBack(res);
  });
};

export const getCenterPoiInfoAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getCenterPoiInfo(params, res => {
    callBack && callBack instanceof Function && callBack(res);
  });
};

export const getAppVersionAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getAppVersion(params, res => {
    callBack && callBack instanceof Function && callBack(res);
  });
};

export const chkUserInfoAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getUserInfo(params, res => {
    return res
  });
};

export const getUserInfoAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getUserInfo(params, res => {
    //console.log("^^=getUserInfo", res)
    if (res.status === "ok") {
      dispatch({
        type: "UPDATE_USER_INFO",
        json: res.results
      });
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

export const getUploadTokenAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  getUploadToken(params, res => {
    if (res.status === "ok") {
      dispatch({
        type: "UPDATE_UPLODE_TOKEN",
        json: res.results
      });
    }
  });
};

export const updateUserEmailAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return updateUserEmail(params, res => {
    if (res.status === "ok") {
      dispatch(setAppToken(res.results.token))
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const uploadFileAction = (
  formData: object,
  callBack: () => void
) => async (dispatch, getState) => {
  uploadFile(formData, res => {
    callBack && callBack instanceof Function && callBack(res);
  });
};

export const getWeChatTokenAction = (params: object, callBack: () => void) => async (dispatch, getState) => {
  return getWeChatToken(params, (res) => {
    // console.warn(res)
    dispatch({
      type: 'UPDATE_WECHAT_TOKEN',
      json: res
    })
  });
}

export const getWeChatUserInfoAction = (params: object) => async (dispatch, getState) => {
  return getWeChatUserInfo(params);
}


export const addFeedbackAction = (
  formData: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return addFeedback(formData, res => {
    callBack && callBack instanceof Function && callBack(res);
  });
};


export const postWeChatCodeAction = (
  formData: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return postWeChatCode(formData, res => {
    callBack && callBack instanceof Function && callBack(res);
  });
};

export const bindWeChatAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return bindWeChat(params, res => {
    callBack && callBack instanceof Function && callBack(res);
  });
};

export const unbindWeChatAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return unbindWeChat(params, res => {
    callBack && callBack instanceof Function && callBack(res);
  });
};

export const updatePhoneAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return updatePhone(params, res => {
    // console.log(res);
    callBack && callBack instanceof Function && callBack(res);
    dispatch({
      type: 'UPDATE_USER_PHONE',
      json: params.phone
    })
  });
};


export const addDeviceAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return addDevice(params, res => {
    callBack && callBack instanceof Function && callBack(res);
  });
};

export const readAllNotifyAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return readAllNotify(params, res => {
    callBack && callBack instanceof Function && callBack(res);
    dispatch({
      type: 'READ_ALL_NOTIFY',
    })
  });
};

export const readNotifyAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return readNotify(params, res => {
    callBack && callBack instanceof Function && callBack(res);
  });
};

export const getNotifyTypeAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getNotifyType(params, res => {
    callBack && callBack instanceof Function && callBack(res);
  });
};

export const removeNotifyAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return removeNotify(params, res => {
    callBack && callBack instanceof Function && callBack(res);
    // dispatch({
    //   type: 'REMOVE_NOTIFY',
    //   json: params.id
    // })
  });
};

export const getNotifyUnreadCountAction = (
  params: object
) => async (dispatch, getState) => {
  return getUnreadCount(params, res => {
    dispatch({
      type: 'GET_UNREAD_NOTIFY',
      json: res.results
    })
  });
};

export const getNotifyTypeAciton = (
  params: object
) => async (dispatch, getState) => {
  return getNotifyType(params, res => {
    dispatch({
      type: 'GET_TYPE_NOTIFY',
      json: res.results
    })
  });
};

export const getNotifyDetailAction = (
  params: object
) => async (dispatch, getState) => {
  return getNotifyDetail(params, res => {
  });
};

export const removeAllNotifyAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return removeAllNotify(params, res => {
    callBack && callBack instanceof Function && callBack(res);
    dispatch({
      type: 'REMOVE_ALL_NOTIFY'
    })
  });
};

export const getNotifyAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getNotify(params, res => {
    callBack && callBack instanceof Function && callBack(res);
    dispatch({
      type: 'UPDATE_NOTIFY',
      json: res
    })
  });
};

export const clearNotifyReadAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
    dispatch({
      type: 'READ_ALL_NOTIFY'
    });
};

export const getNotifyOffsetAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getNotify(params, res => {
    callBack && callBack instanceof Function && callBack(res);
    dispatch({
      type: 'GET_OFFSET_NOTIFY',
      json: res
    })
  });
};

export const checkTokenAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return tokenCheck(params);
};

export const getImSigAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getImSig(params, (res) => {
    dispatch({
      type: "GET_IM_SIG",
      json: res.results.sig
    })
  });
};

export const getV1ImSigAction = (
  params: object,
) => async (dispatch, getState) => {
  return getV1ImSig(params, (res) => {
    dispatch({
      type: "GET_IM_SIG",
      json: res.results
    })
  });
};

export const getLiveListAction = (
  params: object
) => async (dispatch, getState) => {
  return getLiveList(params);
};

export const getStudentBoughtListAction = (
  params: object
) => async (dispatch, getState) => {
  return getStudentBoughtList(params);
};

export const getLiveCourseDetailAction = (
  params: object
) => async (dispatch, getState) => {
  return getLiveCourseDetail(params);
};

export const getLiveCourseCommentAction = (
  params: object
) => async (dispatch, getState) => {
  return getLiveCourseComment(params);
};

export const addLiveCourseStudentAction = (
  params: object
) => async (dispatch, getState) => {
  return addLiveCourseStudent(params);
};

export const updateImUserProfileAction = (
  params: object
) => async (dispatch, getState) => {
  return updateImUserProfile(params);
}

export const addCourseCommentAction = (
  params: object
) => async (dispatch, getState) => {
  return addCourseComment(params);
}

export const getCourseCommentAction = (
  params: object
) => async (dispatch, getState) => {
  return getCourseComment(params);
}

export const getAlipayUrlAction = (
  params: object
) => async (dispatch, getState) => {
  return getAlipayUrl(params);
}

export const getWxpayUrlAction = (
  params: object
) => async (dispatch, getState) => {
  return getWxpayUrl(params);
}

export const getServerTimeAction = (
  params: object
) => async (dispatch, getState) => {
  return getServerTime(params);
}

export const getNoCommentNumAction = (
  params: object
) => async (dispatch, getState) => {
  return getNoCommentNum(params);
}

export const getEndMessagesAction = (
  params: object
) => async (dispatch, getState) => {
  return getEndMessages(params);
}

export const getPopCommentAction = (
  params: object
) => async (dispatch, getState) => {
  return getPopComment(params);
}

export const getHomeCourseAction = (
  params: object
) => async (dispatch, getState) => {
  return getHomeCourse(params, (res) => {
    if(res.status == 'ok') {
      dispatch({
        type: "GET_HOME_COURSE",
        json: res.results
      })
    }
  });
}

export const getHomeNewsAction = (
  params: object
) => async (dispatch, getState) => {
  return getNews(params, (res) => {
    if(res.status == 'ok') {
      dispatch({
        type: "GET_HOME_NEWS",
        json: res.results
      })
    }
  });
}

export const getStartMsgAction = (
  params: object
) => async (dispatch, getState) => {
  return getStartMsg(params, (res) => {
  });
}