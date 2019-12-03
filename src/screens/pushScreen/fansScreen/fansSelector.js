/* @flow */
// import type { Selector } from 'reselect';
import { createSelector } from 'reselect';

import type { Account, GlobalState } from '../types';
import fans from './fansReducer';


export const getFans = createSelector(
  fans,
  fans => parseUserList(fans, {
    withExtraInfo: false,
    withRankNumber: false,
    withFollow: true
  })
);

