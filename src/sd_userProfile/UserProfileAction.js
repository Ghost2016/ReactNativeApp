import { updateBaseInfo } from "@api/index";
import { Toast } from "antd-mobile";

//统一修改用户信息
export const updateUserProfileAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  updateBaseInfo(params, res => {
    if (res.status === "ok") {
      callBack(res);
      dispatch({
        type: "UPDATE_USER_INFO",
        json: res.results
      })
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};
