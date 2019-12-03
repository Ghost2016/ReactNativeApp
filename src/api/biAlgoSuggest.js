/* @flow */
// import type { Auth, Topic } from '../types';
import { apiFetch } from "./apiFetch";

export default async (params: object, callBack: () => {}) => {
  return apiFetch(`shandu-algo/suggest/`, callBack, params);
};
