/* @flow */
import deepFreeze from 'deep-freeze';
import { getSkillCourseTaskList } from '../GrowScreenSelecters';
//import { NULL_ACCOUNT } from '../../../nullObjects';

//./node_modules/jest/bin/jest.js ./src/screens/tabScreen/Grow/__tests__/GrowScreenSelecters-test.js

test('getSkillCourseTaskList default', () => {
    const state = deepFreeze({
        skillCourseList:{},
        punchList:{},
        getSkillCourseTaskList: [],
    });
    const list = getSkillCourseTaskList(state);
    expect(list).toEqual({});
  });

test('getSkillCourseTaskList has list', () => {
  const state = deepFreeze({
    skillCourseList:{
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
    },
    punchSkillList:{
        common: [{
            created_time:"2018-08-01T02:03:31.048012",
            description:null,
            end_time:null,
            finish_time:"2018-08-01T02:03:31.044949",
            id:80,
            is_remind:false,
            is_system:true,
            profession_id:null,
            skill_course_id:3,
            start_time:null,
            status:"done",
            task:{title: "技能任务", description: ""},
            title:"创造性思维提升",
            type:"common",
            up_power:0,
        }]
    },
    getSkillCourseTaskList: [],
  });

  const list = getSkillCourseTaskList(state);
  //console.log("list==", list['职场沟通能力提升'].results)
  expect(list['职场沟通能力提升'].results[0].is_check).toEqual(true);
});
