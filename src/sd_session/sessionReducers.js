// @Flow

import type { SessionState } from '../types';
import {
  INIT_SAFE_AREA_INSETS,
  SET_STATUS_BAR_BACKGROUND_COLOR
} from '../actionConstants';

const initialState: SessionState = {
  safeAreaInsets: {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  statusBarBackgroundColor: 'transparent'
};
const initSafeAreaInsets = (
  state: SessionState,
  action
): SessionState => ({
  ...state,
  safeAreaInsets: action.safeAreaInsets,
});

const setStatusBarBackbroundColor = (state: SessionState,
  action
): SessionState => ({
  ...state,
  statusBarBackgroundColor: action.statusBarBackgroundColor,
})

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_SAFE_AREA_INSETS:
      return initSafeAreaInsets(state, action);
    case SET_STATUS_BAR_BACKGROUND_COLOR:
      return setStatusBarBackbroundColor(state, action);
    default:
      return state;
  }
};