/* @flow */
import { PureComponent } from "react";

// import type { Actions, ChildrenArray } from '../types';
import connectWithActions from "../connectWithActions";
// import { getSession } from '../directSelectors';

// type Props = {
//   needsInitialFetch: boolean,
//   actions: Actions,
//   children?: ChildrenArray<*>,
// };

class AppDataFetcher extends PureComponent {
  //   props: Props;

  componentDidUpdate = () => {
    // const { actions, needsInitialFetch } = this.props;
    // if (needsInitialFetch) {
    //   actions.doInitialFetch();
    // }
  };

  render() {
    return this.props.children;
  }
}

export default connectWithActions(state => ({
  //   needsInitialFetch: getSession(state).needsInitialFetch,
}))(AppDataFetcher);
