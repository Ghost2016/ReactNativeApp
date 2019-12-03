import { CIRCLE_FETCH_START } from "../actionConstants";

export default (state = {}, action = {}) => {
  switch (action.type) {
    case CIRCLE_FETCH_START:
      // return state;
      break;
    default:
      return state;
  }
};
