import { Children, Component } from "react";
import PropTypes from "prop-types";
import config from "../config";
import io from "socket.io-client";

// let socket = io(config.socketServer, {
//   transports: ["websocket"]
// });
// socket.on("connect", res => {
//   console.warn("connect succ");
// });
export default class SocketProvider extends Component {
  constructor(props, context) {
    super(props, context);
    this.socket = null;
  }
  getChildContext() {
    return {
      socket: this.socket
    };
  }
  render() {
    return Children.only(this.props.children);
  }
}

SocketProvider.propTypes = {
  // socket: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
};

SocketProvider.childContextTypes = {
  socket: PropTypes.object.isRequired
};
