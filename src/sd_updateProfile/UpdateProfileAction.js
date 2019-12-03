import { updateNickname } from "@api/index";
import { Toast } from "antd-mobile";

//更改昵称
export const updateNicknameAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await updateNickname(params, res => {
    console.log("updateNicknameAction res", res);
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};
