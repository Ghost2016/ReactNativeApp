import { AREA_FETCH_START } from "../../actionConstants";

const initState = {};
export default (state = initState, action = {}) => {
  switch (action.type) {
    case AREA_FETCH_START:
      // return state;
      break;
    default:
      return state;
  }
};
