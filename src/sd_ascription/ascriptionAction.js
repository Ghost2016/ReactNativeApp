// /* @flow */
// import type { GetState, Dispatch, Narrow, Topic, InitTopicsAction } from '../types';
import { getTopics } from "../api";
// import { INIT_TOPICS } from '../actionConstants';
// import { NULL_STREAM } from '../nullObjects';
// import { isStreamNarrow } from '../utils/narrow';
// import { getAuth, getStreams } from '../selectors';

interface Topic {
  schoolName: string;
  schoolLevel: string;
  major: string;
}
interface InitTopicsAction {
  type: string;
  topics: Topic;
}

const INIT_TOPICS = "INIT_TOPICS";

const initTopics = (topics: Topic): InitTopicsAction => ({
  type: INIT_TOPICS,
  topics
});

export const fetchTopics = (userId: number) => async (dispatch, getState) => {
  //   const auth = getAuth(getState());
  const topics = await getTopics(userId);

  dispatch(initTopics(topics));
};

// export const fetchTopicsForActiveStream = (narrow: Narrow) => async (
//   dispatch: Dispatch,
//   getState: GetState,
// ) => {
//   const state = getState();

//   if (!isStreamNarrow(narrow)) {
//     return;
//   }

//   const streams = getStreams(state);
//   const stream = streams.find(sub => narrow[0].operand === sub.name) || NULL_STREAM;

//   dispatch(fetchTopics(stream.stream_id));
// };
