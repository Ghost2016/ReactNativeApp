import React, { PureComponent } from "react";
import { Provider } from "react-redux";

// import type { ChildrenArray } from '../types';
import store from "./store";
import timing from "../utils/timing";

// type Props = {
//   children: ChildrenArray<*>,
// };

export default class StoreHydrator extends PureComponent {
  componentDidMount() {
    // debugger;
    // timing.start('Store hydration');
    // restore(() => {
    //   timing.end('Store hydration');
    // });
    // console.log(this.props)
  }

  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}
