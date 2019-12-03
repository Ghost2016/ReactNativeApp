import { otherUserInfoModel } from "../types";
import { NULL_OTHERUSERINFO } from "../nullObjects";
import {
  ADD_WATCH,
  CANCEL_WATCH,
} from '../actionConstants';
export default (
  state: otherUserInfoModel = NULL_OTHERUSERINFO,
  action = {}
) => {
  switch (action.type) {
    case "GETOTHERUSERINFO":
      return action.json;
    case "CLEAROTHERUSERINFO":
      return NULL_OTHERUSERINFO;
    case CANCEL_WATCH:
      if(state.id === action.id) {
        return Object.assign(
          {}, state, {
            watch_info : {
              ...state.watch_info,
              // 根据原来的状态进行改变
              related: state.watch_info.related === 'watched' ? '' : 'fans'
            }
          }
        )
      }
      return state;
    case ADD_WATCH:
      if(state.id === action.id) {
        return Object.assign(
          {}, state, {
            watch_info : {
              ...state.watch_info,
              // 根据原来的状态进行改变
              related: state.watch_info.related === '' ? 'watched' : 'watched_fans'
            }
          }
        )
      }
      return state;
    default:
      return state;
  }
};
