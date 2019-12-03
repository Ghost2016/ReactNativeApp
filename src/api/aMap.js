import config from "../config";
import { apiFetchOther } from "./apiFetch";
import store from "../boot/store";
import * as HOSTS from "@src/host";

export const getAddressInfo = async (params: object, callBack: () => {}) => {
  const { latitude, longitude } = params;
  return apiFetchOther(
    `http://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${
      config.aMapWebKey
    }`,
    callBack,
    params,
    "GET"
  );
};

export const getSchoolPoiInfo = async (params: object, callBack: () => {}) => {
  const { city, keywords } = params;
  return apiFetchOther(
    `http://restapi.amap.com/v3/place/text?key=${config.aMapWebKey}&keywords=${
      keywords ? keywords : ""
    }&types=高等院校&city=${
      city ? city : ""
    }&children=1&offset=4&page=1&extensions=all`,
    callBack,
    params,
    "GET"
  );
};

export const getCenterPoiInfo = async (params: object, callBack: () => {}) => {
  console.log(store.getState().location.latitude);
  return apiFetchOther(
    `https://restapi.amap.com/v3/place/around?key=${
      config.aMapWebKey
    }&location=${(store.getState().location.longitude
      ? store.getState().location.longitude
      : 0) +
      "," +
      (store.getState().location.latitude
        ? store.getState().location.latitude
        : 0)}&radius=10000&offset=50`,
    callBack,
    params,
    "GET"
  );
};

export const getAppVersion = async (params: object, callBack: () => {}) => {
  return apiFetchOther(
    `${HOSTS.SHARE}/images/version.json`,
    callBack,
    params,
    "GET"
  );
};