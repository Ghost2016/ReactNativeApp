/* @flow */
// import type { Auth, Topic } from '../types';
import { apiFetch } from "./apiFetch";

export const goalList = async (params: object, callBack: () => void) => {
  return apiFetch(`/v1/profession/get_position/`, callBack, params, "GET");
};
