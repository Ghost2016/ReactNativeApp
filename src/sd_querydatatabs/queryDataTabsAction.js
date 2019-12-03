// /* @flow */
import {
  getRecord,
  createRecord,
  deleteRecord,
  deleteAllRecord,
  likeRecord,
  getLikeRecord
} from "../api";

export const getRecordAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  await getRecord(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
      dispatch({
        type:
          params.type === "searcher_school"
            ? "GET_SCHOOL_DATA"
            : params.type === "searcher_major"
              ? "GET_MAJOR_DATA"
              : params.type === "searcher_job"
                ? "GET_JOB_DATA"
                : params.type === "searcher_profession"
                  ? "GET_INDUSTRY_DATA"
                  : "",
        json: res.results
      });
    }
  });
};

export const createRecordAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return createRecord(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
      dispatch({
        type:
          params.type === "searcher_school"
            ? "CREATE_SCHOOL_DATA"
            : params.type === "searcher_major"
              ? "CREATE_MAJOR_DATA"
              : params.type === "searcher_job"
                ? "CREATE_JOB_DATA"
                : params.type === "searcher_profession"
                  ? "CREATE_INDUSTRY_DATA"
                  : "",
        json: res.results
      });
    }
  });
};

export const deleteRecordAction = (
  id: string,
  type: string,
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await deleteRecord(id, {}, res => {
    console.log(type)
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
      dispatch({
        type:
          type === "school"
            ? "DEL_SCHOOL_DATA"
            : type === "major"
              ? "DEL_MAJOR_DATA"
              : type === "position"
                ? "DEL_JOB_DATA"
                : type === "industry"
                  ? "DEL_INDUSTRY_DATA"
                  : "",
        json: id
      });
    }
  });
};

export const deleteAllRecordAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await deleteAllRecord(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
      dispatch({
        type:
          params.type === "searcher_school"
            ? "DEL_ALL_SCHOOL_DATA"
            : params.type === "searcher_major"
              ? "DEL_ALL_MAJOR_DATA"
              : params.type === "searcher_job"
                ? "DEL_ALL_JOB_DATA"
                : params.type === "searcher_profession"
                  ? "DEL_ALL_INDUSTRY_DATA"
                  : ""
      });
    }
  });
};

export const toggleLikeRecordAction = (
  id: string,
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return likeRecord(id, params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getLikeRecordAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getLikeRecord(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};
