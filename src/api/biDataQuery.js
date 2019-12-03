import { apiFetch } from "./apiFetch";

export const getSchoolProfile = async (params: object, callBack: () => {}) => {
  return apiFetch(`school/profile`, callBack, params, "GET");
};

export const getSchoolWorkYear = async (params: object, callBack: () => {}) => {
  return apiFetch(`school/work-year`, callBack, params, "GET");
};

export const getSchoolRank = async (params: object, callBack: () => {}) => {
  return apiFetch(`school/rank`, callBack, params, "GET");
};

export const getSchoolMajorWorkYear = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`school-major/work-year`, callBack, params, "GET");
};

//专业薪资分布（现带了用户默认学历的，应该学历取 不限 ）
//新接口调用示例：/school-major/median-salary-rank?school_name=西南交通大学&degree=不限
export const getProfessionalSalary = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`school-major/median-salary-rank`, callBack, params, "GET");
};

export const getMajorProfile = async (params: object, callBack: () => {}) => {
  return apiFetch(`major/profile`, callBack, params, "GET");
};

export const getMajorDetail = async (params: object, callBack: () => {}) => {
  return apiFetch(`major/detail`, callBack, params, "GET");
};

export const getMajorWorkYear = async (params: object, callBack: () => {}) => {
  return apiFetch(`major/work-year`, callBack, params, "GET");
};

export const getMajorRank = async (params: object, callBack: () => {}) => {
  return apiFetch(`major/rank`, callBack, params, "GET");
};

export const getJobWorkYear = async (params: object, callBack: () => {}) => {
  return apiFetch(`position-address/salary-work-year`, callBack, params, "GET");
};

export const getJobWorkYearRange = async (params: object, callBack: () => {}) => {
  return apiFetch(`position-address/work-year-range`, callBack, params, "GET");
};
export const getJobWorkYearNoRange = async (params: object, callBack: () => {}) => {
  return apiFetch(`position-address/work-year`, callBack, params, "GET");
};

export const getJobRank = async (params: object, callBack: () => {}) => {
  return apiFetch(`position/rank`, callBack, params, "GET");
};

export const getJobDetail = async (params: object, callBack: () => {}) => {
  return apiFetch(`job/detail`, callBack, params, "GET");
};

export const getJobSkillChart = async (params: object, callBack: () => {}) => {
  return apiFetch(`position/skill-chart`, callBack, params, "GET");
};

export const getIndustryDetail = async (params: object, callBack: () => {}) => {
  return apiFetch(`industry/detail`, callBack, params, "GET");
};

export const getIndustryProfile = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`industry/profile`, callBack, params, "GET");
};

export const getIndustryWorkYear = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`industry-address/work-year`, callBack, params, "GET");
};

export const getIndustryRank = async (params: object, callBack: () => {}) => {
  return apiFetch(`industry/rank`, callBack, params, "GET");
};

export const getIndustrySearch = async (params: object, callBack: () => {}) => {
  return apiFetch(`industry/search`, callBack, params, "GET");
};

export const getSchoolMajorRank = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`school-major/rank`, callBack, params, "GET");
};

export const getMajorIndustry = async (params: object, callBack: () => {}) => {
  return apiFetch(`major/industry`, callBack, params, "GET");
};

export const getMajorPosition = async (params: object, callBack: () => {}) => {
  return apiFetch(`major/position`, callBack, params, "GET");
};

export const getMajorCompany = async (params: object, callBack: () => {}) => {
  return apiFetch(`major/company`, callBack, params, "GET");
};

export const getPostGraduateRatio = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`school-major/postgraduate-ratio`, callBack, params, "GET");
};

export const getPostGraduateSalary = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`school-major/postgraduate-salary`, callBack, params, "GET");
};

export const schoolSuggest = async (params: object, callBack: () => {}) => {
  return apiFetch(`school/suggest`, callBack, params, "GET");
};

export const industrySuggest = async (params: object, callBack: () => {}) => {
  return apiFetch(`industry/suggest`, callBack, params, "GET");
};

export const schoolSearch = async (params: object, callBack: () => {}) => {
  return apiFetch(`school/search`, callBack, params, "GET");
};

export const majorSuggest = async (params: object, callBack: () => {}) => {
  return apiFetch(`major/suggest`, callBack, params, "GET");
};

export const majorSearch = async (params: object, callBack: () => {}) => {
  return apiFetch(`major/search`, callBack, params, "GET");
};

export const majorPositionSearch = async (params: object, callBack: () => {}) => {
  return apiFetch(`major-position/detail`, callBack, params, "GET");
};

export const positionSuggest = async (params: object, callBack: () => {}) => {
  return apiFetch(`position/suggest`, callBack, params, "GET");
};

export const positionSearch = async (params: object, callBack: () => {}) => {
  return apiFetch(`position/search`, callBack, params, "GET");
};

export const positionWorkYear = async (params: object, callBack: () => {}) => {
  return apiFetch(`position-address/salary-work-year`, callBack, params, "GET");
};

export const industrySuggestV1 = async (params: object, callBack: () => {}) => {
  return params._path ? apiFetch(params._path, callBack, params) :
  apiFetch(`/v1/industry/suggest/`, callBack, params, "GET");
};

export const certificateSuggestV1 = async (params: object, callBack: () => {}) => {
  return params._path ? apiFetch(params._path, callBack, params) :
  apiFetch(`/v1/certificate/suggest/`, callBack, params, "GET");
};

export const majorSuggestV1 = async (params: object, callBack: () => {}) => {
  return params._path ? apiFetch(params._path, callBack, params) :
  apiFetch(`/v1/major/suggest/`, callBack, params, "GET");
};

export const positionSuggestV1 = async (params: object, callBack: () => {}) => {
  return params._path ? apiFetch(params._path, callBack, params) :
  apiFetch(`/v1/position/suggest/`, callBack, params);
};

export const schoolSuggestV1 = async (params: object, callBack: () => {}) => {
  return params._path ? apiFetch(params._path, callBack, params) :
  apiFetch(`/v1/school/suggest/`, callBack, params);
};