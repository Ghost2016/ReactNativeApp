/* @noflow */
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// import type { Dispatch, MapStateToProps } from './types';
import * as actions from "./boot/actions";
// import { isStateGoingBack } from './utils/misc';

let cachedBoundActions;

const boundActions = (dispatch, ownProps) => {
  if (!cachedBoundActions) {
    cachedBoundActions = {
      dispatch,
      actions: bindActionCreators(actions, dispatch)
    };
  }

  return cachedBoundActions;
};

const connectWithActions = (
  mapStateToProps,
  mergeProps,
  options
) => component =>
  connect(
    mapStateToProps,
    boundActions,
    mergeProps,
    options
  )(component);

export const connectWithActionsPreserveOnBack = mapStateToProps =>
  connectWithActions(mapStateToProps, null, { areStatesEqual: false });

export default connectWithActions;
