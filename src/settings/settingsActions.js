import { SETTINGS_CHANGE } from "../actionConstants";
import { resetPassword } from "@api/index";
import { Toast } from "antd-mobile";
import { toastErr } from "@utils/funcs";

export const resetPasswordAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return resetPassword(params, res => {
    if (res.status === "ok") {
      callBack(res);
    } else {
      toastErr(Toast, res);
    }
  });
};

export const settingsChange = (key, value) => ({
  type: SETTINGS_CHANGE,
  key,
  value
});
