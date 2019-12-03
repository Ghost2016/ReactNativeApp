

// export const reducer = {
//     ...systemReducer,   // 系统设置模块
// };
import {
    routerReducer as routing,
} from 'react-router-redux'
import {
    combineReducers,
} from 'redux';

import * as newsReducer from './news.js';

const rootReducer = combineReducers({
    routing,
    config: (state = {}) => state,
    ...newsReducer,
});

export default rootReducer;