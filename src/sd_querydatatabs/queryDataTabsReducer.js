const getSchoolData = (state, action) => {
  return Object.assign({}, state, {
    schoolData: action.json
  });
};
const createSchoolData = (state, action) => {
  return Object.assign({}, state, {
    schoolData: state.schoolData.concat([{ ...action.json }])
  });
};
const delSchoolData = (state, action) => {
  return Object.assign({}, state, {
    schoolData: state.schoolData.filter((item, index, self) => {
      return item.id != action.json;
    })
  });
};

const delAllSchoolData = (state, action) => {
  return Object.assign({}, state, {
    schoolData: []
  });
};

const getMajorData = (state, action) => {
  console.log(action);
  return Object.assign({}, state, {
    majorData: action.json
  });
};
const createMajorData = (state, action) => {
  return Object.assign({}, state, {
    majorData: state.majorData.concat([{ ...action.json }])
  });
};
const delMajorData = (state, action) => {
  return Object.assign({}, state, {
    majorData: state.majorData.filter((item, index, self) => {
      return item.id != action.json;
    })
  });
};

const delAllMajorData = (state, action) => {
  return Object.assign({}, state, {
    majorData: []
  });
};

const getJobData = (state, action) => {
  return Object.assign({}, state, {
    jobData: action.json
  });
};
const createJobData = (state, action) => {
  return Object.assign({}, state, {
    jobData: state.jobData.concat([{ ...action.json }])
  });
};
const delJobData = (state, action) => {
  return Object.assign({}, state, {
    jobData: state.jobData.filter((item, index, self) => {
      return item.id != action.json;
    })
  });
};

const delAllJobData = (state, action) => {
  return Object.assign({}, state, {
    jobData: []
  });
};

const getIndustryData = (state, action) => {
  return Object.assign({}, state, {
    industryData: action.json
  });
};
const createIndustryData = (state, action) => {
  return Object.assign({}, state, {
    industryData: state.industryData.concat([{ ...action.json }])
  });
};
const delIndustryData = (state, action) => {
  return Object.assign({}, state, {
    industryData: state.industryData.filter((item, index, self) => {
      return item.id != action.json;
    })
  });
};

const delAllIndustryData = (state, action) => {
  return Object.assign({}, state, {
    industryData: []
  });
};

export default (
  state = {
    schoolData: [],
    majorData: [],
    jobData: [],
    industryData: []
  },
  action = {}
) => {
  switch (action.type) {
    case "GET_SCHOOL_DATA":
      return getSchoolData(state, action);
    case "CREATE_SCHOOL_DATA":
      return createSchoolData(state, action);
    case "DEL_SCHOOL_DATA":
      return delSchoolData(state, action);
    case "DEL_ALL_SCHOOL_DATA":
      return delAllSchoolData(state, action);
    case "GET_MAJOR_DATA":
      return getMajorData(state, action);
    case "CREATE_MAJOR_DATA":
      return createMajorData(state, action);
    case "DEL_MAJOR_DATA":
      return delMajorData(state, action);
    case "DEL_ALL_MAJOR_DATA":
      return delAllMajorData(state, action);
    case "GET_JOB_DATA":
      return getJobData(state, action);
    case "CREATE_JOB_DATA":
      return createJobData(state, action);
    case "DEL_JOB_DATA":
      return delJobData(state, action);
    case "DEL_ALL_JOB_DATA":
      return delAllJobData(state, action);
    case "GET_INDUSTRY_DATA":
      return getIndustryData(state, action);
    case "CREATE_INDUSTRY_DATA":
      return createIndustryData(state, action);
    case "DEL_INDUSTRY_DATA":
      console.log(action)
      return delIndustryData(state, action);
    case "DEL_ALL_INDUSTRY_DATA":
      return delAllIndustryData(state, action);
    default:
      return state;
  }
};
