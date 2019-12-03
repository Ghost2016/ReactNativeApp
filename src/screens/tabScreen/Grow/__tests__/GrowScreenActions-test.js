/* @flow */
import deepFreeze from 'deep-freeze';

import { getSkillCourseListAction } from '../GrowScreenActions';
//import { NULL_ACCOUNT } from '../../nullObjects';


//./node_modules/jest/bin/jest.js ./src/screens/tabScreen/Grow/__tests__/GrowScreenActions-test.js

test('getSkillCourseListAction', async () => {
  //const accounts = deepFreeze([]);

  const result = await getSkillCourseListAction({
        page: 1, //this.props.userBaseInfo.id,
        size: 50, //this.props.skillList.results.length
        skill_id: 1,
  });
  console.log("result", result)
  expect(result).toBe({});
});

