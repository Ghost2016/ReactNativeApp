import { searchUser } from "../../../api";

export const searchUserAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await searchUser(params, res => {
    callBack && callBack instanceof Function && callBack(res);
  });
};
