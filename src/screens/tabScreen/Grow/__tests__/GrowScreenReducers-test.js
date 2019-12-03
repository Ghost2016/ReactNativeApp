/* @flow */
import deepFreeze from 'deep-freeze';
import {
    NULL_PUNCHTYPELIST,
    NULL_PUNCHLIST,
    NULL_USERJOBPLANLIST,
    NULL_SKILLLIST,
    NULL_COURSELIST,
    NULL_CERTLIST,
    NULL_PAGE_RESULTS,
    NULL_JOBPLANINDUSTRY,
    NULL_JOBPLANPOSITION,
    NULL_PUNCHSTATEWEEK,
  } from "@src/nullObjects";
/* import {
  REALM_ADD,
  ACCOUNT_SWITCH,
  LOGIN_SUCCESS,
  LOGOUT,
  ACCOUNT_REMOVE,
} from '../../actionConstants'; */
import { skillCourseList } from '../GrowScreenReducers';

//./node_modules/jest/bin/jest.js ./src/screens/tabScreen/Grow/__tests__/GrowScreenReducers-test.js

const SKILLCOURSELIST = "SKILLCOURSELIST";

describe('growReducers', () => {
  describe('SKILLCOURSELIST', () => {
    test('职业技能课程更新是否成功', () => {
      const prevState = deepFreeze(NULL_COURSELIST);

      const action = deepFreeze({
        type: SKILLCOURSELIST,
        name: "职场沟通能力提升", //data.type,
        json: {
            count: 1, current_page: 1, per_page: 50, total_page: 1,
            results:[
                {
                    id:3,
                    image:null,
                    is_punch:true,
                    title:"创造性思维提升",
                    url:null,
                }
            ],
        }
      });

      const expectedState = {
        职场沟通能力提升: {
            count: 1, current_page: 1, per_page: 50, total_page: 1,
            results:[
                {
                    id:3,
                    image:null,
                    is_punch:true,
                    title:"创造性思维提升",
                    url:null,
                }
            ],
        }
    };

      const newState = skillCourseList(prevState, action);

      expect(newState).toEqual(expectedState);
      expect(newState).not.toBe(prevState);
    });
  })
})

