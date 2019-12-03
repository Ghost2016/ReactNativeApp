
import {
    logShareLive,
    logShareNews,
  } from "@api/index";
  import { Toast } from "antd-mobile";
  import { _apiAction, _apiActionAwait } from "@utils/funcs";

  export const logShareLiveAction = (params: object, callBack: () => void) =>
  _apiAction(logShareLive, params, callBack);

  export const logShareNewsAction = (params: object, callBack: () => void) =>
  _apiAction(logShareNews, params, callBack);

