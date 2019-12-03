import { Children, Component } from "react";
import PropTypes from "prop-types";
import navEvent from './NavEvent';
export default class NavProvider extends Component {
  constructor(props, context) {
    super(props, context);
    this.navigator = props.navigator;
    this._refs = props.refs;
  }

  getChildContext() {
    return {
      navigator: this.navigator,
      refs: this._refs,
      navigatorEvent: navEvent || {},
      otherId: 0,
    };
  }
  render() {
    return Children.only(this.props.children);
  }
}

NavProvider.propTypes = {
  navigator: PropTypes.object.isRequired,
  refs: PropTypes.object.isRequired,
  // navigatorEvent: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
};

NavProvider.childContextTypes = {
  navigator: PropTypes.object.isRequired,
  refs: PropTypes.object.isRequired,
  navigatorEvent: PropTypes.object.isRequired,
  otherId: PropTypes.number.isRequired,
};
