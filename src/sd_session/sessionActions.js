import {
  INIT_SAFE_AREA_INSETS,
  SET_STATUS_BAR_BACKGROUND_COLOR
} from '../actionConstants';

export const initSafeAreaInsets = (
  params: object
) => async (dispatch, getState) => {
  dispatch({
    type: INIT_SAFE_AREA_INSETS,
    safeAreaInsets: params.safeAreaInsets
  })
};

export const setStatusBarBackgroundColor = (
  params: object
) => async (dispatch, getState) => {
  dispatch({
    type: SET_STATUS_BAR_BACKGROUND_COLOR,
    statusBarBackgroundColor: params.statusBarBackgroundColor
  })
};
