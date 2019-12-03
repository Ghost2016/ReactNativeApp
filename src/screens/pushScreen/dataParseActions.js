// /* @flow */
import {
  getSchoolProfile,
  getSchoolWorkYear,
  getProfessionalSalary,
  getSchoolMajorWorkYear,
  getSchoolRank,
  getMajorProfile,
  getMajorDetail,
  getMajorWorkYear,
  getJobRank,
  getJobDetail,
  getJobWorkYear,
  getJobSkillChart,
  getIndustryProfile,
  getIndustryDetail,
  getIndustryWorkYear,
  getIndustryRank,
  getSchoolMajorRank,
  getMajorIndustry,
  getMajorPosition,
  getMajorRank,
  getMajorCompany,
  getPostGraduateRatio,
  getPostGraduateSalary,
  schoolSuggest,
  majorSuggest,
  positionSuggest,
  getIndustrySearch,
  schoolSearch,
  majorSearch,
  positionSearch,
  positionWorkYear,
  industrySuggest,
  getJobWorkYearRange,
  getJobWorkYearNoRange,
  majorPositionSearch,
  industrySuggestV1,
  positionSuggestV1,
  majorSuggestV1,
  schoolSuggestV1,
  certificateSuggestV1,
  getJobPlanPositionList
} from "../../api";

export const getSchoolProfileAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getSchoolProfile(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getSchoolWorkYearAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getSchoolWorkYear(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getSchoolRankAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getSchoolRank(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getSchoolMajorWorkYearAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getSchoolMajorWorkYear(params, res => {
    callBack && callBack instanceof Function && callBack(res);
    if (res.status == "ok") {
      dispatch({
        type: "GET_MAJOR_SALARY_TABLE",
        json: res.results
      });
    }
  });
};

//专业薪资分布
export const getProfessionalSalaryAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getProfessionalSalary(params, res => {
    callBack && callBack instanceof Function && callBack(res);
    if (res.status == "ok") {
      dispatch({
        type: "GET_MAJOR_SALARY_TABLE",
        json: res.results
      });
    }
  });
};

export const getMajorProfileAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getMajorProfile(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getMajorDetailAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getMajorDetail(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getMajorWorkYearAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getMajorWorkYear(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getMajorRankAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getMajorRank(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getJobRankAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getJobRank(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getJobDetailAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getJobDetail(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getJobWorkYearAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  getJobWorkYear(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getJobWorkYearRangeAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  // getJobWorkYearRange(params, res => {
  getJobWorkYearNoRange(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getJobSkillChartAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getJobSkillChart(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getIndustryProfileAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getIndustryProfile(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getIndustryDetailAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getIndustryDetail(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getIndustryWorkYearAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getIndustryWorkYear(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getIndustryRankAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getIndustryRank(params, res => {
    // if (res.status == "ok") {
    callBack && callBack instanceof Function && callBack(res);
    // }
  });
};

export const getIndustrySearchAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getIndustrySearch(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getSchoolMajorRankAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getSchoolMajorRank(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getMajorIndustryAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getMajorIndustry(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getMajorPositionAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getMajorPosition(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getMajorCompanyAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getMajorCompany(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
      dispatch({
        type: "GET_MAJOR_COMPANY",
        json: res.results
      });
    }
  });
};

export const getPostGraduateRatioAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getPostGraduateRatio(params);
};

export const getPostGraduateSalaryAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getPostGraduateSalary(params);
};

export const getSchoolSuggestAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return schoolSuggest(params, res => {});
};

export const getIndustrySuggestAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return industrySuggest(params, res => {});
};

export const getSchoolSearchAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return schoolSearch(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getMajorSuggestAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return majorSuggest(params, res => {});
};

export const getMajorSearchAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return majorSearch(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getMajorPositionSearchAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return majorPositionSearch(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getPositionSuggestAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return positionSuggest(params, res => {});
};

export const getPositionSearchAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return positionSearch(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getPositionWorkYearAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  positionWorkYear(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const schoolSuggestAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return schoolSuggestV1(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const getPositionProfileAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getJobPlanPositionList(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const majorSuggestAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return majorSuggestV1(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const positionSuggestAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return positionSuggestV1(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const industrySuggestAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return industrySuggestV1(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const certificateSuggestAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return certificateSuggestV1(params, res => {
    if (res.status == "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

