/* @flow */
// import type { Auth, Topic } from '../types';
import { apiGet } from "./apiFetch";

export default async (userId: number) => {
  return apiGet(`users/me/${userId}/topics`, res => res);
};
