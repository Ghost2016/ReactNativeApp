/* @flow */
// import type { Auth, Topic } from '../types';
import { apiFetch } from "./apiFetch";
import { testVersion } from 'react-native-dotenv'

export const getArea = (params: object, callBack: () => {}) => {
    return apiFetch(`/v1/area/`, callBack, params, "GET", testVersion);
};