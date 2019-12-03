import Immutable from 'immutable';
import {
} from '../action/news';

// 当前用于查询的角色用户信息
// export const currRoleUserList = (state = [], action = {}) => {
//     switch(action.type) {
//         case GET_APPROVE_USER_LIST_DATA:
//             action.success ? action.success(action.json) : null;
//             return action.json.result.items;
//         default:
//             return state;
//     }
// }